// controllers/blogController.js

const OpenAI = require('openai');
const supabase = require('../supabaseClient');

// Initialize OpenAI client only if API key is available
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

exports.createBlog = async (req, res) => {
  try {
    const { title, content, category, tags, summary, published } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    if (title.length < 5) {
      return res.status(400).json({ message: 'Title must be at least 5 characters long' });
    }
    if (content.length < 50) {
      return res.status(400).json({ message: 'Content must be at least 50 characters long' });
    }

    // Process tags - convert array to comma-separated string
    const processedTags = Array.isArray(tags) ? tags.join(', ') : (typeof tags === 'string' ? tags : '');

    // Create blog
    const { data, error } = await supabase.from('blog').insert([
      {
        title: title.trim(),
        content: content.trim(),
        summary: summary?.trim() || null,
        authorid: req.user.userId,
        category: category || null,
        tags: processedTags || null,
        published: published || false
      }
    ]).select('*').single();

    if (error) {
      console.error('Create blog error:', error);
      return res.status(500).json({ message: 'Server error creating blog', error: error.message });
    }

    res.status(201).json({
      message: 'Blog created successfully',
      blog: data
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ message: 'Server error creating blog' });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, sort = 'newest' } = req.query;
    let query = supabase.from('blog').select('*, user:id(name, email)').eq('published', true);

    if (category) {
      query = query.eq('category', category);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,tags.ilike.%${search}%`);
    }

    switch (sort) {
      case 'oldest':
        query = query.order('createdat', { ascending: true });
        break;
      case 'title':
        query = query.order('title', { ascending: true });
        break;
      default:
        query = query.order('createdat', { ascending: false });
    }

    const from = (page - 1) * limit;
    const to = from + parseInt(limit) - 1;
    query = query.range(from, to);

    const { data: blogs, error, count } = await query;
    if (error) {
      console.error('Get blogs error:', error);
      return res.status(500).json({ message: 'Server error fetching blogs', error: error.message });
    }

    // Get total count for pagination
    const { count: total } = await supabase.from('blog').select('*', { count: 'exact', head: true }).eq('published', true);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      blogs,
      currentPage: parseInt(page),
      totalPages,
      totalBlogs: total,
      hasNext: page < totalPages,
      hasPrev: page > 1
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ message: 'Server error fetching blogs' });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: blog, error } = await supabase.from('blog').select('*, user:id(name, email)').eq('id', id).single();
    if (error) {
      return res.status(404).json({ message: 'Blog not found', error: error.message });
    }
    res.status(200).json({ blog });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ message: 'Server error fetching blog' });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, tags, summary, published } = req.body;

    // Fetch existing blog
    const { data: existingBlog, error: fetchError } = await supabase.from('blog').select('*').eq('id', id).single();
    if (fetchError || !existingBlog) {
      return res.status(404).json({ message: 'Blog not found', error: fetchError?.message });
    }

    // Check ownership
    if (existingBlog.authorid !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this blog' });
    }

    // Validation
    if (title && title.length < 5) {
      return res.status(400).json({ message: 'Title must be at least 5 characters long' });
    }
    if (content && content.length < 50) {
      return res.status(400).json({ message: 'Content must be at least 50 characters long' });
    }

    // Process tags
    const processedTags = Array.isArray(tags) ? tags.join(', ') : (typeof tags === 'string' ? tags : existingBlog.tags);

    // Update blog
    const { data: blog, error } = await supabase.from('blog').update({
      ...(title && { title: title.trim() }),
      ...(content && { content: content.trim() }),
      ...(summary !== undefined && { summary: summary?.trim() || null }),
      ...(category !== undefined && { category: category || null }),
      ...(tags !== undefined && { tags: processedTags }),
      ...(published !== undefined && { published })
    }).eq('id', id).select('*').single();

    if (error) {
      return res.status(500).json({ message: 'Server error updating blog', error: error.message });
    }

    res.status(200).json({ message: 'Blog updated successfully', blog });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ message: 'Server error updating blog' });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await supabase.from('blog').delete().eq('id', id);

    if (blog.error) {
      return res.status(404).json({ message: 'Blog not found', error: blog.error.message });
    }

    // Check ownership
    if (blog.data.authorid !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this blog' });
    }

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ message: 'Server error deleting blog' });
  }
};

exports.getMyBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const { data: blogs, error } = await supabase.from('blog').select('*, user:id(name, email)').eq('authorid', req.user.userId).order('updatedat', { ascending: false }).range(skip, skip + parseInt(limit) - 1);
    if (error) {
      console.error('Get user blogs error:', error);
      return res.status(500).json({ message: 'Server error fetching user blogs', error: error.message });
    }

    const { count: total } = await supabase.from('blog').select('*', { count: 'exact', head: true }).eq('authorid', req.user.userId);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      blogs,
      currentPage: parseInt(page),
      totalPages,
      totalBlogs: total
    });
  } catch (error) {
    console.error('Get user blogs error:', error);
    res.status(500).json({ message: 'Server error fetching user blogs' });
  }
};

// Optional: Implement or remove these if not used
exports.generateAIContent = async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};
exports.publishDraft = async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

exports.incrementBlogViews = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: blog, error } = await supabase.from('blog').update({ views: { increment: 1 } }).eq('id', id).select('views').single();
    if (error) {
      console.error('Increment blog views error:', error);
      return res.status(500).json({ message: 'Server error incrementing blog views' });
    }
    res.status(200).json({ views: blog.views });
  } catch (error) {
    console.error('Increment blog views error:', error);
    res.status(500).json({ message: 'Server error incrementing blog views' });
  }
};

exports.incrementBlogLikes = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: blog, error } = await supabase.from('blog').update({ likes: { increment: 1 } }).eq('id', id).select('likes').single();
    if (error) {
      console.error('Increment blog likes error:', error);
      return res.status(500).json({ message: 'Server error incrementing blog likes' });
    }
    res.status(200).json({ likes: blog.likes });
  } catch (error) {
    console.error('Increment blog likes error:', error);
    res.status(500).json({ message: 'Server error incrementing blog likes' });
  }
};

exports.generateSummary = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.length < 20) {
      return res.status(400).json({ message: 'Content is too short for summarization.' });
    }
    
    // Check if OpenAI client is available
    if (!openai) {
      return res.status(503).json({ 
        message: 'AI summary service is not available. Please set OPENAI_API_KEY environment variable.' 
      });
    }
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Summarize the following blog content in 2-3 sentences.' },
        { role: 'user', content }
      ],
      max_tokens: 100
    });
    
    const summary = completion.choices[0].message.content.trim();
    res.json({ summary });
  } catch (error) {
    console.error('OpenAI summary error:', error);
    res.status(500).json({ message: 'Failed to generate summary' });
  }
};

module.exports = {
  createBlog: exports.createBlog,
  getAllBlogs: exports.getAllBlogs,
  getBlogById: exports.getBlogById,
  updateBlog: exports.updateBlog,
  deleteBlog: exports.deleteBlog,
  getMyBlogs: exports.getMyBlogs,
  generateAIContent: exports.generateAIContent,
  publishDraft: exports.publishDraft,
  incrementBlogViews: exports.incrementBlogViews,
  incrementBlogLikes: exports.incrementBlogLikes,
  generateSummary: exports.generateSummary
};
