import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Token } from '../../types';
import { paths } from '@reservoir0x/reservoir-kit-client';
@Injectable()
export class ResevoirService {
  logger = new Logger(ResevoirService.name);

  baseUrl = 'https://api.reservoir.tools';

  http = this.httpService.axiosRef;

  constructor(private readonly httpService: HttpService) {
    this.httpService.axiosRef.interceptors.request.use((request) => {
      this.logger.log('Starting Request', JSON.stringify(request, null, 2));
      return request;
    });
  }

  async fetchAggregateNftData(tokens: Token[]) {
    const lowestListings = await this.fetchLowestListings(tokens);
    const highestBids = await this.fetchHighestBids(tokens);
    const lastSales = await this.fetchLastSales(tokens);
    const currentOwners = await this.fetchCurrentOwners(tokens);

    return tokens.map((token) => {
      const tokenKey = buildTokenKey(token);
      return {
        ...token,
        lowestListing: lowestListings[tokenKey],
        highestBid: highestBids[tokenKey],
        lastSale: lastSales[tokenKey],
        currentOwner: currentOwners[tokenKey],
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

    return this.http
      .get(url, {
        headers: { accept: '*/*', 'x-api-key': 'demo-api-key' },
        params: {
          token: resevoirToken,
          limit: '1',
        },
      })
      .then((response) => {
        const { data } = response;
        this.logger.log('Received token owner', { token, data });
        return data;
      })
      .catch((error) => {
        console.error(error);
        this.logger.error(error);
        return [];
      });
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

  private async fetchLastSale(
    token: Token,
  ): Promise<paths['/sales/v4']['get']['responses']['200']['schema']> {
    const resevoirToken = buildTokenKey(token);
    const url = this.baseUrl + '/sales/v4';

    return this.http
      .get(url, {
        headers: { accept: '*/*', 'x-api-key': 'demo-api-key' },
        params: {
          token: resevoirToken,
          includeMetadata: 'false',
          limit: '1',
        },
      })
      .then((response) => {
        const { data } = response;
        this.logger.log('Received token sales', { token, data });
        return data;
      })
      .catch((error) => {
        console.error(error);
        this.logger.error(error);
        return [];
      });
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

  private async fetchBidsForToken(
    token: Token,
  ): Promise<paths['/orders/bids/v4']['get']['responses']['200']['schema']> {
    const resevoirToken = buildTokenKey(token);
    const url = this.baseUrl + '/orders/bids/v4';

    return this.http
      .get(url, {
        headers: { accept: '*/*', 'x-api-key': 'demo-api-key' },
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
      })
      .catch((error) => {
        console.error(error);
        this.logger.error(error);
        return [];
      });
  }

  // LISTINGS
  async fetchLowestListings(tokens: Token[]) {
    const hightestListingsByToken: Record<
      string,
      | Required<
          Awaited<ReturnType<typeof this.fetchListingsForToken>>
        >['orders'][0]
      | undefined
    > = {};

    for (const token of tokens) {
      const tokenKey = buildTokenKey(token);
      const listings = (
        await this.fetchListingsForToken(token)
      )?.orders?.reverse()[0];
      hightestListingsByToken[tokenKey] = listings;
    }

    return hightestListingsByToken;
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

  private async fetchListingsForToken(
    token: Token,
  ): Promise<paths['/orders/asks/v3']['get']['responses']['200']['schema']> {
    const resevoirToken = buildTokenKey(token);
    const url = this.baseUrl + '/orders/asks/v3';

    return this.http
      .get(url, {
        headers: { accept: '*/*', 'x-api-key': 'demo-api-key' },
        params: {
          token: resevoirToken,
          includePrivate: 'false',
          includeMetadata: 'false',
          includeRawData: 'false',
          normalizeRoyalties: 'false',
          sortBy: 'price',
          limit: '50',
        },
      })
      .then((response) => {
        const { data } = response;
        this.logger.log('Received token listings', { token, data });
        return data;
      })
      .catch((error) => {
        this.logger.error(error);
        return [];
      });
  }
}

function buildTokenKey(token: Token) {
  return `${token.contractAddress}:${token.tokenId}`;
}
