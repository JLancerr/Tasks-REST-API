# Tasks API

A RESTful task management API built with NestJS, Prisma, PostgreSQL, and Docker. It provides authenticated user and task management endpoints, plus Swagger-based API documentation.

## Features

- User registration and authentication
- JWT-protected task routes
- CRUD operations for tasks
- Task filtering for completed and pending items
- Swagger documentation at `/api`
- Database migrations managed with Prisma

## Tech Stack

- NestJS - backend framework for building the REST API
- TypeScript - application language
- Prisma ORM - database access and schema management
- PostgreSQL - relational database
- Docker Compose - local database and API container setup
- Swagger - interactive API documentation
- JWT - authentication for protected routes

## Project Structure

- `src/` - application source code
- `src/users/` - user registration, authentication, and profile management
- `src/tasks/` - task CRUD and filtering logic
- `prisma/` - Prisma schema and migrations
- `docker-compose.yml` - PostgreSQL and API container configuration

## Prerequisites

Before running the project, make sure you have:

- Node.js 20+ and npm
- Docker Desktop

## Setup

1. Install dependencies

```bash
cd server
npm install
```

2. Start the database and API with Docker Compose

```bash
docker compose up --build
```

This will start:

- PostgreSQL on port `5432`
- The NestJS API on port `3000`

3. Run Prisma migrations

```bash
npx prisma migrate dev
```

4. Generate the Prisma client

```bash
npx prisma generate
```

5. Start the development server locally

```bash
npm run start:dev
```

## Environment Variables

The Docker setup already provides the required values. If you run the app outside Docker, create a `.env` file in the `server` directory with values similar to:

```env
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/taskmanager_db?schema=public"
JWT_SECRET="your_super_secret_jwt_key_here"
```

## API Documentation

Once the server is running, open:

- Swagger UI: http://localhost:3000/api

## Main API Endpoints

### Users

- `POST /users/create` - register a new user
- `POST /users/authenticate` - log in and receive a JWT
- `PATCH /users/profile` - update the authenticated user's profile
- `DELETE /users/profile` - delete the authenticated user's profile

### Tasks

- `GET /tasks` - get all tasks for the authenticated user
- `GET /tasks/all-done` - get completed tasks
- `GET /tasks/all-not-done` - get pending tasks
- `POST /tasks` - create a task
- `PATCH /tasks/:id` - update a task
- `PATCH /tasks/:id/toggle-done` - toggle task completion
- `DELETE /tasks/:id` - delete a task

## Integration / End-to-End (E2E) Tests

## 🧪 Automated Testing

All tests should be executed through the running Docker containers to ensure clean access to your isolated test database network.

To run the full user registration, login, and task CRUD lifecycle flow tests:
```bash
docker compose exec api-server npm run test:e2e

## Useful Prisma Commands

```bash
npx prisma studio
npx prisma migrate dev
npx prisma generate
```

## Notes

- Protected routes require a valid JWT in the `Authorization` header.
- The API uses PostgreSQL and Prisma migrations for schema changes.
- Docker is the easiest way to run the database and API together for local development.
