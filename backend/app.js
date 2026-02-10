import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Backend V2 is running' });
});

// API Routes
import authRoutes from './routes/auth.routes.js';
import feedRoutes from './routes/feed.routes.js';
import internshipRoutes from './routes/internship.routes.js';
import hireRoutes from './routes/hire.routes.js';
import eventRoutes from './routes/event.routes.js';
import userRoutes from './routes/user.routes.js';
import trustRoutes from './routes/trust.routes.js';
import commentRoutes from './routes/comment.routes.js';
import likeRoutes from './routes/like.routes.js';
import adminStartupRoutes from './routes/admin.startup.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import startupRoutes from './routes/startup.routes.js';
import chatRoutes from './routes/chatRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/hire', hireRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trust', trustRoutes);
app.use('/api', commentRoutes);
app.use('/api', likeRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/admin', adminStartupRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('--- Backend Error ---');
  console.error('Path:', req.path);
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({
    message: 'An unexpected error occurred on the server',
    details: err.message
  });
});

export default app;
