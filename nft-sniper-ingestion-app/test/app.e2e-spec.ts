import * as cookie from 'cookie';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/prisma';
import { Test, TestingModule } from '@nestjs/testing';
import { WALLET_ALLOW_LIST } from '../src/constants';
import { ethers } from 'ethers';
import { fetchAccessToken, login } from './utils';
import { enhanceApp } from '../src/utils';

jest.setTimeout(10000);

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
    enhanceApp(app);
    await app.init();
    await prisma.cleanDb();
  });

  afterEach(async () => {
    await prisma.cleanDb();
  });

  afterAll(async () => {
    try {
      console.log('Finished tests.');
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

    it('should be OK and return token in cookies', async () => {
      const wallet = ethers.Wallet.createRandom();
      const result = await login(app.getHttpServer(), wallet, prisma);

      const cookies = result.get('Set-Cookie');
      const parsed = cookie.parse(cookies[0]);

      expect(parsed['alpha_sniper_access_token']).toEqual(
        expect.stringContaining('ey'),
      );
    });
  });

  describe('/demo/nft-data (GET)', () => {
    describe('without valid token', () => {
      it('should be UNAUTHORIZED', async () => {
        return request(app.getHttpServer())
          .get('/demo/nft-data')
          .set('Authorization', `Bearer bad-token`)
          .expect(401);
      });
    });

    describe('with valid cookie', () => {
      it('should be OK and return token with valid login', async () => {
        const wallet = ethers.Wallet.createRandom();
        const result = await login(app.getHttpServer(), wallet, prisma);
        const cookies = result.get('Set-Cookie');

        return (
          request(app.getHttpServer())
            .get('/demo/nft-data')
            .set('Cookie', cookies)
            .expect(200)
            // This returns an empty array because there aren't any tokens to fetch
            .expect([])
        );
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

  describe('/nft', () => {
    {
      const PATH = '/nft/add';

      describe(`${PATH} (POST)`, () => {
        describe('without valid token', () => {
          it('should be UNAUTHORIZED', async () => {
            return request(app.getHttpServer())
              .post(PATH)
              .send({})
              .set('Authorization', `Bearer bad-token`)
              .expect(401);
          });
        });

        describe('with valid cookie', () => {
          describe('with a bad contract address', () => {
            it('should fail', async () => {
              const wallet = ethers.Wallet.createRandom();
              const result = await login(app.getHttpServer(), wallet, prisma);
              const cookies = result.get('Set-Cookie');

              return (
                request(app.getHttpServer())
                  .post(PATH)
                  .send({
                    walletAddress: wallet.address,
                    contractAddress: 'some-nft-contract-address',
                    tokenId: 1234,
                  })
                  .set('Cookie', cookies)
                  .expect(400)
                  // This returns an empty array because there aren't any tokens to fetch
                  .expect({
                    statusCode: 400,
                    message: 'Invalid contract address',
                  })
              );
            });
          });

          describe('with a bad wallet address', () => {
            it('should fail', async () => {
              const wallet = ethers.Wallet.createRandom();
              const result = await login(app.getHttpServer(), wallet, prisma);
              const cookies = result.get('Set-Cookie');

              return (
                request(app.getHttpServer())
                  .post(PATH)
                  .send({
                    walletAddress: 'some-bogus-wallet',
                    contractAddress:
                      '0xc7e4d1dfb2ffda31f27c6047479dfa7998a07d47',
                    tokenId: 1234,
                  })
                  .set('Cookie', cookies)
                  .expect(400)
                  // This returns an empty array because there aren't any tokens to fetch
                  .expect({
                    statusCode: 400,
                    message: 'Invalid wallet address',
                  })
              );
            });
          });

          describe('with a good data', () => {
            it('should add the nft', async () => {
              const wallet = ethers.Wallet.createRandom();
              const contractAddress = ethers.utils.getAddress(
                '0xc7e4d1dfb2ffda31f27c6047479dfa7998a07d47',
              );
              const loginResult = await login(
                app.getHttpServer(),
                wallet,
                prisma,
              );

              const cookies = loginResult.get('Set-Cookie');

              expect(
                await prisma.trackedNft.findFirst({
                  where: {
                    walletAddress: wallet.address,
                    contractAddress,
                    tokenId: 1234,
                  },
                }),
              ).toBeNull();

              const result = await request(app.getHttpServer())
                .post(PATH)
                .send({
                  walletAddress: wallet.address,
                  contractAddress,
                  tokenId: 1234,
                })
                .set('Cookie', cookies)
                .expect(201);

              expect(result.body).toEqual(
                expect.objectContaining({
                  walletAddress: wallet.address,
                  contractAddress,
                  tokenId: 1234,
                }),
              );

              const nft = prisma.trackedNft.findFirst({
                where: {
                  walletAddress: wallet.address,
                  contractAddress,
                  tokenId: 1234,
                },
              });

              expect(nft).not.toBeNull();
            });

            describe('when the nft is already tracked by a different wallet', () => {
              const contractAddress = ethers.utils.getAddress(
                '0xc7e4d1dfb2ffda31f27c6047479dfa7998a07d47',
              );
              beforeEach(async () => {
                const wallet = ethers.Wallet.createRandom();
                await prisma.$transaction([
                  prisma.nFT.create({
                    data: {
                      contractAddress,
                      tokenId: 1234,
                    },
                  }),
                  prisma.trackedNft.upsert({
                    where: {
                      contractAddress_tokenId_walletAddress: {
                        walletAddress: wallet.address,
                        contractAddress,
                        tokenId: 1234,
                      },
                    },
                    create: {
                      walletAddress: wallet.address,
                      contractAddress,
                      tokenId: 1234,
                    },
                    update: {},
                  }),
                ]);
              });

              it('should add the nft', async () => {
                const wallet = ethers.Wallet.createRandom();

                const loginResult = await login(
                  app.getHttpServer(),
                  wallet,
                  prisma,
                );

                const cookies = loginResult.get('Set-Cookie');

                const result = await request(app.getHttpServer())
                  .post(PATH)
                  .send({
                    walletAddress: wallet.address,
                    contractAddress,
                    tokenId: 1234,
                  })
                  .set('Cookie', cookies)
                  .expect(201);

                expect(result.body).toEqual(
                  expect.objectContaining({
                    walletAddress: wallet.address,
                    contractAddress,
                    tokenId: 1234,
                  }),
                );

                const nft = prisma.trackedNft.findFirst({
                  where: {
                    walletAddress: wallet.address,
                    contractAddress,
                    tokenId: 1234,
                  },
                });

                expect(nft).not.toBeNull();
              });
            });
          });
        });
      });
    }

    describe.only('/nft/v2/tracked-data (GET)', () => {
      describe('without api authentication', () => {
        it('should be a 401: Unauthorized', () => {
          return request(app.getHttpServer())
            .get('/v2/nft/tracked-data?walletAddress=bad_address')
            .expect(401);
        });
      });

      describe('with api authentication', () => {
        async function getAuthCookie() {
          const wallet = ethers.Wallet.createRandom();
          const result = await login(app.getHttpServer(), wallet, prisma);
          return result.get('Set-Cookie');
        }

        describe('for demo', () => {
          it('should be a return data', async () => {
            const result = await request(app.getHttpServer())
              .get('/v2/nft/tracked-data?walletAddress=demo')
              .set('Cookie', await getAuthCookie())
              .expect(200);

            expect(result.body).toEqual(['sdfs']);
          });
        });
      });
    });
  });
});
