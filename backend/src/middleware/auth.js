const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  const authHeader = req.header('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  // Development helper: accept a special client-side admin token
  if (token === 'admin-token') {
    req.isAdminToken = true;
    // do not set req.userId; controllers can check req.isAdminToken
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = decoded.id;

    // Check if the authenticated user is the admin
    const user = await User.findById(decoded.id).select('email');
    console.log('🔍 Auth check - User ID:', decoded.id, 'Email:', user?.email);

    if (user && user.email === 'admin@example.com') {
      req.isAdminToken = true;
      console.log('✅ Admin token set to true for:', user.email);
    } else {
      console.log('❌ Not admin - Email:', user?.email);
    }

    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};