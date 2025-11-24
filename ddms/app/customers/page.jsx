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
      setForm(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value
        }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
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

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: { ...form.address },
    };

    if (editingCustomer) payload.id = editingCustomer._id;

    try {
      const res = await fetch('/api/customers', {
        method: editingCustomer ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        mutate(); // Refresh data
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

  // --- Prepare DataTable rows ---
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
        <button onClick={() => openEdit(customer)} className="px-3 py-1 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition text-sm">Edit</button>
        <button onClick={() => remove(customer._id)} className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm">Delete</button>
      </div>
    )
  }));

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 p-6 sm:p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">👥 Customer Management</h1>
          <button onClick={openNew} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition">
            + Add New Customer
          </button>
        </header>

        {swrError && <div className="p-4 bg-red-100 text-red-700 rounded-lg">Error fetching data: {swrError.message}</div>}
        {isLoading && <div className="p-4 text-gray-600">Loading Customers...</div>}

        {!isLoading && !swrError && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <DataTable columns={columns} data={processedCustomers} />
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm text-black">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl animate-scaleIn">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">
              {editingCustomer ? 'Edit Customer Record' : 'Add New Customer'}
            </h2>

            {apiError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline ml-2">{apiError}</span>
              </div>
            )}

            <form className="grid grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); save(); }}>
              <div className="col-span-2">
                <h3 className="font-semibold text-lg mb-2 text-gray-700">Customer Information</h3>
                <input placeholder="Full Name" name="name" value={form.name} onChange={handleChange} required
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <input placeholder="Email Address" type="email" name="email" value={form.email} onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <input placeholder="Phone Number" name="phone" value={form.phone} onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>

              <div className="col-span-2 border-t pt-4">
                <h3 className="font-semibold text-lg mb-2 text-gray-700">Address Details</h3>
                <input placeholder="Street Address" name="street" value={form.address.street} onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="City" name="city" value={form.address.city} onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  <input placeholder="State" name="state" value={form.address.state} onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  <input placeholder="ZIP/Postal Code" name="zip" value={form.address.zip} onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  <input placeholder="Country" name="country" value={form.address.country} onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
              </div>

              <div className="col-span-2 flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={closeModal} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-medium">Cancel</button>
                <button type="submit" disabled={isSaving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50">
                  {isSaving ? 'Saving...' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleIn { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-scaleIn { animation: scaleIn 0.25s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default CustomerPage;
