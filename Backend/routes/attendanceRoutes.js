import express from 'express';
import {
  markAttendance,
  markAttendanceFromQR,
  bulkMarkAttendance,
  getAttendanceByDate,
  getAttendanceByDateRange,
  getAttendanceStats,
} from '../services/attendanceService.js';
import { generateAttendancePDF } from '../services/pdfService.js';
import { getCenterById } from '../services/centerService.js';
import { authenticateToken } from '../middleware/auth.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Mark attendance from QR code
router.post('/qr-scan', authenticateToken, async (req, res, next) => {
  try {
    const { qr_data } = req.body;

    if (!qr_data) {
      return res.status(400).json({ error: 'QR code data required' });
    }

    const attendance = await markAttendanceFromQR(qr_data, req.user.id);
    res.json({ attendance, message: 'Attendance marked successfully' });
  } catch (error) {
    next(error);
  }
});

// Bulk mark attendance (manual)
router.post('/bulk', authenticateToken, async (req, res, next) => {
  try {
    const { attendance_data, center_id, date } = req.body;

    if (!attendance_data || !Array.isArray(attendance_data) || !center_id || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await bulkMarkAttendance(attendance_data, parseInt(center_id), date, req.user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get attendance by date
router.get('/date/:date', authenticateToken, async (req, res, next) => {
  try {
    const { date } = req.params;
    const { center_id } = req.query;

    if (!center_id) {
      return res.status(400).json({ error: 'center_id is required' });
    }

    const attendance = await getAttendanceByDate(parseInt(center_id), date);
    res.json({ attendance });
  } catch (error) {
    next(error);
  }
});

// Get attendance by date range
router.get('/range', authenticateToken, async (req, res, next) => {
  try {
    const { center_id, start_date, end_date } = req.query;

    if (!center_id || !start_date || !end_date) {
      return res.status(400).json({ error: 'Missing required query parameters' });
    }

    const attendance = await getAttendanceByDateRange(
      parseInt(center_id),
      start_date,
      end_date
    );
    res.json({ attendance });
  } catch (error) {
    next(error);
  }
});

// Get attendance stats
router.get('/stats', authenticateToken, async (req, res, next) => {
  try {
    const { center_id, start_date, end_date } = req.query;

    if (!center_id || !start_date || !end_date) {
      return res.status(400).json({ error: 'Missing required query parameters' });
    }

    const stats = await getAttendanceStats(parseInt(center_id), start_date, end_date);
    res.json({ stats });
  } catch (error) {
    next(error);
  }
});

// Generate attendance PDF
router.get('/pdf/:date', authenticateToken, async (req, res, next) => {
  try {
    const { date } = req.params;
    const { center_id } = req.query;

    if (!center_id) {
      return res.status(400).json({ error: 'center_id is required' });
    }

    const attendance = await getAttendanceByDate(parseInt(center_id), date);
    const center = await getCenterById(parseInt(center_id));

    if (!center) {
      return res.status(404).json({ error: 'Center not found' });
    }

    const pdfPath = await generateAttendancePDF(attendance, center, date);
    const fullPath = path.join(__dirname, '../..', pdfPath);

    res.download(fullPath, `attendance_${date}.pdf`, (err) => {
      if (err) {
        next(err);
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;

