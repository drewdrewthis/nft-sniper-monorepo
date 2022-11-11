import { Controller, Get, Post } from '@nestjs/common';
import { NFT } from '@prisma/client';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AlchemyService } from './apis/alchemy/alchemy.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
    private readonly alchemy: AlchemyService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('tracked-nft-metadata')
  async getAllNFTMetadata() {
    const tokens = await this.prisma.nFT.findMany();
    const result = await this.alchemy.getNFTMetadataBatch(tokens);

    console.log('got data', result);

    return result;
  }

  @Get('tracked-nfts')
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

  @Post('tracked-nfts/add')
  async remove(token: { tokenId: number; contractAddress: string }) {
    return this.prisma.nFT.create({
      data: token,
    });
  }

  async addTrackedNft(token: { tokenId: number; contractAddress: string }) {
    return this.prisma.nFT.create({
      data: token,
    });
  }
}
