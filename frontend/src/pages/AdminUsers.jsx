import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';

const AdminUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;
        const lowerSearch = searchTerm.toLowerCase();
        return users.filter(u => 
            u.firstName?.toLowerCase().includes(lowerSearch) ||
            u.lastName?.toLowerCase().includes(lowerSearch) ||
            u.email?.toLowerCase().includes(lowerSearch)
        );
    }, [users, searchTerm]);

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/users?page=${page}`);
            setUsers(response.data.users);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserDetails = async (userId) => {
        try {
            const response = await api.get(`/admin/users/${userId}`);
            setUserDetails(response.data);
            setSelectedUser(userId);
        } catch (error) {
            toast.error('Failed to load user details');
        }
    };

    const handleDeactivateUser = async (userId) => {
        if (!window.confirm('Deactivate this user?')) return;

        try {
            await api.patch(`/admin/users/${userId}/deactivate`);
            toast.success('✅ User deactivated');
            fetchUsers();
            setSelectedUser(null);
            setUserDetails(null);
        } catch (error) {
            toast.error(`❌ ${error.response?.data?.message || 'Failed to deactivate user'}`);
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
                    <h1 className="text-3xl font-bold text-white">Manage Users</h1>
                </div>

                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-white transition-colors" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-white pl-12 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-500"
                    />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Users List */}
                <div className="md:col-span-2">
                    {loading ? (
                        <p className="text-white">⏳ Loading...</p>
                    ) : users.length === 0 ? (
                        <p className="text-slate-300">No users found</p>
                    ) : (
                        <>
                            <div className="space-y-3">
                                {filteredUsers.map((user) => (
                                    <div
                                        key={user._id}
                                        onClick={() => fetchUserDetails(user._id)}
                                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedUser === user._id
                                                ? 'bg-blue-900 border-blue-600'
                                                : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-white">
                                                    {user.firstName} {user.lastName}
                                                </p>
                                                <p className="text-sm text-slate-400">{user.email}</p>
                                            </div>
                                            <span className="text-2xl">👤</span>
                                        </div>
                                    </div>
                                ))}
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

                {/* User Details */}
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 sticky top-6 h-fit">
                    {userDetails ? (
                        <>
                            <h3 className="text-xl font-bold text-white mb-6">📊 User Details</h3>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-slate-400 text-sm">Name</p>
                                    <p className="text-white font-semibold">
                                        {userDetails.user.firstName} {userDetails.user.lastName}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-slate-400 text-sm">Email</p>
                                    <p className="text-white">{userDetails.user.email}</p>
                                </div>

                                <div>
                                    <p className="text-slate-400 text-sm">Phone</p>
                                    <p className="text-white">{userDetails.user.phone || 'N/A'}</p>
                                </div>

                                <div className="border-t border-slate-700 pt-4">
                                    <p className="text-slate-400 text-sm">Joined</p>
                                    <p className="text-white">
                                        {new Date(userDetails.user.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-slate-400 text-sm">Total Bookings</p>
                                    <p className="text-2xl font-bold text-blue-400">{userDetails.bookingsCount}</p>
                                </div>

                                <div>
                                    <p className="text-slate-400 text-sm">Total Spent</p>
                                    <p className="text-2xl font-bold text-green-400">₹{userDetails.totalSpent?.toLocaleString()}</p>
                                </div>

                                <div className="border-t border-slate-700 pt-4">
                                    <p className="text-slate-400 text-sm mb-3">Recent Bookings</p>
                                    <div className="space-y-2">
                                        {userDetails.recentBookings?.map((booking) => (
                                            <div key={booking._id} className="bg-slate-700 rounded p-3 text-sm">
                                                <p className="text-white capitalize">{booking.bookingType}</p>
                                                <p className="text-green-400">₹{booking.totalPrice}</p>
                                                <p className="text-slate-400 text-xs">
                                                    {new Date(booking.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDeactivateUser(userDetails.user._id)}
                                    className="w-full mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold"
                                >
                                    🔒 Deactivate User
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-slate-400 text-center">Select a user to view details</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;