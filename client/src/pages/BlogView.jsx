import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { blogAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function BlogView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [blog, setBlog] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(0);

  useEffect(() => {
    console.log('BlogView useEffect triggered with id:', id, 'type:', typeof id);
    
    // Check if ID is valid before proceeding
    if (!id || id === 'undefined' || id.trim() === '') {
      console.log('Invalid ID detected, redirecting to blogs page');
      setError('Blog ID is missing');
      setIsLoading(false);
      
      // Start countdown
      setRedirectCountdown(3);
      const countdownInterval = setInterval(() => {
        setRedirectCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            navigate('/blogs');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(countdownInterval);
    }
    
    fetchBlog();
    blogAPI.incrementView(id).catch(() => {}); // Increment view count on mount
  }, [id, navigate]);

  const fetchBlog = async () => {
    try {
      console.log('fetchBlog called with id:', id);
      
      // Safety check - prevent API call with invalid ID
      if (!id || id === 'undefined' || id.trim() === '') {
        console.log('Invalid ID detected in fetchBlog, returning early');
        setError('Blog ID is missing');
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      const data = await blogAPI.getBlog(id);
      setBlog(data.blog || data);
      setRelatedPosts(data.relatedPosts || []);
      setLikesCount(data.blog?.likesCount || 0);
      setComments(data.blog?.comments || []);
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Failed to load blog. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('Please login to like this post');
      return;
    }
    try {
      const response = await blogAPI.incrementLike(id);
      setLikesCount(response.likes);
      setIsLiked(true);
    } catch (error) {
      console.error('Error incrementing like:', error);
      alert('Failed to update like. Please try again.');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!isAuthenticated) {
      alert('Please login to comment');
      return;
    }

    setIsSubmittingComment(true);
    try {
      const response = await blogAPI.addComment(id, newComment.trim());
      setComments([response.comment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📖</div>
          <p className="text-xl text-text-dark">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-text-dark mb-4">
            {error === 'Blog ID is missing' ? 'Invalid Blog URL' : 'Blog Not Found'}
          </h2>
          <p className="text-text-medium mb-4">
            {error === 'Blog ID is missing' 
              ? `The blog URL is invalid. Redirecting to blogs page in ${redirectCountdown} seconds...` 
              : error || 'The blog you are looking for does not exist.'}
          </p>
          <Link to="/blogs" className="text-dark-brown hover:text-text-dark font-semibold">
            ← Back to All Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-dark-brown hover:text-text-dark mb-8 transition-colors font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          {/* Blog Article */}
          <article className="bg-white rounded-2xl shadow-xl border-2 border-light-beige overflow-hidden">
            <div className="p-8">
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-text-medium mb-6">
                <span className="bg-light-beige text-text-dark px-3 py-1 rounded-full font-semibold">
                  {blog.category || 'General'}
                </span>
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-1">
                  👁️ {blog.views || 0} views
                </span>
                <span className="flex items-center gap-1">
                  ⏱️ {blog.readingTime || Math.ceil(blog.content.split(' ').length / 200)} min read
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-6 leading-tight">
                {blog.title}
              </h1>

              {/* Author & Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-8 border-b-2 border-light-beige">
                <div className="flex items-center gap-3 mb-4 sm:mb-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-dark-brown to-text-dark rounded-full flex items-center justify-center text-cream font-bold text-lg">
                    {(blog.author?.name || blog.user?.name || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-text-dark">
                      {blog.author?.name || blog.user?.name || 'Anonymous'}
                    </p>
                    <p className="text-sm text-text-medium">Author</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 bg-dark-brown text-cream rounded-lg hover:bg-text-dark transition-colors font-semibold border-2 border-dark-brown"
                  >
                    <span>🔗</span>
                    Share
                  </button>
                </div>
              </div>

              {/* Like Button (before comments) */}
              <div className="flex items-center mb-6">
                <button
                  onClick={handleLike}
                  className={`px-3 py-2 rounded-full text-2xl transition-colors ${isLiked ? 'bg-pink-500 text-white' : 'bg-light-beige text-text-dark hover:bg-pink-100'}`}
                  disabled={isLiked}
                  aria-label="Like this blog"
                >
                  ❤️
                </button>
                <span className="ml-2 text-text-medium text-lg">{likesCount}</span>
              </div>

              {/* Tags */}
              {blog.tags && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {(Array.isArray(blog.tags) ? blog.tags : blog.tags.split(',')).map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-light-beige text-text-dark rounded-full text-sm hover:bg-medium-beige transition-colors cursor-pointer font-medium"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Summary */}
              {blog.summary && (
                <div className="bg-light-beige border-l-4 border-dark-brown p-6 mb-8 rounded-r-xl">
                  <h3 className="font-bold text-text-dark mb-2 flex items-center gap-2">
                    <span>📝</span> Summary
                  </h3>
                  <p className="text-text-medium leading-relaxed">{blog.summary}</p>
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap leading-relaxed text-text-dark text-lg">
                  {blog.content}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-12 pt-8 border-t-2 border-light-beige">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/create"
                    className="px-8 py-4 bg-gradient-to-r from-dark-brown to-text-dark text-cream rounded-xl font-bold hover:from-text-dark hover:to-dark-brown transition-all duration-200 text-center"
                  >
                    ✍️ Write Your Own Blog
                  </Link>
                  
                  <Link
                    to="/blogs"
                    className="px-8 py-4 border-2 border-medium-beige text-text-dark rounded-xl font-bold hover:bg-light-beige hover:border-dark-brown transition-all duration-200 text-center"
                  >
                    📚 View All Blogs
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* Comments Section */}
          <div className="mt-12 bg-white rounded-2xl shadow-xl border-2 border-light-beige p-8">
            <h3 className="text-2xl font-bold text-text-dark mb-6 flex items-center gap-2">
              <span>💬</span> Comments ({comments.length})
            </h3>

            {/* Add Comment Form */}
            {isAuthenticated ? (
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-dark-brown to-text-dark rounded-full flex items-center justify-center text-cream font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-medium-beige rounded-xl focus:ring-2 focus:ring-dark-brown focus:border-dark-brown resize-none bg-cream"
                      disabled={isSubmittingComment}
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        type="submit"
                        disabled={isSubmittingComment || !newComment.trim()}
                        className="px-6 py-2 bg-dark-brown text-cream rounded-lg hover:bg-text-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                      >
                        {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="mb-8 p-6 bg-light-beige rounded-xl text-center border-2 border-medium-beige">
                <p className="text-text-medium">
                  Please <Link to="/login" className="text-dark-brown hover:text-text-dark font-semibold">login</Link> to leave a comment.
                </p>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length === 0 ? (
                <p className="text-text-medium text-center py-8">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-medium-beige to-light-beige rounded-full flex items-center justify-center text-text-dark font-bold">
                      {comment.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="bg-light-beige rounded-xl p-4 border border-medium-beige">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-text-dark">
                            {comment.user?.name || 'Anonymous'}
                          </h4>
                          <span className="text-sm text-text-medium">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-text-medium whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-text-dark mb-6 text-center">
                📖 Related Posts
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {relatedPosts.slice(0, 4).map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.id}`}
                    className="group block bg-white rounded-xl border-2 border-light-beige hover:border-dark-brown hover:shadow-lg transition-all duration-200 p-6"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-light-beige text-text-dark px-2 py-1 rounded-full text-xs font-semibold">
                        {post.category || 'General'}
                      </span>
                      <span className="text-sm text-text-medium">
                        {post.readingTime || Math.ceil(post.content.split(' ').length / 200)} min read
                      </span>
                    </div>
                    
                    <h4 className="text-lg font-bold text-text-dark mb-2 group-hover:text-dark-brown transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    
                    <p className="text-text-medium text-sm line-clamp-3 mb-4">
                      {post.summary || post.content.substring(0, 120)}...
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-text-medium">
                      <span>By {post.author?.name || post.user?.name || 'Anonymous'}</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          👁️ {post.views || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          ❤️ {post._count?.likes || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
