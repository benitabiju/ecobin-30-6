import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 dark:text-white">
      <h1 className="text-4xl font-bold mb-6 text-eco-forest dark:text-eco-sage">Privacy Policy</h1>
      <div className="prose dark:prose-invert">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        <h2 className="text-2xl font-semibold mt-6 mb-3">1. Information We Collect</h2>
        <p className="mb-4">We collect information you provide directly to us when you register for an account, submit requests, or otherwise communicate with us. This may include your name, email address, physical address, and other contact information.</p>
        <h2 className="text-2xl font-semibold mt-6 mb-3">2. How We Use Your Information</h2>
        <p className="mb-4">We use the information we collect to provide, maintain, and improve our services, process your waste collection requests, send you technical notices and support messages, and communicate with you about products, services, offers, and events.</p>
        <h2 className="text-2xl font-semibold mt-6 mb-3">3. Information Sharing</h2>
        <p className="mb-4">We do not share your personal information with third parties except as necessary to provide our services (such as sharing your address with designated waste collectors) or as required by law.</p>
        <h2 className="text-2xl font-semibold mt-6 mb-3">4. Security</h2>
        <p className="mb-4">We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
        <h2 className="text-2xl font-semibold mt-6 mb-3">5. Contact Us</h2>
        <p className="mb-4">If you have any questions about this Privacy Policy, please contact us at hello@ecobin.example.</p>
      </div>
    </div>
  );
}
