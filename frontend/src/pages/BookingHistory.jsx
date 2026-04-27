import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import bookingService from '../services/bookingService';

const BookingHistory = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await bookingService.getUserBookings();
            setBookings(response.data.data || []);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (bookingId) => {
        if (!window.confirm('Cancel this booking?')) return;

        try {
            setCancelling(bookingId);
            await bookingService.cancelBooking(bookingId);
            toast.success('✅ Booking cancelled!');
            fetchBookings();
        } catch (error) {
            toast.error(`❌ ${error.response?.data?.message || error.message}`);
        } finally {
            setCancelling(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'text-green-400';
            case 'pending':
                return 'text-yellow-400';
            case 'cancelled':
                return 'text-red-400';
            default:
                return 'text-slate-400';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'movie':
                return '🎬';
            case 'train':
                return '🚂';
            case 'bus':
                return '🚌';
            case 'hotel':
                return '🏨';
            case 'flight':
                return '✈️';
            default:
                return '📝';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <div className="text-white text-center">
                        <div className="text-4xl mb-4">⏳</div>
                        <p>Loading bookings...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900">
            <Navbar />

            {/* Header */}
            <div className="relative bg-gradient-to-b from-purple-900 to-slate-900 px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    <button
                        onClick={() => navigate('/')}
                        className="absolute left-6 top-6 bg-white/10 hover:bg-white/20 text-slate-200 p-2 rounded-full border border-white/20 backdrop-blur-sm transition-all flex items-center justify-center group shadow-md hover:shadow-lg"
                        title="Go Back"
                    >
                        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <h1 className="text-5xl font-bold text-white mb-4">📋 My Bookings</h1>
                    <p className="text-xl text-slate-300">Total: {bookings.length} bookings</p>
                </div>
            </div>

            {/* Bookings List */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                {bookings.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-slate-300 text-lg mb-4">No bookings yet</p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold"
                        >
                            Start Booking →
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                                    {/* Type & Title */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-3xl">{getTypeIcon(booking.bookingType)}</span>
                                            <span className="capitalize font-bold text-white text-lg">
                                                {booking.bookingType}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-400">
                                            {booking.bookingDetails?.serviceName || 'Unknown Service'}
                                        </p>
                                    </div>

                                    {/* Details */}
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1">SEATS / ROOMS</p>
                                        <p className="text-white font-semibold">
                                            {booking.bookingType === 'hotel'
                                                ? `${booking.quantity} room(s) × ${booking.bookingDetails?.numberOfDays || 1} night(s)`
                                                : `${booking.quantity} seat(s)`}
                                        </p>
                                        {booking.travelDate && (
                                            <p className="text-slate-400 text-sm mt-1">
                                                📅 {new Date(booking.travelDate).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>

                                    {/* Price & Quantity */}
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1">PRICE</p>
                                        <p className="text-2xl font-bold text-green-400">₹{booking.totalPrice}</p>
                                        <p className="text-sm text-slate-400">
                                            ₹{booking.pricePerUnit} per unit
                                        </p>
                                    </div>

                                    {/* Date & Status */}
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1">STATUS</p>
                                        <p className={`font-bold capitalize ${getStatusColor(booking.bookingStatus)}`}>
                                            {booking.bookingStatus}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-2">
                                            Booked: {new Date(booking.bookingDate).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => alert(`
Booking ID: ${booking._id}
Type: ${booking.bookingType}
Service: ${booking.bookingDetails?.serviceName}
Status: ${booking.bookingStatus}
Payment: ${booking.paymentStatus}
Total: ₹${booking.totalPrice}
Date: ${new Date(booking.bookingDate || booking.createdAt).toLocaleString()}
                      `)}
                                            className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-semibold text-sm"
                                        >
                                            View
                                        </button>
                                        {booking.bookingStatus !== 'cancelled' && (
                                            <button
                                                onClick={() => handleCancel(booking._id)}
                                                disabled={cancelling === booking._id}
                                                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold text-sm disabled:opacity-50"
                                            >
                                                {cancelling === booking._id ? '⏳...' : 'Cancel'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingHistory;