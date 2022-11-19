import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { ResevoirService } from '../apis/resevoir';
import { AppService } from '../app.service';
import { AlchemyService } from '../apis/alchemy/alchemy.service';
import { CacheModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResevoirModule } from '../apis/resevoir/resevoir.module';
import { HttpRecordingService } from '../http-recording/http-recording.service';

jest.setTimeout(15000);

process.env.ALCHEMY_API_KEY_ETH = 'bogus_key';

/**
 * For the golden tests to work here, you'll need to import the API keys, or:
 * yarn dotenv -e .env yarn jest nft-sniper-ingestion-app/src/__tests__/app.service.spec.ts
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

describe('ResevoirService', () => {
  let service: AppService;
  let httpRecordingService: HttpRecordingService;

  beforeAll(() => {
    httpRecordingService = new HttpRecordingService(__filename);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, CacheModule.register(), ResevoirModule],
      providers: [AppService, ResevoirService, AlchemyService, ConfigService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  afterAll(() => {
    httpRecordingService.tearDown();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to get nft demo data', async () => {
    const result = await service.getNftDemoData(tokens);
    console.log(JSON.stringify(result));
    expect(result).toMatchSnapshot();
  });
});
