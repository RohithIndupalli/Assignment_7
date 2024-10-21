const express = require('express');
const router = express.Router();

// GET route for the login page
router.get('/', (req, res) => {
  res.render('login'); // This will render the login.pug file
});

// POST route for handling login form submission
router.post('/', (req, res) => {
  const { loginUsername, loginPassword } = req.body;
  
  // Here you would typically check the username and password with a database
  // For this example, we're simply logging the details
  if (loginUsername === "example" && loginPassword === "password123") {
    res.send("Login Successful!");
  } else {
    res.send("Login Failed. Invalid credentials.");
  }
});

module.exports = router;
