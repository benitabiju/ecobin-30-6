import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { confirmPasswordReset } from '../api/auth';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');
    setLoading(true);

    try {
      const res = await confirmPasswordReset(token, password);
      setStatus(res.message);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
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
          Confirm Reset
        </h1>
        <p className="text-sm text-eco-mint dark:text-eco-sage text-center mb-8">
          Enter your reset token and new password.
        </p>

        {status && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
            {status} Redirecting to login...
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
              Reset Token
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              className="w-full p-3 bg-gray-50 dark:bg-black/30 border border-eco-sage/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-eco-forest"
              placeholder="Enter your token"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-eco-mint dark:text-eco-sage mb-1">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full p-3 bg-gray-50 dark:bg-black/30 border border-eco-sage/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-eco-forest"
              placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 py-3 bg-eco-forest hover:bg-eco-emerald text-white font-bold rounded-lg text-sm uppercase tracking-wide transition-colors disabled:opacity-60"
          >
            {loading ? 'Updating...' : 'Reset Password'}
          </button>
        </form>
        
        <p className="text-xs text-eco-mint dark:text-eco-sage text-center mt-6">
          Back to <Link to="/login" className="font-bold text-eco-forest dark:text-white hover:underline">Log in</Link>
        </p>
      </div>
    </main>
  );
}
