import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo1.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-eco-darkBg border-t border-eco-sage/20 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          
          {/* Brand & Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={logo} 
                alt="EcoBin Logo" 
                className="w-12 h-10 object-contain" 
              />
              <span className="text-2xl font-display font-bold text-eco-forest dark:text-white">ECOBIN</span>
            </div>
            <p className="text-sm text-eco-mint dark:text-eco-sage leading-relaxed max-w-sm">
              A role-based platform for citizens, collectors, and administrators to run smarter, data-backed waste collection.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-bold text-eco-forest dark:text-white mb-5 uppercase tracking-wider text-xs">Platform</h3>
            <ul className="space-y-3">
              <li><a href="/about" className="text-sm text-eco-mint dark:text-eco-sage hover:text-eco-forest dark:hover:text-white transition-colors">About</a></li>
              <li><a href="/services" className="text-sm text-eco-mint dark:text-eco-sage hover:text-eco-forest dark:hover:text-white transition-colors">Services</a></li>
              <li><a href="/categories" className="text-sm text-eco-mint dark:text-eco-sage hover:text-eco-forest dark:hover:text-white transition-colors">Categories</a></li>
              <li><a href="/analytics" className="text-sm text-eco-mint dark:text-eco-sage hover:text-eco-forest dark:hover:text-white transition-colors">Analytics</a></li>
              <li><a href="/careers" className="text-sm text-eco-mint dark:text-eco-sage hover:text-eco-forest dark:hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="font-bold text-eco-forest dark:text-white mb-5 uppercase tracking-wider text-xs">Account</h3>
            <ul className="space-y-3">
              <li><a href="/login" className="text-sm text-eco-mint dark:text-eco-sage hover:text-eco-forest dark:hover:text-white transition-colors">Log in</a></li>
              <li><a href="/register" className="text-sm text-eco-mint dark:text-eco-sage hover:text-eco-forest dark:hover:text-white transition-colors">Register</a></li>
              <li><a href="/forgot-password" className="text-sm text-eco-mint dark:text-eco-sage hover:text-eco-forest dark:hover:text-white transition-colors">Forgot password</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-bold text-eco-forest dark:text-white mb-5 uppercase tracking-wider text-xs">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-sm text-eco-mint dark:text-eco-sage hover:text-eco-forest dark:hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-eco-mint dark:text-eco-sage hover:text-eco-forest dark:hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/faq" className="text-sm text-eco-mint dark:text-eco-sage hover:text-eco-forest dark:hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Links */}
          <div>
            <h3 className="font-bold text-eco-forest dark:text-white mb-5 uppercase tracking-wider text-xs">Contact</h3>
            <ul className="space-y-3">
              <li><a href="/contact" className="text-sm text-eco-mint dark:text-eco-sage hover:text-eco-forest dark:hover:text-white transition-colors">Contact form</a></li>
              <li><a href="mailto:hello@ecobin.example" className="text-sm text-eco-mint dark:text-eco-sage hover:text-eco-forest dark:hover:text-white transition-colors">hello@ecobin.example</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-eco-sage/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-eco-mint dark:text-eco-sage/60">
            &copy; {currentYear} EcoBin Systems. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-eco-mint dark:text-eco-sage/60 hover:text-eco-forest dark:hover:text-white transition-colors text-sm font-bold">TW</a>
            <a href="#" className="text-eco-mint dark:text-eco-sage/60 hover:text-eco-forest dark:hover:text-white transition-colors text-sm font-bold">IN</a>
            <a href="#" className="text-eco-mint dark:text-eco-sage/60 hover:text-eco-forest dark:hover:text-white transition-colors text-sm font-bold">GH</a>
          </div>
        </div>
      </div>
    </footer>
  );
}