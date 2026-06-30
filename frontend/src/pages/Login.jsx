import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import FormField from '../components/FormField';
import '../components/Forms.css';
import { loginUser } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [bannerError, setBannerError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errors = {};
    if (!form.email.trim()) errors.email = 'Enter your email.';
    if (!form.password) errors.password = 'Enter your password.';
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBannerError('');

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ email: form.email, password: form.password });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setBannerError('Incorrect email or password.');
      } else {
        setBannerError('Could not sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in"
      subtitle="Sign in to see your latest crop recommendation."
    >
      <form onSubmit={handleSubmit} noValidate>
        {bannerError && <div className="form-banner-error">{bannerError}</div>}

        <FormField
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          error={fieldErrors.email}
          autoComplete="email"
        />

        <FormField
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          error={fieldErrors.password}
          autoComplete="current-password"
        />

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </AuthLayout>
  );
}