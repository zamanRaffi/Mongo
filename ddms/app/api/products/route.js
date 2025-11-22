import connectdb from '../../../lib/mongodb';
import Product from '../../../models/Product';

export async function GET(){
  await connectdb();
  const items = await Product.find().populate('category');
  return new Response(JSON.stringify({ items }), { status: 200 });
}

export async function POST(req) {
  const { requireAuth } = await import('../../../lib/auth');
  const dec = requireAuth(req);
  if (!dec) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  await connectdb();
  const body = await req.json();

  
  if (!body.category) body.category = null;

  const p = new Product(body);
  await p.save();

  return new Response(JSON.stringify({ ok: true }), { status: 201 });
}

export async function PUT(req) {
  const { requireAuth } = await import('../../../lib/auth');
  const dec = requireAuth(req);
  if (!dec) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  await connectdb();
  const body = await req.json();

 
  if (!body.category) body.category = null;

  if (body.id) await Product.findByIdAndUpdate(body.id, body);

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
