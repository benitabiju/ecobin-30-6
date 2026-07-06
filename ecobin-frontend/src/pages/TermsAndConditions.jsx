import React from 'react';

export default function TermsAndConditions() {
 return (
  <div className="max-w-4xl mx-auto px-6 pt-20 pb-16">
    <div className="card-modern p-12">
      <h1 className="text-4xl font-display font-bold mb-6 text-primary">Terms & Conditions</h1>
      <div className="prose dark:prose-invert max-w-none text-secondary">
        <p className="mb-4 text-sm uppercase tracking-wider font-bold">Last updated: {new Date().toLocaleDateString()}</p>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-primary">1. Acceptance of Terms</h2>
        <p className="mb-4 leading-relaxed">By accessing or using the EcoBin platform, you agree to be bound by these Terms & Conditions and all applicable laws and regulations.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-primary">2. Use of Services</h2>
        <p className="mb-4 leading-relaxed">You agree to use our services only for lawful purposes. You are responsible for ensuring that the waste you submit for collection complies with local regulations and our accepted materials list.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-primary">3. User Accounts</h2>
        <p className="mb-4 leading-relaxed">You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer or device. You agree to accept responsibility for all activities that occur under your account.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-primary">4. Limitation of Liability</h2>
        <p className="mb-4 leading-relaxed">In no event shall EcoBin, its directors, employees, or agents be liable for any indirect, incidental, special, consequential or punitive damages arising out of or related to your use of the service.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-primary">5. Changes to Terms</h2>
        <p className="mb-4 leading-relaxed">We reserve the right to modify these terms at any time. We will notify users of any significant changes. Your continued use of the service after such modifications will constitute your acknowledgment of the modified terms.</p>
      </div>
    </div>
  </div>
 );
}
