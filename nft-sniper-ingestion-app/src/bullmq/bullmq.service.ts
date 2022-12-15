import { Injectable, Logger } from '@nestjs/common';
import IORedis from 'ioredis';
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
import { ConfigService } from '../config/config.service';

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

    this.logger.log('Starting BullMQ');

    this.logger.log('Cleaning up');
    const schedulers = [x2y2, opensea];
    await this.resetSchedulers(schedulers);

    schedulers.map(addWorkerListeners);
    schedulers.map((scheduler) =>
      addQueueEventListeners(scheduler, this.redis),
    );

    console.log('Adding jobs and starting scheduler');
    await this.addX2Y2Job(x2y2);
    await this.addOpenSeaJob(opensea);

    this.queues = [x2y2.queue, opensea.queue];
  }

  async close() {
    this.logger.log('Quitting Redis');
    // return this.redis.shutdown();
  }

  async resetSchedulers(schedulers: Scheduler[]) {
    return Promise.all(schedulers.map(cleanUpQueue));
  }

  async addX2Y2Job({ queue }: Scheduler) {
    const frequency = this.configService.envVars.X2Y2_SCHEDULER_FREQUENCY_MS;

    if (frequency < 1) {
      return;
    }

    await queue
      .add(
        'Fetch Tokens',
        { msg: 'Running job' },
        {
          repeat: {
            every: Number(frequency),
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
    const frequency = this.configService.envVars.OPENSEA_SCHEDULER_FREQUENCY_MS;

    if (frequency < 1) {
      return;
    }

    await queue
      .add(
        'Crawl',
        { msg: 'Running job' },
        {
          repeat: {
            every: frequency,
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
