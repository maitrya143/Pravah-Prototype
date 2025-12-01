import express from 'express';
import { signup, login, getCurrentUser } from '../services/authService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Signup
router.post('/signup', async (req, res, next) => {
  try {
    const { volunteer_id, full_name, password } = req.body;

    if (!volunteer_id || !full_name || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await signup(volunteer_id, full_name, password);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { volunteer_id, password } = req.body;

    if (!volunteer_id || !password) {
      return res.status(400).json({ error: 'Volunteer ID and password required' });
    }

    const result = await login(volunteer_id, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const user = await getCurrentUser(req.user.id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

export default router;

