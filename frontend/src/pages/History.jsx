import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
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
      <h1 className="mb-1.5 font-display text-[1.5rem] text-slate-900">History</h1>
      <p className="mb-6 text-[0.9rem] text-slate-600">
        All your past soil readings and the crops recommended for them.
      </p>

      <div className="rounded-[18px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)]">
        {loading ? (
          <p className="text-[0.88rem] text-slate-600">Loading history…</p>
        ) : history.length === 0 ? (
          <p className="text-[0.88rem] text-slate-600">
            No predictions yet. Go to Recommend crop to get started.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {history.map((item, idx) => (
              <div className="flex items-center justify-between rounded-[10px] border border-slate-200 bg-white px-3.5 py-3" key={item.id || idx}>
                <div>
                  <p className="text-[0.92rem] font-semibold text-slate-900">{item.crop}</p>
                  <p className="mt-0.5 text-[0.74rem] text-slate-600">
                    {item.date ? new Date(item.date).toLocaleDateString() : '—'}
                    {' · '}N {item.nitrogen} P {item.phosphorus} K {item.potassium} · pH {item.ph}
                    {' · '}{item.temperature}°C · {item.humidity}% humidity · {item.rainfall}mm rain
                  </p>
                </div>
                <span className="font-mono text-[0.8rem] font-semibold text-emerald-600">
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