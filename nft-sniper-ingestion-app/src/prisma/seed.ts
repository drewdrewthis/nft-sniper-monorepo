import { PrismaClient } from '@prisma/client';
import { DEMO_NFTS, WALLET_ALLOW_LIST } from '../constants';

const prisma = new PrismaClient();

async function main() {
  // Must be syncronous so can't use map
  console.log(
    await createMarketplaces(),
    await createTokens(),
    await updateAllowList(),
  );
}

async function createMarketplaces() {
  console.log('Creating marketplaces..');
  return Promise.all(
    ['OpenSea', 'X2Y2', 'LooksRare'].map(async (name) => {
      return prisma.marketplace.upsert({
        where: {
          name,
        },
        update: {},
        create: {
          name,
        },
      });
    }),
  );
}

async function createTokens() {
  console.log('Creating tokens..');
  return Promise.all(
    DEMO_NFTS.map(async (token) => {
      return prisma.nFT
        .upsert({
          where: {
            contractAddress_tokenId: token,
          },
          create: token,
          update: {},
        })
        .catch(console.error);
    }),
  );
}

async function updateAllowList() {
  console.log('Updating allowlist..');
  await prisma.walletAllowList.updateMany({
    where: {
      walletAddress: {
        notIn: WALLET_ALLOW_LIST,
      },
    },
    data: {
      isDeleted: true,
    },
  });

  return Promise.all(
    WALLET_ALLOW_LIST.map(async (walletAddress) => {
      await prisma.walletAllowList
        .upsert({
          where: {
            walletAddress,
          },
          create: {
            walletAddress,
          },
          update: {
            isDeleted: false,
          },
        })
        .catch(console.error);
    }),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
