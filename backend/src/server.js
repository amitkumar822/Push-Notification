import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import notificationRoutes from './routes/notificationRoutes.js';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import { generalLimiter, notificationLimiter, tokenRegistrationLimiter } from './middleware/rateLimiter.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Security middleware
app.use(helmet());

// CORS configuration - Flexible for development and production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow all origins
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // In production, check against allowed origins
    const allowedOrigins = process.env.CORS_ORIGIN ? 
      process.env.CORS_ORIGIN.split(',') : 
      ['http://localhost:19006'];
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(generalLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API documentation endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Expo Push Notification Server',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      // Authentication
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      profile: 'GET /api/auth/profile',
      verify: 'GET /api/auth/verify',
      logout: 'POST /api/auth/logout',
      // Notifications
      tokenRegistration: 'POST /api/notifications/token',
      sendToUser: 'POST /api/notifications/send',
      sendToMultiple: 'POST /api/notifications/send-multiple',
      sendToAll: 'POST /api/notifications/send-all',
      sendByDevice: 'POST /api/notifications/send-by-device',
      getUserTokens: 'GET /api/notifications/tokens/:userId',
      deleteToken: 'DELETE /api/notifications/token/:tokenId',
      updatePreferences: 'PUT /api/notifications/token/:tokenId/preferences',
      stats: 'GET /api/notifications/stats',
      cleanup: 'POST /api/notifications/cleanup'
    },
    documentation: {
      testing: 'https://expo.dev/notifications',
      expoDocs: 'https://docs.expo.dev/versions/latest/sdk/notifications/',
      firebaseConsole: 'https://console.firebase.google.com/'
    }
  });
});

// Apply rate limiting to notification routes
app.use('/api/notifications', (req, res, next) => {
  if (req.path === '/token' && req.method === 'POST') {
    return tokenRegistrationLimiter(req, res, next);
  }
  if (['/send', '/send-multiple', '/send-all', '/send-by-device'].includes(req.path) && req.method === 'POST') {
    return notificationLimiter(req, res, next);
  }
  next();
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/profile',
      'GET /api/auth/verify',
      'POST /api/auth/logout',
      'POST /api/notifications/token',
      'POST /api/notifications/send',
      'POST /api/notifications/send-multiple',
      'POST /api/notifications/send-all',
      'POST /api/notifications/send-by-device',
      'GET /api/notifications/tokens/:userId',
      'DELETE /api/notifications/token/:tokenId',
      'PUT /api/notifications/token/:tokenId/preferences',
      'GET /api/notifications/stats',
      'POST /api/notifications/cleanup'
    ]
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Expo Push Notification Server Started!');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/health`);
  console.log(`📚 API Docs: http://localhost:${PORT}/`);
  console.log('📱 Ready to handle push notifications!');
});

export default app;
