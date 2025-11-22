import connectdb from '../../../lib/mongodb';
import Supplier from '../../../models/Supplier';

export async function GET(){
  await connectdb();
  const items = await Supplier.find();
  return new Response(JSON.stringify({ items }), { status: 200 });
}

export async function POST(req){
  const { requireAuth } = await import('../../../lib/auth');
  const dec = requireAuth(req);
  if (!dec) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });

  await connectdb();
  const body = await req.json();
  const s = new Supplier(body);
  await s.save();
  return new Response(JSON.stringify({ ok: true }), { status: 201 });
}

export async function PUT(req){
  const { requireAuth } = await import('../../../lib/auth');
  const dec = requireAuth(req);
  if (!dec) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });

  await connectdb();
  const body = await req.json();
  if (body.id) await Supplier.findByIdAndUpdate(body.id, body);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}

export async function DELETE(req){
  const { requireAuth } = await import('../../../lib/auth');
  const dec = requireAuth(req);
  if (!dec) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });

  await connectdb();
  const body = await req.json();
  if (body.id) await Supplier.findByIdAndDelete(body.id);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
