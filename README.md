# TaskFlow - Production-Grade Task Management System

A full-stack Task Management System built with a clean, layered architecture, modern UI/UX, and robust authentication.

## 🚀 Quick Start (Local Setup)

Follow these simple steps to get the application running on your machine:

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### 2. Installation
Install all dependencies for the root, backend, and frontend with one command:
```bash
npm run install:all
```

### 3. Environment Configuration
Set up the environment files for both backend and frontend:
```bash
# Setup Backend .env
cp backend/.env.example backend/.env

# Setup Frontend .env
echo "NEXT_PUBLIC_API_URL=http://localhost:5001" > frontend/.env.local
```
*(Note: The backend is pre-configured to use **SQLite**, so no external database installation is required for local development.)*

### 4. Database Initialization
Generate the Prisma client and initialize your local database:
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
cd ..
```

### 5. Running the Application
Start both the frontend and backend concurrently:
```bash
npm run dev
```
- **Frontend UI**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5001](http://localhost:5001)

---

## 🚀 Tech Stack

### Backend
- **Node.js & Express**: Fast, unopinionated, minimalist web framework.
- **TypeScript**: For static typing and better developer experience.
- **SQLite**: Local relational database (configured for easy setup).
- **Prisma ORM**: Modern database toolkit for type-safe database access.
- **JWT (JSON Web Tokens)**: Secure authentication with Access & Refresh tokens.
- **bcryptjs**: Password hashing for security.
- **express-validator**: Request validation middleware.

### Frontend
- **Next.js 15 (App Router)**: React framework for production.
- **TypeScript**: Type safety across the frontend.
- **Zustand**: Lightweight and scalable state management.
- **Tailwind CSS**: Utility-first CSS framework for modern design.
- **Axios**: Promise-based HTTP client with interceptors for token management.
- **Lucide React**: Beautifully simple pixel-perfect icons.
- **React Hot Toast**: Beautiful notifications.

---

## 🏗️ Architecture

The project follows a **Layered Architecture** to ensure separation of concerns and maintainability:
- **Controllers**: Handle HTTP requests and responses.
- **Services**: Contain business logic and orchestrate data flow.
- **Repositories**: Direct interaction with the database via Prisma.
- **Middleware**: Authentication, validation, and error handling.
- **Utils**: Reusable utility functions (JWT, Password hashing, custom error classes).

## 🛠️ Features

- **Authentication**: JWT-based login and registration with refresh token support.
- **Task Management**: Full CRUD operations with title, description, status, priority, and due dates.
- **Advanced Filtering**: Filter tasks by status (`PENDING`, `IN_PROGRESS`, `COMPLETED`) and priority (`LOW`, `MEDIUM`, `HIGH`).
- **Search**: Search tasks by title or description.
- **Responsive UI**: Mobile-first design using Tailwind CSS.
- **Error Handling**: Global error handling with appropriate HTTP status codes.


## 📖 API Documentation
Detailed API documentation can be found in [API.md](./API.md).

## 📱 Mobile Development Roadmap
To convert this project into a **React Native** application, you can reuse the Zustand stores and Axios logic. Detailed conversion steps are available in the project documentation.

## 🚀 Deployment

### Backend (Render / Heroku)
1. Set build command: `npm install && npm run build --prefix backend`.
2. Set start command: `npm start --prefix backend`.
3. Configure Environment Variables: `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `FRONTEND_URL`.

### Frontend (Vercel)
1. Connect your GitHub repository.
2. Set root directory to `frontend`.
3. Add Environment Variable: `NEXT_PUBLIC_API_URL`.

## 👨‍💻 Developed By
**Leela Krishna Sundu**
- 📱 **Mobile**: +91 6309515519
- 📧 **Gmail**: leela7696@gmail.com
- 💻 **Project**: TaskFlow - Production-Grade Task Management System
