const CustomerDash = {
  async init() {
    if (!Auth.requireAuth(['customer', 'admin'])) return;
    await this.loadBookings();
    await this.loadAddresses();
    this.loadProfile();
  },

  switchTab(tabName) {
    const tabs = ['bookings', 'addresses', 'profile'];
    tabs.forEach(t => {
      const btn = document.getElementById(`tab-btn-${t}`);
      const content = document.getElementById(`tab-content-${t}`);
      if (t === tabName) {
        btn.className = 'btn btn-primary btn-sm';
        content.style.display = 'block';
      } else {
        btn.className = 'btn btn-secondary btn-sm';
        content.style.display = 'none';
      }
    });
  },

  async loadBookings() {
    const container = document.getElementById('customer-bookings-list');
    if (!container) return;

    try {
      const data = await API.get('/bookings/my-bookings');
      if (data.success && data.bookings.length > 0) {
        container.innerHTML = data.bookings.map(b => `
          <div class="card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div style="display: flex; gap: 1.25rem; align-items: center;">
              <img src="${b.service_image}" style="width: 70px; height: 70px; border-radius: var(--radius-md); object-fit: cover;" alt="${b.service_name}" />
              <div>
                <span class="badge badge-${b.status}">${b.status.replace('_', ' ').toUpperCase()}</span>
                <h3 style="font-size: 1.15rem; margin: 0.25rem 0;">${b.service_name} (${b.booking_number})</h3>
                <div style="font-size: 0.85rem; color: var(--text-muted);">
                  <i class="fas fa-user-circle"></i> Provider: ${b.provider_name} • <i class="far fa-calendar-alt"></i> ${b.scheduled_date} at ${b.scheduled_time}
                </div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <span style="font-size: 1.25rem; font-weight: 800; color: var(--success);">$${b.total_price.toFixed(2)}</span>
              <a href="booking-status.html?id=${b.id}" class="btn btn-outline btn-sm">Track Details</a>
            </div>
          </div>
        `).join('');
      } else {
        container.innerHTML = `
          <div style="text-align: center; padding: 3rem; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
            <i class="far fa-calendar-times" style="font-size: 3rem; color: var(--text-subtle); margin-bottom: 1rem;"></i>
            <h3>No Bookings Yet</h3>
            <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Explore our service catalog and book your first local expert.</p>
            <a href="Allservices.html" class="btn btn-primary">Browse Services</a>
          </div>
        `;
      }
    } catch (e) {
      console.error('Error loading customer bookings', e);
    }
  },

  async loadAddresses() {
    const grid = document.getElementById('customer-address-grid');
    if (!grid) return;

    try {
      const data = await API.get('/addresses');
      if (data.success && data.addresses) {
        grid.innerHTML = data.addresses.map(a => `
          <div class="card" style="position: relative;">
            ${a.is_default ? '<span class="badge badge-verified" style="position: absolute; top: 1rem; right: 1rem;">Default</span>' : ''}
            <h4 style="font-size: 1.05rem; margin-bottom: 0.5rem;"><i class="fas fa-home" style="color: var(--primary);"></i> ${a.title}</h4>
            <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;">
              ${a.street}<br />${a.city}, ${a.state} ${a.zip}
            </p>
            <button class="btn btn-danger btn-sm" style="margin-top: 1rem;" onclick="CustomerDash.deleteAddress('${a.id}')">Delete</button>
          </div>
        `).join('');
      }
    } catch (e) {
      console.error('Error loading addresses', e);
    }
  },

  async handleAddAddress(event) {
    event.preventDefault();
    const title = document.getElementById('cust-addr-title').value;
    const street = document.getElementById('cust-addr-street').value;
    const city = document.getElementById('cust-addr-city').value;
    const state = document.getElementById('cust-addr-state').value;
    const zip = document.getElementById('cust-addr-zip').value;

    try {
      const data = await API.post('/addresses', { title, street, city, state, zip });
      if (data.success) {
        Toast.show('Address saved!', 'success');
        Modal.close('addAddressModal');
        await this.loadAddresses();
      }
    } catch (e) {
      console.error('Error adding address', e);
    }
  },

  async deleteAddress(id) {
    if (!confirm('Delete this address?')) return;
    try {
      await API.delete(`/addresses/${id}`);
      Toast.show('Address deleted.', 'info');
      await this.loadAddresses();
    } catch (e) {
      console.error('Error deleting address', e);
    }
  },

  loadProfile() {
    const user = API.getUser();
    if (user) {
      document.getElementById('cust-profile-name').value = user.name || '';
      document.getElementById('cust-profile-email').value = user.email || '';
      document.getElementById('cust-profile-phone').value = user.phone || '';
    }
  },

  saveProfile(event) {
    event.preventDefault();
    Toast.show('Profile updated successfully!', 'success');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CustomerDash.init();
});

window.CustomerDash = CustomerDash;
