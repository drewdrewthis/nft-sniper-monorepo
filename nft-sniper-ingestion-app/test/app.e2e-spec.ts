import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma';
import { WALLET_ALLOW_LIST } from '../src/constants';
import { SiweMessage } from 'siwe';
import { ethers } from 'ethers';
// import 'leaked-handles';

jest.setTimeout(10000);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generateRandomAddress() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { address } = require('ethers').Wallet.createRandom([
    'just some random wallet',
  ]);

  console.log(address);
}

jest.mock('../src/constants.ts', () => {
  const randomAddress = '0xb7028A46433AA534D5b8882658Cc6473B04bD036';

  return {
    DEMO_NFTS: [],
    WALLET_ALLOW_LIST: [randomAddress],
  };
});

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    try {
      console.log('Finished tests. Cleaning DB and shutting down');
      await prisma.cleanDb();
      await app.getHttpServer().close();
      app.close();
      console.log('Finished shutting down');
    } catch (e) {
      console.error(e);
    }
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('/auth/challenge (POST)', () => {
    it('should be OK and return valid nonce', async () => {
      const result = await request(app.getHttpServer())
        .post('/auth/challenge')
        .send({
          walletAddress: WALLET_ALLOW_LIST[0],
        })
        .expect(201);

      expect(result.body).toEqual({
        nonce: expect.any(String),
      });
    });
  });

  describe('/auth/login (POST)', () => {
    it('should be Unauthorized without wallet', () => {
      return request(app.getHttpServer()).post('/auth/login').expect(401);
    });

    it('should be Unauthorized with bad wallet', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ walletAddress: 'bad address' })
        .expect(401);
    });

    it('should be Unauthorized with bad nonce', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ nonce: 'bad nonce' })
        .expect(401);
    });

    it('should be OK and return token with valid login', async () => {
      const wallet = ethers.Wallet.createRandom();
      const jwtToken = await fetchAccessToken(
        app.getHttpServer(),
        wallet,
        prisma,
      );

      expect(jwtToken).toEqual({
        access_token: expect.stringContaining('ey'),
      });
    });
  });

  describe('/demo/nft-data (GET)', () => {
    describe('without valid token', () => {
      it('should be OK and return token with valid login', async () => {
        return request(app.getHttpServer())
          .get('/demo/nft-data')
          .set('Authorization', `Bearer bad-token`)
          .expect(401);
      });
    });

    describe('with valid token', () => {
      it('should be OK and return token with valid login', async () => {
        const wallet = ethers.Wallet.createRandom();
        const { access_token } = await fetchAccessToken(
          app.getHttpServer(),
          wallet,
          prisma,
        );

        return (
          request(app.getHttpServer())
            .get('/demo/nft-data')
            .set('Authorization', `Bearer ${access_token}`)
            .expect(200)
            // This returns an empty array because there aren't any tokens to fetch
            .expect([])
        );
      });
    });
  });
});

async function fetchAccessToken(
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

  const result = await request(server)
    .post('/auth/login')
    .send({
      walletAddress: wallet.address,
      signature,
      message: message.toMessage(),
    })
    .expect(201);

  expect(result.body).toEqual({
    access_token: expect.stringContaining('ey'),
  });

  return result.body;
}
