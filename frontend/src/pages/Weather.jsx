import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import '../components/Dashboard.css';
import { getCurrentWeather } from '../api/apiClient';

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentWeather()
      .then((res) => setWeather(res.data))
      .catch(() => setWeather(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 6 }}>Weather</h1>
      <p style={{ color: 'var(--ink-600)', fontSize: '0.9rem', marginBottom: 24 }}>
        Current conditions used to auto-fill temperature and humidity in your predictions.
      </p>

      <div className="panel" style={{ maxWidth: 420 }}>
        {loading ? (
          <p style={{ color: 'var(--ink-600)', fontSize: '0.88rem' }}>Loading weather…</p>
        ) : !weather ? (
          <p style={{ color: 'var(--ink-600)', fontSize: '0.88rem' }}>
            Could not load weather right now.
          </p>
        ) : (
          <div className="stat-row" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 0 }}>
            <div className="stat-card">
              <span className="stat-card__chip b-temp" />
              <p className="stat-card__label">Temperature</p>
              <p className="stat-card__value">{Math.round(weather.temperature)}<span className="stat-card__unit">°C</span></p>
            </div>
            <div className="stat-card">
              <span className="stat-card__chip b-humidity" />
              <p className="stat-card__label">Humidity</p>
              <p className="stat-card__value">{Math.round(weather.humidity)}<span className="stat-card__unit">%</span></p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}