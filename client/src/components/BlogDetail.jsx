import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    totalWords: 0,
    totalViews: 0,
    recentBlogs: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await blogAPI.getUserBlogs();
      const blogs = data.blogs || [];
      
      const dashboardStats = {
        totalBlogs: blogs.length,
        publishedBlogs: blogs.filter(blog => blog.published).length,
        draftBlogs: blogs.filter(blog => !blog.published).length,
        totalWords: blogs.reduce((sum, blog) => sum + blog.content.split(' ').length, 0),
        totalViews: blogs.reduce((sum, blog) => sum + (blog.views || 0), 0),
        recentBlogs: blogs
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 5)
      };
      
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getReadingTime = (content) => {
    const words = content.split(' ').length;
    return Math.ceil(words / 200);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-light-beige rounded-full animate-spin"></div>
            <div className="w-16 h-16 border-4 border-dark-brown border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-text-dark font-medium mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-dark-brown to-text-dark rounded-2xl p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 font-serif">
                {getGreeting()}, {user?.name || 'Writer'}! 👋
              </h1>
              <p className="text-light-beige text-lg">
                Here's your writing progress and recent activity
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Link
                to="/create"
                className="bg-cream text-dark-brown px-6 py-3 rounded-lg font-bold hover:bg-light-beige transition-colors flex items-center gap-2"
              >
                ✍️ Write New Blog
              </Link>
              <Link
                to="/my-blogs"
                className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg font-bold hover:bg-opacity-30 transition-colors flex items-center gap-2"
              >
                📚 View All Blogs
              </Link>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-light-beige p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-medium text-sm font-medium">Total Blogs</p>
                <p className="text-3xl font-bold text-text-dark">{stats.totalBlogs}</p>
              </div>
              <div className="w-12 h-12 bg-dark-brown rounded-lg flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">
                {stats.publishedBlogs} published
              </span>
              <span className="text-text-medium ml-2">
                • {stats.draftBlogs} drafts
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-light-beige p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-medium text-sm font-medium">Total Words</p>
                <p className="text-3xl font-bold text-text-dark">{stats.totalWords.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-dark-brown rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-blue-600 font-medium">
                ~{Math.ceil(stats.totalWords / 200)} min reading time
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-light-beige p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-medium text-sm font-medium">Published</p>
                <p className="text-3xl font-bold text-text-dark">{stats.publishedBlogs}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">
                {stats.totalBlogs > 0 ? Math.round((stats.publishedBlogs / stats.totalBlogs) * 100) : 0}% of total
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-light-beige p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-medium text-sm font-medium">Drafts</p>
                <p className="text-3xl font-bold text-text-dark">{stats.draftBlogs}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📄</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-yellow-600 font-medium">
                Ready to publish
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Blogs */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-light-beige p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-text-dark">Recent Blogs</h2>
                <Link
                  to="/my-blogs"
                  className="text-dark-brown hover:text-text-dark font-semibold text-sm"
                >
                  View All →
                </Link>
              </div>

              {stats.recentBlogs.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentBlogs.map((blog) => (
                    <div
                      key={blog._id}
                      className="border border-light-beige rounded-lg p-4 hover:bg-cream transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-text-dark line-clamp-1">
                              {blog.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              blog.published 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {blog.published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-text-medium">
                            <span>📅 {formatDate(blog.updatedAt)}</span>
                            <span>📝 {blog.content.split(' ').length} words</span>
                            <span>⏱️ {getReadingTime(blog.content)} min read</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Link
                            to={`/blog/${blog._id}`}
                            className="text-dark-brown hover:text-text-dark text-sm font-medium"
                          >
                            View
                          </Link>
                          <Link
                            to={`/edit/${blog._id}`}
                            className="text-dark-brown hover:text-text-dark text-sm font-medium"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-light-beige rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <p className="text-text-medium">No blogs yet. Start writing!</p>
                  <Link
                    to="/create"
                    className="inline-block mt-4 bg-dark-brown text-cream px-6 py-2 rounded-lg font-semibold hover:bg-text-dark transition-colors"
                  >
                    Create Your First Blog
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Tips */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-light-beige p-6">
              <h2 className="text-xl font-bold text-text-dark mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/create"
                  className="block w-full bg-dark-brown text-cream text-center py-3 rounded-lg font-semibold hover:bg-text-dark transition-colors"
                >
                  ✍️ Write New Blog
                </Link>
                <Link
                  to="/my-blogs?filter=drafts"
                  className="block w-full bg-light-beige text-text-dark text-center py-3 rounded-lg font-semibold hover:bg-medium-beige transition-colors"
                >
                  📄 Continue Draft ({stats.draftBlogs})
                </Link>
                <Link
                  to="/blogs"
                  className="block w-full bg-light-beige text-text-dark text-center py-3 rounded-lg font-semibold hover:bg-medium-beige transition-colors"
                >
                  📚 Browse All Blogs
                </Link>
              </div>
            </div>

            {/* Writing Tips */}
            <div className="bg-gradient-to-br from-light-beige to-medium-beige rounded-2xl p-6">
              <h2 className="text-xl font-bold text-text-dark mb-4">💡 Writing Tips</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-lg">🎯</span>
                  <p className="text-text-dark">
                    <strong>Use AI Tools:</strong> Try our AI-powered summary and SEO optimization features
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">📝</span>
                  <p className="text-text-dark">
                    <strong>Write Regularly:</strong> Consistency helps build your audience
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">🏷️</span>
                  <p className="text-text-dark">
                    <strong>Use Tags:</strong> Help readers discover your content with relevant tags
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">📊</span>
                  <p className="text-text-dark">
                    <strong>SEO Matters:</strong> Add meta descriptions for better search visibility
                  </p>
                </div>
              </div>
            </div>

            {/* Achievement Badge */}
            {stats.totalBlogs >= 5 && (
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl p-6 border border-yellow-300">
                <div className="text-center">
                  <span className="text-4xl mb-2 block">🏆</span>
                  <h3 className="font-bold text-yellow-800 mb-2">Prolific Writer!</h3>
                  <p className="text-yellow-700 text-sm">
                    You've written {stats.totalBlogs} blogs. Keep up the great work!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
