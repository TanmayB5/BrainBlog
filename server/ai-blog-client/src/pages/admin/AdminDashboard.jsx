import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBlogs: 0,
    pendingApprovals: 0,
    totalViews: 0
  });

  useEffect(() => {
    // Fetch admin stats
    setStats({
      totalUsers: 156,
      totalBlogs: 1240,
      pendingApprovals: 8,
      totalViews: 45230
    });
  }, []);

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-text-dark mb-4">
              Admin Dashboard 👑
            </h1>
            <p className="text-text-medium text-lg">
              Welcome back, {user?.name}! Manage your BrainBlog platform
            </p>
          </div>

          {/* Admin Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 text-center border border-light-beige">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-2xl font-bold text-dark-brown">{stats.totalUsers}</div>
              <div className="text-sm text-text-medium">Total Users</div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center border border-light-beige">
              <div className="text-3xl mb-2">📝</div>
              <div className="text-2xl font-bold text-dark-brown">{stats.totalBlogs}</div>
              <div className="text-sm text-text-medium">Total Blogs</div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center border border-light-beige">
              <div className="text-3xl mb-2">⏳</div>
              <div className="text-2xl font-bold text-dark-brown">{stats.pendingApprovals}</div>
              <div className="text-sm text-text-medium">Pending Approvals</div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center border border-light-beige">
              <div className="text-3xl mb-2">👁️</div>
              <div className="text-2xl font-bold text-dark-brown">{stats.totalViews}</div>
              <div className="text-sm text-text-medium">Total Views</div>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-xl border border-light-beige p-8">
              <h3 className="text-2xl font-bold text-text-dark mb-6">User Management</h3>
              <div className="space-y-4">
                <Link
                  to="/admin/users"
                  className="flex items-center gap-3 p-4 bg-light-beige rounded-lg hover:bg-medium-beige transition-colors"
                >
                  <span className="text-2xl">👥</span>
                  <div>
                    <div className="font-semibold text-text-dark">Manage Users</div>
                    <div className="text-sm text-text-medium">View, edit, and manage user accounts</div>
                  </div>
                </Link>
                
                <Link
                  to="/admin/roles"
                  className="flex items-center gap-3 p-4 bg-light-beige rounded-lg hover:bg-medium-beige transition-colors"
                >
                  <span className="text-2xl">🔐</span>
                  <div>
                    <div className="font-semibold text-text-dark">Role Management</div>
                    <div className="text-sm text-text-medium">Assign and manage user roles</div>
                  </div>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-light-beige p-8">
              <h3 className="text-2xl font-bold text-text-dark mb-6">Content Management</h3>
              <div className="space-y-4">
                <Link
                  to="/admin/blogs"
                  className="flex items-center gap-3 p-4 bg-light-beige rounded-lg hover:bg-medium-beige transition-colors"
                >
                  <span className="text-2xl">📝</span>
                  <div>
                    <div className="font-semibold text-text-dark">All Blogs</div>
                    <div className="text-sm text-text-medium">Moderate and manage all blog posts</div>
                  </div>
                </Link>
                
                <Link
                  to="/admin/categories"
                  className="flex items-center gap-3 p-4 bg-light-beige rounded-lg hover:bg-medium-beige transition-colors"
                >
                  <span className="text-2xl">🏷️</span>
                  <div>
                    <div className="font-semibold text-text-dark">Categories</div>
                    <div className="text-sm text-text-medium">Manage blog categories and tags</div>
                  </div>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-light-beige p-8">
              <h3 className="text-2xl font-bold text-text-dark mb-6">System Settings</h3>
              <div className="space-y-4">
                <Link
                  to="/admin/settings"
                  className="flex items-center gap-3 p-4 bg-light-beige rounded-lg hover:bg-medium-beige transition-colors"
                >
                  <span className="text-2xl">⚙️</span>
                  <div>
                    <div className="font-semibold text-text-dark">Platform Settings</div>
                    <div className="text-sm text-text-medium">Configure platform settings</div>
                  </div>
                </Link>
                
                <Link
                  to="/admin/analytics"
                  className="flex items-center gap-3 p-4 bg-light-beige rounded-lg hover:bg-medium-beige transition-colors"
                >
                  <span className="text-2xl">📊</span>
                  <div>
                    <div className="font-semibold text-text-dark">Analytics</div>
                    <div className="text-sm text-text-medium">View detailed platform analytics</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
