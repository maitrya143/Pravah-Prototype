import express from 'express';
import { getCentersByVolunteerId, getCenterById } from '../services/centerService.js';
import { authenticateToken } from '../middleware/auth.js';
import { query } from '../config/database.js';

const router = express.Router();

// Get centers for logged-in volunteer (based on their city)
router.get('/my-centers', authenticateToken, async (req, res, next) => {
  try {
    // Get volunteer_id from token
    const userResult = await query('SELECT volunteer_id FROM users WHERE id = $1', [req.user.id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const volunteerId = userResult.rows[0].volunteer_id;
    const centers = await getCentersByVolunteerId(volunteerId);
    res.json({ centers });
  } catch (error) {
    next(error);
  }
});

// Get all centers (admin only)
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const result = await query('SELECT id, name, location, city, code FROM centers ORDER BY city, name');
    res.json({ centers: result.rows });
  } catch (error) {
    next(error);
  }
});

// Get center by ID
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const center = await getCenterById(req.params.id);
    if (!center) {
      return res.status(404).json({ error: 'Center not found' });
    }
    res.json({ center });
  } catch (error) {
    next(error);
  }
});

export default router;

