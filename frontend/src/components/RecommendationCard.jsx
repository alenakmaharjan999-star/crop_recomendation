export default function RecommendationCard({ crop, confidence, loading }) {
  if (loading) {
    return (
      <div className="recommendation-card recommendation-card--loading">
        <p>Loading your latest recommendation…</p>
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="recommendation-card recommendation-card--empty">
        <p className="recommendation-card__empty-title">No recommendation yet</p>
        <p className="recommendation-card__empty-text">
          Enter your soil readings to get your first crop recommendation.
        </p>
      </div>
    );
  }

  return (
    <div className="recommendation-card">
      <p className="recommendation-card__eyebrow">Recommended crop</p>
      <h2 className="recommendation-card__crop">{crop}</h2>
      {confidence != null && (
        <div className="recommendation-card__confidence">
          <div className="confidence-bar">
            <div
              className="confidence-bar__fill"
              style={{ width: `${Math.round(confidence * 100)}%` }}
            />
          </div>
          <span className="confidence-bar__label">
            {Math.round(confidence * 100)}% confidence
          </span>
        </div>
      )}
    </div>
  );
}