const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Backend V2 is running' });
});

// API Routes
const authRoutes = require('./routes/auth.routes.js');
const feedRoutes = require('./routes/feed.routes.js');
const internshipRoutes = require('./routes/internship.routes.js');
const hireRoutes = require('./routes/hire.routes.js');
const eventRoutes = require('./routes/event.routes.js');
const userRoutes = require('./routes/user.routes.js');
const trustRoutes = require('./routes/trust.routes.js');
const commentRoutes = require('./routes/comment.routes.js');
const likeRoutes = require('./routes/like.routes.js');
const adminStartupRoutes = require('./routes/admin.startup.routes.js');

app.use('/api/auth', authRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/hire', hireRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trust', trustRoutes);
app.use('/api', commentRoutes);
app.use('/api', likeRoutes);
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/startups', require('./routes/startup.routes'));
app.use('/api/admin', adminStartupRoutes);
app.use('/api/chat', require('./routes/chatRoutes'));

module.exports = app;
