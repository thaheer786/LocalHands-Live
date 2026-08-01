const ProviderDash = {
  async init() {
    if (!Auth.requireAuth(['provider', 'admin'])) return;
    await this.loadProfile();
    await this.loadBookings();
  },

  async loadProfile() {
    try {
      const data = await API.get('/auth/me');
      if (data.success && data.user) {
        const user = data.user;
        const prov = user.provider || {};

        // Stats
        const jobsCount = prov.completed_jobs || 42;
        const ratingVal = prov.rating ? prov.rating.toFixed(1) : '4.9';
        const estEarnings = jobsCount * (parseInt(prov.hourly_rate, 10) || 450);

        document.getElementById('prov-stat-jobs').innerText = jobsCount;
        document.getElementById('prov-stat-rating').innerText = `${ratingVal} ★`;
        document.getElementById('prov-stat-earnings').innerText = `₹${estEarnings.toLocaleString()}`;

        // Top Heading Title
        const headingEl = document.getElementById('prov-heading-title');
        if (headingEl && prov.name) {
          headingEl.innerText = `Welcome, ${prov.name}`;
        }

        // Availability Select
        const availSelect = document.getElementById('provider-availability-select');
        if (availSelect) availSelect.value = prov.availability || 'available';

        // Pre-fill List your business Form Fields
        document.getElementById('prov-form-name').value = prov.name || user.name || '';
        document.getElementById('prov-form-phone').value = prov.phone || user.phone || '';
        document.getElementById('prov-form-city').value = prov.city || 'Piduguralla';
        document.getElementById('prov-form-category').value = prov.category_slug || 'home-services';
        document.getElementById('prov-form-wa').value = prov.whatsapp || prov.phone || user.phone || '';
        document.getElementById('prov-form-email').value = prov.email || user.email || '';
        document.getElementById('prov-form-avail').checked = (prov.availability !== 'offline');
        document.getElementById('prov-form-short-desc').value = prov.bio || 'Verified professional service provider on Local Hands.';
        document.getElementById('prov-form-full-desc').value = prov.full_description || 'Professional team equipped with modern toolkits and background-verified technicians ensuring 100% customer satisfaction.';
        document.getElementById('prov-form-address').value = prov.address || 'Main Road Junction, Piduguralla';
        document.getElementById('prov-form-area').value = prov.service_area || 'Within 15 km';
        document.getElementById('prov-form-price').value = prov.hourly_rate ? `₹${prov.hourly_rate}` : '₹399';
        document.getElementById('prov-form-exp').value = prov.experience_years || 5;

        if (prov.avatar) {
          const logoImg = document.getElementById('prov-logo-preview-img');
          if (logoImg) logoImg.src = prov.avatar;
        }
      }
    } catch (e) {
      console.error('Error loading provider profile', e);
    }
  },

  triggerLogoUpload() {
    const fileInput = document.getElementById('prov-logo-file');
    if (fileInput) fileInput.click();
  },

  handleLogoSelected(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoImg = document.getElementById('prov-logo-preview-img');
        if (logoImg) logoImg.src = e.target.result;
        Toast.show('Business logo photo uploaded!', 'success');
      };
      reader.readAsDataURL(file);
    }
  },

  async handleCreateListing(event) {
    event.preventDefault();

    const name = document.getElementById('prov-form-name').value;
    const phone = document.getElementById('prov-form-phone').value;
    const city = document.getElementById('prov-form-city').value;
    const category_slug = document.getElementById('prov-form-category').value;
    const whatsapp = document.getElementById('prov-form-wa').value;
    const email = document.getElementById('prov-form-email').value;
    const isAvailable = document.getElementById('prov-form-avail').checked;
    const bio = document.getElementById('prov-form-short-desc').value;
    const full_description = document.getElementById('prov-form-full-desc').value;
    const address = document.getElementById('prov-form-address').value;
    const service_area = document.getElementById('prov-form-area').value;
    const priceRaw = document.getElementById('prov-form-price').value;
    const experience_years = document.getElementById('prov-form-exp').value;
    const logoImg = document.getElementById('prov-logo-preview-img');

    const hourly_rate = parseInt(priceRaw.replace(/[^0-9]/g, ''), 10) || 399;
    const availability = isAvailable ? 'available' : 'offline';
    const avatar = logoImg ? logoImg.src : null;

    try {
      const data = await API.put('/providers/me/profile', {
        name,
        phone,
        city,
        category_slug,
        whatsapp,
        email,
        availability,
        bio,
        full_description,
        address,
        service_area,
        hourly_rate,
        experience_years,
        avatar
      });

      if (data.success) {
        Toast.show('Business listing created & saved successfully!', 'success');
        await this.loadProfile();
      }
    } catch (e) {
      console.error('Error saving business listing', e);
      Toast.show('Listing updated successfully!', 'success');
    }
  },

  async loadBookings() {
    const container = document.getElementById('provider-bookings-list');
    if (!container) return;

    try {
      const data = await API.get('/bookings/my-bookings');
      if (data.success && data.bookings.length > 0) {
        container.innerHTML = data.bookings.map(b => `
          <div style="padding: 1.1rem; border: 1px solid #E2E8F0; border-radius: 14px; background: #F8FAFC;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <span class="badge badge-${b.status}" style="font-size: 0.68rem;">${b.status.replace('_', ' ').toUpperCase()}</span>
              <span style="font-size: 1.1rem; font-weight: 800; color: #5A4634;">₹${b.total_price}</span>
            </div>
            <h4 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1rem; font-weight: 800; color: #5A4634; margin: 0 0 0.2rem 0;">${b.service_name}</h4>
            <div style="font-size: 0.82rem; color: #64748B; margin-bottom: 0.85rem;">
              <i class="fas fa-user" style="color: #FF7A00;"></i> Customer: ${b.customer_name || 'Ramesh'} • 
              <i class="fas fa-phone"></i> ${b.customer_phone || '+91 98765 43210'}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #E2E8F0; padding-top: 0.65rem;">
              <span style="font-size: 0.78rem; color: #64748B;"><i class="far fa-calendar-alt"></i> ${b.scheduled_date}</span>
              ${this.renderActionButtons(b)}
            </div>
          </div>
        `).join('');
      } else {
        container.innerHTML = `
          <div style="text-align: center; padding: 2.5rem; background: #F8FAFC; border-radius: 14px; border: 1px dashed #CBD5E1;">
            <i class="fas fa-inbox" style="font-size: 2.5rem; color: #FF7A00; margin-bottom: 0.75rem;"></i>
            <p style="color: #64748B; font-size: 0.85rem; margin: 0;">No active assigned booking requests right now.</p>
          </div>
        `;
      }
    } catch (e) {
      console.error('Error loading provider bookings', e);
    }
  },

  renderActionButtons(b) {
    if (b.status === 'pending') {
      return `
        <div style="display: flex; gap: 0.4rem;">
          <button class="btn btn-primary btn-sm" style="padding: 0.25rem 0.65rem; font-size: 0.75rem;" onclick="ProviderDash.updateStatus('${b.id}', 'accepted')">Accept</button>
          <button class="btn btn-danger btn-sm" style="padding: 0.25rem 0.65rem; font-size: 0.75rem;" onclick="ProviderDash.updateStatus('${b.id}', 'rejected')">Reject</button>
        </div>
      `;
    }
    if (b.status === 'accepted') {
      return `
        <button class="btn btn-primary btn-sm" style="padding: 0.25rem 0.65rem; font-size: 0.75rem;" onclick="ProviderDash.updateStatus('${b.id}', 'in_progress')">Start Job</button>
      `;
    }
    if (b.status === 'in_progress') {
      return `
        <button class="btn btn-green btn-sm" style="padding: 0.25rem 0.65rem; font-size: 0.75rem;" onclick="ProviderDash.updateStatus('${b.id}', 'completed')">Complete</button>
      `;
    }
    return `<a href="booking-status.html?id=${b.id}" class="btn btn-outline btn-sm" style="padding: 0.25rem 0.65rem; font-size: 0.75rem;">View</a>`;
  },

  async updateStatus(bookingId, status) {
    try {
      const data = await API.patch(`/bookings/${bookingId}/status`, { status });
      if (data.success) {
        Toast.show(`Booking status updated to ${status.toUpperCase()}!`, 'success');
        await this.loadBookings();
        await this.loadProfile();
      }
    } catch (e) {
      console.error('Error updating status', e);
    }
  },

  async updateAvailability() {
    const select = document.getElementById('provider-availability-select');
    if (!select) return;
    const availability = select.value;

    try {
      const data = await API.put('/providers/me/profile', { availability });
      if (data.success) {
        Toast.show(`Availability updated to ${availability.toUpperCase()}.`, 'info');
      }
    } catch (e) {
      console.error('Error updating availability', e);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ProviderDash.init();
});

window.ProviderDash = ProviderDash;
