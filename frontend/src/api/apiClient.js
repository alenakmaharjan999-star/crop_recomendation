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
export async function registerUser(data) {
  const response = await apiClient.post('/auth/register', {
    username: data.username,
    password: data.password,
    confirmPassword: data.confirmPassword,
  });

  // Normalize server user object to use lowercase keys
  const srvUser = response.data.user || {};
  response.data.user = {
    userId: srvUser.userId ?? srvUser.UserId,
    username: srvUser.username ?? srvUser.Username ?? data.username,
  };

  return response;
}

export async function loginUser(data) {
  const response = await apiClient.post('/auth/login', {
    username: data.username,
    password: data.password,
  });

  // Normalize server user object to use lowercase keys
  const srvUser = response.data.user || {};
  response.data.user = {
    userId: srvUser.userId ?? srvUser.UserId,
    username: srvUser.username ?? srvUser.Username ?? data.username,
  };

  return response;
}

// ---- Soil / recommendation ----
export async function submitSoilData(data) {
  const payload = {
    nitrogen: Number(data.nitrogen),
    phosphorus: Number(data.phosphorus),
    potassium: Number(data.potassium),
    ph: Number(data.ph),
    location: data.location,
  };

  const response = await apiClient.post('/prediction/predict', payload);
  response.data = normalizePrediction(response.data, {
    ...payload,
    date: new Date().toISOString(),
  });

  return response;
}

export async function getLatestRecommendation() {
  const response = await getRecommendationHistory();
  response.data = response.data[0] || null;
  return response;
}

export async function getRecommendationHistory() {
  const response = await apiClient.get('/prediction/history');
  const items = Array.isArray(response.data) ? response.data : [];
  response.data = items
    .map((item) => normalizePrediction(item))
    .sort((a, b) => new Date(b.date ?? 0) - new Date(a.date ?? 0));

  return response;
}

export async function getValidLocations() {
  const response = await apiClient.get('/prediction/locations');
  return response;
}

// ---- Weather ----
export function getCurrentWeather(location = 'Kathmandu') {
  return apiClient.get('/weather/current', { params: { location } });
}

function normalizePrediction(item, fallback = {}) {
  if (!item) return item;

  return {
    // Basic fields
    id: item.id ?? item.predictionId ?? fallback.id,
    crop: item.crop ?? item.predictedCrop,
    date: item.date ?? item.createdAt ?? fallback.date,
    confidence: item.confidence != null && item.confidence > 1
      ? item.confidence / 100
      : item.confidence,
    
    // Soil inputs
    nitrogen: item.nitrogen ?? fallback.nitrogen,
    phosphorus: item.phosphorus ?? fallback.phosphorus,
    potassium: item.potassium ?? fallback.potassium,
    ph: item.ph ?? fallback.ph,
    location: item.location ?? fallback.location,
    
    // Weather data
    temperature: item.temperature ?? fallback.temperature,
    humidity: item.humidity ?? fallback.humidity,
    rainfall: item.rainfall ?? fallback.rainfall,
    latitude: item.latitude ?? fallback.latitude,
    longitude: item.longitude ?? fallback.longitude,
    
    // ✅ ADD THESE 5 NEW FIELDS (THIS IS THE CHANGE)
    accuracy: item.accuracy ?? item.Accuracy ?? 0,
    precision: item.precision ?? item.Precision ?? 0,
    recall: item.recall ?? item.Recall ?? 0,
    f1Score: item.f1Score ?? item.F1Score ?? 0,
    confusionMatrix: item.confusionMatrix ?? item.ConfusionMatrix ?? null,
    fertilizerRecommendation: item.fertilizerRecommendation ?? item.FertilizerRecommendation ?? null,
  };
}

export default apiClient;
