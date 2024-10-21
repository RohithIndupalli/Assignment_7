// controllers/authController.js
const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwtConfig');
const User = require('../models/user'); // Assuming you have a user model

exports.register = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Check if the username already exists
      let user = await User.findOne({ username });
      if (user) {
        return res.render('register', { title: 'Register', error: 'Username already exists' });
      }
  
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user and save to DB
      user = new User({
        username,
        password: hashedPassword
      });
      await user.save();
  
      // After successful registration, redirect to success page
      res.redirect('/success');
    } catch (err) {
      console.error(err);
      res.render('register', { title: 'Register', error: 'Error registering user' });
    }
  };
// Login controller
exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Validate the user's credentials (this is a basic example)
  const user = await User.findOne({ username });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Create and sign a token
  const token = jwt.sign({ userId: user._id, username: user.username }, secret, { expiresIn });

  res.json({ token });
};
