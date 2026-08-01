const express = require('express');
const router = express.Router();
const { queryAll, executeRun } = require('../db/database');

// Post user requirement
router.post('/', (req, res) => {
  const { name, phone, city, category, details, budget } = req.body;

  if (!name || !phone || !details) {
    return res.status(400).json({ success: false, error: 'Name, phone, and requirement details are required.' });
  }

  const id = 'req-' + Date.now();
  executeRun(
    'INSERT INTO requirements (id, user_name, phone, city, category, details, budget) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, name, phone, city || 'Piduguralla', category || 'General', details, budget || 'Negotiable']
  );

  res.json({ success: true, message: 'Requirement posted successfully! Local service providers will contact you shortly.', id });
});

// List requirements
router.get('/', (req, res) => {
  const requirements = queryAll('SELECT * FROM requirements ORDER BY created_at DESC');
  res.json({ success: true, count: requirements.length, requirements });
});

module.exports = router;
