import { Module } from '@nestjs/common';
import { BullmqService } from './bullmq.service';
import { PrismaService } from '../prisma/prisma.service';
import { X2y2Service } from '../apis/x2y2/x2y2.service';
import { CrawlerServerService } from '../apis/crawler-server/crawler-server.service';

@Module({
  imports: [],
  providers: [BullmqService, PrismaService, X2y2Service, CrawlerServerService],
})
export class BullmqModule {}
