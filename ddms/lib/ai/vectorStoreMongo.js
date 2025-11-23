import connectdb from '../../lib/mongodb.js';
import ProductEmbedding from '../../models/ProductEmbedding.js';

function dot(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

function norm(a) {
  return Math.sqrt(a.reduce((s, v) => s + v * v, 0));
}

export async function upsertEmbedding(productId, vector, metadata = {}) {
  await connectdb();
  const existing = await ProductEmbedding.findOne({ product: productId });
  if (existing) {
    existing.vector = vector;
    existing.metadata = metadata;
    await existing.save();
    return existing;
  }
  const doc = new ProductEmbedding({ product: productId, vector, metadata });
  await doc.save();
  return doc;
}

// Naive search: fetch all embeddings, compute cosine similarity in JS.
// For small catalogs this is fine; swap for a vector DB for scale.
export async function searchEmbeddings(queryVector, topK = 10) {
  await connectdb();
  const all = await ProductEmbedding.find({}, { product: 1, vector: 1, metadata: 1 }).lean();
  const qnorm = norm(queryVector);
  const scored = all.map((doc) => {
    const vnorm = norm(doc.vector);
    const score = qnorm && vnorm ? dot(queryVector, doc.vector) / (qnorm * vnorm) : 0;
    return { product: doc.product, score, metadata: doc.metadata };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}
