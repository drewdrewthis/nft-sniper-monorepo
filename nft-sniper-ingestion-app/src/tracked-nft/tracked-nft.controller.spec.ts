import { Test, TestingModule } from '@nestjs/testing';
import { TrackedNftController } from './tracked-nft.controller';

describe('TrackedNftController', () => {
  let controller: TrackedNftController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackedNftController],
    }).compile();

    controller = module.get<TrackedNftController>(TrackedNftController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
