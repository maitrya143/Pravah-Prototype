import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfsDir = path.join(__dirname, '../../uploads/pdfs');
if (!fs.existsSync(pdfsDir)) {
  fs.mkdirSync(pdfsDir, { recursive: true });
}

export async function generateAttendancePDF(attendanceData, centerInfo, date) {
  const fileName = `attendance_${centerInfo.id}_${date.replace(/-/g, '')}_${Date.now()}.pdf`;
  const filePath = path.join(pdfsDir, fileName);

  const doc = new PDFDocument({ margin: 50 });

  // Pipe to file
  doc.pipe(fs.createWriteStream(filePath));

  // Header
  doc.fontSize(20).text('Attendance Sheet', { align: 'center' });
  doc.fontSize(14).text(`Center: ${centerInfo.name}`, { align: 'center' });
  doc.fontSize(12).text(`Date: ${date}`, { align: 'center' });
  doc.moveDown(2);

  // Table headers
  const tableTop = doc.y;
  const itemHeight = 20;
  let currentY = tableTop;

  doc.fontSize(10);
  doc.text('S.No.', 50, currentY);
  doc.text('Student ID', 100, currentY);
  doc.text('Name', 180, currentY);
  doc.text('Class', 350, currentY);
  doc.text('Status', 400, currentY);

  currentY += itemHeight;
  doc.moveTo(50, currentY).lineTo(550, currentY).stroke();

  // Table rows
  attendanceData.forEach((item, index) => {
    if (currentY > 700) {
      doc.addPage();
      currentY = 50;
    }

    currentY += itemHeight;
    doc.text(`${index + 1}`, 50, currentY);
    doc.text(item.student_id || '-', 100, currentY);
    doc.text(item.full_name || item.student_name || '-', 180, currentY, { width: 150 });
    doc.text(item.class || '-', 350, currentY);
    doc.text(item.status.toUpperCase(), 400, currentY);
  });

  doc.end();

  // Wait for PDF to be generated
  return new Promise((resolve, reject) => {
    doc.on('end', () => {
      resolve(`/uploads/pdfs/${fileName}`);
    });
    doc.on('error', reject);
  });
}

export async function generateDiaryPDF(diaryData, centerInfo, volunteerAttendance) {
  const fileName = `diary_${centerInfo.id}_${diaryData.date.replace(/-/g, '')}_${Date.now()}.pdf`;
  const filePath = path.join(pdfsDir, fileName);

  const doc = new PDFDocument({ margin: 50 });

  doc.pipe(fs.createWriteStream(filePath));

  // Header
  doc.fontSize(20).text('Daily Diary', { align: 'center' });
  doc.fontSize(14).text(`Center: ${centerInfo.name}`, { align: 'center' });
  doc.fontSize(12).text(`Date: ${diaryData.date}`, { align: 'center' });
  doc.moveDown(2);

  // Diary content
  doc.fontSize(12);
  doc.text(`Number of Students: ${diaryData.number_of_students || 0}`, { continued: false });
  doc.text(`In Time: ${diaryData.in_time || 'N/A'}`, { continued: true });
  doc.text(`Out Time: ${diaryData.out_time || 'N/A'}`, { continued: true });
  doc.moveDown();

  if (diaryData.subject) {
    doc.text(`Subject: ${diaryData.subject}`);
  }
  if (diaryData.topic) {
    doc.text(`Topic: ${diaryData.topic}`);
  }
  doc.moveDown();

  if (diaryData.thought_of_day) {
    doc.fontSize(11).text('Thought of the Day:', { underline: true });
    doc.fontSize(10).text(diaryData.thought_of_day, { align: 'justify' });
    doc.moveDown();
  }

  // Volunteer attendance
  if (volunteerAttendance && volunteerAttendance.length > 0) {
    doc.fontSize(11).text('Volunteer Attendance:', { underline: true });
    doc.moveDown(0.5);

    volunteerAttendance.forEach(vol => {
      doc.fontSize(10).text(
        `• ${vol.full_name || vol.volunteer_id}: ${vol.status.toUpperCase()}`,
        { indent: 20 }
      );
    });
  }

  doc.end();

  return new Promise((resolve, reject) => {
    doc.on('end', () => {
      resolve(`/uploads/pdfs/${fileName}`);
    });
    doc.on('error', reject);
  });
}

export async function generateAdmissionConfirmation(studentData, centerInfo) {
  const fileName = `admission_${studentData.student_id}_${Date.now()}.pdf`;
  const filePath = path.join(pdfsDir, fileName);

  const doc = new PDFDocument({ margin: 50 });

  doc.pipe(fs.createWriteStream(filePath));

  // Header
  doc.fontSize(20).text('Admission Confirmation', { align: 'center' });
  doc.moveDown(2);

  // Student Information
  doc.fontSize(14).text('Student Information:', { underline: true });
  doc.moveDown(0.5);

  doc.fontSize(11);
  doc.text(`Student ID: ${studentData.student_id || '-'}`);
  doc.text(`Full Name: ${studentData.full_name || '-'}`);
  doc.text(`Date of Birth: ${studentData.date_of_birth || '-'}`);
  doc.text(`Class: ${studentData.class || '-'}`);
  doc.moveDown();

  doc.text(`Parent/Guardian Name: ${studentData.parent_name || '-'}`);
  doc.text(`Contact Number: ${studentData.contact_number || '-'}`);
  doc.text(`Address: ${studentData.address || '-'}`);
  doc.moveDown();

  doc.text(`Center: ${centerInfo.name || '-'}`);
  doc.text(`Admission Date: ${studentData.admission_date || '-'}`);

  doc.end();

  return new Promise((resolve, reject) => {
    doc.on('end', () => {
      resolve(`/uploads/pdfs/${fileName}`);
    });
    doc.on('error', reject);
  });
}

