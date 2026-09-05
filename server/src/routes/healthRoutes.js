const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Standard Health Check
router.get('/', (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      status: 'UP',
      message: 'Urban Furniture Accounting API is running smoothly',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    next(err);
  }
});

// Admin Dashboard Live Heartbeat
router.get('/heartbeat', async (req, res, next) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStatusMap = {
      0: 'Disconnected',
      1: 'Connected',
      2: 'Connecting',
      3: 'Disconnecting'
    };

    const mem = process.memoryUsage();
    const uptimeSeconds = process.uptime();

    res.status(200).json({
      success: true,
      heartbeat: {
        status: 'ALIVE',
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.floor(uptimeSeconds),
        uptimeFormatted: `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m ${Math.floor(uptimeSeconds % 60)}s`,
        database: {
          status: dbStatusMap[dbState] || 'Unknown',
          connected: dbState === 1,
          host: mongoose.connection.host || '127.0.0.1',
          name: mongoose.connection.name || 'urban_furniture_db'
        },
        memoryUsageMB: {
          rss: (mem.rss / 1024 / 1024).toFixed(2),
          heapTotal: (mem.heapTotal / 1024 / 1024).toFixed(2),
          heapUsed: (mem.heapUsed / 1024 / 1024).toFixed(2)
        },
        system: {
          nodeVersion: process.version,
          platform: process.platform,
          pid: process.pid
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
