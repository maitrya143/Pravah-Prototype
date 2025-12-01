import { query } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '../../uploads/syllabus');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export async function uploadSyllabus(centerId, className, file, uploadedBy) {
  const timestamp = Date.now();
  const fileName = `syllabus_${centerId}_${className}_${timestamp}_${file.originalname}`;
  const filePath = path.join(uploadsDir, fileName);

  // Save file
  fs.writeFileSync(filePath, file.buffer);

  const relativePath = `/uploads/syllabus/${fileName}`;

  // Insert or update syllabus record
  const result = await query(
    `INSERT INTO syllabus_files (center_id, class, file_name, file_path, file_size, uploaded_by)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (center_id, class) 
     DO UPDATE SET 
       file_name = $3, file_path = $4, file_size = $5, 
       uploaded_by = $6, uploaded_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [centerId, className, file.originalname, relativePath, file.size, uploadedBy]
  );

  return result.rows[0];
}

export async function getSyllabusByCenter(centerId) {
  const result = await query(
    `SELECT sf.*, u.full_name as uploaded_by_name
     FROM syllabus_files sf
     LEFT JOIN users u ON sf.uploaded_by = u.id
     WHERE sf.center_id = $1
     ORDER BY sf.class`,
    [centerId]
  );

  return result.rows;
}

export async function getSyllabusByClass(centerId, className) {
  const result = await query(
    `SELECT sf.*, u.full_name as uploaded_by_name
     FROM syllabus_files sf
     LEFT JOIN users u ON sf.uploaded_by = u.id
     WHERE sf.center_id = $1 AND sf.class = $2`,
    [centerId, className]
  );

  return result.rows[0];
}

export async function getSyllabusFilePath(id) {
  const result = await query(
    'SELECT file_path FROM syllabus_files WHERE id = $1',
    [id]
  );

  return result.rows[0]?.file_path;
}

