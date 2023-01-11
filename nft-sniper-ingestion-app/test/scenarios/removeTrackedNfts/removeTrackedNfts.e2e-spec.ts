import { setup, teardown } from '../../setup';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../../src/prisma';
import { createTrackedNfts, removeTrackedNft } from './utils';

jest.setTimeout(20000);

describe('Scenario: Removing tracked NFTs (e2e)', () => {
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

  it('should remove a tracked nft', async () => {
    const { user, trackedNft } = await createTrackedNfts({ app });

    if (!trackedNft) {
      throw new Error('Tracked NFT not found');
    }

    expect(trackedNft.isActive).toBe(true);

    const result = await removeTrackedNft({
      app,
      payload: {
        tokenId: trackedNft.tokenId.toString(),
        contractAddress: trackedNft.contractAddress,
        userUuid: user.uuid,
      },
    });

    expect(result?.tokenId).toBe(trackedNft.tokenId);
    expect(result?.contractAddress).toBe(trackedNft.contractAddress);
    expect(result?.userUuid).toBe(user.uuid);
    expect(result?.isActive).toBe(false);
  });
});
