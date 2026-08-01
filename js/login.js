const AuthPage = {
  mode: 'login',

  init() {
    const urlParams = new URLSearchParams(window.location.search);
    const modeParam = urlParams.get('mode');
    const roleParam = urlParams.get('role');

    if (modeParam === 'register' || roleParam === 'provider') {
      this.switchMode('register');
      if (roleParam === 'provider') {
        this.selectRole('provider');
      }
    }
  },

  switchMode(newMode) {
    this.mode = newMode;
    const tabLogin = document.getElementById('auth-tab-login');
    const tabRegister = document.getElementById('auth-tab-register');
    const titleEl = document.getElementById('auth-form-title');
    const subtitleEl = document.getElementById('auth-form-subtitle');
    const btnText = document.getElementById('btn-text');

    const groupName = document.getElementById('group-name');
    const groupPhone = document.getElementById('group-phone');
    const groupConfirmPw = document.getElementById('group-confirm-pw');
    const pwStrengthContainer = document.getElementById('pw-strength-container');
    const groupRole = document.getElementById('group-role');
    const loginMetaRow = document.getElementById('login-meta-row');
    const registerTermsRow = document.getElementById('register-terms-row');

    if (newMode === 'register') {
      tabLogin.classList.remove('active');
      tabRegister.classList.add('active');
      
      titleEl.innerText = 'Create your account';
      subtitleEl.innerText = 'Join Local Hands to book pros or list your service business.';
      btnText.innerText = 'Create Account';

      groupName.style.display = 'block';
      groupPhone.style.display = 'block';
      groupConfirmPw.style.display = 'block';
      pwStrengthContainer.style.display = 'block';
      groupRole.style.display = 'block';
      registerTermsRow.style.display = 'block';
      loginMetaRow.style.display = 'none';
    } else {
      tabRegister.classList.remove('active');
      tabLogin.classList.add('active');

      titleEl.innerText = 'Welcome back';
      subtitleEl.innerText = 'Sign in to access your verified bookings and local pros.';
      btnText.innerText = 'Sign In';

      groupName.style.display = 'none';
      groupPhone.style.display = 'none';
      groupConfirmPw.style.display = 'none';
      pwStrengthContainer.style.display = 'none';
      groupRole.style.display = 'none';
      registerTermsRow.style.display = 'none';
      loginMetaRow.style.display = 'flex';
    }
  },

  togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!input || !icon) return;

    if (input.type === 'password') {
      input.type = 'text';
      icon.className = 'fas fa-eye-slash';
    } else {
      input.type = 'password';
      icon.className = 'fas fa-eye';
    }
  },

  selectRole(role) {
    const hiddenRole = document.getElementById('auth-role');
    const tileCust = document.getElementById('role-tile-customer');
    const tileProv = document.getElementById('role-tile-provider');

    if (hiddenRole) hiddenRole.value = role;

    if (role === 'provider') {
      tileCust.classList.remove('selected');
      tileProv.classList.add('selected');
    } else {
      tileProv.classList.remove('selected');
      tileCust.classList.add('selected');
    }
  },

  checkPasswordStrength(val) {
    const fill = document.getElementById('pw-strength-fill');
    const text = document.getElementById('pw-strength-text');
    if (!fill || !text) return;

    if (!val) {
      fill.style.width = '0%';
      text.innerText = 'Weak';
      text.style.color = '#EF4444';
      return;
    }

    let score = 0;
    if (val.length >= 6) score += 1;
    if (val.length >= 10) score += 1;
    if (/[0-9]/.test(val)) score += 1;
    if (/[^A-Za-z0-9]/.test(val)) score += 1;

    if (score <= 1) {
      fill.style.width = '30%';
      fill.style.background = '#EF4444';
      text.innerText = 'Weak';
      text.style.color = '#EF4444';
    } else if (score <= 3) {
      fill.style.width = '65%';
      fill.style.background = '#F59E0B';
      text.innerText = 'Medium';
      text.style.color = '#F59E0B';
    } else {
      fill.style.width = '100%';
      fill.style.background = '#10B981';
      text.innerText = 'Strong';
      text.style.color = '#10B981';
    }
  },

  checkPasswordMatch() {
    const pw = document.getElementById('auth-password').value;
    const confirm = document.getElementById('auth-confirm-password').value;
    const badge = document.getElementById('pw-match-badge');
    if (!badge) return;

    if (!confirm) {
      badge.innerText = '';
      return;
    }

    if (pw === confirm) {
      badge.innerText = '✓ Passwords match';
      badge.style.color = '#10B981';
    } else {
      badge.innerText = '✕ Passwords do not match';
      badge.style.color = '#EF4444';
    }
  },

  async handleSubmit(event) {
    event.preventDefault();

    const submitBtn = document.getElementById('auth-submit-btn');
    const btnIcon = document.getElementById('btn-icon');
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    if (this.mode === 'register') {
      const confirmPw = document.getElementById('auth-confirm-password').value;
      if (password !== confirmPw) {
        Toast.show('Passwords do not match. Please check again.', 'error');
        return;
      }
    }

    // Show Loading Spinner State
    if (btnIcon) btnIcon.className = 'fas fa-spinner fa-spin';
    if (submitBtn) submitBtn.disabled = true;

    try {
      let data;
      if (this.mode === 'register') {
        const name = document.getElementById('auth-name').value;
        const phone = document.getElementById('auth-phone').value;
        const role = document.getElementById('auth-role').value;
        data = await API.post('/auth/register', { name, phone, email, password, role });
      } else {
        data = await API.post('/auth/login', { email, password });
      }

      if (data.success && data.token) {
        API.setToken(data.token);
        API.setUser(data.user);

        // Show Success Checkmark Icon Animation
        if (btnIcon) btnIcon.className = 'fas fa-check-circle';
        Toast.show(`Welcome, ${data.user.name}! Redirecting...`, 'success');

        setTimeout(() => {
          if (data.user.role === 'provider') {
            window.location.href = 'provider-dashboard.html';
          } else if (data.user.role === 'admin') {
            window.location.href = 'admin.html';
          } else {
            window.location.href = 'customer-dashboard.html';
          }
        }, 800);
      } else {
        if (btnIcon) btnIcon.className = 'fas fa-arrow-right';
        if (submitBtn) submitBtn.disabled = false;
      }
    } catch (e) {
      console.error('Auth submit error', e);
      if (btnIcon) btnIcon.className = 'fas fa-arrow-right';
      if (submitBtn) submitBtn.disabled = false;
    }
  },

  async demoLogin(role) {
    try {
      const data = await API.post('/auth/demo-login', { role });
      if (data.success && data.token) {
        API.setToken(data.token);
        API.setUser(data.user);
        Toast.show(`Signed in as Demo ${role.toUpperCase()} (${data.user.name})`, 'success');

        setTimeout(() => {
          if (role === 'provider') {
            window.location.href = 'provider-dashboard.html';
          } else if (role === 'admin') {
            window.location.href = 'admin.html';
          } else {
            window.location.href = 'customer-dashboard.html';
          }
        }, 600);
      }
    } catch (e) {
      console.error('Demo login error', e);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AuthPage.init();
});

window.AuthPage = AuthPage;
