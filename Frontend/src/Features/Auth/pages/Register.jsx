import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const navigate = useNavigate();
  const { user, loading, error, handleRegister, clearError } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "Empty",
    color: "text-zinc-600",
  });

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && user.verified) {
      navigate("/");
    }
  }, [user, navigate]);

  // Clear errors on mount
  useEffect(() => {
    clearError();
  }, []);

  const evaluatePasswordStrength = (pass) => {
    if (!pass) {
      return { score: 0, label: "Empty", color: "text-zinc-600" };
    }
    if (pass.length < 6) {
      return { score: 1, label: "Weak", color: "text-red-400" };
    }
    
    let strength = 2;
    let label = "Medium";
    let color = "text-yellow-500";

    const hasUpper = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);

    if (pass.length >= 8 && hasUpper && hasNumber && hasSpecial) {
      strength = 3;
      label = "Strong";
      color = "text-emerald-400";
    }

    return { score: strength, label, color };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setValidationError("");
    clearError();

    if (name === "password") {
      setPasswordStrength(evaluatePasswordStrength(value));
    }
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setValidationError("Username is required");
      return false;
    }
    if (formData.username.length < 3) {
      setValidationError("Username must be at least 3 characters");
      return false;
    }
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
    if (formData.password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await handleRegister({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      setIsSuccess(true);
    } catch (err) {
      // Handled by hook error state
    }
  };

  if (isSuccess) {
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

          <h2 className="text-xl font-display font-medium text-zinc-50 mb-2">Check your email</h2>
          <p className="text-zinc-400 text-xs leading-relaxed mb-6">
            A verification link has been sent to <span className="text-zinc-200 font-semibold">{formData.email}</span>. Click the link inside the email to verify and activate your account.
          </p>

          <Link
            to="/login"
            className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-medium py-3 rounded-xl text-sm transition-all duration-150 active:scale-[0.98] flex items-center justify-center"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

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
          Create Account
        </h1>
        <p className="text-xs text-zinc-500 mb-6">
          Sign up to begin exploring global knowledge with AI
        </p>

        {/* Error Alert */}
        {(validationError || error) && (
          <div className="border border-red-900/30 bg-red-950/10 text-red-400 p-3.5 rounded-xl text-xs mb-5 font-medium leading-relaxed">
            {validationError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="flex flex-col">
            <label htmlFor="username" className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="alex_dev"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              className="bg-transparent border border-zinc-900 hover:border-zinc-800 focus:border-zinc-100 rounded-xl py-2.5 px-3 text-sm focus:outline-none text-zinc-100 placeholder:text-zinc-700 transition-colors w-full disabled:opacity-50"
              required
            />
          </div>

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
              {formData.password && (
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${passwordStrength.color}`}>
                  {passwordStrength.label}
                </span>
              )}
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
              "Sign Up"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-zinc-500 font-medium">
          Already have an account?{" "}
          <Link to="/login" className="text-zinc-300 hover:underline transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
