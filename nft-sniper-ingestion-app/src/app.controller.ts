import { Controller, Get, Post } from '@nestjs/common';
import { NFT } from '@prisma/client';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('tracked-nfts')
  getNfts(): Promise<Pick<NFT, 'contractAddress' | 'tokenId'>[]> {
    return this.prisma.nFT.findMany({
      select: {
        contractAddress: true,
        tokenId: true,
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
