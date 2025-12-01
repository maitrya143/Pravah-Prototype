import { query } from '../config/database.js';

export async function getAdmissionsHistory(centerId, startDate, endDate) {
  const result = await query(
    `SELECT ah.*, u.full_name as admitted_by_name, u.volunteer_id as admitted_by_volunteer_id
     FROM admissions_history ah
     LEFT JOIN users u ON ah.admitted_by = u.id
     WHERE ah.center_id = $1 
       AND ah.admission_date >= $2 
       AND ah.admission_date <= $3
     ORDER BY ah.admission_date DESC, ah.created_at DESC`,
    [centerId, startDate, endDate]
  );

  return result.rows;
}

export async function getAttendanceHistory(centerId, startDate, endDate) {
  const result = await query(
    `SELECT a.*, s.full_name as student_name, s.student_id, s.class,
            u.full_name as marked_by_name
     FROM attendance a
     JOIN students s ON a.student_id = s.id
     LEFT JOIN users u ON a.marked_by = u.id
     WHERE a.center_id = $1 
       AND a.date >= $2 
       AND a.date <= $3
     ORDER BY a.date DESC, s.full_name`,
    [centerId, startDate, endDate]
  );

  return result.rows;
}

export async function getAllHistory(centerId, startDate, endDate) {
  const [admissions, attendance] = await Promise.all([
    getAdmissionsHistory(centerId, startDate, endDate),
    getAttendanceHistory(centerId, startDate, endDate),
  ]);

  return {
    admissions,
    attendance,
  };
}

