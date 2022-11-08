import { Queue, Worker } from 'bullmq';

export interface Scheduler {
  name: string;
  queue: Queue;
  worker: Worker;
}

export interface NormalizedNftData {
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
  rawJson: {};
}

export interface Token {
  contractAddress: string;
  tokenId: number;
}
