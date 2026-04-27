import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/stats/dashboard');
            setStats(response.data.stats);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to load stats');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <p className="text-white text-xl">⏳ Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Admin Header */}
            <div className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-full transition-all"
                        title="Back to App"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                </div>
            </div>

            {/* Navigation */}
            <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex gap-4 overflow-x-auto">
                <button
                    onClick={() => navigate('/admin')}
                    className="px-4 py-2 bg-blue-600 text-white rounded font-semibold"
                >
                    📊 Dashboard
                </button>
                <button
                    onClick={() => navigate('/admin/bookings')}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-semibold"
                >
                    📋 Bookings
                </button>
                <button
                    onClick={() => navigate('/admin/users')}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-semibold"
                >
                    👥 Users
                </button>
                <button
                    onClick={() => navigate('/admin/services')}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-semibold"
                >
                    🎫 Services
                </button>
            </div>

            {/* Stats Grid */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Top Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {/* Total Bookings */}
                    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Total Bookings</p>
                                <p className="text-4xl font-bold text-white">{stats?.totalBookings || 0}</p>
                            </div>
                            <span className="text-5xl">📋</span>
                        </div>
                    </div>

                    {/* Total Users */}
                    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Total Users</p>
                                <p className="text-4xl font-bold text-white">{stats?.totalUsers || 0}</p>
                            </div>
                            <span className="text-5xl">👥</span>
                        </div>
                    </div>

                    {/* Total Revenue */}
                    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Total Revenue</p>
                                <p className="text-4xl font-bold text-green-400">₹{stats?.totalRevenue?.toLocaleString() || 0}</p>
                            </div>
                            <span className="text-5xl">💰</span>
                        </div>
                    </div>

                    {/* Active Bookings */}
                    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Confirmed Bookings</p>
                                <p className="text-4xl font-bold text-blue-400">
                                    {stats?.bookingsByStatus?.find(s => s._id === 'confirmed')?.count || 0}
                                </p>
                            </div>
                            <span className="text-5xl">✅</span>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {/* Bookings by Type */}
                    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                        <h3 className="text-xl font-bold text-white mb-6">📊 Bookings by Type</h3>
                        <div className="space-y-3">
                            {stats?.bookingsByType?.map((item) => (
                                <div key={item._id} className="flex items-center justify-between">
                                    <span className="text-slate-300 capitalize">{item._id}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 bg-slate-700 rounded h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded"
                                                style={{
                                                    width: `${(item.count / stats.totalBookings) * 100}%`
                                                }}
                                            />
                                        </div>
                                        <span className="text-white font-semibold min-w-12">{item.count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bookings by Status */}
                    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                        <h3 className="text-xl font-bold text-white mb-6">📈 Bookings by Status</h3>
                        <div className="space-y-3">
                            {stats?.bookingsByStatus?.map((item) => (
                                <div key={item._id} className="flex items-center justify-between">
                                    <span className="text-slate-300 capitalize">{item._id}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 bg-slate-700 rounded h-2">
                                            <div
                                                className={`h-2 rounded ${item._id === 'confirmed'
                                                        ? 'bg-green-500'
                                                        : item._id === 'pending'
                                                            ? 'bg-yellow-500'
                                                            : 'bg-red-500'
                                                    }`}
                                                style={{
                                                    width: `${(item.count / stats.totalBookings) * 100}%`
                                                }}
                                            />
                                        </div>
                                        <span className="text-white font-semibold min-w-12">{item.count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Bookings */}
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <h3 className="text-xl font-bold text-white mb-6">🕐 Recent Bookings</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="text-left py-3 px-4 text-slate-300">ID</th>
                                    <th className="text-left py-3 px-4 text-slate-300">Type</th>
                                    <th className="text-left py-3 px-4 text-slate-300">Amount</th>
                                    <th className="text-left py-3 px-4 text-slate-300">Status</th>
                                    <th className="text-left py-3 px-4 text-slate-300">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.recentBookings?.slice(0, 5).map((booking) => (
                                    <tr key={booking._id} className="border-b border-slate-700 hover:bg-slate-700">
                                        <td className="py-3 px-4 text-white text-sm">{booking._id.slice(-6)}</td>
                                        <td className="py-3 px-4 text-slate-300 capitalize">{booking.bookingType}</td>
                                        <td className="py-3 px-4 text-green-400 font-semibold">₹{booking.totalPrice}</td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`px-3 py-1 rounded text-xs font-semibold ${booking.bookingStatus === 'confirmed'
                                                        ? 'bg-green-900 text-green-300'
                                                        : booking.bookingStatus === 'pending'
                                                            ? 'bg-yellow-900 text-yellow-300'
                                                            : 'bg-red-900 text-red-300'
                                                    }`}
                                            >
                                                {booking.bookingStatus}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-slate-300 text-sm">
                                            {new Date(booking.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button
                        onClick={() => navigate('/admin/bookings')}
                        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
                    >
                        View All Bookings →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;