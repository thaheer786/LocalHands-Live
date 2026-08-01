const SERVICE_PRESETS = {
  'electricians': {
    category: 'Home Services',
    title: 'Electricians & Home Electrical Repairs',
    subtitle: 'Licensed local electricians for house wiring, switchboards, fan installation, lighting, and 24/7 short-circuit emergency fixes.',
    bgImg: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=1600',
    aboutImg: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    prosBadge: '95+ Verified Electricians',
    startingPrice: '₹399',
    aboutDesc: 'Local Hands connects you with background-verified, licensed electrical experts. Whether you need complete house rewiring, smart home fitting installation, MCB replacement, or urgent fuse box repairs, our pros ensure 100% safety standards and upfront fixed quotes.',
    providers: [
      { id: 'pro-elec-1', name: 'Suresh Electrical Solutions', profession: 'Master Electrician', experience: '9+ Years', rating: 4.9, jobs: 180, location: 'Piduguralla', price: '₹399', status: 'available', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300', phone: '+91 98765 88888' },
      { id: 'pro-elec-2', name: 'Raju Wiring & Lighting', profession: 'House Wiring Specialist', experience: '7+ Years', rating: 4.8, jobs: 142, location: 'Piduguralla', price: '₹450', status: 'available', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300', phone: '+91 98765 44411' },
      { id: 'pro-elec-3', name: 'Venkat Smart Home Controls', profession: 'Smart Automation Pro', experience: '6+ Years', rating: 4.95, jobs: 96, location: 'Visakhapatnam', price: '₹599', status: 'available', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300', phone: '+91 98765 55522' }
    ],
    reviews: [
      { name: 'Kiran Varma', location: 'Piduguralla', rating: 5, text: 'Suresh fixed a major short-circuit in our main switchboard within 25 minutes. Extremely professional and courteous!', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120', date: '2 days ago' },
      { name: 'Meena Kumari', location: 'Piduguralla', rating: 5, text: 'Replaced all ceiling fans and chandelier wiring. Very neat work with total price transparency.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120', date: '1 week ago' }
    ],
    faqs: [
      { q: 'How quickly can an electrician arrive at my house?', a: 'Most listed electrical experts respond immediately and can arrive at your location within 30 to 45 minutes for emergency fixes.' },
      { q: 'Are the electrician service charges fixed?', a: 'Yes! Providers on Local Hands present clear, upfront fixed quotes before commencing any repair work.' }
    ]
  },
  'plumbers': {
    category: 'Home Services',
    title: 'Plumbers & Pipe Leakage Repair',
    subtitle: 'Master plumbers for pipe leakages, bathroom fittings, tap replacement, water heater installation & drain unblocking.',
    bgImg: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=1600',
    aboutImg: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=600',
    prosBadge: '85+ Verified Plumbers',
    startingPrice: '₹349',
    aboutDesc: 'Get fast, hassle-free plumbing repairs from certified experts near you. From persistent pipe drips and clogged kitchen drains to overhead water tank fitting, our plumbers bring professional toolkits for instant solutions.',
    providers: [
      { id: 'pro-plumb-1', name: 'Revanth Plumbing Services', profession: 'Master Plumber', experience: '8+ Years', rating: 4.95, jobs: 215, location: 'Piduguralla', price: '₹349', status: 'available', avatar: 'assets/revanth.jpg', phone: '+91 98765 55555' },
      { id: 'pro-plumb-2', name: 'Anil Pipe & Sanitation', profession: 'Sanitation Specialist', experience: '6+ Years', rating: 4.85, jobs: 130, location: 'Piduguralla', price: '₹399', status: 'available', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300', phone: '+91 98765 22233' }
    ],
    reviews: [
      { name: 'Rajesh Kumar', location: 'Piduguralla', rating: 5, text: 'Revanth fixed our clogged underground drainage system smoothly. Highly recommended plumber!', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120', date: '3 days ago' }
    ],
    faqs: [
      { q: 'Do plumbers carry replacement spare parts?', a: 'Yes, our listed plumbers arrive equipped with standard pipe fittings, tap washers, sealants, and tools.' }
    ]
  },
  'rent-pg': {
    category: 'Property Sell & Rent',
    title: 'Houses, Flats & PG Hostels for Rent',
    subtitle: 'Find verified 1, 2, 3 BHK apartments, paying guest (PG) accommodations & commercial rentals with direct owner contact.',
    bgImg: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1600',
    aboutImg: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600',
    prosBadge: '150+ Verified Property Listings',
    startingPrice: '₹4,500/mo',
    aboutDesc: 'Discover budget-friendly and premium rental properties in top localities. Direct deals with property owners ensure zero middleman commissions and complete agreement transparency.',
    providers: [
      { id: 'pro-prop-1', name: 'Sri Lakshmi Estates', profession: 'Property Manager', experience: '10+ Years', rating: 4.9, jobs: 160, location: 'Piduguralla', price: '₹6,000/mo', status: 'available', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300', phone: '+91 98765 77711' },
      { id: 'pro-prop-2', name: 'Green View PG Hostels', profession: 'PG Hostels Provider', experience: '5+ Years', rating: 4.8, jobs: 95, location: 'Piduguralla', price: '₹4,500/mo', status: 'available', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300', phone: '+91 98765 77722' }
    ],
    reviews: [
      { name: 'Sneha Reddy', location: 'Piduguralla', rating: 5, text: 'Found a beautiful 2 BHK flat near main road within 1 day without paying any broker fees!', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120', date: 'Yesterday' }
    ],
    faqs: [
      { q: 'Is there any brokerage fee when renting a house?', a: 'No! Local Hands operates on a 100% direct deal model with zero broker commission.' }
    ]
  },
  'default': {
    category: 'Local Services',
    title: 'Verified Local Service Experts',
    subtitle: 'Connect directly with certified local professionals for instant home repair, personal services, and property listings.',
    bgImg: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1600',
    aboutImg: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600',
    prosBadge: '100+ Verified Pros',
    startingPrice: '₹299',
    aboutDesc: 'Local Hands connects homeowners and local clients with background-verified service professionals. Enjoy direct phone/WhatsApp contact, upfront fixed quotes, and guaranteed quality work.',
    providers: [
      { id: 'pro-def-1', name: 'Krishna Photo Studio', profession: 'Wedding & Event Photographer', experience: '10+ Years', rating: 4.9, jobs: 142, location: 'Piduguralla', price: '₹1,500', status: 'available', avatar: 'assets/bhuvan.jpg', phone: '+91 98765 33333' },
      { id: 'pro-def-2', name: 'Charan Appliance Repair', profession: 'AC & Refrigerator Expert', experience: '6+ Years', rating: 4.8, jobs: 98, location: 'Piduguralla', price: '₹500', status: 'available', avatar: 'assets/charan.jpg', phone: '+91 98765 44444' },
      { id: 'pro-def-3', name: 'Elena Home Care & Nursing', profession: 'Registered Healthcare Nurse', experience: '5+ Years', rating: 4.85, jobs: 110, location: 'Piduguralla', price: '₹600', status: 'available', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300', phone: '+91 98765 77777' }
    ],
    reviews: [
      { name: 'Vikram Sharma', location: 'Piduguralla', rating: 5, text: 'Fantastic customer service and reliable service providers. Will use Local Hands again!', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120', date: '4 days ago' }
    ],
    faqs: [
      { q: 'How does Local Hands verify service professionals?', a: 'Every provider undergoes government ID verification, background screening, and skill evaluation before being listed.' }
    ]
  }
};

const ServiceDetail = {
  currentPreset: null,
  activeProviders: [],

  init() {
    const params = new URLSearchParams(window.location.search);
    const rawKey = params.get('service') || params.get('category') || 'electricians';
    
    // Match preset key
    let key = rawKey.toLowerCase().replace(/[^a-z0-9]/g, '-');
    if (!SERVICE_PRESETS[key]) {
      // Find closest key or use default
      key = Object.keys(SERVICE_PRESETS).find(k => key.includes(k)) || 'default';
    }

    this.currentPreset = SERVICE_PRESETS[key];
    this.activeProviders = [...this.currentPreset.providers];
    this.renderPage();
  },

  renderPage() {
    const p = this.currentPreset;

    // 1. Hero Content
    const heroBg = document.getElementById('sd-hero-bg');
    if (heroBg && p.bgImg) {
      heroBg.style.backgroundImage = `url('${p.bgImg}')`;
    }

    document.getElementById('sd-bc-category').innerText = p.category;
    document.getElementById('sd-bc-service').innerText = p.title.split('&')[0].trim();
    document.getElementById('sd-title').innerText = p.title;
    document.getElementById('sd-subtitle').innerText = p.subtitle;
    document.getElementById('sd-pros-badge').innerText = p.prosBadge;

    // 2. About Section
    document.getElementById('sd-about-title-highlight').innerText = p.title.split('&')[0].trim();
    document.getElementById('sd-about-desc').innerText = p.aboutDesc;
    const aboutImg = document.getElementById('sd-about-img');
    if (aboutImg && p.aboutImg) {
      aboutImg.src = p.aboutImg;
    }

    // 3. Providers Grid
    this.renderProviders(this.activeProviders);

    // 4. Reviews Grid
    const reviewsGrid = document.getElementById('sd-reviews-grid');
    if (reviewsGrid && p.reviews) {
      reviewsGrid.innerHTML = p.reviews.map(r => `
        <div class="testimonial-card">
          <div style="color: #FF7A00; font-size: 1.1rem; margin-bottom: 0.8rem;">${'★'.repeat(r.rating)}</div>
          <p class="testimonial-quote">"${r.text}"</p>
          <div class="testimonial-author">
            <img src="${r.avatar}" class="testimonial-avatar" alt="${r.name}" />
            <div>
              <div class="testimonial-name">${r.name}</div>
              <div class="testimonial-location">${r.location} • Verified Customer (${r.date})</div>
            </div>
          </div>
        </div>
      `).join('');
    }

    // 5. FAQs Accordion
    const faqContainer = document.getElementById('sd-faq-container');
    if (faqContainer && p.faqs) {
      faqContainer.innerHTML = p.faqs.map((f, idx) => `
        <div class="faq-item ${idx === 0 ? 'active' : ''}">
          <button class="faq-question" onclick="this.parentElement.classList.toggle('active')">
            ${f.q}
            <i class="fas fa-chevron-down"></i>
          </button>
          <div class="faq-answer">
            ${f.a}
          </div>
        </div>
      `).join('');
    }

    // 6. Related Services Grid
    const relatedGrid = document.getElementById('sd-related-grid');
    if (relatedGrid) {
      relatedGrid.innerHTML = `
        <a href="service-detail.html?service=electricians" class="premium-cat-card">
          <div class="premium-cat-icon-wrap"><i class="fas fa-bolt"></i></div>
          <h3 class="premium-cat-title">Electricians</h3>
          <p class="premium-cat-desc">House wiring, switchboard repairs & short-circuit fixes.</p>
          <div class="premium-cat-footer">
            <span class="premium-cat-badge"><i class="fas fa-user-check"></i> 95+ Pros</span>
            <span class="premium-cat-arrow"><i class="fas fa-arrow-right"></i></span>
          </div>
        </a>

        <a href="service-detail.html?service=plumbers" class="premium-cat-card">
          <div class="premium-cat-icon-wrap"><i class="fas fa-faucet"></i></div>
          <h3 class="premium-cat-title">Plumbing Repairs</h3>
          <p class="premium-cat-desc">Leak fixes, tap replacement & bathroom sanitation.</p>
          <div class="premium-cat-footer">
            <span class="premium-cat-badge"><i class="fas fa-user-check"></i> 85+ Pros</span>
            <span class="premium-cat-arrow"><i class="fas fa-arrow-right"></i></span>
          </div>
        </a>

        <a href="service-detail.html?service=rent-pg" class="premium-cat-card">
          <div class="premium-cat-icon-wrap"><i class="fas fa-building"></i></div>
          <h3 class="premium-cat-title">Rent & PG Hostels</h3>
          <p class="premium-cat-desc">House rent, flats, commercial space & student hostels.</p>
          <div class="premium-cat-footer">
            <span class="premium-cat-badge"><i class="fas fa-user-check"></i> 150+ Pros</span>
            <span class="premium-cat-arrow"><i class="fas fa-arrow-right"></i></span>
          </div>
        </a>
      `;
    }
  },

  renderProviders(providers) {
    const grid = document.getElementById('sd-providers-grid-container');
    if (!grid) return;

    if (providers.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: #FFFFFF; border-radius: 20px; border: 1px solid #E2E8F0;">
          <i class="fas fa-search" style="font-size: 2.5rem; color: #FF7A00; margin-bottom: 1rem;"></i>
          <h3 style="color: #5A4634;">No matching providers found</h3>
          <p style="color: #64748B;">Try resetting your filters or search keywords.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = providers.map(p => `
      <div class="sd-provider-card">
        <div>
          <div class="sd-pro-header">
            <img src="${p.avatar}" alt="${p.name}" class="sd-pro-avatar" onerror="this.src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300';" />
            <div>
              <h3 class="sd-pro-name">
                ${p.name}
                <i class="fas fa-check-circle" style="color: #10B981; font-size: 0.9rem;" title="Verified Provider"></i>
              </h3>
              <div class="sd-pro-profession">${p.profession}</div>
              <div class="sd-pro-rating">
                <i class="fas fa-star"></i> ${p.rating.toFixed(1)} <span style="color: #64748B; font-weight: 500;">(${p.jobs} Jobs)</span>
              </div>
            </div>
          </div>

          <ul class="sd-pro-details-list">
            <li class="sd-pro-detail-item"><i class="fas fa-award"></i> ${p.experience}</li>
            <li class="sd-pro-detail-item"><i class="fas fa-map-marker-alt"></i> ${p.location}</li>
            <li class="sd-pro-detail-item"><i class="fas fa-tag"></i> From ${p.price}</li>
            <li class="sd-pro-detail-item" style="color: #10B981; font-weight: 700;"><i class="fas fa-circle" style="font-size: 0.5rem; color: #10B981;"></i> Available</li>
          </ul>
        </div>

        <div class="sd-pro-actions">
          <button class="btn btn-green btn-sm" style="flex: 1; border-radius: 9999px;" onclick="Landing.openContactModal('${p.name.replace(/'/g, "\\'")}', '${p.phone || '+91 98765 43210'}')">
            <i class="fas fa-phone-alt"></i> Call Now
          </button>
          <button class="btn-view-all-orange" style="flex: 1; margin-top: 0; padding: 0.6rem 1rem; font-size: 0.85rem;" onclick="Modal.open('requirementModal')">
            Book Now
          </button>
        </div>
      </div>
    `).join('');
  },

  filterProviders() {
    const query = document.getElementById('sd-pro-search').value.toLowerCase().trim();
    const minRating = parseFloat(document.getElementById('sd-filter-rating').value) || 0;
    const minExp = parseInt(document.getElementById('sd-filter-exp').value, 10) || 0;
    const availFilter = document.getElementById('sd-filter-avail').value;

    const filtered = this.currentPreset.providers.filter(p => {
      const matchQuery = p.name.toLowerCase().includes(query) || p.profession.toLowerCase().includes(query);
      const matchRating = p.rating >= minRating;
      const expNum = parseInt(p.experience, 10) || 0;
      const matchExp = expNum >= minExp;
      const matchAvail = availFilter === 'all' || p.status === availFilter;

      return matchQuery && matchRating && matchExp && matchAvail;
    });

    this.renderProviders(filtered);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ServiceDetail.init();
});

window.ServiceDetail = ServiceDetail;
