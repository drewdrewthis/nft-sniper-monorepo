import { PrismaClient } from '@prisma/client';
import { DEMO_NFTS } from '../constants';

const prisma = new PrismaClient();

async function main() {
  // Must be syncronous so can't use map
  console.log(await createMarketplaces(), await createTokens());
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

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
