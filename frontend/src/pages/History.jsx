import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import '../components/Dashboard.css';
import { getRecommendationHistory } from '../api/apiClient';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecommendationHistory()
      .then((res) => setHistory(res.data || []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 6 }}>History</h1>
      <p style={{ color: 'var(--ink-600)', fontSize: '0.9rem', marginBottom: 24 }}>
        All your past soil readings and the crops recommended for them.
      </p>

      <div className="panel">
        {loading ? (
          <p style={{ color: 'var(--ink-600)', fontSize: '0.88rem' }}>Loading history…</p>
        ) : history.length === 0 ? (
          <p style={{ color: 'var(--ink-600)', fontSize: '0.88rem' }}>
            No predictions yet. Go to Recommend crop to get started.
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
                    {' · '}{item.temperature}°C · {item.humidity}% humidity · {item.rainfall}mm rain
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
    </AppLayout>
  );
}