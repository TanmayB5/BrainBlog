const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3003'
  ],
  credentials: true
}));

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

// Make Prisma available to routes
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'BrainBlog API is running with MySQL + Prisma!',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
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

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  console.log('Prisma disconnected');
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  gracefulShutdown();
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
  console.log(`🔧 API URL: http://localhost:${PORT}/api`);
  console.log(`🗄️ Database: MySQL with Prisma`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = server;
