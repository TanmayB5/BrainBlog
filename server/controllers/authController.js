const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../supabaseClient');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const { data: existingUser, error: findError } = await supabase.from('user').select('*').eq('email', email.toLowerCase()).single();
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    if (findError && findError.code !== 'PGRST116') {
      // Ignore "No rows found" error
      return res.status(500).json({ message: 'Error checking for existing user', error: findError.message });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const { data: user, error: createError } = await supabase.from('user').insert([
      {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'author'
      }
    ]).select('*').single();
    if (createError) {
      return res.status(500).json({ message: 'Error creating user', error: createError.message });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );

    // Set session
    req.session.token = token;

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const { data: user, error: findError } = await supabase.from('user').select('*').eq('email', email.toLowerCase()).single();
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (findError) {
      return res.status(500).json({ message: 'Error finding user', error: findError.message });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );

    // Set session
    req.session.token = token;

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

exports.logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).json({ message: 'Error logging out' });
      }
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logged out successfully' });
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { data: user, error } = await supabase.from('user').select('id, name, email, role, createdat').eq('id', req.user.userId).single();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (error) {
      return res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};
