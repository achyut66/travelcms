// routes/protectedRoute.js
import express from 'express';
import User from '../models/User.js';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated.js';  

const router = express.Router();

router.get('/current-user', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user profile' });
  }
});

export default router;
