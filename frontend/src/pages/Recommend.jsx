import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import SoilForm from '../components/SoilForm';
import RecommendationCard from '../components/RecommendationCard';
import '../components/Dashboard.css';
import './Recommend.css';
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
    <AppLayout mainClassName="app-layout__main--farm">
      <section className="recommend-page">
        <div className="recommend-page__backdrop" />
        <div className="recommend-page__content">
          <div className="recommend-page__intro">
            <span className="farm-badge">
              <LeafIcon />
              Smart field advisory
            </span>
            <h1>Recommend a crop</h1>
            <p>
              Blend soil nutrients, pH, and field location into a clear crop recommendation
              for your next planting decision.
            </p>
          </div>

          <div className="recommend-page__grid">
            <div className="farm-glass-card recommend-form-card">
              <div className="farm-card-heading">
                <span className="farm-card-heading__icon">NPK</span>
                <div>
                  <h2>Field readings</h2>
                  <p>Enter soil values and detect or paste your field coordinates.</p>
                </div>
              </div>
              <SoilForm onSubmit={handlePredict} loading={loading} />
            </div>

            <RecommendationCard
              className="farm-glass-card recommend-result-card"
              crop={result?.crop}
              confidence={result?.confidence}
              loading={false}
            />
          </div>
        </div>
      </section>
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
