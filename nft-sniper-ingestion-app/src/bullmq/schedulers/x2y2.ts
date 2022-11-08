import { Job, Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { X2y2Service } from '../../apis/x2y2';
import { PrismaService } from '../../prisma';
import { Scheduler } from '../../types';

export class X2Y2Scheduler implements Scheduler {
  constructor(
    private prisma: PrismaService,
    private x2y2: X2y2Service,
    private redis: IORedis,
  ) {
    this.name = 'X2Y2 Scheduler';
    this.queue = new Queue(this.name, { connection: this.redis });
    this.worker = new Worker(this.name, this.processor, {
      connection: this.redis,
    });
  }
  name: string;
  queue: Queue<any, any, string>;
  worker: Worker<any, any, string>;

  ingest = async () => {
    const tokens = await this.prisma.getTrackedNfts();
    const data = await this.x2y2.fetchNormalizedTokenData(tokens);
    await this.prisma.saveMultipleNftData(data);
  };

  processor = async (job: Job) => {
    console.log('Processing: ', job.id);

    try {
      await this.ingest();
    } catch (e) {
      console.error('Failed to run child process', e);
    }
  };
}
