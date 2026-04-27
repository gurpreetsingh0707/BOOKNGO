const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

console.log('🚀 Starting server initialization...');

const app = express();

// MORE PERMISSIVE CORS
app.use(cors({
  origin: '*', // Allow all origins for testing
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] 📥 ${req.method} ${req.url}`);
  next();
});

// MongoDB Connection
const MONGODB_URI = (process.env.MONGODB_URI || 'mongodb://localhost:27017/BOOKNGO').trim();
console.log('📡 Connecting to:', MONGODB_URI);

mongoose.connect(MONGODB_URI, { family: 4 })
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Error:', err.message));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/buses', require('./routes/busRoutes'));
app.use('/api/hotels', require('./routes/hotelRoutes'));
app.use('/api/trains', require('./routes/trainRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

// 404
app.use((req, res) => res.status(404).json({ success: false, message: 'Not Found' }));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});