import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma';
import { enhanceApp } from '../src/utils';

export async function setup() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
    providers: [PrismaService],
  }).compile();

  const app = moduleFixture.createNestApplication();
  const prisma = app.get(PrismaService);

  enhanceApp(app);

  await app.init();

  return {
    app,
    prisma,
  };
}

export async function teardown(args: {
  prisma: PrismaService;
  app: INestApplication;
}) {
  const { prisma, app } = args;

  try {
    await prisma.cleanDb();
    await app.getHttpServer().close();
    app.close();
  } catch (e) {
    console.error(e);
  }
}
