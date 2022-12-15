import { Test, TestingModule } from '@nestjs/testing';
import { WalletAllowListService } from './wallet-allow-list.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('WalletAllowListService', () => {
  let service: WalletAllowListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [WalletAllowListService],
    }).compile();

    service = module.get<WalletAllowListService>(WalletAllowListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
