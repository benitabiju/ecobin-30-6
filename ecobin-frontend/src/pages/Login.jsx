import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { getMyProfile } from '../api/Users';

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const justRegistered = location.state?.justRegistered;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser(email, password);
      onLoginSuccess?.();
      const profile = await getMyProfile();
      if (profile.role === 'collector') {
        navigate('/collector/dashboard');
      } else if (profile.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
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
          Welcome back
        </h1>
        <p className="text-sm text-eco-mint dark:text-eco-sage text-center mb-8">
          Log in to your EcoBin account
        </p>

        {justRegistered && !error && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
            Account created! Log in with your new credentials.
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-eco-mint dark:text-eco-sage mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 bg-gray-50 dark:bg-black/30 border border-eco-sage/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-eco-forest"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-eco-mint dark:text-eco-sage mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 bg-gray-50 dark:bg-black/30 border border-eco-sage/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-eco-forest"
              placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
            />
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-xs font-bold text-eco-forest dark:text-eco-sage hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 py-3 bg-eco-forest hover:bg-eco-emerald text-white font-bold rounded-lg text-sm uppercase tracking-wide transition-colors disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-xs text-eco-mint dark:text-eco-sage text-center mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-eco-forest dark:text-white hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}


