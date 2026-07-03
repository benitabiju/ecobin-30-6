import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import logo from '../assets/logo1.png';
import Footer from '../components/Footer';

export default function PublicLayout({ theme, toggleTheme, loggedIn, handleLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDark = theme === 'dark';

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="flex-grow flex flex-col min-h-screen">
      {/* FULLY RESPONSIVE NAVBAR */}
      <header className="w-full bg-eco-darkBg border-b-2 border-eco-emerald/50 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          {/* Left side: Logo & Mobile Hamburger */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white rounded border border-slate-700 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            <Link to="/" className="flex items-center transition-opacity hover:opacity-80">
              <img 
                src={logo} 
                alt="EcoBin Logo" 
                className="h-11 w-11 object-contain transition-transform duration-200 hover:scale-105"
              />
            </Link>
          </div>

          {/* Middle: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-5 xl:space-x-8 text-xs font-semibold tracking-widest text-slate-300 uppercase">
            <Link to="/" className="hover:text-white transition-colors duration-150">Home</Link>
            <Link to="/about" className="hover:text-white transition-colors duration-150">About</Link>
            <Link to="/services" className="hover:text-white transition-colors duration-150">Services</Link>
            <Link to="/categories" className="hover:text-white transition-colors duration-150">Categories</Link>
            <Link to="/analytics" className="hover:text-white transition-colors duration-150">Analytics</Link>
            <Link to="/careers" className="hover:text-white transition-colors duration-150">Careers</Link>
            <Link to="/contact" className="hover:text-white transition-colors duration-150">Contact</Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-all text-sm cursor-pointer"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            
            {loggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="border border-slate-700 text-slate-200 hover:text-white hover:border-slate-500 font-bold tracking-widest text-[10px] sm:text-xs uppercase py-2 px-3 sm:py-2.5 sm:px-5 rounded transition-all cursor-pointer"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="border border-slate-700 text-slate-200 hover:text-white hover:border-slate-500 font-bold tracking-widest text-[10px] sm:text-xs uppercase py-2 px-3 sm:py-2.5 sm:px-5 rounded transition-all cursor-pointer"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="border border-slate-700 text-slate-200 hover:text-white hover:border-slate-500 font-bold tracking-widest text-[10px] sm:text-xs uppercase py-2 px-3 sm:py-2.5 sm:px-5 rounded transition-all cursor-pointer"
              >
                Log In
              </Link>
            )}
          </div>
        </div>

        {/* MOBILE & TABLET DROPDOWN MENU */}
        {isMenuOpen && (
          <div className="lg:hidden bg-eco-darkBg border-t border-slate-800 px-4 py-4 space-y-3 shadow-inner">
            <nav className="flex flex-col space-y-3 text-xs font-semibold tracking-widest text-slate-300 uppercase">
              <Link to="/" onClick={handleLinkClick} className="p-2 rounded hover:bg-slate-800/50 hover:text-white transition-colors">Home</Link>
              <Link to="/about" onClick={handleLinkClick} className="p-2 rounded hover:bg-slate-800/50 hover:text-white transition-colors">About</Link>
              <Link to="/services" onClick={handleLinkClick} className="p-2 rounded hover:bg-slate-800/50 hover:text-white transition-colors">Services</Link>
              <Link to="/categories" onClick={handleLinkClick} className="p-2 rounded hover:bg-slate-800/50 hover:text-white transition-colors">Categories</Link>
              <Link to="/analytics" onClick={handleLinkClick} className="p-2 rounded hover:bg-slate-800/50 hover:text-white transition-colors">Analytics</Link>
              <Link to="/careers" onClick={handleLinkClick} className="p-2 rounded hover:bg-slate-800/50 hover:text-white transition-colors">Careers</Link>
              <Link to="/contact" onClick={handleLinkClick} className="p-2 rounded hover:bg-slate-800/50 hover:text-white transition-colors">Contact</Link>
              {loggedIn ? (
                <>
                  <Link to="/dashboard" onClick={handleLinkClick} className="p-2 rounded hover:bg-slate-800/50 hover:text-white transition-colors">Dashboard</Link>
                  <button onClick={() => { handleLogout(); handleLinkClick(); }} className="p-2 rounded hover:bg-slate-800/50 hover:text-white transition-colors text-left">Log Out</button>
                </>
              ) : (
                <Link to="/login" onClick={handleLinkClick} className="p-2 rounded hover:bg-slate-800/50 hover:text-white transition-colors">Log In</Link>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* CONTAINER FOR MOUNTING DYNAMIC PAGES */}
      <main className="flex-grow flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
