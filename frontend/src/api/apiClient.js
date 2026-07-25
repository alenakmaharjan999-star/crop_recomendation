import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5028/api';

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
  return apiClient.post('/auth/register', {
    username: data.email,
    password: data.password,
  });
}

export async function loginUser(data) {
  const response = await apiClient.post('/auth/login', {
    username: data.email,
    password: data.password,
  });

  response.data = {
    ...response.data,
    user: response.data.user || {
      email: data.email,
      fullName: data.email,
    },
  };

  return response;
}

// ---- Soil / recommendation ----
export async function submitSoilData(data) {
  const response = await apiClient.post('/prediction/predict', data);
  response.data = normalizePrediction(response.data, data);
  return response;
}

export async function getLatestRecommendation() {
  const response = await getRecommendationHistory();
  response.data = response.data[0] || null;
  return response;
}

export async function getRecommendationHistory() {
  const response = await apiClient.get('/prediction/history');
  response.data = (response.data || []).map(normalizePrediction);
  return response;
}

// ---- Weather ----
export function getCurrentWeather() {
  return apiClient.get('/weather/current');
}

function normalizePrediction(item, fallback = {}) {
  if (!item) return item;

  return {
    ...item,
    id: item.id ?? item.predictionId,
    crop: item.crop ?? item.predictedCrop,
    date: item.date ?? item.createdAt,
    confidence:
      item.confidence != null && item.confidence > 1
        ? item.confidence / 100
        : item.confidence,
    nitrogen: item.nitrogen ?? fallback.nitrogen,
    phosphorus: item.phosphorus ?? fallback.phosphorus,
    potassium: item.potassium ?? fallback.potassium,
    ph: item.ph ?? fallback.ph,
    temperature: item.temperature ?? fallback.temperature,
    humidity: item.humidity ?? fallback.humidity,
    rainfall: item.rainfall ?? fallback.rainfall,
  };
}

export default apiClient;
