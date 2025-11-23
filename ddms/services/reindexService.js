import connectdb from '../lib/mongodb.js';
import Product from '../models/Product.js';
import { embeddingQueue } from '../lib/queue.js';

export async function reindexAllProducts({ batchSize = 20 } = {}) {
  await connectdb();
  const all = await Product.find().lean();
  const total = all.length;
  let i = 0;
  for (const p of all) {
    try {
      await embeddingQueue.add('index-product', { productId: String(p._id) }, { attempts: 3, backoff: { type: 'exponential', delay: 1000 } });
    } catch (err) {
      console.error('Failed to enqueue reindex job', p._id, err.message || err);
    }
    i++;
    if (i % batchSize === 0) await new Promise(r => setTimeout(r, 500));
  }
  return { enqueued: total };
}
