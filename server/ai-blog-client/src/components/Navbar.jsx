import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated, userName, userInitials } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/blogs', label: 'Blogs', icon: '📚' },
    ...(isAuthenticated ? [
      { path: '/create', label: 'Write', icon: '✍️' },
      { path: '/my-blogs', label: 'My Blogs', icon: '📝' },
      { path: '/dashboard', label: 'Dashboard', icon: '📊' }
    ] : [])
  ];

  return (
    <nav className="bg-cream shadow-lg border-b-2 border-medium-beige sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 text-dark-brown hover:text-text-dark transition-colors group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-dark-brown to-text-dark rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-cream font-bold text-xl">B</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold font-serif leading-none">BrainBlog</span>
                <span className="text-xs text-text-medium font-medium">AI-Powered Writing</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                    isActive(link.path)
                      ? 'bg-dark-brown text-cream shadow-md transform scale-105'
                      : 'text-text-dark hover:text-dark-brown hover:bg-light-beige hover:scale-105'
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 bg-light-beige px-4 py-2 rounded-lg hover:bg-medium-beige transition-colors"
                  >
                    <div className="w-8 h-8 bg-dark-brown text-cream rounded-full flex items-center justify-center font-bold">
                      {userInitials}
                    </div>
                    <span className="text-text-dark font-medium">
                      {userName}
                    </span>
                    <svg className={`w-4 h-4 text-text-medium transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-light-beige py-2 z-50">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-text-dark font-semibold hover:text-dark-brown transition-colors px-4 py-2 rounded-lg hover:bg-light-beige"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-dark-brown text-cream px-6 py-2 rounded-lg font-semibold hover:bg-text-dark transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-text-dark hover:text-dark-brown focus:outline-none transition-colors p-2"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-2 bg-light-beige rounded-lg mt-2 mb-4 border border-medium-beige">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-3 mx-2 ${
                    isActive(link.path)
                      ? 'bg-dark-brown text-cream shadow-md'
                      : 'text-text-dark hover:text-dark-brown hover:bg-medium-beige'
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.label}
                </Link>
              ))}

              {isAuthenticated ? (
                <div className="mx-2 pt-4 border-t border-medium-beige space-y-2">
                  <div className="flex items-center space-x-3 px-4 py-2 bg-white rounded-lg">
                    <div className="w-10 h-10 bg-dark-brown text-cream rounded-full flex items-center justify-center font-bold">
                      {userInitials}
                    </div>
                    <div>
                      <p className="text-text-dark font-medium">{userName}</p>
                      <p className="text-text-medium text-sm">{user?.email}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-semibold"
                  >
                    🚪 Logout
                  </button>
                </div>
              ) : (
                <div className="mx-2 pt-4 border-t border-medium-beige space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-text-dark font-semibold hover:text-dark-brown hover:bg-medium-beige rounded-lg transition-colors text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 bg-dark-brown text-cream rounded-lg font-bold hover:bg-text-dark transition-colors text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
