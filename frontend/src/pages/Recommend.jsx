import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import SoilForm from '../components/SoilForm';
import RecommendationCard from '../components/RecommendationCard';
import { submitSoilData } from '../api/apiClient';

export default function Recommend() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handlePredict(values) {
    setLoading(true);
    try {
      const res = await submitSoilData(values);
      setResult(res.data);
    } catch (err) {
      console.error('Prediction failed', err);
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
        <RecommendationCard crop={result?.crop} confidence={result?.confidence} loading={false} />
      </div>
    </AppLayout>
  );
}