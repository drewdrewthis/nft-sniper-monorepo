import { Injectable } from '@nestjs/common';
import { HistoricalNftOffer, HistoricalNftPrice } from '@prisma/client';
import { Alchemy, Token } from './types';
import { ResevoirService } from './apis/resevoir';
import { AlchemyService } from './apis/alchemy/alchemy.service';

@Injectable()
export class AppService {
  constructor(
    private readonly resevoirService: ResevoirService,
    private readonly alchemyService: AlchemyService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getNftDemoData(tokens: Token[]): Promise<
    {
      tokenId: number;
      contractAddress: string;
      offers: HistoricalNftOffer[];
      historicalPrices: HistoricalNftPrice[];
      metadata?: Alchemy.NftMetadata;
    }[]
  > {
    const aggregateData = await this.resevoirService.fetchAggregateNftData(
      tokens,
    );

    const metadata = await this.alchemyService.getNFTMetadataBatch(tokens);

    const allData = await aggregateData.map((data, idx) => {
      return {
        ...data,
        metadata: (metadata || [])[idx],
      };
    });

    return allData as any;
  }
}
