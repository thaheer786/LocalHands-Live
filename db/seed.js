const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { db, execSchema, executeRun, queryGet } = require('./database');

async function seed() {
  console.log('Initializing database schema...');
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  execSchema(schemaSql);

  // Check if categories already exist
  const existingCategory = queryGet('SELECT id FROM categories LIMIT 1');
  if (existingCategory) {
    console.log('Database already contains data.');
    return;
  }

  console.log('Seeding initial data...');

  const passwordHash = bcrypt.hashSync('password123', 10);

  // Seed Users
  const users = [
    { id: 'user-admin-1', name: 'System Admin', email: 'admin@localhands.com', role: 'admin', phone: '+91 98765 43210', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250' },
    { id: 'user-cust-1', name: 'Ramesh Kumar', email: 'ramesh@example.com', role: 'customer', phone: '+91 98765 11111', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250' },
    { id: 'user-cust-2', name: 'Sophia Chen', email: 'sophia@example.com', role: 'customer', phone: '+91 98765 22222', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250' },
    
    // Providers
    { id: 'user-prov-1', name: 'Krishna Photo Studio', email: 'krishna@photostudio.in', role: 'provider', phone: '+91 98765 33333', avatar: 'assets/bhuvan.jpg' },
    { id: 'user-prov-2', name: 'Charan Appliance Repair', email: 'charan@localhands.com', role: 'provider', phone: '+91 98765 44444', avatar: 'assets/charan.jpg' },
    { id: 'user-prov-3', name: 'Revanth Plumbing Services', email: 'revanth@localhands.com', role: 'provider', phone: '+91 98765 55555', avatar: 'assets/revanth.jpg' },
    { id: 'user-prov-4', name: 'David Woodworks & Decor', email: 'david@localhands.com', role: 'provider', phone: '+91 98765 66666', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250' },
    { id: 'user-prov-5', name: 'Elena Home Care & Nursing', email: 'elena@localhands.com', role: 'provider', phone: '+91 98765 77777', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250' }
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
    ['addr-1', 'user-cust-1', 'Home', 'Main Road, Near Town Hall', 'Piduguralla', 'AP', '522413', 1]
  );

  // Seed Providers
  const providers = [
    { id: 'prov-1', user_id: 'user-prov-1', bio: 'Professional Wedding & Event Photographer with 10+ years experience in Piduguralla.', full_description: 'Top-rated studio equipped with 4K cameras, drones, and professional lighting setup. Specializing in weddings, corporate events, and baby shoots.', experience_years: 10, rating: 4.9, hourly_rate: 1500.0, is_verified: 1, availability: 'available', completed_jobs: 142, city: 'Piduguralla', category_slug: 'events', whatsapp: '+91 98765 33333', address: 'Main Bazaar Road, Opp. RTC Bus Stand, Piduguralla', service_area: 'Within 25 km' },
    { id: 'prov-2', user_id: 'user-prov-2', bio: 'Certified AC & Refrigerator repair specialist covering Springfield & Piduguralla.', full_description: 'Over 6 years of expertise servicing split ACs, window ACs, double door fridges, and washing machines with genuine replacement parts.', experience_years: 6, rating: 4.8, hourly_rate: 500.0, is_verified: 1, availability: 'available', completed_jobs: 98, city: 'Piduguralla', category_slug: 'home-services', whatsapp: '+91 98765 44444', address: 'Station Road, Near SBI Bank, Piduguralla', service_area: 'Within 15 km' },
    { id: 'prov-3', user_id: 'user-prov-3', bio: 'Expert Plumber & Pipe Sanitation Pro for residential & commercial spaces.', full_description: 'Licensed plumbing team available for emergency pipe burst fixes, motor pump installations, water tank cleaning, and bathroom fitting upgrades.', experience_years: 7, rating: 4.95, hourly_rate: 400.0, is_verified: 1, availability: 'available', completed_jobs: 215, city: 'Piduguralla', category_slug: 'home-services', whatsapp: '+91 98765 55555', address: 'Nehru Chowk, Piduguralla', service_area: 'Within 20 km' },
    { id: 'prov-4', user_id: 'user-prov-4', bio: 'Architect & Interior Design Consultant specializing in custom furniture & home decor.', full_description: 'Turnkey interior design services for 2BHK/3BHK apartments, modular kitchen woodwork, ceiling lighting design, and commercial office decor.', experience_years: 8, rating: 4.7, hourly_rate: 1200.0, is_verified: 1, availability: 'available', completed_jobs: 64, city: 'Hyderabad', category_slug: 'professional', whatsapp: '+91 98765 66666', address: 'Hitec City, Madhapur, Hyderabad', service_area: 'Within 40 km' },
    { id: 'prov-5', user_id: 'user-prov-5', bio: 'Registered Nurse & Home Healthcare Provider for post-op care & elderly assistance.', full_description: 'Certified medical nursing care at home including daily vitals monitoring, IV drip setup, dressing changes, and physiotherapy support.', experience_years: 5, rating: 4.85, hourly_rate: 600.0, is_verified: 1, availability: 'available', completed_jobs: 110, city: 'Piduguralla', category_slug: 'health', whatsapp: '+91 98765 77777', address: 'Hospital Road, Piduguralla', service_area: 'Within 15 km' }
  ];

  for (const p of providers) {
    executeRun(
      'INSERT INTO providers (id, user_id, bio, full_description, experience_years, rating, hourly_rate, is_verified, availability, completed_jobs, city, category_slug, whatsapp, address, service_area) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [p.id, p.user_id, p.bio, p.full_description, p.experience_years, p.rating, p.hourly_rate, p.is_verified, p.availability, p.completed_jobs, p.city, p.category_slug, p.whatsapp, p.address, p.service_area]
    );
  }

  // Seed 9 Categories Matching LocalServices.in
  const categories = [
    { id: 'cat-property', name: 'Property Sell / Rent', slug: 'property', icon: 'fa-building', description: 'Houses, flats, commercial spaces, land & plots for sell or rent.', image: '/assets/cat-property-BtbgjS-y.jpg' },
    { id: 'cat-home-services', name: 'Home Services', slug: 'home-services', icon: 'fa-tools', description: 'Electricians, plumbers, AC repair, carpenters, painters & pest control.', image: '/assets/cat-home-CwnTDiQ3.jpg' },
    { id: 'cat-education', name: 'Education & Training', slug: 'education', icon: 'fa-graduation-cap', description: 'Tuition teachers, software training, spoken English & skill development.', image: '/assets/cat-education-CLZVRCGc.jpg' },
    { id: 'cat-health', name: 'Health & Wellness', slug: 'health', icon: 'fa-heartbeat', description: 'Doctors, physiotherapists, yoga trainers, nutritionists & home nursing.', image: '/assets/cat-health-DKRYiDRW.jpg' },
    { id: 'cat-events', name: 'Events & Celebrations', slug: 'events', icon: 'fa-camera', description: 'Photographers, videographers, caterers, decorators & wedding halls.', image: '/assets/cat-events-B3YqM5Jb.jpg' },
    { id: 'cat-automobile', name: 'Automobile', slug: 'automobile', icon: 'fa-car', description: 'Mechanics, car wash, bike service, towing & driving schools.', image: '/assets/cat-auto-D50CFb7N.jpg' },
    { id: 'cat-professional', name: 'Professional Services', slug: 'professional', icon: 'fa-briefcase', description: 'CA & tax advisors, lawyers, insurance agents & digital marketing.', image: '/assets/cat-professional-SnnRlZIt.jpg' },
    { id: 'cat-daily-help', name: 'Daily Help & Labour', slug: 'daily-help', icon: 'fa-user-friends', description: 'Housemaids, security guards, drivers & construction workers.', image: '/assets/cat-daily-CqNRe7Wb.jpg' },
    { id: 'cat-food', name: 'Food & Catering', slug: 'food', icon: 'fa-utensils', description: 'Home chefs, caterers, tiffin services & event food orders.', image: '/assets/cat-food-BaedBVR8.jpg' }
  ];

  for (const c of categories) {
    executeRun(
      'INSERT INTO categories (id, name, slug, icon, description, image) VALUES (?, ?, ?, ?, ?, ?)',
      [c.id, c.name, c.slug, c.icon, c.description, c.image]
    );
  }

  // Seed Services
  const services = [
    { id: 'srv-1', category_id: 'cat-home-services', name: 'Plumbing Repairs & Leak Fix', description: 'Diagnostic inspection and instant repair of leaking pipes, sinks, and faucets.', price: 399.0, duration_mins: 60, image: 'https://scoutnetworkblog.com/wp-content/uploads/2018/11/Plumber-Sink-201709-003.jpg' },
    { id: 'srv-2', category_id: 'cat-home-services', name: 'AC Repair & Gas Refill', description: 'Complete AC cooling service, filter wash, and refrigerant pressure check.', price: 799.0, duration_mins: 90, image: 'assets/Electrician2.jpg' },
    { id: 'srv-3', category_id: 'cat-home-services', name: 'Electrical Wiring & Switchboard', description: 'Safe troubleshooting of blown fuses, short circuits, and switch replacements.', price: 499.0, duration_mins: 60, image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=500' },
    { id: 'srv-4', category_id: 'cat-daily-help', name: 'Full Home Deep Cleaning', description: 'Comprehensive sanitization of living rooms, bedrooms, glass, and flooring.', price: 1499.0, duration_mins: 180, image: 'assets/Maid3.jpg' },
    { id: 'srv-5', category_id: 'cat-home-services', name: 'Furniture Assembly & Woodwork', description: 'Precision assembly for IKEA, beds, tables, wardrobes, and cabinets.', price: 599.0, duration_mins: 120, image: 'assets/Carpenter4.jpg' },
    { id: 'srv-6', category_id: 'cat-events', name: 'Wedding Photography Package', description: 'Full day candid photo + video coverage with digital album and highlight video.', price: 15000.0, duration_mins: 480, image: '/assets/cat-events-B3YqM5Jb.jpg' },
    { id: 'srv-7', category_id: 'cat-property', name: '2 BHK Apartment Rental Deal', description: 'Direct landlord contact for modern 2 BHK flats with no brokerage fee.', price: 12000.0, duration_mins: 30, image: '/assets/cat-property-BtbgjS-y.jpg' },
    { id: 'srv-8', category_id: 'cat-education', name: 'Home Tuition (Class 1 to 10)', description: 'Experienced tutors for Math, Science & English with personalized attention.', price: 2500.0, duration_mins: 60, image: '/assets/cat-education-CLZVRCGc.jpg' }
  ];

  for (const s of services) {
    executeRun(
      'INSERT INTO services (id, category_id, name, description, price, duration_mins, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [s.id, s.category_id, s.name, s.description, s.price, s.duration_mins, s.image]
    );
  }

  // Provider Services mapping
  executeRun('INSERT INTO provider_services (provider_id, service_id) VALUES (?, ?)', ['prov-1', 'srv-6']);
  executeRun('INSERT INTO provider_services (provider_id, service_id) VALUES (?, ?)', ['prov-2', 'srv-2']);
  executeRun('INSERT INTO provider_services (provider_id, service_id) VALUES (?, ?)', ['prov-3', 'srv-1']);
  executeRun('INSERT INTO provider_services (provider_id, service_id) VALUES (?, ?)', ['prov-4', 'srv-5']);
  executeRun('INSERT INTO provider_services (provider_id, service_id) VALUES (?, ?)', ['prov-5', 'srv-4']);

  // Seed Sample Bookings
  executeRun(
    'INSERT INTO bookings (id, booking_number, customer_id, provider_id, service_id, address_id, status, scheduled_date, scheduled_time, total_price, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    ['book-101', 'LH-2026-8801', 'cust-1', 'prov-3', 'srv-1', 'addr-1', 'completed', '2026-07-28', '10:00 AM', 399.0, 'Kitchen sink is leaking under the cabinet.']
  );

  console.log('Database successfully seeded!');
}

if (require.main === module) {
  seed();
}

module.exports = seed;
