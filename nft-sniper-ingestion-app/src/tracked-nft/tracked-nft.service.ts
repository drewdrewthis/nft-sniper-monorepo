import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { FindTrackedNftsForUserDto } from './find-tracked-nfts-for-user.dto';
import { CreateTrackedNftDto } from './v2/create-tracked-nft.dto';
import { NftServiceV2 } from '../nft/nft.service.v2';

@Injectable()
export class TrackedNftService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly nftService: NftServiceV2,
  ) {}

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

  async create(data: CreateTrackedNftDto) {
    const tokenId = Number(data.tokenId);

    const nft = await this.nftService.findOrCreate({
      ...data,
      tokenId,
    });

    return this.prisma.trackedNft2.upsert({
      where: {
        nFTId_userUuid: {
          nFTId: nft.id,
          userUuid: data.userUuid,
        },
      },
      update: {
        isActive: true,
      },
      create: {
        ...data,
        tokenId,
        nFTId: nft.id,
      },
    });
  }

  async softDelete(data: CreateTrackedNftDto) {
    const tokenId = Number(data.tokenId);

    const trackedNft = await this.prisma.trackedNft2.findFirst({
      where: {
        ...data,
        tokenId,
      },
    });

    if (!trackedNft) {
      throw new Error('Tracked NFT not found');
    }

    return this.prisma.trackedNft2.update({
      where: {
        id: trackedNft.id,
      },
      data: {
        isActive: false,
      },
    });
  }
}
