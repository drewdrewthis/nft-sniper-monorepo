import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { HistoricalNftOffer, HistoricalNftPrice, NFT } from '@prisma/client';
import { Alchemy } from '../types';
import { NftService } from './nft.service';

@Controller('nft')
export class NftController {
  logger = new Logger(NftController.name);

  constructor(private readonly service: NftService) {}

  @Get('all-metadata')
  async getAllNFTMetadata() {
    return this.service.getAllNFTMetadata();
  }

  @Get('all')
  getNfts(): Promise<Pick<NFT, 'contractAddress' | 'tokenId'>[]> {
    return this.service.getNfts();
  }

  @Get('tracked-data')
  getTrackedDataForWallet(
    @Query()
    payload: {
      walletAddress: string;
    },
  ): Promise<
    {
      tokenId: number;
      contractAddress: string;
      offers: HistoricalNftOffer[];
      historicalPrices: HistoricalNftPrice[];
      metadata?: Alchemy.NftMetadata;
    }[]
  > {
    console.log('tracled', payload);
    return this.service.getTrackedNftDataForWallet(payload.walletAddress);
  }

  @Post('add')
  async add(
    @Body()
    payload: {
      tokenId: string;
      contractAddress: string;
      walletAddress: string;
      signedMessage: {
        message: string;
        signature: string;
      };
    },
  ) {
    this.logger.log('Received request to add nft', payload);
    return this.service.add({ ...payload, tokenId: Number(payload.tokenId) });
  }

  @Post('remove')
  async remove(
    @Body()
    payload: {
      tokenId: string;
      contractAddress: string;
      walletAddress: string;
    },
  ) {
    this.logger.log('Received request to remove nft', payload);
    return this.service.remove({
      ...payload,
      tokenId: Number(payload.tokenId),
    });
  }
}
