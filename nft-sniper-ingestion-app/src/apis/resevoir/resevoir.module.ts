import { Module } from '@nestjs/common';
import { ResevoirService } from './resevoir.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '../../config/config.service';

@Module({
  imports: [HttpModule.register({})],
  providers: [ResevoirService, ConfigService],
  exports: [ResevoirService],
})
export class ResevoirModule {}
