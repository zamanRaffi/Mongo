import { getEmbedding } from '../../../../lib/ai/providerClient.js';
import { searchEmbeddings } from '../../../../lib/ai/vectorStore.js';
import connectdb from '../../../../lib/mongodb.js';
import Product from '../../../../models/Product.js';

export async function POST(req) {
  await connectdb();
  const body = await req.json();
  const q = body.q || '';
  const topK = body.topK || 10;
  if (!q) return new Response(JSON.stringify({ error: 'no query' }), { status: 400 });

  try {
    const qvec = await getEmbedding(q);
    const results = await searchEmbeddings(qvec, topK);
    const ids = results.map((r) => r.product);
    const items = await Product.find({ _id: { $in: ids } }).populate('category');

    // preserve order by score
    const itemsById = Object.fromEntries(items.map((i) => [String(i._id), i]));
    const ordered = results.map((r) => ({ score: r.score, item: itemsById[String(r.product)] })).filter(x => x.item);

    return new Response(JSON.stringify({ results: ordered }), { status: 200 });
  } catch (err) {
    console.error('Semantic search error', err);
    return new Response(JSON.stringify({ error: 'search failed' }), { status: 500 });
  }
}
