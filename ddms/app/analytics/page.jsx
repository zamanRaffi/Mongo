'use client';

import { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';

const fetcher = (url) => fetch(url).then((r) => r.json());

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/analytics?period=${period}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [period]);

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };

  if (loading) return <div className="text-white text-center mt-20">Loading Analytics...</div>;
  if (!analytics) return <div className="text-white text-center mt-20">Failed to load analytics data.</div>;

  const topProductColumns = [
    { header: 'Product Name', accessor: 'name' },
    { header: 'Units Sold', accessor: 'totalSold' },
  ];
  const Card = ({ title, value }) => (
  <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-xl border border-white/30">
    <p className="text-sm font-medium text-black/80">{title}</p>
    <p className="text-3xl font-extrabold text-black mt-1">{value}</p>
  </div>
);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-4xl font-extrabold mb-2 sm:mb-0  text-black">📊 Sales & Inventory Analytics</h1>

        {/* View Data For dropdown */}
        <div className="flex items-center text-white mt-3 sm:mt-0">
          <label htmlFor="period-select" className="mr-3 font-medium text-white/80">
            View Data For:
          </label>
          <select
            id="period-select"
            value={period}
            onChange={handlePeriodChange}
            className="p-2 rounded-lg bg-white/20 text-black border border-white/30 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <option value="weekly">Last 7 Days</option>
            <option value="monthly">Last 30 Days</option>
            <option value="quarterly">Last 90 Days</option>
          </select>
        </div>
      </header>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="Total Revenue" value={`$${analytics.totalRevenue.toFixed(2)}`} />
        <Card title="Inventory Stock Value" value={`$${analytics.totalStockValue.toFixed(2)}`} />
        <Card title="Period Covered" value={analytics.periodCovered} />
      </div>

      {/* Top Selling Products Table */}
      <div className="bg-white/20 from-blue-50 via-blue-100 to-indigo-50 backdrop-blur-md rounded-xl shadow-xl overflow-hidden">
        <DataTable
          columns={topProductColumns}
          data={analytics.topProducts}
          actions={[]} // No actions for analytics
        />
      </div>
    </div>
  );
};

// Card component
const Card = ({ title, value }) => (
  <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-xl border border-white/30">
    <p className="text-sm font-medium text-white/80">{title}</p>
    <p className="text-3xl font-extrabold text-white mt-1">{value}</p>
  </div>
);

export default AnalyticsPage;
