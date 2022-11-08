import { Module } from '@nestjs/common';
import { X2y2Service } from './x2y2.service';

@Module({
  providers: [X2y2Service]
})
export class X2y2Module {}
