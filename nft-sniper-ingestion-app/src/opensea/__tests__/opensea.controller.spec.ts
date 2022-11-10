import { Test, TestingModule } from '@nestjs/testing';
import { OpenseaController } from '../opensea.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaModule } from '../../prisma';
import { OpenseaService } from '../opensea.service';

describe('OpenseaController', () => {
  let controller: OpenseaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [OpenseaController],
      providers: [OpenseaService, PrismaService],
    }).compile();

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
