const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://brainblog.onrender.com', // Your Render frontend URL
    'https://brainblog-1.onrender.com', // Your Render backend URL
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3003',
    'http://localhost:3001' // Added for local frontend on port 3001
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  name: 'brainblog.sid',  // Add session cookie name
  secret: process.env.SESSION_SECRET || 'fallback-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    httpOnly: true,
    sameSite: 'lax',  // Important for CSRF protection
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

// Debug routes to test server connectivity
app.get('/', (req, res) => {
  res.json({ 
    message: 'BrainBlog Server is running!',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000
  });
});

app.get('/api', (req, res) => {
  res.json({ 
    message: 'BrainBlog API is running!',
    availableRoutes: [
      '/api/auth/login',
      '/api/auth/register', 
      '/api/blogs',
      '/api/blogs/my'
    ],
    timestamp: new Date().toISOString()
  });
});

// Test endpoint for API health check
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint working!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.stack);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
  console.log(`🔧 API URL: http://localhost:${PORT}/api`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = server;
