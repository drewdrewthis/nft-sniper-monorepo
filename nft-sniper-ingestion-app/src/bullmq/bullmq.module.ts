import { Module, MiddlewareConsumer, Logger } from '@nestjs/common';
import { BullmqService } from './bullmq.service';
import { PrismaService } from '../prisma/prisma.service';
import { X2y2Service } from '../apis/x2y2/x2y2.service';
import { CrawlerServerService } from '../apis/crawler-server/crawler-server.service';
import { ExpressAdapter } from '@bull-board/express';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [BullmqService, PrismaService, X2y2Service, CrawlerServerService],
})
export class BullmqModule {
  logger = new Logger(BullmqModule.name);
  serverAdapter: ExpressAdapter;

  constructor(private bullmq: BullmqService) {}

  async configure(consumer: MiddlewareConsumer) {
    const basePath = '/bullboard';
    this.serverAdapter = new ExpressAdapter();
    this.serverAdapter.setBasePath(basePath);
    consumer.apply(this.serverAdapter.getRouter()).forRoutes(basePath);
  }

  onModuleInit() {
    // TODO: Don't do this here. This should be mocked
    // somehow
    if (process.env.NODE_ENV !== 'test') {
      this.logger.log(`Initializing Bullmq`);
      this.bullmq.start().then(() => {
        this.bullmq.startBullboard(this.serverAdapter);
      });
    }
  }
}
