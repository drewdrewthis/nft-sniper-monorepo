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
