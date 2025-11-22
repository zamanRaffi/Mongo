"use client";

import useSWR from "swr";
import { useState } from "react";
import DataTable from "../../components/DataTable";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function SuppliersPage() {
  const { data, mutate } = useSWR("/api/suppliers", fetcher);
  const items = data?.items || [];

  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null);

  async function save() {
    const payload = { name, contact, phone, email };
    const method = editingId ? "PUT" : "POST";
    if (editingId) payload.id = editingId;

    const res = await fetch("/api/suppliers", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      mutate();
      setShow(false);
      setName("");
      setContact("");
      setPhone("");
      setEmail("");
      setEditingId(null);
    }
  }

  function openEdit(row) {
    setEditingId(row._id);
    setName(row.name || "");
    setContact(row.contact || "");
    setPhone(row.phone || "");
    setEmail(row.email || "");
    setShow(true);
  }

  async function remove(id) {
    if (!confirm("Delete this supplier?")) return;

    await fetch("/api/suppliers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    mutate();
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 sm:mb-0">
          Suppliers
        </h1>

        <button
          onClick={() => setShow(true)}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
           New Supplier
        </button>
      </header>

      {/* Card Wrapper */}
      <div className="bg-white text-black shadow-lg rounded-xl overflow-hidden">
        <DataTable
          columns={["Name", "Contact", "Phone", "Email"]}
          data={items}
          actions={[
            { label: "Edit", onClick: (row) => openEdit(row) },
            { label: "Delete", onClick: (row) => remove(row._id) },
          ]}
        />
      </div>

      {/* Modern Modal */}
      {show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="bg-white w-[90%] max-w-md p-6 rounded-2xl shadow-2xl border border-gray-100 animate-scaleIn">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editingId ? "Edit Supplier" : "New Supplier"}
            </h2>

            <div className="space-y-3 text-black">
              <input
                className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Contact Person"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
              <input
                className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <input
                className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Buttons */}
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

      {/* Modal Animations */}
      {/* <style>
        {`
        .animate-fadeIn {
          animation: fadeIn .15s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn .18s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; } 
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from { transform: scale(.95); opacity: 0; } 
          to { transform: scale(1); opacity: 1; }
        }
      `} */}
      {/* </style> */}
    </div>
  );
}
