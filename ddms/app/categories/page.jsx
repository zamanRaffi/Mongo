"use client";
import useSWR from "swr";
import { useState } from "react";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function CategoriesPage() {
  const { data, mutate } = useSWR("/api/categories", fetcher);
  const items = data?.items || [];

  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [nameInput, setNameInput] = useState("");

  function openNew() {
    setEditing(null);
    setNameInput("");
    setShow(true);
  }

  function openEdit(it) {
    setEditing(it);
    setNameInput(it.name || "");
    setShow(true);
  }

  async function save() {
    const payload = editing
      ? { id: editing._id, name: nameInput }
      : { name: nameInput };

    const res = await fetch("/api/categories", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      mutate();
      setShow(false);
    } else {
      alert("Error");
    }
  }

  async function remove(id) {
    if (!confirm("Delete this?")) return;

    const res = await fetch("/api/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) mutate();
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
        <button
          onClick={openNew}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
        >
          New Category
        </button>
      </header>

      {/* TABLE CARD */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 text-black">
        <table className="w-full">
          <thead className="bg-gray-100 text-gray-700 border-b">
            <tr>
              <th className="p-3 text-left font-medium">Name</th>
              <th className="p-3 text-center font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((it) => (
              <tr
                key={it._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3">{it.name}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => openEdit(it)}
                    className="px-3 py-1 bg-yellow-400 text-white rounded-lg mr-2 hover:bg-yellow-500 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(it._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity text-black">

          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-scaleIn">

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editing ? "Edit Category" : "New Category"}
            </h2>

            <input
              className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Category Name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShow(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </button>

              <button
                onClick={save}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation Style */}
      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0.85); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
