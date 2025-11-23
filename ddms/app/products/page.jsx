"use client";
import useSWR from "swr";
import { useState } from "react";
import DataTable from "../../components/DataTable";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function ProductsPage() {
  const { data, mutate } = useSWR("/api/products", fetcher);
  const { data: catData } = useSWR("/api/categories", fetcher);

  const items = data?.items || [];
  const categories = catData?.items || [];

  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Save product
  async function save() {
    if (!name || !category) {
      alert("Name and Category are required!");
      return;
    }

    const payload = { name, price, quantity, category };
    const method = editingId ? "PUT" : "POST";
    if (editingId) payload.id = editingId;

    const res = await fetch("/api/products", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      mutate();
      setShow(false);
      setName("");
      setPrice("");
      setQuantity("");
      setCategory("");
      setEditingId(null);
    } else {
      const error = await res.json();
      alert(error?.message || "Error saving product");
    }
  }

  // Open modal for editing
  function openEdit(row) {
    setEditingId(row._id);
    setName(row.name || "");
    setPrice(row.price || 0);
    setQuantity(row.quantity || 0);
    setCategory(row.category?._id || "");
    setShow(true);
  }

  async function remove(id) {
    if (!confirm("Delete this product?")) return;

    await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    mutate();
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 sm:mb-0">Products</h1>
        <button
          onClick={() => setShow(true)}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          New Product
        </button>
      </header>

      {/* Data Table */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <DataTable
          columns={["Name", "Price", "Quantity", "Category"]}
          data={items.map((item) => ({
            ...item,
            category: item.category?.name || "Uncategorized",
          }))}
          actions={[
            { label: "Edit", onClick: (row) => openEdit(row) },
            { label: "Delete", onClick: (row) => remove(row._id) },
          ]}
        />
      </div>

      {/* Modal */}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-scaleIn">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingId ? "Edit Product" : "New Product"}
            </h2>

            <div className="space-y-4 text-black">
              <input
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="number"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <input
                type="number"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />

              {/* Category dropdown */}
              <select
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => {
                  setShow(false);
                  setEditingId(null);
                }}
                className="px-4 py-2 text-black bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
