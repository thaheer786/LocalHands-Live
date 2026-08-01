const API_BASE_URL = window.location.origin + '/api';

const API = {
  getToken() {
    return localStorage.getItem('lh_token');
  },

  setToken(token) {
    localStorage.setItem('lh_token', token);
  },

  removeToken() {
    localStorage.removeItem('lh_token');
    localStorage.removeItem('lh_user');
  },

  getUser() {
    const userStr = localStorage.getItem('lh_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  },

  setUser(user) {
    localStorage.setItem('lh_user', JSON.stringify(user));
  },

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 && !endpoint.includes('/auth/login')) {
          this.removeToken();
          if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
          }
        }
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      if (typeof Toast !== 'undefined') {
        Toast.show(error.message || 'Network error occurred.', 'error');
      }
      throw error;
    }
  },

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) });
  },

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) });
  },

  patch(endpoint, body) {
    return this.request(endpoint, { method: 'PATCH', body: JSON.stringify(body) });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
};

window.API = API;
