const express = require('express');
const router = express.Router();
const { queryAll, queryGet, executeRun } = require('../db/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/', (req, res) => {
  const { availability, verified, city, category } = req.query;
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

  if (city && city !== 'all') {
    sql += ` AND LOWER(p.city) LIKE ?`;
    params.push(`%${city.toLowerCase()}%`);
  }

  if (category && category !== 'all') {
    sql += ` AND p.category_slug = ?`;
    params.push(category);
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

// Update Provider profile & business listing
router.put('/me/profile', authenticateToken, requireRole(['provider', 'admin']), (req, res) => {
  const {
    name,
    phone,
    city,
    category_slug,
    whatsapp,
    email,
    availability,
    bio,
    full_description,
    address,
    service_area,
    hourly_rate,
    experience_years,
    avatar
  } = req.body;

  let provider = queryGet('SELECT id FROM providers WHERE user_id = ?', [req.user.id]);
  
  if (!provider) {
    const newProvId = 'prov-' + Date.now();
    executeRun(
      'INSERT INTO providers (id, user_id, bio, full_description, experience_years, hourly_rate, availability, city, category_slug, whatsapp, address, service_area) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [newProvId, req.user.id, bio || '', full_description || '', experience_years || 1, hourly_rate || 400.0, availability || 'available', city || 'Piduguralla', category_slug || 'home-services', whatsapp || '', address || '', service_area || 'Within 15 km']
    );
    provider = { id: newProvId };
  } else {
    executeRun(
      `UPDATE providers SET 
        bio = COALESCE(?, bio),
        full_description = COALESCE(?, full_description),
        experience_years = COALESCE(?, experience_years),
        hourly_rate = COALESCE(?, hourly_rate),
        availability = COALESCE(?, availability),
        city = COALESCE(?, city),
        category_slug = COALESCE(?, category_slug),
        whatsapp = COALESCE(?, whatsapp),
        address = COALESCE(?, address),
        service_area = COALESCE(?, service_area)
      WHERE id = ?`,
      [bio, full_description, experience_years, hourly_rate, availability, city, category_slug, whatsapp, address, service_area, provider.id]
    );
  }

  // Also update users table name, phone, email, avatar if provided
  if (name || phone || email || avatar) {
    executeRun(
      `UPDATE users SET 
        name = COALESCE(?, name),
        phone = COALESCE(?, phone),
        email = COALESCE(?, email),
        avatar = COALESCE(?, avatar)
      WHERE id = ?`,
      [name, phone, email, avatar, req.user.id]
    );
  }

  const updatedProvider = queryGet(`
    SELECT p.*, u.name, u.email, u.phone, u.avatar 
    FROM providers p JOIN users u ON p.user_id = u.id 
    WHERE p.id = ?
  `, [provider.id]);

  res.json({ success: true, message: 'Business listing saved & updated in database!', provider: updatedProvider });
});

module.exports = router;
