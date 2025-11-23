import { reindexAllProducts } from '../../../../services/reindexService.js';

export async function POST(req) {
  const { requireAuth } = await import('../../../../lib/auth');
  const dec = requireAuth(req);
  if (!dec) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });

  try {
    const res = await reindexAllProducts();
    return new Response(JSON.stringify({ ok: true, ...res }), { status: 200 });
  } catch (err) {
    console.error('Reindex error', err);
    return new Response(JSON.stringify({ error: 'reindex failed' }), { status: 500 });
  }
}
