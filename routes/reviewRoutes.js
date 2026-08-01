const express = require('express');
const router = express.Router();
const { queryAll, queryGet, executeRun } = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

router.post('/', authenticateToken, (req, res) => {
  const { booking_id, rating, comment } = req.body;

  if (!booking_id || !rating) {
    return res.status(400).json({ success: false, error: 'Booking ID and numeric rating (1-5) are required.' });
  }

  const booking = queryGet('SELECT * FROM bookings WHERE id = ?', [booking_id]);
  if (!booking) {
    return res.status(404).json({ success: false, error: 'Associated booking not found.' });
  }

  const existingReview = queryGet('SELECT id FROM reviews WHERE booking_id = ?', [booking_id]);
  if (existingReview) {
    return res.status(400).json({ success: false, error: 'A review has already been submitted for this booking.' });
  }

  const reviewId = 'rev-' + Date.now();
  executeRun(
    'INSERT INTO reviews (id, booking_id, customer_id, provider_id, rating, comment) VALUES (?, ?, ?, ?, ?, ?)',
    [reviewId, booking_id, booking.customer_id, booking.provider_id, Math.min(5, Math.max(1, parseInt(rating))), comment || '']
  );

  // Recalculate Provider average rating
  const avgResult = queryGet('SELECT AVG(rating) as avg_rating FROM reviews WHERE provider_id = ?', [booking.provider_id]);
  if (avgResult && avgResult.avg_rating) {
    executeRun('UPDATE providers SET rating = ? WHERE id = ?', [Math.round(avgResult.avg_rating * 10) / 10, booking.provider_id]);
  }

  res.status(201).json({ success: true, message: 'Thank you for your feedback! Review saved successfully.' });
});

router.get('/provider/:id', (req, res) => {
  const { id } = req.params;
  const reviews = queryAll(`
    SELECT r.*, u.name as customer_name, u.avatar as customer_avatar
    FROM reviews r
    JOIN customers c ON r.customer_id = c.id
    JOIN users u ON c.user_id = u.id
    WHERE r.provider_id = ?
    ORDER BY r.created_at DESC
  `, [id]);

  res.json({ success: true, count: reviews.length, reviews });
});

module.exports = router;
