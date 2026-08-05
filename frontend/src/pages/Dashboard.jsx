import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import StatCard from '../components/StatCard';
import RecommendationCard from '../components/RecommendationCard';
import SoilForm from '../components/SoilForm';
import { useAuth } from '../context/AuthContext';
import {
  submitSoilData,
  getRecommendationHistory,
  getCurrentWeather,
} from '../api/apiClient';

// Use the image from the public folder
const cropBg = '/crop_pic.jpg';

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
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-[1.5rem] text-slate-900">Grow Smarter, Harvest Better</h1>
          <p className="mt-1 text-[0.88rem] text-slate-600">{today}</p>
        </div>

        <div className="flex items-center gap-3 rounded-[14px] border border-slate-200 bg-white px-4 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)]">
          <span className="text-[1.6rem]">{weather ? weatherIcon(weather.condition) : '⛅'}</span>
          <div>
            <p className="font-display text-[1.3rem] font-semibold text-slate-900">
              {weather ? `${Math.round(weather.temperature)}°C` : '—'}
            </p>
            <p className="text-[0.74rem] leading-[1.4] text-slate-600">
              Kathmandu{weather ? ` · ${weather.condition}` : ' · loading…'}
            </p>
          </div>
        </div>
</div>
      <div className="mb-7 grid gap-4 md:grid-cols-3">
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

      <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div className="rounded-[18px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)]">
          <h3 className="mb-1 font-display text-[1.1rem] text-slate-900">Get a recommendation</h3>
          <p className="mb-4 text-[0.84rem] text-slate-600">
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

        <div className="rounded-[18px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)]">
          <h3 className="mb-1 font-display text-[1.1rem] text-slate-900">Recent history</h3>
          <p className="mb-4 text-[0.84rem] text-slate-600">Your last predictions, most recent first.</p>

          {loadingHistory ? (
            <p className="text-[0.88rem] text-slate-600">Loading history…</p>
          ) : history.length === 0 ? (
            <p className="text-[0.88rem] text-slate-600">
              No predictions yet. Submit the form to see your history here.
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