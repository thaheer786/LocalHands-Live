const express = require('express');
const router = express.Router();
const { queryAll } = require('../db/database');

router.get('/', (req, res) => {
  const categories = queryAll(`
    SELECT c.*, COUNT(s.id) as service_count 
    FROM categories c 
    LEFT JOIN services s ON c.id = s.category_id 
    GROUP BY c.id 
    ORDER BY c.name ASC
  `);
  res.json({ success: true, categories });
});

module.exports = router;
