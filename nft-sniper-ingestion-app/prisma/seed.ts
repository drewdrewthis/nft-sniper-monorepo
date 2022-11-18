import { PrismaClient } from '@prisma/client';

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
  const tokens = [
    {
      tokenId: 4860,
      contractAddress: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
    },
    {
      tokenId: 6781,
      contractAddress: '0x394E3d3044fC89fCDd966D3cb35Ac0B32B0Cda91',
    },
  ];

  return Promise.all(
    tokens.map(async (token) => {
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
