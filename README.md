# Pravah Prototype - UPAY NGO

## Project Overview

Pravah Prototype is a comprehensive volunteer management system for UPAY NGO, designed to streamline center operations, attendance tracking, admissions, and performance monitoring.

## Phase 3 Status: Final Refinement

**Backend:** ✅ 100% Complete - All APIs, database schema, authentication, QR system, PDF generation implemented.

**Frontend:** 🔄 70% Complete - Core infrastructure, authentication, Dashboard, and UI components done. Remaining pages need completion.

**Documentation:** ✅ 90% Complete - Comprehensive setup guide and API documentation available.

### Quick Links
- 📚 [Complete Setup Guide](SETUP_GUIDE.md) - Step-by-step installation and testing
- 📖 [Phase 2 API Documentation](docs/PHASE2_README.md) - Complete API reference
- 📊 [Phase 3 Status](PHASE3_STATUS.md) - Current implementation status
- 🏗️ [Architecture Documentation](docs/architecture.md) - System architecture overview

---

## Project Structure

```
Pravah Prototype/
├── frontend/              # React (Vite) + TailwindCSS + React Router
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── layouts/       # Layout components (SidebarLayout, DashboardLayout)
│   │   ├── pages/         # All page components
│   │   ├── styles/        # Global styles, Tailwind config
│   │   ├── utils/         # Frontend utilities
│   │   └── App.tsx        # Main app with routing
│   └── package.json
│
├── backend/               # Node.js + Express
│   ├── src/
│   │   ├── routes/        # API routes (empty for Phase 1)
│   │   ├── middleware/    # Express middleware
│   │   ├── config/        # Configuration files
│   │   └── server.js      # Express server entry point
│   └── package.json
│
├── database/              # PostgreSQL database files
│   ├── migrations/        # Database migration files (empty for Phase 1)
│   └── seeds/             # Database seed files (empty for Phase 1)
│
├── docker/                # Docker configuration
│   ├── docker-compose.yml # Orchestrates all services
│   ├── Dockerfile.frontend
│   └── Dockerfile.backend
│
├── shared/                # Shared utilities and interfaces
│   └── types/             # TypeScript interfaces/types (if using TS)
│
└── docs/                  # Documentation
    └── architecture.md    # Architecture diagrams and explanations
```

---

## Technology Stack

- **Frontend**: React 18+ (Vite), TailwindCSS, React Router
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose
- **Package Manager**: npm/yarn

---

## Getting Started (Placeholder Instructions)

### Prerequisites

- Node.js (v18 or higher)
- Docker Desktop
- PostgreSQL client (optional, for direct DB access)

### Running the Application

#### Option 1: Docker Compose (Recommended)

```bash
# Navigate to docker directory
cd docker

# Start all services (frontend, backend, database)
docker-compose up

# The frontend will be available at http://localhost:3000
# The backend will be available at http://localhost:5000
```

#### Option 2: Manual Development Setup

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173 (Vite default)
```

**Backend:**
```bash
cd backend
npm install
npm run dev
# Backend runs on http://localhost:5000
```

**Database:**
```bash
# Ensure PostgreSQL is running locally
# Connection details will be in backend/src/config/database.js
```

---

## Design System

### Color Palette (NGO Warm Tone)

- **Primary**: Warm Blue (#2563EB) - Trust, Community
- **Secondary**: Warm Coral (#F97316) - Energy, Hope
- **Accent**: Forest Green (#059669) - Growth, Progress
- **Background**: Warm Gray (#F9FAFB)
- **Text**: Charcoal (#1F2937)

### Typography Scale

- **Heading 1**: 2.5rem (40px)
- **Heading 2**: 2rem (32px)
- **Heading 3**: 1.5rem (24px)
- **Body**: 1rem (16px)
- **Small**: 0.875rem (14px)

### Spacing System

8px base unit for consistent spacing throughout the application.

---

## Pages Structure

All pages are currently empty placeholders without business logic:

1. **Login** - Volunteer authentication
2. **Signup** - New volunteer registration
3. **CenterSelection** - Select active center
4. **Dashboard** - Overview and statistics
5. **ManualAttendance** - Manual attendance entry
6. **QRScan** - QR code scanning interface
7. **NewAdmission** - New student admission form
8. **Diary** - Daily diary entries
9. **Syllabus** - Syllabus management
10. **CenterPerformance** - Center performance metrics
11. **History** - Historical records and logs
12. **Settings** - User and application settings

---

## Navigation Layout

### Sidebar (Left)
- Collapsible navigation menu
- Module icons and labels
- Active state indicators

### Topbar
- Pravah Logo + "Flow of Change" tagline
- Volunteer Name (placeholder)
- Volunteer ID (placeholder)
- Center Name (placeholder)
- Settings icon
- Logout icon

---

## Phase 2 Status

### ✅ Completed (Backend - 100%)
- ✅ Complete database schema with 8 tables
- ✅ Migration system & seed data (40-50 students)
- ✅ Authentication system (JWT, city detection)
- ✅ All API endpoints implemented
- ✅ QR code generation with HMAC-SHA256
- ✅ QR scanning & validation
- ✅ Attendance tracking (manual & QR)
- ✅ Student admission with form upload
- ✅ Diary entries with volunteer attendance
- ✅ Syllabus upload/download
- ✅ Performance analytics
- ✅ History filtering
- ✅ PDF generation (attendance, diary, admission)

### ✅ Completed (Frontend - Partial)
- ✅ Authentication pages (Login, Signup)
- ✅ Center Selection
- ✅ Context providers & protected routes
- ✅ API client utilities
- ⏳ Remaining pages need full implementation

### 📚 Documentation
See [docs/PHASE2_README.md](docs/PHASE2_README.md) for:
- Complete API documentation
- Database setup & migrations
- Environment variables
- QR code system details
- Setup instructions

## What's Next?

### Remaining Frontend Work
- Complete Dashboard page with stats
- New Admission multi-step form
- QR Scan with camera integration
- Manual Attendance with bulk operations
- Diary form with volunteer selection
- Syllabus upload/list UI
- Center Performance charts
- History filtering UI
- Settings page

### Phase 3 (Future)
- Advanced analytics
- Reporting features
- Notifications
- Mobile app integration

---

## Quick Start

For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

### Quick Setup (Docker)

```bash
cd docker
docker-compose up
```

### Quick Setup (Manual)

```bash
# Backend
cd backend
cp .env.example .env  # Edit with your values
npm install
npm run migrate
npm run seed
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### Test Login
- **Volunteer ID**: `25MDA177`
- **Password**: `password123`

Access: Frontend http://localhost:3000 | Backend http://localhost:5000/api

## Development Notes

**Backend:** Fully functional with all APIs implemented.
**Frontend:** Authentication working. Remaining pages need API integration.

---

## License

Internal use - UPAY NGO

