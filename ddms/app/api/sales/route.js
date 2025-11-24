import connectDB from '../../../lib/mongodb';
import Sale from '../../../models/Sale';
import Product from '../../../models/Product';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();
  const items = await Sale.find().populate('items.productId');
  return NextResponse.json({ items }, { status: 200 });
}

export async function POST(req) {
  const { requireAuth } = await import('../../../lib/auth');
  const dec = requireAuth(req);
  if (!dec) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  await connectDB();
  const body = await req.json();

  if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: 'Sale must have at least one item' }, { status: 400 });
  }

  // Validate stock
  for (const i of body.items) {
    const prod = await Product.findById(i.productId);
    if (!prod) return NextResponse.json({ error: `Product not found: ${i.productId}` }, { status: 404 });
    if (prod.quantity < i.quantity) {
      return NextResponse.json({ error: `Not enough stock for ${prod.name}` }, { status: 400 });
    }
  }

  // Decrease stock and calculate totals
  const itemsWithTotal = await Promise.all(
    body.items.map(async (i) => {
      const prod = await Product.findById(i.productId);
      await Product.findByIdAndUpdate(i.productId, { $inc: { quantity: -i.quantity } });
      return { ...i, total: prod.price * i.quantity };
    })
  );

  const totalAmount = itemsWithTotal.reduce((sum, i) => sum + i.total, 0);

  const sale = new Sale({ items: itemsWithTotal, totalAmount });
  await sale.save();

  return NextResponse.json({ ok: true, sale }, { status: 201 });
}

export async function PUT(req) {
  const { requireAuth } = await import('../../../lib/auth');
  const dec = requireAuth(req);
  if (!dec) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  await connectDB();
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: 'Sale ID required' }, { status: 400 });

  const existingSale = await Sale.findById(body.id);
  if (!existingSale) return NextResponse.json({ error: 'Sale not found' }, { status: 404 });

  // Restore stock from previous sale
  for (const i of existingSale.items) {
    await Product.findByIdAndUpdate(i.productId, { $inc: { quantity: i.quantity } });
  }

  // Validate stock for new items
  for (const i of body.items) {
    const prod = await Product.findById(i.productId);
    if (!prod) return NextResponse.json({ error: `Product not found: ${i.productId}` }, { status: 404 });
    if (prod.quantity < i.quantity) {
      return NextResponse.json({ error: `Not enough stock for ${prod.name}` }, { status: 400 });
    }
  }

  // Decrease stock for updated items and calculate totals
  const itemsWithTotal = await Promise.all(
    body.items.map(async (i) => {
      const prod = await Product.findById(i.productId);
      await Product.findByIdAndUpdate(i.productId, { $inc: { quantity: -i.quantity } });
      return { ...i, total: prod.price * i.quantity };
    })
  );

  const totalAmount = itemsWithTotal.reduce((sum, i) => sum + i.total, 0);

  const updatedSale = await Sale.findByIdAndUpdate(
    body.id,
    { items: itemsWithTotal, totalAmount },
    { new: true }
  );

  return NextResponse.json({ ok: true, sale: updatedSale }, { status: 200 });
}

export async function DELETE(req) {
  const { requireAuth } = await import('../../../lib/auth');
  const dec = requireAuth(req);
  if (!dec) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  await connectDB();
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: 'Sale ID required' }, { status: 400 });

  const sale = await Sale.findById(body.id);
  if (!sale) return NextResponse.json({ error: 'Sale not found' }, { status: 404 });

  // Restore stock
  for (const i of sale.items) {
    await Product.findByIdAndUpdate(i.productId, { $inc: { quantity: i.quantity } });
  }

  await Sale.findByIdAndDelete(body.id);

  return NextResponse.json({ ok: true }, { status: 200 });
}
