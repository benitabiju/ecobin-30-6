import React from 'react';
import { Link } from 'react-router-dom';

export default function FAQ() {
  const faqSections = [
    {
      category: "General",
      questions: [
        {
          q: "What is Ecobin?",
          a: "Ecobin is a data-backed, role-based platform designed to optimize waste collection processes for citizens, collectors, and city administrators."
        },
        {
          q: "Is there a mobile app available?",
          a: "Currently, our platform is fully optimized for mobile browsers, allowing you to access all features on the go without needing a separate download."
        }
      ]
    },
    {
      category: "For Citizens",
      questions: [
        {
          q: "How do I schedule a waste collection?",
          a: "Once logged into your dashboard, navigate to 'Request Pickup,' select the type of waste, and choose a time slot that works for you."
        },
        {
          q: "How can I track my waste analytics?",
          a: "The 'Analytics' tab provides visual breakdowns of your household's waste generation patterns and recycling contributions."
        }
      ]
    },
    {
      category: "For Collectors & Admins",
      questions: [
        {
          q: "How do I update collection status?",
          a: "Collectors can update the status of assigned pickups in real-time through their dedicated dashboard view."
        },
        {
          q: "Can I view regional waste data?",
          a: "Administrators have access to aggregate data reports to identify trends and optimize collection routes across different sectors."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-eco-darkBg py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-display font-bold text-eco-forest dark:text-white mb-12 text-center">
          Frequently Asked Questions
        </h1>
        
        {faqSections.map((section, idx) => (
          <div key={idx} className="mb-12">
            <h2 className="text-xl font-bold text-eco-forest dark:text-eco-sage mb-6 border-b border-eco-sage/20 pb-2">
              {section.category}
            </h2>
            <div className="space-y-8">
              {section.questions.map((item, qIdx) => (
                <div key={qIdx}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {item.q}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-eco-sage leading-relaxed">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="mt-16 text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
          <p className="text-eco-mint dark:text-eco-sage mb-4">Still have questions?</p>
          <Link to="/contact" className="text-eco-forest dark:text-white font-bold hover:underline">
            Visit our Contact Form
          </Link>
        </div>
      </div>
    </div>
  );
}