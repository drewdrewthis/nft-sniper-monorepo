import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DEMO_NFTS } from '../constants';
import { DemoService } from './demo.service';
import { DemoNftPayload } from './types';

@Controller('demo')
@UseGuards(AuthGuard(['jwt', 'api-key']))
export class DemoController {
  logger = new Logger(DemoController.name);

  constructor(private readonly service: DemoService) {}

  @Get('nft-data')
  async getNftDemoData(): Promise<DemoNftPayload | void | string> {
    this.logger.log('Demo data requested');
    return this.service.getNftDemoData(DEMO_NFTS);
  }
}
