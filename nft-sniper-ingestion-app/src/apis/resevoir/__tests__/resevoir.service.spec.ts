import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpRecordingService } from '../../../http-recording';
import { ResevoirService } from '../resevoir.service';

jest.setTimeout(15000);

const tokens = [
  {
    contractAddress: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
    tokenId: 1860,
  },
  {
    contractAddress: '0x09233d553058c2F42ba751C87816a8E9FaE7Ef10',
    tokenId: 4329,
  },
];

describe('ResevoirService', () => {
  let service: ResevoirService;
  let httpRecordingService: HttpRecordingService;

  beforeAll(() => {
    httpRecordingService = new HttpRecordingService(__filename);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [ResevoirService],
    }).compile();

    service = module.get<ResevoirService>(ResevoirService);
  });

  afterAll(() => {
    httpRecordingService.tearDown();
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
