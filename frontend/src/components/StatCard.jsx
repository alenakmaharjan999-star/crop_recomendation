export default function StatCard({ label, value, unit, bandClass }) {
  const bandStyles = {
    'b-npk': 'bg-[#C7A35A]',
    'b-humidity': 'bg-[#7BA888]',
    'b-rainfall': 'bg-[#5B8AA6]',
    'b-temp': 'bg-[#D4915C]',
    'b-ph': 'bg-[#9B7BA8]',
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)] sm:p-5">
      <span className={`absolute inset-y-0 left-0 w-1 ${bandStyles[bandClass] || 'bg-slate-400'}`} />
      <p className="mb-2 text-[0.78rem] text-slate-600">{label}</p>
      <p className="font-display text-[1.7rem] font-semibold text-slate-900">
        {value}
        {unit && <span className="ml-1 text-[0.95rem] font-medium text-slate-600">{unit}</span>}
      </p>
    </div>
  );
}