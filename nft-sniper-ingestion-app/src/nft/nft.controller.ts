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
import { GetTrackedDataForWalletDto } from './get-tracked-data-for-wallet.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { NftPayload } from './types';
import { NftServiceV2 } from './nft.service.v2';

@Controller('nft')
export class NftController {
  logger = new Logger(NftController.name);

  constructor(
    private readonly service: NftService,
    private readonly serviceV2: NftServiceV2,
  ) {}

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
  async getTrackedDataForWalletV2(
    @Query()
    payload: GetTrackedDataForWalletDto,
  ): Promise<Promise<NftPayload> | void> {
    if (payload.walletAddress === 'demo') {
      return this.serviceV2.getNftDataForDemo();
    }

    try {
      return await this.serviceV2.getNftDataForWallet(payload.walletAddress);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
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
