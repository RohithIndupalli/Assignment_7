const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    phone: { type: String },
    dob: { type: String },
    status: { type: String }
});

// Hash password before saving (use regular function to access 'this')
userSchema.pre('save', async function (next) {
    // Check if the password is modified
    if (!this.isModified('password')) return next();
  
    // Hash the password
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  
  // Method to compare passwords
  userSchema.methods.comparePassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password);
  };

// Explicitly specify the collection name
const User = mongoose.model('User', userSchema, 'Users'); // Use 'Users' as the collection name
module.exports = User;
