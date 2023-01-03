import { Module } from '@nestjs/common';
import { TrackedNftService } from './tracked-nft.service';
import { TrackedNftController } from './tracked-nft.controller';

@Module({
  providers: [TrackedNftService],
  controllers: [TrackedNftController],
})
export class TrackedNftModule {}
