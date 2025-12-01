import { query } from '../config/database.js';

export async function getCenterPerformance(centerId, startDate, endDate) {
  // Get attendance stats
  const attendanceStats = await query(
    `SELECT 
       date,
       COUNT(*) as total_students,
       SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present_count,
       SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent_count
     FROM attendance
     WHERE center_id = $1 AND date >= $2 AND date <= $3
     GROUP BY date
     ORDER BY date`,
    [centerId, startDate, endDate]
  );

  // Calculate weekly attendance percentage
  const weeklyStats = {};
  attendanceStats.rows.forEach(stat => {
    const date = new Date(stat.date);
    const weekStart = getWeekStart(date);
    const weekKey = weekStart.toISOString().split('T')[0];

    if (!weeklyStats[weekKey]) {
      weeklyStats[weekKey] = {
        week_start: weekKey,
        total_days: 0,
        total_students: 0,
        total_present: 0,
      };
    }

    weeklyStats[weekKey].total_days++;
    weeklyStats[weekKey].total_students += parseInt(stat.total_students);
    weeklyStats[weekKey].total_present += parseInt(stat.present_count);
  });

  const weeklyAttendance = Object.values(weeklyStats).map(week => ({
    ...week,
    attendance_percentage: week.total_students > 0
      ? ((week.total_present / week.total_students) * 100).toFixed(2)
      : 0,
  }));

  // Get total students
  const totalStudentsResult = await query(
    'SELECT COUNT(*) as count FROM students WHERE center_id = $1',
    [centerId]
  );
  const totalStudents = parseInt(totalStudentsResult.rows[0].count);

  // Get active classes
  const activeClassesResult = await query(
    'SELECT COUNT(DISTINCT class) as count FROM students WHERE center_id = $1',
    [centerId]
  );
  const activeClasses = parseInt(activeClassesResult.rows[0].count);

  // Get syllabus completion (dummy data for now)
  const syllabusStats = await query(
    `SELECT class, COUNT(*) as syllabus_count
     FROM syllabus_files
     WHERE center_id = $1
     GROUP BY class`,
    [centerId]
  );

  const syllabusCompletion = ((syllabusStats.rows.length / Math.max(activeClasses, 1)) * 100).toFixed(2);

  return {
    weekly_attendance: weeklyAttendance,
    total_students: totalStudents,
    active_classes: activeClasses,
    syllabus_completion_percentage: parseFloat(syllabusCompletion),
    attendance_stats: attendanceStats.rows,
  };
}

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

