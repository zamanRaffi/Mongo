"use client";
import useSWR from "swr";
import { useState } from "react";
import DataTable from "../../components/DataTable"; // adjust path if needed

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function CategoriesPage() {
  const { data, mutate } = useSWR("/api/categories", fetcher);
  const items = data?.items || [];

  const [show, setShow] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [editingId, setEditingId] = useState(null);

  function openNew() {
    setEditingId(null);
    setNameInput("");
    setShow(true);
  }

  function openEdit(row) {
    setEditingId(row._id);
    setNameInput(row.name || "");
    setShow(true);
  }

  async function save() {
    const payload = editingId ? { id: editingId, name: nameInput } : { name: nameInput };
    const res = await fetch("/api/categories", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      mutate();
      setShow(false);
      setNameInput("");
      setEditingId(null);
    } else {
      alert("Error saving category");
    }
  }

  async function remove(id) {
    if (!confirm("Delete this category?")) return;

    const res = await fetch("/api/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) mutate();
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 sm:mb-0">Categories</h1>
        <button
          onClick={openNew}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-xl shadow hover:bg-blue-600 transition-colors"
        >
          New Category
        </button>
      </header>

      {/* DataTable */}
      <div className="bg-white/30 backdrop-blur-md rounded-2xl shadow-md overflow-hidden">
        <DataTable
          columns={["Name","slug"]}
          data={items}
          actions={[
            { label: "Edit", onClick: openEdit },
            { label: "Delete", onClick: (row) => remove(row._id) },
          ]}
        />
      </div>

      {/* Modal */}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient from-blue-50 via-blue-100 to-indigo-50 backdrop-blur-sm">
          <div className="bg-white/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 w-full max-w-md p-8 animate-scaleIn">
            <h2 className="text-2xl font-extrabold mb-6 text-gray-900">
              {editingId ? "Edit Category" : "New Category"}
            </h2>

            <input
              className="w-full border border-gray-300 px-4 py-3 rounded-xl mb-5 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              placeholder="Category Name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />

             <input
              className="w-full border border-gray-300 px-4 py-3 rounded-xl mb-5 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              placeholder="slug"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShow(false)}
                className="px-4 py-3 text-black bg-gray-200 rounded-xl hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation */}
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
