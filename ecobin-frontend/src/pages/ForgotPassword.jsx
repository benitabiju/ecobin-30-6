import React from 'react';
import { Link } from 'react-router-dom';
import ChangePasswordForm from '../components/ChangePasswordForm';

export default function ForgotPassword() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-black/40 px-6 py-16">
      <div className="w-full max-w-md p-8 bg-white dark:bg-eco-charcoal rounded-2xl border border-eco-sage/20 shadow-lg">
        <ChangePasswordForm />
        <p className="text-xs text-eco-mint dark:text-eco-sage text-center mt-2">
          Back to <Link to="/login" className="font-bold text-eco-forest dark:text-white hover:underline">Log in</Link>
        </p>
      </div>
    </main>
  );
}
