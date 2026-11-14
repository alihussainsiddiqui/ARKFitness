import axios from 'axios';

const API_URL = 'http://localhost:5000/api/nutrition/';

const getDailyLog = async (dateString) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const config = { headers: { Authorization: `Bearer ${user.token}` } };
  
  const response = await axios.get(API_URL + dateString, config);
  return response.data;
};

const addFoodItem = async (data) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const config = { headers: { Authorization: `Bearer ${user.token}` } };
  
  const response = await axios.post(API_URL + 'add', data, config);
  return response.data;
};

// Add this function above your 'const nutritionService = {' block
const updateGoals = async (goalsData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const config = { headers: { Authorization: `Bearer ${user.token}` } };
  
  const response = await axios.put(API_URL + 'goals', goalsData, config);
  
  // Update localStorage with the new goals so the app remembers them on refresh
  const updatedUser = { ...user, macroGoals: goalsData };
  localStorage.setItem('user', JSON.stringify(updatedUser));
  
  return updatedUser;
};

// NEW: Delete a specific food item
const deleteFoodItem = async (dateString, mealType, itemId) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const config = { headers: { Authorization: `Bearer ${user.token}` } };
  
  const response = await axios.delete(`${API_URL}${dateString}/${mealType}/${itemId}`, config);
  return response.data;
};



const nutritionService = {
  getDailyLog,
  addFoodItem,
  deleteFoodItem,
  updateGoals
};

export default nutritionService;