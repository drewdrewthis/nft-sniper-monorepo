import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export async function loginWithDiscord(args: {
  app: INestApplication;
  discordId: string;
}) {
  const { app, discordId } = args;
  const result = await request(app.getHttpServer())
    .post('/auth/discord-login')
    .set('api-key', 'test-api-key')
    .send({ discordId })
    .expect(201);

  expect(result.body).toMatchObject({
    access_token: expect.stringContaining('ey'),
    expires: expect.any(String),
  });
}
