import React, { useState } from 'react';
import { changePassword } from '../api/auth';

export default function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');
    setLoading(true);

    try {
      const res = await changePassword(oldPassword, newPassword);
      setStatus(res.message || 'Password changed successfully.');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-eco-charcoal p-6 rounded-2xl shadow-sm border border-eco-sage/20">
      <h2 className="text-lg font-bold text-eco-forest dark:text-white mb-4">Change Password</h2>
      
      {status && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
          {status}
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
            Current Password
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="w-full p-3 bg-gray-50 dark:bg-black/30 border border-eco-sage/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-eco-forest"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-eco-mint dark:text-eco-sage mb-1">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            className="w-full p-3 bg-gray-50 dark:bg-black/30 border border-eco-sage/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-eco-forest"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 py-3 bg-eco-forest hover:bg-eco-emerald text-white font-bold rounded-lg text-sm uppercase tracking-wide transition-colors disabled:opacity-60"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
