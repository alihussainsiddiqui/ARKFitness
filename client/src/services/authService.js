import axios from 'axios';

// The URL where your backend is running
const API_URL = 'http://localhost:5000/api/auth/';

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

// Update user profile
const updateProfile = async (userData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const config = {
    headers: { Authorization: `Bearer ${user?.token}` }
  };
  
  const response = await axios.put('http://localhost:5000/api/users/profile', userData, config);
  
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const authService = { register, login, logout, updateProfile };


export default authService;