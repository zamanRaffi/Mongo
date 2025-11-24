import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Customer from '../../../models/Customer';

// POST: Create a new customer
export async function POST(request) {
  await connectDB();
  try {
    const body = await request.json();
    const newCustomer = await Customer.create(body);
    return NextResponse.json({ customer: newCustomer, message: 'Customer created successfully' }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
        return NextResponse.json({ message: 'Email or phone already exists.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to create customer', error: error.message }, { status: 500 });
  }
}

// GET: Fetch all customers
export async function GET() {
  await connectDB();
  try {
    const customers = await Customer.find({}).sort({ name: 1 }).lean();
    return NextResponse.json({ customers, message: 'Customers fetched successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch customers', error: error.message }, { status: 500 });
  }
}

// PUT: Update an existing customer
export async function PUT(request) {
  await connectDB();
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ message: 'Missing customer ID for update.' }, { status: 400 });
    }

    // Use findByIdAndUpdate to update the customer record
    const updatedCustomer = await Customer.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!updatedCustomer) {
      return NextResponse.json({ message: 'Customer not found.' }, { status: 404 });
    }

    return NextResponse.json({ customer: updatedCustomer, message: 'Customer updated successfully' }, { status: 200 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ message: 'Email or phone already exists.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to update customer', error: error.message }, { status: 500 });
  }
}

// DELETE: Delete a customer
export async function DELETE(request) {
  await connectDB();
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ message: 'Missing customer ID for deletion.' }, { status: 400 });
    }

    const deletedCustomer = await Customer.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return NextResponse.json({ message: 'Customer not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Customer deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete customer', error: error.message }, { status: 500 });
  }
}