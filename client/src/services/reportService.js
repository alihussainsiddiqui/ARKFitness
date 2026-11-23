
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/reports';

// Authentication configuration
const getConfig = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user?.token) {
    throw new Error('Please login to export your report.');
  }

  return {
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json'
    }
  };
};

// Get performance report
const getPerformanceReport = async (period = 'all') => {
  const response = await axios.get(
    `${API_URL}/performance?period=${period}`,
    getConfig()
  );

  return response.data;
};

const reportService = {
  getPerformanceReport
};

export default reportService;
