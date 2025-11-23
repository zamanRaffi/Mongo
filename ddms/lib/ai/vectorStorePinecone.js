import { PineconeClient } from '@pinecone-database/pinecone';

const client = new PineconeClient();
let index;

async function init() {
  if (index) return index;
  const apiKey = process.env.PINECONE_API_KEY;
  const env = process.env.PINECONE_ENV;
  const idx = process.env.PINECONE_INDEX || 'products';
  if (!apiKey || !env) throw new Error('PINECONE_API_KEY and PINECONE_ENV required');
  await client.init({ apiKey, environment: env });
  index = client.Index(idx);
  return index;
}

export async function upsertEmbedding(productId, vector, metadata = {}) {
  const idx = await init();
  await idx.upsert({
    vectors: [
      { id: String(productId), values: vector, metadata },
    ],
  });
  return { product: productId };
}

export async function searchEmbeddings(queryVector, topK = 10) {
  const idx = await init();
  const resp = await idx.query({ queryRequest: { vector: queryVector, topK, includeMetadata: true } });
  const matches = resp.matches || resp.results?.[0]?.matches || [];
  return matches.map(m => ({ product: m.id, score: m.score, metadata: m.metadata }));
}
