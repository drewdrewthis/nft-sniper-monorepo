import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { SiweUser } from '@prisma/client';
import { generateNonce } from 'siwe';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreate(walletAddress: string) {
    const nonce = generateNonce();

    return this.prisma.siweUser.upsert({
      where: {
        walletAddress,
      },
      create: {
        walletAddress,
        nonce,
      },
      update: {},
    });
  }

  async findOne(walletAddress: string): Promise<SiweUser | null> {
    return this.prisma.siweUser.findFirst({
      where: {
        walletAddress,
      },
    });
  }

  async updateNonceForWalletAddress(walletAddress: string) {
    const nonce = generateNonce();

    return this.prisma.siweUser.update({
      where: {
        walletAddress,
      },
      data: {
        nonce,
      },
    });
  }

  private validateAddress(walletAddress: string) {
    return this.prisma.walletAllowList.findUniqueOrThrow({
      where: {
        walletAddress,
      },
    });
  }
}
