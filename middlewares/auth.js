const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();  // Load environment variables

// exports.protect = async (req, res, next) => {
//   const token = req.cookies.token;

//   if (!token) {
//     return res.redirect('/login');
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id);
//     next();
//   } catch (err) {
//     return res.status(401).send('Not authorized');
//   }
// };

exports.protect = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.redirect('/login');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.redirect('/login');
    }

    // Add user to request object
    req.user = user;
    res.locals.user = user; // Make user available to all templates

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.redirect('/login');
  }
};

// Optional: Add middleware to check if user is logged in (for templates)
exports.isLoggedIn = (req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
};