import { Controller, Get, Query } from '@nestjs/common';
import { HistoricalNftPriceService } from './historical-nft-price.service';

@Controller('historical')
export class HistoricalNftPriceController {
  constructor(private readonly service: HistoricalNftPriceService) {}

  @Get('/nft-prices')
  async getHistoricalPrices(
    @Query()
    options: {
      tokenIds?: string;
      contractAddress?: string;
      limit?: number;
    },
  ) {
    return this.service.getHistoricalPrices({
      ...options,
      tokenIds: options.tokenIds?.split(',').map(Number),
    });
  }
}
