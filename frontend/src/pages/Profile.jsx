import AppLayout from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <h1 className="mb-1.5 font-display text-[1.5rem] text-slate-900">Profile</h1>
      <p className="mb-6 text-[0.9rem] text-slate-600">Your account details.</p>

      <div className="max-w-[420px] rounded-[18px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)]">
        <div className="mb-[18px] flex flex-col">
          <span className="mb-1.5 text-[0.82rem] font-medium text-slate-700">Full name</span>
          <p className="text-[0.95rem] text-slate-900">{user?.fullName || '—'}</p>
        </div>
        <div className="flex flex-col">
          <span className="mb-1.5 text-[0.82rem] font-medium text-slate-700">Email</span>
          <p className="text-[0.95rem] text-slate-900">{user?.email || '—'}</p>
        </div>
      </div>
    </AppLayout>
  );
}