const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRoutes = require('./routes/userRoutes');


const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/data')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// MongoDB schema and model for user
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String
});

//const User = mongoose.model('User', UserSchema);

app.use(bodyParser.json());
app.use(userRoutes);

// Register endpoint
app.post('/', async (req, res) => {
  try {
    console.log('SignUp');
    const { email, password } = req.body;
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login endpoint
app.post('/', async (req, res) => {
  try {
    console.log('SignIn');
    const { email, password } = req.body;
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ message: 'Invalid credentials' });
    // Generate JWT token
    const token = jwt.sign({ email: user.email }, 'secretkey', { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.status(401).json({ message: 'Unauthorized' });
  jwt.verify(token, 'secretkey', (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
}

// Example protected route (dashboard)
app.get('/Dashboard', authenticateToken, (req, res) => {
  res.json({ message: 'Dashboard accessed successfully', user: req.user });
});

app.listen(PORT, () => console.log('Server running on port ',{PORT}));