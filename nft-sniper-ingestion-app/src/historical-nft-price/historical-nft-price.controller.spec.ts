import { Test, TestingModule } from '@nestjs/testing';
import { HistoricalNftPriceController } from './historical-nft-price.controller';

describe('HistoricalNftPriceController', () => {
  let controller: HistoricalNftPriceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoricalNftPriceController],
    }).compile();

    controller = module.get<HistoricalNftPriceController>(HistoricalNftPriceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
