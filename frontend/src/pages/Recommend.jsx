import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import SoilForm from '../components/SoilForm';
import RecommendationCard from '../components/RecommendationCard';
import { submitSoilData } from '../api/apiClient';

export default function Recommend() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handlePredict(values) {
    setLoading(true);
    setError('');
    try {
      const res = await submitSoilData(values);
      setResult(res.data);
    } catch (err) {
      const data = err.response?.data;
      const fieldErrors = data?.errors ? Object.values(data.errors).flat() : [];
      setError(fieldErrors[0] || data?.error || 'Prediction failed. Please try again.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout>
      <h1 className="mb-1.5 font-display text-[1.5rem] text-slate-900">Recommend a crop</h1>
      <p className="mb-6 text-[0.9rem] text-slate-600">
        Enter your soil's N, P, K and pH values along with current weather to get a recommendation.
      </p>

      <div className="max-w-[560px] rounded-[18px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)]">
        <SoilForm onSubmit={handlePredict} loading={loading} />
        {error && (
          <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}
        <RecommendationCard crop={result?.crop} confidence={result?.confidence} loading={false} />
      </div>
    </AppLayout>
  );
}

function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M20 4c-7.2.2-12 2.6-14.5 7.1-1.7 3-1.5 6.2.2 7.9 1.8 1.8 5 1.5 8-.2 4.4-2.5 6.4-7.4 6.3-14.8Z" />
      <path d="M5 19c3.1-4.7 6.8-8 11.3-9.9" />
    </svg>
  );
}
