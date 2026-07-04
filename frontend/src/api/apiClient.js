import axios from 'axios';

// Change this to your .NET backend's actual base URL
const BASE_URL = 'https://localhost:5001/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ---- Auth ----
export function registerUser(data) {
  return apiClient.post('/auth/register', data);
}

export function loginUser(data) {
  return apiClient.post('/auth/login', data);
}

// ---- Soil / recommendation ----
export function submitSoilData(data) {
  return apiClient.post('/recommendation/predict', data);
}

export function getLatestRecommendation() {
  return apiClient.get('/recommendation/latest');
}

export function getRecommendationHistory() {
  return apiClient.get('/recommendation/history');
}

// ---- Weather ----
export function getCurrentWeather() {
  return apiClient.get('/weather/current');
}

export default apiClient;