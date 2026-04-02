import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';

dotenv.config();

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.errorHandling();
  }

  private config(): void {
    // Middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // Enable GZIP compression for faster responses
    this.app.use(compression());

    // Rate limiting to prevent abuse
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again after 15 minutes',
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/auth', limiter); // Apply more strictly to auth routes

    // Configure CORS
    this.app.use(cors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    // Configure Helmet with relaxed cross-origin policy for development
    this.app.use(helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }
    }));
    
    this.app.use(morgan('dev'));
  }

  private routes(): void {
    // Basic health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({ status: 'OK', message: 'Task Management API is running' });
    });

    // API Routes
    this.app.use('/auth', authRoutes);
    this.app.use('/tasks', taskRoutes);
  }

  private errorHandling(): void {
    // 404 handler
export class AppError extends Error {
  public readonly status: number;
  public readonly isOperational: boolean;

  constructor(message: string, status: number = 500, isOperational: boolean = true) {
    super(message);
    this.status = status;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request') {
    super(message, 400);
  }
}# Use Node.js LTS version
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build Next.js application
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]    this.app.use((req: Request, res: Response) => {
      res.status(404).json({ 
        status: 'error',
        message: 'Resource not found' 
      });
    });

    // Global error handler
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      const status = err.status || 500;
      const isOperational = err.isOperational || false;

      // In production, don't leak stack traces
      if (process.env.NODE_ENV === 'production') {
        if (!isOperational) {
          console.error('CRITICAL ERROR:', err);
          return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
          });
        }
      } else {
        console.error(err.stack);
      }

      res.status(status).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      });
    });
  }
}

export default new App().app;
