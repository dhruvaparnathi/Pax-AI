import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";

export default function Login() {
  const navigate = useNavigate();
  const { user,loading } = useSelector((state) => state.auth);
  const { error, handleLogin, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Clear errors on mount
  useEffect(() => {
    clearError();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setValidationError("");
    clearError();
  };

  const validateForm = () => {
    if (!formData.email) {
      setValidationError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setValidationError("Please enter a valid email address");
      return false;
    }
    if (!formData.password) {
      setValidationError("Password is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await handleLogin({
        email: formData.email,
        password: formData.password,
      });
      navigate("/");
    } catch (err) {
      // Handled by hook error state
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 font-sans px-4">
      <div className="w-full max-w-[320px] flex flex-col">
        {/* Simple Text Logo */}
        <div className="flex items-center gap-2 mb-8">
          <svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-zinc-200">
            <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" />
            <path d="M12 20H28M20 12V28" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <span className="font-display font-bold text-lg text-zinc-100 tracking-tight">
            pax ai
          </span>
        </div>

        {/* Form Title */}
        <h1 className="text-2xl font-display font-medium tracking-tight mb-1 text-zinc-50">
          Sign In
        </h1>
        <p className="text-xs text-zinc-500 mb-6">
          Enter your credentials to access your search dashboard
        </p>

        {/* Error Alert */}
        {(validationError || error) && (
          <div className="border border-red-900/30 bg-red-950/10 text-red-400 p-3.5 rounded-xl text-xs mb-5 font-medium leading-relaxed">
            {validationError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="bg-transparent border border-zinc-900 hover:border-zinc-800 focus:border-zinc-100 rounded-xl py-2.5 px-3 text-sm focus:outline-none text-zinc-100 placeholder:text-zinc-700 transition-colors w-full disabled:opacity-50"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col relative">
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Password
              </label>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[10px] text-zinc-500 hover:text-zinc-300 font-semibold uppercase tracking-wider">
                Forgot?
              </a>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="bg-transparent border border-zinc-900 hover:border-zinc-800 focus:border-zinc-100 rounded-xl py-2.5 px-3 pr-12 text-sm focus:outline-none text-zinc-100 placeholder:text-zinc-700 transition-colors w-full disabled:opacity-50"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-500 hover:text-zinc-300 select-none uppercase tracking-wider"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-medium py-3 rounded-xl text-sm transition-all duration-150 active:scale-[0.98] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4 text-zinc-950" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-zinc-500 font-medium">
          New here?{" "}
          <Link to="/register" className="text-zinc-300 hover:underline transition-colors">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
