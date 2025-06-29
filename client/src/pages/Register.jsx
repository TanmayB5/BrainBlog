import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the intended destination from location state
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    const result = await register(formData.name, formData.email, formData.password);
    
    if (result.success) {
      // Auto-login after registration, redirect to dashboard
      navigate(from);
    } else {
      setError(result.message || 'Registration failed');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-dark-brown to-text-dark rounded-xl flex items-center justify-center mb-4">
            <span className="text-cream font-bold text-2xl">B</span>
          </div>
          <h2 className="text-3xl font-bold text-text-dark font-serif">
            Join BrainBlog
          </h2>
          <p className="mt-2 text-text-medium">
            Create your account to read full articles and join our community
          </p>
          <div className="mt-4 p-4 bg-light-beige rounded-lg border border-medium-beige">
            <p className="text-sm text-text-dark font-medium">
              🔐 Sign up to unlock access to all blog articles, leave comments, and create your own content!
            </p>
            {from !== '/dashboard' && (
              <p className="text-xs text-text-medium mt-2">
                After registration, you'll be redirected back to where you were trying to go.
              </p>
            )}
          </div>
        </div>

        <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-light-beige" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-dark mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-medium-beige rounded-lg focus:ring-2 focus:ring-dark-brown focus:border-dark-brown transition-colors bg-cream"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-medium-beige rounded-lg focus:ring-2 focus:ring-dark-brown focus:border-dark-brown transition-colors bg-cream"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-dark mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-medium-beige rounded-lg focus:ring-2 focus:ring-dark-brown focus:border-dark-brown transition-colors bg-cream"
                placeholder="Create a password (min 6 characters)"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-dark mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-medium-beige rounded-lg focus:ring-2 focus:ring-dark-brown focus:border-dark-brown transition-colors bg-cream"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-dark-brown text-cream py-3 px-4 rounded-lg font-semibold hover:bg-text-dark focus:ring-2 focus:ring-dark-brown focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="text-center">
            <p className="text-text-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-dark-brown font-semibold hover:text-text-dark transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
