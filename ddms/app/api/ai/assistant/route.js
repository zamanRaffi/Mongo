import { chatResponse } from '../../../../lib/ai/geminiClient.js';
import connectdb from '../../../../lib/mongodb.js';
import Sale from '../../../../models/Sale.js';

export async function POST(req) {
  try {
    // Parse request body
    const body = await req.json();
    const prompt = body.prompt?.trim();
    if (!prompt) return new Response(JSON.stringify({ error: 'No prompt provided' }), { status: 400 });

    // Connect to MongoDB
    await connectdb();

    // Fetch recent 10 sales for context
    const recentSales = await Sale.find()
      .sort({ date: -1 })
      .limit(10)
      .populate('product');

    const salesSummary = recentSales
      .map(s => `${s.product?.name || s.product} x${s.quantity} = ${s.total}`)
      .join('\n');

    // Prepare messages for AI
    const messages = [
      { role: 'system', content: 'You are a helpful inventory assistant. Answer concisely.' },
      {
        role: 'user',
        content: `Recent sales:\n${salesSummary || 'No recent sales'}\n\nUser question: ${prompt}`
      }
    ];

    // Get AI reply
    const reply = await chatResponse(messages);

    // Return response
    return new Response(JSON.stringify({ reply }), { status: 200 });

  } catch (err) {
    console.error('Gemini Assistant error:', err);
    return new Response(JSON.stringify({ error: err.message || 'AI request failed' }), { status: 500 });
  }
}
