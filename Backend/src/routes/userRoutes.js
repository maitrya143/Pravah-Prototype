import express from 'express';
import { query } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all volunteers (for diary attendance selection)
router.get('/volunteers', authenticateToken, async (req, res, next) => {
  try {
    const { center_id } = req.query;

    let result;
    if (center_id) {
      // Get volunteers for a specific center (based on city)
      const centerResult = await query('SELECT city FROM centers WHERE id = $1', [center_id]);
      if (centerResult.rows.length === 0) {
        return res.status(404).json({ error: 'Center not found' });
      }
      const city = centerResult.rows[0].city;
      result = await query(
        'SELECT id, volunteer_id, full_name, city FROM users WHERE city = $1 AND role = $2 ORDER BY full_name',
        [city, 'volunteer']
      );
    } else {
      result = await query(
        'SELECT id, volunteer_id, full_name, city FROM users WHERE role = $1 ORDER BY full_name',
        ['volunteer']
      );
    }

    res.json({ volunteers: result.rows });
  } catch (error) {
    next(error);
  }
});

export default router;

