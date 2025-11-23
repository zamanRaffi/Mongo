import { chatResponse } from '../../../lib/ai/geminiClient'; 
import dbConnect from '../../../lib/dbConnect';
import Product from '../../../models/Product'; 
export async function POST(req) {
  try {
    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "No messages provided." }), { status: 400 });
    }

    const latestUserMessage = messages.findLast(m => m.role === 'user');
    const userQuery = latestUserMessage ? latestUserMessage.content : "";

    let inventoryContext = "";
    try {
      await dbConnect();

      const isInventoryQuery = userQuery.toLowerCase().includes('inventory') ||
                               userQuery.toLowerCase().includes('stock') ||
                               userQuery.toLowerCase().includes('product') ||
                               userQuery.toLowerCase().includes('do you have') ||
                               userQuery.toLowerCase().includes('show me');

      if (isInventoryQuery) {
        const keywords = userQuery.toLowerCase().split(' ').filter(word => word.length > 2);
        const productQuery = {
          $or: [
            { name: { $regex: keywords.join('|'), $options: 'i' } },
            { description: { $regex: keywords.join('|'), $options: 'i' } },
          ]
        };

        const relevantProducts = await Product.find(productQuery)
                                                .limit(5)
                                                .select('name price stock quantity description')
                                                .lean();

        if (relevantProducts.length > 0) {
          inventoryContext = "\n\n--- Relevant Inventory Information ---\n";
          relevantProducts.forEach(p => {
            inventoryContext += `Product Name: ${p.name}, Price: $${p.price}, Stock: ${p.stock || p.quantity || 'N/A'}, Description: ${p.description ? p.description.substring(0, 100) + '...' : 'N/A'}.\n`;
          });
          inventoryContext += "--------------------------------------\n";
        } else {
          inventoryContext = "\n\n--- No specific inventory found matching your query. ---\n";
        }
      } else {
        inventoryContext = "\n\n--- General query, no specific inventory lookup performed. ---\n";
      }

    } catch (dbError) {
      console.error("Database query for inventory failed in /api/chat:", dbError);
      inventoryContext = "\n\n--- Could not retrieve inventory information due to a system error. ---\n";
    }

    const messagesToSendToAI = [
      { role: "system", content: "You are a helpful e-commerce assistant. Use the provided inventory information to answer questions about products and stock levels. If no specific inventory information is provided, state that you don't have real-time access to stock levels for every product but can try to help with general questions." },
      ...messages.slice(0, messages.length - 1)
    ];

    messagesToSendToAI.push({
      role: "user",
      content: `${inventoryContext}\n\n${userQuery}`
    });

    const geminiResponse = await chatResponse(messagesToSendToAI);

    return new Response(JSON.stringify({ response: geminiResponse }), { status: 200 });

  } catch (error) {
    console.error("Gemini API call or processing failed in /api/chat:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}