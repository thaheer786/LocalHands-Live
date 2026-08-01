const express = require('express');
const router = express.Router();
const { queryAll, queryGet } = require('../db/database');

router.get('/', (req, res) => {
  const { category, search, sort } = req.query;
  let sql = `
    SELECT s.*, c.name as category_name, c.slug as category_slug
    FROM services s
    JOIN categories c ON s.category_id = c.id
    WHERE 1=1
  `;
  const params = [];

  if (category && category !== 'all') {
    sql += ` AND (c.slug = ? OR c.id = ?)`;
    params.push(category, category);
  }

  if (search) {
    sql += ` AND (s.name LIKE ? OR s.description LIKE ? OR c.name LIKE ?)`;
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam, searchParam);
  }

  if (sort === 'price_asc') {
    sql += ` ORDER BY s.price ASC`;
  } else if (sort === 'price_desc') {
    sql += ` ORDER BY s.price DESC`;
  } else {
    sql += ` ORDER BY s.name ASC`;
  }

  const services = queryAll(sql, params);
  res.json({ success: true, count: services.length, services });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const service = queryGet(`
    SELECT s.*, c.name as category_name, c.slug as category_slug
    FROM services s
    JOIN categories c ON s.category_id = c.id
    WHERE s.id = ? OR s.name LIKE ?
  `, [id, `%${id}%`]);

  if (!service) {
    return res.status(404).json({ success: false, error: 'Service not found.' });
  }

  // Fetch providers offering this service
  const providers = queryAll(`
    SELECT p.*, u.name as provider_name, u.avatar as provider_avatar, u.phone as provider_phone
    FROM providers p
    JOIN users u ON p.user_id = u.id
    JOIN provider_services ps ON ps.provider_id = p.id
    WHERE ps.service_id = ? AND p.is_verified = 1
  `, [service.id]);

  res.json({ success: true, service, providers });
});

module.exports = router;
