"use client";
import { useState, useCallback } from 'react';

// ADDED: products and recentSales props
export default function AiAssistant({ products = [], recentSales = [] ,categories = [], employees = []}) { 
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState('');

  // Function to build the context string from the data props
  const buildContextString = useCallback(() => {
    // Limit and format product inventory context
    const productContext = products.slice(0, 10).map(p => 
      `Name: ${p.name}, Stock: ${p.stock || p.quantity || 0}, Price: $${p.price}`
    ).join('; ');
    
    // Limit and format sales context
    const salesContext = recentSales.map(s => 
      `Sale: Product ${s.product?.name || s.product || 'N/A'}, Qty: ${s.quantity}, Date: ${new Date(s.date).toLocaleDateString()}`
    ).join('; ');

    // Limit and format categories context
    const categoriesContext = categories.map(c => 
`Category: ${c.name},` 
 ).join('; ');

const employeesContext = employees.slice(0, 10).map(e => 
      `Name: ${e.name}, Count: ${e.count || e.quantity || 0},Email: ${e.email || 'N/A'},Role: ${e.role || 'N/A'}`
    ).join('; ');

    // The full context, including instructions for the AI
    return `
      --- DASHBOARD CONTEXT ---
      TOTAL PRODUCTS: ${products.length}
      RECENT INVENTORY (Top 10): ${productContext}
      RECENT SALES (Last 8): ${salesContext}
      CATEGORIES LIST: ${categoriesContext}
      EMPLOYEES LIST: ${employeesContext}
      
      INSTRUCTION: You are an analytical dashboard assistant. Use ONLY the provided context above to answer the user's question. Do not hallucinate data or provide general knowledge. If the specific information needed is not present in the context, state clearly that the data is unavailable.
      -------------------------
    `;
  }, [products, recentSales, categories]);
  
  async function send() {
    if (!prompt) return;
    setLoading(true);
    setReply('');
    
    // 1. RAG: Build and append the context
    const context = buildContextString();
    const augmentedPrompt = `${context}\n\nUser Question: ${prompt}`;
    
    try {
      // Send the AUGMENTED prompt to the backend
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: augmentedPrompt }), // Send the augmented prompt
      });
      
      const json = await res.json();
      if (json.reply) setReply(json.reply);
      else setReply(json.error || 'No reply');
      
    } catch (err) {
      setReply(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 border rounded bg-white shadow-sm">
      <h3 className="text-xl font-semibold mb-3 text-black">AI Assistant</h3>
      
      <textarea
        className="w-full p-3 border rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={5}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask about inventory, e.g. 'How many red shirts are in stock?'"
      />
      
      <div className="flex gap-3 mt-3">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={send}
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Send'}
        </button>
        <button
          className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
          onClick={() => { setPrompt(''); setReply(''); }}
        >
          Clear
        </button>
      </div>
      
      <div className="mt-4">
        <div className="font-medium mb-1 text-black">Reply:</div>
        <pre className="whitespace-pre-wrap p-3 bg-gray-100 border rounded text-black">{reply}</pre>
      </div>
    </div>
  );
}