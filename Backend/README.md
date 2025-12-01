# Pravah Backend

Backend API server for Pravah Prototype.

## Phase 1 Status

This is a basic Express.js server structure with placeholder routes. No database connections or business logic has been implemented yet.

## Getting Started

### Installation

```bash
npm install
```

### Running the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000` by default.

## API Endpoints (Phase 2)

All API endpoints are placeholders. They will be implemented in Phase 2:
- `/api/auth` - Authentication routes
- `/api/centers` - Center management
- `/api/attendance` - Attendance tracking
- `/api/students` - Student management
- `/api/diary` - Diary entries
- `/api/syllabus` - Syllabus management
- `/api/performance` - Performance metrics

## Health Check

```bash
curl http://localhost:5000/health
```

Returns: `{ "status": "ok", "message": "Pravah Backend API is running" }`

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- Database credentials (Phase 2)
- JWT configuration (Phase 2)

