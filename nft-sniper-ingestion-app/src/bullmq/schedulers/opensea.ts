import { Job, Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { Scheduler } from '../../types.js';
import { CrawlerServerService } from '../../apis/crawler-server/crawler-server.service';

export class OpenSeaScheduler implements Scheduler {
  constructor(
    private redis: IORedis,
    private crawlerServerService: CrawlerServerService,
  ) {
    this.name = 'Crawler Server';
    this.queue = new Queue(this.name, { connection: this.redis });
    this.worker = new Worker(this.name, this.processor, {
      connection: this.redis,
    });
  }
  name: string;
  queue: Queue<any, any, string>;
  worker: Worker<any, any, string>;

  processor = async (job: Job) => {
    console.log('Processing: ', job.id);

    try {
      await this.crawlerServerService.run();
    } catch (e) {
      console.error('Failed to run child process', e);
    }
  };
}
