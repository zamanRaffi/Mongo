import * as mongo from './vectorStoreMongo.js';
let pinecone;
try {
  pinecone = await import('./vectorStorePinecone.js');
} catch (e) {
  pinecone = null;
}

const usePinecone = Boolean(process.env.PINECONE_API_KEY && process.env.PINECONE_ENV);

export const upsertEmbedding = async (productId, vector, metadata = {}) => {
  if (usePinecone && pinecone) return pinecone.upsertEmbedding(productId, vector, metadata);
  return mongo.upsertEmbedding(productId, vector, metadata);
};

export const searchEmbeddings = async (queryVector, topK = 10) => {
  if (usePinecone && pinecone) return pinecone.searchEmbeddings(queryVector, topK);
  return mongo.searchEmbeddings(queryVector, topK);
};

export default { upsertEmbedding, searchEmbeddings };
