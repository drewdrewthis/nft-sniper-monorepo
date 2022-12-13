import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Version,
} from '@nestjs/common';
import { NftService } from './nft.service';
import { DemoNftPayload } from '../demo/types';
import { NFT } from '@prisma/client';

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
  ): Promise<DemoNftPayload> {
    return this.service.getNftDataForWallet(payload.walletAddress);
  }

  @Get('tracked-data')
  @Version('2')
  getTrackedDataForWalletV2(
    @Query()
    payload: {
      walletAddress: string;
    },
  ): Promise<DemoNftPayload> {
    if (payload.walletAddress === 'demo') {
      return this.service.getNftDataForDemo();
    }

    return this.service.getNftDataForWallet(payload.walletAddress);
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
