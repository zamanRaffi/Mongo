import dbConnect from '../../../lib/dbConnect'; 
import Product from '../../../models/Product'; 

export async function POST(req) {
  try {
    await dbConnect();

    const { query } = await req.json();

    if (!query) {
      return new Response(JSON.stringify({ error: "No search query provided." }), { status: 400 });
    }

    const keywords = query.toLowerCase().split(' ').filter(word => word.length > 2);

    let products = [];
    if (keywords.length > 0) {
        const productQuery = {
            $or: [
                { name: { $regex: keywords.join('|'), $options: 'i' } },
                { description: { $regex: keywords.join('|'), $options: 'i' } },
            ]
        };
        products = await Product.find(productQuery)
                                .limit(5)
                                .select('name price stock quantity description')
                                .lean();
    } else {
        products = [];
    }

    return new Response(JSON.stringify({ products }), { status: 200 });

  } catch (error) {
    console.error("Failed to retrieve inventory:", error);
    return new Response(JSON.stringify({ error: "Internal server error." }), { status: 500 });
  }
}