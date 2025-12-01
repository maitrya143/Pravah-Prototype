# Pravah Prototype - Architecture Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │  │ Layouts  │  │Components│  │  Router  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Express.js)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Routes  │  │Middleware│  │  Config  │  │  Server  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ SQL Queries
                            │
┌─────────────────────────────────────────────────────────────┐
│                   Database (PostgreSQL)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Tables  │  │ Migrations│ │  Seeds   │  │  Indexes │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **React 18+** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **TypeScript** - Type safety

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **pg** - PostgreSQL client for Node.js

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## Project Structure

```
Pravah Prototype/
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── layouts/    # Layout components
│   │   ├── pages/      # Page components
│   │   ├── styles/     # Global styles
│   │   └── utils/      # Utility functions
│   └── package.json
│
├── backend/            # Express API server
│   ├── src/
│   │   ├── routes/     # API route handlers
│   │   ├── middleware/ # Express middleware
│   │   ├── config/     # Configuration files
│   │   └── server.js   # Server entry point
│   └── package.json
│
├── database/           # Database files
│   ├── migrations/     # Database migrations
│   └── seeds/          # Database seeds
│
├── docker/             # Docker configuration
│   ├── docker-compose.yml
│   ├── Dockerfile.frontend
│   └── Dockerfile.backend
│
├── shared/             # Shared code
│   └── types/          # TypeScript types
│
└── docs/               # Documentation
```

## Design System

### Color Palette
- **Primary**: Warm Blue (#2563EB) - Trust, Community
- **Secondary**: Warm Coral (#F97316) - Energy, Hope
- **Accent**: Forest Green (#059669) - Growth, Progress
- **Neutral**: Warm Grays - Backgrounds and text

### Typography
- **Font Family**: Inter (sans-serif)
- **Scale**: 8px base unit system
- **Headings**: 2.5rem, 2rem, 1.5rem
- **Body**: 1rem
- **Small**: 0.875rem

### Spacing
- Base unit: 8px
- Consistent spacing scale throughout the application

## Page Structure

1. **Login** - Authentication entry point
2. **Signup** - New volunteer registration
3. **Center Selection** - Choose active center
4. **Dashboard** - Overview and statistics
5. **Manual Attendance** - Manual attendance entry
6. **QR Scan** - QR code scanning interface
7. **New Admission** - Student admission form
8. **Diary** - Daily diary entries
9. **Syllabus** - Syllabus management
10. **Center Performance** - Performance metrics
11. **History** - Historical records
12. **Settings** - User and app settings

## Navigation Flow

```
Login → Signup (optional)
  ↓
Center Selection
  ↓
Dashboard (main hub)
  ├── Manual Attendance
  ├── QR Scan
  ├── New Admission
  ├── Diary
  ├── Syllabus
  ├── Center Performance
  ├── History
  └── Settings
```

## Phase 1 Deliverables

✅ Complete project structure
✅ Frontend React application setup
✅ Backend Express server setup
✅ Docker configuration
✅ Design system implementation
✅ All placeholder pages
✅ Navigation layout
✅ Routing setup

## Phase 2 Plan

- Database schema design
- API endpoints implementation
- Authentication & authorization
- CRUD operations
- API integration

## Phase 3 Plan

- QR code generation/scanning
- Attendance tracking logic
- Admission workflow
- Performance analytics
- Complete business logic

