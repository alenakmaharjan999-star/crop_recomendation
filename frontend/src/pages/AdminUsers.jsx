import { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { users } from '../data/adminData';

export default function AdminUsers() {
  const [selectedUser, setSelectedUser] = useState(null);

  function openModal(user) {
    setSelectedUser(user);
  }

  function closeModal() {
    setSelectedUser(null);
  }

  return (
    <AdminLayout>
      <div className="mb-7">
        <div>
          <h1 className="font-display text-[1.5rem] text-slate-900">User management</h1>
          <p className="mt-1 text-[0.88rem] text-slate-600">Manage registered users and account status</p>
        </div>
      </div>

      <div className="rounded-[18px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-2.5">
          {users.map((user) => (
            <div key={user.id} className="flex items-start justify-between rounded-[10px] border border-slate-200 bg-white px-3.5 py-3">
              <div>
                <p className="text-[0.92rem] font-semibold text-slate-900">{user.name}</p>
                <p className="mt-0.5 text-[0.74rem] text-slate-600">{user.email} · {user.role} · Last login {user.lastLogin}</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-[0.8rem] font-semibold text-emerald-600">{user.status}</span>
                <div className="mt-1.5">
                  <button
                    className="rounded-[10px] bg-gradient-to-b from-[#55A89B] to-[#2F8C7F] px-3 py-2 text-[0.8rem] font-semibold text-white shadow-[0_2px_6px_rgba(47,140,127,0.2)] transition duration-150 ease-out hover:brightness-[0.96]"
                    onClick={() => openModal(user)}
                  >
                    Manage
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedUser && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[rgba(43,32,24,0.55)] p-5"
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[480px] rounded-[12px] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="mb-1 font-display text-[1.1rem] text-slate-900">{selectedUser.name}</h3>
                <p className="text-[0.9rem] text-slate-600">{selectedUser.email}</p>
              </div>
              <button className="rounded-[10px] bg-gradient-to-b from-[#55A89B] to-[#2F8C7F] px-3 py-2 text-[0.8rem] font-semibold text-white shadow-[0_2px_6px_rgba(47,140,127,0.2)] transition duration-150 ease-out hover:brightness-[0.96]" onClick={closeModal}>
                Close
              </button>
            </div>

            <div className="mb-4 grid gap-2.5">
              <div>
                <p className="mb-1 text-[0.8rem] text-slate-600">Role</p>
                <p className="font-semibold text-slate-900">{selectedUser.role}</p>
              </div>
              <div>
                <p className="mb-1 text-[0.8rem] text-slate-600">Status</p>
                <p className="font-semibold text-slate-900">{selectedUser.status}</p>
              </div>
              <div>
                <p className="mb-1 text-[0.8rem] text-slate-600">Last login</p>
                <p className="font-semibold text-slate-900">{selectedUser.lastLogin}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2.5">
              <button className="rounded-[10px] bg-gradient-to-b from-[#55A89B] to-[#2F8C7F] px-3 py-2 text-[0.8rem] font-semibold text-white shadow-[0_2px_6px_rgba(47,140,127,0.2)] transition duration-150 ease-out hover:brightness-[0.96]">
                Activate
              </button>
              <button className="rounded-[10px] bg-gradient-to-b from-[#55A89B] to-[#2F8C7F] px-3 py-2 text-[0.8rem] font-semibold text-white shadow-[0_2px_6px_rgba(47,140,127,0.2)] transition duration-150 ease-out hover:brightness-[0.96]">
                Reset password
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
