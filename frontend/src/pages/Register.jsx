import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import FormField from '../components/FormField';
import { registerUser } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
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
    if (!form.username.trim()) {
      errors.username = 'Enter your username.';
    } else if (form.username.trim().length > 100) {
      errors.username = 'Username must be 100 characters or fewer.';
    }

    if (!form.password) {
      errors.password = 'Create a password.';
    } else if (form.password.length < 6) {
      errors.password = 'Use at least 6 characters.';
    }

    if (form.confirmPassword !== form.password) {
      errors.confirmPassword = 'Passwords do not match.';
    }

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
      const response = await registerUser({
        username: form.username,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      const serverError = err.response?.data?.error || '';
      if (err.response?.status === 409 && serverError.toLowerCase().includes('username')) {
        setBannerError('That username is already taken.');
      } else {
        setBannerError('Could not create your account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create your account"
    >
      <form onSubmit={handleSubmit} noValidate>
        {bannerError && <div className="mb-4 rounded-[8px] border border-red-200 bg-red-50 px-3 py-2.5 text-[0.85rem] text-red-500">{bannerError}</div>}

        <FormField
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Enter your username"
          error={fieldErrors.username}
          autoComplete="username"
        />

        <FormField
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="At least 6 characters"
          error={fieldErrors.password}
          autoComplete="new-password"
        />

        <FormField
          label="Confirm password"
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
        />

        <button type="submit" className="mt-1.5 w-full rounded-[10px] bg-gradient-to-b from-[#55A89B] to-[#2F8C7F] px-4 py-3 text-[0.92rem] font-semibold text-white shadow-[0_2px_6px_rgba(47,140,127,0.2)] transition duration-150 ease-out hover:brightness-[0.96] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60" disabled={loading}>
          {loading ? 'Creating account…' : 'Sign up'}
        </button>

        <p className="mt-5 text-center text-[0.86rem] text-slate-600">
          Already have an account? <Link to="/login" className="font-semibold text-emerald-600 hover:underline">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
