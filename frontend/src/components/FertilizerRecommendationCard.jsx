import { Sprout } from 'lucide-react';

export default function FertilizerRecommendationCard({ fertilizer }) {
  const recommendation = fertilizer?.recommendation;
  const deficit = recommendation?.deficientNutrients ?? fertilizer?.deficit;
  const rate = recommendation?.applicationRateKgPerHa ?? recommendation?.application_rate_kg_per_ha;
  const npk = recommendation?.npk ?? recommendation?.n_p_k;

  return (
    <section className="rounded-[18px] border border-emerald-200 bg-emerald-50/50 p-5" aria-live="polite">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Sprout size={20} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-[1.05rem] text-slate-900">Fertilizer recommendation</h3>
          <p className="mt-0.5 text-sm text-slate-600">
            {fertilizer?.crop
              ? `Based on the soil NPK readings and the recommended ${fertilizer.crop}.`
              : 'Your fertilizer recommendation will appear after a crop prediction.'}
          </p>
        </div>
      </div>
      {recommendation?.name ? (
        <div className="mt-4 rounded-xl border border-emerald-100 bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Recommended fertilizer</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{recommendation.name}</p>
          {(npk || rate != null) && <p className="mt-1 text-sm text-slate-600">{npk && `NPK grade: ${npk}`}{npk && rate != null && ' · '}{rate != null && `Suggested rate: ${rate} kg/ha`}</p>}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-600">
          {fertilizer ? 'The server did not return a fertilizer recommendation for this crop.' : 'Submit the soil and location form first. The same soil NPK readings will be used for the fertilizer recommendation.'}
        </div>
      )}
      {deficit && <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        {['N', 'P', 'K'].map((nutrient) => <div className="rounded-lg border border-emerald-100 bg-white px-2 py-2" key={nutrient}>
          <p className="text-xs text-slate-500">{nutrient} deficit</p>
          <p className="mt-0.5 font-mono text-sm font-semibold text-slate-800">{formatValue(deficit[nutrient])}</p>
        </div>)}
      </div>}
    </section>
  );
}

function formatValue(value) {
  return typeof value === 'number' ? value.toLocaleString() : '—';
}
