import { query, getClient } from '../config/database.js';
import { parseQRPayload } from '../utils/qrCode.js';

export async function markAttendance(studentId, centerId, date, status, markedBy, qrScanned = false) {
  const result = await query(
    `INSERT INTO attendance (student_id, center_id, date, status, marked_by, qr_scanned)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (student_id, date) 
     DO UPDATE SET status = $4, marked_by = $5, marked_at = CURRENT_TIMESTAMP, qr_scanned = $6
     RETURNING *`,
    [studentId, centerId, date, status, markedBy, qrScanned]
  );

  return result.rows[0];
}

export async function markAttendanceFromQR(qrData, markedBy) {
  try {
    const { studentId, centerId } = parseQRPayload(qrData);
    const today = new Date().toISOString().split('T')[0];

    return await markAttendance(studentId, centerId, today, 'present', markedBy, true);
  } catch (error) {
    throw new Error(`Invalid QR code: ${error.message}`);
  }
}

export async function bulkMarkAttendance(attendanceData, centerId, date, markedBy) {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');

    for (const item of attendanceData) {
      await client.query(
        `INSERT INTO attendance (student_id, center_id, date, status, marked_by)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (student_id, date) 
         DO UPDATE SET status = $4, marked_by = $5, marked_at = CURRENT_TIMESTAMP`,
        [item.student_id, centerId, date, item.status, markedBy]
      );
    }

    await client.query('COMMIT');
    return { success: true, count: attendanceData.length };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function getAttendanceByDate(centerId, date) {
  const result = await query(
    `SELECT a.*, s.full_name, s.student_id, s.class
     FROM attendance a
     JOIN students s ON a.student_id = s.id
     WHERE a.center_id = $1 AND a.date = $2
     ORDER BY s.full_name`,
    [centerId, date]
  );

  return result.rows;
}

export async function getAttendanceByDateRange(centerId, startDate, endDate) {
  const result = await query(
    `SELECT a.*, s.full_name, s.student_id, s.class
     FROM attendance a
     JOIN students s ON a.student_id = s.id
     WHERE a.center_id = $1 AND a.date >= $2 AND a.date <= $3
     ORDER BY a.date DESC, s.full_name`,
    [centerId, startDate, endDate]
  );

  return result.rows;
}

export async function getAttendanceStats(centerId, startDate, endDate) {
  const result = await query(
    `SELECT 
       date,
       COUNT(*) as total_students,
       SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present_count,
       SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent_count,
       SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late_count
     FROM attendance
     WHERE center_id = $1 AND date >= $2 AND date <= $3
     GROUP BY date
     ORDER BY date DESC`,
    [centerId, startDate, endDate]
  );

  return result.rows;
}

