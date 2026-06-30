import AppLayout from '../components/AppLayout';
import '../components/Dashboard.css';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 6 }}>Profile</h1>
      <p style={{ color: 'var(--ink-600)', fontSize: '0.9rem', marginBottom: 24 }}>
        Your account details.
      </p>

      <div className="panel" style={{ maxWidth: 420 }}>
        <div className="form-field">
          <span className="form-field__label">Full name</span>
          <p style={{ fontSize: '0.95rem' }}>{user?.fullName || '—'}</p>
        </div>
        <div className="form-field">
          <span className="form-field__label">Email</span>
          <p style={{ fontSize: '0.95rem' }}>{user?.email || '—'}</p>
        </div>
      </div>
    </AppLayout>
  );
}