import connectdb from '../../../lib/mongodb';
import Product from '../../../models/Product';
import { createOrUpdateProduct } from '../../../services/productService';

export async function GET(){
  await connectdb();
  const items = await Product.find().populate('category');
  return new Response(JSON.stringify({ items }), { status: 200 });
}

export async function POST(req) {
  const { requireAuth } = await import('../../../lib/auth');
  const dec = requireAuth(req);
  if (!dec) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  const body = await req.json();
  await createOrUpdateProduct(body);

  return new Response(JSON.stringify({ ok: true }), { status: 201 });
}

export async function PUT(req) {
  const { requireAuth } = await import('../../../lib/auth');
  const dec = requireAuth(req);
  if (!dec) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  const body = await req.json();
  await createOrUpdateProduct(body);

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}

export async function DELETE(req){
  const { requireAuth } = await import('../../../lib/auth');
  const dec = requireAuth(req);
  if (!dec) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });

  await connectdb();
  const body = await req.json();
  if (body.id) await Product.findByIdAndDelete(body.id);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
