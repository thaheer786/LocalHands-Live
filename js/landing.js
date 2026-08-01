const Landing = {
  currentCity: 'piduguralla',

  async init() {
    this.bindSearch();
    await this.loadProviders(this.currentCity);
  },

  bindSearch() {
    const input = document.getElementById('hero-search-input');
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleSearch();
        }
      });
    }
  },

  handleSearch() {
    const input = document.getElementById('hero-search-input');
    const select = document.getElementById('hero-location-select');
    const query = input ? input.value.trim() : '';
    const city = select ? select.value : this.currentCity;
    window.location.href = `Allservices.html?search=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}`;
  },

  handleCityChange(city) {
    this.currentCity = city;
    const locationSelect = document.getElementById('hero-location-select');
    if (locationSelect) {
      locationSelect.value = city;
    }
    this.loadProviders(city);
    Toast.show(`City updated to ${city.charAt(0).toUpperCase() + city.slice(1)}`, 'info');
  },

  async loadProviders(city = 'all') {
    const container = document.getElementById('landing-providers');
    if (!container) return;

    try {
      const endpoint = city && city !== 'all' ? `/providers?city=${city}` : '/providers';
      const data = await API.get(endpoint);
      if (data.success && data.providers && data.providers.length > 0) {
        container.innerHTML = data.providers.map(p => `
          <div class="provider-card-v2">
            <a href="maps.html?provider_id=${p.id}" class="provider-card-v2-img">
              <img src="${p.avatar || 'assets/bhuvan.jpg'}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400';" />
              <button class="btn btn-secondary btn-sm" style="position: absolute; top: 8px; right: 8px; border-radius: 50%; width: 32px; height: 32px; padding: 0; min-width: unset;" title="Save to Favourites" onclick="event.preventDefault(); Toast.show('${p.name} saved to favourites!', 'success')">
                <i class="far fa-heart" style="color: #ef4444;"></i>
              </button>
            </a>
            <div class="provider-card-v2-body">
              <h3 class="provider-card-v2-title">
                <span class="truncate">${p.name}</span>
                <span class="provider-verified-badge"><i class="fas fa-check-circle"></i> Verified</span>
              </h3>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;" class="truncate">${p.category_slug ? p.category_slug.toUpperCase() : 'SERVICE PROVIDER'}</p>
              
              <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.5rem; font-size: 0.82rem;">
                <div>
                  <i class="fas fa-star" style="color: #f59e0b;"></i>
                  <strong style="color: var(--foreground);">${p.rating ? p.rating.toFixed(1) : '4.9'}</strong>
                  <span style="color: var(--text-muted);">(${p.completed_jobs || 42})</span>
                </div>
                <span style="font-weight: 600; color: #10b981;">Available</span>
              </div>

              <p style="font-size: 0.82rem; color: var(--foreground); font-weight: 500; margin-top: 0.4rem;">
                <i class="fas fa-map-marker-alt" style="color: var(--primary); font-size: 0.75rem;"></i> ${p.city || 'Piduguralla'}
              </p>

              <div class="provider-contact-btns">
                <button class="btn btn-green btn-sm" onclick="Landing.openContactModal('${p.name.replace(/'/g, "\\'")}', '${p.phone || '+91 98765 43210'}')">
                  <i class="fas fa-phone-alt"></i> Call Now
                </button>
                <a href="Allservices.html?provider=${p.id}" class="btn btn-outline btn-sm">
                  Book Pro
                </a>
              </div>
            </div>
          </div>
        `).join('');
      } else {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--bg-light-blue); border-radius: 1rem;">
            <p style="font-size: 1.1rem; color: var(--text-muted);">No verified providers currently listed in <strong>${city}</strong>.</p>
            <button class="btn btn-primary btn-sm" style="margin-top: 1rem;" onclick="Landing.loadProviders('all')">Show All Cities</button>
          </div>
        `;
      }
    } catch (e) {
      console.error('Failed to load providers', e);
    }
  },

  openContactModal(name, phone) {
    const nameEl = document.getElementById('contact-provider-name');
    const phoneEl = document.getElementById('contact-phone-num');
    const callBtn = document.getElementById('contact-call-btn');
    const waBtn = document.getElementById('contact-wa-btn');

    if (nameEl) nameEl.textContent = name;
    if (phoneEl) phoneEl.textContent = phone;
    
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    if (callBtn) callBtn.href = `tel:${cleanPhone}`;
    if (waBtn) waBtn.href = `https://wa.me/${cleanPhone.replace('+', '')}`;

    Modal.open('contactModal');
  },

  async submitRequirement(e) {
    e.preventDefault();
    const name = document.getElementById('req-name')?.value;
    const phone = document.getElementById('req-phone')?.value;
    const category = document.getElementById('req-category')?.value;
    const city = document.getElementById('req-city')?.value;
    const details = document.getElementById('req-details')?.value;

    try {
      const res = await API.post('/requirements', { name, phone, category, city, details });
      if (res.success) {
        Modal.close('requirementModal');
        Toast.show('Requirement submitted! Local providers will reach out shortly.', 'success');
        e.target.reset();
      } else {
        Toast.show(res.error || 'Failed to submit requirement', 'error');
      }
    } catch (err) {
      Toast.show('Submission failed. Please check your connection.', 'error');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Landing.init();
});

window.Landing = Landing;
