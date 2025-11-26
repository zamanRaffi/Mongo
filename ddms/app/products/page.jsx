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
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 sm:mb-0">Products</h1>
        <button
          onClick={() => setShow(true)}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-xl shadow hover:bg-blue-600 transition-colors"
        >
          New Product
        </button>
      </header>

      {/* Data Table */}
      <div className="bg-white/30 backdrop-blur-md rounded-2xl shadow-md overflow-hidden">
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
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient from-blue-50 via-blue-100 to-indigo-50 backdrop-blur-sm">
    <div className="bg-white/30 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md p-8 animate-scaleIn border border-white/30">
      <h2 className="text-2xl font-extrabold mb-6 text-gray-900">
        {editingId ? "Edit Product" : "New Product"}
      </h2>

      <div className="space-y-4 text-black">
        {/* Product Name */}
        <input
          className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Price */}
        <input
          type="number"
          className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        {/* Quantity */}
        <input
          type="number"
          className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        {/* Custom Category Dropdown */}
        <div className="relative w-full">
          <button
            type="button"
            className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/30 text-gray-800 text-left focus:outline-none focus:ring-2 focus:ring-blue-400 flex justify-between items-center"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {category
              ? categories.find((c) => c._id === category)?.name
              : "Select Category"}
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <ul className="absolute z-50 mt-1 w-full bg-white rounded-xl shadow-lg max-h-60 overflow-y-auto ring-1 ring-black/10">
              {categories.map((c) => (
                <li
                  key={c._id}
                  className="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer rounded-lg"
                  onClick={() => {
                    setCategory(c._id);
                    setDropdownOpen(false);
                  }}
                >
                  {c.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end mt-6 gap-3">
        <button
          onClick={() => {
            setShow(false);
            setEditingId(null);
          }}
          className="px-4 py-3 text-black bg-gray-200 rounded-xl hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={save}
          className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
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
