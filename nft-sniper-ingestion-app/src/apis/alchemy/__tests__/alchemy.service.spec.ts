import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { AlchemyService } from '../alchemy.service';

describe('AlchemyService', () => {
  let service: AlchemyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [AlchemyService],
    }).compile();

    service = module.get<AlchemyService>(AlchemyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an empty array if no tokens passed in', async () => {
    const result = await service.getNFTMetadataBatch(tokens);
    expect(result).toMatchSnapshot();
  });
});
