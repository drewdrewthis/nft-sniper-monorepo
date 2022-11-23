import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { WALLET_ALLOW_LIST } from '../src/constants';
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
      console.log('Finished tests. Cleaning DB');
      await prisma.cleanDb();
      console.log('Shutting down');
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
      const result = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          walletAddress: WALLET_ALLOW_LIST[0],
        })
        .expect(201);

      expect(result.body).toEqual({
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
        const result = await request(app.getHttpServer())
          .post('/auth/login')
          .set('Content-Type', 'application/json')
          .send({
            walletAddress: WALLET_ALLOW_LIST[0],
          });

        const { access_token } = result.body;

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
