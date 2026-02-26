require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');

const app = express();

/**
 * Connect to MongoDB
 */
connectDB();

/**
 * Middleware
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
const allowedOrigins = [
  'http://localhost:5173',
  'https://urjob-frontend.onrender.com',
  'https://urjob.aloktech.in'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

/**
 * Rate limiting to prevent abuse
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

/**
 * Health check route
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

/**
 * Error handling middleware (must be last)
 */
app.use(errorHandler);

/**
 * Start server
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 UrJob Server running on http://localhost:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
