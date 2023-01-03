import { Test, TestingModule } from '@nestjs/testing';
import { TrackedNftService } from './tracked-nft.service';

describe('TrackedNftService', () => {
  let service: TrackedNftService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrackedNftService],
    }).compile();

    service = module.get<TrackedNftService>(TrackedNftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
