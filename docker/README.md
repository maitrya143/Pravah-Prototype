# Docker Configuration

Docker setup for running all Pravah Prototype services locally.

## Services

- **postgres** - PostgreSQL 15 database
- **backend** - Express.js API server
- **frontend** - React Vite application

## Prerequisites

- Docker Desktop installed
- Docker Compose installed

## Getting Started

### Start All Services

From the `docker` directory:

```bash
docker-compose up
```

Or run in detached mode:

```bash
docker-compose up -d
```

### Stop All Services

```bash
docker-compose down
```

To also remove volumes:

```bash
docker-compose down -v
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

## Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **PostgreSQL**: localhost:5432
  - User: postgres
  - Password: postgres
  - Database: pravah_db

## Development

Volumes are mounted for hot-reload during development. Changes to code will automatically reflect in the containers.

## Production

For production deployment, modify the Dockerfiles and docker-compose.yml to:
- Use production builds
- Remove development dependencies
- Use environment-specific configurations
- Set up proper security measures

