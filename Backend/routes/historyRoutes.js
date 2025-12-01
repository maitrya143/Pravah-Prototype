import express from 'express';
import {
  getAdmissionsHistory,
  getAttendanceHistory,
  getAllHistory,
} from '../services/historyService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all history (admissions + attendance)
router.get('/all', authenticateToken, async (req, res, next) => {
  try {
    const { center_id, start_date, end_date } = req.query;

    if (!center_id || !start_date || !end_date) {
      return res.status(400).json({ error: 'Missing required query parameters' });
    }

    const history = await getAllHistory(
      parseInt(center_id),
      start_date,
      end_date
    );

    res.json({ history });
  } catch (error) {
    next(error);
  }
});

// Get admissions history
router.get('/admissions', authenticateToken, async (req, res, next) => {
  try {
    const { center_id, start_date, end_date } = req.query;

    if (!center_id || !start_date || !end_date) {
      return res.status(400).json({ error: 'Missing required query parameters' });
    }

    const admissions = await getAdmissionsHistory(
      parseInt(center_id),
      start_date,
      end_date
    );

    res.json({ admissions });
  } catch (error) {
    next(error);
  }
});

// Get attendance history
router.get('/attendance', authenticateToken, async (req, res, next) => {
  try {
    const { center_id, start_date, end_date } = req.query;

    if (!center_id || !start_date || !end_date) {
      return res.status(400).json({ error: 'Missing required query parameters' });
    }

    const attendance = await getAttendanceHistory(
      parseInt(center_id),
      start_date,
      end_date
    );

    res.json({ attendance });
  } catch (error) {
    next(error);
  }
});

export default router;

