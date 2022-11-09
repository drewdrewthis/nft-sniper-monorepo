import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { RawAxiosRequestHeaders } from 'axios';
import { Token } from '../../types';
import {
  X2Y2ListingsRequestResult,
  X2Y2OffersRequestResult,
} from '../../bullmq/types';
import { compact, groupBy } from 'lodash/fp';
import { normalizeData } from './helpers';

@Injectable()
export class X2y2Service {
  logger = new Logger(X2y2Service.name);
  headers: RawAxiosRequestHeaders;
  endpoint: string;

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.headers = {
      'X-API-Key': configService.getOrThrow('X2Y2_API_KEY'),
      accept: 'application/json',
    };

    this.endpoint = configService.getOrThrow<string>('X2Y2_API');
  }

  async fetchNormalizedTokenData(tokens: Token[]) {
    const data = await this.fetchTokenData(tokens);
    return compact(data).map(normalizeData);
  }

  // Helpers

  async fetchTokenData(tokens: Token[]) {
    const results = await Promise.allSettled(
      tokens.map(this.fetchIndividualTokenData),
    );

    const groups = groupBy((result) => {
      return result.status;
    }, results);

    if (groups.rejected) {
      this.logger.warn(
        'Failed to get data for the following: ',
        groups.rejected,
      );
    }

    return results.map((result, idx) => {
      // Unecessary check
      if (result.status === 'fulfilled') {
        return {
          ...tokens[idx],
          ...result.value,
        };
      }
    });
  }

  fetchIndividualTokenData = async (token: Token) => {
    const listings = await this.fetchListings(token).catch((e) => {
      this.logger.error(e);
      return [];
    });

    const offers = await this.fetchOffer(token).catch((e) => {
      this.logger.error(e);
      return [];
    });

    return {
      listings,
      offers,
    };
  };

  async fetchListings(
    token: Token,
  ): Promise<X2Y2ListingsRequestResult['data']> {
    const url = this.endpoint + '/events';

    const result =
      await this.httpService.axiosRef.get<X2Y2ListingsRequestResult>(url, {
        params: {
          type: 'list',
          contract: token.contractAddress,
          token_id: token.tokenId,
        },
        headers: this.headers,
      });

    // this.logger.debug('Data Received: Fetch Listings', {
    //   token,
    //   data: result.data.data,
    // });

    return result.data.data;
  }

  fetchOffer = async (
    token: Token,
  ): Promise<X2Y2OffersRequestResult['data']> => {
    const url = this.endpoint + '/offers';
    const result = await this.httpService.axiosRef.get<X2Y2OffersRequestResult>(
      url,
      {
        params: {
          contract: token.contractAddress,
          token_id: token.tokenId,
          sort: 'price',
        },
        headers: this.headers,
      },
    );

    // this.logger.debug('Data Received: Fetch Offers', {
    //   token,
    //   data: result.data,
    // });

    return result.data.data;
  };
}
