import connectdb from '../../../lib/mongodb';
import Employee from '../../../models/Employee';

export async function GET() {
  await connectdb();
  const items = await Employee.find();
  return new Response(JSON.stringify({ items }), { status: 200 });
}

export async function POST(req) {
  const { requireAuth } = await import('../../../lib/auth');
  const dec = requireAuth(req);
  if (!dec)
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });

  await connectdb();
  const body = await req.json();
  const e = new Employee(body);
  await e.save();
  return new Response(JSON.stringify({ ok: true }), { status: 201 });
}

export async function PUT(req) {
  const { requireAuth } = await import('../../../lib/auth');
  const dec = requireAuth(req);
  if (!dec)
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });

  await connectdb();
  const body = await req.json();
  if (body.id) await Employee.findByIdAndUpdate(body.id, body);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}

export async function DELETE(req) {
  const { requireAuth } = await import('../../../lib/auth');
  const dec = requireAuth(req);
  if (!dec)
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });

  await connectdb();
  const body = await req.json();
  if (body.id) await Employee.findByIdAndDelete(body.id);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
