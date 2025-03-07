// authService.js
import e from 'cors';
import API from './api';


 const authService = {
  // Admin login function
  adminLogin: (credentials) => {
    console.log('📤 Calling admin login endpoint with:', {
      email: credentials.identifier,
      password: credentials.password ? '********' : 'empty'
    });
    
    return API.post('/api/auth/admin-login', {
      email: credentials.identifier,
      password: credentials.password
    });
  },
  
  // Student login function
  studentLogin: (credentials) => {
    console.log('📤 Calling student login endpoint with:', {
      studentNumber: credentials.identifier,
      password: credentials.password ? '********' : 'empty'
    });
    
    return API.post('/api/auth/student-login', {
      studentNumber: credentials.identifier,
      password: credentials.password
    });
  },
  
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  getCurrentUser: () => API.get('/api/auth/me'),
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  }
};



export default authService;