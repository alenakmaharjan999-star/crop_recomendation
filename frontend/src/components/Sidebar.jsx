import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/recommend', label: 'Recommend crop', icon: '🌾' },
  { to: '/history', label: 'History', icon: '🕒' },
  { to: '/weather', label: 'Weather', icon: '⛅' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">🌱 E-Krishi</div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
          >
            <span className="sidebar__icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__user">
        <div className="sidebar__avatar">{initials}</div>
        <div className="sidebar__user-info">
          <p className="sidebar__user-name">{user?.fullName || 'User'}</p>
          <button className="sidebar__logout" onClick={handleLogout}>Log out</button>
        </div>
      </div>
    </aside>
  );
}