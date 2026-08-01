const CustomerDash = {
  async init() {
    if (!Auth.requireAuth(['customer', 'admin'])) return;
    this.loadProfile();
    await this.loadBookings();
    await this.loadAddresses();

    // Auto scroll to bookings if hash or query param demands
    if (window.location.hash === '#my-bookings' || window.location.search.includes('bookings')) {
      setTimeout(() => this.scrollToBookings(), 300);
    }
  },

  scrollToBookings() {
    const section = document.getElementById('section-my-bookings');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
      section.style.transition = 'all 0.4s ease';
      section.style.borderColor = '#FF7A00';
      section.style.boxShadow = '0 12px 36px rgba(255, 122, 0, 0.25)';
      setTimeout(() => {
        section.style.borderColor = '#E2E8F0';
        section.style.boxShadow = '0 4px 20px rgba(90, 70, 52, 0.04)';
      }, 2200);
    }
  },

  loadProfile() {
    const user = API.getUser();
    if (user) {
      const welcomeName = document.getElementById('cust-welcome-name');
      const cardEmail = document.getElementById('cust-card-email');
      const profileNameInput = document.getElementById('cust-profile-name');
      const profilePhoneInput = document.getElementById('cust-profile-phone');
      const refLinkInput = document.getElementById('cust-ref-link');

      if (welcomeName) welcomeName.innerText = `Welcome, ${user.name || 'Customer'}`;
      if (cardEmail) cardEmail.innerText = user.email || 'customer@gmail.com';
      if (profileNameInput) profileNameInput.value = user.name || '';
      if (profilePhoneInput) profilePhoneInput.value = user.phone || '+91 98765 43210';

      const userSlug = (user.name || 'user').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (refLinkInput) refLinkInput.value = `https://localhands.in/join?ref=${userSlug}786`;
    }
  },

  triggerPhotoUpload() {
    const fileInput = document.getElementById('cust-photo-file');
    if (fileInput) fileInput.click();
  },

  handlePhotoSelected(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const avatarImg = document.getElementById('cust-avatar-img');
        if (avatarImg) avatarImg.src = e.target.result;
        Toast.show('Profile photo updated!', 'success');
      };
      reader.readAsDataURL(file);
    }
  },

  copyReferralLink() {
    const refInput = document.getElementById('cust-ref-link');
    if (refInput) {
      refInput.select();
      navigator.clipboard.writeText(refInput.value);
      Toast.show('Referral link copied to clipboard!', 'success');
    }
  },

  saveProfile(event) {
    event.preventDefault();
    const newName = document.getElementById('cust-profile-name').value;
    const user = API.getUser();
    if (user) {
      user.name = newName;
      localStorage.setItem('user', JSON.stringify(user));
      this.loadProfile();
    }
    Toast.show('Profile updated successfully!', 'success');
  },

  async loadBookings() {
    const container = document.getElementById('customer-bookings-list');
    if (!container) return;

    try {
      const data = await API.get('/bookings/my-bookings');
      if (data.success && data.bookings.length > 0) {
        container.innerHTML = data.bookings.map(b => `
          <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div style="display: flex; gap: 1rem; align-items: center;">
              <img src="${b.service_image || 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=200'}" style="width: 64px; height: 64px; border-radius: 12px; object-fit: cover;" alt="${b.service_name}" onerror="this.src='https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=200';" />
              <div>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.2rem;">
                  <span class="badge badge-${b.status}" style="font-size: 0.68rem;">${b.status.replace('_', ' ').toUpperCase()}</span>
                  <span style="font-size: 0.78rem; color: #64748B;">#${b.booking_number}</span>
                </div>
                <h4 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.05rem; font-weight: 800; color: #5A4634; margin: 0;">${b.service_name}</h4>
                <div style="font-size: 0.82rem; color: #64748B; margin-top: 0.2rem;">
                  <i class="fas fa-user-circle" style="color: #FF7A00;"></i> ${b.provider_name} • <i class="far fa-calendar-alt"></i> ${b.scheduled_date}
                </div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <span style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.2rem; font-weight: 800; color: #5A4634;">₹${b.total_price}</span>
              <a href="booking-status.html?id=${b.id}" class="btn btn-outline btn-sm" style="border-radius: 8px; font-weight: 700;">Details</a>
            </div>
          </div>
        `).join('');
      } else {
        container.innerHTML = `
          <div style="text-align: center; padding: 2.5rem; background: #F8FAFC; border-radius: 16px; border: 1px dashed #CBD5E1;">
            <i class="far fa-calendar-times" style="font-size: 2.5rem; color: #FF7A00; margin-bottom: 0.75rem;"></i>
            <h4 style="color: #5A4634; font-family: 'Plus Jakarta Sans'; font-size: 1.1rem; margin-bottom: 0.3rem;">No Bookings Found</h4>
            <p style="color: #64748B; font-size: 0.85rem; margin-bottom: 1.25rem;">You have not placed any service bookings yet.</p>
            <a href="Allservices.html" class="btn-view-all-orange" style="margin-top: 0; padding: 0.6rem 1.5rem; font-size: 0.85rem;">Browse Categories</a>
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
      if (data.success && data.addresses.length > 0) {
        grid.innerHTML = data.addresses.map(a => `
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 1.1rem; position: relative;">
            ${a.is_default ? '<span style="position: absolute; top: 0.85rem; right: 0.85rem; background: #EFF6FF; color: #2563EB; font-size: 0.65rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 9999px;">Default</span>' : ''}
            <h4 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.98rem; font-weight: 800; color: #5A4634; margin-bottom: 0.4rem;">
              <i class="fas fa-home" style="color: #FF7A00;"></i> ${a.title}
            </h4>
            <p style="font-size: 0.84rem; color: #64748B; line-height: 1.5; margin: 0 0 0.85rem 0;">
              ${a.street}<br />${a.city}, ${a.state} ${a.zip}
            </p>
            <button class="btn btn-danger btn-sm" style="padding: 0.25rem 0.65rem; font-size: 0.72rem; border-radius: 6px;" onclick="CustomerDash.deleteAddress('${a.id}')">
              <i class="fas fa-trash-alt"></i> Delete
            </button>
          </div>
        `).join('');
      } else {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; background: #F8FAFC; border: 1px dashed #CBD5E1; border-radius: 14px; padding: 1.5rem; text-align: center;">
            <p style="color: #64748B; font-size: 0.85rem; margin: 0;">No saved delivery addresses yet. Add your home or office address for fast bookings.</p>
          </div>
        `;
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
        Toast.show('Address saved successfully!', 'success');
        Modal.close('addAddressModal');
        await this.loadAddresses();
      }
    } catch (e) {
      console.error('Error adding address', e);
    }
  },

  async deleteAddress(id) {
    if (!confirm('Delete this saved address?')) return;
    try {
      await API.delete(`/addresses/${id}`);
      Toast.show('Address deleted.', 'info');
      await this.loadAddresses();
    } catch (e) {
      console.error('Error deleting address', e);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CustomerDash.init();
});

window.CustomerDash = CustomerDash;
