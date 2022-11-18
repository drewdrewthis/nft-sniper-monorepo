import { Injectable } from '@nestjs/common';
import { HistoricalNftOffer, HistoricalNftPrice } from '@prisma/client';
import { Alchemy, Token } from './types';
import { ResevoirService } from './apis/resevoir';
import { AlchemyService } from './apis/alchemy/alchemy.service';
import { Marketplace } from './enums';

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
      offers: (HistoricalNftOffer | void)[];
      historicalPrices: (HistoricalNftPrice | void)[];
      metadata?: Alchemy.NftMetadata;
    }[]
  > {
    const aggregateData = await this.resevoirService.fetchAggregateNftData(
      tokens,
    );

    const metadata = await this.alchemyService.getNFTMetadataBatch(tokens);

    return aggregateData.map((data, idx) => {
      return {
        ...data,
        offers: [normalizeOffer(data, data.highestBid)],
        historicalPrices: [normalizePrice(data, data.lowestListing)],
        metadata: (metadata || [])[idx],
      };
    });
  }
}

function normalizePrice(
  token: Token,
  price: Awaited<
    ReturnType<ResevoirService['fetchAggregateNftData']>
  >[0]['lowestListing'],
): HistoricalNftPrice | void {
  if (!price) {
    return;
  }

  return {
    tokenId: token.tokenId,
    contractAddress: token.contractAddress,
    id: -1,
    createdAt: new Date(price.createdAt),
    updatedAt: new Date(price.createdAt),
    actualDate: new Date(price.createdAt),
    priceAmount: String(price?.price?.amount?.native || ''),
    priceCurrency: String(price?.price?.currency?.symbol || ''),
    fiatPrice: String(price?.price?.amount?.usd || ''),
    fiatCurrency: 'USD',
    marketplaceId: priceSourceToMarketPlaceId(price.source || {}),
    rawScrapeDataId: -1,
  };
}

function normalizeOffer(
  token: Token,
  bid:
    | Awaited<
        ReturnType<ResevoirService['fetchAggregateNftData']>
      >[0]['highestBid'],
): HistoricalNftOffer | void {
  if (!bid) {
    return;
  }

  return {
    tokenId: token.tokenId,
    contractAddress: token.contractAddress,
    id: -1,
    createdAt: new Date(bid.createdAt),
    updatedAt: new Date(bid.createdAt),
    actualDate: new Date(bid.createdAt),
    priceAmount: String(bid?.price?.amount?.native || ''),
    priceCurrency: String(bid?.price?.currency?.symbol || ''),
    fiatPrice: String(bid?.price?.amount?.usd || ''),
    fiatCurrency: 'USD',
    marketplaceId: priceSourceToMarketPlaceId(bid.source || {}),
    rawScrapeDataId: -1,
    expiresAt: new Date(bid.expiration),
    from: bid.maker,
  };
}

function priceSourceToMarketPlaceId(source: { [key: string]: unknown }) {
  switch (source.name) {
    case 'LooksRare':
      return Marketplace.LooksRare;
    case 'OpenSea':
      return Marketplace.OpenSea;
    case 'X2Y2':
      return Marketplace.X2Y2;
    case 'Blur':
      return Marketplace.Blur;
    default:
      throw new Error('Unknown marketplace: ' + source.name);
  }
}
