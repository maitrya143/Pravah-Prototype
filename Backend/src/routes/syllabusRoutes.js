import express from 'express';
import multer from 'multer';
import {
  uploadSyllabus,
  getSyllabusByCenter,
  getSyllabusByClass,
  getSyllabusFilePath,
} from '../services/syllabusService.js';
import { authenticateToken } from '../middleware/auth.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Upload syllabus
router.post('/upload', authenticateToken, upload.single('syllabus_file'), async (req, res, next) => {
  try {
    const { center_id, class: className } = req.body;

    if (!center_id || !className || !req.file) {
      return res.status(400).json({ error: 'Missing required fields: center_id, class, and file' });
    }

    const syllabus = await uploadSyllabus(
      parseInt(center_id),
      className,
      req.file,
      req.user.id
    );

    res.status(201).json({ syllabus });
  } catch (error) {
    next(error);
  }
});

// Get all syllabus for a center
router.get('/center/:centerId', authenticateToken, async (req, res, next) => {
  try {
    const syllabus = await getSyllabusByCenter(parseInt(req.params.centerId));
    res.json({ syllabus });
  } catch (error) {
    next(error);
  }
});

// Get syllabus by class
router.get('/center/:centerId/class/:className', authenticateToken, async (req, res, next) => {
  try {
    const syllabus = await getSyllabusByClass(
      parseInt(req.params.centerId),
      req.params.className
    );
    
    if (!syllabus) {
      return res.status(404).json({ error: 'Syllabus not found' });
    }

    res.json({ syllabus });
  } catch (error) {
    next(error);
  }
});

// Download syllabus file
router.get('/download/:id', authenticateToken, async (req, res, next) => {
  try {
    const filePath = await getSyllabusFilePath(parseInt(req.params.id));

    if (!filePath) {
      return res.status(404).json({ error: 'File not found' });
    }

    const fullPath = path.join(__dirname, '../..', filePath);

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'File does not exist' });
    }

    res.download(fullPath, (err) => {
      if (err) {
        next(err);
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;

