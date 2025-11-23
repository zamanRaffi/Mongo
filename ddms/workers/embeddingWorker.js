import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import connectdb from '../lib/mongodb.js';
import Product from '../models/Product.js';
import { getEmbedding } from '../lib/ai/providerClient.js';
import { upsertEmbedding } from '../lib/ai/vectorStore.js';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

const worker = new Worker('embeddings', async job => {
  const { productId } = job.data;
  await connectdb();
  const product = await Product.findById(productId).lean();
  if (!product) throw new Error('Product not found ' + productId);

  let text = `${product.name || ''} ${product.sku || ''} ${product.description || ''}`;
  if (product.category) text += ` ${product.category}`;

  try {
    const vector = await getEmbedding(text);
    await upsertEmbedding(productId, vector, { name: product.name });
    return { ok: true };
  } catch (err) {
    console.error('Embedding worker error', err);
    throw err;
  }
}, { connection });

worker.on('completed', job => {
  console.log('Embedding job completed', job.id, job.name);
});

worker.on('failed', (job, err) => {
  console.error('Embedding job failed', job?.id, err.message || err);
});

console.log('Embedding worker started');
