import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
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
      <h1 className="mb-1.5 font-display text-[1.5rem] text-slate-900">Weather</h1>
      <p className="mb-6 text-[0.9rem] text-slate-600">
        Current conditions used to auto-fill temperature and humidity in your predictions.
      </p>

      <div className="max-w-[420px] rounded-[18px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)]">
        {loading ? (
          <p className="text-[0.88rem] text-slate-600">Loading weather…</p>
        ) : !weather ? (
          <p className="text-[0.88rem] text-slate-600">Could not load weather right now.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)]">
              <span className="absolute inset-y-0 left-0 w-1 bg-[#D4915C]" />
              <p className="mb-2 text-[0.78rem] text-slate-600">Temperature</p>
              <p className="font-display text-[1.7rem] font-semibold text-slate-900">
                {Math.round(weather.temperature)}
                <span className="ml-1 text-[0.95rem] font-medium text-slate-600">°C</span>
              </p>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)]">
              <span className="absolute inset-y-0 left-0 w-1 bg-[#7BA888]" />
              <p className="mb-2 text-[0.78rem] text-slate-600">Humidity</p>
              <p className="font-display text-[1.7rem] font-semibold text-slate-900">
                {Math.round(weather.humidity)}
                <span className="ml-1 text-[0.95rem] font-medium text-slate-600">%</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}