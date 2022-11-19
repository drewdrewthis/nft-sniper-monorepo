import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { HistoricalNftOffer, HistoricalNftPrice } from '@prisma/client';
import { Alchemy } from './types';
import { DEMO_NFTS } from '../constants';
import offlineData from './offline/demo/nft-data';

@Controller('api')
export class AppController {
  logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('demo-nft-data')
  async getNftDemoData(): Promise<
    {
      tokenId: number;
      contractAddress: string;
      offers: (HistoricalNftOffer | void)[];
      historicalPrices: (HistoricalNftPrice | void)[];
      metadata?: Alchemy.NftMetadata;
    }[]
  > {
    if (process.env.OFFLINE === 'true') {
      this.logger.log('Returning offline data');
      return offlineData as any;
    }

    return this.appService.getNftDemoData(DEMO_NFTS);
  }
}
