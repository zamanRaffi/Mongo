"use client";

import useSWR from "swr";
import { useState } from "react";
import DataTable from "../../components/DataTable";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function SalesPage() {
  const { data, mutate } = useSWR("/api/sales", fetcher);
  const { data: productData } = useSWR("/api/products", fetcher);

  const items = data?.items || [];
  const products = productData?.items || [];

  const [show, setShow] = useState(false);
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editingId, setEditingId] = useState(null);

  async function save() {
    if (!product) return alert("Please select a product");

    const payload = { product, quantity };
    const method = editingId ? "PUT" : "POST";

    if (editingId) payload.id = editingId;

    const res = await fetch("/api/sales", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      mutate();
      setShow(false);
      setProduct("");
      setQuantity("");
      setEditingId(null);
    }
  }

  function openEdit(row) {
    setEditingId(row._id);
    setProduct(row.product?._id || row.product || "");
    setQuantity(row.quantity || 1);
    setShow(true);
  }

  async function remove(id) {
    if (!confirm("Delete this sale?")) return;

    await fetch("/api/sales", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    mutate();
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sales</h1>

        <button
          onClick={() => setShow(true)}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
        >
          New Sale
        </button>
      </header>

      <div className="bg-white text-black shadow-lg rounded-xl overflow-hidden">
        <DataTable
          columns={["Product", "Quantity", "Total"]}
          data={items}
          actions={[
            { label: "Edit", onClick: (row) => openEdit(row) },
            { label: "Delete", onClick: (row) => remove(row._id) },
          ]}
        />
      </div>

      {show && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white w-[90%] max-w-md p-6 rounded-2xl shadow-2xl border border-gray-200 animate-scaleIn">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editingId ? "Edit Sale" : "New Sale"}
            </h2>

            <div className="space-y-4 text-black">
              <select
                className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} — ${p.price}
                  </option>
                ))}
              </select>

              <input
                className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="flex justify-end mt-5 gap-3">
              <button
                onClick={() => {
                  setShow(false);
                  setEditingId(null);
                }}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={save}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
        .animate-fadeIn { animation: fadeIn .15s ease-out; }
        .animate-scaleIn { animation: scaleIn .18s ease-out; }

        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}
      </style>
    </div>
  );
}
