const Auth = {
  init() {
    this.renderNav();
  },

  renderNav() {
    const navActions = document.getElementById('nav-actions-container');
    const user = API.getUser();

    if (!navActions) return;

    if (user) {
      let dashboardLink = 'customer-dashboard.html';
      if (user.role === 'provider') dashboardLink = 'provider-dashboard.html';
      if (user.role === 'admin') dashboardLink = 'admin.html';

      navActions.innerHTML = `
        <div class="user-menu" id="user-menu-btn" onclick="Auth.toggleDropdown()">
          <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}" alt="${user.name}" class="user-avatar">
          <span class="user-name">${user.name}</span>
          <span class="user-role-badge">${user.role}</span>
          <i class="fas fa-chevron-down" style="font-size: 0.75rem; color: var(--text-muted);"></i>
          
          <div class="user-dropdown" id="user-dropdown-menu">
            <a href="${dashboardLink}"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
            ${user.role === 'customer' ? '<a href="customer-dashboard.html#bookings"><i class="fas fa-calendar-alt"></i> My Bookings</a>' : ''}
            ${user.role === 'provider' ? '<a href="provider-dashboard.html#jobs"><i class="fas fa-briefcase"></i> Active Jobs</a>' : ''}
            ${user.role === 'admin' ? '<a href="admin.html"><i class="fas fa-user-shield"></i> Admin Panel</a>' : ''}
            <button onclick="Auth.logout()"><i class="fas fa-sign-out-alt"></i> Logout</button>
          </div>
        </div>
      `;
    } else {
      navActions.innerHTML = `
        <a href="login.html" class="btn btn-primary btn-sm">Sign In</a>
      `;
    }
  },

  toggleDropdown() {
    const dropdown = document.getElementById('user-dropdown-menu');
    if (dropdown) {
      dropdown.classList.toggle('active');
    }
  },

  logout() {
    API.removeToken();
    if (typeof Toast !== 'undefined') {
      Toast.show('Logged out successfully.', 'info');
    }
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 500);
  },

  requireAuth(allowedRoles = []) {
    const user = API.getUser();
    if (!user || !API.getToken()) {
      window.location.href = 'login.html';
      return false;
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Auth.init();
});

window.Auth = Auth;
