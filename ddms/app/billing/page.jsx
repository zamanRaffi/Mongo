"use client";
import useSWR from 'swr';
import { useState } from 'react';
import DataTable from '../../components/DataTable';

const fetcher = (url) => fetch(url).then(r => r.json());

export default function BillingPage() {
  const { data, mutate } = useSWR('/api/billing', fetcher);
  const { data: salesData } = useSWR('/api/sales', fetcher);

  const items = data?.items || [];
  const sales = salesData?.items || [];

  const [show, setShow] = useState(false);
  const [saleId, setSaleId] = useState('');
  const [amount, setAmount] = useState(0);
  const [paid, setPaid] = useState(false);

  async function save() {
    const payload = { sale: saleId, amount: Number(amount), paid };
    const res = await fetch('/api/billing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      mutate();
      setShow(false);
      setSaleId('');
      setAmount(0);
      setPaid(false);
    } else {
      const d = await res.json();
      alert(d.error || 'Failed');
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 sm:mb-0">Billings</h1>
        <button
          onClick={() => setShow(true)}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          New Billing
        </button>
      </header>

      {/* Data Table */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <DataTable
          columns={["Sale", "Amount", "Paid", "Date"]}
          data={items.map(b => ({
            _id: b._id,
            sale: b.sale?.product?.name || (b.sale?._id || ''),
            amount: `$${b.amount.toFixed(2)}`,
            paid: b.paid ? 'Yes' : 'No',
            date: new Date(b.date).toLocaleString()
          }))}
        />
      </div>

      {/* Premium Modal */}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-scaleIn">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">New Billing</h2>

            <div className="space-y-4 text-black">
              <div>
                <label className="block text-sm font-medium mb-1">Sale</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 hover:bg-gray-100 transition"
                  value={saleId}
                  onChange={(e) => setSaleId(e.target.value)}
                >
                  <option value="">Select sale</option>
                  {sales.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.product?.name || s._id} — {s.quantity}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 hover:bg-gray-100 transition"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <label className="inline-flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={paid}
                  onChange={(e) => setPaid(e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-sm text-gray-700">Paid</span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShow(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-colors font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>
        {`
          .animate-scaleIn {
            animation: scaleIn 0.18s ease-out;
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
