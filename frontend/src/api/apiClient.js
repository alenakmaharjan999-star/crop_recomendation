import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5028/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const mockRecommendationHistory = [
  {
    id: 1,
    crop: 'Rice',
    confidence: 0.91,
    nitrogen: 90,
    phosphorus: 42,
    potassium: 43,
    ph: 6.5,
    temperature: 29,
    humidity: 78,
    rainfall: 220,
    date: '2026-07-30T09:15:00',
  },
  {
    id: 2,
    crop: 'Maize',
    confidence: 0.86,
    nitrogen: 72,
    phosphorus: 38,
    potassium: 36,
    ph: 6.8,
    temperature: 27,
    humidity: 70,
    rainfall: 145,
    date: '2026-07-22T14:30:00',
  },
  {
    id: 3,
    crop: 'Wheat',
    confidence: 0.82,
    nitrogen: 64,
    phosphorus: 45,
    potassium: 30,
    ph: 7.1,
    temperature: 23,
    humidity: 62,
    rainfall: 90,
    date: '2026-07-12T11:05:00',
  },
];

function mockResponse(data) {
  return Promise.resolve({ data });
}

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
    nitrogen: data.nitrogen,
    phosphorus: data.phosphorus,
    potassium: data.potassium,
    ph: data.ph,
    location: data.location,
  };

  // TODO: remove mock preview after backend auth is connected.
  return mockResponse(
    normalizePrediction(
      {
        id: Date.now(),
        crop: 'Rice',
        confidence: 0.91,
        date: new Date().toISOString(),
      },
      payload
    )
  );
}

export async function getLatestRecommendation() {
  const response = await getRecommendationHistory();
  response.data = response.data[0] || null;
  return response;
}

export async function getRecommendationHistory() {
  // TODO: remove mock preview after backend auth is connected.
  return mockResponse(mockRecommendationHistory.map(normalizePrediction));
}

// ---- Weather ----
export function getCurrentWeather() {
  // TODO: remove mock preview after backend auth is connected.
  return mockResponse({
    temperature: 29,
    humidity: 78,
    condition: 'Partly cloudy',
  });
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
    location: item.location ?? fallback.location,
    latitude: item.latitude ?? fallback.latitude,
    longitude: item.longitude ?? fallback.longitude,
  };
}

export default apiClient;
