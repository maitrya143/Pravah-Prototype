# Phase 2 - Complete Implementation Guide

## Overview

Phase 2 adds full backend logic, database schema, authentication, QR-HMAC system, PDF generation, and functional pages to the Pravah Prototype.

---

## ✅ Completed Features

### Backend (100% Complete)
- ✅ Complete database schema with 8 tables
- ✅ Migration system with automatic execution
- ✅ Seed data with 40-50 fake students
- ✅ Authentication system (JWT)
- ✅ Center selection based on volunteer city
- ✅ Student admission with QR code generation (HMAC-SHA256)
- ✅ QR code scanning and validation
- ✅ Manual and QR-based attendance
- ✅ Diary entries with volunteer attendance
- ✅ Syllabus upload/download
- ✅ Performance analytics
- ✅ History filtering
- ✅ PDF generation (attendance, diary, admission)
- ✅ All API endpoints implemented

### Frontend (Partially Complete)
- ✅ Authentication pages (Login, Signup)
- ✅ Center Selection
- ✅ Context providers (Auth, Center)
- ✅ Protected routes
- ✅ API client utilities
- ⏳ Remaining pages need full API integration (see below)

---

## Database Setup

### Running Migrations

Migrations run automatically when the server starts. To run manually:

```bash
cd backend
npm run migrate
```

### Seeding the Database

Seed the database with test data (40-50 students, volunteers, centers):

```bash
cd backend
npm run seed
```

**Note:** Seed script will:
- Clear existing data
- Create 5 centers
- Create 4 volunteers
- Create 50 students
- Generate attendance records for last 7 days

### Database Schema

Tables created:
1. `users` - Volunteer accounts
2. `centers` - Center information
3. `students` - Student records
4. `attendance` - Daily attendance
5. `diary` - Daily diary entries
6. `volunteer_attendance` - Volunteer attendance in diary
7. `admissions_history` - Admission records
8. `syllabus_files` - Syllabus file storage

---

## Environment Variables

Create `.env` file in `backend/` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_USER=postgres
DB_HOST=localhost
DB_NAME=pravah_db
DB_PASSWORD=postgres
DB_PORT=5432

# JWT
JWT_SECRET=your-jwt-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# QR Code
QR_SECRET=your-qr-secret-key-change-in-production
```

---

## API Documentation

### Authentication

#### POST `/api/auth/signup`
Register new volunteer.

**Request:**
```json
{
  "volunteer_id": "25MDA177",
  "full_name": "John Doe",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "volunteer_id": "25MDA177",
    "full_name": "John Doe",
    "city": "Mouda",
    "role": "volunteer"
  },
  "token": "jwt_token_here"
}
```

#### POST `/api/auth/login`
Login volunteer.

**Request:**
```json
{
  "volunteer_id": "25MDA177",
  "password": "password123"
}
```

**Response:** Same as signup

#### GET `/api/auth/me`
Get current user (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

---

### Centers

#### GET `/api/centers/my-centers`
Get centers for logged-in volunteer (filtered by city).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "centers": [
    {
      "id": 1,
      "name": "Center Alpha",
      "location": "Mumbai",
      "city": "Mumbai",
      "code": "MUM-001"
    }
  ]
}
```

---

### Students & Admission

#### GET `/api/students/center/:centerId`
Get all students for a center.

#### POST `/api/students/admission`
Create new student admission.

**Headers:** `Authorization: Bearer <token>`

**Body:** `multipart/form-data`
- `full_name`: string
- `date_of_birth`: date
- `parent_name`: string
- `contact_number`: string
- `address`: string
- `class`: string
- `center_id`: number
- `admission_date`: date (optional)
- `admission_form`: file (optional)

**Response:**
```json
{
  "student": {
    "id": 1,
    "student_id": "STU0001",
    "full_name": "Student Name",
    "qr_code": "student_id|center_id|timestamp|signature",
    "qr_code_image": "data:image/png;base64,..."
  }
}
```

---

### Attendance

#### POST `/api/attendance/qr-scan`
Mark attendance from QR code scan.

**Body:**
```json
{
  "qr_data": "student_id|center_id|timestamp|signature"
}
```

#### POST `/api/attendance/bulk`
Bulk mark attendance manually.

**Body:**
```json
{
  "center_id": 1,
  "date": "2024-01-15",
  "attendance_data": [
    {"student_id": 1, "status": "present"},
    {"student_id": 2, "status": "absent"}
  ]
}
```

#### GET `/api/attendance/date/:date?center_id=1`
Get attendance for a specific date.

#### GET `/api/attendance/pdf/:date?center_id=1`
Download attendance PDF.

---

### QR Code System

#### Format
QR code payload format: `student_id|center_id|timestamp|hmac_signature`

#### Generation
- Generated during student admission
- Uses HMAC-SHA256 with `QR_SECRET`
- Includes timestamp for expiration (24 hours)

#### Validation
- Verifies HMAC signature
- Checks expiration (24 hours)
- Validates student and center exist

---

### Diary

#### POST `/api/diary`
Create/update diary entry.

**Body:**
```json
{
  "center_id": 1,
  "date": "2024-01-15",
  "number_of_students": 45,
  "in_time": "09:00",
  "out_time": "17:00",
  "thought_of_day": "Great day!",
  "subject": "Mathematics",
  "topic": "Algebra",
  "volunteer_attendance": [
    {"volunteer_id": 1, "status": "present"},
    {"volunteer_id": 2, "status": "absent"}
  ]
}
```

#### GET `/api/diary/date/:date?center_id=1`
Get diary entry for a date.

#### GET `/api/diary/pdf/:date?center_id=1`
Download diary PDF.

---

### Syllabus

#### POST `/api/syllabus/upload`
Upload syllabus file.

**Body:** `multipart/form-data`
- `center_id`: number
- `class`: string
- `syllabus_file`: file

#### GET `/api/syllabus/center/:centerId`
Get all syllabus files for a center.

#### GET `/api/syllabus/download/:id`
Download syllabus file.

---

### Performance

#### GET `/api/performance/center/:centerId?start_date=2024-01-01&end_date=2024-01-31`
Get center performance metrics.

**Response:**
```json
{
  "performance": {
    "weekly_attendance": [...],
    "total_students": 50,
    "active_classes": 10,
    "syllabus_completion_percentage": 75.5
  }
}
```

---

### History

#### GET `/api/history/all?center_id=1&start_date=2024-01-01&end_date=2024-01-31`
Get all history (admissions + attendance).

#### GET `/api/history/admissions?center_id=1&start_date=2024-01-01&end_date=2024-01-31`
Get admissions history.

#### GET `/api/history/attendance?center_id=1&start_date=2024-01-01&end_date=2024-01-31`
Get attendance history.

---

## City Detection from Volunteer ID

Format: `XXCITYNNN`

Example: `25MDA177`
- `25` = Prefix
- `MDA` = City code (Mouda)
- `177` = Volunteer number

City mapping in `backend/src/utils/cityMapping.js`:
- MDA → Mouda
- NGP → Nagpur
- BOM → Mumbai
- DLH → Delhi
- etc.

---

## Setup Instructions

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Setup Environment

Create `backend/.env` with required variables (see above).

### 3. Start Database

**Option A: Docker**
```bash
cd docker
docker-compose up postgres
```

**Option B: Local PostgreSQL**
Ensure PostgreSQL is running on port 5432.

### 4. Run Migrations & Seeds

```bash
cd backend
npm run migrate
npm run seed
```

### 5. Start Backend

```bash
cd backend
npm run dev
```

Backend runs on `http://localhost:5000`

### 6. Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:3000` (or 5173)

---

## Testing

### Test Accounts (from seed)

- Volunteer ID: `25MDA177`, Password: `password123`
- Volunteer ID: `25NGP123`, Password: `password123`
- Volunteer ID: `26BOM456`, Password: `password123`
- Volunteer ID: `27DLH789`, Password: `password123`

---

## Frontend Pages Status

### ✅ Completed
- Login
- Signup
- Center Selection

### ⏳ Needs Implementation
- Dashboard (needs stats API integration)
- New Admission (needs multi-step form, image upload, QR display)
- QR Scan (needs camera integration library)
- Manual Attendance (needs student list, bulk submit UI)
- Diary (needs form, volunteer selection)
- Syllabus (needs upload UI, file list)
- Center Performance (needs charts library)
- History (needs filtering UI, tables)
- Settings (needs profile update forms)

**Note:** All backend APIs are ready. Frontend pages need to be connected with full UI implementations.

---

## QR Code System Details

### How It Works

1. **Generation:**
   - Student ID + Center ID + Timestamp = Payload
   - HMAC-SHA256(Payload, QR_SECRET) = Signature
   - Final QR: `student_id|center_id|timestamp|signature`

2. **Validation:**
   - Split QR data
   - Recompute HMAC
   - Compare signatures (timing-safe)
   - Check expiration (24 hours)
   - Verify student/center exist

3. **Security:**
   - HMAC prevents tampering
   - Timestamp prevents replay
   - Expiration limits validity window

---

## PDF Generation

Uses PDFKit library. Generates:
- Attendance sheets (with student list and status)
- Diary entries (with all fields and volunteer attendance)
- Admission confirmations (with student details)

PDFs saved in `backend/uploads/pdfs/` and served via `/uploads/pdfs/`.

---

## File Uploads

- Admission forms: `backend/uploads/`
- Syllabus files: `backend/uploads/syllabus/`
- PDFs: `backend/uploads/pdfs/`

All served via Express static middleware at `/uploads/`.

---

## Next Steps

1. Complete remaining frontend pages
2. Add QR scanning library (html5-qrcode recommended)
3. Add charting library (recharts or chart.js)
4. Add error boundaries
5. Add loading states
6. Final testing and bug fixes

---

## Troubleshooting

### Database Connection Issues
- Check PostgreSQL is running
- Verify environment variables
- Check database exists: `pravah_db`

### Migration Issues
- Ensure database is empty or migrations table exists
- Check migration file syntax

### QR Code Issues
- Verify `QR_SECRET` is set
- Check QR payload format
- Verify timestamp not expired

### Authentication Issues
- Check JWT_SECRET is set
- Verify token in Authorization header
- Check token expiration

---

## License

Internal use - UPAY NGO

