const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware'); // or { authenticateToken }

console.log('✅ auth.js (router) file executed');

// Test route
router.get('/test', (req, res) => {
  res.send('✅ Auth test route working!');
});

// Public routes
router.post('/register', register);
router.post('/login', login);

// 🔐 Protected route
router.get('/profile', authenticateToken, (req, res) => {
  res.json({
    message: 'Welcome to your profile!',
    user: req.user,
  });
});

module.exports = router;
