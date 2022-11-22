import { Module } from '@nestjs/common';
import { DemoService } from './demo.service';
import { DemoController } from './demo.controller';
import { HttpModule } from '@nestjs/axios';
import { ResevoirModule } from '../apis/resevoir/resevoir.module';
import { AlchemyModule } from '../apis/alchemy/alchemy.module';

@Module({
  imports: [HttpModule, ResevoirModule, AlchemyModule],
  providers: [DemoService],
  exports: [DemoService],
  controllers: [DemoController],
})
export class DemoModule {}
