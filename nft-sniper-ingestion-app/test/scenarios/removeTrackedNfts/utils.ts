import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../../src/prisma';
import * as request from 'supertest';
import { RemoveTrackedNftDto } from '../../../src/tracked-nft/v2/remove-tracked-nft.dto';

const contractAddress = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D';

export async function createTrackedNfts(args: { app: INestApplication }) {
  const { app } = args;
  const prisma = app.get(PrismaService);

  // Create user
  const user = await prisma.user.create({ data: {} });

  // Create NFT
  const nft = await prisma.nFT.create({
    data: {
      contractAddress,
      tokenId: 1234,
    },
  });

  // Create tracked NFT
  const trackedNft = await prisma.trackedNft2.create({
    data: {
      contractAddress: nft.contractAddress,
      tokenId: nft.tokenId,
      nFTId: nft.id,
      userUuid: user.uuid,
    },
  });

  return {
    user,
    nft,
    trackedNft,
  };
}

export async function removeTrackedNft(args: {
  app: INestApplication;
  payload: RemoveTrackedNftDto;
}): Promise<any> {
  const { app, payload } = args;

  // Should be unauthorized without api key
  await request(app.getHttpServer())
    .post('/tracked-nft/remove')
    .send(payload)
    .expect(401);

  const result = await request(app.getHttpServer())
    .post('/tracked-nft/remove')
    .set('api-key', 'test-api-key')
    .send(payload)
    .expect(201);

  return result.body;
}
