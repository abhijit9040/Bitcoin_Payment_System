import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? process.env.REACT_APP_API_URL 
    : 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('Response error:', error.response.data);
      if (error.response.status === 400) {
        // Handle validation errors
        const message = error.response.data.message || 'Invalid request data';
        throw new Error(message);
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network error:', error.request);
      throw new Error('Network error occurred');
    } else {
      // Request setup error
      console.error('Setup error:', error.message);
      throw new Error('Request failed');
    }
    return Promise.reject(error);
  }
);

export default api;