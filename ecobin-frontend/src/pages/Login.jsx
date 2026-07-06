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
 <main className="min-h-[85vh] flex items-center justify-center bg-gray-50/50 dark:bg-black/60 px-6 py-16">
 <div className="w-full max-w-md p-8 sm:p-10 card-modern">
 <h1 className="font-display text-3xl font-bold text-primary mb-3 text-center">
 Welcome back
 </h1>
 <p className="text-sm text-secondary text-center mb-8">
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
 <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">
 Email
 </label>
 <input
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 required
 className="input-modern"
 placeholder="you@example.com"
 />
 </div>

 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">
 Password
 </label>
 <input
 type="password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 required
 className="input-modern"
 placeholder="••••••••"
 />
 </div>

 <button
 type="submit"
 disabled={loading}
 className="btn-primary w-full py-3.5 mt-2"
 >
 {loading ? 'Logging in...' : 'Log In'}
 </button>
 </form>

 <p className="text-xs text-secondary text-center mt-6">
 Don't have an account?{' '}
 <Link to="/register" className="font-bold text-primary hover:underline">
 Sign up
 </Link>
 </p>
 </div>
 </main>
 );
}


