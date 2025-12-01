import express from 'express';
import { getCenterPerformance } from '../services/performanceService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get center performance
router.get('/center/:centerId', authenticateToken, async (req, res, next) => {
  try {
    const { centerId } = req.params;
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      // Default to last 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const performance = await getCenterPerformance(
        parseInt(centerId),
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      return res.json({ performance });
    }

    const performance = await getCenterPerformance(
      parseInt(centerId),
      start_date,
      end_date
    );

    res.json({ performance });
  } catch (error) {
    next(error);
  }
});

export default router;

