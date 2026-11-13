import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/auth';
import { getMyProfile } from '../api/Users'; // BUG-01 fix

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    // BUG-02 fix: client-side phone format validation
    if (!/^[+]?[0-9\s\-]{7,15}$/.test(form.phone.trim())) {
      setError('Please enter a valid phone number (7–15 digits).');
      return;
    }

    setLoading(true);
    try {
      // BUG-01 fix: backend returns JWTs on registration; use them to
      // navigate straight to the correct dashboard instead of always
      // bouncing the user back to /login.
      const data = await registerUser(form);
      if (data.access) {
        // registerUser already saved the tokens to localStorage;
        // fire the storage event so App.jsx updates its loggedIn state.
        window.dispatchEvent(new Event('storage'));
        const profile = await getMyProfile();
        if (profile.role === 'collector') {
          navigate('/collector/dashboard');
        } else if (profile.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/citizen/dashboard');
        }
      } else {
        // Fallback: tokens not returned — send to login
        navigate('/login', { state: { justRegistered: true } });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[85vh] flex items-center justify-center bg-gray-50/50 dark:bg-black/60 px-6 py-16">
      <div className="w-full max-w-md p-8 sm:p-10 card-modern">
        <h1 className="font-display text-3xl font-bold text-primary mb-3 text-center">
          Create your account
        </h1>
        <p className="text-sm text-secondary text-center mb-8">
          Join EcoBin as a citizen
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">
              Full name
            </label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              className="input-modern"
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="input-modern"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">
              Phone
            </label>
            {/* BUG-02 fix: pattern + title give browser-native validation feedback */}
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              pattern="[+]?[0-9\s\-]{7,15}"
              title="Enter a valid phone number (7–15 digits, e.g. +91 98765 43210)"
              className="input-modern"
              placeholder="+91 98765 43210"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">
              Address <span className="normal-case text-secondary/70">(optional)</span>
            </label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="input-modern"
              placeholder="Street, City"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="input-modern"
              placeholder="At least 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 mt-2"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-xs text-secondary text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary hover:text-eco-mint transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
