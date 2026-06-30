// src/layouts/CollectorLayout.jsx
import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function CollectorLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar with Hamburger */}
      <nav className="p-4 bg-white shadow-sm flex justify-between items-center">
        <h1 className="font-bold text-eco-forest">Collector Portal</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl">☰</button>
      </nav>

      {/* Sidebar Menu */}
      {isOpen && (
        <aside className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsOpen(false)}>
          <div className="w-64 bg-white h-full p-6" onClick={(e) => e.stopPropagation()}>
            <nav className="flex flex-col gap-4">
              <Link to="/collector/home" onClick={() => setIsOpen(false)}>Home</Link>
              <Link to="/collector/pickups" onClick={() => setIsOpen(false)}>Assigned Requests</Link>
              <Link to="/collector/profile" onClick={() => setIsOpen(false)}>Profile</Link>
            </nav>
          </div>
        </aside>
      )}

      {/* This renders the page content */}
      <main className="p-6">
        <Outlet /> 
      </main>
    </div>
  );
}