
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/metrics';

// Get authentication token
const getConfig = () => {
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// Add body metric
const addMetric = async (metricData) => {
  const response = await axios.post(API_URL, metricData, getConfig());
  return response.data;
};

// Get all body metrics
const getMetrics = async () => {
  const response = await axios.get(API_URL, getConfig());
  return response.data;
};

// Update body metric
const updateMetric = async (id, metricData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    metricData,
    getConfig()
  );
  return response.data;
};

// Delete body metric
const deleteMetric = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    getConfig()
  );
  return response.data;
};

const metricsService = {
  addMetric,
  getMetrics,
  updateMetric,
  deleteMetric
};

export default metricsService;
