import { Test, TestingModule } from '@nestjs/testing';
import { GoldenResponseService } from './golden-response.service';

describe('GoldenResponseService', () => {
  let service: GoldenResponseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoldenResponseService],
    }).compile();

    service = module.get<GoldenResponseService>(GoldenResponseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
