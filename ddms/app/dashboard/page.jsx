"use client";
import { useAuth } from "../context/AuthContext";
import useSWR from "swr";
import AiAssistant from "../../components/AiAssistant";
import { Box, Tags, Users, Truck, DollarSign, FileText } from "lucide-react";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }

  // Fetch data
  const { data: prodData } = useSWR("/api/products", fetcher);
  const { data: catData } = useSWR("/api/categories", fetcher);
  const { data: empData } = useSWR("/api/employees", fetcher);
  const { data: supData } = useSWR("/api/suppliers", fetcher);
  const { data: salesData } = useSWR("/api/sales", fetcher);
  const { data: billData } = useSWR("/api/billing", fetcher);
  const { data: custData } = useSWR("/api/customers", fetcher);

  const products = prodData?.items || [];
  const categories = catData?.items || [];
  const employees = empData?.items || [];
  const suppliers = supData?.items || [];
  const billings = billData?.items || [];
  const customers = custData?.customers || [];
  const sales = Array.isArray(salesData?.items) ? salesData.items : [];

  const recentSales = sales
    .filter((s) => s.saleDate)
    .sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate))
    .slice(0, 8);

  const stats = [
    { title: "Products", value: products.length, color: "bg-indigo-500", icon: <Box size={24} /> },
    { title: "Categories", value: categories.length, color: "bg-pink-500", icon: <Tags size={24} /> },
    { title: "Employees", value: employees.length, color: "bg-green-500", icon: <Users size={24} /> },
    { title: "Suppliers", value: suppliers.length, color: "bg-yellow-500", icon: <Truck size={24} /> },
    { title: "Sales", value: sales.length, color: "bg-blue-500", icon: <DollarSign size={24} /> },
    { title: "Billings", value: billings.length, color: "bg-red-500", icon: <FileText size={24} /> },
  ];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 text-black">
      {/* Header */}
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-4xl font-extrabold mb-2">Dashboard</h1>
        <p className="text-black text-sm sm:text-base">Overview of your business in real-time</p>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className={`flex items-center justify-between p-6 rounded-xl shadow-xl bg-white/20 backdrop-blur-md hover:shadow-2xl transition`}>
            <div>
              <div className="text-sm text-black">{stat.title}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>
            <div className={`w-12 h-12 flex items-center justify-center rounded-full ${stat.color} text-white`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </section>

      {/* AI Assistant */}
      <section className="mt-8 mb-8 text-white">
        <AiAssistant
          products={products}
          recentSales={recentSales}
          categories={categories}
          employees={employees}
          suppliers={suppliers}
          sales={sales}
          billings={billings}
          customers={customers}
        />
      </section>

      {/* Recent Sales Table */}
      <section className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-xl overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-black">Recent Sales</h2>
        <table className="min-w-full divide-y divide-white/30 text-white">
          <thead>
            <tr className="text-left text-sm uppercase text-black">
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Quantity</th>
              <th className="px-6 py-3">Date & Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/30 text-black">
            {recentSales.map((s, idx) => (
              <tr key={s._id} className={idx % 2 === 0 ? "bg-white/10" : ""}>
                <td className="px-6 py-4">{s.items[0]?.productId?.name || "N/A"}</td>
                <td className="px-6 py-4">{s.items[0]?.quantity || 0}</td>
                <td className="px-6 py-4">{s.saleDate ? new Date(s.saleDate).toLocaleString() : "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
