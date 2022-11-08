import { Injectable, Logger } from '@nestjs/common';
import { groupBy, orderBy } from 'lodash/fp';
import { NormalizedNftData, Token } from '../../types';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { RawAxiosRequestHeaders } from 'axios';
import {
  X2Y2OffersRequestResult,
  X2Y2ListingsRequestResult,
} from '../../bullmq/types';
import axiosThrottle from 'axios-request-throttle';

@Injectable()
export class X2y2Service {
  logger = new Logger(X2y2Service.name);
  headers: RawAxiosRequestHeaders;
  endpoint: string;

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    axiosThrottle.use(httpService.axiosRef, { requestsPerSecond: 4 });

    this.headers = {
      'X-API-Key': configService.getOrThrow('X2Y2_API_KEY'),
      accept: 'application/json',
    };

    this.endpoint = configService.getOrThrow<string>('X2Y2_API');
  }

  async fetchNormalizedTokenData(tokens: Token[]) {
    const data = await this.fetchTokenData(tokens);
    return normalizeData(data);
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

    return groups.fulfilled?.map(
      (result) => (result as PromiseFulfilledResult<unknown>).value,
    );
  }

  fetchIndividualTokenData = async (token: Token) => {
    const price = await this.fetchPrice(token);
    const offers = await this.fetchOffer(token);
    return {
      price,
      offers,
    };
  };

  async fetchPrice(token: Token): Promise<X2Y2ListingsRequestResult['data']> {
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

    this.logger.log('Data Received: Fetch Price', {
      token,
      data: orderBy(['created_at'], ['desc'], result.data.data),
    });

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
        },
        headers: this.headers,
      },
    );

    this.logger.log('Data Received: Fetch Offers', {
      token,
      data: result.data,
    });

    return result.data.data;
  };
}

function normalizeData(data: any): NormalizedNftData[] {
  return [];
}
