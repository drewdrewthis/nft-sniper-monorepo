import { Controller, Get, Query } from '@nestjs/common';
import { OpenseaService } from './opensea.service';

@Controller('opensea')
export class OpenseaController {
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
}
