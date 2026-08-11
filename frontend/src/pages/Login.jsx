import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";

import { loginUser } from "../api/apiClient";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [bannerError, setBannerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (bannerError) {
      setBannerError("");
    }
  };

  const validate = () => {
    const errors = {};

    if (!form.username.trim()) {
      errors.username = "Please enter your username.";
    }

    if (!form.password.trim()) {
      errors.password = "Please enter your password.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser({
        username: form.username,
        password: form.password,
      });

      login(response.data.token, response.data.user);

      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 401) {
        setBannerError("Incorrect username or password.");
      } else {
        setBannerError("Unable to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome Back"
      title="Sign In"
    >
      <form onSubmit={handleSubmit} noValidate>

        {bannerError && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {bannerError}
          </div>
        )}

        <FormField
          label="Username"
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Enter your username"
          autoComplete="username"
          required
          error={fieldErrors.username}
        />

        <FormField
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          error={fieldErrors.password}
        />

        <div className="mb-6 flex items-center justify-between">

          <label className="flex items-center gap-2 text-sm text-slate-600">

            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />

            Remember me

          </label>

          <Link
            to="/forgot-password"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            Forgot Password?
          </Link>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-600 py-3 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <div className="mt-6 text-center">

          <p className="text-sm text-slate-600">

            Don't have an account?{" "}

            <Link
              to="/signup"
              className="font-semibold text-emerald-600 hover:underline"
            >
              Sign Up
            </Link>

          </p>

        </div>

      </form>
    </AuthLayout>
  );
}