import express from 'express';
import {
  createDiaryEntry,
  getDiaryEntry,
  getDiaryByDateRange,
  getVolunteerAttendanceForDiary,
  updateDiaryPDF,
} from '../services/diaryService.js';
import { generateDiaryPDF } from '../services/pdfService.js';
import { getCenterById } from '../services/centerService.js';
import { authenticateToken } from '../middleware/auth.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Create or update diary entry
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const {
      center_id,
      date,
      number_of_students,
      in_time,
      out_time,
      thought_of_day,
      subject,
      topic,
      volunteer_attendance,
    } = req.body;

    if (!center_id || !date || number_of_students === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const diaryData = {
      center_id: parseInt(center_id),
      date,
      number_of_students: parseInt(number_of_students),
      in_time,
      out_time,
      thought_of_day,
      subject,
      topic,
      volunteer_attendance,
    };

    const diary = await createDiaryEntry(diaryData, req.user.id);
    res.json({ diary });
  } catch (error) {
    next(error);
  }
});

// Get diary entry by date
router.get('/date/:date', authenticateToken, async (req, res, next) => {
  try {
    const { date } = req.params;
    const { center_id } = req.query;

    if (!center_id) {
      return res.status(400).json({ error: 'center_id is required' });
    }

    const diary = await getDiaryEntry(parseInt(center_id), date);
    
    if (!diary) {
      return res.status(404).json({ error: 'Diary entry not found' });
    }

    // Get volunteer attendance
    const volunteerAttendance = await getVolunteerAttendanceForDiary(diary.id);

    res.json({ diary, volunteer_attendance: volunteerAttendance });
  } catch (error) {
    next(error);
  }
});

// Get diary by date range
router.get('/range', authenticateToken, async (req, res, next) => {
  try {
    const { center_id, start_date, end_date } = req.query;

    if (!center_id || !start_date || !end_date) {
      return res.status(400).json({ error: 'Missing required query parameters' });
    }

    const diaryEntries = await getDiaryByDateRange(
      parseInt(center_id),
      start_date,
      end_date
    );
    res.json({ diary_entries: diaryEntries });
  } catch (error) {
    next(error);
  }
});

// Generate diary PDF
router.get('/pdf/:date', authenticateToken, async (req, res, next) => {
  try {
    const { date } = req.params;
    const { center_id } = req.query;

    if (!center_id) {
      return res.status(400).json({ error: 'center_id is required' });
    }

    const diary = await getDiaryEntry(parseInt(center_id), date);
    if (!diary) {
      return res.status(404).json({ error: 'Diary entry not found' });
    }

    const center = await getCenterById(parseInt(center_id));
    if (!center) {
      return res.status(404).json({ error: 'Center not found' });
    }

    const volunteerAttendance = await getVolunteerAttendanceForDiary(diary.id);
    const pdfPath = await generateDiaryPDF(diary, center, volunteerAttendance);

    // Update diary with PDF path
    await updateDiaryPDF(diary.id, pdfPath);

    const fullPath = path.join(__dirname, '../..', pdfPath);

    res.download(fullPath, `diary_${date}.pdf`, (err) => {
      if (err) {
        next(err);
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;

