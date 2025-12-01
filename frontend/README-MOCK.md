# Pravah Frontend - MSW Mock Backend Guide

Complete guide for running the Pravah frontend locally with MSW (Mock Service Worker) mocks, **without requiring a real backend or PostgreSQL database**.

---

## 🚀 Quick Start

### Windows PowerShell Commands

```powershell
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Initialize MSW service worker (run this if public/mockServiceWorker.js doesn't exist)
npx msw init public/ --save

# 4. Start frontend development server (MSW automatically enables in dev mode)
npm run dev
```

**What happens:**
- Vite starts on `http://localhost:5173` (or next available port)
- MSW automatically starts in development mode
- Check browser console for: `[MSW] Mock API Enabled` (green text)

### Alternative: Use start:mock script

```powershell
npm run start:mock
```

This is the same as `npm run dev` but explicitly sets environment variables.

---

## 📋 Prerequisites

- **Node.js** v18 or higher
- **npm** or yarn
- **MSW** installed as devDependency (already in package.json)

---

## 🔧 Setup Instructions

### Step 1: Install Dependencies

```powershell
cd frontend
npm install
```

This installs all required packages including:
- `msw` - Mock Service Worker
- `cypress` - E2E testing (optional)
- `cross-env` - Environment variables

### Step 2: Initialize MSW Service Worker

The service worker file (`public/mockServiceWorker.js`) is required for MSW to work in the browser.

**If the file doesn't exist or is outdated:**

```powershell
npx msw init public/ --save
```

This command:
- Creates `public/mockServiceWorker.js`
- Updates `package.json` with MSW configuration
- Sets up the service worker for browser interception

**Note:** This file should **NOT** be modified manually. MSW manages it automatically.

### Step 3: Start Development Server

**Windows PowerShell:**

```powershell
npm run dev
```

Or explicitly with mock flag:

```powershell
npm run start:mock
```

**What happens:**
1. Vite starts the dev server (usually on `http://localhost:5173`)
2. MSW automatically starts in development mode (checks `import.meta.env.MODE === 'development'`)
3. All `/api/*` requests are intercepted by MSW
4. Mock responses are returned instantly with realistic delays (200-500ms)

### Step 4: Verify MSW is Running

1. Open browser to the dev server URL (shown in terminal)
2. Open browser console (F12)
3. Look for: `[MSW] Mock API Enabled` (green text)
4. Open Network tab - requests to `/api/*` should show "mock" status

---

## 🎭 How It Works

### MSW Architecture

```
Frontend Request → MSW Service Worker → Handler → Mock Response
```

1. **Service Worker** intercepts all HTTP requests
2. **Handlers** match requests to mock endpoints
3. **In-memory stores** simulate database behavior
4. **Responses** are returned to frontend

### Mock Data

- **40 Students** distributed across centers
- **20 Centers** (10 Mouda + 10 Nagpur)
- **2 Volunteers** (one per city)
- All data stored in memory (no database needed)

---

## 📡 Mock API Endpoints

All endpoints are fully functional with realistic responses:

### Authentication
- `POST /api/auth/signup` - Create volunteer account
- `POST /api/auth/login` - Login with volunteer ID
- `GET /api/auth/me` - Get current user

### Centers
- `GET /api/centers/my-centers` - Get centers for volunteer (filtered by city)
- `GET /api/centers/:id` - Get center details

### Students
- `GET /api/students/center/:centerId` - Get all students for center
- `POST /api/students/admission` - Create new student (with QR generation)

### Attendance
- `POST /api/attendance/qr-scan` - Mark attendance from QR code
- `POST /api/attendance/bulk` - Bulk mark attendance
- `GET /api/attendance/date/:date` - Get attendance for date
- `GET /api/attendance/pdf/:date` - Download attendance PDF

### Diary
- `POST /api/diary` - Create diary entry
- `GET /api/diary/date/:date` - Get diary entry
- `GET /api/diary/pdf/:date` - Download diary PDF

### Syllabus
- `POST /api/syllabus/upload` - Upload syllabus file
- `GET /api/syllabus/center/:centerId` - Get syllabus files
- `GET /api/syllabus/download/:id` - Download syllabus

### Performance & History
- `GET /api/performance/center/:centerId` - Get performance metrics
- `GET /api/history/all` - Get all history
- `GET /api/history/admissions` - Get admissions history
- `GET /api/history/attendance` - Get attendance history

---

## 🧪 Testing with Mocks

### Test Credentials

**Volunteer 1 (Mouda):**
- Volunteer ID: `25MDA177`
- Password: Any (mocks don't validate passwords)
- City: Mouda
- Available Centers: 10 Mouda centers

**Volunteer 2 (Nagpur):**
- Volunteer ID: `25NGP123`
- Password: Any
- City: Nagpur
- Available Centers: 10 Nagpur centers

### Test Flow

1. **Signup/Login**
   - Use Volunteer ID: `25MDA177`
   - Any password works

2. **Center Selection**
   - You'll see 10 centers in Mouda
   - Select any center

3. **New Admission**
   - Add a new student
   - Student is automatically added to in-memory store
   - QR code is generated with format: `base64(payload)|signature`

4. **Manual Attendance**
   - View all students for selected center
   - Mark attendance
   - Data persists in memory

5. **QR Scan**
   - Use QR code from admission
   - QR format: `base64(STU0001|1|timestamp)|signature`
   - Attendance is marked automatically

---

## 🔍 Mock Data Details

### Centers

**Mouda (10 centers):**
1. Nathnagar Centre
2. Gurdeo Chowk Centre
3. Mouda Main Centre
4. Brahmanwada Centre
5. Nimgaon Centre
6. Bhendala Centre
7. Shivaji Nagar Centre
8. Ram Nagar Centre
9. Mahatma Gandhi Centre
10. Gandhi Chowk Centre

**Nagpur (10 centers):**
1. IT Park Centre
2. Civil Lines Centre
3. Dharampeth Centre
4. Sitabuldi Centre
5. Mahal Centre
6. Bajaj Nagar Centre
7. Hingna Centre
8. Koradi Centre
9. Jamtha Centre
10. Butibori Centre

### Students

- **40 students total**
- **20 students** in Mouda centers (2 per center)
- **20 students** in Nagpur centers (2 per center)
- Student IDs: `STU0001` through `STU0040`
- Each student has:
  - Numeric `id`
  - `student_id` (STU0001 format)
  - `full_name`
  - `center_id` (numeric)
  - `class`
  - `qr_string` (generated)

---

## 🛠️ Troubleshooting

### MSW Not Starting

**Problem:** No `[MSW] Mock API Enabled` message in console

**Solutions:**
1. Check browser console for errors
2. Verify `public/mockServiceWorker.js` exists:
   ```powershell
   Test-Path public/mockServiceWorker.js
   ```
3. If missing, run:
   ```powershell
   npx msw init public/ --save
   ```
4. Clear browser cache and hard refresh (Ctrl+Shift+R)
5. Check that you're in development mode (`npm run dev`)

### Service Worker Not Registering

**Problem:** Service worker fails to register

**Solutions:**
1. Check browser console for service worker errors
2. Unregister old service workers:
   - Chrome: DevTools → Application → Service Workers → Unregister
3. Clear site data and reload
4. Verify `public/mockServiceWorker.js` is accessible at `/mockServiceWorker.js`

### API Requests Not Mocked

**Problem:** Requests go to real backend or fail

**Solutions:**
1. Verify MSW worker started (check console)
2. Check Network tab - requests should show "mock" status
3. Verify API base URL in `src/utils/api.ts` (should use relative paths)
4. Restart dev server

### Handlers Not Matching

**Problem:** 404 errors for API endpoints

**Solutions:**
1. Check handler paths match API calls exactly
2. Verify request method (GET/POST) matches handler
3. Check browser console for MSW warnings
4. Verify handlers are exported correctly in `handlers.js`

---

## 🔄 Switching to Real Backend

When ready to connect to a real backend:

### Option 1: Disable MSW in Code

Edit `src/main.tsx` and change:

```tsx
if (import.meta.env.MODE === 'development') {
```

to:

```tsx
if (false) { // Disable MSW
```

### Option 2: Environment Variable

Create `.env.local`:

```env
VITE_USE_MOCK=false
VITE_API_URL=http://localhost:5000/api
```

Then MSW won't start if you check for this variable in `main.tsx`.

### Option 3: Production Build

MSW only runs in development mode, so production builds automatically use real backend:

```powershell
npm run build
npm run preview
```

---

## 📁 File Structure

```
frontend/
├── src/
│   ├── mocks/
│   │   ├── handlers.js        # MSW request handlers
│   │   ├── browser.js         # Browser worker setup
│   │   ├── server.js          # Node server (for tests)
│   │   └── mockData.js        # Seed data (40 students, 20 centers)
│   └── main.tsx               # App entry (starts MSW)
├── public/
│   └── mockServiceWorker.js   # MSW service worker (auto-generated)
└── package.json               # Scripts and dependencies
```

---

## 🎯 Key Features

✅ **No Backend Required** - Run frontend completely standalone  
✅ **No Database** - All data in memory  
✅ **Realistic Delays** - 200-500ms network latency simulation  
✅ **State Persistence** - New students/attendance persist in memory  
✅ **QR Code System** - Full QR generation and validation  
✅ **PDF Mocking** - Mock PDF downloads for attendance/diary  
✅ **Error Handling** - Proper HTTP status codes (400, 401, 404)  

---

## 🔐 Mock Authentication

- **No password validation** - Any password works
- **JWT-like tokens** - Mock tokens generated automatically
- **City-based filtering** - Centers filtered by volunteer city
- **Token in localStorage** - Stored like real implementation

---

## 📝 Important Notes

1. **Service Worker File** (`public/mockServiceWorker.js`)
   - Generated by `npx msw init public/ --save`
   - Do NOT edit manually
   - Must exist for MSW to work

2. **Development Mode Only**
   - MSW only starts when `import.meta.env.MODE === 'development'`
   - Production builds use real backend

3. **In-Memory Storage**
   - All data is stored in JavaScript arrays
   - Data persists during session
   - Refreshing page resets to seed data

4. **Realistic Behavior**
   - Network delays simulated (200-500ms)
   - Error responses for invalid requests
   - Proper HTTP status codes

---

## ✅ Verification Checklist

After setup, verify:

- [ ] `public/mockServiceWorker.js` exists
- [ ] `npm run dev` starts successfully
- [ ] Browser console shows `[MSW] Mock API Enabled`
- [ ] Network tab shows "mock" status for `/api/*` requests
- [ ] Can login with `25MDA177`
- [ ] Can select a center
- [ ] Can view students list
- [ ] Can create new admission
- [ ] New student appears in attendance list

---

## 🚀 Next Steps

1. **Test the application** using the flows above
2. **Add data-testid attributes** to components for Cypress tests
3. **Run Cypress tests**: `npm run cypress:open`
4. **Customize mock data** in `src/mocks/mockData.js` if needed

---

## 📞 Quick Reference

### Commands

```powershell
# Start with mocks (development mode)
npm run dev

# Initialize MSW service worker
npx msw init public/ --save

# Run Cypress tests
npm run cypress:open
```

### Test Accounts

- `25MDA177` - Mouda volunteer
- `25NGP123` - Nagpur volunteer

### Mock Data

- 40 students (STU0001-STU0040)
- 20 centers (10 Mouda + 10 Nagpur)
- All data regenerated on page refresh

---

**Ready to test! The frontend now runs completely standalone with MSW mocks. 🎉**
