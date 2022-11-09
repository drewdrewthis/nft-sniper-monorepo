import { Controller, Get, Query } from '@nestjs/common';
import { HistoricalNftOfferService } from './historical-nft-offer.service';

@Controller('offers')
export class HistoricalNftOfferController {
  constructor(private readonly service: HistoricalNftOfferService) {}

  @Get('/all')
  async getHistoricalPrices(
    @Query()
    options: {
      tokenIds?: string;
      contractAddress?: string;
      limit?: number;
    },
  ) {
    return this.service.getHistoricalOffers({
      ...options,
      tokenIds: options.tokenIds?.split(',').map(Number),
    });
  }

  @Get('/current')
  async getLatestListingPrice(
    @Query()
    options: {},
  ) {
    return this.service.getLastestOffers();
  }
}
