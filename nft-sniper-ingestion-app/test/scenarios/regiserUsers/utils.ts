import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export async function registerUserWithDiscordId(args: {
  app: INestApplication;
  discordId: string;
}) {
  const { app, discordId } = args;
  await postDataToRegisterUserEndpoint({
    app,
    data: { discordId },
  });
}

export async function registerUserWithWalletAddress(args: {
  app: INestApplication;
  walletAddress: string;
}) {
  const { app, walletAddress } = args;
  await postDataToRegisterUserEndpoint({
    app,
    data: { walletAddress },
  });
}

export async function registerUserWithWalletAddressAndDiscordId(args: {
  app: INestApplication;
  walletAddress: string;
  discordId: string;
}) {
  const { app, walletAddress, discordId } = args;
  await postDataToRegisterUserEndpoint({
    app,
    data: { walletAddress, discordId },
  });
}

async function postDataToRegisterUserEndpoint(args: {
  app: INestApplication;
  data: any;
}) {
  const { app, data } = args;

  // Should be unauthorized without api key
  await request(app.getHttpServer())
    .post('/user/register')
    .send(data)
    .expect(401);

  await request(app.getHttpServer())
    .post('/user/register')
    .set('api-key', 'test-api-key')
    .send(data)
    .expect(201);
}
