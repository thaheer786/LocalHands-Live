const express = require('express');
const router = express.Router();
const { queryAll, queryGet, executeRun } = require('../db/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/', (req, res) => {
  const { availability, verified } = req.query;
  let sql = `
    SELECT p.*, u.name as name, u.email as email, u.avatar as avatar, u.phone as phone
    FROM providers p
    JOIN users u ON p.user_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (availability) {
    sql += ` AND p.availability = ?`;
    params.push(availability);
  }

  if (verified !== undefined) {
    sql += ` AND p.is_verified = ?`;
    params.push(verified === 'true' ? 1 : 0);
  } else {
    sql += ` AND p.is_verified = 1`; // Default to verified only
  }

  sql += ` ORDER BY p.rating DESC, p.completed_jobs DESC`;

  const providers = queryAll(sql, params);
  res.json({ success: true, count: providers.length, providers });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const provider = queryGet(`
    SELECT p.*, u.name as name, u.email as email, u.avatar as avatar, u.phone as phone
    FROM providers p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = ? OR p.user_id = ?
  `, [id, id]);

  if (!provider) {
    return res.status(404).json({ success: false, error: 'Provider not found.' });
  }

  // Fetch reviews for this provider
  const reviews = queryAll(`
    SELECT r.*, u.name as customer_name, u.avatar as customer_avatar
    FROM reviews r
    JOIN customers c ON r.customer_id = c.id
    JOIN users u ON c.user_id = u.id
    WHERE r.provider_id = ?
    ORDER BY r.created_at DESC
  `, [provider.id]);

  // Fetch services offered
  const services = queryAll(`
    SELECT s.*, c.name as category_name
    FROM services s
    JOIN provider_services ps ON ps.service_id = s.id
    JOIN categories c ON s.category_id = c.id
    WHERE ps.provider_id = ?
  `, [provider.id]);

  res.json({ success: true, provider, reviews, services });
});

// Update Provider profile
router.put('/me/profile', authenticateToken, requireRole(['provider']), (req, res) => {
  const { bio, hourly_rate, availability } = req.body;
  const provider = queryGet('SELECT id FROM providers WHERE user_id = ?', [req.user.id]);

  if (!provider) {
    return res.status(404).json({ success: false, error: 'Provider record not found.' });
  }

  executeRun(
    'UPDATE providers SET bio = COALESCE(?, bio), hourly_rate = COALESCE(?, hourly_rate), availability = COALESCE(?, availability) WHERE id = ?',
    [bio, hourly_rate, availability, provider.id]
  );

  const updatedProvider = queryGet(`
    SELECT p.*, u.name, u.email, u.avatar 
    FROM providers p JOIN users u ON p.user_id = u.id 
    WHERE p.id = ?
  `, [provider.id]);

  res.json({ success: true, message: 'Provider profile updated successfully.', provider: updatedProvider });
});

module.exports = router;
