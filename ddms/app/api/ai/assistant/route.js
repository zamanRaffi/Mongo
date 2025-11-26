import { chatResponse } from '../../../../lib/ai/geminiClient'; 

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "No prompt provided." }), { status: 400 });
    }

    // Since the prompt already contains the inventory context and system instructions, 
    // we simply format it into a message for the Gemini API.
    const messages = [
      {
        role: "system",
        content:
          "You are a smart assistant. You can answer ANY kind of general question normally. " +
          "If the user asks about inventory, products, stock, sales, employees, customers or dashboard data, " +
          "then use the provided context inside the prompt."
      },
      {
        role: "user",
        content: prompt
      }
    ];

    const geminiResponse = await chatResponse(messages);

    return new Response(JSON.stringify({ reply: geminiResponse }), { status: 200 });

  } catch (error) {
    console.error("Assistant API call failed:", error);
    return new Response(JSON.stringify({ error: `Internal server error: ${error.message}` }), { status: 500 });
  }
}