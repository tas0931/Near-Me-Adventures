const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    console.log('Register payload:', req.body);

    const { name, email, password } = req.body || {};
    const missing = [];
    if (!name) missing.push('name');
    if (!email) missing.push('email');
    if (!password) missing.push('password');
    if (missing.length) {
      return res.status(400).json({ message: `Missing fields: ${missing.join(', ')}` });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashed });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('Login payload:', req.body);

    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    res.json({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.me = async (req, res) => {
  try {
    if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listUsers = async (req, res) => {
  try {
    // allow request when token indicates admin, or when the authenticated user is the admin user
    if (req.isAdminToken) {
      const users = await User.find().select('name email password').sort({ createdAt: -1 });
      return res.json({ total: users.length, users });
    }

    if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });
    const me = await User.findById(req.userId);
    if (!me) return res.status(401).json({ message: 'Unauthorized' });
    if (me.email !== 'admin@example.com') return res.status(403).json({ message: 'Forbidden' });

    const users = await User.find().select('name email password').sort({ createdAt: -1 });
    res.json({ total: users.length, users });
  } catch (err) {
    console.error('List users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.browseUsers = async (req, res) => {
  try {
    if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });
    
    // Get all users except the current user
    const users = await User.find({ _id: { $ne: req.userId } })
      .select('name email createdAt')
      .sort({ name: 1 });
    
    res.json({ users, total: users.length });
  } catch (err) {
    console.error('Browse users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    if (!targetId) return res.status(400).json({ message: 'Missing user id' });

    // allow when dev admin token present
    if (req.isAdminToken) {
      const user = await User.findById(targetId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      if (user.email === 'admin@example.com') return res.status(400).json({ message: 'Cannot delete admin user' });
      await User.findByIdAndDelete(targetId);
      return res.json({ message: 'User deleted' });
    }

    if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });
    const me = await User.findById(req.userId);
    if (!me) return res.status(401).json({ message: 'Unauthorized' });
    if (me.email !== 'admin@example.com') return res.status(403).json({ message: 'Forbidden' });

    const user = await User.findById(targetId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.email === 'admin@example.com') return res.status(400).json({ message: 'Cannot delete admin user' });

    await User.findByIdAndDelete(targetId);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const targetId = req.params.id;
    if (!targetId) return res.status(400).json({ message: 'Missing user id' });

    // allow dev admin token or admin user
    if (!req.isAdminToken) {
      if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });
      const me = await User.findById(req.userId);
      if (!me) return res.status(401).json({ message: 'Unauthorized' });
      if (me.email !== 'admin@example.com') return res.status(403).json({ message: 'Forbidden' });
    }

    const user = await User.findById(targetId).select('bookings');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ bookings: user.bookings || [] });
  } catch (err) {
    console.error('Get user bookings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserWishlist = async (req, res) => {
  try {
    const targetId = req.params.id;
    if (!targetId) return res.status(400).json({ message: 'Missing user id' });

    // allow dev admin token or admin user
    if (!req.isAdminToken) {
      if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });
      const me = await User.findById(req.userId);
      if (!me) return res.status(401).json({ message: 'Unauthorized' });
      if (me.email !== 'admin@example.com') return res.status(403).json({ message: 'Forbidden' });
    }

    const user = await User.findById(targetId).select('wishlist');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ wishlist: user.wishlist || [] });
  } catch (err) {
    console.error('Get user wishlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};