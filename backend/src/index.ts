import app from './app';
import http from 'http';

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err: Error) => {
  console.log(`Unhandled Rejection! Shutting down...`);
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});
