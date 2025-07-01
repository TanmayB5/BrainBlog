// controllers/blogController.js

const supabase = require('../supabaseClient');

// Initialize Hugging Face client
let hfApiKey = process.env.HUGGINGFACE_API_KEY;
let useHuggingFace = !!hfApiKey;

// Fallback to OpenAI if Hugging Face is not configured
let openai = null;
if (!useHuggingFace && process.env.OPENAI_API_KEY) {
  const OpenAI = require('openai');
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  useHuggingFace = false;
}

// Helper function to call Hugging Face API with fallback models
async function callHuggingFaceAPI(prompt, primaryModel, fallbackModels = []) {
  const models = [primaryModel, ...fallbackModels];
  
  for (const model of models) {
    try {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${model}`,
        {
          headers: {
            Authorization: `Bearer ${hfApiKey}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({ inputs: prompt }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        if (response.status === 503) {
          console.log(`[AI] Model ${model} is loading, trying next...`);
          continue;
        }
        throw new Error(`Hugging Face API error: ${error}`);
      }

      const result = await response.json();
      const output = result[0]?.generated_text || result[0]?.summary_text || result[0]?.text || '';
      
      if (output && output.trim()) {
        console.log(`[AI] Success with model: ${model}`);
        return output;
      }
    } catch (error) {
      console.log(`[AI] Failed with model ${model}: ${error.message}`);
      if (model === models[models.length - 1]) {
        throw error;
      }
    }
  }
  
  throw new Error('All models failed');
}

// Helper function to call OpenAI API (fallback)
async function callOpenAIAPI(messages, maxTokens = 150) {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
    max_tokens: maxTokens,
    temperature: 0.3
  });

  return completion.choices[0].message.content.trim();
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
    console.log('[getAllBlogs] Query params:', req.query);
    const { page = 1, limit = 10, category, search, sort = 'newest' } = req.query;
    let query = supabase.from('blog').select('*').eq('published', true);

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

    console.log('[getAllBlogs] Supabase query range:', { from, to });
    const { data: blogs, error, count } = await query;
    console.log('[getAllBlogs] Blogs data:', blogs);
    if (error) {
      console.error('[getAllBlogs] Get blogs error:', error);
      return res.status(500).json({ message: 'Server error fetching blogs', error: error.message });
    }

    // Get total count for pagination
    const { count: total } = await supabase.from('blog').select('*', { count: 'exact', head: true }).eq('published', true);
    const totalPages = Math.ceil(total / parseInt(limit));

    console.log('[getAllBlogs] Pagination:', { total, totalPages });
    res.status(200).json({
      blogs,
      currentPage: parseInt(page),
      totalPages,
      totalBlogs: total,
      hasNext: page < totalPages,
      hasPrev: page > 1
    });
  } catch (error) {
    console.error('[getAllBlogs] Exception:', error);
    res.status(500).json({ message: 'Server error fetching blogs' });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: blog, error } = await supabase.from('blog').select('*').eq('id', id).single();
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

    // Fetch the blog first
    const { data: blog, error: fetchError } = await supabase.from('blog').select('*').eq('id', id).single();
    if (fetchError || !blog) {
      return res.status(404).json({ message: 'Blog not found', error: fetchError?.message });
    }

    // Check ownership
    if (blog.authorid !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this blog' });
    }

    // Now delete
    const { error: deleteError } = await supabase.from('blog').delete().eq('id', id);
    if (deleteError) {
      return res.status(500).json({ message: 'Server error deleting blog', error: deleteError.message });
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

    const { data: blogs, error } = await supabase.from('blog').select('*').eq('authorid', req.user.userId).order('updatedat', { ascending: false }).range(skip, skip + parseInt(limit) - 1);
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
    // Fetch current views
    const { data: blog, error: fetchError } = await supabase.from('blog').select('views').eq('id', id).single();
    if (fetchError || !blog) {
      return res.status(404).json({ message: 'Blog not found', error: fetchError?.message });
    }
    const newViews = (blog.views || 0) + 1;
    const { data: updated, error } = await supabase.from('blog').update({ views: newViews }).eq('id', id).select('views').single();
    if (error) {
      return res.status(500).json({ message: 'Server error incrementing blog views' });
    }
    res.status(200).json({ views: updated.views });
  } catch (error) {
    console.error('Increment blog views error:', error);
    res.status(500).json({ message: 'Server error incrementing blog views' });
  }
};

exports.incrementBlogLikes = async (req, res) => {
  try {
    const { id } = req.params;
    // Fetch current likes
    const { data: blog, error: fetchError } = await supabase.from('blog').select('likes').eq('id', id).single();
    if (fetchError || !blog) {
      return res.status(404).json({ message: 'Blog not found', error: fetchError?.message });
    }
    const newLikes = (blog.likes || 0) + 1;
    const { data: updated, error } = await supabase.from('blog').update({ likes: newLikes }).eq('id', id).select('likes').single();
    if (error) {
      return res.status(500).json({ message: 'Server error incrementing blog likes' });
    }
    res.status(200).json({ likes: updated.likes });
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

    if (!useHuggingFace && !openai) {
      console.error('No AI service configured.');
      return res.status(503).json({ message: 'AI summary service is not available. Please set HUGGINGFACE_API_KEY or OPENAI_API_KEY in your server .env file.' });
    }

    let summary;
    
    if (useHuggingFace) {
      // Use Hugging Face for summarization with better prompt
      const prompt = `Summarize the following blog content in exactly 2-3 sentences, maximum 150 characters: ${content}`;
      console.log('[AI SUMMARY] Using Hugging Face API...');
      
      try {
        summary = await callHuggingFaceAPI(
          prompt, 
          "facebook/bart-large-cnn",
          ["sshleifer/distilbart-cnn-12-6", "facebook/bart-base"]
        );
      } catch (error) {
        console.log('[AI SUMMARY] All summarization models failed, trying text generation...');
        summary = await callHuggingFaceAPI(
          `Summarize this in 2-3 sentences: ${content}`,
          "sshleifer/distilbart-cnn-12-6",
          ["facebook/bart-base", "facebook/bart-large-cnn"]
        );
      }
      
      // Post-process to ensure it's concise
      if (summary && summary.length > 150) {
        const sentences = summary.split('.').filter(s => s.trim().length > 0);
        summary = sentences.slice(0, 2).join('.') + '.';
        if (summary.length > 150) {
          summary = summary.substring(0, 147) + '...';
        }
      }
    } else {
      // Fallback to OpenAI
      const prompt = `Please provide a concise summary of the following blog content in exactly 2-3 sentences, maximum 150 characters:

${content}

Summary:`;
      
      console.log('[AI SUMMARY] Using OpenAI API...');
      summary = await callOpenAIAPI([
        { 
          role: 'system', 
          content: 'You are a helpful assistant that creates concise, engaging summaries of blog content. Keep summaries under 150 characters when possible.' 
        },
        { role: 'user', content: prompt }
      ], 150);
    }
    
    console.log('[AI SUMMARY] Generated summary:', summary);
    res.json({ summary });
  } catch (error) {
    console.error('AI summary error:', error);
    res.status(500).json({ message: 'Failed to generate summary', error: error.message });
  }
};

exports.generateSEOContent = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    if (!useHuggingFace && !openai) {
      return res.status(503).json({ message: 'AI service not available. Set HUGGINGFACE_API_KEY or OPENAI_API_KEY.' });
    }

    let result;
    
    if (useHuggingFace) {
      const prompt = `Generate SEO content for this blog post:
Title: ${title}
Content: ${content.substring(0, 500)}

Provide:
1. Meta Description (max 160 characters)
2. SEO Keywords (8 keywords, comma-separated)

Format:
Meta Description: [description]
SEO Keywords: [keywords]`;
      
      result = await callHuggingFaceAPI(
        prompt, 
        "sshleifer/distilbart-cnn-12-6",
        ["facebook/bart-base", "facebook/bart-large-cnn"]
      );
    } else {
      const prompt = `Please provide SEO optimization for the following blog post:

Title: ${title}
Content: ${content.substring(0, 1000)}...

Please provide:
1. Meta Description: A compelling meta description (max 160 characters)
2. SEO Keywords: 8 relevant keywords separated by commas

Format your response as:
Meta Description: [your meta description here]
SEO Keywords: [your keywords here]`;
      
      result = await callOpenAIAPI([
        { 
          role: 'system', 
          content: 'You are an SEO expert. Provide clear, actionable SEO recommendations with proper formatting.' 
        },
        { role: 'user', content: prompt }
      ], 200);
    }
    
    res.json({ result });
  } catch (error) {
    console.error('AI SEO error:', error);
    res.status(500).json({ message: 'Failed to generate SEO content', error: error.message });
  }
};

exports.enhanceContent = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required.' });
    }

    if (!useHuggingFace && !openai) {
      return res.status(503).json({ message: 'AI service not available. Set HUGGINGFACE_API_KEY or OPENAI_API_KEY.' });
    }

    let enhancedContent;
    
    if (useHuggingFace) {
      const prompt = `Enhance this blog content by adding Key Takeaways and Conclusion sections:

${content}

Add:
1. Key Takeaways (3-4 bullet points)
2. Conclusion (compelling ending)

Enhanced content:`;
      
      enhancedContent = await callHuggingFaceAPI(
        prompt, 
        "sshleifer/distilbart-cnn-12-6",
        ["facebook/bart-base", "facebook/bart-large-cnn"]
      );
    } else {
      const prompt = `Please enhance the following blog content by adding a 'Key Takeaways' section and a 'Conclusion' section. Maintain the original content and add these sections at the end:

${content}

Please add:
1. Key Takeaways: 3-4 bullet points summarizing the main insights
2. Conclusion: A compelling conclusion that ties everything together

Enhanced content:`;
      
      enhancedContent = await callOpenAIAPI([
        { 
          role: 'system', 
          content: 'You are a content enhancement expert. Add valuable sections while preserving the original content structure and tone.' 
        },
        { role: 'user', content: prompt }
      ], 500);
    }
    
    res.json({ enhancedContent });
  } catch (error) {
    console.error('AI enhancement error:', error);
    res.status(500).json({ message: 'Failed to enhance content', error: error.message });
  }
};

exports.generateTags = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    if (!useHuggingFace && !openai) {
      return res.status(503).json({ message: 'AI service not available. Set HUGGINGFACE_API_KEY or OPENAI_API_KEY.' });
    }

    let tags;
    
    if (useHuggingFace) {
      const prompt = `Suggest 5 relevant tags for this blog post:
Title: ${title}
Content: ${content.substring(0, 300)}
Category: ${category || 'Not specified'}

Tags (comma-separated):`;
      
      tags = await callHuggingFaceAPI(
        prompt, 
        "sshleifer/distilbart-cnn-12-6",
        ["facebook/bart-base", "facebook/bart-large-cnn"]
      );
    } else {
      const prompt = `Please suggest 5 relevant tags for the following blog post. Tags should be single words or short phrases, separated by commas:

Title: ${title}
Content: ${content.substring(0, 800)}...
Category: ${category || 'Not specified'}

Tags:`;
      
      tags = await callOpenAIAPI([
        { 
          role: 'system', 
          content: 'You are a content tagging expert. Provide relevant, specific tags that would help readers find this content.' 
        },
        { role: 'user', content: prompt }
      ], 100);
    }
    
    res.json({ tags });
  } catch (error) {
    console.error('AI tags error:', error);
    res.status(500).json({ message: 'Failed to generate tags', error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { id } = req.params; // blog id
    const { content } = req.body;
    const userId = req.user.userId;
    if (!content || !userId) {
      return res.status(400).json({ message: 'Content and user required' });
    }
    const { data, error } = await supabase.from('blog_comment').insert([
      { blog_id: id, user_id: userId, content }
    ]).select('*').single();
    if (error) {
      return res.status(500).json({ message: 'Error adding comment', error: error.message });
    }
    res.status(201).json({ comment: data });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error adding comment' });
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
  generateSummary: exports.generateSummary,
  generateSEOContent: exports.generateSEOContent,
  enhanceContent: exports.enhanceContent,
  generateTags: exports.generateTags,
  addComment: exports.addComment
};
