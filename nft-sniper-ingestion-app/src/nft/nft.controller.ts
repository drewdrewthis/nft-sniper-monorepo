import {
  Body,
  Controller,
  Get,
  HttpException,
  Logger,
  Post,
} from '@nestjs/common';
import { AlchemyService } from '../apis/alchemy/alchemy.service';
import { PrismaService } from '../prisma';
import { NFT } from '@prisma/client';
import * as ethers from 'ethers';

@Controller('nft')
export class NftController {
  logger = new Logger(NftController.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly alchemy: AlchemyService,
  ) {}

  @Get('all-metadata')
  async getAllNFTMetadata() {
    const tokens = await this.prisma.nFT.findMany();
    const result = await this.alchemy.getNFTMetadataBatch(tokens);

    console.log('got data', result);

    return result;
  }

  @Get('all')
  getNfts(): Promise<Pick<NFT, 'contractAddress' | 'tokenId'>[]> {
    return this.prisma.nFT.findMany({
      include: {
        historicalPrices: {
          orderBy: {
            actualDate: 'desc',
          },
          take: 1,
        },
      },
    });
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

    const { signedMessage, walletAddress, tokenId, contractAddress } = payload;

    // Validate addresses
    ethers.utils.getAddress(contractAddress);
    ethers.utils.getAddress(walletAddress);

    // Verify signature
    const signerAddress = ethers.utils.verifyMessage(
      signedMessage.message,
      signedMessage.signature,
    );

    if (signerAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new HttpException(
        'You are unauthorized to add NFTs for this account',
        401,
      );
    }

    return this.prisma.nFT.create({
      data: {
        tokenId: Number(tokenId),
        contractAddress,
      },
    });
  }
}
