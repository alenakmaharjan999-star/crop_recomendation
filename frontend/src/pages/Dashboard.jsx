import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import StatCard from '../components/StatCard';
import RecommendationCard from '../components/RecommendationCard';
import SoilForm from '../components/SoilForm';
import '../components/Dashboard.css';
import { useAuth } from '../context/AuthContext';
import {
  submitSoilData,
  getRecommendationHistory,
  getCurrentWeather,
} from '../api/apiClient';

export default function Dashboard() {
  const { user } = useAuth();

  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);
  const [latest, setLatest] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    getCurrentWeather()
      .then((res) => setWeather(res.data))
      .catch(() => setWeather(null));

    getRecommendationHistory()
      .then((res) => {
        setHistory(res.data || []);
        if (res.data && res.data.length > 0) setLatest(res.data[0]);
      })
      .catch(() => setHistory([]))
      .finally(() => setLoadingHistory(false));
  }, []);

  async function handlePredict(values) {
    setPredicting(true);
    try {
      const res = await submitSoilData(values);
      setLatest(res.data);
      setHistory((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error('Prediction failed', err);
    } finally {
      setPredicting(false);
    }
  }

  const totalRecommendations = history.length;
  const mostRecommendedCrop = getMostFrequent(history.map((h) => h.crop));
  const avgConfidence = history.length
    ? Math.round(
        (history.reduce((sum, h) => sum + (h.confidence || 0), 0) / history.length) * 100
      )
    : null;

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <AppLayout>
      <div className="dash-header">
        <div>
          <h1 className="dash-header__greeting">
            Namaste, {user?.fullName?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="dash-header__date">{today}</p>
        </div>

        <div className="weather-pill">
          <span className="weather-pill__icon">{weather ? weatherIcon(weather.condition) : '⛅'}</span>
          <div>
            <p className="weather-pill__temp">
              {weather ? `${Math.round(weather.temperature)}°C` : '—'}
            </p>
            <p className="weather-pill__meta">
              Kathmandu{weather ? ` · ${weather.condition}` : ' · loading…'}
            </p>
          </div>
        </div>
      </div>

      <div className="stat-row">
        <StatCard
          label="Total recommendations"
          value={loadingHistory ? '—' : totalRecommendations}
          bandClass="b-npk"
        />
        <StatCard
          label="Most recommended crop"
          value={loadingHistory ? '—' : (mostRecommendedCrop || 'None yet')}
          bandClass="b-humidity"
        />
        <StatCard
          label="Avg. model confidence"
          value={loadingHistory ? '—' : (avgConfidence != null ? avgConfidence : 'N/A')}
          unit={avgConfidence != null ? '%' : ''}
          bandClass="b-rainfall"
        />
      </div>

      <div className="dash-grid">
        <div className="panel">
          <h3 className="panel__title">Get a recommendation</h3>
          <p className="panel__subtitle">
            Enter your soil readings — temperature and humidity are pre-filled from today's weather.
          </p>
          <SoilForm
            onSubmit={handlePredict}
            loading={predicting}
            prefill={
              weather
                ? { temperature: weather.temperature, humidity: weather.humidity }
                : {}
            }
          />
          <RecommendationCard
            crop={latest?.crop}
            confidence={latest?.confidence}
            loading={false}
          />
        </div>

        <div className="panel">
          <h3 className="panel__title">Recent history</h3>
          <p className="panel__subtitle">Your last predictions, most recent first.</p>

          {loadingHistory ? (
            <p style={{ color: 'var(--ink-600)', fontSize: '0.88rem' }}>Loading history…</p>
          ) : history.length === 0 ? (
            <p style={{ color: 'var(--ink-600)', fontSize: '0.88rem' }}>
              No predictions yet. Submit the form to see your history here.
            </p>
          ) : (
            <div className="history-list">
              {history.map((item, idx) => (
                <div className="history-item" key={item.id || idx}>
                  <div>
                    <p className="history-item__crop">{item.crop}</p>
                    <p className="history-item__date">
                      {item.date ? new Date(item.date).toLocaleDateString() : '—'}
                      {' · '}N {item.nitrogen} P {item.phosphorus} K {item.potassium} · pH {item.ph}
                    </p>
                  </div>
                  <span className="history-item__confidence">
                    {item.confidence != null ? `${Math.round(item.confidence * 100)}%` : '—'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function getMostFrequent(arr) {
  if (!arr.length) return null;
  const counts = {};
  arr.forEach((v) => {
    if (!v) return;
    counts[v] = (counts[v] || 0) + 1;
  });
  const entries = Object.entries(counts);
  if (!entries.length) return null;
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}

function weatherIcon(condition = '') {
  const c = condition.toLowerCase();
  if (c.includes('rain')) return '🌧️';
  if (c.includes('cloud')) return '☁️';
  if (c.includes('clear') || c.includes('sun')) return '☀️';
  if (c.includes('storm')) return '⛈️';
  return '⛅';
}