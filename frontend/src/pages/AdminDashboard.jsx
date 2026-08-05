import AdminLayout from '../components/AdminLayout';
import AdminCard from '../components/AdminCard';
import { adminStats, recentActivities } from '../data/adminData';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="mb-7">
        <div>
          <h1 className="font-display text-[1.5rem] text-slate-900">Admin overview</h1>
          <p className="mt-1 text-[0.88rem] text-slate-600">Key platform health indicators</p>
        </div>
      </div>

      <div className="mb-7 grid gap-4 md:grid-cols-3">
        {adminStats.slice(0, 3).map((item) => (
          <AdminCard key={item.id} title={item.label} value={item.value} description={item.description} accent={item.bandClass} />
        ))}
      </div>

      <div className="rounded-[18px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)]">
        <h3 className="mb-1 font-display text-[1.1rem] text-slate-900">Recent activity</h3>
        <p className="mb-4 text-[0.84rem] text-slate-600">Latest system events and account updates</p>
        <div className="flex flex-col gap-2.5">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between rounded-[10px] border border-slate-200 bg-white px-3.5 py-3">
              <div>
                <p className="text-[0.92rem] font-semibold text-slate-900">{activity.title}</p>
                <p className="mt-0.5 text-[0.74rem] text-slate-600">{activity.detail}</p>
              </div>
              <span className="font-mono text-[0.8rem] font-semibold text-emerald-600">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
