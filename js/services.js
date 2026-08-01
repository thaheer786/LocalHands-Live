const ALL_CATEGORIES_DATA = [
  {
    id: 'property',
    name: 'Property Sell & Rent',
    icon: 'fa-building',
    subtitle: 'Houses, flats, PG hostels, commercial spaces & land plots for buy, sell or rent.',
    services: [
      { id: 'prop-rent-pg', name: 'Rent & PG', icon: 'fa-home', desc: 'Paying guest accommodation for students and working professionals.', pros: '45+ Pros' },
      { id: 'prop-hostels', name: 'Hostels & Paying Guest', icon: 'fa-bed', desc: 'Verified hostels with home food, Wi-Fi & 24/7 security.', pros: '30+ Pros' },
      { id: 'prop-coliving', name: 'Co-Living Spaces', icon: 'fa-couch', desc: 'Fully furnished shared apartments with zero maintenance hassle.', pros: '25+ Pros' },
      { id: 'prop-events-venue', name: 'Event & Venue Rentals', icon: 'fa-landmark', desc: 'Banquet halls, lawns and party places for celebrations.', pros: '40+ Pros' },
      { id: 'prop-house-sale', name: 'House Sales', icon: 'fa-key', desc: 'Independent houses, luxury villas, and Gated community plots.', pros: '55+ Pros' },
      { id: 'prop-flats', name: 'Flats & Apartments', icon: 'fa-building-user', desc: '1, 2, 3 BHK apartments for rent or immediate sale.', pros: '80+ Pros' },
      { id: 'prop-commercial', name: 'Commercial Spaces', icon: 'fa-store', desc: 'Shops, office spaces, warehouses & main road showrooms.', pros: '35+ Pros' },
      { id: 'prop-agents', name: 'Property Agents', icon: 'fa-user-tie', desc: 'Verified real estate brokers & property legal consultants.', pros: '20+ Pros' }
    ]
  },
  {
    id: 'home-services',
    name: 'Home Services',
    icon: 'fa-tools',
    subtitle: 'Electricians, plumbers, AC repair, carpenters, painters & deep house cleaning.',
    services: [
      { id: 'hs-electricians', name: 'Electricians', icon: 'fa-bolt', desc: 'House wiring, switchboard repairs, fan installation & short circuit fixes.', pros: '95+ Pros' },
      { id: 'hs-plumbers', name: 'Plumbers', icon: 'fa-faucet', desc: 'Pipe leakages, tap replacement, bathroom fittings & drainage cleaning.', pros: '85+ Pros' },
      { id: 'hs-carpenters', name: 'Carpenters', icon: 'fa-hammer', desc: 'Furniture repair, custom woodwork, doors, windows & locks.', pros: '60+ Pros' },
      { id: 'hs-painters', name: 'Painters', icon: 'fa-paint-roller', desc: 'Interior & exterior wall painting, waterproofing & texture designs.', pros: '40+ Pros' },
      { id: 'hs-ac-repair', name: 'AC Repair & Gas Refill', icon: 'fa-snowflake', desc: 'Split & window AC servicing, filter wash & Freon gas filling.', pros: '75+ Pros' },
      { id: 'hs-appliance', name: 'Appliance Repair', icon: 'fa-tv', desc: 'Washing machine, refrigerator, microwave & LED TV repair.', pros: '50+ Pros' },
      { id: 'hs-pest-control', name: 'Pest Control', icon: 'fa-bug', desc: 'Termite treatment, cockroach, bedbug & mosquito control.', pros: '30+ Pros' },
      { id: 'hs-home-cleaning', name: 'Home Deep Cleaning', icon: 'fa-broom', desc: 'Sanitization cleaning for kitchen, bathroom, sofa & full home.', pros: '65+ Pros' },
      { id: 'hs-packers-movers', name: 'Packers & Movers', icon: 'fa-truck-ramp-box', desc: 'Local & domestic house shifting with secure bubble packing.', pros: '45+ Pros' },
      { id: 'hs-interior', name: 'Interior Designers', icon: 'fa-compass-drafting', desc: 'Modular kitchen, 3D home design & false ceiling work.', pros: '25+ Pros' },
      { id: 'hs-cctv', name: 'CCTV Installation', icon: 'fa-video', desc: 'Security camera setup, DVR configuration & mobile connectivity.', pros: '35+ Pros' },
      { id: 'hs-tank-cleaning', name: 'Water Tank Cleaning', icon: 'fa-water', desc: 'Underground & overhead tank high-pressure vacuum wash.', pros: '20+ Pros' }
    ]
  },
  {
    id: 'education',
    name: 'Education & Training',
    icon: 'fa-graduation-cap',
    subtitle: 'Home tutors, competitive coaching centers, music, dance & coding training.',
    services: [
      { id: 'edu-tutors', name: 'Home Tutors', icon: 'fa-chalkboard-user', desc: 'Personalized tuition for Class 1 to 12 Math, Science & English.', pros: '50+ Pros' },
      { id: 'edu-coaching', name: 'Coaching Centers', icon: 'fa-school', desc: 'JEE, NEET, EAMCET & competitive exam preparation.', pros: '30+ Pros' },
      { id: 'edu-music', name: 'Music Classes', icon: 'fa-music', desc: 'Guitar, keyboard, vocal singing & classical music lessons.', pros: '15+ Pros' },
      { id: 'edu-dance', name: 'Dance Classes', icon: 'fa-person-dancing', desc: 'Bollywood, Hip-Hop, Classical & Kuchipudi dance training.', pros: '20+ Pros' },
      { id: 'edu-sports', name: 'Sports Coaching', icon: 'fa-futbol', desc: 'Cricket, badminton, tennis & swimming coaching.', pros: '15+ Pros' },
      { id: 'edu-coding', name: 'Computer Training', icon: 'fa-laptop-code', desc: 'Python, Web Development, Java & Data Entry courses.', pros: '25+ Pros' },
      { id: 'edu-languages', name: 'Language Classes', icon: 'fa-language', desc: 'Spoken English, Hindi, French & German fluency classes.', pros: '18+ Pros' }
    ]
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    icon: 'fa-heartbeat',
    subtitle: 'Doctors, ambulance, doorstep medicine, gyms & personal physiotherapists.',
    services: [
      { id: 'hlth-doctors', name: 'Doctors & Clinics', icon: 'fa-user-doctor', desc: 'General physician, pediatrician & specialist consultations.', pros: '40+ Pros' },
      { id: 'hlth-ambulance', name: 'Ambulance Services', icon: 'fa-truck-medical', desc: '24/7 ICU & oxygen equipped emergency patient transport.', pros: '15+ Pros' },
      { id: 'hlth-pharmacy', name: 'Pharmacy & Medicine', icon: 'fa-pills', desc: 'Home delivery of prescription medicines & healthcare supplies.', pros: '25+ Pros' },
      { id: 'hlth-fitness', name: 'Gyms & Fitness Trainers', icon: 'fa-dumbbell', desc: 'Personal gym trainers, weight loss coaches & bodybuilders.', pros: '35+ Pros' },
      { id: 'hlth-beauty', name: 'Beauty Salons & Spa', icon: 'fa-scissors', desc: 'Hair styling, bridal makeup, facial & doorstep salon care.', pros: '50+ Pros' },
      { id: 'hlth-physio', name: 'Physiotherapists', icon: 'fa-child-reaching', desc: 'Post-surgery rehabilitation, joint pain & spinal therapy.', pros: '20+ Pros' }
    ]
  },
  {
    id: 'events',
    name: 'Events & Celebrations',
    icon: 'fa-camera',
    subtitle: 'Candid wedding photographers, videographers, food caterers, decorators & DJs.',
    services: [
      { id: 'evt-photo', name: 'Photographers', icon: 'fa-camera-retro', desc: 'Candid wedding, birthday, maternity & pre-wedding shoot.', pros: '75+ Pros' },
      { id: 'evt-video', name: 'Videographers', icon: 'fa-video-slash', desc: 'Cinematic wedding films, 4K video recording & drone shots.', pros: '45+ Pros' },
      { id: 'evt-catering', name: 'Food Catering', icon: 'fa-utensils', desc: 'Veg & non-veg buffet catering for weddings & gatherings.', pros: '60+ Pros' },
      { id: 'evt-decor', name: 'Event Decorators', icon: 'fa-wand-magic-sparkles', desc: 'Stage balloon decoration, flower entrance & theme lighting.', pros: '40+ Pros' },
      { id: 'evt-dj', name: 'DJ & Sound Systems', icon: 'fa-compact-disc', desc: 'High-power DJ sound setup, LED lights & sangeet music.', pros: '30+ Pros' },
      { id: 'evt-management', name: 'Event Management', icon: 'fa-clipboard-list', desc: 'End-to-end birthday, corporate & wedding coordination.', pros: '20+ Pros' }
    ]
  },
  {
    id: 'automobile',
    name: 'Automobile Services',
    icon: 'fa-car',
    subtitle: 'Two-wheeler mechanics, car repair, detailing, battery check & 24/7 towing.',
    services: [
      { id: 'auto-bike', name: 'Two-Wheeler Mechanic', icon: 'fa-motorcycle', desc: 'Bike general servicing, oil change, brake & engine overhaul.', pros: '55+ Pros' },
      { id: 'auto-car', name: 'Car Mechanic', icon: 'fa-car-side', desc: 'Car engine diagnostics, clutch work, AC & suspension repair.', pros: '45+ Pros' },
      { id: 'auto-wash', name: 'Car Wash & Detailing', icon: 'fa-soap', desc: 'Foam wash, interior vacuuming, ceramic coating & polishing.', pros: '35+ Pros' },
      { id: 'auto-tyre', name: 'Tyre & Battery Service', icon: 'fa-circle-dot', desc: 'Puncture repair, wheel balancing & new battery jumpstart.', pros: '30+ Pros' },
      { id: 'auto-towing', name: 'Emergency Towing', icon: 'fa-truck-pickup', desc: '24/7 roadside flatbed towing & breakdown assistance.', pros: '20+ Pros' }
    ]
  },
  {
    id: 'professional',
    name: 'Professional Services',
    icon: 'fa-briefcase',
    subtitle: 'CA tax advisors, legal lawyers, architects & digital marketing experts.',
    services: [
      { id: 'prof-ca', name: 'CA / Tax Consultants', icon: 'fa-calculator', desc: 'GST filing, Income Tax Returns, audit & business registration.', pros: '35+ Pros' },
      { id: 'prof-lawyers', name: 'Lawyers & Legal Advisors', icon: 'fa-scale-balanced', desc: 'Property documentation, agreements, civil & corporate law.', pros: '25+ Pros' },
      { id: 'prof-architects', name: 'Architects & Blueprints', icon: 'fa-building-shield', desc: 'Structural elevation plans, municipal approval & 3D layout.', pros: '20+ Pros' },
      { id: 'prof-realty', name: 'Real Estate Agents', icon: 'fa-handshake', desc: 'Verified property valuation, buying, selling & land deals.', pros: '40+ Pros' }
    ]
  },
  {
    id: 'daily-help',
    name: 'Daily Help & Labor',
    icon: 'fa-user-friends',
    subtitle: 'Home cooks, personal drivers, construction labor, babysitters & maids.',
    services: [
      { id: 'dh-cooks', name: 'Home Cooks', icon: 'fa-kitchen-set', desc: 'Hygienic home-cooked meals for breakfast, lunch & dinner.', pros: '60+ Pros' },
      { id: 'dh-drivers', name: 'Personal Drivers', icon: 'fa-id-card', desc: 'On-demand acting drivers for outstation & city trips.', pros: '45+ Pros' },
      { id: 'dh-labor', name: 'Daily Wage Workers', icon: 'fa-person-digging', desc: 'Construction helpers, loading labor & garden cleaners.', pros: '80+ Pros' },
      { id: 'dh-babysitter', name: 'Babysitters & Nannies', icon: 'fa-baby', desc: 'Caring child supervision, infant nursing & play support.', pros: '25+ Pros' },
      { id: 'dh-security', name: 'Security Guards', icon: 'fa-shield-halved', desc: 'Commercial & residential apartment gate security guards.', pros: '35+ Pros' },
      { id: 'dh-maids', name: 'Housemaids', icon: 'fa-bucket', desc: 'Brooming, mopping, utensil washing & daily housekeeping.', pros: '90+ Pros' }
    ]
  },
  {
    id: 'food',
    name: 'Food & Dining',
    icon: 'fa-utensils',
    subtitle: 'Local restaurants, daily tiffin service, cloud kitchens & event chefs.',
    services: [
      { id: 'fd-rest', name: 'Local Restaurants', icon: 'fa-burger', desc: 'Dine-in & delivery from top rated local eateries & biryani hubs.', pros: '50+ Pros' },
      { id: 'fd-tiffin', name: 'Tiffin Services', icon: 'fa-box-archive', desc: 'Monthly home-style meal subscription boxes.', pros: '35+ Pros' },
      { id: 'fd-cloud', name: 'Cloud Kitchens', icon: 'fa-fire-burner', desc: 'Quick delivery dark kitchens for rolls, burgers & bowls.', pros: '25+ Pros' },
      { id: 'fd-bakery', name: 'Bakeries', icon: 'fa-cake-candles', desc: 'Custom birthday cakes, fresh pastries, cookies & bread.', pros: '30+ Pros' },
      { id: 'fd-chefs', name: 'Private Event Chefs', icon: 'fa-hat-cowboy-side', desc: 'Chef at home for private dinner parties & family functions.', pros: '15+ Pros' }
    ]
  }
];

const ServicesApp = {
  activeCategory: 'all',
  searchQuery: '',

  init() {
    this.readURLParams();
    this.bindSearchInput();
    this.renderTabs();
    this.renderCategorySections();
  },

  readURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('category')) {
      this.activeCategory = urlParams.get('category');
    }
    if (urlParams.has('search')) {
      this.searchQuery = urlParams.get('search');
      const input = document.getElementById('cat-search-input');
      if (input) input.value = this.searchQuery;
    }
  },

  bindSearchInput() {
    const input = document.getElementById('cat-search-input');
    if (input) {
      input.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.renderCategorySections();
      });
    }
  },

  renderTabs() {
    const container = document.getElementById('cat-quick-tabs-container');
    if (!container) return;

    const tabs = [
      { id: 'all', name: 'All Categories', icon: 'fa-th-large' },
      ...ALL_CATEGORIES_DATA.map(c => ({ id: c.id, name: c.name.split(' ')[0], icon: c.icon }))
    ];

    container.innerHTML = tabs.map(t => `
      <button class="cat-tab-btn ${this.activeCategory === t.id ? 'active' : ''}" onclick="ServicesApp.filterCategory('${t.id}')">
        <i class="fas ${t.icon}"></i> ${t.name}
      </button>
    `).join('');
  },

  filterCategory(catId) {
    this.activeCategory = catId;
    this.renderTabs();

    if (catId === 'all') {
      this.renderCategorySections();
      window.scrollTo({ top: 350, behavior: 'smooth' });
    } else {
      this.renderCategorySections();
      const el = document.getElementById(`cat-section-${catId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  },

  renderCategorySections() {
    const mainContainer = document.getElementById('cat-sections-wrapper');
    if (!mainContainer) return;

    let targetCategories = ALL_CATEGORIES_DATA;
    if (this.activeCategory !== 'all') {
      targetCategories = ALL_CATEGORIES_DATA.filter(c => c.id === this.activeCategory);
    }

    const sectionsHtml = targetCategories.map(cat => {
      // Filter sub-services if query present
      let filteredServices = cat.services;
      if (this.searchQuery) {
        filteredServices = cat.services.filter(s => 
          s.name.toLowerCase().includes(this.searchQuery) || 
          s.desc.toLowerCase().includes(this.searchQuery)
        );
      }

      if (filteredServices.length === 0) return '';

      const cardsHtml = filteredServices.map(s => `
        <div class="cat-service-card-v2" onclick="ServicesApp.handleServiceClick('${s.name.replace(/'/g, "\\'")}')">
          <div>
            <div class="cat-service-top">
              <div class="cat-service-icon-wrap">
                <i class="fas ${s.icon}"></i>
              </div>
              <span class="live-now-badge">
                <span class="live-now-dot"></span> Live Now
              </span>
            </div>
            <h3 class="cat-service-title">${s.name}</h3>
            <p class="cat-service-desc">${s.desc}</p>
          </div>

          <div class="cat-service-footer">
            <span class="cat-service-pros"><i class="fas fa-user-check"></i> ${s.pros}</span>
            <div class="cat-service-btn"><i class="fas fa-arrow-right"></i></div>
          </div>
        </div>
      `).join('');

      return `
        <section class="cat-block-section" id="cat-section-${cat.id}">
          <div class="container">
            <div class="cat-block-header">
              <div class="cat-block-header-left">
                <div class="cat-block-icon-box">
                  <i class="fas ${cat.icon}"></i>
                </div>
                <div>
                  <h2 class="cat-block-title">${cat.name}</h2>
                  <p class="cat-block-subtitle">${cat.subtitle}</p>
                </div>
              </div>
              <span class="cat-block-count-badge"><i class="fas fa-layer-group"></i> ${filteredServices.length} Services</span>
            </div>

            <div class="cat-cards-grid">
              ${cardsHtml}
            </div>
          </div>
        </section>
      `;
    }).join('');

    if (!sectionsHtml.trim()) {
      mainContainer.innerHTML = `
        <div class="container" style="padding: 5rem 0; text-align: center;">
          <i class="fas fa-search" style="font-size: 3rem; color: #FF7A00; margin-bottom: 1rem;"></i>
          <h3 style="color: #5A4634; font-size: 1.4rem;">No matching services found</h3>
          <p style="color: #64748B;">Try searching for a different keyword like "Plumber", "Tutor", "Rent", or "Mechanic".</p>
        </div>
      `;
    } else {
      mainContainer.innerHTML = sectionsHtml;
    }
  },

  handleServiceClick(serviceName) {
    const slug = serviceName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    window.location.href = `service-detail.html?service=${encodeURIComponent(slug)}`;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ServicesApp.init();
});

window.ServicesApp = ServicesApp;
