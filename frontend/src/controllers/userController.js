// userController.js

const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function registerUser(req, res) {
  console.log('registerUser');
  const { email, password, confirmPassword } = req.body;

  // Validate user input
  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const user = new User({email, password: hashedPassword });
  await user.save();

  res.status(201).json({ message: 'User registered successfully' });
}

module.exports = {
  registerUser
};
