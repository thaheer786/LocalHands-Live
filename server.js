const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const seed = require('./db/seed');

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const providerRoutes = require('./routes/providerRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const addressRoutes = require('./routes/addressRoutes');
const adminRoutes = require('./routes/adminRoutes');
const requirementRoutes = require('./routes/requirementRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

// Ensure DB is initialized and seeded
seed();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from current root directory
app.use(express.static(path.join(__dirname, './')));

// Mount REST API Routers
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/requirements', requirementRoutes);

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Local Hands API', timestamp: new Date().toISOString() });
});

// Custom 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: 'API endpoint not found.' });
});

// Serve frontend SPA / page fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ success: false, error: 'Internal Server Error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Local Hands Platform running at: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
