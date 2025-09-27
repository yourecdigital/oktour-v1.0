import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import { env } from './env';
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { setupSwagger } from './utils/swagger';
import { initSentry, Sentry } from './lib/sentry';
import { redisClient } from './utils/redis';

// Import routes
import authRoutes from './routes/auth';
import tourRoutes from './routes/tours';
import userRoutes from './routes/users';
import mediaRoutes from './routes/media';
import heroRoutes from './routes/hero';
import healthRoutes from './routes/health';

// Initialize Sentry before creating the app
initSentry();

const app = express();
const prisma = new PrismaClient();

// Sentry request handler must be the first middleware
app.use(Sentry.requestHandler());

// Sentry tracing handler
app.use(Sentry.tracingHandler());

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(env.UPLOAD_DIR));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/users', userRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/health', healthRoutes);

// Swagger documentation
setupSwagger(app);

// Sentry error handler must be before other error handlers
app.use(Sentry.errorHandler());

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🔄 Gracefully shutting down...');
  await prisma.$disconnect();
  await redisClient.quit();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🔄 Gracefully shutting down...');
  await prisma.$disconnect();
  await redisClient.quit();
  process.exit(0);
});

// Start server
const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
});

export { app, prisma };