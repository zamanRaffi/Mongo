import connectdb from '../../../lib/mongodb';
import Billing from '../../../models/Billing';

export async function GET(){
  await connectdb();
  const items = await Billing.find().populate('sale');
  return new Response(JSON.stringify({ items }), { status: 200 });
}

export async function POST(req){
  const { requireAuth } = await import('../../../lib/auth');
  const dec = requireAuth(req);
  if (!dec) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });

  await connectdb();
  const body = await req.json();
  const b = new Billing(body);
  await b.save();
  return new Response(JSON.stringify({ ok: true }), { status: 201 });
}
