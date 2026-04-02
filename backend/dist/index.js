"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const http_1 = __importDefault(require("http"));
const PORT = process.env.PORT || 5001;
const server = http_1.default.createServer(app_1.default);
server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
});
// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    console.log(`Unhandled Rejection! Shutting down...`);
    console.error(err);
    server.close(() => {
        process.exit(1);
    });
});
