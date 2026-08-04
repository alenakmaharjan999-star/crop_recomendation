export default function RecommendationCard({ crop, confidence, loading, className = '' }) {
  const classes = `recommendation-card ${className}`.trim();

  if (loading) {
    return (
      <div className={`${classes} recommendation-card--loading`}>
        <p>Loading your latest recommendation...</p>
      </div>
    );
  }

  if (!crop) {
    return (
      <div className={`${classes} recommendation-card--empty`}>
        <span className="recommendation-card__icon" aria-hidden="true">
          <LeafIcon />
        </span>
        <p className="recommendation-card__empty-title">No recommendation yet</p>
        <p className="recommendation-card__empty-text">
          Enter your soil readings to get your first crop recommendation.
        </p>
      </div>
    );
  }

  return (
    <div className={classes}>
      <span className="recommendation-card__badge">
        <LeafIcon />
        Recommended crop
      </span>
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

function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M20.6 3.4c-7.8.1-13 2.7-15.6 7.8-1.6 3.1-1.4 6.2.2 8.1 1.9 1.9 5.2 1.6 8.2-.2 4.9-2.8 7.1-8 7.2-15.7Z" />
      <path d="M4.7 19.3c3.2-4.9 7.1-8.3 11.8-10.2" />
    </svg>
  );
}
