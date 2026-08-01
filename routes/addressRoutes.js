const express = require('express');
const router = express.Router();
const { queryAll, queryGet, executeRun } = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, (req, res) => {
  const addresses = queryAll('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC', [req.user.id]);
  res.json({ success: true, addresses });
});

router.post('/', authenticateToken, (req, res) => {
  const { title, street, city, state, zip, is_default } = req.body;

  if (!street || !city || !state || !zip) {
    return res.status(400).json({ success: false, error: 'Street, city, state, and zip code are required.' });
  }

  const addressId = 'addr-' + Date.now();
  if (is_default) {
    executeRun('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [req.user.id]);
  }

  executeRun(
    'INSERT INTO addresses (id, user_id, title, street, city, state, zip, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [addressId, req.user.id, title || 'Home', street, city, state, zip, is_default ? 1 : 0]
  );

  const createdAddress = queryGet('SELECT * FROM addresses WHERE id = ?', [addressId]);
  res.status(201).json({ success: true, address: createdAddress });
});

router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  executeRun('DELETE FROM addresses WHERE id = ? AND user_id = ?', [id, req.user.id]);
  res.json({ success: true, message: 'Address deleted successfully.' });
});

module.exports = router;
