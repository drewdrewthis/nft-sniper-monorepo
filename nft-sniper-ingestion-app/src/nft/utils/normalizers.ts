import { Listing, Offer } from '../types';
import { NFT } from '../types';
import { ResevoirService } from '../../apis/resevoir';
import { Token } from '../../types';

export function normalizeMetadata(
  metadata: Required<
    Awaited<ReturnType<ResevoirService['fetchAggregateNftData']>>
  >[0]['metadata'],
): NFT['metadata'] | void {
  if (!metadata) return;
  if (!metadata.image) return;
  if (!metadata.attributes) return;

  return {
    imageUrl: metadata.image,
    title: metadata?.name || '',
    description: metadata?.description || '',
  };
}

export function normalizePrice(
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

export function normalizeOffer(
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
