const Landing = {
  async init() {
    this.bindSearch();
    await Promise.all([
      this.loadCategories(),
      this.loadServices(),
      this.loadProviders()
    ]);
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
    const query = input ? input.value.trim() : '';
    window.location.href = `Allservices.html?search=${encodeURIComponent(query)}`;
  },

  async loadCategories() {
    const container = document.getElementById('landing-categories');
    if (!container) return;

    try {
      const data = await API.get('/categories');
      if (data.success && data.categories) {
        container.innerHTML = data.categories.map(c => `
          <a href="Allservices.html?category=${c.slug}" class="category-card">
            <div class="category-icon">
              <i class="fas ${c.icon}"></i>
            </div>
            <div class="category-name">${c.name}</div>
            <div class="category-count">${c.service_count || 0} Services</div>
          </a>
        `).join('');
      }
    } catch (e) {
      console.error('Failed to load categories', e);
    }
  },

  async loadServices() {
    const container = document.getElementById('landing-services');
    if (!container) return;

    try {
      const data = await API.get('/services');
      if (data.success && data.services) {
        const topServices = data.services.slice(0, 6);
        container.innerHTML = topServices.map(s => `
          <div class="service-card">
            <img src="${s.image}" alt="${s.name}" class="service-card-img" />
            <div class="service-card-body">
              <span class="badge badge-verified" style="align-self: flex-start; margin-bottom: 0.5rem; font-size: 0.7rem;">${s.category_name}</span>
              <h3 class="service-card-title">${s.name}</h3>
              <p class="service-card-desc">${s.description || 'Professional service by certified experts.'}</p>
              <div class="service-card-footer">
                <span class="service-price">$${s.price.toFixed(2)}</span>
                <a href="booking.html?service_id=${s.id}" class="btn btn-primary btn-sm">Book Now</a>
              </div>
            </div>
          </div>
        `).join('');
      }
    } catch (e) {
      console.error('Failed to load services', e);
    }
  },

  async loadProviders() {
    const container = document.getElementById('landing-providers');
    if (!container) return;

    try {
      const data = await API.get('/providers?verified=true');
      if (data.success && data.providers) {
        const topProviders = data.providers.slice(0, 4);
        container.innerHTML = topProviders.map(p => `
          <div class="provider-card">
            <div class="provider-header">
              <img src="${p.avatar}" alt="${p.name}" class="provider-avatar" />
              <div>
                <h3 class="provider-name">${p.name}</h3>
                <span class="badge badge-verified"><i class="fas fa-check-circle"></i> Verified Pro</span>
              </div>
            </div>
            <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;">${p.bio}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.75rem; border-top: 1px solid var(--border-color);">
              <span class="provider-rating"><i class="fas fa-star"></i> ${p.rating.toFixed(1)} (${p.completed_jobs} jobs)</span>
              <span style="font-weight: 700; color: var(--primary);">$${p.hourly_rate}/hr</span>
            </div>
          </div>
        `).join('');
      }
    } catch (e) {
      console.error('Failed to load providers', e);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Landing.init();
});

window.Landing = Landing;
