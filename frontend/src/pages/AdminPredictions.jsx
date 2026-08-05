import AdminLayout from '../components/AdminLayout';
import { predictions } from '../data/adminData';

export default function AdminPredictions() {
  return (
    <AdminLayout>
      <div className="mb-7">
        <div>
          <h1 className="font-display text-[1.5rem] text-slate-900">Prediction review</h1>
          <p className="mt-1 text-[0.88rem] text-slate-600">Recent recommendations and confidence scores</p>
        </div>
      </div>

      <div className="rounded-[18px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-2.5">
          {predictions.map((item) => (
            <div key={item.id} className="flex items-start justify-between rounded-[10px] border border-slate-200 bg-white px-3.5 py-3">
              <div>
                <p className="text-[0.92rem] font-semibold text-slate-900">{item.crop}</p>
                <p className="mt-0.5 text-[0.74rem] text-slate-600">{item.user} · {item.date} · Confidence {Math.round(item.confidence * 100)}%</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-[0.8rem] font-semibold text-emerald-600">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
