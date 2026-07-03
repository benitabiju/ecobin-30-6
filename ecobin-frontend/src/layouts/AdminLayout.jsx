import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Truck, Trash2, List, FileText,
  Recycle, MessageSquare, Bell, Shield, Settings, LogOut, Menu, X
} from "lucide-react";
import { useState, useEffect } from "react";
import { getMyProfile } from "../api/Users";
import logo from '../assets/logo1.png';
import { adminNotifications } from "../mockData";

const navItems = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/collectors", icon: Truck, label: "Collectors" },
  { to: "/admin/bins", icon: Trash2, label: "Smart Bins" },
  { to: "/admin/categories", icon: List, label: "Waste Categories" },
  { to: "/admin/pickups", icon: FileText, label: "Pickup Requests" },
  { to: "/admin/collections", icon: Recycle, label: "Collections & Recycling" },
  { to: "/admin/feedback", icon: MessageSquare, label: "Feedback" },
  { to: "/admin/notifications", icon: Bell, label: "Notifications", badge: adminNotifications.filter(n => !n.read).length },
  { to: "/admin/audit", icon: Shield, label: "Audit Log" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminLayout({ handleLogout, theme, toggleTheme }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profile, setProfile] = useState(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    getMyProfile().then(data => setProfile(data)).catch(err => console.error(err));
  }, []);

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
            Admin Account
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
                  ? "bg-[#C9742B] text-white"
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
                <span className="bg-[#3F6B4A] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
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
            <span className="font-display font-bold text-eco-forest dark:text-emerald-400 hidden sm:block">Admin Portal</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-1.5 rounded border border-gray-200 dark:border-slate-600 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-all text-sm cursor-pointer"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            {profile && (() => {
              const displayName = profile.full_name || profile.email || 'User';
              return (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#C9742B] dark:bg-[#E88E43] flex items-center justify-center text-white text-xs font-bold uppercase">
                    {displayName.substring(0, 2)}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">{displayName}</span>
                </div>
              );
            })()}
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