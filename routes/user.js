// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const bcrypt = require('bcrypt');
// const router = express.Router();

// // Path to the user.json file
// const usersFilePath = path.join(__dirname, '../data/users.json');

// // Login route
// router.post('/login', (req, res, next) => {
//     const { email, password } = req.body;

//     // Read the existing users from users.json
//     fs.readFile(usersFilePath, 'utf-8', (err, data) => {
//         if (err) {
//             return next(new Error('Error reading user data')); // Forward to error-handling middleware
//         }

//         let users = [];
//         if (data) {
//             try {
//                 users = JSON.parse(data); // Parse existing users
//             } catch (parseErr) {
//                 return next(new Error('Error parsing user data')); // Handle JSON parsing errors
//             }
//         }

//         // Find user by email
//         const user = users.find(user => user.email === email);

//         // Check if user exists
//         if (!user) {
//             return res.status(401).render('login', { errorMessage: 'Invalid user' });
//         }

//         // Check if password matches using bcrypt
//         bcrypt.compare(password, user.password, (err, match) => {
//             if (err) {
//                 return next(err); // Forward to error-handling middleware
//             }
//             if (!match) {
//                 return res.status(401).render('login', { errorMessage: 'Invalid password' });
//             }

//             // Store user information in session
//             req.session.userId = user.email; // You can store user ID or email
//             req.session.user = user;

//             // Redirect to the dashboard
//             return res.redirect('dashboard');
//         });
//     });
// });

// // Dashboard route
// router.get('/dashboard', (req, res) => {
//     // Check if user is authenticated
//     if (!req.session.userId) {
//         return res.redirect('/login'); // Redirect to login if not authenticated
//     }

//     res.render('dashboard', { user: req.session.user });
// });

// // Profile route
// router.get('/profile', (req, res) => {
//     // Check if user is authenticated
//     if (!req.session.userId) {
//         return res.redirect('/login'); // Redirect to login if not authenticated
//     }

//     res.render('profile', { user: req.session.user });
// });

// // Logout route
// router.get('/logout', (req, res) => {
//     // Destroy the session
//     req.session.destroy(err => {
//         if (err) {
//             return res.status(500).send("Could not log out. Please try again.");
//         }

//         // Redirect to login page or home page after logout
//         res.redirect('login');
//     });
// });

// module.exports = router;

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user'); // Import the MongoDB User model
const { protect } = require('../middlewares/auth');
require('dotenv').config();  // Load environment variables


// Registration route
router.post('/register', async (req, res) => {
  try {
    // Check if user with this email already exists
    const existingUser = await User.findOne({
      $or: [
        { email: req.body.email },
        { username: req.body.username }
      ]
    });

    if (existingUser) {
      return res.render('register', { 
        errorMessage: 'Email or username already in use',
        title: 'Register'
      });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user instance
    const newUser = new User({
      username: req.body.username, // Add this line
      email: req.body.email,
      password: hashedPassword, // Storing the hashed password
      name:req.body.name,
      phone:req.body.phone,
      dob:req.body.dob,
      status:req.body.status

    });

    // Save the user to MongoDB
    await newUser.save();
    // Sign the JWT token, only including essential user information (user ID)
    const token = jwt.sign(
      { id: newUser._id }, // Only include user ID in the token
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Set the token in an HTTP-only cookie
    res.cookie('token', token, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 3600000 // 1 hour in milliseconds
    });

    // Store user in session
    req.session.user = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email
    };

    // Redirect to login after successful registration
    return res.redirect('/success');
  } catch (err) {
    console.error('Error during registration:', err);
    return res.status(500).render('register', { errorMessage: 'Registration failed, please try again' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).render('login', { errorMessage: 'Invalid email or password' });
    }

    // Compare passwords using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).render('login', { errorMessage: 'Invalid email or password' });
    }

    // // Store user information in the session
    // req.session.user = user;
    // req.session.userId = user._id;

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
   // Set token in cookie
   res.cookie('token', token, { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600000 // 1 hour
  });
      // Store user in session
      req.session.user = {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        phone: user.phone,
        dob: user.dob,
        status: user.status
      };
    // Redirect to dashboard after login
    // res.redirect('/dashboard');
    res.redirect('/profile');
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).render('login', { errorMessage: 'Login failed, please try again' });
  }
});

// Success route
router.get('/success', (req, res) => {
  res.render('success', { title: 'Registration Successful' });
});

// Logout
router.get('/logout', (req, res) => {
  res.cookie('token', '', { expires: new Date(0) });
  res.redirect('/');
});

// Dashboard (Protected)
router.get('/dashboard', protect, (req, res) => {
  res.render('dashboard', { user: req.user });
});

// Profile (Protected)
router.get('/profile', protect, (req, res) => {
  res.render('profile', { user: req.user });
});

module.exports = router;
