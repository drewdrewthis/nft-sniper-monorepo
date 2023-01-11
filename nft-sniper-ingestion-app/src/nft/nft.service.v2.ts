import { Injectable, Logger } from '@nestjs/common';
import { DEMO_NFTS } from '../constants';
import { NftService } from './nft.service';
import { Token } from '../types';
import { ResevoirService } from '../apis/resevoir/resevoir.service';
import { normalizeMetadata, normalizeOffer, normalizePrice } from './utils';
import { NftPayload } from './types';
import { ethers } from 'ethers';
import { PrismaService } from '../prisma';

@Injectable()
export class NftServiceV2 {
  logger = new Logger(NftService.name);

  constructor(
    private readonly serviceV1: NftService,
    private readonly resevoir: ResevoirService,
    private readonly prisma: PrismaService,
  ) {}

  async findOrCreate(payload: { tokenId: number; contractAddress: string }) {
    const { tokenId, contractAddress } = payload;

    this.logger.log('Received request to add nft', payload);
    ethers.utils.getAddress(contractAddress);

    return this.prisma.nFT.upsert({
      where: {
        contractAddress_tokenId: { contractAddress, tokenId },
      },
      create: {
        tokenId: Number(tokenId),
        contractAddress,
      },
      update: {},
    });
  }

  /**
   * Get all data for the nfts associated with this wallet
   * @param walletAddress
   */
  async getNftDataForWallet(walletAddress: string) {
    const trackedNfts = await this.getTrackedNftsForWallet(walletAddress);
    return this.getNftDataForTokens(trackedNfts);
  }

  /**
   * Get all data for the nfts for the dmeo
   */
  async getNftDataForDemo(): Promise<NftPayload> {
    return this.getNftDataForTokens(DEMO_NFTS);
  }

  private async getNftDataForTokens(tokens: Token[]): Promise<NftPayload> {
    // Sanity check
    if (!tokens?.length) return [];

    const aggregateData = await this.resevoir.fetchAggregateNftData(tokens);
    return aggregateData.map((data) => {
      return {
        // ...data,
        contractAddress: data.contractAddress,
        tokenId: data.tokenId,
        offers: data.highestBid ? [normalizeOffer(data, data.highestBid)] : [],
        lastSale: data.lastSale,
        historicalPrices: data.lowestListing
          ? [normalizePrice(data, data.lowestListing)]
          : [],
        metadata: normalizeMetadata(data.metadata),
      };
    });
  }

  private async getTrackedNftsForWallet(walletAddress: string) {
    return this.serviceV1.getTrackedNftsForWallet(walletAddress);
  }
}
