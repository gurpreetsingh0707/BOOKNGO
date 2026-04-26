const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

console.log('🚀 Starting server initialization...');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Connection
const MONGODB_URI = (process.env.MONGODB_URI || 'mongodb://localhost:27017/BOOKNGO').trim();

console.log('📡 Attempting to connect to MongoDB (IPv4 forced)...');

// Force IPv4 to bypass common DNS resolution issues on local machines
mongoose.connect(MONGODB_URI, {
  family: 4 
})
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:');
    console.error('Message:', err.message);
    if (err.message.includes('ECONNREFUSED')) {
      console.error('👉 TIP: Your network is blocking MongoDB DNS. Try switching to a Mobile Hotspot or change your connection string to the "Standard" format in Atlas.');
    }
  });

// Routes
try {
  console.log('🛣️ Loading routes...');
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/bookings', require('./routes/bookingRoutes'));
  app.use('/api/buses', require('./routes/busRoutes'));
  app.use('/api/hotels', require('./routes/hotelRoutes'));
  app.use('/api/trains', require('./routes/trainRoutes'));
  app.use('/api/movies', require('./routes/movieRoutes'));
  app.use('/api/flights', require('./routes/flightRoutes'));
  app.use('/api/search', require('./routes/searchRoutes'));
  app.use('/api/users', require('./routes/userRoutes'));
  app.use('/api/service-types', require('./routes/serviceTypeRoutes'));
  app.use('/api/transactions', require('./routes/transactionRoutes'));
  app.use('/api/payments', require('./routes/paymentRoutes'));
  app.use('/api/admin', require('./routes/adminRoutes'));
  console.log('✅ All routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
}

// 404 & Error Handlers
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error('💥 Global Error:', err);
  res.status(500).json({ success: false, message: err.message || 'Server Error' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});