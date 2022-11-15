import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NFT } from '@prisma/client';
import * as hash from 'object-hash';
import { Cache } from 'cache-manager';
import { Alchemy } from '../../types';

@Injectable()
export class AlchemyService {
  logger = new Logger(AlchemyService.name);

  baseUrl: string;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    const apiKey = this.configService.getOrThrow('ALCHEMY_API_KEY_ETH');
    this.baseUrl = `https://eth-mainnet.g.alchemy.com/nft/v2/${apiKey}`;
  }

  async getNFTMetadataBatch(
    tokens: Pick<NFT, 'contractAddress' | 'tokenId'>[],
  ): Promise<Alchemy.NftMetadata[] | void> {
    const path = '/getNFTMetadataBatch';
    const options = {
      method: 'POST',
      url: this.baseUrl + path,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      data: {
        tokens,
      },
    };

    const key = hash(tokens);

    const value: Alchemy.NftMetadata[] | void = await this.cacheManager.get(
      key,
    );

    if (value) {
      return value;
    }

    console.log('Fetching token metadata from Alchemy', tokens);

    const data = await this.httpService.axiosRef
      .request<Alchemy.NftMetadata[]>(options)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.error(error);
      });

    await this.cacheManager.set(key, data, 1000 * 60 * 60);

    return data;
  }
}
