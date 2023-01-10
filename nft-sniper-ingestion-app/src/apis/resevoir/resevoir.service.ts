import * as axiosRateLimit from 'axios-rate-limit';
import { AxiosInstance } from 'axios';
import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { HttpService } from '@nestjs/axios';
import { RedisCache } from '@tirke/node-cache-manager-ioredis';
import { Token } from '../../types';
import { paths } from '@reservoir0x/reservoir-kit-client';

@Injectable()
export class ResevoirService {
  logger = new Logger(ResevoirService.name);

  baseUrl = 'https://api.reservoir.tools';

  // Make static to force rate limiting
  static http: HttpService['axiosRef'];

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: RedisCache,
    private readonly config: ConfigService,
  ) {
    this.setAxiosInstanceWithRateLimit();

    ResevoirService.http.interceptors.request.use((request) => {
      this.logger.log('Starting Request', JSON.stringify(request, null, 2));
      return request;
    });
  }

  setAxiosInstanceWithRateLimit() {
    if (!ResevoirService.http) {
      const axiosInstance = this.httpService.axiosRef;
      this.setAxiosHeaders(axiosInstance);

      // @ts-expect-error Broken typings
      ResevoirService.http = axiosRateLimit(axiosInstance, {
        maxRPS: this.config.envVars.RESEVOIR_RATE_LIMIT_MAX_RPS,
      }) as HttpService['axiosRef'];
    }
  }

  setAxiosHeaders(axiosInstance: AxiosInstance) {
    axiosInstance.defaults.headers.common['accept'] = '*/*';
    axiosInstance.defaults.headers.common['x-api-key'] =
      this.config.envVars.RESEVOIR_API_KEY;
  }

  async fetchAggregateNftData(tokens: Token[]) {
    const lowestListings = await this.fetchLowestListings(tokens);
    const highestBids = await this.fetchHighestBids(tokens);
    const lastSales = await this.fetchLastSales(tokens);
    const currentOwners = await this.fetchCurrentOwners(tokens);
    const metadata = await this.fetchMetadataForTokens(tokens);

    return tokens.map((token) => {
      const tokenKey = buildTokenKey(token);
      return {
        ...token,
        lowestListing: lowestListings[tokenKey],
        highestBid: highestBids[tokenKey],
        lastSale: lastSales[tokenKey],
        currentOwner: currentOwners[tokenKey],
        metadata: metadata[tokenKey],
      };
    });
  }

  // Owner
  private async fetchCurrentOwners(tokens: Token[]) {
    const ownersByToken: Record<
      string,
      Awaited<ReturnType<typeof this.fetchCurrentOwner>>
    > = {};

    for (const token of tokens) {
      const tokenKey = buildTokenKey(token);
      const owners = await this.fetchCurrentOwner(token);

      ownersByToken[tokenKey] = owners;
    }

    return ownersByToken;
  }

  private async fetchCurrentOwner(
    token: Token,
  ): Promise<paths['/owners/v1']['get']['responses']['200']['schema']> {
    const resevoirToken = buildTokenKey(token);
    const url = this.baseUrl + '/owners/v1';

    const makeCall = () =>
      ResevoirService.http
        .get(url, {
          params: {
            token: resevoirToken,
            limit: '1',
          },
        })
        .then((response) => {
          const { data } = response;
          this.logger.log('Received token owner', { token, data });
          return data;
        });

    const key = JSON.stringify({
      resevoirToken,
      url,
    });

    return this.callAndCacheAndSleep(key, makeCall);
  }

  // Sales
  private async fetchLastSales(tokens: Token[]) {
    const highestBidsByToken: Record<
      string,
      Required<Awaited<ReturnType<typeof this.fetchLastSale>>>['sales'][0]
    > = {};

    for (const token of tokens) {
      const tokenKey = buildTokenKey(token);
      const listings = ((await this.fetchLastSale(token))?.sales || [])[0];
      highestBidsByToken[tokenKey] = listings;
    }

    return highestBidsByToken;
  }

  private async fetchLastSale(token: Token) {
    const resevoirToken = buildTokenKey(token);
    const url = this.baseUrl + '/sales/v4';

    const makeCall = async () =>
      ResevoirService.http
        .get<paths['/sales/v4']['get']['responses']['200']['schema']>(url, {
          params: {
            token: resevoirToken,
            includeMetadata: 'false',
            limit: '1',
          },
        })
        .then((response) => {
          const { data } = response;
          this.logger.log('Token sales data', { token, data });
          return data;
        });

    const key = JSON.stringify({
      resevoirToken,
      url,
    });

    return this.callAndCacheAndSleep(key, makeCall);
  }

  // BIDS / OFFERS
  async fetchHighestBids(tokens: Token[]) {
    const highestBidsByToken: Record<
      string,
      Required<
        Awaited<ReturnType<typeof this.fetchListingsForToken>>
      >['orders'][0]
    > = {};

    for (const token of tokens) {
      const tokenKey = buildTokenKey(token);
      const listings = ((await this.fetchBidsForToken(token))?.orders || [])[0];
      highestBidsByToken[tokenKey] = listings;
    }

    return highestBidsByToken;
  }

  async fetchBidsForTokens(tokens: Token[]) {
    const bidByToken: Record<
      string,
      | Required<
          Awaited<ReturnType<typeof this.fetchListingsForToken>>
        >['orders']
      | undefined
    > = {};

    for (const token of tokens) {
      const tokenKey = buildTokenKey(token);
      const bids = (await this.fetchBidsForToken(token))?.orders;
      bidByToken[tokenKey] = bids;
    }

    return bidByToken;
  }

  async fetchMetadataForTokens(tokens: Token[]) {
    const allmeta = await this.fetchMetadata(tokens);

    return tokens.reduce((acc, token) => {
      const tokenKey = buildTokenKey(token);
      const meta = allmeta.tokens?.find((_meta) => {
        const collectionId = _meta.token?.collection?.id;
        const tokenId = _meta.token?.tokenId;
        const key = `${collectionId}:${tokenId}`;

        return tokenKey.toLowerCase() === key.toLowerCase();
      });

      acc[tokenKey] = meta?.token;

      return acc;
    }, {} as Record<string, Required<Awaited<ReturnType<typeof this.fetchMetadata>>>['tokens'][0]['token'] | undefined>);
  }

  private async fetchMetadata(
    tokens: Token[],
  ): Promise<paths['/tokens/v5']['get']['responses']['200']['schema']> {
    const resevoirTokens = tokens.map(buildTokenKey);

    const url = this.baseUrl + '/tokens/v5';

    const makeCall = () =>
      ResevoirService.http
        .get<paths['/tokens/v5']['get']['responses']['200']['schema']>(url, {
          params: {
            tokens: resevoirTokens,
            includeAttributes: true,
            includeTopBid: true,
            includeDynamicPricing: true,
            limit: '100',
          },
        })
        .then((response) => {
          const { data } = response;
          this.logger.log('Received metadata for tokens', { data });
          return data;
        });

    const key = JSON.stringify({
      resevoirTokens,
      url,
    });

    return this.callAndCacheAndSleep<
      paths['/tokens/v5']['get']['responses']['200']['schema']
    >(key, makeCall);
  }

  // PRIVATE

  private async fetchBidsForToken(
    token: Token,
  ): Promise<paths['/orders/bids/v5']['get']['responses']['200']['schema']> {
    const resevoirToken = buildTokenKey(token);
    const url = this.baseUrl + '/orders/bids/v5';

    const makeCall = () =>
      ResevoirService.http
        .get(url, {
          params: {
            token: resevoirToken,
            includeMetadata: 'false',
            includeRawData: 'false',
            normalizeRoyalties: 'false',
            sortBy: 'price',
            limit: '10',
          },
        })
        .then((response) => {
          const { data } = response;
          this.logger.log('Received token bids', { token, data });
          return data;
        });

    const key = JSON.stringify({
      resevoirToken,
      url,
    });

    return this.callAndCacheAndSleep(key, makeCall);
  }

  // LISTINGS
  async fetchLowestListings(tokens: Token[]) {
    const lowestListingByToken: Record<
      string,
      | Required<
          Awaited<ReturnType<typeof this.fetchListingsForToken>>
        >['orders'][0]
      | undefined
    > = {};

    for (const token of tokens) {
      const tokenKey = buildTokenKey(token);
      const listings = ((await this.fetchListingsForToken(token))?.orders ||
        [])[0];
      lowestListingByToken[tokenKey] = listings;
    }

    return lowestListingByToken;
  }

  async fetchListingsForTokens(tokens: Token[]) {
    const listingsByTokenKey: Record<
      string,
      Awaited<ReturnType<typeof this.fetchListingsForToken>>['orders']
    > = {};

    for (const token of tokens) {
      const tokenKey = buildTokenKey(token);
      const listings = (await this.fetchListingsForToken(token))?.orders;
      listingsByTokenKey[tokenKey] = listings;
    }

    return listingsByTokenKey;
  }

  private async fetchListingsForToken(token: Token) {
    const resevoirToken = buildTokenKey(token);
    const url = this.baseUrl + '/orders/asks/v4';
    const params = {
      token: resevoirToken,
      includePrivate: 'false',
      includeMetadata: 'false',
      includeRawData: 'false',
      normalizeRoyalties: 'false',
      sortBy: 'price',
      limit: '1',
    };

    const makeCall = () =>
      ResevoirService.http
        .get<paths['/orders/asks/v4']['get']['responses']['200']['schema']>(
          url,
          { params },
        )
        .then((response) => {
          const { data } = response;
          this.logger.log('Received token listings', { token, data });
          return data;
        });

    const key = JSON.stringify({
      resevoirToken,
      url,
    });

    return this.callAndCacheAndSleep(key, makeCall);
  }

  /**
   * Cache results of fetchFn and immediately return the cached
   * results if they exist.
   */
  private async callAndCacheAndSleep<T>(
    key: string,
    fetchFn: () => Promise<T>,
  ) {
    const value = await this.cacheManager.get<T>(key);

    // If no value, must wait for data
    if (!value) {
      const data = await fetchFn().catch((e) => {
        this.logger.error(e);
        throw e;
      });

      await this.cacheData(key, data);
      return data;
    }

    // If value, but should refetch -- fetch async but return value sync
    if (await this.shouldRefetchKey(key)) {
      const data = await fetchFn().catch((e) => {
        this.logger.error(e);
        throw e;
      });

      await this.cacheData(key, data);

      return data;
    }

    // Return value sync
    return value;
  }

  async cacheData(key: string, data: unknown) {
    await this.cacheManager.set(key, data, 0);
    const createdAtKey = this.getCreatedAtKey(key);
    console.log(createdAtKey);
    await this.cacheManager.set(createdAtKey, Date.now());
  }

  static KEY_RETENTION_MS = 60000;
  private async shouldRefetchKey(key: string) {
    const lastUpdated = await this.getLastUpdatedAtForKey(key);

    if (!lastUpdated) return true;

    const timeInMillisecondsSinceLastSave = Date.now() - lastUpdated;

    return timeInMillisecondsSinceLastSave > ResevoirService.KEY_RETENTION_MS;
  }

  private async getLastUpdatedAtForKey(key: string) {
    const createdAtKey = this.getCreatedAtKey(key);
    const timeInSecondsSinceLastSave = await this.cacheManager.get(
      createdAtKey,
    );
    return timeInSecondsSinceLastSave as number | void;
  }

  static CREATED_AT_KEY = 'CREATED_AT';
  private getCreatedAtKey(key: string) {
    return `${key}:${ResevoirService.CREATED_AT_KEY}`;
  }
}

function buildTokenKey(token: Token) {
  return `${token.contractAddress}:${token.tokenId}`;
}
