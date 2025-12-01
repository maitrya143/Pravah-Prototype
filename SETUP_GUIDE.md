# Pravah Prototype - Complete Setup Guide

## Overview

This guide will help you set up and run the Pravah Prototype locally for testing with 40-50 students.

---

## Prerequisites

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 15 or higher ([Download](https://www.postgresql.org/download/))
- **Docker Desktop** (optional, for containerized setup) ([Download](https://www.docker.com/products/docker-desktop))
- **Git** (for cloning the repository)

---

## Option 1: Docker Compose Setup (Recommended)

### Step 1: Clone/Navigate to Project

```bash
cd "Pravah Prototype"
```

### Step 2: Start All Services

```bash
cd docker
docker-compose up
```

This will start:
- PostgreSQL database on port 5432
- Backend API server on port 5000
- Frontend React app on port 3000

### Step 3: Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

### Step 4: Database Setup (First Time)

The migrations run automatically when the backend starts. To seed the database:

1. Open a new terminal
2. Access the backend container:
```bash
docker exec -it pravah-backend bash
```
3. Run seed script:
```bash
npm run seed
```

### Step 5: Login

Use seed accounts:
- **Volunteer ID**: `25MDA177`
- **Password**: `password123`

---

## Option 2: Manual Setup (Development)

### Step 1: Database Setup

1. **Install PostgreSQL** and ensure it's running
2. **Create database**:
```bash
psql -U postgres
CREATE DATABASE pravah_db;
\q
```

### Step 2: Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create `.env` file**:
```bash
cp .env.example .env
```

4. **Edit `.env` file** with your database credentials:
```env
PORT=5000
NODE_ENV=development

DB_USER=postgres
DB_HOST=localhost
DB_NAME=pravah_db
DB_PASSWORD=your_password
DB_PORT=5432

JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h

QR_SECRET=your-qr-secret-key-change-in-production
```

5. **Run migrations**:
```bash
npm run migrate
```

6. **Seed database**:
```bash
npm run seed
```

7. **Start backend server**:
```bash
npm run dev
```

Backend should now be running on http://localhost:5000

### Step 3: Frontend Setup

1. **Open a new terminal** and navigate to frontend:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create `.env` file** (if needed):
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Start frontend**:
```bash
npm run dev
```

Frontend should now be running on http://localhost:3000 (or 5173)

---

## Adding Real Data

### Option 1: Using Seed Script

The seed script creates:
- 5 centers across different cities
- 4 volunteers with different city codes
- 50 students with random data
- 7 days of attendance records

**To re-seed** (clears existing data):
```bash
cd backend
npm run seed
```

### Option 2: Manual Entry

1. **Login** to the application
2. **Select a center**
3. **Go to New Admission** page
4. **Fill out student form** and submit
5. **Repeat** for additional students

### Option 3: Database Direct Insert

You can insert data directly into PostgreSQL:

```sql
-- Insert center
INSERT INTO centers (name, location, city, code) 
VALUES ('My Center', 'My Location', 'Mumbai', 'MUM-002');

-- Insert volunteer
INSERT INTO users (volunteer_id, full_name, password_hash, city, role)
VALUES ('25MDA200', 'Volunteer Name', '$2a$10$...', 'Mouda', 'volunteer');

-- Insert student
INSERT INTO students (student_id, full_name, date_of_birth, parent_name, contact_number, address, class, center_id, admission_date)
VALUES ('STU0051', 'Student Name', '2010-01-15', 'Parent Name', '9876543210', 'Address', '5', 1, CURRENT_DATE);
```

---

## Testing the Application

### 1. Authentication Test

1. Navigate to http://localhost:3000
2. Click "Sign up"
3. Create account with Volunteer ID format: `XXCITYNNN` (e.g., `25MDA177`)
4. Login with credentials

### 2. Center Selection Test

1. After login, you'll see centers filtered by your city
2. Select a center to proceed

### 3. New Admission Test

1. Go to "New Admission"
2. Fill out student form:
   - Full Name
   - Date of Birth
   - Parent Name
   - Contact Number
   - Address
   - Class
   - Admission Date
3. Optionally upload admission form image
4. Submit
5. QR code will be generated and displayed

### 4. Attendance Test

**Manual Attendance:**
1. Go to "Manual Attendance"
2. Select date
3. Check present/absent for each student
4. Submit

**QR Scan:**
1. Go to "QR Scan"
2. Allow camera access
3. Scan student QR code
4. Attendance automatically marked

### 5. Diary Test

1. Go to "Diary"
2. Fill out:
   - Date
   - Number of students
   - In/Out time
   - Thought of day
   - Subject & Topic
   - Volunteer attendance
3. Save
4. Download PDF

### 6. PDF Generation Test

1. Go to "Manual Attendance"
2. Mark attendance for a date
3. Click "Download PDF" (if available)
4. Verify PDF downloads correctly

---

## Troubleshooting

### Database Connection Error

**Error**: `Connection refused` or `Database does not exist`

**Solutions**:
1. Verify PostgreSQL is running:
```bash
# Windows
services.msc (look for PostgreSQL)

# Linux/Mac
sudo systemctl status postgresql
```

2. Check database exists:
```bash
psql -U postgres -l
```

3. Verify `.env` credentials match your PostgreSQL setup

### Migration Errors

**Error**: `relation already exists` or migration failures

**Solutions**:
1. Reset database:
```bash
psql -U postgres -d pravah_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
npm run migrate
```

2. Check migration files are in correct order

### Port Already in Use

**Error**: `Port 5000 already in use` or `Port 3000 already in use`

**Solutions**:
1. Change port in `.env` file (backend) or `vite.config.ts` (frontend)
2. Kill existing process:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill
```

### CORS Errors

**Error**: `CORS policy blocked`

**Solutions**:
1. Verify frontend `VITE_API_URL` matches backend URL
2. Check backend CORS configuration in `server.js`
3. Ensure both services are running

### QR Code Not Working

**Error**: QR code doesn't scan or validation fails

**Solutions**:
1. Verify `QR_SECRET` is set in backend `.env`
2. Check QR code hasn't expired (24 hours)
3. Ensure camera permissions granted
4. Test QR code format matches: `student_id|center_id|timestamp|signature`

### File Upload Errors

**Error**: `File upload failed` or `File too large`

**Solutions**:
1. Check file size (max 5MB for admission forms, 10MB for syllabus)
2. Verify `backend/uploads/` directory exists and is writable
3. Check multer configuration in routes

---

## Project Structure

```
Pravah Prototype/
├── backend/
│   ├── src/
│   │   ├── config/         # Database config
│   │   ├── middleware/     # Auth, error handling
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utilities (JWT, QR, city mapping)
│   │   └── server.js       # Entry point
│   ├── uploads/            # Uploaded files (created automatically)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── contexts/       # State management
│   │   ├── layouts/        # Layout components
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utilities (API client)
│   │   └── App.tsx         # Main app
│   └── package.json
│
├── database/
│   ├── migrations/         # Database migrations
│   └── seeds/             # Seed scripts
│
└── docker/
    ├── docker-compose.yml  # Docker orchestration
    └── Dockerfiles
```

---

## Code Architecture

### Backend Architecture

- **Routes** (`src/routes/`): Define API endpoints
- **Services** (`src/services/`): Business logic layer
- **Middleware** (`src/middleware/`): Authentication, error handling
- **Utils** (`src/utils/`): Helper functions (JWT, QR code, city mapping)
- **Config** (`src/config/`): Database configuration

### Frontend Architecture

- **Pages** (`src/pages/`): Route-level components
- **Layouts** (`src/layouts/`): Page layouts (Dashboard, Sidebar)
- **Components** (`src/components/`): Reusable UI components
- **Contexts** (`src/contexts/`): Global state (Auth, Center, Toast)
- **Utils** (`src/utils/`): API client, helpers

### Data Flow

1. **User Action** → Frontend Component
2. **API Call** → `utils/api.ts`
3. **HTTP Request** → Backend Route
4. **Middleware** → Authentication/Validation
5. **Service** → Business Logic
6. **Database** → PostgreSQL Query
7. **Response** → Frontend State Update

---

## Security Considerations

### 1. Environment Variables

- **Never commit** `.env` files to version control
- Use **strong secrets** for `JWT_SECRET` and `QR_SECRET`
- Rotate secrets periodically in production

### 2. Authentication

- JWT tokens expire after 24 hours
- Tokens stored in localStorage (consider httpOnly cookies for production)
- All protected routes require valid JWT token

### 3. QR Code Security

- HMAC-SHA256 signature prevents tampering
- 24-hour expiration prevents replay attacks
- QR secrets must match between generation and validation

### 4. Database Security

- Use parameterized queries (already implemented) to prevent SQL injection
- Database credentials should never be hardcoded
- Use connection pooling for performance

### 5. File Uploads

- File size limits enforced (5MB/10MB)
- Upload directory outside web root
- Validate file types in production

### 6. CORS

- Currently allows all origins (development)
- Restrict to specific domains in production

---

## Performance Optimization

### Database

- Indexes created on frequently queried columns
- Connection pooling enabled
- Queries optimized with JOINs

### Frontend

- Lazy loading for routes (can be added)
- Memoization for expensive computations
- Debouncing for QR scanning (can be added)

### Backend

- Static file serving for uploads
- Efficient query patterns
- PDF generation optimized

---

## Next Steps for Production

1. **Environment**: Set `NODE_ENV=production`
2. **HTTPS**: Use SSL certificates
3. **Database**: Use managed PostgreSQL service
4. **File Storage**: Use cloud storage (S3, etc.)
5. **Monitoring**: Add logging and error tracking
6. **Backup**: Implement database backups
7. **Testing**: Expand test coverage
8. **Documentation**: API documentation with Swagger/OpenAPI

---

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review logs in backend console
3. Check browser console for frontend errors
4. Verify database connectivity

---

## License

Internal use - UPAY NGO

