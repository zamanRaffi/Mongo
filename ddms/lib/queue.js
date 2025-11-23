import { Queue } from 'bullmq';
import IORedis from 'ioredis';

// Use your Upstash URL here
const connection = new IORedis(process.env.REDIS_URL, {
  tls: {} // enable TLS for cloud Redis
});

export const embeddingQueue = new Queue('embeddings', { connection });

export default embeddingQueue;
