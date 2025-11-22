"use client";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function DashboardPage() {
  const { data: prodData } = useSWR("/api/products", fetcher);
  const { data: catData } = useSWR("/api/categories", fetcher);
  const { data: empData } = useSWR("/api/employees", fetcher);
  const { data: supData } = useSWR("/api/suppliers", fetcher);
  const { data: salesData } = useSWR("/api/sales", fetcher);
  const { data: billData } = useSWR("/api/billing", fetcher);

  const products = prodData?.items || [];
  const categories = catData?.items || [];
  const employees = empData?.items || [];
  const suppliers = supData?.items || [];
  const sales = salesData?.items || [];
  const billings = billData?.items || [];

  const recentSales = sales
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  const stats = [
    { title: "Products", value: products.length, color: "bg-indigo-500" },
    { title: "Categories", value: categories.length, color: "bg-pink-500" },
    { title: "Employees", value: employees.length, color: "bg-green-500" },
    { title: "Suppliers", value: suppliers.length, color: "bg-yellow-500" },
    { title: "Sales", value: sales.length, color: "bg-blue-500" },
    { title: "Billings", value: billings.length, color: "bg-red-500" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          Dashboard
        </h1>
        <p className="text-gray-500">Overview of your business in real-time</p>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={`flex items-center justify-between p-6 rounded-xl shadow hover:shadow-lg transition-shadow bg-white`}
          >
            <div>
              <div className="text-sm text-gray-500">{stat.title}</div>
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            </div>
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full text-white ${stat.color}`}
            >
              {stat.value > 0 ? "▲" : "▼"}
            </div>
          </div>
        ))}
      </section>

      {/* Recent Sales Table */}
      <section className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Sales</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentSales.map((s, idx) => (
              <tr key={s._id} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {s.product?.name || s.product || ""}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {s.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {s.date ? new Date(s.date).toLocaleString() : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
