import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { OpenseaService } from './opensea.service';

type CrawlerDumpDto = {
  url: string;
  tokenId: number;
  contractAddress: string;
  marketplaceName: string;
  price: {
    priceAmount: string;
    priceCurrency: string;
    fiatPrice: string;
    fiatCurrency: string;
  };
  offers: {
    from: string;
    priceAmount: string;
    priceCurrency: string;
    fiatPrice: string;
    fiatCurrency: string;
  }[];
  rawJson: Record<string, unknown>;
};

@Controller('opensea')
export class OpenseaController {
  logger = new Logger(OpenseaController.name);
  constructor(
    private readonly service: OpenseaService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('historical-prices')
  async getHistoricalPrices(
    @Query()
    options: {
      tokenIds?: number[];
      contractAddress?: string;
      limit?: number;
    },
  ) {
    return this.service.getHistoricalPrices(options);
  }

  @Post('crawler-dump')
  async receiveCrawlerDump(@Body() data: CrawlerDumpDto) {
    this.logger.log('Data received', data);

    await this.prisma.saveSingleNftData(data);
  }
}
