import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Sale from '../../../models/Sale';
import Product from '../../../models/Product';

const getDates = (period) => {
    const now = new Date();
    const start = new Date();
    if (period === 'monthly') start.setMonth(now.getMonth() - 1);
    else if (period === 'quarterly') start.setMonth(now.getMonth() - 3);
    else start.setDate(now.getDate() - 7); // weekly
    return { start, now };
};

export async function GET(request) {
    await connectDB();
    try {
        const { searchParams } = new URL(request.url);
        const period = searchParams.get('period') || 'monthly';
        const { start, now } = getDates(period);

        // Calculate period covered string for display
        const formattedStart = start.toLocaleDateString('en-US'); 
        const formattedEnd = now.toLocaleDateString('en-US');
        const periodCovered = `${formattedStart} to ${formattedEnd}`;

        // 1. Total Revenue Calculation
        const salesData = await Sale.aggregate([
            { $match: { saleDate: { $gte: start, $lte: now } } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
        ]);
        const totalRevenue = salesData[0]?.totalRevenue || 0;

        // 2. Inventory Stock Value Calculation (Uses $cost from the updated Product Model)
        const inventoryValue = await Product.aggregate([
            // Use $cost for valuation, and $stock for quantity
            { $group: { _id: null, totalValue: { $sum: { $multiply: ['$cost', '$stock'] } } } }, 
        ]);
        const totalStockValue = inventoryValue[0]?.totalValue || 0;

        // 3. Top Products Calculation (unchanged, but necessary for context)
        const topProducts = await Sale.aggregate([
            { $match: { saleDate: { $gte: start, $lte: now } } },
            { $unwind: '$items' },
            { $group: { _id: '$items.productId', totalSold: { $sum: '$items.quantity' } } },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'productDetails' } },
            { $unwind: '$productDetails' },
            { $project: { name: '$productDetails.name', totalSold: 1, _id: 0 } },
        ]);

        return NextResponse.json({
            period,
            periodCovered, // **NEW FIELD**
            totalRevenue,
            topProducts,
            totalStockValue,
            message: 'Analytics fetched successfully',
        }, { status: 200 });

    } catch (error) {
        console.error('Analytics Error:', error);
        return NextResponse.json({ message: 'Failed to fetch analytics', error: error.message }, { status: 500 });
    }
}