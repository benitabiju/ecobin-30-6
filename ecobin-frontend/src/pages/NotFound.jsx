import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-display text-8xl font-bold text-eco-forest dark:text-white mb-4">404</h1>
      <h2 className="text-2xl font-bold text-eco-mint dark:text-eco-sage mb-6">Page Not Found</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-eco-forest text-white rounded-lg font-medium hover:bg-eco-emerald transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  );
}
