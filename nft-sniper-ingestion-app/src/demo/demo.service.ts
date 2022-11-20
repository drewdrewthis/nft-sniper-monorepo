import { Injectable } from '@nestjs/common';
import { Token } from '../types';
import { ResevoirService } from '../apis/resevoir';
import { AlchemyService } from '../apis/alchemy/alchemy.service';
import { Marketplace } from '../enums';
import { DemoNftPayload, Listing, Offer } from './types';

@Injectable()
export class DemoService {
  constructor(
    private readonly resevoirService: ResevoirService,
    private readonly alchemyService: AlchemyService,
  ) {}

  async getNftDemoData(tokens: Token[]): Promise<DemoNftPayload> {
    const aggregateData = await this.resevoirService.fetchAggregateNftData(
      tokens,
    );

    const metadata = await this.alchemyService.getNFTMetadataBatch(tokens);

    return aggregateData.map((data, idx) => {
      return {
        ...data,
        offers: data.highestBid ? [normalizeOffer(data, data.highestBid)] : [],
        historicalPrices: data.lowestListing
          ? [normalizePrice(data, data.lowestListing)]
          : [],
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
): Listing | void {
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
    marketplace: {
      name: price?.source?.name as string,
      url: price?.source?.url as string,
    },
    rawScrapeDataId: -1,
  };
}

function normalizeOffer(
  token: Token,
  bid:
    | Awaited<
        ReturnType<ResevoirService['fetchAggregateNftData']>
      >[0]['highestBid'],
): Offer | void {
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
    marketplace: {
      name: bid?.source?.name as string,
      url: bid?.source?.url as string,
    },
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
    case 'sudoswap':
      return Marketplace.SudoSwap;
    case 'nft.mm':
      return Marketplace.MadMeerkat;
    default:
      throw new Error('Unknown marketplace: ' + source);
  }
}
