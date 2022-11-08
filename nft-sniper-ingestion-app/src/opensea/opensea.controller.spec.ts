import { Test, TestingModule } from '@nestjs/testing';
import { OpenseaController } from './opensea.controller';

describe('OpenseaController', () => {
  let controller: OpenseaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpenseaController],
    }).compile();

    controller = module.get<OpenseaController>(OpenseaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
