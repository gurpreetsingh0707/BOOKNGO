import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
    { path: '/movies', label: 'Movies', icon: '🎬' },
    { path: '/trains', label: 'Trains', icon: '🚂' },
    { path: '/buses', label: 'Buses', icon: '🚌' },
    { path: '/hotels', label: 'Hotels', icon: '🏨' },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/30 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              ✈️ BOOKNGO
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  location.pathname === link.path
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-white/50'
                }`}
              >
                {link.icon} {link.label}
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {auth && (
              <>
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                    {auth.user?.firstName?.[0]}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-semibold text-gray-800">{auth.user?.firstName}</p>
                    <p className="text-xs text-gray-600">{auth.user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:shadow-lg text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;