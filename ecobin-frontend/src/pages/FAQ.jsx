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
 <div className="min-h-screen pt-20 pb-16 px-6">
 <div className="max-w-3xl mx-auto">
 <h1 className="text-4xl font-display font-bold text-primary mb-12 text-center">
 Frequently Asked Questions
 </h1>
 
 {faqSections.map((section, idx) => (
 <div key={idx} className="mb-12">
 <h2 className="text-2xl font-bold text-primary mb-6 border-b border-eco-sage/20 pb-3">
 {section.category}
 </h2>
 <div className="space-y-4">
 {section.questions.map((item, qIdx) => (
 <div key={qIdx} className="card-modern p-6">
 <h3 className="text-lg font-bold text-primary mb-2">
 {item.q}
 </h3>
 <p className="text-sm text-secondary leading-relaxed">
 {item.a}
 </p>
 </div>
 ))}
 </div>
 </div>
 ))}
 
 <div className="mt-16 text-center card-modern p-10 shadow-inner">
 <p className="text-secondary mb-4 text-lg">Still have questions?</p>
 <Link to="/contact" className="btn-primary inline-block">
 Visit our Contact Form
 </Link>
 </div>
 </div>
 </div>
 );
}