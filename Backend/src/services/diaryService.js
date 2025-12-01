import { query, getClient } from '../config/database.js';

export async function createDiaryEntry(diaryData, volunteerId) {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');

    // Insert diary entry
    const diaryResult = await client.query(
      `INSERT INTO diary (
        center_id, volunteer_id, date, number_of_students,
        in_time, out_time, thought_of_day, subject, topic
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (center_id, date) 
      DO UPDATE SET 
        number_of_students = $4, in_time = $5, out_time = $6,
        thought_of_day = $7, subject = $8, topic = $9,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *`,
      [
        diaryData.center_id,
        volunteerId,
        diaryData.date,
        diaryData.number_of_students,
        diaryData.in_time,
        diaryData.out_time,
        diaryData.thought_of_day,
        diaryData.subject,
        diaryData.topic,
      ]
    );

    const diary = diaryResult.rows[0];

    // Insert volunteer attendance
    if (diaryData.volunteer_attendance && Array.isArray(diaryData.volunteer_attendance)) {
      // Delete existing volunteer attendance for this diary
      await client.query('DELETE FROM volunteer_attendance WHERE diary_id = $1', [diary.id]);

      for (const volAttendance of diaryData.volunteer_attendance) {
        await client.query(
          `INSERT INTO volunteer_attendance (diary_id, volunteer_id, status)
           VALUES ($1, $2, $3)
           ON CONFLICT (diary_id, volunteer_id) 
           DO UPDATE SET status = $3`,
          [diary.id, volAttendance.volunteer_id, volAttendance.status]
        );
      }
    }

    await client.query('COMMIT');
    return diary;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function getDiaryEntry(centerId, date) {
  const result = await query(
    `SELECT d.*, u.full_name as volunteer_name, u.volunteer_id
     FROM diary d
     JOIN users u ON d.volunteer_id = u.id
     WHERE d.center_id = $1 AND d.date = $2`,
    [centerId, date]
  );

  return result.rows[0];
}

export async function getDiaryByDateRange(centerId, startDate, endDate) {
  const result = await query(
    `SELECT d.*, u.full_name as volunteer_name, u.volunteer_id
     FROM diary d
     JOIN users u ON d.volunteer_id = u.id
     WHERE d.center_id = $1 AND d.date >= $2 AND d.date <= $3
     ORDER BY d.date DESC`,
    [centerId, startDate, endDate]
  );

  return result.rows;
}

export async function getVolunteerAttendanceForDiary(diaryId) {
  const result = await query(
    `SELECT va.*, u.full_name, u.volunteer_id
     FROM volunteer_attendance va
     JOIN users u ON va.volunteer_id = u.id
     WHERE va.diary_id = $1`,
    [diaryId]
  );

  return result.rows;
}

export async function updateDiaryPDF(diaryId, pdfPath) {
  const result = await query(
    'UPDATE diary SET pdf_path = $1 WHERE id = $2 RETURNING *',
    [pdfPath, diaryId]
  );

  return result.rows[0];
}

