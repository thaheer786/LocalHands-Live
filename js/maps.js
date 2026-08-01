const MapsApp = {
  providers: [],

  async init() {
    await this.loadProviders();
  },

  async loadProviders() {
    const list = document.getElementById('map-provider-list');
    const canvas = document.getElementById('map-canvas');

    try {
      const data = await API.get('/providers?verified=true');
      if (data.success && data.providers) {
        this.providers = data.providers;
        this.renderProviders(this.providers);
        this.renderMapPins(this.providers);
      }
    } catch (e) {
      console.error('Error loading map providers', e);
    }
  },

  renderProviders(providerList) {
    const list = document.getElementById('map-provider-list');
    if (!list) return;

    if (providerList.length === 0) {
      list.innerHTML = `<p style="color: var(--text-muted);">No providers matched your filter.</p>`;
      return;
    }

    list.innerHTML = providerList.map((p, index) => `
      <div class="card card-hover" style="padding: 1rem;" onclick="MapsApp.highlightPin(${index})">
        <div style="display: flex; gap: 0.85rem; align-items: center;">
          <img src="${p.avatar}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;" alt="${p.name}" />
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h4 style="font-size: 0.95rem;">${p.name}</h4>
              <span class="badge badge-verified" style="font-size: 0.65rem;">Verified</span>
            </div>
            <span style="font-size: 0.8rem; color: var(--accent);"><i class="fas fa-star"></i> ${p.rating.toFixed(1)} • ${p.completed_jobs} Jobs</span>
          </div>
        </div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem; line-height: 1.4;">
          ${p.bio.substring(0, 75)}...
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem; padding-top: 0.5rem; border-top: 1px solid var(--border-color);">
          <span style="font-weight: 700; color: var(--primary); font-size: 0.9rem;">$${p.hourly_rate}/hr</span>
          <a href="Allservices.html" class="btn btn-primary btn-sm">View Services</a>
        </div>
      </div>
    `).join('');
  },

  renderMapPins(providerList) {
    const canvas = document.getElementById('map-canvas');
    if (!canvas) return;

    // Fixed mock coordinates for visual layout map
    const coords = [
      { top: '35%', left: '42%' },
      { top: '55%', left: '60%' },
      { top: '25%', left: '68%' },
      { top: '65%', left: '30%' },
      { top: '45%', left: '22%' }
    ];

    const existingPins = canvas.querySelectorAll('.map-pin');
    existingPins.forEach(pin => pin.remove());

    providerList.forEach((p, index) => {
      const pos = coords[index % coords.length];
      const pin = document.createElement('div');
      pin.className = 'map-pin';
      pin.id = `pin-${index}`;
      pin.style.top = pos.top;
      pin.style.left = pos.left;
      pin.innerHTML = `<i class="fas fa-user-check" style="font-size: 0.9rem;"></i>`;
      pin.title = `${p.name} (${p.rating.toFixed(1)} Stars)`;

      pin.addEventListener('click', () => {
        Toast.show(`${p.name} - $${p.hourly_rate}/hr (${p.rating.toFixed(1)} Stars)`, 'info');
      });

      canvas.appendChild(pin);
    });
  },

  highlightPin(index) {
    const pins = document.querySelectorAll('.map-pin');
    pins.forEach(pin => pin.style.transform = 'scale(1)');

    const targetPin = document.getElementById(`pin-${index}`);
    if (targetPin) {
      targetPin.style.transform = 'scale(1.4)';
      targetPin.style.borderColor = 'var(--accent)';
    }
  },

  filterProviders() {
    const input = document.getElementById('map-search-input');
    const query = input ? input.value.toLowerCase().trim() : '';
    const filtered = this.providers.filter(p => p.name.toLowerCase().includes(query) || p.bio.toLowerCase().includes(query));
    this.renderProviders(filtered);
    this.renderMapPins(filtered);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  MapsApp.init();
});

window.MapsApp = MapsApp;
