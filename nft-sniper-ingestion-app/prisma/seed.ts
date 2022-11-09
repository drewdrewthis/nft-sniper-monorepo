import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Must be syncronous so can't use map

  console.log(
    await prisma.marketplace.upsert({
      where: {
        name: 'OpenSea',
      },
      update: {},
      create: {
        name: 'OpenSea',
      },
    }),
    await prisma.marketplace.upsert({
      where: {
        name: 'X2Y2',
      },
      update: {},
      create: {
        name: 'X2Y2',
      },
    }),
    await prisma.nFT
      .create({
        data: {
          tokenId: 4860,
          contractAddress: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
        },
      })
      .catch(console.error),
    await prisma.nFT
      .create({
        data: {
          tokenId: 6781,
          contractAddress: '0x394E3d3044fC89fCDd966D3cb35Ac0B32B0Cda91',
        },
      })
      .catch(console.error),
    await prisma.nFT
      .create({
        data: {
          tokenId: 5341,
          contractAddress: '0x394E3d3044fC89fCDd966D3cb35Ac0B32B0Cda91',
        },
      })
      .catch(console.error),
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
