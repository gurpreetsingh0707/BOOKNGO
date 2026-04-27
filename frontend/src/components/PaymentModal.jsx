import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const PaymentModal = ({ booking, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePayment = async () => {
        try {
            setLoading(true);
            setError(null);

            // Step 1: Create order
            const orderResponse = await api.post('/payments/create-order', {
                amount: booking.totalPrice,
                bookingId: booking._id,
                description: `Payment for ${booking.bookingType} booking`
            });

            const { orderId, amount } = orderResponse.data;

            // Step 2: Load Razorpay script
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);

            script.onload = () => {
                // Step 3: Open Razorpay modal
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                    amount: amount,
                    currency: 'INR',
                    name: 'BOOKNGO',
                    description: `Payment for ${booking.bookingType} booking`,
                    order_id: orderId,
                    handler: async (response) => {
                        // Step 4: Verify payment
                        try {
                            const verifyResponse = await api.post('/payments/verify', {
                                orderId: response.razorpay_order_id,
                                paymentId: response.razorpay_payment_id,
                                signature: response.razorpay_signature,
                                bookingId: booking._id
                            });

                            if (verifyResponse.data.success) {
                                toast.success('✅ Payment successful! Booking confirmed.');
                                onSuccess(verifyResponse.data.booking);
                                onClose();
                            }
                        } catch (verifyError) {
                            setError(verifyError.response?.data?.message || 'Payment verification failed');
                            console.error(verifyError);
                        } finally {
                            setLoading(false);
                        }
                    },
                    prefill: {
                        email: booking.userEmail || 'customer@example.com'
                    },
                    theme: {
                        color: '#7c3aed'
                    },
                    modal: {
                        ondismiss: () => setLoading(false)
                    }
                };

                try {
                    const rzp = new window.Razorpay(options);
                    rzp.on('payment.failed', (response) => {
                        setError(`Payment failed: ${response.error.description}`);
                        setLoading(false);
                    });
                    rzp.open();
                } catch (e) {
                    setError('Failed to initialize Razorpay');
                    setLoading(false);
                }
            };
            
            script.onerror = () => {
                setError('Failed to load Razorpay script');
                setLoading(false);
            };
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg p-8 max-w-md w-full mx-4">
                <h2 className="text-2xl font-bold text-white mb-4">💳 Complete Payment</h2>

                <div className="bg-slate-700 rounded p-4 mb-6">
                    <div className="flex justify-between mb-2">
                        <span className="text-slate-300">Booking Type:</span>
                        <span className="text-white font-semibold capitalize">{booking.bookingType}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-slate-300">Quantity:</span>
                        <span className="text-white font-semibold">{booking.quantity}</span>
                    </div>
                    <div className="border-t border-slate-600 pt-2">
                        <div className="flex justify-between">
                            <span className="text-slate-300 font-semibold">Total Amount:</span>
                            <span className="text-green-400 font-bold text-lg">₹{booking.totalPrice}</span>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-900/30 border border-red-600 rounded p-3 mb-4">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                <div className="space-y-3">
                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {loading ? '⏳ Processing...' : '💳 Pay with Razorpay'}
                    </button>

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>

                <p className="text-xs text-slate-400 text-center mt-4">
                    Safe & secure payments powered by Razorpay
                </p>
            </div>
        </div>
    );
};

export default PaymentModal;