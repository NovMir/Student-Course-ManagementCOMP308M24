import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enables cookies
});
// Enhanced authService.js with better error handling and request logging



// Authentication services with improved error handling
export const authService = {
  // Admin login with detailed logging
  adminLogin: async (credentials) => {
    try {
      console.log('📤 Calling admin login endpoint with:', {
        email: credentials.identifier,
        password: credentials.password ? '********' : 'empty'
      });
      
      const response = await API.post('/api/auth/admin-login', {
        email: credentials.identifier,
        password: credentials.password
      });
      
      console.log('📥 Admin login response:', {
        status: response.status,
        hasToken: !!response.data.token,
        hasUser: !!response.data.user
      });
      
      return response;
    } catch (error) {
      console.error('🔴 Admin login API error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },
  
  // Student login with detailed logging
  studentLogin: async (credentials) => {
    try {
      console.log('📤 Calling student login endpoint with:', {
        studentNumber: credentials.identifier,
        password: credentials.password ? '********' : 'empty'
      });
      
      const response = await API.post('/api/auth/student-login', {
        studentNumber: credentials.identifier,
        password: credentials.password
      });
      
      console.log('📥 Student login response:', {
        status: response.status,
        hasToken: !!response.data.token,
        hasUser: !!response.data.user
      });
      
      return response;
    } catch (error) {
      console.error('🔴 Student login API error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },
  
  // Check if user is authenticated with token verification
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    
    // Check token expiration (if JWT contains exp claim)
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const { exp } = JSON.parse(jsonPayload);
      
      if (exp) {
        // Token has expiration claim
        const currentTime = Date.now() / 1000;
        if (exp < currentTime) {
          console.log('🕒 Token has expired, logging out');
          // Clear expired token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error parsing token:', error);
      return false;
    }
  },
  
  // Enhanced logout that properly cleans up
  logout: () => {
    console.log('🚪 Logging out user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
   
    
    return Promise.resolve();
  },
  
  // Other methods remain the same...
  register: (userData) => API.post('/api/auth/register', userData),
  getCurrentUser: () => API.get('/api/auth/me'),
};



// Add token expiration check to request interceptor
API.interceptors.request.use(
  config => {
    console.log(`📤 API Request: ${config.method?.toUpperCase() || 'UNKNOWN'} ${config.url}`);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Added token to request');
    }
    
    return config;
  },
  error => Promise.reject(error)
);

API.interceptors.response.use(
  response => {
    console.log(`📥 Response received: ${response.status} for ${response.config.url}`);
    return response;
  },
  error => {
    if (error.response) {
      console.error(`❌ API Error: ${error.response.status} for ${error.config?.url}`);
      
      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        console.log('🔒 Unauthorized - clearing auth data');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Optional: redirect to login
        // window.location.href = '/login';
      }
    } else if (error.request) {
      console.error('❌ No response received from server');
    } else {
      console.error('❌ Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// User services (for user management)
export const userService = {
  // Get all users (admin only)
  getAllUsers: () => API.get('/api/users'),
  getAllStudents: () => {
    return API.get('/api/users/students');
  }
,  
  // You might need to implement:
  createStudent: (studentData) => API.post('/api/users/students', studentData),
  updateStudent: (id, studentData) => API.put(`/api/users/students/${id}`, studentData),
  deleteStudent: (id) => API.delete(`/api/users/students/${id}`),
  // For enrollments (if using these endpoints):
  getStudentCourses: (id) => API.get(`/api/users/students/${id}/courses`),
  addCourseToStudent: (studentId, courseId) => API.post(`/api/users/${studentId}/courses/${courseId}`),
  deleteCourseFromStudent: (studentId, courseId) => API.delete(`/api/users/${studentId}/courses/${courseId}`),
  // Get user by ID
  getUserById: (id) => API.get(`/api/users/${id}`),
  
  // Update user data
  updateUser: (id, userData) => API.put(`/api/users/${id}`, userData),
  
  // Delete user
  deleteUser: (id) => API.delete(`/api/users/${id}`),
  
  // Get user's courses
  getUserCourses: (id) => API.get(`/api/users/${id}/courses`),
  
  // Enroll user in course
  enrollInCourse: (userId, courseId) => API.post(`/api/users/${userId}/courses/${courseId}`),
  
  // Remove user from course
  withdrawFromCourse: (userId, courseId) => API.delete(`/api/users/${userId}/courses/${courseId}`)
};

// Course services
export const courseService = {
  // Get all courses
  getAllCourses: () => API.get('/api/courses'),
  
  // Get course by ID
  getCourseById: (id) => API.get(`/api/courses/${id}`),
  
  // Create new course (admin only)
  createCourse: (courseData) => API.post('/api/courses', courseData),
  
  // Update course (admin only)
  updateCourse: (id, courseData) => API.put(`/api/courses/${id}`, courseData),
  
  // Delete course (admin only)
  deleteCourse: (id) => API.delete(`/api/courses/${id}`),
  
  // Get students enrolled in course
  getCourseStudents: (id) => API.get(`/api/courses/${id}/students`)
};


export default API;