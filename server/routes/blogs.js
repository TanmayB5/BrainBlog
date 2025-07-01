// routes/blogs.js

const express = require('express');
const router = express.Router();
const {
  createBlog,
  getMyBlogs,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  generateAIContent,
  publishDraft,
  incrementBlogViews,
  incrementBlogLikes,
  generateSummary,
  addComment,
  generateSEOContent,
  enhanceContent,
  generateTags
} = require('../controllers/blogController');
const authenticateToken = require('../middlewares/authMiddleware');

console.log('✅ blogs.js (router) file executed');

// SPECIFIC ROUTES FIRST
router.get('/my', authenticateToken, getMyBlogs);
router.post('/', authenticateToken, createBlog);

// DYNAMIC ROUTES SECOND
router.get('/:id', getBlogById);
router.put('/:id', authenticateToken, updateBlog);
router.patch('/:id/publish', authenticateToken, publishDraft);
router.delete('/:id', authenticateToken, deleteBlog);

// GENERAL ROUTES LAST
router.get('/', getAllBlogs);

// (Optional) AI content route if implemented
router.post('/generate-ai-content', authenticateToken, generateAIContent);

router.post('/generate-summary', authenticateToken, generateSummary);

router.patch('/:id/view', incrementBlogViews);
router.patch('/:id/like', incrementBlogLikes);

router.post('/:id/comment', authenticateToken, addComment);

router.post('/generate-seo', authenticateToken, generateSEOContent);
router.post('/enhance-content', authenticateToken, enhanceContent);
router.post('/generate-tags', authenticateToken, generateTags);

module.exports = router;
