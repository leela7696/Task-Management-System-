import app from './app';
import http from 'http';
import cluster from 'cluster';
import os from 'os';

const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';

if (cluster.isPrimary && NODE_ENV === 'production') {
  const numCPUs = os.cpus().length;
  console.log(`🚀 Primary ${process.pid} is running. Forking for ${numCPUs} CPUs...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`⚠️ Worker ${worker.process.pid} died. Forking a new one...`);
    cluster.fork();
  });
} else {
  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`🚀 Worker ${process.pid} is running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
  });

  // Handle unhandled rejections
  process.on('unhandledRejection', (err: Error) => {
    console.log(`❌ Unhandled Rejection! Worker ${process.pid} shutting down...`);
    console.error(err);
    server.close(() => {
      process.exit(1);
    });
  });

  // Handle SIGTERM
  process.on('SIGTERM', () => {
    console.info('📥 SIGTERM signal received. Closing HTTP server...');
    server.close(() => {
      console.log('🛑 HTTP server closed.');
      process.exit(0);
    });
  });
}
