# TaskFlow API Documentation

This document provides a summary of the available API endpoints for the TaskFlow backend.

## Base URL
`http://localhost:5001`

## Authentication

### Register User
`POST /auth/register`
- **Body**: `{ "email": "user@example.com", "password": "password123", "name": "John Doe" }`
- **Response**: `201 Created` with AuthResponse.

### Login User
`POST /auth/login`
- **Body**: `{ "email": "user@example.com", "password": "password123" }`
- **Response**: `200 OK` with AuthResponse.

### Refresh Token
`POST /auth/refresh`
- **Body**: `{ "refreshToken": "..." }`
- **Response**: `200 OK` with new Access and Refresh tokens.

---

## Tasks

All task endpoints require a valid JWT in the `Authorization` header: `Bearer <access_token>`.

### Get All Tasks
`GET /tasks`
- **Query Params**:
  - `page`: Page number (default: 1)
  - `limit`: Tasks per page (default: 10, max: 100)
  - `search`: Filter by title/description
  - `status`: Filter by status (`PENDING`, `IN_PROGRESS`, `COMPLETED`)
  - `priority`: Filter by priority (`LOW`, `MEDIUM`, `HIGH`)
- **Response**: `200 OK` with paginated task data.

### Get Task By ID
`GET /tasks/:id`
- **Response**: `200 OK` with task details.

### Create Task
`POST /tasks`
- **Body**:
  - `title`: String (Required)
  - `description`: String (Optional)
  - `status`: `PENDING`, `IN_PROGRESS`, `COMPLETED` (Optional, default: `PENDING`)
  - `priority`: `LOW`, `MEDIUM`, `HIGH` (Optional, default: `MEDIUM`)
  - `dueDate`: ISO Date String (Optional)
- **Response**: `201 Created` with new task.

### Update Task
`PATCH /tasks/:id`
- **Body**: Same as Create Task (All fields optional).
- **Response**: `200 OK` with updated task.

### Update Task Status
`PATCH /tasks/:id/status`
- **Body**: `{ "status": "COMPLETED" }`
- **Response**: `200 OK` with updated task.

### Delete Task
`DELETE /tasks/:id`
- **Response**: `204 No Content`.

---

## Models

### User
```typescript
{
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Task
```typescript
{
  id: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
```
