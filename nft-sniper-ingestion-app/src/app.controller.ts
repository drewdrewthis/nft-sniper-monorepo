import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ResevoirService } from './apis/resevoir';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly ResevoirService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('demo')
  async getNftDemoData(
    @Query()
    payload: {
      walletAddress: string;
    },
  ): Promise<
    {
      tokenId: number;
      contractAddress: string;
      offers: HistoricalNftOffer[];
      historicalPrices: HistoricalNftPrice[];
      metadata?: Alchemy.NftMetadata;
    }[]
  > {
    const aggregateData = await this.resevoirService.fetchAggregateNftData();
    console.log('tracled', payload);
    return this.service.getTrackedNftDataForWallet(payload.walletAddress);
  }
}
