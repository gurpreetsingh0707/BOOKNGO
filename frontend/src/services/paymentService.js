import api from './api';

const paymentService = {
    // Create payment order
    createOrder: (bookingId, amount) =>
        api.post('/payments/create-order', {
            amount,
            bookingId,
            description: `BOOKNGO Booking Payment`
        }),

    // Verify payment
    verifyPayment: (orderId, paymentId, signature, bookingId) =>
        api.post('/payments/verify-payment', {
            orderId,
            paymentId,
            signature,
            bookingId
        }),

    // Get payment status
    getPaymentStatus: (paymentId) =>
        api.get(`/payments/status/${paymentId}`),

    // Refund payment
    refundPayment: (paymentId, bookingId, amount) =>
        api.post('/payments/refund', {
            paymentId,
            bookingId,
            amount
        })
};

export default paymentService;