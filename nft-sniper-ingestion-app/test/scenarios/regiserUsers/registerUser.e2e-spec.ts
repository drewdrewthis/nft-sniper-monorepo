/* eslint-disable @typescript-eslint/no-unused-vars */
import { setup, teardown } from '../../setup';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../../src/prisma';
import {
  registerUserWithDiscordId,
  registerUserWithWalletAddress,
  registerUserWithWalletAddressAndDiscordId,
} from './utils';
import { ethers } from 'ethers';

jest.setTimeout(20000);

describe('Scenario: Registering user in database (e2e)', () => {
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

  describe("when a user doesn't have an account yet", () => {
    describe('and only a discord id is provided', () => {
      describe("and the user doesn't exist yet", () => {
        it('should create a new user with an associated discord user', async () => {
          const discordId = '1234';

          await registerUserWithDiscordId({ app, discordId });

          const user = await prisma.user.findFirst({
            include: { discordUsers: true },
          });

          expect(user?.discordUsers.at(0)?.discordId).toEqual(discordId);
        });
      });

      describe('and the user exists', () => {
        it('should not a new user', async () => {
          const discordId = '1234';

          await registerUserWithDiscordId({ app, discordId });
          await registerUserWithDiscordId({ app, discordId });

          const count = await prisma.user.count();

          expect(count).toBe(1);
        });
      });
    });

    describe('and only a wallet address is provided', () => {
      it('should create a new user with an associated wallet', async () => {
        const walletAddress = ethers.Wallet.createRandom().address;
        await registerUserWithWalletAddress({ app, walletAddress });

        const user = await prisma.user.findFirst({
          include: { wallets: true },
        });

        expect(user?.wallets.at(0)?.walletAddress).toEqual(
          walletAddress.toLowerCase(),
        );
      });
    });

    describe('and both a wallet address and a discord address is provided', () => {
      it('should create a new user with an associated discord user and wallet', async () => {
        const discordId = '1234';
        const walletAddress = ethers.Wallet.createRandom().address;

        await registerUserWithWalletAddressAndDiscordId({
          app,
          walletAddress,
          discordId,
        });

        const user = await prisma.user.findFirst({
          include: { wallets: true, discordUsers: true },
        });

        expect(user?.wallets.at(0)?.walletAddress).toEqual(
          walletAddress.toLowerCase(),
        );
        expect(user?.discordUsers.at(0)?.discordId).toEqual(discordId);
      });
    });
  });
});
