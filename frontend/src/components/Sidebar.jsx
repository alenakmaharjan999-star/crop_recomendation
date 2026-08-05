import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Sprout,
  History,
  CloudSun,
  UserCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/recommend', label: 'Recommend crop', icon: Sprout },
  { to: '/history', label: 'History', icon: History },
  { to: '/weather', label: 'Weather', icon: CloudSun },
  { to: '/profile', label: 'Profile', icon: UserCircle },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const displayName = user?.fullName || user?.username || 'User';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <aside className="sticky top-0 flex min-h-screen w-56 flex-col border-r border-slate-200 bg-white px-4 py-6 text-slate-900 shadow-[0_1px_0_rgba(15,23,42,0.04),0_12px_30px_rgba(15,23,42,0.05)] lg:w-60">
      <div className="mb-8 flex items-center gap-2 px-2.5 font-display text-[1.05rem] font-semibold text-slate-900">
        <span className="flex items-center">
          <Sprout size={28} strokeWidth={2} color="#22c55e" />
        </span>
        E-Krishi
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition duration-150 ease-out',
                  isActive
                    ? 'bg-blue-50 text-emerald-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                ].join(' ')
              }
            >
              <span className="text-base leading-none">
                <Icon size={20} strokeWidth={2} />
              </span>
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-3 flex items-center gap-2.5 border-t border-slate-200/80 px-2.5 pt-3.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[0.78rem] font-bold text-emerald-600">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[0.82rem] font-semibold text-slate-900">{displayName}</p>
          <button className="mt-0.5 text-[0.74rem] text-emerald-600 hover:underline" onClick={handleLogout}>Log out</button>
        </div>
      </div>
    </aside>
  );
}