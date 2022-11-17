import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { GoldenResponseService } from '../../../golden-response/golden-response.service';
import { ResevoirService } from '../resevoir.service';

jest.setTimeout(15000);

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
  let service: ResevoirService;
  let goldenService: GoldenResponseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [ResevoirService],
    }).compile();
    const axios = module.get(HttpService).axiosRef;

    goldenService = new GoldenResponseService(axios, __filename);
    goldenService.createInterceptor();
    goldenService.createMock();

    service = module.get<ResevoirService>(ResevoirService);
  });

  afterAll(() => {
    goldenService.tearDown();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to get listings for tokens', async () => {
    const result = await service.fetchLowestListings(tokens);
    expect(result).toMatchSnapshot();
  });

  it('should be able to get offers/bids for tokens', async () => {
    const result = await service.fetchHighestBids(tokens);
    expect(result).toMatchSnapshot();
  });

  it('should be able to get aggregate data for tokens', async () => {
    const result = await service.fetchAggregateNftData(tokens);
    expect(result).toMatchSnapshot();
  });
});
