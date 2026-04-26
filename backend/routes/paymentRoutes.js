const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createOrder,
  verifyPayment,
  getPaymentStatus,
  refundPayment
} = require('../controllers/paymentController');

// Create a Razorpay order
router.post('/create-order', auth, createOrder);

// Verify payment after Razorpay callback
router.post('/verify', auth, verifyPayment);

// Get payment status
router.get('/status/:paymentId', auth, getPaymentStatus);

// Refund a payment
router.post('/refund', auth, refundPayment);

module.exports = router;
