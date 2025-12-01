import express from 'express';
import multer from 'multer';
import { getStudentsByCenter, createStudent, saveAdmissionFormImage } from '../services/studentService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Get students by center
router.get('/center/:centerId', authenticateToken, async (req, res, next) => {
  try {
    const students = await getStudentsByCenter(req.params.centerId);
    res.json({ students });
  } catch (error) {
    next(error);
  }
});

// Create new student (admission)
router.post('/admission', authenticateToken, upload.single('admission_form'), async (req, res, next) => {
  try {
    const {
      full_name,
      date_of_birth,
      parent_name,
      contact_number,
      address,
      class: studentClass,
      center_id,
      admission_date,
    } = req.body;

    if (!full_name || !date_of_birth || !parent_name || !center_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Save admission form image if provided
    let admissionFormImagePath = null;
    if (req.file) {
      admissionFormImagePath = await saveAdmissionFormImage(req.file);
    }

    const studentData = {
      full_name,
      date_of_birth,
      parent_name,
      contact_number,
      address,
      class: studentClass,
      center_id: parseInt(center_id),
      admission_date: admission_date || new Date().toISOString().split('T')[0],
    };

    const student = await createStudent(studentData, req.user.id, admissionFormImagePath);
    res.status(201).json({ student });
  } catch (error) {
    next(error);
  }
});

export default router;

