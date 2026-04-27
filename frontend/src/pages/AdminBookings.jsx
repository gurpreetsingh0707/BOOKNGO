import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const AdminBookings = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [filterType, setFilterType] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredBookings = useMemo(() => {
        if (!searchTerm) return bookings;
        const lowerSearch = searchTerm.toLowerCase();
        return bookings.filter(b => 
            b._id.toLowerCase().includes(lowerSearch) ||
            b.totalPrice.toString().includes(lowerSearch) ||
            b.user?.email?.toLowerCase().includes(lowerSearch)
        );
    }, [bookings, searchTerm]);

    useEffect(() => {
        fetchBookings();
    }, [filterStatus, filterType, page]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filterStatus) params.append('status', filterStatus);
            if (filterType) params.append('type', filterType);
            params.append('page', page);

            const response = await api.get(`/admin/bookings?${params}`);
            setBookings(response.data.bookings);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Cancel this booking?')) return;

        try {
            await api.delete(`/admin/bookings/${bookingId}/cancel`);
            toast.success('✅ Booking cancelled');
            fetchBookings();
        } catch (error) {
            toast.error(`❌ ${error.response?.data?.message || 'Failed to cancel'}`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Header */}
            <div className="bg-slate-800 border-b border-slate-700 px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin')}
                        className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-full transition-all"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-3xl font-bold text-white">Manage Bookings</h1>
                </div>

                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-white transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by ID or Amount..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-white pl-12 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-500"
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="bg-slate-800 px-6 py-4 border-b border-slate-700">
                <div className="flex gap-4 flex-wrap">
                    <select
                        value={filterType}
                        onChange={(e) => {
                            setFilterType(e.target.value);
                            setPage(1);
                        }}
                        className="px-4 py-2 bg-slate-700 text-white rounded border border-slate-600"
                    >
                        <option value="">All Types</option>
                        <option value="movie">🎬 Movies</option>
                        <option value="train">🚂 Trains</option>
                        <option value="bus">🚌 Buses</option>
                        <option value="hotel">🏨 Hotels</option>
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setPage(1);
                        }}
                        className="px-4 py-2 bg-slate-700 text-white rounded border border-slate-600"
                    >
                        <option value="">All Status</option>
                        <option value="pending">⏳ Pending</option>
                        <option value="confirmed">✅ Confirmed</option>
                        <option value="cancelled">❌ Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {loading ? (
                    <p className="text-white text-center">⏳ Loading...</p>
                ) : bookings.length === 0 ? (
                    <p className="text-slate-300 text-center">No bookings found</p>
                ) : (
                    <>
                        <div className="overflow-x-auto bg-slate-800 rounded-lg border border-slate-700">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-700">
                                        <th className="text-left py-4 px-6 text-slate-300">ID</th>
                                        <th className="text-left py-4 px-6 text-slate-300">Type</th>
                                        <th className="text-left py-4 px-6 text-slate-300">Amount</th>
                                        <th className="text-left py-4 px-6 text-slate-300">Qty</th>
                                        <th className="text-left py-4 px-6 text-slate-300">Status</th>
                                        <th className="text-left py-4 px-6 text-slate-300">Payment</th>
                                        <th className="text-left py-4 px-6 text-slate-300">Date</th>
                                        <th className="text-left py-4 px-6 text-slate-300">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBookings.map((booking) => (
                                        <tr key={booking._id} className="border-b border-slate-700 hover:bg-slate-700">
                                            <td className="py-4 px-6 text-white text-sm font-mono">{booking._id.slice(-6)}</td>
                                            <td className="py-4 px-6 text-slate-300 capitalize">{booking.bookingType}</td>
                                            <td className="py-4 px-6 text-green-400 font-semibold">₹{booking.totalPrice}</td>
                                            <td className="py-4 px-6 text-white">{booking.quantity}</td>
                                            <td className="py-4 px-6">
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
                                            <td className="py-4 px-6">
                                                <span
                                                    className={`px-3 py-1 rounded text-xs font-semibold ${booking.paymentStatus === 'completed'
                                                        ? 'bg-green-900 text-green-300'
                                                        : booking.paymentStatus === 'pending'
                                                            ? 'bg-yellow-900 text-yellow-300'
                                                            : 'bg-red-900 text-red-300'
                                                        }`}
                                                >
                                                    {booking.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-slate-300 text-sm">
                                                {new Date(booking.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-6">
                                                {booking.bookingStatus !== 'cancelled' && (
                                                    <button
                                                        onClick={() => handleCancelBooking(booking._id)}
                                                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination && (
                            <div className="mt-6 flex justify-center gap-2">
                                <button
                                    onClick={() => setPage(Math.max(1, page - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded disabled:opacity-50"
                                >
                                    ← Prev
                                </button>
                                <span className="px-4 py-2 text-white">
                                    Page {pagination.current} of {pagination.pages}
                                </span>
                                <button
                                    onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                                    disabled={page === pagination.pages}
                                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded disabled:opacity-50"
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminBookings;