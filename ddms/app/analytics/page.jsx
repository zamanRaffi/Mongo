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
                // Fetch data from the updated API
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

    if (loading) return <div>Loading Analytics...</div>;
    if (!analytics) return <div>Failed to load analytics data.</div>;

    const topProductColumns = [
        { header: 'Product Name', accessor: 'name' },
        { header: 'Units Sold', accessor: 'totalSold' },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2 sm:mb-0">
                    📊 Sales & Inventory Analytics
                </h1>

                {/* View Data For dropdown */}
                <div className="flex items-center text-black">
                    <label htmlFor="period-select" className="mr-3 font-medium text-gray-700">
                        View Data For:
                    </label>
                    <select
                        id="period-select"
                        value={period}
                        onChange={handlePeriodChange}
                        className="p-2 border rounded-md"
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
                {/* Use the new field for human-readable dates */}
                <Card title="Period Covered" value={analytics.periodCovered} /> 
            </div>

            {/* Top Selling Products Table */}
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <DataTable columns={topProductColumns} data={analytics.topProducts} />
            </div>
        </div>
    );
};

// Card component like EmployeesPage style
const Card = ({ title, value }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
    </div>
);

export default AnalyticsPage;