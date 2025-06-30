// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const supabase = require('../supabaseClient');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    
    // Verify user still exists
    const { data: user, error } = await supabase.from('user').select('*').eq('id', decoded.userId).single();
    if (!user) {
      return res.status(401).json({ message: 'Invalid token or user not found' });
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    return res.status(500).json({ message: 'Server error during authentication' });
  }
};

// ADD THIS LINE - Export the function
module.exports = authenticateToken;
