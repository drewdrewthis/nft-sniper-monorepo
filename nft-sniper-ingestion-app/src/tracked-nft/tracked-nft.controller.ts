import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { ApiKeyAuthGuard } from '../auth/apikey-auth.guard';
import { Public } from '../auth/constants';
import { FindTrackedNftsForUserDto } from './find-tracked-nfts-for-user.dto';
import { TrackedNftService } from './tracked-nft.service';

@UseGuards(ApiKeyAuthGuard)
@Controller('tracked-nft')
export class TrackedNftController {
  constructor(private readonly service: TrackedNftService) {}

  @Get('/all')
  @Public()
  getTrackedNfts() {
    return this.service.getTrackedNfts();
  }

  @Get('/filtered')
  findTrackedNftsForUser(@Body() body: FindTrackedNftsForUserDto) {
    return this.service.findBy(body);
  }
}
