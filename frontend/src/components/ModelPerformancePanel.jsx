const METRICS = [['Accuracy', 'accuracy'], ['Precision', 'precision'], ['Recall', 'recall'], ['F1 score', 'f1Score']];

export default function ModelPerformancePanel({ performance }) {
  if (!performance) return null;
  const matrix = performance.confusionMatrix;
  const labels = Array.isArray(matrix?.labels) ? matrix.labels : [];
  const rows = Array.isArray(matrix?.matrix) ? matrix.matrix : [];
  const maximum = Math.max(1, ...rows.flat().filter(Number.isFinite));
  const metricEntries = METRICS.filter(([, key]) => Number.isFinite(performance[key]));

  return <div className="space-y-3">
    {metricEntries.length > 0 && <div className="grid gap-3 sm:grid-cols-2">
      {metricEntries.map(([label, key]) => <div className="rounded-xl border border-slate-200 bg-white p-4" key={key}>
        <p className="text-sm text-slate-600">{label}</p><p className="mt-1 font-mono text-2xl font-bold text-slate-900">{toPercent(performance[key])}</p>
      </div>)}
    </div>}
    {(performance.totalSamples != null || performance.nClasses != null) && <p className="text-sm text-slate-600">{performance.totalSamples != null && `${performance.totalSamples.toLocaleString()} evaluated samples`}{performance.totalSamples != null && performance.nClasses != null && ' · '}{performance.nClasses != null && `${performance.nClasses} classes`}</p>}
    {labels.length > 0 && rows.length > 0 && <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-max w-full border-collapse text-sm">
        <caption className="caption-top px-4 py-3 text-left text-sm text-slate-600">Confusion matrix — rows are actual crops; columns are predicted crops.</caption>
        <thead><tr className="border-y border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500"><th className="sticky left-0 bg-slate-50 px-4 py-3 font-semibold">Actual / predicted</th>{labels.map((label) => <th className="px-4 py-3 text-center font-semibold" key={label}>{label}</th>)}</tr></thead>
        <tbody>{rows.map((row, rowIndex) => <tr className="border-b border-slate-100 last:border-0" key={labels[rowIndex] ?? rowIndex}><th className="sticky left-0 bg-white px-4 py-3 text-left font-semibold text-slate-700">{labels[rowIndex] ?? `Class ${rowIndex + 1}`}</th>{labels.map((label, columnIndex) => { const value = Number(row?.[columnIndex]) || 0; return <td className="px-4 py-3 text-center font-mono font-medium text-slate-800" style={{ backgroundColor: `rgba(16, 185, 129, ${0.06 + (value / maximum) * 0.34})` }} key={label}>{value}</td>; })}</tr>)}</tbody>
      </table>
    </div>}
  </div>;
}

function toPercent(value) {
  return `${Math.round((value > 1 ? value / 100 : value) * 100)}%`;
}
