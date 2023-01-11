import { QueueEvents } from 'bullmq';
import { Scheduler } from '../types';
import IORedis from 'ioredis';

export async function cleanUpQueue({ queue }: Scheduler) {
  await queue.drain().catch((e) => {
    console.error('Failed to drain queue: ' + queue.name, e);
  });

  await queue.obliterate().catch((e) => {
    console.error('Failed to obliterate queue: ' + queue.name, e);
  });
}

export function addWorkerListeners({ worker }: Scheduler) {
  // Add listeners to console feedback
  worker.on('completed', (job) => {
    console.log(`${job.id} has completed!`);
  });

  worker.on('failed', (job, err) => {
    console.log(`${job?.id} has failed with ${err.message}`);
  });

  worker.on('error', console.error);
}

export function addQueueEventListeners({ name }: Scheduler, redis: IORedis) {
  const queueEvents = new QueueEvents(name, { connection: redis });
  // Instead, provide a connection to use the options from your existing ioredis instance

  queueEvents.on('waiting', ({ jobId }) => {
    console.log(`A job with ID ${jobId} is waiting`);
  });

  queueEvents.on('active', ({ jobId, prev }) => {
    console.log(`Job ${jobId} is now active; previous status was ${prev}`);
  });

  queueEvents.on('completed', ({ jobId, returnvalue }) => {
    console.log(`${jobId} has completed and returned ${returnvalue}`);
  });

  queueEvents.on('failed', ({ jobId, failedReason }) => {
    console.log(`${jobId} has failed with reason ${failedReason}`);
  });
}
