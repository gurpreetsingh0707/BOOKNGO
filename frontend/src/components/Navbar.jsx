import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';

const Navbar = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    setAuth(null);
    navigate('/login');
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/shows', label: 'Shows', icon: '🎬' },
    { path: '/travel', label: 'Travel', icon: '🌍' },
    { path: '/hotels', label: 'Hotels', icon: '🏨' },
    { path: '/bookings', label: 'Bookings', icon: '📋' },
  ];

  const adminLinks = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/bookings', label: 'Bookings', icon: '📋' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/services', label: 'Services', icon: '🎫' },
  ];

  // Check if current route is admin
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-2 hover:scale-105 transition-transform">
          <span className="text-2xl">✈️</span> BOOKNGO
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-y-0 space-x-2">
          {isAdminRoute ? (
            // Admin Navigation
            <>
              {adminLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
                      isActive ? 'text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="admin-nav-indicator"
                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        style={{ zIndex: 0 }}
                      />
                    )}
                    <span className="relative z-10">{link.icon} {link.label}</span>
                  </Link>
                );
              })}
              <Link
                to="/"
                className="px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap text-slate-300 hover:bg-white/10"
              >
                🏠 Back to App
              </Link>
            </>
          ) : (
            // User Navigation
            <>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
                      isActive ? 'text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="user-nav-indicator"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        style={{ zIndex: 0 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">{link.icon} {link.label}</span>
                  </Link>
                );
              })}
            </>
          )}
        </div>

        {/* User Section */}
        <div className="flex items-center space-x-4">
          {auth && (
            <>
              <div className="hidden sm:flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {auth.user?.firstName?.[0]}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-white">{auth.user?.firstName}</p>
                  <p className="text-xs text-slate-400">{auth.user?.email}</p>
                </div>
              </div>

              {/* Admin Button */}
              {!isAdminRoute && auth.user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold transition-colors"
                >
                  ⚙️ Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-red-500 hover:text-white border border-white/20 text-slate-300 px-6 py-2 rounded-full font-semibold transition-all"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden bg-slate-900/95 backdrop-blur-md px-4 py-3 overflow-x-auto border-t border-white/10">
        <div className="flex space-x-2">
          {isAdminRoute ? (
            <>
              {adminLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                      isActive ? 'text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="mobile-admin-indicator"
                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        style={{ zIndex: 0 }}
                      />
                    )}
                    <span className="relative z-10">{link.icon}</span>
                  </Link>
                );
              })}
              <Link
                to="/"
                className="px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors text-slate-300 hover:bg-white/10"
              >
                🏠
              </Link>
            </>
          ) : (
            <>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                      isActive ? 'text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="mobile-user-indicator"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        style={{ zIndex: 0 }}
                      />
                    )}
                    <span className="relative z-10">{link.icon}</span>
                  </Link>
                );
              })}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;