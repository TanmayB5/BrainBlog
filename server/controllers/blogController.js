// controllers/blogController.js

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

    // Process tags - convert array to comma-separated string for MySQL
    const processedTags = Array.isArray(tags) ? tags.join(', ') : 
      (typeof tags === 'string' ? tags : '');

    // Create blog
    const blog = await req.prisma.blog.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        summary: summary?.trim() || null,
        authorId: req.user.userId,
        category: category || null,
        tags: processedTags || null,
        published: published || false
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Blog created successfully',
      blog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ message: 'Server error creating blog' });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, sort = 'newest' } = req.query;
    const where = { published: true };

    if (category) {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } }
      ];
    }

    let orderBy = {};
    switch (sort) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'title':
        orderBy = { title: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [blogs, total] = await Promise.all([
      req.prisma.blog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy,
        skip,
        take: parseInt(limit)
      }),
      req.prisma.blog.count({ where })
    ]);

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

    const blog = await req.prisma.blog.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
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

    const existingBlog = await req.prisma.blog.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check ownership
    if (existingBlog.authorId !== req.user.userId && req.user.role !== 'admin') {
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
    const processedTags = Array.isArray(tags) ? tags.join(', ') : 
      (typeof tags === 'string' ? tags : existingBlog.tags);

    // Update blog
    const blog = await req.prisma.blog.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title: title.trim() }),
        ...(content && { content: content.trim() }),
        ...(summary !== undefined && { summary: summary?.trim() || null }),
        ...(category !== undefined && { category: category || null }),
        ...(tags !== undefined && { tags: processedTags || null }),
        ...(published !== undefined && { published })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(200).json({
      message: 'Blog updated successfully',
      blog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ message: 'Server error updating blog' });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await req.prisma.blog.findUnique({
      where: { id: parseInt(id) }
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check ownership
    if (blog.authorId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this blog' });
    }

    await req.prisma.blog.delete({
      where: { id: parseInt(id) }
    });

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

    const [blogs, total] = await Promise.all([
      req.prisma.blog.findMany({
        where: { authorId: req.user.userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      req.prisma.blog.count({
        where: { authorId: req.user.userId }
      })
    ]);

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

module.exports = {
  createBlog: exports.createBlog,
  getAllBlogs: exports.getAllBlogs,
  getBlogById: exports.getBlogById,
  updateBlog: exports.updateBlog,
  deleteBlog: exports.deleteBlog,
  getMyBlogs: exports.getMyBlogs,
  generateAIContent: exports.generateAIContent,
  publishDraft: exports.publishDraft
};
