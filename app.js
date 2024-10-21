// const express = require('express');
// const app = express();
// const path = require('path');
// const session = require('express-session');
// const bcrypt = require('bcrypt');
// const multer = require('multer');
// const connectDB = require('./config/db');
// const User = require('./models/user');
// const userRoutes = require('./routes/user'); // Use the MongoDB-based routes
// const cookieParser = require('cookie-parser');
// const url = require('url')
// // Connect to MongoDB
// connectDB();

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Middleware for parsing POST request bodies (for form data)
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// // Session setup
// // app.use(session({
// //   secret: 'your_secret_key',
// //   resave: false,
// //   saveUninitialized: true,
// //   cookie: { secure: false } // Set to true if using HTTPS
// // }));

// // Set the view engine to Pug
// app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, 'views'));

// // Serve static files (CSS, JS, Images)
// app.use(express.static(path.join(__dirname, 'public')));

// // Use the routes from the user.js file in the routes folder
// app.use('/', userRoutes);

// //General Middleware
// app.use((req, res, next) => {
//     try {
//         // Render the requested page by extracting the pathname from the URL
//         res.render(url.parse(req.url, true).pathname.substring(1));
//     } catch (error) {
//         // Create a new error and pass it to the next middleware
//         const err = new Error('Error rendering the page');
//         err.status = 500;
//         return next(err); // Forward to error-handling middleware
//     }
// });
// // Home route
// app.get('/', (req, res) => {
//   res.render('index', { user: req.session.user });
// });

// // Other routes...
// app.get('/login', (req, res) => {
//   res.render('login', { title: 'Login' });
// });

// app.get('/register', (req, res) => {
//   res.render('register', { title: 'Register' });
// });

// app.get('/success', (req, res) => {
//   res.render('success', { title: 'Registration Successful' });
// });

// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   // Use MongoDB to find the user
//   const user = await User.findOne({ username });
//   if (!user) {
//     return res.render('login', { title: 'Login', error: 'Invalid username' });
//   }

//   // Compare hashed passwords
//   const match = await bcrypt.compare(password, user.password);
//   if (!match) {
//     return res.render('login', { title: 'Login', error: 'Invalid password' });
//   }

//   // Store user information in session
//   req.session.user = {
//     username: user.username,
//     email: user.email,
//     name: user.name,
//     profileImage: user.profileImage // Store profile image in session
//   };
//   req.session.userId = user._id;

//   // Redirect to homepage or dashboard
//   res.redirect('/');
// });


// app.get('/dashboard', (req, res) => {
//   if (!req.session.user) {
//     return res.redirect('/login');
//   }
//   res.render('dashboard', { title: 'Dashboard', user: req.session.user });
// });

// app.get('/profile', async (req, res) => {
//   if (!req.session.user) {
//     return res.redirect('/login');
//   }
//   // Fetch user data from MongoDB
//   const user = await User.findById(req.session.userId);
//   if (!user) {
//     return res.redirect('/login');
//   }

//   res.render('profile', { title: 'User Profile', user: req.session.user });
// });

// // Set up multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/uploads'); // Directory to save uploaded images
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp as file name
//   }
// });

// const upload = multer({ storage });

// // Route to handle profile picture uploads
// app.post('/upload-profile-pic', upload.single('profileImage'), async (req, res) => {
//   if (req.file) {
//     // Find the user in the database using their session user ID
//     const user = await User.findById(req.session.userId);
    
//     if (user) {
//       user.profileImage = `/uploads/${req.file.filename}`; // Save relative path to user object
//       await user.save(); // Save the updated user to MongoDB
//       req.session.user.profileImage = user.profileImage; // Update session with new profile image
//     }

//     res.redirect('/profile'); // Redirect to profile page
//   } else {
//     res.redirect('/profile'); // Handle error case if no file was uploaded
//   }
// });

// // Route to update the profile
// app.post('/update-profile', async (req, res) => {
//   const updatedData = req.body;

//   // Find the user by ID
//   const user = await User.findById(req.session.userId);
//   if (!user) {
//     return res.status(404).json({ success: false, message: 'User not found' });
//   }

//   // Update the user fields based on the edited data
//   Object.keys(updatedData).forEach(field => {
//     if (updatedData[field]) {
//       user[field] = updatedData[field];
//     }
//   });

//   // Save the updated user back to MongoDB
//   await user.save();

//   // Update session data
//   req.session.user = {
//     ...req.session.user,
//     ...updatedData
//   };

//   res.json({ success: true });
// });


// // Logout route
// app.get('/logout', (req, res) => {
//   req.session.destroy(err => {
//     if (err) {
//       console.error("Error logging out:", err);
//       return res.redirect('/dashboard');
//     }
//     res.redirect('/');
//   });
// });

// // Start the server
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
// Load environment variables from .env
require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const multer = require('multer');
const connectDB = require('./config/db');
const User = require('./models/user');
const userRoutes = require('./routes/user'); // Use the MongoDB-based routes

// JWT middleware
const authenticateJWT = require('./middlewares/jwtMiddleware');

// Connect to MongoDB
connectDB();

// Middleware to parse JSON bodies
app.use(express.json()); 

// Middleware for parsing POST request bodies (for form data)
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
  secret: process.env.JWT_SECRET || 'your_secret_key', // Optional, ensure session security
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Set the view engine to Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS, Images)
app.use(express.static(path.join(__dirname, 'public')));

// Use the routes from the user.js file in the routes folder
app.use('/', userRoutes);

// Public Routes (e.g., login, register)
// Add JWT-protected routes
app.use('/protected-route', authenticateJWT, (req, res) => {
  res.send('This is a protected route and requires a valid JWT token.');
});
// Add this near your other middleware configurations
app.use(require('./middlewares/auth').isLoggedIn);
// Home route
app.get('/', (req, res) => {
  res.render('index', { user: req.session.user });
});

// Other routes...
app.get('/jobs', (req, res) => {
  res.render('jobs', { title: 'Jobs', user: req.session.user });
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

app.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

app.get('/success', (req, res) => {
  res.render('success', { title: 'Registration Successful' });
});

// Login route using bcrypt for password comparison
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Use MongoDB to find the user
  const user = await User.findOne({ username });
  if (!user) {
    return res.render('login', { title: 'Login', error: 'Invalid username' });
  }

  // Compare hashed passwords
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.render('login', { title: 'Login', error: 'Invalid password' });
  }

  // Store user in session
  req.session.user = { userId: user._id, username: user.username };

  res.redirect('/protected-route');
});

// File upload for profile pictures (using multer)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads'); // Folder to store uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp as file name
  }
});

const upload = multer({ storage });

// Route to handle profile picture uploads
app.post('/upload-profile-pic', upload.single('profileImage'), async (req, res) => {
  if (req.file) {
    // Find the user in the database using their session user ID
    const user = await User.findById(req.session.userId);
    
    if (user) {
      user.profileImage = `/uploads/${req.file.filename}`; // Save relative path to user object
      await user.save(); // Save the updated user to MongoDB
      req.session.user.profileImage = user.profileImage; // Update session with new profile image
    }

    res.redirect('/profile'); // Redirect to profile page
  } else {
    res.redirect('/profile'); // Handle error case if no file was uploaded
  }
});

// Route to update the profile
app.post('/update-profile', async (req, res) => {
  const updatedData = req.body;

  // Find the user by ID
  const user = await User.findById(req.session.userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // Update the user fields based on the edited data
  Object.keys(updatedData).forEach(field => {
    if (updatedData[field]) {
      user[field] = updatedData[field];
    }
  });

  // Save the updated user back to MongoDB
  await user.save();

  // Update session data
  req.session.user = {
    ...req.session.user,
    ...updatedData
  };

  res.json({ success: true });
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Error logging out:", err);
      return res.redirect('/dashboard');
    }
    res.redirect('/');
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
