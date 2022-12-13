import { HistoricalNftOffer, HistoricalNftPrice } from '@prisma/client';
import { Token } from '../types';

export interface NFT extends Token {
  offers: Offer[];
  historicalPrices: Listing[];
  metadata: {
    imageUrl: string;
    title: string;
    description: string;
  };
}

export type NftPayload = NFT[];

export type Listing = Omit<HistoricalNftPrice, 'marketplaceId'> & {
  marketplace: {
    name: string;
    url: string;
  };
};

export type Offer = Omit<HistoricalNftOffer, 'marketplaceId'> & {
  marketplace: {
    name: string;
    url: string;
  };
};
