import AdminLayout from '../components/AdminLayout';
import { settings } from '../data/adminData';

export default function AdminSettings() {
  return (
    <AdminLayout>
      <div className="mb-7">
        <div>
          <h1 className="font-display text-[1.5rem] text-slate-900">Admin settings</h1>
          <p className="mt-1 text-[0.88rem] text-slate-600">Core platform preferences and operational controls</p>
        </div>
      </div>

      <div className="rounded-[18px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-2.5">
          {settings.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-[10px] border border-slate-200 bg-white px-3.5 py-3">
              <div>
                <p className="text-[0.92rem] font-semibold text-slate-900">{item.title}</p>
                <p className="mt-0.5 text-[0.74rem] text-slate-600">{item.description}</p>
              </div>
              <button className="rounded-[10px] bg-gradient-to-b from-[#55A89B] to-[#2F8C7F] px-3 py-2 text-[0.8rem] font-semibold text-white shadow-[0_2px_6px_rgba(47,140,127,0.2)] transition duration-150 ease-out hover:brightness-[0.96]">
                {item.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
