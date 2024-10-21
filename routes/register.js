const express = require('express');
const router = express.Router();
const path = require('path');

// GET route for the registration page
router.get('/', (req, res) => {
  res.render('register'); // This will render the register.pug file
});

// POST route for handling registration form submission
router.post('/', (req, res) => {
  const { name, email, phone, dob, status, resume } = req.body;

  // Simple validation (you would typically have more robust validation)
  if (!name || !email || !phone || !dob || !status) {
    return res.status(400).send('All required fields must be filled.');
  }

  // Process the registration (for now, just log the details)
  console.log('Registration Details:', {
    name,
    email,
    phone,
    dob,
    status,
    resume: resume ? path.basename(resume) : 'No resume uploaded'
  });

  // You would typically save the data to a database and perform further logic
  res.send('Registration successful!');
});

module.exports = router;
