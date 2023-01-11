import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../../src/prisma';
import * as request from 'supertest';
import { CreateTrackedNftDto } from '../../../src/tracked-nft/v2/create-tracked-nft.dto';

export async function createUser(args: { app: INestApplication }) {
  const { app } = args;
  const prisma = app.get(PrismaService);

  // Create user
  const user = await prisma.user.create({ data: {} });

  const _user = await prisma.user.findFirst({
    where: { uuid: user.uuid },
    include: { wallets: true, trackedNft2s: true, discordUsers: true },
  });

  if (!_user) throw new Error('User not found');

  return {
    user: _user,
  };
}

export async function addTrackedNft(args: {
  app: INestApplication;
  payload: CreateTrackedNftDto;
}): Promise<any> {
  const { app, payload } = args;

  // Should be unauthorized without api key
  await request(app.getHttpServer())
    .post('/tracked-nft/add')
    .send(payload)
    .expect(401);

  const result = await request(app.getHttpServer())
    .post('/tracked-nft/add')
    .set('api-key', 'test-api-key')
    .send(payload)
    .expect(201);

  return result.body;
}
