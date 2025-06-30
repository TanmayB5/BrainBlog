import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { blogAPI } from "../services/api";

export default function Home() {
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [stats, setStats] = useState({ totalBlogs: 0, totalUsers: 0, totalViews: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
    // eslint-disable-next-line
  }, []);

  const fetchHomeData = async () => {
    try {
      // Correct API function name
      const blogsData = await blogAPI.getBlogs('?limit=6');
      setFeaturedBlogs(blogsData.blogs?.slice(0, 6) || []);
      setStats({
        totalBlogs: 1247,
        totalUsers: 856,
        totalViews: 45230
      });
    } catch (error) {
      console.error('Error fetching home data:', error);
      setFeaturedBlogs([]);
      setStats({
        totalBlogs: 0,
        totalUsers: 0,
        totalViews: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-light-beige">
        <div className="absolute inset-0 bg-medium-beige/30"></div>
        <div className="relative w-full px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center max-w-7xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-text-dark mb-6 leading-tight">
              Write Smarter Blogs
              <span className="block text-dark-brown mt-2">with AI Intelligence</span>
            </h1>
            <p className="text-xl md:text-2xl text-text-medium mb-8 max-w-3xl mx-auto leading-relaxed">
              Create compelling content with AI-powered summarization, SEO optimization, 
              and intelligent writing assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/register"
                className="px-10 py-5 bg-dark-brown text-cream font-bold rounded-2xl hover:bg-text-dark transform hover:scale-105 transition-all duration-300 shadow-xl text-lg"
              >
                🚀 Start Writing with AI
              </Link>
              <Link
                to="/blogs"
                className="px-10 py-5 bg-medium-beige text-text-dark font-bold rounded-2xl hover:bg-light-beige transform hover:scale-105 transition-all duration-300 border-2 border-dark-brown text-lg"
              >
                📚 Explore Blogs
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center bg-white/80 rounded-xl p-4 border border-light-beige">
                <div className="text-3xl font-bold text-dark-brown">{stats.totalBlogs.toLocaleString()}</div>
                <div className="text-text-medium font-medium">AI-Enhanced Blogs</div>
              </div>
              <div className="text-center bg-white/80 rounded-xl p-4 border border-light-beige">
                <div className="text-3xl font-bold text-dark-brown">{stats.totalUsers.toLocaleString()}</div>
                <div className="text-text-medium font-medium">Active Writers</div>
              </div>
              <div className="text-center bg-white/80 rounded-xl p-4 border border-light-beige">
                <div className="text-3xl font-bold text-dark-brown">{stats.totalViews.toLocaleString()}</div>
                <div className="text-text-medium font-medium">Monthly Views</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-20 bg-light-beige">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-text-dark mb-6">
                🤖 AI-Powered Features
              </h2>
              <p className="text-xl text-text-medium max-w-3xl mx-auto">
                Transform your writing process with cutting-edge AI technology
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-medium-beige hover:border-dark-brown">
                <div className="w-16 h-16 bg-dark-brown rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-3xl">📝</span>
                </div>
                <h3 className="text-xl font-bold text-text-dark mb-4">AI Summarization</h3>
                <p className="text-text-medium">
                  Generate intelligent summaries that capture the essence of your content in seconds.
                </p>
              </div>
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-medium-beige hover:border-dark-brown">
                <div className="w-16 h-16 bg-dark-brown rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="text-xl font-bold text-text-dark mb-4">SEO Optimization</h3>
                <p className="text-text-medium">
                  Boost your search rankings with AI-generated meta descriptions and keywords.
                </p>
              </div>
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-medium-beige hover:border-dark-brown">
                <div className="w-16 h-16 bg-dark-brown rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-3xl">✨</span>
                </div>
                <h3 className="text-xl font-bold text-text-dark mb-4">Content Enhancement</h3>
                <p className="text-text-medium">
                  Improve readability, grammar, and style with intelligent suggestions.
                </p>
              </div>
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-medium-beige hover:border-dark-brown">
                <div className="w-16 h-16 bg-dark-brown rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-text-dark mb-4">Writing Assistant</h3>
                <p className="text-text-medium">
                  Get creative suggestions, outlines, and writing prompts powered by AI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-cream">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-text-dark mb-6">
                How It Works
              </h2>
              <p className="text-xl text-text-medium max-w-3xl mx-auto">
                Create professional blogs in minutes with our AI-powered workflow
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-12 items-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-dark-brown rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <span className="text-3xl font-bold text-cream">1</span>
                </div>
                <h3 className="text-2xl font-bold text-text-dark mb-4">Write</h3>
                <p className="text-text-medium text-lg">Start with your ideas and content</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-dark-brown rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <span className="text-3xl font-bold text-cream">2</span>
                </div>
                <h3 className="text-2xl font-bold text-text-dark mb-4">Enhance</h3>
                <p className="text-text-medium text-lg">AI improves and optimizes your content</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-dark-brown rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <span className="text-3xl font-bold text-cream">3</span>
                </div>
                <h3 className="text-2xl font-bold text-text-dark mb-4">Publish</h3>
                <p className="text-text-medium text-lg">Share your polished blog with the world</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section className="py-20 bg-light-beige">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-text-dark mb-6">
                ✨ Featured Blogs
              </h2>
              <p className="text-xl text-text-medium max-w-3xl mx-auto">
                Discover amazing content created with our AI-powered platform
              </p>
            </div>
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl p-6 shadow-lg animate-pulse border border-medium-beige">
                    <div className="h-4 bg-medium-beige rounded mb-4"></div>
                    <div className="h-6 bg-light-beige rounded mb-4"></div>
                    <div className="h-20 bg-medium-beige rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredBlogs.map((blog) => (
                  <Link
                    key={blog.id}
                    to={`/blog/${blog.id}`}
                    className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-medium-beige hover:border-dark-brown transform hover:scale-105"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-light-beige text-dark-brown px-4 py-2 rounded-full text-sm font-bold">
                        {blog.category || 'General'}
                      </span>
                      <span className="text-sm text-text-medium font-medium">
                        {blog.readingTime || Math.ceil(blog.content.split(' ').length / 200)} min read
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-text-dark mb-3 group-hover:text-dark-brown transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-text-medium mb-4 line-clamp-3">
                      {blog.summary || blog.content.substring(0, 150)}...
                    </p>
                    <div className="flex items-center justify-between text-sm text-text-medium">
                      <span className="font-medium">By {blog.author?.name || blog.user?.name || 'Anonymous'}</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          👁️ {blog.views || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          ❤️ {blog.likes || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <div className="text-center mt-12">
              <Link
                to="/blogs"
                className="px-10 py-4 bg-dark-brown text-cream font-bold rounded-2xl hover:bg-text-dark transform hover:scale-105 transition-all duration-300 shadow-xl text-lg"
              >
                View All Blogs →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-dark-brown">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-cream mb-6">
              Ready to Create Your First AI-Enhanced Blog?
            </h2>
            <p className="text-xl text-light-beige mb-8 max-w-2xl mx-auto">
              Join thousands of writers who are already using AI to create better content faster.
            </p>
            <Link
              to="/register"
              className="inline-block px-12 py-6 bg-cream text-text-dark font-bold rounded-2xl hover:bg-light-beige transform hover:scale-105 transition-all duration-300 shadow-2xl text-xl"
            >
              🚀 Get Started Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
