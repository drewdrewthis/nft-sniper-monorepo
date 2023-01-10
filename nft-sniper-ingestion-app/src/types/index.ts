export * from './alchemy';
export * from './scheduler';

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
    actualDate?: Date;
  };
  offers: {
    from: string;
    priceAmount: string;
    priceCurrency: string;
    fiatPrice: string;
    fiatCurrency: string;
    actualDate?: Date;
  }[];
  rawJson: Record<string, unknown>;
}

export interface Token {
  contractAddress: string;
  tokenId: number;
}
