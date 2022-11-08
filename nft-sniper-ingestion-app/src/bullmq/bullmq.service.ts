import { Injectable, Logger } from '@nestjs/common';
import IORedis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma';
import { X2Y2Scheduler } from './schedulers/x2y2';
import { CrawlerServerService } from '../apis/crawler-server/crawler-server.service';
import { OpenSeaScheduler } from './schedulers/opensea';
import { Scheduler } from '../types';
import { X2y2Service } from '../apis/x2y2';
import {
  addQueueEventListeners,
  addWorkerListeners,
  cleanUpQueue,
} from './helpers';
import { Queue } from 'bullmq';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';

@Injectable()
export class BullmqService {
  private readonly logger = new Logger(BullmqService.name);
  redis: IORedis;
  queues: Queue[];

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private x2yx: X2y2Service,
    private crawlerServerService: CrawlerServerService,
  ) {
    const redisUrl = `${configService.get('REDIS_HOST')}:${configService.get(
      'REDIS_PORT',
    )}`;

    this.redis = new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
      reconnectOnError: function (err) {
        // https://ioredis.readthedocs.io/en/stable/README/#auto-reconnect
        const targetError = 'READONLY';
        if (err.message.slice(0, targetError.length) === targetError) {
          // Only reconnect when the error starts with "READONLY"
          return true; // or `return 1;`
        }

        return 2;
      },
    });
  }

  async start() {
    const x2y2 = new X2Y2Scheduler(this.prisma, this.x2yx, this.redis);
    const opensea = new OpenSeaScheduler(this.redis, this.crawlerServerService);

    ('Starting BullMQ');
    this.logger.log('Cleaning up');
    const schedulers = [x2y2, opensea];
    await Promise.all(schedulers.map(cleanUpQueue));
    schedulers.map(addWorkerListeners);
    schedulers.map((scheduler) =>
      addQueueEventListeners(scheduler, this.redis),
    );

    console.log('Adding jobs and starting scheduler');
    await this.addX2Y2Job(x2y2);
    // addOpenSeaJob(opensea);

    this.queues = [x2y2.queue, opensea.queue];
  }

  async addX2Y2Job({ queue }: Scheduler) {
    await queue
      .add(
        'Fetch Tokens',
        { msg: 'Running job' },
        {
          repeat: {
            every: Number(
              this.configService.get('X2Y2_SCHEDULER_FREQUENCY_MS', {
                infer: true,
              }),
            ),
            immediately: true,
            jobId: 'x2y2-token-fetcher',
          },
        },
      )
      .then(({ id, repeatJobKey }) =>
        console.log('Job added successfully:', { id, repeatJobKey }),
      )
      .catch((e) => {
        console.error('Failed to add job to x2y2 scheduler', e);
      });
  }

  async addOpenSeaJob({ queue }: Scheduler) {
    await queue
      .add(
        'Crawl',
        { msg: 'Running job' },
        {
          repeat: {
            every: Number(process.env.SCHEDULER_FREQUENCY_MS),
            immediately: true,
            jobId: 'scrape-opensea',
          },
        },
      )
      .then(({ id, repeatJobKey }) =>
        this.logger.log('Job added successfully:', { id, repeatJobKey }),
      )
      .catch((e) => {
        this.logger.error('Failed to add job to opensea scheduler', e);
      });
  }

  startBullboard(serverAdapter: ExpressAdapter) {
    this.logger.log('Starting bullboard');

    try {
      createBullBoard({
        queues: this.queues.map((queue) => new BullAdapter(queue)),
        serverAdapter,
      });
    } catch (e) {
      this.logger.error(e);
    }
  }
}
