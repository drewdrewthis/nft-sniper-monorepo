/* eslint-disable @typescript-eslint/no-unused-vars */
import { setup, teardown } from '../../setup';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../../src/prisma';
import {
  createTrackedNfts,
  fetchTrackedNftsDiscordId,
  fetchTrackedNftsUserUUid,
  fetchTrackedNftsWalletAddress,
} from './utils';

jest.setTimeout(20000);

describe('Scenario: Fetching tracked NFTs (e2e)', () => {
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

  describe('when requesting nfts by user uuid', () => {
    it('should return nfts', async () => {
      const { user, nfts, trackedNfts } = await createTrackedNfts({ app });

      const results = await fetchTrackedNftsUserUUid({
        app,
        userUuid: user.uuid,
      });

      expect(results?.[0].tokenId).toBe(nfts[1].tokenId);
      expect(results?.[0].tokenId).toBe(trackedNfts[1].tokenId);
      expect(results).toHaveLength(2);
    });

    it('should return only active nfts', async () => {
      const { user, nfts, trackedNfts } = await createTrackedNfts({ app });

      const results = await fetchTrackedNftsUserUUid({
        app,
        userUuid: user.uuid,
      });

      expect(results?.[0].tokenId).toBe(nfts[1].tokenId);
      expect(results?.[0].tokenId).toBe(trackedNfts[1].tokenId);
      expect(trackedNfts).toHaveLength(3);
      expect(results).toHaveLength(2);
    });
  });

  describe('when requesting nfts by user walletAddress', () => {
    it('should return nfts', async () => {
      const { user, nfts, trackedNfts } = await createTrackedNfts({ app });
      const walletAddress = user.wallets.at(0)?.walletAddress;

      if (!walletAddress) throw new Error('Wallet address not found');

      const results = await fetchTrackedNftsWalletAddress({
        app,
        walletAddress,
      });

      expect(results?.[0].tokenId).toBe(nfts[1].tokenId);
      expect(results?.[0].tokenId).toBe(trackedNfts[1].tokenId);
      expect(results).toHaveLength(2);
    });
  });

  describe('when requesting nfts by user discordId', () => {
    it('should return nfts', async () => {
      const { user, nfts, trackedNfts } = await createTrackedNfts({ app });
      const discordId = user.discordUsers.at(0)?.discordId;

      if (!discordId) throw new Error('Wallet address not found');

      const results = await fetchTrackedNftsDiscordId({
        app,
        discordId,
      });

      expect(results?.[0].tokenId).toBe(nfts[1].tokenId);
      expect(results?.[0].tokenId).toBe(trackedNfts[1].tokenId);
      expect(results).toHaveLength(2);
    });
  });
});
