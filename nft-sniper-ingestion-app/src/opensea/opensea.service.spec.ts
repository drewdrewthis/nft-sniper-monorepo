import { Test, TestingModule } from '@nestjs/testing';
import { OpenseaService } from './opensea.service';
import { PrismaService } from '../prisma';
import { ConfigService } from '@nestjs/config';

describe('OpenseaService', () => {
  let service: OpenseaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenseaService, PrismaService, ConfigService],
    }).compile();

    service = module.get<OpenseaService>(OpenseaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
