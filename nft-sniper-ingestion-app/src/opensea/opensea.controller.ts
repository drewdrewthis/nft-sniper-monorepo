import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { OpenseaService } from './opensea.service';

@Controller('opensea')
export class OpenseaController {
  logger = new Logger(OpenseaController.name);
  constructor(private readonly service: OpenseaService) {}

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
  receiveCrawlerDump(@Body() data: unknown) {
    this.logger.log('Data received', data);
  }
}
