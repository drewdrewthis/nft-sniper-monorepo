import { HistoricalNftOffer, HistoricalNftPrice } from '@prisma/client';
import { Alchemy } from '../types';

export type DemoNftPayload = {
  tokenId: number;
  contractAddress: string;
  offers: (Offer | void)[];
  historicalPrices: (Listing | void)[];
  metadata?: Alchemy.NftMetadata;
}[];

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
