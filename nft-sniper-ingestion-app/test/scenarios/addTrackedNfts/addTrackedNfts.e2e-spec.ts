import { setup, teardown } from '../../setup';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../../src/prisma';
import { addTrackedNft, createUser } from './utils';

jest.setTimeout(20000);

describe('Scenario: Adding tracked NFTs (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const deps = await setup();
    app = deps.app;
    prisma = deps.prisma;
  });

  afterEach(async () => {
    await teardown({ app, prisma });
  });

  describe("when nft doesn't exist in db", () => {
    const contractAddress = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D';
    it('should create an nfts', async () => {
      const { user } = await createUser({ app });

      const result = await addTrackedNft({
        app,
        payload: {
          tokenId: '1234',
          contractAddress,
          userUuid: user.uuid,
        },
      });

      expect(result?.tokenId).toBe(1234);
      expect(result?.contractAddress).toBe(contractAddress);
      expect(result?.userUuid).toBe(user.uuid);
    });
  });
});
