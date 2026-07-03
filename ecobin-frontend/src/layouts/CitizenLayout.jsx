import { NavLink, Outlet, useNavigate } from "react-router-dom";
import logo from '../assets/logo1.png';
import {
  LayoutDashboard, FileText, Trash2, Star, MessageSquare,
  Bell, Settings, LogOut, Menu, X, ChevronLeft, ChevronRight, Leaf
} from "lucide-react";
import { useState, useEffect } from "react";
import { getMyProfile } from "../api/Users";
import { getNotifications } from "../api/notifications";

export default function CitizenLayout({ handleLogout, theme, toggleTheme }) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop
  const [profile, setProfile] = useState(null);
  const isDark = theme === 'dark';
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications for badge count and dropdown
  useEffect(() => {
    getNotifications()
      .then(data => setNotifications(Array.isArray(data) ? data : data.results || []))
      .catch(err => console.error('Failed to fetch notifications', err));
  }, []);
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    getMyProfile().then(data => setProfile(data)).catch(err => console.error(err));
  }, []);

  // Navigation items for the sidebar
  const navItems = [
    { to: "/citizen/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/citizen/requests", icon: FileText, label: "My Requests", badge: 2 },
    { to: "/citizen/bins", icon: Trash2, label: "Nearby Bins" },
    { to: "/citizen/recycling", icon: Star, label: "Recycling History" },
    { to: "/citizen/feedback", icon: MessageSquare, label: "Feedback" },
    { to: "/citizen/notifications", icon: Bell, label: "Notifications", badge: notifications.filter(n => !n.is_read).length },
    { to: "/citizen/profile", icon: Settings, label: "Profile & Settings" },
  ];

  return (
    <div className="flex h-screen bg-[#F6F3EA] dark:bg-slate-900 font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30 bg-eco-darkBg flex flex-col
          transform transition-all duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "w-20" : "w-64"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10 h-16">
          <img src={logo} alt="EcoBin Logo" className="h-9 w-9 object-contain" />
          {!isCollapsed && <span className="text-white font-display font-bold text-lg tracking-tight whitespace-nowrap overflow-hidden">ECOBIN</span>}
          <button
            className="ml-auto lg:hidden text-white/60 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Role label */}
        {!isCollapsed && (
          <p className="text-[10px] font-semibold tracking-widest text-white/30 px-5 pt-5 pb-2 uppercase whitespace-nowrap">
            Citizen Account
          </p>
        )}
        {isCollapsed && <div className="pt-5" />}

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto mt-2">
          {navItems.map(({ to, icon: Icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
                ${isActive
                  ? "bg-[#3F6B4A] text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
                }
                ${isCollapsed ? "justify-center" : ""}
                `
              }
              title={isCollapsed ? label : ""}
            >
              <Icon size={20} className="shrink-0" />
              {!isCollapsed && <span className="flex-1 whitespace-nowrap">{label}</span>}
              {!isCollapsed && badge ? (
                <span className="bg-[#C9742B] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {badge}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50 dark:bg-slate-900">
        
        {/* Top Header inside Dashboard */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-6 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)} 
              className="hidden lg:flex text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <Menu size={22} />
            </button>
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="lg:hidden text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <Menu size={22} />
            </button>
            <span className="font-display font-bold text-eco-forest dark:text-emerald-400 hidden sm:block">Citizen Portal</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-1.5 rounded border border-gray-200 dark:border-slate-600 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-all text-sm cursor-pointer"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            {/* Notification Bell */}
            <div className="relative inline-block">
              <button onClick={() => setShowNotif(!showNotif)} className="relative text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
                <Bell size={20} />
                {notifications.filter(n => !n.is_read).length > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications.filter(n => !n.is_read).length}
                  </span>
                )}
              </button>
              {showNotif && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 shadow-lg rounded-md overflow-auto max-h-60 z-20">
                  {notifications.length === 0 ? (
                    <div className="p-2 text-sm text-gray-500 dark:text-gray-400">No notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="p-2 border-b border-gray-200 dark:border-slate-700">
                        <p className="text-sm">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            {profile && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-eco-sage dark:bg-eco-forest flex items-center justify-center text-eco-forest dark:text-white text-xs font-bold uppercase">
                    {profile.full_name ? profile.full_name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() : profile.email?.split(' ')[0]?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
                    {profile.full_name || profile.email || 'User'}
                  </span>
                </div>
              )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg text-sm font-medium transition-colors border border-red-100 dark:border-red-900/50"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}