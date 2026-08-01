const express = require('express');
const router = express.Router();
const { queryAll, queryGet, executeRun } = require('../db/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Require Admin Role for all routes in this file
router.use(authenticateToken);
router.use(requireRole(['admin']));

router.get('/stats', (req, res) => {
  const totalUsers = queryGet('SELECT COUNT(*) as count FROM users WHERE role = "customer"').count;
  const totalProviders = queryGet('SELECT COUNT(*) as count FROM providers').count;
  const verifiedProviders = queryGet('SELECT COUNT(*) as count FROM providers WHERE is_verified = 1').count;
  const totalBookings = queryGet('SELECT COUNT(*) as count FROM bookings').count;
  const completedBookings = queryGet('SELECT COUNT(*) as count FROM bookings WHERE status = "completed"').count;
  const totalRevenueResult = queryGet('SELECT SUM(total_price) as sum FROM bookings WHERE status = "completed"');
  const totalRevenue = totalRevenueResult && totalRevenueResult.sum ? totalRevenueResult.sum : 0;
  const totalCategories = queryGet('SELECT COUNT(*) as count FROM categories').count;
  const totalServices = queryGet('SELECT COUNT(*) as count FROM services').count;

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalProviders,
      verifiedProviders,
      totalBookings,
      completedBookings,
      totalRevenue,
      totalCategories,
      totalServices
    }
  });
});

router.get('/users', (req, res) => {
  const users = queryAll('SELECT id, name, email, role, phone, avatar, created_at FROM users ORDER BY created_at DESC');
  res.json({ success: true, count: users.length, users });
});

router.patch('/providers/:id/verify', (req, res) => {
  const { id } = req.params;
  const { is_verified } = req.body;

  executeRun('UPDATE providers SET is_verified = ? WHERE id = ?', [is_verified ? 1 : 0, id]);
  res.json({ success: true, message: `Provider verification status set to ${is_verified ? 'Verified' : 'Unverified'}.` });
});

router.post('/categories', (req, res) => {
  const { name, icon, description, image } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, error: 'Category name is required.' });
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const id = 'cat-' + Date.now();

  executeRun(
    'INSERT INTO categories (id, name, slug, icon, description, image) VALUES (?, ?, ?, ?, ?, ?)',
    [id, name, slug, icon || 'fa-tools', description || '', image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=500']
  );

  res.status(201).json({ success: true, message: 'Category created successfully.', id });
});

router.post('/services', (req, res) => {
  const { category_id, name, description, price, duration_mins, image } = req.body;

  if (!category_id || !name || !price) {
    return res.status(400).json({ success: false, error: 'Category ID, service name, and price are required.' });
  }

  const id = 'srv-' + Date.now();

  executeRun(
    'INSERT INTO services (id, category_id, name, description, price, duration_mins, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, category_id, name, description || '', parseFloat(price), parseInt(duration_mins) || 60, image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=500']
  );

  res.status(201).json({ success: true, message: 'Service created successfully.', id });
});

module.exports = router;
