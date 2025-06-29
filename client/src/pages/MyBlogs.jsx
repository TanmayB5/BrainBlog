import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { blogAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, published, drafts
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const fetchMyBlogs = async () => {
    try {
      setLoading(true);
      const data = await blogAPI.getUserBlogs();
      setBlogs(data.blogs || []);
    } catch (error) {
      console.error('Error fetching user blogs:', error);
      setError('Failed to load your blogs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      await blogAPI.deleteBlog(blogId);
      setBlogs(blogs.filter(blog => (blog._id || blog.id) !== blogId));
      setShowDeleteModal(false);
      setBlogToDelete(null);
      alert('✅ Blog deleted successfully!');
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('❌ Failed to delete blog. Please try again.');
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

  const filteredAndSortedBlogs = blogs
    .filter(blog => {
      const matchesFilter = filter === 'all' || 
        (filter === 'published' && blog.published) ||
        (filter === 'drafts' && !blog.published);
      
      const matchesSearch = !searchTerm || 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'updated':
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        default:
          return 0;
      }
    });

  const stats = {
    total: blogs.length,
    published: blogs.filter(blog => blog.published).length,
    drafts: blogs.filter(blog => !blog.published).length,
    totalWords: blogs.reduce((sum, blog) => sum + blog.content.split(' ').length, 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-light-beige rounded-full animate-spin"></div>
            <div className="w-16 h-16 border-4 border-dark-brown border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-text-dark font-medium mt-4">Loading your blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-dark-brown to-text-dark rounded-2xl p-8 mb-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-4xl font-bold mb-2 font-serif">My Blogs</h1>
                <p className="text-light-beige text-lg">
                  Welcome back, {user?.name || 'Writer'}! Manage your content here.
                </p>
              </div>
              <Link
                to="/create"
                className="mt-4 md:mt-0 bg-cream text-dark-brown px-6 py-3 rounded-lg font-bold hover:bg-light-beige transition-colors flex items-center gap-2"
              >
                ✍️ Write New Blog
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-light-beige text-sm">Total Blogs</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{stats.published}</div>
                <div className="text-light-beige text-sm">Published</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{stats.drafts}</div>
                <div className="text-light-beige text-sm">Drafts</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{stats.totalWords.toLocaleString()}</div>
                <div className="text-light-beige text-sm">Total Words</div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl shadow-lg border border-light-beige p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search your blogs..."
                  className="w-full px-4 py-3 border border-medium-beige rounded-lg focus:ring-2 focus:ring-dark-brown focus:border-dark-brown transition-colors bg-cream"
                />
              </div>

              {/* Filter */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 border border-medium-beige rounded-lg focus:ring-2 focus:ring-dark-brown focus:border-dark-brown transition-colors bg-cream"
              >
                <option value="all">All Blogs ({stats.total})</option>
                <option value="published">Published ({stats.published})</option>
                <option value="drafts">Drafts ({stats.drafts})</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-medium-beige rounded-lg focus:ring-2 focus:ring-dark-brown focus:border-dark-brown transition-colors bg-cream"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="updated">Recently Updated</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
              {error}
            </div>
          )}

          {/* Blogs Grid */}
          {filteredAndSortedBlogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedBlogs.map((blog, index) => {
                const blogId = blog._id || blog.id;
                return (
                  <div
                    key={blogId || `blog-${index}`}
                    className="bg-white rounded-2xl shadow-lg border border-light-beige overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    {/* Status Badge */}
                    <div className="p-4 pb-0">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        blog.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {blog.published ? '🟢 Published' : '🟡 Draft'}
                      </span>
                    </div>

                    <div className="p-6 pt-4">
                      {/* Category */}
                      {blog.category && (
                        <span className="inline-block bg-dark-brown text-cream px-3 py-1 rounded-full text-sm font-semibold mb-3">
                          {blog.category}
                        </span>
                      )}

                      {/* Title */}
                      <h3 className="text-xl font-bold text-text-dark mb-3 line-clamp-2 font-serif">
                        {blog.title}
                      </h3>

                      {/* Summary */}
                      {blog.summary && (
                        <p className="text-text-medium mb-4 line-clamp-3 text-sm">
                          {blog.summary}
                        </p>
                      )}

                      {/* Meta Info */}
                      <div className="text-sm text-text-medium mb-4 space-y-1">
                        <div className="flex items-center justify-between">
                          <span>📅 {formatDate(blog.createdAt)}</span>
                          <span>⏱️ {getReadingTime(blog.content)} min read</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>📝 {blog.content.split(' ').length} words</span>
                          {blog.updatedAt !== blog.createdAt && (
                            <span className="text-xs">Updated {formatDate(blog.updatedAt)}</span>
                          )}
                        </div>
                      </div>

                      {/* Tags */}
                      {blog.tags && Array.isArray(blog.tags) && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {blog.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="bg-light-beige text-text-dark px-2 py-1 rounded text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                          {blog.tags.length > 3 && (
                            <span className="text-text-medium text-xs">+{blog.tags.length - 3}</span>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        {blogId ? (
                          <>
                            <Link
                              to={`/blog/${blogId}`}
                              className="flex-1 bg-light-beige text-text-dark text-center py-2 rounded-lg font-semibold hover:bg-medium-beige transition-colors text-sm"
                            >
                              👁️ View
                            </Link>
                            <Link
                              to={`/edit/${blogId}`}
                              className="flex-1 bg-dark-brown text-cream text-center py-2 rounded-lg font-semibold hover:bg-text-dark transition-colors text-sm"
                            >
                              ✏️ Edit
                            </Link>
                          </>
                        ) : (
                          <>
                            <div className="flex-1 bg-gray-400 text-white text-center py-2 rounded-lg font-semibold text-sm cursor-not-allowed">
                              👁️ View
                            </div>
                            <div className="flex-1 bg-gray-400 text-white text-center py-2 rounded-lg font-semibold text-sm cursor-not-allowed">
                              ✏️ Edit
                            </div>
                          </>
                        )}
                        <button
                          onClick={() => {
                            setBlogToDelete(blog);
                            setShowDeleteModal(true);
                          }}
                          className="flex-1 bg-red-500 text-white text-center py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors text-sm"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-light-beige rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📝</span>
              </div>
              <h3 className="text-2xl font-bold text-text-dark mb-4">
                {searchTerm || filter !== 'all' ? 'No Blogs Found' : 'No Blogs Yet'}
              </h3>
              <p className="text-text-medium mb-8 max-w-md mx-auto">
                {searchTerm || filter !== 'all' 
                  ? "No blogs match your current filters. Try adjusting your search criteria."
                  : "Start your writing journey by creating your first blog post!"}
              </p>
              <Link
                to="/create"
                className="inline-block bg-dark-brown text-cream px-8 py-3 rounded-lg font-bold hover:bg-text-dark transition-colors"
              >
                ✍️ Write Your First Blog
              </Link>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && blogToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🗑️</span>
                  </div>
                  <h3 className="text-xl font-bold text-text-dark mb-4">Delete Blog Post</h3>
                  <p className="text-text-medium mb-6">
                    Are you sure you want to delete "<strong>{blogToDelete.title}</strong>"? 
                    This action cannot be undone.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setShowDeleteModal(false);
                        setBlogToDelete(null);
                      }}
                      className="flex-1 bg-light-beige text-text-dark py-3 rounded-lg font-semibold hover:bg-medium-beige transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(blogToDelete._id || blogToDelete.id)}
                      className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
