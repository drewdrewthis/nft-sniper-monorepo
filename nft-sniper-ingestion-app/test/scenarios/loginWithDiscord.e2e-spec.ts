/* eslint-disable @typescript-eslint/no-unused-vars */
import { setup, teardown } from '../setup';
import { loginWithDiscord } from './loginWithDiscord';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma';

jest.setTimeout(20000);

describe('Scenario: Login with discord (e2e)', () => {
  describe('when a user logs in with a discord id', () => {
    describe("and the user doesn't have an account yet", () => {
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

      it('should create a new account', async () => {
        const discordId = '1234';

        await loginWithDiscord({ app, discordId });

        const user = await prisma.user.findFirst({
          include: { discordUsers: true },
        });

        expect(user?.discordUsers.at(0)?.discordId).toEqual(discordId);
      });
    });
  });
});
