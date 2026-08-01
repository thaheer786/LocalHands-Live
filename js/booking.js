const BookingCheckout = {
  serviceId: null,
  providerId: null,
  serviceData: null,
  selectedAddressId: null,

  async init() {
    const urlParams = new URLSearchParams(window.location.search);
    this.serviceId = urlParams.get('service_id');
    this.providerId = urlParams.get('provider_id');

    if (document.getElementById('booking-service-summary')) {
      if (!Auth.requireAuth(['customer', 'provider', 'admin'])) return;
      this.setDefaultDate();
      await this.loadServiceSummary();
      await this.loadAddresses();
    }
  },

  setDefaultDate() {
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.value = tomorrow.toISOString().split('T')[0];
    }
  },

  async loadServiceSummary() {
    const container = document.getElementById('booking-service-summary');
    if (!container || !this.serviceId) return;

    try {
      const data = await API.get(`/services/${this.serviceId}`);
      if (data.success && data.service) {
        this.serviceData = data.service;
        container.innerHTML = `
          <div style="display: flex; gap: 1.25rem; align-items: center;">
            <img src="${data.service.image}" style="width: 90px; height: 90px; border-radius: var(--radius-md); object-fit: cover;" alt="${data.service.name}" />
            <div>
              <span class="badge badge-verified" style="margin-bottom: 0.25rem;">${data.service.category_name}</span>
              <h3 style="font-size: 1.25rem;">${data.service.name}</h3>
              <p style="font-size: 0.9rem; color: var(--text-muted);">${data.service.description}</p>
            </div>
          </div>
        `;

        document.getElementById('summary-base-price').innerText = `$${data.service.price.toFixed(2)}`;
        const total = data.service.price + 5.0 + 4.5;
        document.getElementById('summary-total-price').innerText = `$${total.toFixed(2)}`;
      }
    } catch (e) {
      console.error('Error loading service summary', e);
    }
  },

  async loadAddresses() {
    const container = document.getElementById('booking-address-list');
    if (!container) return;

    try {
      const data = await API.get('/addresses');
      if (data.success && data.addresses.length > 0) {
        this.selectedAddressId = data.addresses[0].id;
        container.innerHTML = data.addresses.map((a, index) => `
          <label style="display: flex; align-items: center; gap: 1rem; padding: 0.85rem; border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-surface-elevated); cursor: pointer;">
            <input type="radio" name="address_choice" value="${a.id}" ${index === 0 ? 'checked' : ''} onchange="BookingCheckout.selectedAddressId = '${a.id}'" />
            <div>
              <strong>${a.title}</strong> (${a.street}, ${a.city}, ${a.state} ${a.zip})
            </div>
          </label>
        `).join('');
      } else {
        container.innerHTML = `
          <p style="color: var(--text-muted); font-size: 0.9rem;">No addresses found. Click "+ Add Address" to add a service location.</p>
        `;
      }
    } catch (e) {
      console.error('Error loading addresses', e);
    }
  },

  async handleAddAddress(event) {
    event.preventDefault();
    const title = document.getElementById('addr-title').value;
    const street = document.getElementById('addr-street').value;
    const city = document.getElementById('addr-city').value;
    const state = document.getElementById('addr-state').value;
    const zip = document.getElementById('addr-zip').value;

    try {
      const data = await API.post('/addresses', { title, street, city, state, zip, is_default: 1 });
      if (data.success) {
        Toast.show('Address added successfully!', 'success');
        Modal.close('addAddressModal');
        await this.loadAddresses();
      }
    } catch (e) {
      console.error('Error saving address', e);
    }
  },

  async submitBooking() {
    const scheduled_date = document.getElementById('booking-date').value;
    const scheduled_time = document.getElementById('booking-time').value;
    const notes = document.getElementById('booking-notes').value;

    if (!scheduled_date || !scheduled_time) {
      Toast.show('Please select a valid date and time slot.', 'warning');
      return;
    }

    try {
      const payload = {
        service_id: this.serviceId,
        provider_id: this.providerId || null,
        address_id: this.selectedAddressId,
        scheduled_date,
        scheduled_time,
        notes
      };

      const data = await API.post('/bookings', payload);
      if (data.success && data.booking) {
        Toast.show('Booking created successfully!', 'success');
        setTimeout(() => {
          window.location.href = `booking-status.html?id=${data.booking.id}`;
        }, 800);
      }
    } catch (e) {
      console.error('Error submitting booking', e);
    }
  }
};

const BookingTracker = {
  bookingId: null,
  currentBooking: null,

  async init() {
    const urlParams = new URLSearchParams(window.location.search);
    this.bookingId = urlParams.get('id');

    if (document.getElementById('booking-number-display')) {
      if (!Auth.requireAuth()) return;
      await this.loadBookingDetails();
    }
  },

  async loadBookingDetails() {
    if (!this.bookingId) return;

    try {
      const data = await API.get(`/bookings/${this.bookingId}`);
      if (data.success && data.booking) {
        const b = data.booking;
        this.currentBooking = b;

        document.getElementById('booking-number-display').innerText = b.booking_number;

        const badge = document.getElementById('booking-status-badge');
        badge.className = `badge badge-${b.status}`;
        badge.innerText = b.status.replace('_', ' ').toUpperCase();

        this.updateStepTracker(b.status);

        // Render Service Info
        document.getElementById('status-service-details').innerHTML = `
          <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
            <img src="${b.service_image}" style="width: 60px; height: 60px; border-radius: var(--radius-sm); object-fit: cover;" alt="${b.service_name}" />
            <div>
              <h4 style="font-size: 1.1rem;">${b.service_name}</h4>
              <span style="font-size: 0.9rem; color: var(--success); font-weight: 700;">$${b.total_price.toFixed(2)}</span>
            </div>
          </div>
          <div style="font-size: 0.9rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.4rem;">
            <div><i class="far fa-calendar-alt"></i> Scheduled: ${b.scheduled_date} at ${b.scheduled_time}</div>
            <div><i class="fas fa-map-marker-alt"></i> Address: ${b.address_street || 'On-site Service'}, ${b.address_city || ''}</div>
          </div>
        `;

        // Render Provider Info
        document.getElementById('status-provider-details').innerHTML = `
          <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
            <img src="${b.provider_avatar}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;" alt="${b.provider_name}" />
            <div>
              <h4 style="font-size: 1.05rem;">${b.provider_name}</h4>
              <span style="font-size: 0.85rem; color: var(--accent);"><i class="fas fa-star"></i> ${b.provider_rating ? b.provider_rating.toFixed(1) : '5.0'}</span>
            </div>
          </div>
          <div style="font-size: 0.9rem; color: var(--text-muted);">
            <i class="fas fa-phone-alt"></i> Contact: <a href="tel:${b.provider_phone}" style="color: var(--primary); text-decoration: none;">${b.provider_phone || 'Available after confirmation'}</a>
          </div>
        `;

        // Action Buttons
        const actionContainer = document.getElementById('status-action-btns');
        if (b.status === 'pending') {
          actionContainer.innerHTML = `
            <button class="btn btn-danger btn-sm" onclick="BookingTracker.cancelBooking()">Cancel Booking</button>
          `;
        } else if (b.status === 'completed' && !b.review_rating) {
          actionContainer.innerHTML = `
            <button class="btn btn-primary btn-sm" onclick="Modal.open('reviewModal')"><i class="fas fa-star"></i> Leave Review</button>
          `;
        } else {
          actionContainer.innerHTML = '';
        }
      }
    } catch (e) {
      console.error('Error loading booking status', e);
    }
  },

  updateStepTracker(status) {
    const steps = ['pending', 'accepted', 'in_progress', 'completed'];
    const currentIndex = steps.indexOf(status);

    for (let i = 1; i <= 4; i++) {
      const stepElem = document.getElementById(`step-${i}`);
      if (!stepElem) continue;

      stepElem.classList.remove('active', 'completed');
      if (i - 1 < currentIndex) {
        stepElem.classList.add('completed');
      } else if (i - 1 === currentIndex) {
        stepElem.classList.add('active');
      }
    }
  },

  async cancelBooking() {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const data = await API.patch(`/bookings/${this.bookingId}/status`, { status: 'cancelled' });
      if (data.success) {
        Toast.show('Booking cancelled.', 'info');
        await this.loadBookingDetails();
      }
    } catch (e) {
      console.error('Error cancelling booking', e);
    }
  },

  async submitReview(event) {
    event.preventDefault();
    const rating = document.getElementById('review-rating').value;
    const comment = document.getElementById('review-comment').value;

    try {
      const data = await API.post('/reviews', {
        booking_id: this.bookingId,
        rating,
        comment
      });
      if (data.success) {
        Toast.show('Review submitted successfully!', 'success');
        Modal.close('reviewModal');
        await this.loadBookingDetails();
      }
    } catch (e) {
      console.error('Error submitting review', e);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  BookingCheckout.init();
  BookingTracker.init();
});

window.BookingCheckout = BookingCheckout;
window.BookingTracker = BookingTracker;
