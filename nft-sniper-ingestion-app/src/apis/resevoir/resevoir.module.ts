import { Module, CacheModule } from '@nestjs/common';
import { ResevoirService } from './resevoir.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ResevoirService],
})
export class ResevoirModule {}
