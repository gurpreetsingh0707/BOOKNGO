const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Order
exports.createOrder = async (req, res) => {
    try {
        const { amount, bookingId, description } = req.body;
        const userId = req.user._id;

        // Verify booking exists
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.userId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        // Create order
        const options = {
            amount: Math.round(amount * 100), // Amount in paise
            currency: 'INR',
            receipt: `booking_${bookingId}`,
            description: description || `Payment for ${booking.bookingType} booking`
        };

        const order = await razorpay.orders.create(options);

        res.status(201).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency
        });
    } catch (error) {
        console.error('Payment error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
    try {
        const { orderId, paymentId, signature, bookingId } = req.body;
        const userId = req.user._id;

        // Verify signature
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(orderId + '|' + paymentId);
        const generated_signature = hmac.digest('hex');

        if (generated_signature !== signature) {
            return res.status(400).json({ success: false, message: 'Invalid signature' });
        }

        // Update booking status
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.userId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        booking.paymentStatus = 'completed';
        booking.paymentId = paymentId;
        booking.bookingStatus = 'confirmed';
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Payment verified and booking confirmed',
            booking
        });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Payment Status
exports.getPaymentStatus = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const userId = req.user._id;

        // Fetch from Razorpay
        const payment = await razorpay.payments.fetch(paymentId);

        res.status(200).json({
            success: true,
            payment: {
                id: payment.id,
                amount: payment.amount,
                currency: payment.currency,
                status: payment.status,
                method: payment.method,
                created_at: payment.created_at
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Refund Payment
exports.refundPayment = async (req, res) => {
    try {
        const { paymentId, bookingId, amount } = req.body;
        const userId = req.user._id;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.userId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        // Create refund
        const refund = await razorpay.payments.refund(paymentId, {
            amount: Math.round(amount * 100)
        });

        // Update booking
        booking.paymentStatus = 'refunded';
        booking.bookingStatus = 'cancelled';
        booking.cancelledDate = new Date();
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Refund processed',
            refund: {
                id: refund.id,
                amount: refund.amount / 100,
                status: refund.status
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};