import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';

@Injectable()
export class TrackedNftService {
  constructor(private readonly prisma: PrismaService) {}

  async getTrackedNfts() {
    return this.prisma.trackedNft.findMany();
  }
}
