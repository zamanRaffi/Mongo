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

  const buildContextString = useCallback(() => {
    const productContext = products
      .slice(0, 10)
      .map(
        (p) =>
          `Name: ${p.name}, Stock: ${p.stock || p.quantity || 0}, Price: $${p.price}`
      )
      .join("; ");

    const recentsalesContext = recentSales
      .map(
        (s) =>
          `Sale: Product ${s.product?.name || s.product || "N/A"}, Qty: ${s.quantity}, Date: ${new Date(s.date || s.saleDate).toLocaleDateString()}`
      )
      .join("; ");

    const categoriesContext = categories.map((c) => `Category: ${c.name}`).join("; ");
    const employeesContext = employees
      .slice(0, 10)
      .map(
        (e) =>
          `Name: ${e.name}, Count: ${e.count || e.quantity || 0}, Email: ${e.email || "N/A"}, Role: ${e.role || "N/A"}`
      )
      .join("; ");

    const suppliersContext = suppliers
      .slice(0, 10)
      .map((s) => `Name: ${s.name}, Contact: ${s.contact || "N/A"}, Email: ${s.email || "N/A"}`)
      .join("; ");

    const salesContext = sales
      .slice(0, 10)
      .map((s) => `Sale ID: ${s._id}, Total Items: ${s.items ? s.items.length : 0}, Date: ${s.date ? new Date(s.date).toLocaleDateString() : "N/A"}`)
      .join("; ");

    const billingsContext = billings
      .slice(0, 10)
      .map((b) => `Billing ID: ${b._id}, Amount: ${b.amount || "N/A"}, Date: ${b.date ? new Date(b.date).toLocaleDateString() : "N/A"}`)
      .join("; ");

    const customersContext = customers
      .slice(0, 10)
      .map((c) => `Customer ID: ${c._id}, Name: ${c.name || "N/A"}, Email: ${c.email || "N/A"}`)
      .join("; ");

    return `
--- DASHBOARD CONTEXT ---
TOTAL PRODUCTS: ${products.length}
RECENT INVENTORY: ${productContext}
RECENT SALES: ${recentsalesContext}
CATEGORIES: ${categoriesContext}
EMPLOYEES: ${employeesContext}
SUPPLIERS: ${suppliersContext}
SALES: ${salesContext}
BILLINGS: ${billingsContext}
CUSTOMERS: ${customersContext}

INSTRUCTION:
- If the question is about inventory, sales, customers, products, billing → use ONLY the context above.
- If the question is general → answer normally.
- Never say “data unavailable” unless the question is specifically about dashboard data.
`;
  }, [products, recentSales, categories, employees, suppliers, sales, billings, customers]);

  const totalRevenue = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
  const totalCustomers = customers.length;

  async function send() {
    if (!prompt.trim()) return;
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
    <div className="p-6 rounded-2xl shadow-xl bg-white/40 backdrop-blur-md border border-white/30 mx-auto text-gray-800">
      <h3 className="text-2xl font-extrabold mb-4">AI Assistant</h3>

      {/* Analytics */}
      <div className="flex gap-6 p-4 rounded-xl bg-white/30 mb-4 backdrop-blur-sm">
        <div>Total Revenue: <span className="font-bold">${totalRevenue.toFixed(2)}</span></div>
        <div>Total Customers: <span className="font-bold">{totalCustomers}</span></div>
      </div>

      {/* Textarea */}
      <textarea
        className="w-full p-4 rounded-xl bg-white/30 border border-white/40 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 backdrop-blur-sm mb-3"
        rows={5}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
          }
        }}
        placeholder="Ask about inventory, sales, customers, products, billing..."
      />

      {/* Buttons */}
      <div className="flex gap-3 mb-3">
        <button
          className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-semibold disabled:opacity-50"
          onClick={send}
          disabled={loading}
        >
          {loading ? "Thinking..." : "Send"}
        </button>
        <button
          className="flex-1 py-3 bg-white/30 hover:bg-white/40 rounded-xl text-gray-800 font-semibold"
          onClick={() => {
            setPrompt("");
            setReply("");
          }}
        >
          Clear
        </button>
      </div>

      {/* Reply Box */}
      <div className="rounded-xl bg-white/30 backdrop-blur-sm p-4 max-h-80 overflow-y-auto">
        <div className="font-semibold mb-2">Reply:</div>
        <pre className="whitespace-pre-wrap">{reply}</pre>
      </div>
    </div>
  );
}
