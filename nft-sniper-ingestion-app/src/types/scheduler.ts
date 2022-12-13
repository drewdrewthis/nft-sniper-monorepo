import { Queue, Worker } from 'bullmq';

export interface Scheduler {
  name: string;
  queue: Queue;
  worker: Worker;
}
