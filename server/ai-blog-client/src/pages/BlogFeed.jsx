import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function BlogFeed() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { isAuthenticated } = useAuth();

  const categories = [
    'All', 'Technology', 'Programming', 'Web Development', 
    'AI & Machine Learning', 'Business', 'Design', 'Tutorial', 
    'Opinion', 'News', 'Other'
  ];

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, selectedCategory, sortBy, searchTerm]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 9,
        ...(selectedCategory && selectedCategory !== 'All' && { category: selectedCategory }),
        ...(searchTerm && { search: searchTerm }),
        sort: sortBy
      });
      const data = await blogAPI.getBlogs(`?${params}`);
      setBlogs(data.blogs || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      setError('Failed to load blogs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content) => {
    const words = content.split(' ').length;
    return Math.ceil(words / 200);
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-16 h-16 border-4 border-light-beige rounded-full animate-spin"></div>
                <div className="w-16 h-16 border-4 border-dark-brown border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
              <p className="text-text-dark font-medium mt-4">Loading amazing blogs...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-dark-brown to-text-dark py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-cream mb-4 font-serif">
              Discover Amazing Stories
            </h1>
            <p className="text-xl text-light-beige mb-8 max-w-2xl mx-auto">
              Explore our collection of insightful articles, tutorials, and stories from passionate writers
            </p>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="inline-block bg-cream text-dark-brown px-8 py-3 rounded-lg font-bold hover:bg-light-beige transition-colors"
              >
                Join Our Community
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-lg border border-light-beige p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search blogs..."
                  className="flex-1 px-4 py-3 border border-medium-beige rounded-lg focus:ring-2 focus:ring-dark-brown focus:border-dark-brown transition-colors bg-cream"
                />
                <button
                  type="submit"
                  className="bg-dark-brown text-cream px-6 py-3 rounded-lg font-semibold hover:bg-text-dark transition-colors"
                >
                  🔍
                </button>
              </form>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-3 border border-medium-beige rounded-lg focus:ring-2 focus:ring-dark-brown focus:border-dark-brown transition-colors bg-cream"
              >
                {categories.map(category => (
                  <option key={category} value={category === 'All' ? '' : category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-3 border border-medium-beige rounded-lg focus:ring-2 focus:ring-dark-brown focus:border-dark-brown transition-colors bg-cream"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
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

          {/* Blog Grid */}
          {blogs.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {blogs.map((blog, index) => {
                  const blogId = blog._id || blog.id;
                  return (
                    <article
                      key={blogId || `blog-${index}`}
                      className="bg-white rounded-2xl shadow-lg border border-light-beige overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 relative"
                    >
                      {/* Signup Required Badge */}
                      {!isAuthenticated && blogId && (
                        <div className="absolute top-4 right-4 z-10">
                          <span className="bg-gradient-to-r from-dark-brown to-text-dark text-cream px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            🔐 Sign Up Required
                          </span>
                        </div>
                      )}
                      {/* Featured Image */}
                      {blog.featuredImage && (
                        <div className="h-48 bg-gradient-to-r from-light-beige to-medium-beige">
                          <img
                            src={blog.featuredImage}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <div className="p-6">
                        {/* Category Badge */}
                        {blog.category && (
                          <span className="inline-block bg-dark-brown text-cream px-3 py-1 rounded-full text-sm font-semibold mb-3">
                            {blog.category}
                          </span>
                        )}
                        {/* Title */}
                        <h2 className="text-xl font-bold text-text-dark mb-3 line-clamp-2 font-serif">
                          {blogId ? (
                            <Link
                              to={isAuthenticated ? `/blog/${blogId}` : "/register"}
                              className="hover:text-dark-brown transition-colors cursor-pointer block"
                            >
                              {blog.title}
                            </Link>
                          ) : (
                            <span className="text-text-dark">{blog.title}</span>
                          )}
                        </h2>
                        {/* Summary */}
                        {blog.summary && (
                          <p className="text-text-medium mb-4 line-clamp-3">
                            {blog.summary}
                          </p>
                        )}
                        {/* Tags */}
                        {blog.tags && Array.isArray(blog.tags) && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {blog.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="bg-light-beige text-text-dark px-2 py-1 rounded text-xs font-medium"
                              >
                                #{tag}
                              </span>
                            ))}
                            {blog.tags.length > 3 && (
                              <span className="text-text-medium text-xs">
                                +{blog.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-sm text-text-medium border-t border-light-beige pt-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-dark-brown text-cream rounded-full flex items-center justify-center text-xs font-bold">
                              {blog.author?.name?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                            <span>{blog.author?.name || 'Anonymous'}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              📅 {formatDate(blog.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              ⏱️ {getReadingTime(blog.content)} min
                            </span>
                          </div>
                        </div>
                        {/* Read More Button */}
                        {blogId ? (
                          <Link
                            to={isAuthenticated ? `/blog/${blogId}` : "/register"}
                            className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors mt-4 cursor-pointer ${
                              isAuthenticated 
                                ? "bg-dark-brown text-cream hover:bg-text-dark"
                                : "bg-gradient-to-r from-dark-brown to-text-dark text-cream hover:from-text-dark hover:to-dark-brown"
                            }`}
                          >
                            {isAuthenticated ? "Read Full Article" : "🔐 Sign Up to Read Full Article"}
                          </Link>
                        ) : (
                          <div className="block w-full bg-gray-400 text-white text-center py-3 rounded-lg font-semibold mt-4 cursor-not-allowed">
                            Read Full Article
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border border-medium-beige rounded-lg text-text-dark hover:bg-light-beige transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        currentPage === page
                          ? 'bg-dark-brown text-cream'
                          : 'bg-white border border-medium-beige text-text-dark hover:bg-light-beige'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white border border-medium-beige rounded-lg text-text-dark hover:bg-light-beige transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-light-beige rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📚</span>
              </div>
              <h3 className="text-2xl font-bold text-text-dark mb-4">No Blogs Found</h3>
              <p className="text-text-medium mb-8 max-w-md mx-auto">
                {searchTerm || selectedCategory
                  ? "No blogs match your current filters. Try adjusting your search criteria."
                  : "No blogs have been published yet. Be the first to share your story!"}
              </p>
              {isAuthenticated && (
                <Link
                  to="/create"
                  className="inline-block bg-dark-brown text-cream px-8 py-3 rounded-lg font-bold hover:bg-text-dark transition-colors"
                >
                  Write Your First Blog
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
