const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { queryGet, executeRun } = require('../db/database');
const { JWT_SECRET, authenticateToken } = require('../middleware/auth');

// Register Endpoint
router.post('/register', (req, res) => {
  const { name, email, password, role, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
  }

  const userRole = ['customer', 'provider'].includes(role) ? role : 'customer';

  const existingUser = queryGet('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
  if (existingUser) {
    return res.status(400).json({ success: false, error: 'User with this email already exists.' });
  }

  const userId = 'user-' + Date.now();
  const passwordHash = bcrypt.hashSync(password, 10);
  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

  executeRun(
    'INSERT INTO users (id, name, email, password_hash, role, phone, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [userId, name.trim(), email.toLowerCase().trim(), passwordHash, userRole, phone || '', avatar]
  );

  if (userRole === 'customer') {
    const customerId = 'cust-' + Date.now();
    executeRun('INSERT INTO customers (id, user_id) VALUES (?, ?)', [customerId, userId]);
  } else if (userRole === 'provider') {
    const providerId = 'prov-' + Date.now();
    executeRun(
      'INSERT INTO providers (id, user_id, bio, experience_years, rating, hourly_rate, is_verified, availability) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [providerId, userId, 'Professional service provider.', 1, 5.0, 45.0, 1, 'available']
    );
  }

  const token = jwt.sign({ id: userId, email: email.toLowerCase().trim(), role: userRole, name }, JWT_SECRET, { expiresIn: '7d' });

  return res.status(201).json({
    success: true,
    message: 'Registration successful!',
    token,
    user: { id: userId, name, email, role: userRole, avatar }
  });
});

// Login Endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Please provide both email and password.' });
  }

  const user = queryGet('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid email or password.' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password_hash);
  if (!isPasswordValid) {
    return res.status(401).json({ success: false, error: 'Invalid email or password.' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

  return res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone
    }
  });
});

// Demo Quick Login Endpoint
router.post('/demo-login', (req, res) => {
  const { role } = req.body;
  let targetEmail = 'alex@example.com'; // customer

  if (role === 'provider') {
    targetEmail = 'marcus@localhands.com';
  } else if (role === 'admin') {
    targetEmail = 'admin@localhands.com';
  }

  const user = queryGet('SELECT * FROM users WHERE email = ?', [targetEmail]);
  if (!user) {
    return res.status(404).json({ success: false, error: 'Demo user not found.' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

  return res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone
    }
  });
});

// Current User Profile Endpoint
router.get('/me', authenticateToken, (req, res) => {
  const user = queryGet('SELECT id, name, email, role, phone, avatar, created_at FROM users WHERE id = ?', [req.user.id]);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found.' });
  }

  let extraData = {};
  if (user.role === 'customer') {
    const cust = queryGet('SELECT id, preferred_address_id FROM customers WHERE user_id = ?', [user.id]);
    extraData.customer = cust;
  } else if (user.role === 'provider') {
    const prov = queryGet('SELECT * FROM providers WHERE user_id = ?', [user.id]);
    extraData.provider = prov;
  }

  return res.json({
    success: true,
    user: { ...user, ...extraData }
  });
});

// Password recovery routes
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  const user = queryGet('SELECT id FROM users WHERE email = ?', [email ? email.toLowerCase().trim() : '']);
  if (!user) {
    return res.status(404).json({ success: false, error: 'No account found with this email address.' });
  }
  return res.json({ success: true, message: 'Password reset link sent to your email.' });
});

module.exports = router;
