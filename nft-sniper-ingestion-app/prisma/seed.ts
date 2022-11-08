import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Must be syncronous so can't use map

  const marketplace = await prisma.marketplace.upsert({
    where: {
      name: 'OpenSea',
    },
    update: {},
    create: {
      name: 'OpenSea',
    },
  });

  console.log(marketplace);
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
