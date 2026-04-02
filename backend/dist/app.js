"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
dotenv_1.default.config();
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
        this.errorHandling();
    }
    config() {
        // Middleware
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, cors_1.default)());
        this.app.use((0, helmet_1.default)());
        this.app.use((0, morgan_1.default)('dev'));
    }
    routes() {
        // Basic health check
        this.app.get('/health', (req, res) => {
            res.status(200).json({ status: 'OK', message: 'Task Management API is running' });
        });
        // API Routes
        this.app.use('/auth', auth_routes_1.default);
        this.app.use('/tasks', task_routes_1.default);
    }
    errorHandling() {
        // 404 handler
        this.app.use((req, res) => {
            res.status(404).json({ message: 'Resource not found' });
        });
        // Global error handler
        this.app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(err.status || 500).json({
                message: err.message || 'Internal Server Error',
                error: process.env.NODE_ENV === 'development' ? err : {},
            });
        });
    }
}
exports.default = new App().app;
