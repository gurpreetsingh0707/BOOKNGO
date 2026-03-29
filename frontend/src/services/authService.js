import api from './api';

const authService = {
  register: (userData) => {
    return api.post('/auth/Register', userData);
  },
  
  login: (credentials) => {
    return api.post('/auth/Login', credentials);
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};

export default authService;