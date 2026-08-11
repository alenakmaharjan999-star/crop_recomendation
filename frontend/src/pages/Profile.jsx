import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { getRecommendationHistory } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const email = getUserEmail(user);

  useEffect(() => {
    getRecommendationHistory()
      .then((res) => setHistory(res.data || []))
      .catch(() => setHistory([]))
      .finally(() => setLoadingHistory(false));
  }, []);

  return (
    <AppLayout>
      <h1 className="mb-1.5 font-display text-[1.5rem] text-slate-900">Profile</h1>
      <p className="mb-6 text-[0.9rem] text-slate-600">Your account details and past crop recommendations.</p>

      <div className="max-w-[760px] rounded-[18px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)]">
        <div className="mb-6 rounded-[14px] border border-slate-200 bg-slate-50 p-4">
          <div className="mb-[18px] flex flex-col">
            <span className="mb-1.5 text-[0.82rem] font-medium text-slate-700">Full name</span>
            <p className="text-[0.95rem] text-slate-900">{user?.fullName || user?.username || '—'}</p>
          </div>
          <div className="flex flex-col">
            <span className="mb-1.5 text-[0.82rem] font-medium text-slate-700">Email</span>
            <p className="text-[0.95rem] text-slate-900">{email}</p>
          </div>
        </div>

        <div>
          <div className="mb-3">
            <h2 className="font-display text-[1.05rem] text-slate-900">Past recommendations</h2>
          </div>

          {loadingHistory ? (
            <p className="text-[0.9rem] text-slate-600">Loading recommendations…</p>
          ) : history.length === 0 ? (
            <div className="rounded-[12px] border border-dashed border-slate-200 bg-slate-50 p-4 text-[0.9rem] text-slate-600">
              No crop recommendations yet.
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {history.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="rounded-[12px] border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[0.95rem] font-semibold text-slate-900">{item.crop || '—'}</p>
                      <p className="mt-0.5 text-[0.78rem] text-slate-500">
                        {item.date ? new Date(item.date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }) : '—'}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[0.75rem] font-semibold text-emerald-700">
                      {item.confidence != null ? `${Math.round(item.confidence * 100)}% confidence` : 'Confidence pending'}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2 text-[0.78rem] text-slate-600">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1">N {item.nitrogen ?? '—'}</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1">P {item.phosphorus ?? '—'}</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1">K {item.potassium ?? '—'}</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1">pH {item.ph ?? '—'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function getUserEmail(user) {
  const candidates = [
    user?.email,
    user?.mail,
    user?.user?.email,
    user?.user?.mail,
    user?.data?.email,
    user?.data?.mail,
    user?.profile?.email,
    user?.profile?.mail,
  ];

  const found = candidates.find((value) => typeof value === 'string' && value.trim());
  return found || '—';
}