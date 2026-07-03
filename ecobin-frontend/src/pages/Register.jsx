import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/auth';

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

    setLoading(true);
    try {
      await registerUser(form);
      // Account created — backend doesn't auto-login, so send them to /login
      navigate('/login', { state: { justRegistered: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-black/40 px-6 py-16">
      <div className="w-full max-w-md p-8 bg-white dark:bg-eco-charcoal rounded-2xl border border-eco-sage/20 shadow-lg">
        <h1 className="font-display text-3xl font-bold text-eco-forest dark:text-white mb-2 text-center">
          Create your account
        </h1>
        <p className="text-sm text-eco-mint dark:text-eco-sage text-center mb-8">
          Join EcoBin as a citizen
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-eco-mint dark:text-eco-sage mb-1">
              Full name
            </label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-50 dark:bg-black/30 border border-eco-sage/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-eco-forest"
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-eco-mint dark:text-eco-sage mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-50 dark:bg-black/30 border border-eco-sage/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-eco-forest"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-eco-mint dark:text-eco-sage mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-50 dark:bg-black/30 border border-eco-sage/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-eco-forest"
              placeholder="+91 98765 43210"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-eco-mint dark:text-eco-sage mb-1">
              Address <span className="normal-case text-eco-mint/70">(optional)</span>
            </label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 dark:bg-black/30 border border-eco-sage/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-eco-forest"
              placeholder="Street, City"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-eco-mint dark:text-eco-sage mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-50 dark:bg-black/30 border border-eco-sage/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-eco-forest"
              placeholder="At least 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 py-3 bg-eco-forest hover:bg-eco-emerald text-white font-bold rounded-lg text-sm uppercase tracking-wide transition-colors disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-xs text-eco-mint dark:text-eco-sage text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-eco-forest dark:text-white hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
