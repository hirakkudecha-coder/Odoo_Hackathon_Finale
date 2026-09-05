const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

// Route imports
const healthRoutes = require('./routes/healthRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Root Route
app.get('/', (req, res) => {
  res.json({
    message: 'Urban Furniture Accounting API',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/api/health',
    heartbeat: '/api/health/heartbeat'
  });
});

// API Routes
app.use('/api/health', healthRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
