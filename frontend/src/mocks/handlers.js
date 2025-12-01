// src/mocks/handlers.js
import { rest } from 'msw';
import { mockCenters, mockStudents, mockUsers } from './mockData.js';

// In-memory stores (will be mutated during runtime)
let currentStudents = [...mockStudents];
let currentAttendance = [];
let currentDiary = [];
let currentAdmissions = [];
let currentSyllabus = [];
let currentUsers = [...mockUsers];

// Helper to generate JWT-like token
function generateToken() {
  return `mock_jwt_token_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
}

// Helper to parse QR string (expects base64(payload)|signature)
function parseQRString(qrString) {
  try {
    const [base64Payload] = qrString.split('|');
    const payload = atob(base64Payload);
    const [studentId, centerId, timestamp] = payload.split('|');
    return { studentId, centerId: Number(centerId), timestamp: Number(timestamp) };
  } catch (error) {
    return null;
  }
}

// Get city from volunteer_id
function getCityFromVolunteerId(volunteerId) {
  const code = volunteerId.slice(2, 5);
  const cityMap = { MDA: 'Mouda', NGP: 'Nagpur', BOM: 'Mumbai', DLH: 'Delhi' };
  return cityMap[code] || 'Mouda';
}

// Filter centers by city
function getCentersByCity(city) {
  return mockCenters.filter((center) => center.city === city);
}

export const handlers = [
  // ==================== AUTH ====================

  // POST /api/auth/signup
  rest.post('/api/auth/signup', async (req, res, ctx) => {
    await new Promise((r) => setTimeout(r, 200));
    const body = await req.json();
    const { volunteer_id, full_name, password } = body;

    if (!volunteer_id || !full_name || !password) {
      return res(ctx.status(400), ctx.json({ error: 'Missing required fields' }));
    }

    const exists = currentUsers.find((u) => u.volunteer_id === volunteer_id);
    if (exists) {
      return res(ctx.status(409), ctx.json({ error: 'Volunteer ID already exists' }));
    }

    const city = getCityFromVolunteerId(volunteer_id);
    const newUser = {
      id: currentUsers.length + 1,
      volunteer_id,
      full_name,
      city,
      role: 'volunteer',
    };
    currentUsers.push(newUser);
    const token = generateToken();

    return res(ctx.status(201), ctx.json({ user: newUser, token }));
  }),

  // POST /api/auth/login
  rest.post('/api/auth/login', async (req, res, ctx) => {
    await new Promise((r) => setTimeout(r, 250));
    const body = await req.json();
    const { volunteer_id, password } = body;

    if (!volunteer_id || !password) {
      return res(ctx.status(400), ctx.json({ error: 'Volunteer ID and password required' }));
    }

    const user = currentUsers.find((u) => u.volunteer_id === volunteer_id);
    if (!user) {
      return res(ctx.status(401), ctx.json({ error: 'Invalid volunteer ID or password' }));
    }

    const token = generateToken();
    const { password: _, ...userWithoutPassword } = user;
    return res(ctx.status(200), ctx.json({ user: userWithoutPassword, token }));
  }),

  // GET /api/auth/me
  rest.get('/api/auth/me', async (req, res, ctx) => {
    await new Promise((r) => setTimeout(r, 150));
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(ctx.status(401), ctx.json({ error: 'Unauthorized' }));
    }

    const user = currentUsers[0];
    if (!user) {
      return res(ctx.status(404), ctx.json({ error: 'User not found' }));
    }

    return res(ctx.status(200), ctx.json({ user }));
  }),

  // ==================== CENTERS ====================

  // GET /api/centers/my-centers
  rest.get('/api/centers/my-centers', async (req, res, ctx) => {
    await new Promise((r) => setTimeout(r, 200));
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return res(ctx.status(401), ctx.json({ error: 'Unauthorized' }));
    }

    // Mock: get city from first user or default to Mouda
    const user = currentUsers[0] || { city: 'Mouda' };
    const centers = getCentersByCity(user.city);

    return res(ctx.status(200), ctx.json({ centers }));
  }),

  // GET /api/centers/:id
  rest.get('/api/centers/:id', async (req, res, ctx) => {
    await new Promise((r) => setTimeout(r, 150));
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return res(ctx.status(401), ctx.json({ error: 'Unauthorized' }));
    }

    const center = mockCenters.find((c) => c.id === Number(req.params.id));
    if (!center) {
      return res(ctx.status(404), ctx.json({ error: 'Center not found' }));
    }

    return res(ctx.status(200), ctx.json({ center }));
  }),

  // ==================== USERS ====================

  // GET /api/users/volunteers
  rest.get('/api/users/volunteers', async (req, res, ctx) => {
    await new Promise((r) => setTimeout(r, 200));
    const url = new URL(req.url);
    const centerId = url.searchParams.get('center_id');

    const volunteers = currentUsers
      .filter((u) => u.role === 'volunteer')
      .map(({ password, ...user }) => user);

    return res(ctx.status(200), ctx.json({ volunteers }));
  }),

  // ==================== STUDENTS ====================

  // GET /api/students/center/:centerId
  rest.get('/api/students/center/:centerId', async (req, res, ctx) => {
    await new Promise((r) => setTimeout(r, 300));
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return res(ctx.status(401), ctx.json({ error: 'Unauthorized' }));
    }

    const centerId = Number(req.params.centerId);
    const students = currentStudents.filter((s) => s.center_id === centerId);

    return res(ctx.status(200), ctx.json({ students }));
  }),

  // POST /api/students/admission (form-data)
  rest.post('/api/students/admission', async (req, res, ctx) => {
    await new Promise((r) => setTimeout(r, 400));
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return res(ctx.status(401), ctx.json({ error: 'Unauthorized' }));
    }

    const formData = await req.formData();
    const studentData = {
      full_name: formData.get('full_name'),
      date_of_birth: formData.get('date_of_birth'),
      parent_name: formData.get('parent_name'),
      contact_number: formData.get('contact_number'),
      address: formData.get('address'),
      class: formData.get('class'),
      center_id: Number(formData.get('center_id')),
      admission_date: formData.get('admission_date') || new Date().toISOString().split('T')[0],
    };

    // Generate student ID
    const nextId = Math.max(0, ...currentStudents.map((s) => s.id)) + 1;
    const studentId = `STU${String(nextId).padStart(4, '0')}`;

    // Generate QR code
    const timestamp = Date.now();
    const qrPayload = `${studentId}|${studentData.center_id}|${timestamp}`;
    const base64Payload = btoa(qrPayload);
    const signature = `sig_${Math.random().toString(36).substring(2, 15)}`;
    const qrString = `${base64Payload}|${signature}`;

    const newStudent = {
      id: nextId,
      student_id: studentId,
      ...studentData,
      qr_code: qrString,
      qr_string: qrString,
      qr_payload: qrPayload,
      qr_svg: `<svg width="200" height="200"><text>${studentId}</text></svg>`,
    };

    // Add to stores
    currentStudents.push(newStudent);
    currentAdmissions.push({
      ...newStudent,
      admitted_by: 1,
      created_at: new Date().toISOString(),
    });

    return res(ctx.status(201), ctx.json({ student: newStudent }));
  }),

  // ==================== ATTENDANCE ====================

  // POST /api/attendance/qr-scan
  rest.post('/api/attendance/qr-scan', async (req, res, ctx) => {
    await new Promise((r) => setTimeout(r, 300));
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return res(ctx.status(401), ctx.json({ error: 'Unauthorized' }));
    }

    const body = await req.json();
    const { qr_data } = body;

    if (!qr_data) {
      return res(ctx.status(400), ctx.json({ error: 'QR code data required' }));
    }

    const parsed = parseQRString(qr_data);
    if (!parsed) {
      return res(ctx.status(400), ctx.json({ error: 'Invalid QR code' }));
    }

    // Check if QR expired (24 hours)
    const age = Date.now() - parsed.timestamp;
    if (age > 24 * 60 * 60 * 1000) {
      return res(ctx.status(400), ctx.json({ error: 'QR code has expired' }));
    }

    // Find student by student_id (string like "STU0001")
    const student = currentStudents.find((s) => s.student_id === parsed.studentId);
    if (!student) {
      return res(ctx.status(404), ctx.json({ error: 'Student not found' }));
    }

    const today = new Date().toISOString().split('T')[0];

    const attendance = {
      id: currentAttendance.length + 1,
      student_id: student.id, // Use numeric ID
      center_id: parsed.centerId,
      date: today,
      status: 'present',
      marked_by: 1,
      marked_at: new Date().toISOString(),
      qr_scanned: true,
    };

    currentAttendance.push(attendance);

    return res(ctx.status(200), ctx.json({ attendance, message: 'Attendance marked successfully' }));
  }),

  // POST /api/attendance/bulk
  rest.post('/api/attendance/bulk', async (req, res, ctx) => {
    await new Promise((r) => setTimeout(r, 400));
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return res(ctx.status(401), ctx.json({ error: 'Unauthorized' }));
    }

    const body = await req.json();
    const { attendance_data, center_id, date } = body;

    if (!attendance_data || !Array.isArray(attendance_data)) {
      return res(ctx.status(400), ctx.json({ error: 'Invalid attendance data' }));
    }

    attendance_data.forEach((item) => {
      currentAttendance.push({
        id: currentAttendance.length + 1,
        student_id: item.student_id,
        center_id: Number(center_id),
        date,
        status: item.status || 'present',
        marked_by: 1,
        marked_at: new Date().toISOString(),
      });
    });

    return res(ctx.status(200), ctx.json({ success: true, count: attendance_data.length }));
  }),

  // GET /api/attendance/date/:date
  rest.get('/api/attendance/date/:date', async (req, res, ctx) => {
    await new Promise((r) => setTimeout(r, 250));
    const url = new URL(req.url);
    const centerId = Number(url.searchParams.get('center_id'));
    const date = req.params.date;

    const attendance = currentAttendance.filter((a) => a.date === date && a.center_id === centerId);
    const students = currentStudents.filter((s) => s.center_id === centerId);

    // Merge with student data
    const attendanceWithStudents = students.map((student) => {
      const att = attendance.find((a) => a.student_id === student.id);
      return {
        ...att,
        full_name: student.full_name,
        student_id: student.student_id,
        class: student.class,
      };
    });

    return res(ctx.status(200), ctx.json({ attendance: attendanceWithStudents }));
  }),

  // GET /api/attendance/pdf/:date
  rest.get('/api/attendance/pdf/:date', async (req, res, ctx) => {
    await new Promise((r) => setTimeout(r, 500));
    const url = new URL(req.url);
    const centerId = url.searchParams.get('center_id');
    const date = req.params.date;

    // Mock PDF content (text representation)
    const pdfContent = `Mock Attendance PDF for Center ${centerId}, Date ${date}`;

    return res(
      ctx.status(200),
      ctx.set('Content-Type', 'application/pdf'),
      ctx.set('Content-Disposition', `attachment; filename="attendance_${date}.pdf"`),
      ctx.text(pdfContent)
    );
  }),

  // ==================== DIARY ====================

  // POST /api/diary
  rest.post('/api/diary', async (req, res, ctx) => {
    await new Promise((r) => setTimeout(r, 300));
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return res(ctx.status(401), ctx.json({ error: 'Unauthorized' }));
    }

    const body = await req.json();
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
    } = body;

    if (!center_id || !date || number_of_students === undefined) {
      return res(ctx.status(400), ctx.json({ error: 'Missing required fields' }));
    }

    const diaryEntry = {
      id: currentDiary.length + 1,
      center_id: Number(center_id),
      volunteer_id: 1,
      date,
      number_of_students: Number(number_of_students),
      in_time,
      out_time,
      thought_of_day,
      subject,
      topic,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    currentDiary.push(diaryEntry);

    return res(ctx.status(200), ctx.json({ diary: diaryEntry }));
  }),

  // GET /api/diary/date/:date
  rest.get('/api/diary/date/:date', async (req, res, ctx) => {
    await new Promise((r) => setTimeout(r, 200));
    const url = new URL(req.url);
    const centerId = Number(url.searchParams.get('center_id'));
    const date = req.params.date;

    const diary = currentDiary.find((d) => d.date === date && d.center_id === centerId);

    if (!diary) {
      return res(ctx.status(404), ctx.json({ error: 'Diary entry not found' }));
    }

    return res(ctx.status(200), ctx.json({ diary, volunteer_attendance: [] }));
  }),

  // GET /api/diary/pdf/:date
  rest.get('/api/diary/pdf/:date', async (req, res, ctx) => {
    await new Promise((r) => setTimeout(r, 500));
    const url = new URL(req.url);
    const centerId = url.searchParams.get('center_id');
    const date = req.params.date;

    const pdfContent = `Mock Diary PDF for Center ${centerId}, Date ${date}`;

    return res(
      ctx.status(200),
      ctx.set('Content-Type', 'application/pdf'),
      ctx.set('Content-Disposition', `attachment; filename="diary_${date}.pdf"`),
      ctx.text(pdfContent)
    );
  }),

  // ==================== SYLLABUS ====================

  // POST /api/syllabus/upload
  rest.post('/api/syllabus/upload', async (req, res, ctx) => {
    await new Promise((r) => setTimeout(r, 400));
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return res(ctx.status(401), ctx.json({ error: 'Unauthorized' }));
    }

    const formData = await req.formData();
    const syllabus = {
      id: currentSyllabus.length + 1,
      center_id: Number(formData.get('center_id')),
      class: formData.get('class'),
      file_name: formData.get('syllabus_file')?.name || 'syllabus.pdf',
      file_path: `/uploads/syllabus/${Date.now()}.pdf`,
      file_size: 1024,
      uploaded_by: 1,
      uploaded_at: new Date().toISOString(),
    };

    currentSyllabus.push(syllabus);

    return res(ctx.status(201), ctx.json({ syllabus }));
  }),

  // GET /api/syllabus/center/:centerId
  rest.get('/api/syllabus/center/:centerId', async (req, res, ctx) => {
    await new Promise((r) => setTimeout(r, 200));
    const centerId = Number(req.params.centerId);
    const syllabus = currentSyllabus.filter((s) => s.center_id === centerId);

    return res(ctx.status(200), ctx.json({ syllabus }));
  }),

  // GET /api/syllabus/download/:id
  rest.get('/api/syllabus/download/:id', async (req, res, ctx) => {
    await new Promise((r) => setTimeout(r, 300));
    const id = Number(req.params.id);
    const syllabus = currentSyllabus.find((s) => s.id === id);

    if (!syllabus) {
      return res(ctx.status(404), ctx.json({ error: 'Syllabus not found' }));
    }

    const pdfContent = `Mock Syllabus PDF - Class ${syllabus.class}`;

    return res(
      ctx.status(200),
      ctx.set('Content-Type', 'application/pdf'),
      ctx.set('Content-Disposition', `attachment; filename="${syllabus.file_name}"`),
      ctx.text(pdfContent)
    );
  }),

  // ==================== PERFORMANCE ====================

  // GET /api/performance/center/:centerId
  rest.get('/api/performance/center/:centerId', async (req, res, ctx) => {
    await new Promise((r) => setTimeout(r, 400));
    const url = new URL(req.url);
    const centerId = Number(req.params.centerId);
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');

    const studentsInCenter = currentStudents.filter((s) => s.center_id === centerId);
    const attendanceInRange = currentAttendance.filter(
      (a) => a.center_id === centerId && a.date >= startDate && a.date <= endDate
    );

    return res(
      ctx.status(200),
      ctx.json({
        performance: {
          weekly_attendance: [],
          total_students: studentsInCenter.length,
          active_classes: 10,
          syllabus_completion_percentage: 75.5,
          attendance_stats: [],
        },
      })
    );
  }),

  // ==================== HISTORY ====================

  // GET /api/history/all
  rest.get('/api/history/all', async (req, res, ctx) => {
    await new Promise((r) => setTimeout(r, 350));
    const url = new URL(req.url);
    const centerId = Number(url.searchParams.get('center_id'));
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');

    const admissions = currentAdmissions.filter(
      (a) => a.center_id === centerId && a.admission_date >= startDate && a.admission_date <= endDate
    );
    const attendance = currentAttendance.filter(
      (a) => a.center_id === centerId && a.date >= startDate && a.date <= endDate
    );

    return res(
      ctx.status(200),
      ctx.json({
        history: {
          admissions,
          attendance,
        },
      })
    );
  }),

  // GET /api/history/admissions
  rest.get('/api/history/admissions', async (req, res, ctx) => {
    await new Promise((r) => setTimeout(r, 300));
    const url = new URL(req.url);
    const centerId = Number(url.searchParams.get('center_id'));
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');

    const admissions = currentAdmissions.filter(
      (a) => a.center_id === centerId && a.admission_date >= startDate && a.admission_date <= endDate
    );

    return res(ctx.status(200), ctx.json({ admissions }));
  }),

  // GET /api/history/attendance
  rest.get('/api/history/attendance', async (req, res, ctx) => {
    await new Promise((r) => setTimeout(r, 300));
    const url = new URL(req.url);
    const centerId = Number(url.searchParams.get('center_id'));
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');

    const attendance = currentAttendance.filter(
      (a) => a.center_id === centerId && a.date >= startDate && a.date <= endDate
    );

    return res(ctx.status(200), ctx.json({ attendance }));
  }),
];

// Reset function for tests
export function resetMocks() {
  currentStudents = [...mockStudents];
  currentAttendance = [];
  currentDiary = [];
  currentAdmissions = [];
  currentSyllabus = [];
  currentUsers = [...mockUsers];
}
