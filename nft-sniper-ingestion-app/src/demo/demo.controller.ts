import { Controller, Get, Logger } from '@nestjs/common';
import { DEMO_NFTS } from '../constants';
import { DemoService } from './demo.service';
import { DemoNftPayload } from './types';

@Controller('demo')
export class DemoController {
  logger = new Logger(DemoController.name);

  constructor(private readonly service: DemoService) {}

  @Get('nft-data')
  async getNftDemoData(): Promise<DemoNftPayload | void | string> {
    this.logger.log('Demo data requested');
    return this.service.getNftDemoData(DEMO_NFTS);
  }
}
