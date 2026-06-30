import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import SoilForm from '../components/SoilForm';
import RecommendationCard from '../components/RecommendationCard';
import '../components/Dashboard.css';
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
      <h1 style={{ fontSize: '1.5rem', marginBottom: 6 }}>Recommend a crop</h1>
      <p style={{ color: 'var(--ink-600)', fontSize: '0.9rem', marginBottom: 24 }}>
        Enter your soil's N, P, K and pH values along with current weather to get a recommendation.
      </p>

      <div className="panel" style={{ maxWidth: 560 }}>
        <SoilForm onSubmit={handlePredict} loading={loading} />
        <RecommendationCard crop={result?.crop} confidence={result?.confidence} loading={false} />
      </div>
    </AppLayout>
  );
}