import api from './api';

const authService = {
  register: (userData) => {
    return api.post('/auth/register', userData);
  },
  
  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout'); // Clear httpOnly cookie on server
    } catch (err) {
      console.error('Logout API error:', err);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};

export default authService;