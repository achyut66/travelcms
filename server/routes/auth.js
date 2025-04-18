// routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went big wrong' });
  }
});
// login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      // Find user by username
      const user = await User.findOne({ username });
      if (!user) return res.status(400).json({ message: 'User not found' });
  
      // Compare entered password with hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid password' });
      
      req.session.user = {
        id: user._id,
        username: user.username,
        email: user.email
      };
  
      // Success
      res.status(200).json({ message: 'Login successful', user: { username: user.username, email: user.email } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
//   logout route
  router.post('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.clearCookie('connect.sid'); // if using cookies
      res.json({ message: 'Logged out successfully' });
    });
  });

export default router;
