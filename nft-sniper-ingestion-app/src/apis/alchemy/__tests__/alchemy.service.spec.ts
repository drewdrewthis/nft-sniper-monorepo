import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { AlchemyService } from '../alchemy.service';
import { CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

process.env.ALCHEMY_API_KEY_ETH = 'bogus_key';

describe('AlchemyService', () => {
  let service: AlchemyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, CacheModule.register(), ConfigModule],
      providers: [AlchemyService],
    }).compile();

    service = module.get<AlchemyService>(AlchemyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an empty array if no tokens passed in', async () => {
    const result = await service.getNFTMetadataBatch([]);
    expect(result).toEqual([]);
  });
});
