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

// Alchemy
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Alchemy {
  export interface NftMetadata {
    contract: Contract;
    id: Id;
    title: string;
    description: string;
    tokenUri: TokenUri;
    media: Medum[];
    metadata: Metadata;
    timeLastUpdated: string;
    contractMetadata: ContractMetadata;
  }

  export interface Contract {
    address: string;
  }

  export interface Id {
    tokenId: string;
    tokenMetadata: TokenMetadata;
  }

  export interface TokenMetadata {
    tokenType: string;
  }

  export interface TokenUri {
    raw: string;
    gateway: string;
  }

  export interface Medum {
    raw: string;
    gateway: string;
    thumbnail?: string;
    format?: string;
    bytes?: number;
  }

  export interface Metadata {
    image: string;
    attributes: Attribute[];
    name?: string;
    description?: string;
  }

  export interface Attribute {
    value: any;
    trait_type: string;
    display_type?: string;
  }

  export interface ContractMetadata {
    name: string;
    symbol: string;
    totalSupply?: string;
    tokenType: string;
    contractDeployer?: string;
    deployedBlockNumber?: number;
    openSea: OpenSea;
  }

  export interface OpenSea {
    floorPrice: number;
    collectionName: string;
    safelistRequestStatus: string;
    imageUrl: string;
    description: string;
    externalUrl?: string;
    twitterUsername?: string;
    discordUrl?: string;
    lastIngestedAt: string;
  }
}

export interface Token {
  contractAddress: string;
  tokenId: number;
}
