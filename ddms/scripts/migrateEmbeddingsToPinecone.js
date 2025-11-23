import dotenv from 'dotenv';
dotenv.config();

import connectdb from '../lib/mongodb.js';
import ProductEmbedding from '../models/ProductEmbedding.js';
import { upsertEmbedding as upsertPine } from '../lib/ai/vectorStorePinecone.js';

async function migrate({ batch = 100 } = {}) {
  if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_ENV) {
    console.error('PINECONE_API_KEY and PINECONE_ENV must be set');
    process.exit(1);
  }
  await connectdb();
  const total = await ProductEmbedding.countDocuments();
  console.log(`Found ${total} embeddings to migrate`);

  let skip = 0;
  while (skip < total) {
    const docs = await ProductEmbedding.find().skip(skip).limit(batch).lean();
    for (const d of docs) {
      try {
        await upsertPine(d.product, d.vector, d.metadata || {});
      } catch (err) {
        console.error('Failed to upsert', d.product, err.message || err);
      }
    }
    skip += docs.length;
    console.log(`Migrated ${skip}/${total}`);
  }
  console.log('Migration complete');
  process.exit(0);
}

migrate().catch((err) => { console.error(err); process.exit(1); });
