import { query } from '../config/database.js';
import { generateQRPayload, generateQRCodeImage } from '../utils/qrCode.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export async function getStudentsByCenter(centerId) {
  const result = await query(
    `SELECT id, student_id, full_name, date_of_birth, parent_name, contact_number, 
            address, class, center_id, admission_date, qr_code
     FROM students 
     WHERE center_id = $1 
     ORDER BY full_name`,
    [centerId]
  );

  return result.rows;
}

export async function getStudentById(studentId) {
  const result = await query(
    `SELECT id, student_id, full_name, date_of_birth, parent_name, contact_number, 
            address, class, center_id, admission_date, qr_code, admission_form_image_path
     FROM students 
     WHERE id = $1`,
    [studentId]
  );

  return result.rows[0];
}

export async function createStudent(studentData, admittedBy, admissionFormImagePath = null) {
  try {
    // Generate student_id (STU0001, STU0002, etc.)
    const countResult = await query('SELECT COUNT(*) as count FROM students');
    const count = parseInt(countResult.rows[0].count) + 1;
    const studentId = `STU${String(count).padStart(4, '0')}`;

    // Insert student
    const studentResult = await query(
      `INSERT INTO students (
        student_id, full_name, date_of_birth, parent_name, contact_number,
        address, class, center_id, admission_date, qr_code, admission_form_image_path
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id, student_id, full_name, date_of_birth, parent_name, contact_number,
                address, class, center_id, admission_date, qr_code`,
      [
        studentId,
        studentData.full_name,
        studentData.date_of_birth,
        studentData.parent_name,
        studentData.contact_number,
        studentData.address,
        studentData.class,
        studentData.center_id,
        studentData.admission_date || new Date().toISOString().split('T')[0],
        qrPayload,
        admissionFormImagePath,
      ]
    );

    const student = studentResult.rows[0];

    // Generate QR code with student database ID
    const qrPayload = generateQRPayload(student.id, studentData.center_id);
    const qrCodeImage = await generateQRCodeImage(qrPayload);

    // Update student with QR code
    await query(
      'UPDATE students SET qr_code = $1 WHERE id = $2',
      [qrPayload, student.id]
    );

    // Insert into admissions_history
    await query(
      `INSERT INTO admissions_history (
        student_id, center_id, admitted_by, admission_date, student_name,
        parent_name, contact_number, class, qr_code, admission_form_image_path
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        student.id,
        studentData.center_id,
        admittedBy,
        studentData.admission_date || new Date().toISOString().split('T')[0],
        studentData.full_name,
        studentData.parent_name,
        studentData.contact_number,
        studentData.class,
        qrPayload,
        admissionFormImagePath,
      ]
    );

    return {
      ...student,
      qr_code: qrPayload,
      qr_code_image: qrCodeImage,
    };
  } catch (error) {
    throw error;
  }
}

export async function saveAdmissionFormImage(file) {
  if (!file) return null;

  const timestamp = Date.now();
  const fileName = `admission_${timestamp}_${file.originalname}`;
  const filePath = path.join(uploadsDir, fileName);

  fs.writeFileSync(filePath, file.buffer);
  return `/uploads/${fileName}`;
}

