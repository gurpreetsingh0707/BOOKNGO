const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BOOKNGO';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:');
    console.error('Message:', err.message);
    if (err.message.includes('ECONNREFUSED')) {
      console.error('👉 TIP: Ensure your database server is running or check your MONGODB_URI.');
    }
  });

// Routes
app.use('/api/auth', require('./routes/authroutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/buses', require('./routes/busRoutes'));
app.use('/api/hotels', require('./routes/hotelRoutes'));
app.use('/api/trains', require('./routes/trainRoutes'));
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/flights', require('./routes/flightRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/service-types', require('./routes/serviceTypeRoutes'));
app.use('/api/transactions', require('./routes/transcationRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, message: err.message || 'Server Error' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));