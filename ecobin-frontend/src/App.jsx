import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import logo from './assets/logo1.png'; 

// Import page files
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Categories from './pages/Categories';
import Analytics from './pages/Analytics';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './pages/ProtectedRoute';
import { isLoggedIn, logoutUser } from './api/auth';
import HeroCarousel from './pages/HeroCarousel';
// Import Footer
import Footer from './pages/Footer';

function App() {
  const [isDark, setIsDark] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
    setLoggedIn(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-white text-eco-charcoal dark:bg-black dark:text-white font-sans transition-colors duration-300 flex flex-col">
        
        {/* FULLY RESPONSIVE NAVBAR */}
        <header className="w-full bg-[#0A1220] border-b-2 border-eco-emerald/50 shadow-md sticky top-0 z-50">
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
                onClick={() => setIsDark(!isDark)}
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
              
              <button className="bg-[#74A980] hover:bg-eco-sage text-[#0A1220] font-bold tracking-widest text-[10px] sm:text-xs uppercase py-2 px-3 sm:py-2.5 sm:px-5 rounded transition-colors duration-200 cursor-pointer">
                Get Started
              </button>
            </div>
          </div>

          {/* MOBILE & TABLET DROPDOWN MENU */}
          {isMenuOpen && (
            <div className="lg:hidden bg-[#0A1220] border-t border-slate-800 px-4 py-4 space-y-3 shadow-inner">
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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login onLoginSuccess={() => setLoggedIn(true)} />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        {/* FOOTER RENDERS AT THE BOTTOM OF EVERY PAGE */}
        <Footer />

      </div>
    </Router>
  );
}

export default App;