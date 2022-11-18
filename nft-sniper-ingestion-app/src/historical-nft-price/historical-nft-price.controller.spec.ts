import { Test, TestingModule } from '@nestjs/testing';
import { HistoricalNftPriceController } from './historical-nft-price.controller';
import { HistoricalNftPriceService } from './historical-nft-price.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('HistoricalNftPriceController', () => {
  let controller: HistoricalNftPriceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoricalNftPriceController],
      providers: [HistoricalNftPriceService, PrismaService, ConfigService],
    }).compile();

    controller = module.get<HistoricalNftPriceController>(
      HistoricalNftPriceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
