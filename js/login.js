const AuthPage = {
  mode: 'login',

  init() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'register') {
      this.switchMode('register');
    }
  },

  switchMode(newMode) {
    this.mode = newMode;
    const groupName = document.getElementById('group-name');
    const groupRole = document.getElementById('group-role');
    const submitBtn = document.getElementById('auth-submit-btn');
    const tabLogin = document.getElementById('auth-tab-login');
    const tabRegister = document.getElementById('auth-tab-register');

    if (newMode === 'register') {
      groupName.style.display = 'block';
      groupRole.style.display = 'block';
      submitBtn.innerText = 'Create Account';
      tabRegister.className = 'btn btn-primary';
      tabLogin.className = 'btn btn-secondary';
    } else {
      groupName.style.display = 'none';
      groupRole.style.display = 'none';
      submitBtn.innerText = 'Sign In';
      tabLogin.className = 'btn btn-primary';
      tabRegister.className = 'btn btn-secondary';
    }
  },

  async handleSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    try {
      let data;
      if (this.mode === 'register') {
        const name = document.getElementById('auth-name').value;
        const role = document.getElementById('auth-role').value;
        data = await API.post('/auth/register', { name, email, password, role });
      } else {
        data = await API.post('/auth/login', { email, password });
      }

      if (data.success && data.token) {
        API.setToken(data.token);
        API.setUser(data.user);
        Toast.show(`Welcome back, ${data.user.name}!`, 'success');

        setTimeout(() => {
          if (data.user.role === 'provider') {
            window.location.href = 'provider-dashboard.html';
          } else if (data.user.role === 'admin') {
            window.location.href = 'admin.html';
          } else {
            window.location.href = 'customer-dashboard.html';
          }
        }, 600);
      }
    } catch (e) {
      console.error('Auth submit error', e);
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
