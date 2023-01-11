import { Module } from '@nestjs/common';
import { TrackedNftService } from './tracked-nft.service';
import { TrackedNftController } from './tracked-nft.controller';
import { NftServiceV2 } from '../nft/nft.service.v2';
import { NftService } from '../nft/nft.service';
import { NftModule } from '../nft/nft.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [NftModule, ConfigModule, HttpModule],
  providers: [TrackedNftService, NftServiceV2, NftService, ConfigService],
  controllers: [TrackedNftController],
})
export class TrackedNftModule {}
