"use client";
import { useState, useCallback } from "react";

export default function AiAssistant({
  products = [],
  recentSales = [],
  categories = [],
  employees = [],
  suppliers = [],
  sales = [],
  billings = [],
  customers = [],
}) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState("");

  // --- Build context for AI ---
  const buildContextString = useCallback(() => {
    const productContext = products
      .slice(0, 10)
      .map(
        (p) => `Name: ${p.name}, Stock: ${p.stock || p.quantity || 0}, Price: $${p.price}`
      )
      .join("; ");

    const recentsalesContext = recentSales
      .map(
        (s) =>
          `Sale: Product ${s.product?.name || s.product || "N/A"}, Qty: ${
            s.quantity
          }, Date: ${new Date(s.date || s.saleDate).toLocaleDateString()}`
      )
      .join("; ");

    const categoriesContext = categories.map((c) => `Category: ${c.name}`).join("; ");

    const employeesContext = employees
      .slice(0, 10)
      .map(
        (e) =>
          `Name: ${e.name}, Count: ${e.count || e.quantity || 0}, Email: ${
            e.email || "N/A"
          }, Role: ${e.role || "N/A"}`
      )
      .join("; ");

    const suppliersContext = suppliers
      .slice(0, 10)
      .map(
        (s) =>
          `Name: ${s.name}, Contact: ${s.contact || "N/A"}, Email: ${s.email || "N/A"}`
      )
      .join("; ");

    const salesContext = sales
      .slice(0, 10)
      .map(
        (s) =>
          `Sale ID: ${s._id}, Total Items: ${s.items ? s.items.length : 0}, Date: ${
            s.date ? new Date(s.date).toLocaleDateString() : "N/A"
          }`
      )
      .join("; ");

    const billingsContext = billings
      .slice(0, 10)
      .map(
        (b) =>
          `Billing ID: ${b._id}, Amount: ${b.amount || "N/A"}, Date: ${
            b.date ? new Date(b.date).toLocaleDateString() : "N/A"
          }`
      )
      .join("; ");

    const customersContext = customers
      .slice(0, 10)
      .map(
        (c) =>
          `Customer ID: ${c._id}, Name: ${c.name || "N/A"}, Email: ${c.email || "N/A"}`
      )
      .join("; ");

    return `
      --- DASHBOARD CONTEXT ---
      TOTAL PRODUCTS: ${products.length}
      RECENT INVENTORY (Top 10): ${productContext}
      RECENT SALES (Last 8): ${recentsalesContext}
      CATEGORIES LIST: ${categoriesContext}
      EMPLOYEES LIST: ${employeesContext}
      SUPPLIERS LIST: ${suppliersContext}
      SALES LIST: ${salesContext} 
      BILLINGS LIST: ${billingsContext}
      CUSTOMERS LIST: ${customersContext}
      
      INSTRUCTION: You are an analytical dashboard assistant. Use ONLY the provided context above to answer the user's question. Do not hallucinate data or provide general knowledge. If the specific information needed is not present in the context, state clearly that the data is unavailable.
      -------------------------
    `;
  }, [products, recentSales, categories, employees, suppliers, sales, billings, customers]);

  // --- Basic analytics summary ---
  const totalRevenue = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);

  const topProduct = products
    .map((p) => {
      const soldQty = sales
        .flatMap((s) => s.items || [])
        .filter((i) => i.productId?._id === p._id)
        .reduce((a, i) => a + (i.quantity || 0), 0);
      return { ...p, soldQty };
    })
    .sort((a, b) => b.soldQty - a.soldQty)[0];

  const totalCustomers = customers.length;

  // --- Send AI query ---
  async function send() {
    if (!prompt) return;
    setLoading(true);
    setReply("");

    const context = buildContextString();
    const augmentedPrompt = `${context}\n\nUser Question: ${prompt}`;

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: augmentedPrompt }),
      });

      const json = await res.json();
      setReply(json.reply || json.error || "No reply");
    } catch (err) {
      setReply(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 border rounded bg-white shadow-sm">
  <h3 className="text-xl font-semibold mb-3 text-black">AI Assistant</h3>


  {/* --- Analytics summary inside the AI panel --- */}
  <div className="p-3 mb-3 bg-gray-100 rounded text-black">
    <p>Total Revenue: ${totalRevenue.toFixed(2)}</p>
    {/* <p>
      Top-selling Product: {topProduct?.name || "N/A"} ({topProduct?.soldQty || 0} sold)
    </p> */}
    <p>Total Customers: {totalCustomers}</p>
  </div>

  

  {/* --- User prompt textarea --- */}
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
      {loading ? "Thinking..." : "Send"}
    </button>
    <button
      className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
      onClick={() => {
        setPrompt("");
        setReply("");
      }}
    >
      Clear
    </button>
  </div>

  {/* --- AI reply area --- */}
  <div className="mt-4">
    <div className="font-medium mb-1 text-black">Reply:</div>
    <pre className="whitespace-pre-wrap p-3 bg-gray-100 border rounded text-black">{reply}</pre>
  </div>
</div>

  );
}
