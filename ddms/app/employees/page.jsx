"use client";
import useSWR from "swr";
import { useState } from "react";
import DataTable from "../../components/DataTable";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function EmployeesPage() {
  const { data, mutate } = useSWR("/api/employees", fetcher);
  const items = data?.items || [];

  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [editingId, setEditingId] = useState(null);

  async function save() {
    const payload = { name, email, role, phone };
    const method = editingId ? "PUT" : "POST";
    if (editingId) payload.id = editingId;

    const res = await fetch("/api/employees", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      mutate();
      setShow(false);
      setName("");
      setEmail("");
      setRole("");
      setPhone("");
      setEditingId(null);
    }
  }

  function openEdit(row) {
    setEditingId(row._id);
    setName(row.name || "");
    setEmail(row.email || "");
    setRole(row.role || "");
    setPhone(row.phone || "");
    setShow(true);
  }

  async function remove(id) {
    if (!confirm("Delete this employee?")) return;

    await fetch("/api/employees", {
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2 sm:mb-0">Employees</h1>
        <button
          onClick={() => setShow(true)}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          New Employee
        </button>
      </header>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <DataTable
          columns={["Name", "Email", "Role", "Phone"]}
          data={items}
          actions={[
            { label: "Edit", onClick: openEdit },
            { label: "Delete", onClick: (row) => remove(row._id) },
          ]}
        />
      </div>

      {/* Modal */}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm text-black">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-transform scale-100">
            <h2 className="text-2xl font-bold text-black mb-6">
              {editingId ? "Edit Employee" : "New Employee"}
            </h2>

            <div className="space-y-4">
              <input
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
              <input
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => {
                  setShow(false);
                  setEditingId(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
