import { Test, TestingModule } from '@nestjs/testing';
import { OpenseaController } from '../opensea.controller';
import { PrismaService } from '../../prisma';
import { OpenseaService } from '../opensea.service';
import { ConfigService } from '@nestjs/config';

describe('OpenseaController', () => {
  let controller: OpenseaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpenseaController],
      providers: [OpenseaService, PrismaService, ConfigService],
    })
      .overrideProvider(PrismaService)
      .useValue({
        saveSingleNftData: jest.fn(),
      })
      .compile();

    controller = module.get<OpenseaController>(OpenseaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST #crawler-dump', () => {
    it('should be able to save correctly', async () => {
      await controller.receiveCrawlerDump(
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('./sample-data/data-dump.json'),
      );
    });
  });
});
