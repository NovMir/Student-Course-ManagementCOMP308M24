import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';  // Ensure this matches backend


const getAuthHeaders = () => {
  const token = JSON.parse(localStorage.getItem('token')); // Ensure token is stored properly
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const api = {
  getStudents: async () => {
    const response = await axios.get(`${API_BASE_URL}/users/students`, getAuthHeaders());  // ✅ Include token
    return response.data;
  },
  getCourses: async () => {
    const response = await axios.get(`${API_BASE_URL}/api/Courses`, getAuthHeaders());  // ✅ Include token
    return response.data;
  },
  enrollInCourse: async (studentId, courseId) => {
    const response = await axios.post(`${API_BASE_URL}/users/students/${studentId}/courses/${courseId}`, {}, getAuthHeaders());
    return response.data;
  },
  addCourse: async (courseData) => {
    const response = await axios.post(`${API_BASE_URL}/api/Courses`, courseData, getAuthHeaders());
    return response.data;
  },
  deleteCourse: async (courseId) => {
    const response = await axios.delete(`${API_BASE_URL}/api/Courses/${courseId}`, getAuthHeaders());
    return response.data;
  },
};

export default api;
