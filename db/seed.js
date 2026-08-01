const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { db, execSchema, executeRun, queryGet } = require('./database');

async function seed() {
  console.log('Initializing database schema...');
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  execSchema(schemaSql);

  // Check if users already exist
  const existingUser = queryGet('SELECT id FROM users LIMIT 1');
  if (existingUser) {
    console.log('Database already contains data. Skipping re-seed.');
    return;
  }

  console.log('Seeding initial data...');

  const passwordHash = bcrypt.hashSync('password123', 10);

  // Seed Users
  const users = [
    { id: 'user-admin-1', name: 'System Admin', email: 'admin@localhands.com', role: 'admin', phone: '+1 (555) 019-2831', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250' },
    { id: 'user-cust-1', name: 'Alex Johnson', email: 'alex@example.com', role: 'customer', phone: '+1 (555) 234-5678', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250' },
    { id: 'user-cust-2', name: 'Sophia Chen', email: 'sophia@example.com', role: 'customer', phone: '+1 (555) 876-5432', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250' },
    
    // Providers
    { id: 'user-prov-1', name: 'Marcus Miller', email: 'marcus@localhands.com', role: 'provider', phone: '+1 (555) 456-7890', avatar: 'assets/bhuvan.jpg' },
    { id: 'user-prov-2', name: 'Charan Raj', email: 'charan@localhands.com', role: 'provider', phone: '+1 (555) 345-6789', avatar: 'assets/charan.jpg' },
    { id: 'user-prov-3', name: 'Revanth Kumar', email: 'revanth@localhands.com', role: 'provider', phone: '+1 (555) 567-8901', avatar: 'assets/revanth.jpg' },
    { id: 'user-prov-4', name: 'David Smith', email: 'david@localhands.com', role: 'provider', phone: '+1 (555) 678-9012', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250' },
    { id: 'user-prov-5', name: 'Elena Rostova', email: 'elena@localhands.com', role: 'provider', phone: '+1 (555) 789-0123', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250' }
  ];

  for (const u of users) {
    executeRun(
      'INSERT INTO users (id, name, email, password_hash, role, phone, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [u.id, u.name, u.email, passwordHash, u.role, u.phone, u.avatar]
    );
  }

  // Seed Customers
  executeRun('INSERT INTO customers (id, user_id) VALUES (?, ?)', ['cust-1', 'user-cust-1']);
  executeRun('INSERT INTO customers (id, user_id) VALUES (?, ?)', ['cust-2', 'user-cust-2']);

  // Seed Addresses
  executeRun(
    'INSERT INTO addresses (id, user_id, title, street, city, state, zip, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    ['addr-1', 'user-cust-1', 'Home', '742 Evergreen Terrace', 'Springfield', 'OR', '97477', 1]
  );
  executeRun(
    'INSERT INTO addresses (id, user_id, title, street, city, state, zip, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    ['addr-2', 'user-cust-1', 'Office', '100 Cyber Way, Suite 400', 'Springfield', 'OR', '97477', 0]
  );

  // Seed Providers
  const providers = [
    { id: 'prov-1', user_id: 'user-prov-1', bio: 'Licensed Master Electrician & Smart Home Specialist with 8+ years experience.', experience_years: 8, rating: 4.9, hourly_rate: 65.0, is_verified: 1, availability: 'available', completed_jobs: 142 },
    { id: 'prov-2', user_id: 'user-prov-2', bio: 'Senior Appliance & AC Repair Technician certified in major global brands.', experience_years: 6, rating: 4.8, hourly_rate: 55.0, is_verified: 1, availability: 'available', completed_jobs: 98 },
    { id: 'prov-3', user_id: 'user-prov-3', bio: 'Expert Plumber & Pipe Sanitation Pro handling emergency leaks & fixture installs.', experience_years: 7, rating: 4.95, hourly_rate: 60.0, is_verified: 1, availability: 'available', completed_jobs: 215 },
    { id: 'prov-4', user_id: 'user-prov-4', bio: 'Professional Carpenter & Furniture Assembly Specialist with high precision tools.', experience_years: 5, rating: 4.7, hourly_rate: 50.0, is_verified: 1, availability: 'busy', completed_jobs: 64 },
    { id: 'prov-5', user_id: 'user-prov-5', bio: 'Residential Deep Cleaning Expert & Maid Services manager.', experience_years: 4, rating: 4.85, hourly_rate: 45.0, is_verified: 1, availability: 'available', completed_jobs: 110 }
  ];

  for (const p of providers) {
    executeRun(
      'INSERT INTO providers (id, user_id, bio, experience_years, rating, hourly_rate, is_verified, availability, completed_jobs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [p.id, p.user_id, p.bio, p.experience_years, p.rating, p.hourly_rate, p.is_verified, p.availability, p.completed_jobs]
    );
  }

  // Seed Categories
  const categories = [
    { id: 'cat-appliance', name: 'AC & Appliances', slug: 'ac-appliances', icon: 'fa-wind', description: 'Air conditioner, refrigerator, TV, and washer repairs.', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=500' },
    { id: 'cat-plumbing', name: 'Plumbing', slug: 'plumbing', icon: 'fa-faucet', description: 'Leaking pipes, drain cleaning, tap replacement, and fixture installs.', image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=500' },
    { id: 'cat-electrical', name: 'Electrical', slug: 'electrical', icon: 'fa-bolt', description: 'Wiring, circuit breakers, light fixtures, and smart switches.', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=500' },
    { id: 'cat-cleaning', name: 'Cleaning & Maid', slug: 'cleaning', icon: 'fa-broom', description: 'Deep house cleaning, kitchen degreasing, sofa and carpet wash.', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=500' },
    { id: 'cat-carpentry', name: 'Carpentry & Assembly', slug: 'carpentry', icon: 'fa-hammer', description: 'Furniture assembly, door latch repair, custom shelving, and woodwork.', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=500' },
    { id: 'cat-painting', name: 'Painting & Decor', slug: 'painting', icon: 'fa-paint-roller', description: 'Full interior wall painting, waterproofing, and accent wall finishes.', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=500' }
  ];

  for (const c of categories) {
    executeRun(
      'INSERT INTO categories (id, name, slug, icon, description, image) VALUES (?, ?, ?, ?, ?, ?)',
      [c.id, c.name, c.slug, c.icon, c.description, c.image]
    );
  }

  // Seed Services
  const services = [
    { id: 'srv-1', category_id: 'cat-plumbing', name: 'Plumbing Repairs & Leak Fix', description: 'Diagnostic inspection and instant repair of leaking pipes, sinks, and faucets.', price: 49.0, duration_mins: 60, image: 'https://scoutnetworkblog.com/wp-content/uploads/2018/11/Plumber-Sink-201709-003.jpg' },
    { id: 'srv-2', category_id: 'cat-appliance', name: 'AC Repair & Gas Refill', description: 'Complete AC cooling service, filter wash, and refrigerant pressure check.', price: 79.0, duration_mins: 90, image: 'assets/Electrician2.jpg' },
    { id: 'srv-3', category_id: 'cat-electrical', name: 'Electrical Wiring & Switchboard', description: 'Safe troubleshooting of blown fuses, short circuits, and switch replacements.', price: 55.0, duration_mins: 60, image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=500' },
    { id: 'srv-4', category_id: 'cat-cleaning', name: 'Full Home Deep Cleaning', description: 'Comprehensive sanitization of living rooms, bedrooms, glass, and flooring.', price: 120.0, duration_mins: 180, image: 'assets/Maid3.jpg' },
    { id: 'srv-5', category_id: 'cat-carpentry', name: 'Furniture Assembly & Woodwork', description: 'Precision assembly for IKEA, beds, tables, wardrobes, and cabinets.', price: 65.0, duration_mins: 120, image: 'assets/Carpenter4.jpg' },
    { id: 'srv-6', category_id: 'cat-painting', name: 'Interior Wall Painting', description: 'Premium washable emulsion paint application with wall sanding & primer.', price: 199.0, duration_mins: 240, image: 'https://handymanofcobb.com/wp-content/uploads/2022/05/greensboro-professional-painters-drywall-repair-1_orig.jpg' },
    { id: 'srv-7', category_id: 'cat-appliance', name: 'Refrigerator Maintenance', description: 'Thermostat testing, door seal replacement, and compressor diagnosis.', price: 59.0, duration_mins: 75, image: 'https://t3.ftcdn.net/jpg/02/55/57/22/360_F_255572256_oIMCf8pbQLCBydVURwejdq0iPEcbUVE9.jpg' },
    { id: 'srv-8', category_id: 'cat-electrical', name: 'Smart Home Automation Installation', description: 'Setup of smart doorbells, Wi-Fi switches, and ambient LED light strips.', price: 89.0, duration_mins: 90, image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=500' }
  ];

  for (const s of services) {
    executeRun(
      'INSERT INTO services (id, category_id, name, description, price, duration_mins, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [s.id, s.category_id, s.name, s.description, s.price, s.duration_mins, s.image]
    );
  }

  // Provider Services mapping
  executeRun('INSERT INTO provider_services (provider_id, service_id) VALUES (?, ?)', ['prov-1', 'srv-3']);
  executeRun('INSERT INTO provider_services (provider_id, service_id) VALUES (?, ?)', ['prov-1', 'srv-8']);
  executeRun('INSERT INTO provider_services (provider_id, service_id) VALUES (?, ?)', ['prov-2', 'srv-2']);
  executeRun('INSERT INTO provider_services (provider_id, service_id) VALUES (?, ?)', ['prov-2', 'srv-7']);
  executeRun('INSERT INTO provider_services (provider_id, service_id) VALUES (?, ?)', ['prov-3', 'srv-1']);
  executeRun('INSERT INTO provider_services (provider_id, service_id) VALUES (?, ?)', ['prov-4', 'srv-5']);
  executeRun('INSERT INTO provider_services (provider_id, service_id) VALUES (?, ?)', ['prov-5', 'srv-4']);

  // Seed Sample Bookings
  executeRun(
    'INSERT INTO bookings (id, booking_number, customer_id, provider_id, service_id, address_id, status, scheduled_date, scheduled_time, total_price, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    ['book-101', 'LH-2026-8801', 'cust-1', 'prov-3', 'srv-1', 'addr-1', 'completed', '2026-07-28', '10:00 AM', 49.0, 'Kitchen sink is leaking under the cabinet.']
  );
  executeRun(
    'INSERT INTO bookings (id, booking_number, customer_id, provider_id, service_id, address_id, status, scheduled_date, scheduled_time, total_price, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    ['book-102', 'LH-2026-8802', 'cust-1', 'prov-1', 'srv-3', 'addr-1', 'in_progress', '2026-08-02', '02:30 PM', 55.0, 'Main circuit breaker keeps tripping.']
  );

  // Seed Review
  executeRun(
    'INSERT INTO reviews (id, booking_id, customer_id, provider_id, rating, comment) VALUES (?, ?, ?, ?, ?, ?)',
    ['rev-1', 'book-101', 'cust-1', 'prov-3', 5, 'Revanth arrived right on time, fixed the leak under 30 minutes and kept everything super clean. Highly recommended!']
  );

  // Seed Notification
  executeRun(
    'INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)',
    ['notif-1', 'user-cust-1', 'Booking Confirmed', 'Your booking LH-2026-8802 with Marcus Miller is currently in progress.', 'success']
  );

  console.log('Database successfully seeded!');
}

if (require.main === module) {
  seed();
}

module.exports = seed;
