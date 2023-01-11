import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiKeyAuthGuard } from '../auth/apikey-auth.guard';
import { Public } from '../auth/constants';
import { FindTrackedNftsForUserDto } from './find-tracked-nfts-for-user.dto';
import { TrackedNftService } from './tracked-nft.service';
import { CreateTrackedNftDto } from './v2/create-tracked-nft.dto';

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

  @Post('add')
  async add(@Body() payload: CreateTrackedNftDto) {
    return this.service.create(payload);
  }
}
