import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { X2y2Service } from '../x2y2.service';

process.env.X2Y2_API = '123';
process.env.X2Y2_API_KEY = '123';

const mockHttpService = {
  axiosRef: {
    get: (url: string) => {
      if (url.includes('offers')) {
        return {
          data: {
            data: require('./sampleData/offers.json'),
          },
        };
      }
      if (url.includes('events')) {
        return {
          data: {
            data: require('./sampleData/events.json'),
          },
        };
      }
    },
  },
};

describe('X2y2Service', () => {
  let service: X2y2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, HttpModule],
      providers: [X2y2Service],
    })
      .overrideProvider(HttpService)
      .useValue(mockHttpService)
      .compile();

    service = module.get<X2y2Service>(X2y2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#fetchNormalizedTokenData', () => {
    it('should return the correct results', async () => {
      const result = await service.fetchNormalizedTokenData([
        {
          tokenId: 1234,
          contractAddress: 'some-address',
        },
        {
          tokenId: 1234,
          contractAddress: 'some-address',
        },
      ]);

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const data = require('./sampleData/normalized-return-data.json');

      expect(JSON.parse(JSON.stringify(result))).toEqual(data);
    });
  });
});
