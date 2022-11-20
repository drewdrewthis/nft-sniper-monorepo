import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { DemoService } from '../demo.service';
import { CacheModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpRecordingService } from '../../http-recording';
import { ResevoirService } from '../../apis/resevoir';
import { AlchemyService } from '../../apis/alchemy';

jest.setTimeout(30000);

/**
 * For the golden tests to work here, you'll need to import the API keys, or:
 * yarn dotenv -e .env yarn jest nft-sniper-ingestion-app/src/demo/__tests__/demo.service.spec.ts
 */

const tokens = [
  {
    contractAddress: '0x60E4d786628Fea6478F785A6d7e704777c86a7c6',
    tokenId: 9018,
  },
  {
    contractAddress: '0x60E4d786628Fea6478F785A6d7e704777c86a7c6',
    tokenId: 3927,
  },
  {
    contractAddress: '0xed5af388653567af2f388e6224dc7c4b3241c544',
    tokenId: 2743,
  },
  {
    contractAddress: '0x394E3d3044fC89fCDd966D3cb35Ac0B32B0Cda91',
    tokenId: 6781,
  },
];

describe('DemoService', () => {
  let service: DemoService;
  let httpRecordingService: HttpRecordingService;

  beforeAll(() => {
    httpRecordingService = new HttpRecordingService(__filename);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, CacheModule.register()],
      providers: [DemoService, ResevoirService, AlchemyService, ConfigService],
    }).compile();

    service = module.get<DemoService>(DemoService);
  });

  afterAll(() => {
    httpRecordingService.tearDown();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to get nft demo data', async () => {
    const result = await service.getNftDemoData(tokens);
    expect(result).toMatchSnapshot();
  });
});
