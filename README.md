# TaskFlow - Production-Grade Task Management System

A full-stack Task Management System built with a clean, layered architecture, modern UI/UX, and robust authentication.

## 🚀 Tech Stack

### Backend
- **Node.js & Express**: Fast, unopinionated, minimalist web framework.
- **TypeScript**: For static typing and better developer experience.
- **PostgreSQL**: Reliable relational database.
- **Prisma ORM**: Modern database toolkit for type-safe database access.
- **JWT (JSON Web Tokens)**: Secure authentication with Access & Refresh tokens.
- **bcryptjs**: Password hashing for security.
- **express-validator**: Request validation middleware.

### Frontend
- **Next.js 15 (App Router)**: React framework for production.
- **TypeScript**: Type safety across the frontend.
- **Zustand**: Lightweight and scalable state management.
- **Tailwind CSS**: Utility-first CSS framework for modern design.
- **Axios**: Promise-based HTTP client with interceptors.
- **Lucide React**: Beautifully simple pixel-perfect icons.
- **React Hot Toast**: Beautiful notifications.

## 🏗️ Architecture

The backend follows a **Layered Architecture** to ensure separation of concerns and maintainability:
- **Controllers**: Handle HTTP requests and responses.
- **Services**: Contain business logic and orchestrate data flow.
- **Repositories**: Direct interaction with the database via Prisma.
- **Middleware**: Authentication, validation, and error handling.
- **Utils**: Reusable utility functions (JWT, Password hashing).

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database

### Quick Start (Both Backend & Frontend)
1. Install dependencies for both:
   ```bash
   ## 👨‍💻 Developed By

**Leela Krishna Sundu**
- 📱 **Mobile**: +91 6309515519
- 📧 **Gmail**: leela7696@gmail.com
- 💻 **Project**: TaskFlow - Production-Grade Task Management System
   ```
2. Start both in development mode:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Update `DATABASE_URL` in `.env` with your PostgreSQL connection string.
5. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file:
   ```bash
   echo "NEXT_PUBLIC_API_URL=http://localhost:5001" > .env.local
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📖 API Documentation

### Authentication
- `POST /auth/register`: Register a new user.
- `POST /auth/login`: Login and receive tokens.
- `POST /auth/refresh`: Refresh access token using refresh token.
- `POST /auth/logout`: Logout and invalidate refresh token.

### Tasks
- `GET /tasks`: Fetch all tasks for the authenticated user (supports pagination, search, and filtering).
- `POST /tasks`: Create a new task.
- `GET /tasks/:id`: Get a specific task.
- `PATCH /tasks/:id`: Update a task.
- `DELETE /tasks/:id`: Delete a task.
- `PATCH /tasks/:id/toggle`: Toggle task completion status.

## ✨ Features
- **Clean & Modern UI**: SaaS-style dashboard with smooth interactions.
- **Secure Auth**: JWT-based authentication with refresh token rotation.
- **Task Management**: Full CRUD with search, pagination, and status filtering.
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop.
- **Layered Architecture**: Decoupled code for better testability and scalability.
