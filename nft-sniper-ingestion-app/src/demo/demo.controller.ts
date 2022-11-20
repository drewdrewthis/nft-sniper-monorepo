import { Controller, Get, Logger } from '@nestjs/common';
import { HistoricalNftOffer, HistoricalNftPrice } from '@prisma/client';
import { DEMO_NFTS } from '../../constants';
import { Alchemy } from '../types';
import { DemoService } from './demo.service';

@Controller('demo')
export class DemoController {
  logger = new Logger(DemoController.name);

  constructor(private readonly service: DemoService) {}

  @Get('nft-data')
  async getNftDemoData(): Promise<
    {
      tokenId: number;
      contractAddress: string;
      offers: (HistoricalNftOffer | void)[];
      historicalPrices: (HistoricalNftPrice | void)[];
      metadata?: Alchemy.NftMetadata;
    }[]
  > {
    return this.service.getNftDemoData(DEMO_NFTS);
  }
}
