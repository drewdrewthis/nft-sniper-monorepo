import * as request from 'supertest';
import { PrismaService } from '../../src/prisma';
import { SiweMessage } from 'siwe';
import { ethers } from 'ethers';

export async function fetchAccessToken(
  server: any,
  wallet: ethers.Wallet,
  prisma: PrismaService,
) {
  const result = await login(server, wallet, prisma);

  expect(result.body).toEqual({
    access_token: expect.stringContaining('ey'),
  });

  return result.body;
}

export async function login(
  server: any,
  wallet: ethers.Wallet,
  prisma: PrismaService,
) {
  await prisma.walletAllowList.create({
    data: {
      walletAddress: wallet.address,
    },
  });

  const nonceResult = await request(server)
    .post('/auth/challenge')
    .send({
      walletAddress: wallet.address,
    })
    .expect(201);

  // Client side
  const message = new SiweMessage({
    domain: 'alphasniper.xyz',
    address: wallet.address,
    statement: 'Please log-in by signing this message',
    uri: 'https://alphasniper.xyz/login',
    version: '1',
    chainId: 1,
    nonce: nonceResult.body.nonce,
  });

  const signature = await wallet.signMessage(message.prepareMessage());

  return request(server)
    .post('/auth/login')
    .send({
      walletAddress: wallet.address,
      signature,
      message: message.toMessage(),
    })
    .expect(201);
}
