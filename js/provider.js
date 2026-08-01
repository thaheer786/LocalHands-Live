const ProviderDash = {
  async init() {
    if (!Auth.requireAuth(['provider', 'admin'])) return;
    await this.loadBookings();
    await this.loadProfile();
  },

  async loadProfile() {
    try {
      const data = await API.get('/auth/me');
      if (data.success && data.user && data.user.provider) {
        const prov = data.user.provider;
        document.getElementById('prov-stat-jobs').innerText = prov.completed_jobs || 0;
        document.getElementById('prov-stat-rating').innerText = `${prov.rating ? prov.rating.toFixed(1) : '5.0'} ⭐`;
        
        const estEarnings = (prov.completed_jobs || 0) * prov.hourly_rate;
        document.getElementById('prov-stat-earnings').innerText = `$${estEarnings.toFixed(2)}`;

        const availSelect = document.getElementById('provider-availability-select');
        if (availSelect) availSelect.value = prov.availability || 'available';
      }
    } catch (e) {
      console.error('Error loading provider profile', e);
    }
  },

  async loadBookings() {
    const container = document.getElementById('provider-bookings-list');
    if (!container) return;

    try {
      const data = await API.get('/bookings/my-bookings');
      if (data.success && data.bookings.length > 0) {
        container.innerHTML = data.bookings.map(b => `
          <div style="padding: 1.25rem; border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-surface-elevated); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.35rem;">
                <span class="badge badge-${b.status}">${b.status.replace('_', ' ').toUpperCase()}</span>
                <strong style="font-size: 1.05rem;">${b.service_name} (${b.booking_number})</strong>
              </div>
              <div style="font-size: 0.85rem; color: var(--text-muted);">
                <i class="fas fa-user"></i> Customer: ${b.customer_name} (${b.customer_phone || 'N/A'}) • 
                <i class="fas fa-map-marker-alt"></i> ${b.address_street || 'Location'}, ${b.address_city || ''}
              </div>
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">
                <i class="far fa-calendar-alt"></i> Scheduled: ${b.scheduled_date} at ${b.scheduled_time}
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span style="font-weight: 800; font-size: 1.2rem; color: var(--success); margin-right: 0.5rem;">$${b.total_price.toFixed(2)}</span>
              ${this.renderActionButtons(b)}
            </div>
          </div>
        `).join('');
      } else {
        container.innerHTML = `
          <div style="text-align: center; padding: 3rem;">
            <i class="fas fa-inbox" style="font-size: 2.5rem; color: var(--text-subtle); margin-bottom: 1rem;"></i>
            <p style="color: var(--text-muted);">No assigned bookings at the moment.</p>
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
        <button class="btn btn-primary btn-sm" onclick="ProviderDash.updateStatus('${b.id}', 'accepted')">Accept</button>
        <button class="btn btn-danger btn-sm" onclick="ProviderDash.updateStatus('${b.id}', 'rejected')">Reject</button>
      `;
    }
    if (b.status === 'accepted') {
      return `
        <button class="btn btn-primary btn-sm" onclick="ProviderDash.updateStatus('${b.id}', 'in_progress')">Start Job</button>
      `;
    }
    if (b.status === 'in_progress') {
      return `
        <button class="btn btn-primary btn-sm" style="background: var(--success);" onclick="ProviderDash.updateStatus('${b.id}', 'completed')">Mark Completed</button>
      `;
    }
    return `<a href="booking-status.html?id=${b.id}" class="btn btn-outline btn-sm">View Status</a>`;
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
