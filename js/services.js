const ServicesApp = {
  activeCategory: 'all',
  searchQuery: '',
  sortBy: 'name',

  async init() {
    this.readURLParams();
    this.bindSearchInput();
    await this.loadCategoryTabs();
    await this.loadServices();
  },

  readURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('category')) {
      this.activeCategory = urlParams.get('category');
    }
    if (urlParams.has('search')) {
      this.searchQuery = urlParams.get('search');
      const input = document.getElementById('service-search-input');
      if (input) input.value = this.searchQuery;
    }
  },

  bindSearchInput() {
    const input = document.getElementById('service-search-input');
    if (input) {
      input.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim();
        this.loadServices();
      });
    }
  },

  handleSortChange() {
    const select = document.getElementById('service-sort-select');
    if (select) {
      this.sortBy = select.value;
      this.loadServices();
    }
  },

  async loadCategoryTabs() {
    const container = document.getElementById('category-filter-tabs');
    if (!container) return;

    try {
      const data = await API.get('/categories');
      if (data.success && data.categories) {
        const tabsHtml = [
          `<button class="btn ${this.activeCategory === 'all' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="ServicesApp.setCategory('all')">All Services</button>`,
          ...data.categories.map(c => `
            <button class="btn ${this.activeCategory === c.slug ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="ServicesApp.setCategory('${c.slug}')">
              <i class="fas ${c.icon}"></i> ${c.name}
            </button>
          `)
        ].join('');
        container.innerHTML = tabsHtml;
      }
    } catch (e) {
      console.error('Error loading category tabs', e);
    }
  },

  async setCategory(slug) {
    this.activeCategory = slug;
    await this.loadCategoryTabs();
    await this.loadServices();
  },

  async loadServices() {
    const grid = document.getElementById('services-catalog-grid');
    if (!grid) return;

    grid.innerHTML = `
      <div class="skeleton" style="height: 320px;"></div>
      <div class="skeleton" style="height: 320px;"></div>
      <div class="skeleton" style="height: 320px;"></div>
    `;

    try {
      let endpoint = `/services?category=${encodeURIComponent(this.activeCategory)}&sort=${this.sortBy}`;
      if (this.searchQuery) {
        endpoint += `&search=${encodeURIComponent(this.searchQuery)}`;
      }

      const data = await API.get(endpoint);

      if (data.success && data.services.length > 0) {
        grid.innerHTML = data.services.map(s => `
          <div class="service-card">
            <img src="${s.image}" alt="${s.name}" class="service-card-img" />
            <div class="service-card-body">
              <span class="badge badge-verified" style="align-self: flex-start; margin-bottom: 0.5rem;">${s.category_name}</span>
              <h3 class="service-card-title">${s.name}</h3>
              <p class="service-card-desc">${s.description || 'Professional execution with satisfaction guaranteed.'}</p>
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
                <i class="far fa-clock"></i> Approx. ${s.duration_mins || 60} mins
              </div>
              <div class="service-card-footer">
                <span class="service-price">$${s.price.toFixed(2)}</span>
                <button class="btn btn-primary btn-sm" onclick="ServicesApp.openProviderSelect('${s.id}', '${s.name.replace(/'/g, "\\'")}')">Book Now</button>
              </div>
            </div>
          </div>
        `).join('');
      } else {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
            <i class="fas fa-search" style="font-size: 3rem; color: var(--text-subtle); margin-bottom: 1rem;"></i>
            <h3>No services found</h3>
            <p style="color: var(--text-muted);">Try adjusting your search query or selecting a different category tab.</p>
          </div>
        `;
      }
    } catch (e) {
      console.error('Error loading services catalog', e);
    }
  },

  async openProviderSelect(serviceId, serviceName) {
    document.getElementById('modal-service-title').innerText = `Book ${serviceName}`;
    const list = document.getElementById('modal-provider-list');
    list.innerHTML = `<div class="skeleton" style="height: 100px;"></div>`;

    Modal.open('providerSelectModal');

    try {
      const data = await API.get(`/services/${serviceId}`);
      if (data.success && data.providers) {
        let html = `
          <div style="padding: 1rem; border: 1px solid var(--primary); border-radius: var(--radius-md); background: var(--primary-light); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong>⚡ Auto-Match Next Available Pro</strong>
              <div style="font-size: 0.85rem; color: var(--text-muted);">We will automatically dispatch the highest-rated available provider.</div>
            </div>
            <a href="booking.html?service_id=${serviceId}" class="btn btn-primary btn-sm">Auto Match</a>
          </div>
        `;

        if (data.providers.length > 0) {
          html += data.providers.map(p => `
            <div style="padding: 1rem; border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-surface-elevated); display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <img src="${p.provider_avatar}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover;" alt="${p.provider_name}" />
                <div>
                  <h4 style="font-size: 0.95rem;">${p.provider_name}</h4>
                  <span style="font-size: 0.85rem; color: var(--accent);"><i class="fas fa-star"></i> ${p.rating.toFixed(1)}</span>
                </div>
              </div>
              <a href="booking.html?service_id=${serviceId}&provider_id=${p.id}" class="btn btn-outline btn-sm">Select Pro</a>
            </div>
          `).join('');
        }

        list.innerHTML = html;
      }
    } catch (e) {
      console.error('Error opening provider selector', e);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ServicesApp.init();
});

window.ServicesApp = ServicesApp;
