import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { initBlockchain } from './services/blockchain.service.js';
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import verificationRoutes from './routes/verification.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

dotenv.config();

const app = express();

// Trust proxy for Codespaces
app.set('trust proxy', 1);

// ── Security Middleware ──
app.use(helmet());
app.use(cors({ 
  origin: process.env.NODE_ENV === 'development' ? '*' : (process.env.CLIENT_URL || '*'),
  credentials: true 
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 min
  max: 100                     // limit per IP
}));

// ── Body Parsing ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ── Routes ──
app.use('/api/auth', (req, res, next) => {
  console.log('Auth route hit:', req.method, req.path);
  next();
}, authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/verify', verificationRoutes);

// ── Health Check ──
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV 
  });
});

// ── Welcome Route ──
app.get('/', (req, res) => {
  res.json({
    message: '🚀 TrustChain v1.0 Backend',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      projects: '/api/projects',
      verification: '/api/verify'
    }
  });
});

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Error Handler ──
app.use(errorHandler);

// ── Start Server ──
const start = async () => {
  try {
    await connectDB();
    initBlockchain();
    
    app.listen(process.env.PORT || 3000, process.env.HOST || '0.0.0.0', () => {
      console.log(`🚀 Server running on ${process.env.HOST || '0.0.0.0'}:${process.env.PORT || 3000}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('❌ Server startup error:', err.message);
    process.exit(1);
  }
};

start();

export default app;
