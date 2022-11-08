import { Controller, Get, Post } from '@nestjs/common';
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

  @Post('tracked-nfts/add')
  async remove(token: { tokenId: number; contractAddress: string }) {
    return this.prisma.trackedNfts.create({
      data: token,
    });
  }

  async addTrackedNft(token: { tokenId: number; contractAddress: string }) {
    return this.prisma.trackedNfts.create({
      data: token,
    });
  }
}