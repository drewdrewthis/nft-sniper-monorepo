import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { HistoricalNftOffer, HistoricalNftPrice } from '@prisma/client';
import { Alchemy, Token } from './types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('demo')
  async getNftDemoData(
    @Query()
    payload: {
      tokens: Token[];
    },
  ): Promise<
    {
      tokenId: number;
      contractAddress: string;
      offers: (HistoricalNftOffer | void)[];
      historicalPrices: (HistoricalNftPrice | void)[];
      metadata?: Alchemy.NftMetadata;
    }[]
  > {
    const { tokens } = payload;
    return this.appService.getNftDemoData(tokens);
  }
}
