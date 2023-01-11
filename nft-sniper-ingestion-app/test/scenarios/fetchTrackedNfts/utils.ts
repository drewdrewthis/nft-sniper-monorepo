import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../../src/prisma';
import * as request from 'supertest';

export async function createTrackedNfts(args: { app: INestApplication }) {
  const { app } = args;
  const prisma = app.get(PrismaService);

  // Create user
  const user = await prisma.user.create({ data: {} });

  // Create NFTs
  const nfts = await prisma.$transaction([
    prisma.nFT.create({
      data: {
        contractAddress: '0x1234',
        tokenId: 1234,
      },
    }),
    prisma.nFT.create({
      data: {
        contractAddress: '0x1235',
        tokenId: 1235,
      },
    }),
    prisma.nFT.create({
      data: {
        contractAddress: '0x1236',
        tokenId: 1236,
      },
    }),
  ]);

  // Create tracked NFTs
  const trackedNfts = await prisma.$transaction(
    nfts.map((nft) => {
      return prisma.trackedNft2.create({
        data: {
          contractAddress: nft.contractAddress,
          tokenId: nft.tokenId,
          nFTId: nft.id,
          userUuid: user.uuid,
        },
      });
    }),
  );

  // Deactivate one of the tracked NFTs
  await prisma.trackedNft2.update({
    where: {
      id: trackedNfts[0].id,
    },
    data: {
      isActive: false,
    },
  });

  // Create wallets
  await prisma.wallet.create({
    data: {
      walletAddress: '0x1234',
      userUuid: user.uuid,
    },
  });

  // Create discord users
  await prisma.discordUser.create({
    data: {
      userUuid: user.uuid,
      discordId: '1234',
    },
  });

  const _user = await prisma.user.findFirst({
    where: { uuid: user.uuid },
    include: { wallets: true, trackedNft2s: true, discordUsers: true },
  });

  if (!_user) throw new Error('User not found');

  return {
    user: _user,
    nfts,
    trackedNfts,
  };
}

export async function fetchTrackedNftsUserUUid(args: {
  app: INestApplication;
  userUuid: string;
}): Promise<any[]> {
  const { app, userUuid } = args;

  // Should be unauthorized without api key
  await request(app.getHttpServer())
    .get('/tracked-nft/filtered?userUuid=' + userUuid)
    .expect(401);

  const nfts = await request(app.getHttpServer())
    .get('/tracked-nft/filtered?userUuid=' + userUuid)
    .set('api-key', 'test-api-key')
    .expect(200);

  return nfts.body;
}

export async function fetchTrackedNftsWalletAddress(args: {
  app: INestApplication;
  walletAddress: string;
}): Promise<any[]> {
  const { app, walletAddress } = args;

  // Should be unauthorized without api key
  await request(app.getHttpServer())
    .get('/tracked-nft/filtered?walletAddress=' + walletAddress)
    .expect(401);

  const nfts = await request(app.getHttpServer())
    .get('/tracked-nft/filtered?walletAddress=' + walletAddress)
    .set('api-key', 'test-api-key')
    .expect(200);

  return nfts.body;
}

export async function fetchTrackedNftsDiscordId(args: {
  app: INestApplication;
  discordId: string;
}): Promise<any[]> {
  const { app, discordId } = args;

  // Should be unauthorized without api key
  await request(app.getHttpServer())
    .get('/tracked-nft/filtered?discordId=' + discordId)
    .expect(401);

  const nfts = await request(app.getHttpServer())
    .get('/tracked-nft/filtered?discordId=' + discordId)
    .set('api-key', 'test-api-key')
    .expect(200);

  return nfts.body;
}
