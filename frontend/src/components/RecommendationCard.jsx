export default function RecommendationCard({ crop, confidence, loading }) {
  if (loading) {
    return (
      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
        <p>Loading your latest recommendation…</p>
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center text-slate-600">
        <p className="mb-1 font-semibold text-slate-800">No recommendation yet</p>
        <p className="text-[0.85rem]">Enter your soil readings to get your first crop recommendation.</p>
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="mb-1.5 font-mono text-[0.68rem] uppercase tracking-[0.06em] text-emerald-600">Recommended crop</p>
      <h2 className="mb-3 font-display text-[1.6rem] font-semibold text-slate-900">{crop}</h2>
      {confidence != null && (
        <div>
          <div className="mb-1.5 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-emerald-600"
              style={{ width: `${Math.round(confidence * 100)}%` }}
            />
          </div>
          <span className="text-[0.78rem] text-slate-600">
            {Math.round(confidence * 100)}% confidence
          </span>
        </div>
      )}
    </div>
  );
}