const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middlewares/jwtMiddleware');
const someController = require('../controllers/someController');
// Get the registration success page
router.get('/success', (req, res) => {
  res.render('success'); // renders the success.pug file
});
// In your routes/index.js file or a similar routes file
router.get('/jobs', (req, res) => {
  res.render('jobs'); // Renders a Pug template named 'jobs.pug' (in the 'views' folder)
});
// In your routes/index.js file or a similar routes file
router.get('/register', (req, res) => {
  res.render('register'); // Renders a Pug template named 'jobs.pug' (in the 'views' folder)
});
// In your routes/index.js file or a similar routes file
router.get('/login', (req, res) => {
  res.render('login'); // Renders a Pug template named 'jobs.pug' (in the 'views' folder)
});

// Unprotected route
router.get('/public', someController.publicRoute);

// Protected route, only accessible with a valid JWT token
router.get('/protected', authenticateJWT, someController.protectedRoute);
// Get the dashboard page after login
router.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) { // assuming you're using passport for authentication
    res.render('dashboard'); // renders the dashboard.pug file
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
