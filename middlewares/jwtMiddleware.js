// middlewares/jwtMiddleware.js
const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwtConfig');

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(403).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, secret);
    req.user = verified; // Store user data in the request object
    next(); // Proceed to the next middleware
  } catch (err) {
    res.status(401).json({ message: 'Invalid Token' });
  }
};

module.exports = authenticateJWT;
