import axios from 'axios';

const API_URL = 'http://localhost:5000/api/workouts/';

// Get all workouts (filtered by date)
const getWorkouts = async (dateString) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const config = { headers: { Authorization: `Bearer ${user.token}` } };
  
  // Append the dateString to the URL if it exists
  const query = dateString ? `?dateString=${dateString}` : '';
  const response = await axios.get(API_URL + query, config);
  
  return response.data;
};

// GET a single workout by ID
const getWorkout = async (id) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const config = { headers: { Authorization: `Bearer ${user.token}` } };
  const response = await axios.get(API_URL + id, config);
  return response.data;
};

// Create a new workout
const createWorkout = async (workoutData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const config = { headers: { Authorization: `Bearer ${user.token}` } };
  const response = await axios.post(API_URL, workoutData, config);
  return response.data;
};

// UPDATE an existing workout
const updateWorkout = async (id, workoutData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const config = { headers: { Authorization: `Bearer ${user.token}` } };
  const response = await axios.put(API_URL + id, workoutData, config);
  return response.data;
};

// Delete a workout
const deleteWorkout = async (id) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const config = { headers: { Authorization: `Bearer ${user.token}` } };
  const response = await axios.delete(API_URL + id, config);
  return response.data;
};

// NEW: Get weekly stats for Recharts
const getWeeklyStats = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const config = { headers: { Authorization: `Bearer ${user.token}` } };
  
  const response = await axios.get(API_URL + 'stats/weekly', config);
  return response.data;
};

const workoutService = {
  getWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getWeeklyStats 
};

export default workoutService;