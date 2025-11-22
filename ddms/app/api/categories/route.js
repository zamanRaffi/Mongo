import connectdb from '../../../lib/mongodb';
import Category from '../../../models/Category';

export async function GET() {
  await connectdb();
  const items = await Category.find();
  return new Response(JSON.stringify({ items }), { status: 200 });
}

export async function POST(req) {
  // require auth
  const { requireAuth } = await import('../../../lib/auth');
  const dec = requireAuth(req);
  if (!dec) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });

  await connectdb();
  const body = await req.json();
  const cat = new Category({ name: body.name });
  await cat.save();
  return new Response(JSON.stringify({ ok: true }), { status: 201 });
}

export async function PUT(req) {
  const { requireAuth } = await import('../../../lib/auth');
  const dec = requireAuth(req);
  if (!dec) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });

  await connectdb();
  const body = await req.json();
  await Category.findByIdAndUpdate(body.id, { name: body.name });
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}

export async function DELETE(req) {
  const { requireAuth } = await import('../../../lib/auth');
  const dec = requireAuth(req);
  if (!dec) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });

  await connectdb();
  const body = await req.json();
  await Category.findByIdAndDelete(body.id);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
