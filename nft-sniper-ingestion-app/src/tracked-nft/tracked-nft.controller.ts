import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/constants';
import { TrackedNftService } from './tracked-nft.service';

@Controller('tracked-nft')
export class TrackedNftController {
  constructor(private readonly service: TrackedNftService) {}

  @Get('/all')
  @Public()
  getTrackedNfts() {
    return this.service.getTrackedNfts();
  }
}
