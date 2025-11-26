'use client';

import { useState } from 'react';
import useSWR from 'swr';
import DataTable from "../../components/DataTable";

const fetcher = (url) => fetch(url).then((r) => r.json());

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  address: {
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  },
};

const CustomerPage = () => {
  const { data, mutate, isLoading, error: swrError } = useSWR('/api/customers', fetcher);
  const customers = data?.customers || [];

  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [apiError, setApiError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Define columns for DataTable
  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Address', accessor: (row) => `${row.address?.city || ''}, ${row.address?.country || ''}` },
    { header: 'Purchases', accessor: 'totalPurchases' },
    { header: 'Last Purchase', accessor: (row) => row.lastPurchaseDate ? new Date(row.lastPurchaseDate).toLocaleDateString() : 'N/A' },
    { header: 'Actions', accessor: 'actions' },
  ];

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['street', 'city', 'state', 'zip', 'country'].includes(name)) {
      setForm(prev => ({ ...prev, address: { ...prev.address, [name]: value } }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const openNew = () => {
    setEditingCustomer(null);
    setForm(initialFormState);
    setApiError(null);
    setShowModal(true);
  };

  const openEdit = (customer) => {
    setEditingCustomer(customer);
    setApiError(null);
    setForm({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: {
        street: customer.address?.street || '',
        city: customer.address?.city || '',
        state: customer.address?.state || '',
        zip: customer.address?.zip || '',
        country: customer.address?.country || '',
      },
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setApiError(null);
  };

  // --- CRUD Operations ---
  async function save() {
    setIsSaving(true);
    setApiError(null);

    const payload = { name: form.name, email: form.email, phone: form.phone, address: { ...form.address } };
    if (editingCustomer) payload.id = editingCustomer._id;

    try {
      const res = await fetch('/api/customers', {
        method: editingCustomer ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        mutate();
        closeModal();
      } else {
        const errorData = await res.json();
        setApiError(errorData.message || 'An unknown error occurred.');
      }
    } catch (err) {
      console.error(err);
      setApiError('Network error. Check console.');
    } finally {
      setIsSaving(false);
    }
  }

  async function remove(id) {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      const res = await fetch('/api/customers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) mutate();
      else alert("Error deleting customer.");
    } catch (err) {
      console.error(err);
    }
  }

  const processedCustomers = customers.map(customer => ({
    _id: customer._id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address || {},
    totalPurchases: customer.totalPurchases || 0,
    lastPurchaseDate: customer.lastPurchaseDate || null,
    actions: (
      <div className="flex gap-2">
        <button onClick={() => openEdit(customer)} className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm">Edit</button>
        <button onClick={() => remove(customer._id)} className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm">Delete</button>
      </div>
    )
  }));

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 min-h-screen">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 sm:mb-0">👥 Customer Management</h1>
        <button onClick={openNew} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition">
          + Add New Customer
        </button>
      </header>

      {swrError && <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">Error fetching data: {swrError.message}</div>}
      {isLoading && <div className="p-4 text-gray-600">Loading Customers...</div>}

      {!isLoading && !swrError && (
        <div className="bg-white/20 backdrop-blur-md shadow-xl rounded-xl overflow-hidden border border-white/30">
          <DataTable columns={columns} data={processedCustomers} />
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient from-blue-50 via-blue-100 to-indigo-50 backdrop-blur-sm">
          <div className="bg-white/20 backdrop-blur-md shadow-2xl rounded-2xl w-full max-w-2xl p-8 animate-scaleIn">
            <h2 className="text-2xl font-bold text-black mb-6 border-b border-white/30 pb-3">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h2>

            {apiError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                <strong className="font-bold">Error:</strong> <span className="ml-2">{apiError}</span>
              </div>
            )}

            <form className="grid grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); save(); }}>
              <div className="col-span-2 space-y-3">
                <input placeholder="Full Name" name="name" value={form.name} onChange={handleChange} required
                  className="w-full border border-white/30 px-4 py-2 rounded-xl bg-white/30 text-black focus:outline-none focus:ring-2 focus:ring-white"/>
                <input placeholder="Email" type="email" name="email" value={form.email} onChange={handleChange}
                  className="w-full border border-white/30 px-4 py-2 rounded-xl bg-white/30 text-black focus:outline-none focus:ring-2 focus:ring-white"/>
                <input placeholder="Phone Number" name="phone" value={form.phone} onChange={handleChange}
                  className="w-full border border-white/30 px-4 py-2 rounded-xl bg-white/30 text-black focus:outline-none focus:ring-2 focus:ring-white"/>
              </div>

              <div className="col-span-2 border-t border-white/30 pt-4 space-y-3">
                <input placeholder="Street" name="street" value={form.address.street} onChange={handleChange}
                  className="w-full border border-white/30 px-4 py-2 rounded-xl bg-white/30 text-black focus:outline-none focus:ring-2 focus:ring-white"/>
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="City" name="city" value={form.address.city} onChange={handleChange}
                    className="w-full border border-white/30 px-4 py-2 rounded-xl bg-white/30 text-black focus:outline-none focus:ring-2 focus:ring-white"/>
                  <input placeholder="State" name="state" value={form.address.state} onChange={handleChange}
                    className="w-full border border-white/30 px-4 py-2 rounded-xl bg-white/30 text-black focus:outline-none focus:ring-2 focus:ring-white"/>
                  <input placeholder="ZIP" name="zip" value={form.address.zip} onChange={handleChange}
                    className="w-full border border-white/30 px-4 py-2 rounded-xl bg-white/30 text-black focus:outline-none focus:ring-2 focus:ring-white"/>
                  <input placeholder="Country" name="country" value={form.address.country} onChange={handleChange}
                    className="w-full border border-white/30 px-4 py-2 rounded-xl bg-white/30 text-black focus:outline-none focus:ring-2 focus:ring-white"/>
                </div>
              </div>

              <div className="col-span-2 flex justify-end gap-3 pt-4 border-t border-white/30">
                <button type="button" onClick={closeModal} className="px-6 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 text-black transition font-semibold">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold disabled:opacity-50">
                  {isSaving ? 'Saving...' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleIn { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-scaleIn { animation: scaleIn 0.25s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default CustomerPage;
