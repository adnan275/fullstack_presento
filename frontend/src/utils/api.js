import axios from 'axios';

// 1️⃣ Create an axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3️⃣ Response interceptor (optional, for handling errors globally)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// 4️⃣ Export functions to use in components

// Signup
export const signup = (data) => api.post('/auth/signup', data);

// Login
export const login = (data) => api.post('/auth/login', data);


// Example: Fetch user profile
export const getProfile = () => api.get('/user/me');


export default api;
