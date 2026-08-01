const express = require('express');
const router = express.Router();
const { queryAll, queryGet, executeRun } = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

// Create Booking
router.post('/', authenticateToken, (req, res) => {
  const { provider_id, service_id, address_id, scheduled_date, scheduled_time, notes } = req.body;

  if (!service_id || !scheduled_date || !scheduled_time) {
    return res.status(400).json({ success: false, error: 'Service ID, date, and time are required.' });
  }

  // Get customer ID
  let customer = queryGet('SELECT id FROM customers WHERE user_id = ?', [req.user.id]);
  if (!customer) {
    // Auto-create customer profile if missing
    const custId = 'cust-' + Date.now();
    executeRun('INSERT INTO customers (id, user_id) VALUES (?, ?)', [custId, req.user.id]);
    customer = { id: custId };
  }

  // Find target provider if not explicitly passed
  let assignedProviderId = provider_id;
  if (!assignedProviderId) {
    const availableProv = queryGet(`
      SELECT p.id FROM providers p
      JOIN provider_services ps ON ps.provider_id = p.id
      WHERE ps.service_id = ? AND p.is_verified = 1 AND p.availability = 'available'
      LIMIT 1
    `, [service_id]);

    if (!availableProv) {
      // Fallback to any verified provider
      const fallbackProv = queryGet('SELECT id FROM providers WHERE is_verified = 1 LIMIT 1');
      assignedProviderId = fallbackProv ? fallbackProv.id : 'prov-1';
    } else {
      assignedProviderId = availableProv.id;
    }
  }

  // Fetch service price
  const service = queryGet('SELECT price FROM services WHERE id = ?', [service_id]);
  const totalPrice = service ? service.price : 50.0;

  const bookingId = 'book-' + Date.now();
  const bookingNumber = 'LH-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

  executeRun(
    `INSERT INTO bookings (id, booking_number, customer_id, provider_id, service_id, address_id, status, scheduled_date, scheduled_time, total_price, notes)
     VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)`,
    [bookingId, bookingNumber, customer.id, assignedProviderId, service_id, address_id || null, scheduled_date, scheduled_time, totalPrice, notes || '']
  );

  // Notify Provider
  const providerObj = queryGet('SELECT user_id FROM providers WHERE id = ?', [assignedProviderId]);
  if (providerObj) {
    executeRun(
      'INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)',
      ['notif-' + Date.now(), providerObj.user_id, 'New Booking Request', `You have received booking request ${bookingNumber}.`, 'info']
    );
  }

  const createdBooking = queryGet('SELECT * FROM bookings WHERE id = ?', [bookingId]);

  res.status(201).json({
    success: true,
    message: 'Booking created successfully!',
    booking: createdBooking
  });
});

// My Bookings Endpoint
router.get('/my-bookings', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  let bookings = [];

  if (userRole === 'customer') {
    const customer = queryGet('SELECT id FROM customers WHERE user_id = ?', [userId]);
    if (customer) {
      bookings = queryAll(`
        SELECT b.*, s.name as service_name, s.image as service_image,
               u_prov.name as provider_name, u_prov.avatar as provider_avatar, u_prov.phone as provider_phone,
               a.street as address_street, a.city as address_city, r.rating as review_rating
        FROM bookings b
        JOIN services s ON b.service_id = s.id
        JOIN providers p ON b.provider_id = p.id
        JOIN users u_prov ON p.user_id = u_prov.id
        LEFT JOIN addresses a ON b.address_id = a.id
        LEFT JOIN reviews r ON r.booking_id = b.id
        WHERE b.customer_id = ?
        ORDER BY b.created_at DESC
      `, [customer.id]);
    }
  } else if (userRole === 'provider') {
    const provider = queryGet('SELECT id FROM providers WHERE user_id = ?', [userId]);
    if (provider) {
      bookings = queryAll(`
        SELECT b.*, s.name as service_name, s.image as service_image,
               u_cust.name as customer_name, u_cust.avatar as customer_avatar, u_cust.phone as customer_phone,
               a.street as address_street, a.city as address_city
        FROM bookings b
        JOIN services s ON b.service_id = s.id
        JOIN customers c ON b.customer_id = c.id
        JOIN users u_cust ON c.user_id = u_cust.id
        LEFT JOIN addresses a ON b.address_id = a.id
        WHERE b.provider_id = ?
        ORDER BY b.created_at DESC
      `, [provider.id]);
    }
  } else if (userRole === 'admin') {
    bookings = queryAll(`
      SELECT b.*, s.name as service_name,
             u_cust.name as customer_name, u_prov.name as provider_name
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN customers c ON b.customer_id = c.id
      JOIN users u_cust ON c.user_id = u_cust.id
      JOIN providers p ON b.provider_id = p.id
      JOIN users u_prov ON p.user_id = u_prov.id
      ORDER BY b.created_at DESC
    `);
  }

  res.json({ success: true, count: bookings.length, bookings });
});

// Single Booking Details
router.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const booking = queryGet(`
    SELECT b.*, s.name as service_name, s.description as service_desc, s.image as service_image, s.price as service_price,
           u_cust.name as customer_name, u_cust.email as customer_email, u_cust.phone as customer_phone, u_cust.avatar as customer_avatar,
           u_prov.name as provider_name, u_prov.phone as provider_phone, u_prov.avatar as provider_avatar, p.rating as provider_rating,
           a.street as address_street, a.city as address_city, a.state as address_state, a.zip as address_zip,
           r.rating as review_rating, r.comment as review_comment
    FROM bookings b
    JOIN services s ON b.service_id = s.id
    JOIN customers c ON b.customer_id = c.id
    JOIN users u_cust ON c.user_id = u_cust.id
    JOIN providers p ON b.provider_id = p.id
    JOIN users u_prov ON p.user_id = u_prov.id
    LEFT JOIN addresses a ON b.address_id = a.id
    LEFT JOIN reviews r ON r.booking_id = b.id
    WHERE b.id = ? OR b.booking_number = ?
  `, [id, id]);

  if (!booking) {
    return res.status(404).json({ success: false, error: 'Booking not found.' });
  }

  res.json({ success: true, booking });
});

// Update Booking Status
router.patch('/:id/status', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid status value.' });
  }

  const booking = queryGet('SELECT * FROM bookings WHERE id = ? OR booking_number = ?', [id, id]);
  if (!booking) {
    return res.status(404).json({ success: false, error: 'Booking not found.' });
  }

  executeRun('UPDATE bookings SET status = ? WHERE id = ?', [status, booking.id]);

  // If completed, increment provider completed_jobs count
  if (status === 'completed') {
    executeRun('UPDATE providers SET completed_jobs = completed_jobs + 1 WHERE id = ?', [booking.provider_id]);
  }

  // Notify customer
  const customerObj = queryGet('SELECT user_id FROM customers WHERE id = ?', [booking.customer_id]);
  if (customerObj) {
    executeRun(
      'INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)',
      ['notif-' + Date.now(), customerObj.user_id, 'Booking Updated', `Your booking ${booking.booking_number} status has been updated to ${status.toUpperCase()}.`, 'info']
    );
  }

  res.json({ success: true, message: `Booking status updated to ${status}.`, status });
});

module.exports = router;
