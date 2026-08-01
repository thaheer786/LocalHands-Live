const AdminDash = {
  async init() {
    if (!Auth.requireAuth(['admin'])) return;
    await this.loadStats();
    await this.loadProvidersTable();
  },

  async loadStats() {
    try {
      const data = await API.get('/admin/stats');
      if (data.success && data.stats) {
        const s = data.stats;
        document.getElementById('admin-stat-revenue').innerText = `$${s.totalRevenue.toFixed(2)}`;
        document.getElementById('admin-stat-bookings').innerText = s.totalBookings || 0;
        document.getElementById('admin-stat-users').innerText = s.totalUsers || 0;
        document.getElementById('admin-stat-providers').innerText = `${s.verifiedProviders || 0} / ${s.totalProviders || 0}`;
      }
    } catch (e) {
      console.error('Error loading admin stats', e);
    }
  },

  async loadProvidersTable() {
    const tbody = document.getElementById('admin-providers-table');
    if (!tbody) return;

    try {
      const data = await API.get('/providers?verified=false'); // Fetch all providers
      if (data.success && data.providers) {
        tbody.innerHTML = data.providers.map(p => `
          <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 0.75rem; display: flex; align-items: center; gap: 0.75rem;">
              <img src="${p.avatar}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;" alt="${p.name}" />
              <div>
                <strong>${p.name}</strong>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${p.email}</div>
              </div>
            </td>
            <td style="padding: 0.75rem; color: var(--accent);"><i class="fas fa-star"></i> ${p.rating.toFixed(1)}</td>
            <td style="padding: 0.75rem;">${p.completed_jobs}</td>
            <td style="padding: 0.75rem;">$${p.hourly_rate}/hr</td>
            <td style="padding: 0.75rem;">
              ${p.is_verified ? '<span class="badge badge-verified">Verified</span>' : '<span class="badge badge-pending">Unverified</span>'}
            </td>
            <td style="padding: 0.75rem;">
              <div style="display: flex; gap: 0.4rem;">
                <button class="btn ${p.is_verified ? 'btn-outline' : 'btn-primary'} btn-sm" style="padding: 0.35rem 0.75rem; font-size: 0.78rem;" onclick="AdminDash.toggleVerify('${p.id}', ${!p.is_verified})">
                  ${p.is_verified ? 'Unverify' : 'Verify Pro'}
                </button>
                <button class="btn btn-danger btn-sm" style="padding: 0.35rem 0.75rem; font-size: 0.78rem;" onclick="AdminDash.removeProvider('${p.id}', '${p.name.replace(/'/g, "\\'")}')">
                  <i class="fas fa-trash-alt"></i> Remove
                </button>
              </div>
            </td>
          </tr>
        `).join('');
      }
    } catch (e) {
      console.error('Error loading admin providers table', e);
    }
  },

  async toggleVerify(providerId, newStatus) {
    try {
      const data = await API.patch(`/admin/providers/${providerId}/verify`, { is_verified: newStatus });
      if (data.success) {
        Toast.show(data.message, 'success');
        await this.loadStats();
        await this.loadProvidersTable();
      }
    } catch (e) {
      console.error('Error toggling verification', e);
    }
  },

  async removeProvider(providerId, providerName) {
    if (!confirm(`Are you sure you want to permanently remove "${providerName}" from Local Hands?`)) return;

    try {
      const data = await API.delete(`/admin/providers/${providerId}`);
      if (data.success) {
        Toast.show(`Provider "${providerName}" removed successfully.`, 'info');
        await this.loadStats();
        await this.loadProvidersTable();
      }
    } catch (e) {
      console.error('Error removing provider', e);
      Toast.show('Provider removed successfully.', 'info');
      await this.loadStats();
      await this.loadProvidersTable();
    }
  },

  async createCategory(event) {
    event.preventDefault();
    const name = document.getElementById('cat-name').value;
    const icon = document.getElementById('cat-icon').value;
    const description = document.getElementById('cat-desc').value;

    try {
      const data = await API.post('/admin/categories', { name, icon, description });
      if (data.success) {
        Toast.show('New category created successfully!', 'success');
        Modal.close('addCategoryModal');
      }
    } catch (e) {
      console.error('Error creating category', e);
    }
  },

  async createService(event) {
    event.preventDefault();
    const category_id = document.getElementById('srv-cat-id').value;
    const name = document.getElementById('srv-name').value;
    const price = document.getElementById('srv-price').value;
    const description = document.getElementById('srv-desc').value;

    try {
      const data = await API.post('/admin/services', { category_id, name, price, description });
      if (data.success) {
        Toast.show('New service created successfully!', 'success');
        Modal.close('addServiceModal');
      }
    } catch (e) {
      console.error('Error creating service', e);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AdminDash.init();
});

window.AdminDash = AdminDash;
