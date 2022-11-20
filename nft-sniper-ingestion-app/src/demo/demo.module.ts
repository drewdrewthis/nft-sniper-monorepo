import { Module } from '@nestjs/common';
import { DemoService } from './demo.service';
import { DemoController } from './demo.controller';
import { AlchemyService } from '../apis/alchemy/alchemy.service';
import { ResevoirService } from '../apis/resevoir';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [DemoService, AlchemyService, ResevoirService],
  controllers: [DemoController],
})
export class DemoModule {}
