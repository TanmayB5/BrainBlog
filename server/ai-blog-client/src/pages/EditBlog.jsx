import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { blogAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
    summary: "",
    metaDescription: "",
    seoKeywords: "",
    published: true,
    featuredImage: ""
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiResults, setAiResults] = useState({});
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    fetchBlogData();
  }, [id]);

  useEffect(() => {
    // Calculate word count and reading time
    const words = formData.content.trim().split(/\s+/).filter(word => word.length > 0).length;
    setWordCount(words);
    setReadingTime(Math.ceil(words / 200)); // Average reading speed: 200 words per minute
  }, [formData.content]);

  const fetchBlogData = async () => {
    try {
      setIsLoading(true);
      const data = await blogAPI.getBlog(id);
      const blog = data.blog || data;
      setFormData({
        title: blog.title || "",
        content: blog.content || "",
        category: blog.category || "",
        tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags || "",
        summary: blog.summary || "",
        metaDescription: blog.metaDescription || "",
        seoKeywords: blog.seoKeywords || "",
        published: blog.published !== false,
        featuredImage: blog.featuredImage || ""
      });
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Failed to load blog data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // AI Content Generation Functions
  const generateAISummary = async () => {
    if (!formData.content) {
      alert("Please write some content first!");
      return;
    }
    
    setAiLoading(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a smart summary based on content
      const sentences = formData.content.split('.').filter(s => s.trim().length > 0);
      const summary = sentences.slice(0, 2).join('.') + '.';
      
      setFormData(prev => ({
        ...prev,
        summary: summary.length > 150 ? summary.substring(0, 150) + '...' : summary
      }));
      
      setAiResults(prev => ({ ...prev, summary: true }));
      alert('✅ AI summary generated successfully!');
    } catch (error) {
      console.error('AI generation error:', error);
      alert('❌ Failed to generate AI summary. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const generateSEOContent = async () => {
    if (!formData.title || !formData.content) {
      alert("Please add title and content first!");
      return;
    }
    
    setAiLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate SEO-optimized meta description
      const metaDescription = `Discover ${formData.title.toLowerCase()} and learn more about this fascinating topic. Read our comprehensive guide with expert insights and practical tips.`;
      
      // Generate SEO keywords from title and content
      const titleWords = formData.title.toLowerCase().split(' ').filter(word => word.length > 3);
      const contentWords = formData.content.toLowerCase().match(/\b\w{4,}\b/g) || [];
      const topWords = [...new Set([...titleWords, ...contentWords.slice(0, 10)])];
      const seoKeywords = topWords.slice(0, 8).join(', ') + ', blog, guide, tips';
      
      setFormData(prev => ({
        ...prev,
        metaDescription: metaDescription.substring(0, 160),
        seoKeywords
      }));
      
      setAiResults(prev => ({ ...prev, seo: true }));
      alert('✅ SEO content generated successfully!');
    } catch (error) {
      console.error('SEO generation error:', error);
      alert('❌ Failed to generate SEO content. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const enhanceContent = async () => {
    if (!formData.content) {
      alert("Please write some content first!");
      return;
    }
    
    setAiLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate content enhancement
      const enhancedContent = formData.content + 
        "\n\n## Key Takeaways\n\n" +
        "- This article provides comprehensive insights into the topic\n" +
        "- Practical applications and real-world examples are included\n" +
        "- Further reading and resources are recommended for deeper understanding\n\n" +
        "## Conclusion\n\n" +
        "This comprehensive guide covers the essential aspects of the topic, providing readers with valuable insights and practical knowledge to apply in their own context.";
      
      setFormData(prev => ({
        ...prev,
        content: enhancedContent
      }));
      
      setAiResults(prev => ({ ...prev, enhancement: true }));
      alert('✅ Content enhanced successfully!');
    } catch (error) {
      console.error('Content enhancement error:', error);
      alert('❌ Failed to enhance content. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const generateTags = async () => {
    if (!formData.title || !formData.content) {
      alert("Please add title and content first!");
      return;
    }
    
    setAiLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate relevant tags
      const words = (formData.title + ' ' + formData.content).toLowerCase();
      const commonTags = ['technology', 'tutorial', 'guide', 'tips', 'development', 'programming', 'web', 'design', 'business', 'productivity'];
      const relevantTags = commonTags.filter(tag => words.includes(tag));
      
      // Add category as tag if not already included
      if (formData.category && !relevantTags.includes(formData.category.toLowerCase())) {
        relevantTags.unshift(formData.category.toLowerCase());
      }
      
      const generatedTags = relevantTags.slice(0, 5).join(', ');
      
      setFormData(prev => ({
        ...prev,
        tags: generatedTags
      }));
      
      setAiResults(prev => ({ ...prev, tags: true }));
      alert('✅ Tags generated successfully!');
    } catch (error) {
      console.error('Tag generation error:', error);
      alert('❌ Failed to generate tags. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e, published = formData.published) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      alert("Title and content are required!");
      return;
    }
    
    setIsSaving(true);
    try {
      console.log("Updating blog with data:", { ...formData, published });
      
      const blogData = {
        ...formData,
        published,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      };
      
      const response = await blogAPI.updateBlog(id, blogData);
      console.log('Blog updated successfully:', response);
      
      if (published && !formData.published) {
        alert('✅ Draft published successfully!');
      } else if (!published && formData.published) {
        alert('✅ Blog saved as draft successfully!');
      } else {
        alert('✅ Blog updated successfully!');
      }
      
      navigate("/my-blogs");
    } catch (error) {
      console.error("Error updating blog:", error);
      alert(`❌ Error: ${error.message || 'Failed to update blog. Please try again.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAsDraft = (e) => {
    handleSubmit(e, false);
  };

  const handlePublish = (e) => {
    handleSubmit(e, true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-light-beige rounded-full animate-spin"></div>
            <div className="w-16 h-16 border-4 border-dark-brown border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-text-dark font-medium mt-4">Loading blog data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-text-dark mb-4">Error</h1>
          <p className="text-text-medium mb-6">{error}</p>
          <button
            onClick={() => navigate('/my-blogs')}
            className="bg-dark-brown text-cream px-6 py-3 rounded-lg font-semibold hover:bg-text-dark transition-colors"
          >
            Back to My Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-light-beige overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-dark-brown to-text-dark p-6">
              <h1 className="text-3xl font-bold text-cream mb-2">Edit Blog Post</h1>
              <p className="text-light-beige">Update your content with AI-powered enhancements</p>
              
              {/* Stats */}
              <div className="flex items-center space-x-6 mt-4 text-light-beige">
                <span className="flex items-center gap-2">
                  📝 {wordCount} words
                </span>
                <span className="flex items-center gap-2">
                  ⏱️ {readingTime} min read
                </span>
                <span className="flex items-center gap-2">
                  {formData.published ? '🟢 Published' : '🟡 Draft'}
                </span>
              </div>
            </div>

            {/* AI Loading Overlay */}
            {aiLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-2xl text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-brown mx-auto mb-4"></div>
                  <p className="text-text-dark font-medium">⏳ AI is processing your content...</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* AI Panel Toggle */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-text-dark">Content Details</h2>
                <button
                  type="button"
                  onClick={() => setShowAIPanel(!showAIPanel)}
                  className="bg-dark-brown text-cream px-4 py-2 rounded-lg font-semibold hover:bg-text-dark transition-colors flex items-center gap-2"
                >
                  🤖 AI Tools
                  <svg className={`w-4 h-4 transition-transform ${showAIPanel ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* AI Tools Panel */}
              {showAIPanel && (
                <div className="bg-gradient-to-r from-cream to-light-beige p-6 rounded-xl border border-medium-beige">
                  <h3 className="text-lg font-semibold text-text-dark mb-4 flex items-center gap-2">
                    🤖 AI-Powered Content Enhancement
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={generateAISummary}
                      disabled={aiLoading}
                      className="bg-white border border-medium-beige p-4 rounded-lg hover:bg-cream transition-colors text-left disabled:opacity-50"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">📝</span>
                        <span className="font-semibold text-text-dark">Generate Summary</span>
                        {aiResults.summary && <span className="text-green-600">✅</span>}
                      </div>
                      <p className="text-text-medium text-sm">Create an AI-powered summary of your content</p>
                    </button>

                    <button
                      type="button"
                      onClick={generateSEOContent}
                      disabled={aiLoading}
                      className="bg-white border border-medium-beige p-4 rounded-lg hover:bg-cream transition-colors text-left disabled:opacity-50"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🔍</span>
                        <span className="font-semibold text-text-dark">SEO Optimization</span>
                        {aiResults.seo && <span className="text-green-600">✅</span>}
                      </div>
                      <p className="text-text-medium text-sm">Generate SEO meta description and keywords</p>
                    </button>

                    <button
                      type="button"
                      onClick={enhanceContent}
                      disabled={aiLoading}
                      className="bg-white border border-medium-beige p-4 rounded-lg hover:bg-cream transition-colors text-left disabled:opacity-50"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">✨</span>
                        <span className="font-semibold text-text-dark">Enhance Content</span>
                        {aiResults.enhancement && <span className="text-green-600">✅</span>}
                      </div>
                      <p className="text-text-medium text-sm">Improve content structure and add conclusions</p>
                    </button>

                    <button
                      type="button"
                      onClick={generateTags}
                      disabled={aiLoading}
                      className="bg-white border border-medium-beige p-4 rounded-lg hover:bg-cream transition-colors text-left disabled:opacity-50"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🏷️</span>
                        <span className="font-semibold text-text-dark">Generate Tags</span>
                        {aiResults.tags && <span className="text-green-600">✅</span>}
                      </div>
                      <p className="text-text-medium text-sm">Create relevant tags for better discoverability</p>
                    </button>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-medium-beige rounded-lg focus:ring-2 focus:ring-dark-brown focus:border-dark-brown transition-colors bg-cream"
                    placeholder="Enter your blog title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-medium-beige rounded-lg focus:ring-2 focus:ring-dark-brown focus:border-dark-brown transition-colors bg-cream"
                  >
                    <option value="">Select a category</option>
                    <option value="Technology">Technology</option>
                    <option value="Programming">Programming</option>
                    <option value="Web Development">Web Development</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Business">Business</option>
                    <option value="Design">Design</option>
                    <option value="Tutorial">Tutorial</option>
                    <option value="Opinion">Opinion</option>
                    <option value="News">News</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={15}
                  className="w-full px-4 py-3 border border-medium-beige rounded-lg focus:ring-2 focus:ring-dark-brown focus:border-dark-brown transition-colors bg-cream resize-none"
                  placeholder="Write your blog content here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  Summary
                </label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-medium-beige rounded-lg focus:ring-2 focus:ring-dark-brown focus:border-dark-brown transition-colors bg-cream"
                  placeholder="Brief summary of your blog post"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-medium-beige rounded-lg focus:ring-2 focus:ring-dark-brown focus:border-dark-brown transition-colors bg-cream"
                  placeholder="Enter tags separated by commas (e.g., react, javascript, tutorial)"
                />
              </div>

              {/* SEO Section */}
              <div className="bg-light-beige p-6 rounded-xl border border-medium-beige">
                <h3 className="text-lg font-semibold text-text-dark mb-4 flex items-center gap-2">
                  🔍 SEO Settings
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Meta Description
                    </label>
                    <textarea
                      name="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleInputChange}
                      rows={2}
                      maxLength={160}
                      className="w-full px-4 py-3 border border-medium-beige rounded-lg focus:ring-2 focus:ring-dark-brown focus:border-dark-brown transition-colors bg-white"
                      placeholder="Brief description for search engines (max 160 characters)"
                    />
                    <p className="text-text-medium text-sm mt-1">
                      {formData.metaDescription.length}/160 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      SEO Keywords
                    </label>
                    <input
                      type="text"
                      name="seoKeywords"
                      value={formData.seoKeywords}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-medium-beige rounded-lg focus:ring-2 focus:ring-dark-brown focus:border-dark-brown transition-colors bg-white"
                      placeholder="SEO keywords separated by commas"
                    />
                  </div>
                </div>
              </div>

              {/* Publishing Options */}
              <div className="bg-medium-beige p-6 rounded-xl border border-light-beige">
                <h3 className="text-lg font-semibold text-text-dark mb-4">Publishing Options</h3>
                
                <div className="flex items-center space-x-3 mb-4">
                  <input
                    type="checkbox"
                    id="published"
                    name="published"
                    checked={formData.published}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-dark-brown border-2 border-dark-brown rounded focus:ring-dark-brown"
                  />
                  <label htmlFor="published" className="text-text-dark font-medium">
                    Publish immediately
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={handleSaveAsDraft}
                    disabled={isSaving}
                    className="flex-1 bg-white border-2 border-dark-brown text-dark-brown px-6 py-3 rounded-lg font-semibold hover:bg-light-beige transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Saving...' : '💾 Save as Draft'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={isSaving}
                    className="flex-1 bg-dark-brown text-cream px-6 py-3 rounded-lg font-semibold hover:bg-text-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Publishing...' : '🚀 Update & Publish'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
