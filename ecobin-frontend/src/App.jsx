import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
// ForgotPassword and ResetPassword imports removed per requirement
import Dashboard, { CitizenDashboard } from './pages/Dashboard';
import CollectorDashboard from './pages/CollectorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CollectorLayout from './layouts/CollectorLayout';
import AdminLayout from './layouts/AdminLayout';
import CitizenLayout from './layouts/CitizenLayout';
import PublicLayout from './layouts/PublicLayout';
import ProtectedRoute from './pages/ProtectedRoute';
import { isLoggedIn, logoutUser } from './api/auth';
import FAQ from './pages/FAQ'; 
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import NotFound from './pages/NotFound';
import { useDarkMode } from './useDarkMode';

// Placeholder Pages
import { CitizenRequests, CitizenBins, CitizenRecycling, CitizenFeedback, CitizenNotifications, CitizenProfile } from './pages/dashboards/CitizenPages';
import { CollectorRequests, CollectorBins, CollectorRecycling, CollectorNotifications, CollectorProfile } from './pages/dashboards/CollectorPages';
import { AdminUsers, AdminCollectors, AdminBins, AdminCategories, AdminPickups, AdminCollections, AdminFeedback, AdminNotifications, AdminAuditLog, AdminSettings } from './pages/dashboards/AdminPages';

function App() {
 const [theme, toggleTheme] = useDarkMode();
 const [loggedIn, setLoggedIn] = useState(isLoggedIn());

 useEffect(() => {
 const handleStorageChange = () => {
 setLoggedIn(isLoggedIn());
 };
 window.addEventListener('storage', handleStorageChange);
 return () => window.removeEventListener('storage', handleStorageChange);
 }, []);

 const handleLogout = () => {
 logoutUser();
 setLoggedIn(false);
 };

 return (
 <Router>
 <div className="min-h-screen bg-white text-eco-charcoal dark:bg-black text-primary font-sans transition-colors duration-300 flex flex-col">
 <Routes>
 {/* Public Routes with Navbar and Footer */}
 <Route element={<PublicLayout theme={theme} toggleTheme={toggleTheme} loggedIn={loggedIn} handleLogout={handleLogout} />}>
 <Route path="/" element={<Home />} />
 <Route path="/about" element={<About />} />
 <Route path="/services" element={<Services />} />
 <Route path="/categories" element={<Categories />} />
 <Route path="/analytics" element={<Analytics />} />
 <Route path="/careers" element={<Careers />} />
 <Route path="/contact" element={<Contact />} />
 <Route path="/login" element={<Login onLoginSuccess={() => setLoggedIn(true)} />} />
 <Route path="/register" element={<Register />} />
 // Forgot and Reset password routes removed per requirement
 <Route path="/faq" element={<FAQ />} />
 <Route path="/privacy" element={<PrivacyPolicy />} />
 <Route path="/terms" element={<TermsAndConditions />} />
 <Route path="*" element={<NotFound />} />
 </Route>
 
 {/* Dashboard Entry Redirector (no layout) */}
 <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

 {/* Citizen Dashboard (Private Layout) */}
 <Route path="/citizen" element={<ProtectedRoute><CitizenLayout handleLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} /></ProtectedRoute>}>
 <Route path="dashboard" element={<CitizenDashboard />} />
 <Route path="requests" element={<CitizenRequests />} />
 <Route path="bins" element={<CitizenBins />} />
 <Route path="recycling" element={<CitizenRecycling />} />
 <Route path="feedback" element={<CitizenFeedback />} />
 <Route path="notifications" element={<CitizenNotifications />} />
 <Route path="profile" element={<CitizenProfile />} />
 </Route>

 {/* Collector Dashboard (Private Layout) */}
 <Route path="/collector" element={<ProtectedRoute><CollectorLayout handleLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} /></ProtectedRoute>}>
 <Route path="dashboard" element={<CollectorDashboard />} />
 <Route path="requests" element={<CollectorRequests />} />
 <Route path="bins" element={<CollectorBins />} />
 <Route path="recycling" element={<CollectorRecycling />} />
 <Route path="notifications" element={<CollectorNotifications />} />
 <Route path="profile" element={<CollectorProfile />} />
 </Route>

 {/* Admin Dashboard (Private Layout) */}
 <Route path="/admin" element={<ProtectedRoute><AdminLayout handleLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} /></ProtectedRoute>}>
 <Route path="dashboard" element={<AdminDashboard />} />
 <Route path="users" element={<AdminUsers />} />
 <Route path="collectors" element={<AdminCollectors />} />
 <Route path="bins" element={<AdminBins />} />
 <Route path="categories" element={<AdminCategories />} />
 <Route path="pickups" element={<AdminPickups />} />
 <Route path="collections" element={<AdminCollections />} />
 <Route path="feedback" element={<AdminFeedback />} />
 <Route path="notifications" element={<AdminNotifications />} />
 <Route path="audit" element={<AdminAuditLog />} />
 <Route path="settings" element={<AdminSettings />} />
 </Route>

 </Routes>
 </div>
 </Router>
 );
}

export default App;
