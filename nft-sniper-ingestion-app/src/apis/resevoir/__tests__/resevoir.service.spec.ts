import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpRecordingService } from '../../../http-recording';
import { ResevoirService } from '../resevoir.service';
import { CacheModule } from '@nestjs/common';
import { ConfigService } from '../../../config/config.service';

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
  {
    // Valhalla
    contractAddress: '0x231d3559aa848bf10366fb9868590f01d34bf240',
    tokenId: 8895,
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
      imports: [HttpModule, CacheModule.register()],
      providers: [ResevoirService, ConfigService],
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
    expect(result).toHaveLength(3);
    expect(result[0].highestBid.price).toBeDefined();
    expect(result[1].lowestListing?.price).toBeDefined();
    expect(result[0].lastSale.price).toBeDefined();
    expect(result[0].currentOwner.owners).toBeDefined();
    expect(result[0].metadata?.image).toBeDefined();
    expect(result[0].metadata?.attributes).toBeDefined();
  });

  it('should be able to get metadata for tokens', async () => {
    const result = await service.fetchMetadataForTokens(tokens);
    expect(result).toMatchSnapshot();
  });
});
