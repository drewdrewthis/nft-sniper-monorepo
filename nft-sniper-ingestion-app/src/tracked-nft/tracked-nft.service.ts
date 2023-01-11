import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { FindTrackedNftsForUserDto } from './find-tracked-nfts-for-user.dto';

@Injectable()
export class TrackedNftService {
  constructor(private readonly prisma: PrismaService) {}

  async getTrackedNfts() {
    return this.prisma.trackedNft.findMany();
  }

  async findBy(args: FindTrackedNftsForUserDto) {
    const users = await this.prisma.user.findMany({
      where: {
        OR: {
          uuid: args.uuid,
          wallets: {
            every: {
              walletAddress: args.walletAddress,
            },
          },
          discordUsers: {
            every: {
              discordId: args.discordId,
            },
          },
        },
      },
      include: {
        trackedNft2s: true,
      },
    });

    if (users.length > 1) {
      throw new Error(
        "Multiple users found for the given arguments. This shouldn't happen.",
      );
    }

    return users[0].trackedNft2s;
  }
}
