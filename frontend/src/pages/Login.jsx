import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import FormField from '../components/FormField';
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
        {bannerError && <div className="mb-4 rounded-[8px] border border-red-200 bg-red-50 px-3 py-2.5 text-[0.85rem] text-red-500">{bannerError}</div>}

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

        <button type="submit" className="mt-1.5 w-full rounded-[10px] bg-gradient-to-b from-[#55A89B] to-[#2F8C7F] px-4 py-3 text-[0.92rem] font-semibold text-white shadow-[0_2px_6px_rgba(47,140,127,0.2)] transition duration-150 ease-out hover:brightness-[0.96] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="mt-5 text-center text-[0.86rem] text-slate-600">
          Don't have an account? <Link to="/signup" className="font-semibold text-emerald-600 hover:underline">Sign up</Link>
        </p>
      </form>
    </AuthLayout>
  );
}