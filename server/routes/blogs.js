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
  publishDraft
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

module.exports = router;
