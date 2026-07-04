export default function StatCard({ label, value, unit, bandClass }) {
  return (
    <div className="stat-card">
      <span className={`stat-card__chip ${bandClass}`} />
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">
        {value}
        {unit && <span className="stat-card__unit">{unit}</span>}
      </p>
    </div>
  );
}