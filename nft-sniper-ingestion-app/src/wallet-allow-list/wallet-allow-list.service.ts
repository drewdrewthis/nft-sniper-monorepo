import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletAllowListService {
  constructor(private readonly prisma: PrismaService) {}

  async includes(walletAddress: string) {
    const address = await this.prisma.walletAllowList.findFirst({
      where: {
        walletAddress,
        isDeleted: false,
      },
    });

    return !!address;
  }
}
