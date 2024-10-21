// config/jwtConfig.js
module.exports = {
    secret: process.env.JWT_SECRET || 'your_secret_key', // Add this in your .env file for production
    expiresIn: '1h' // Token will expire in 1 hour
  };
  