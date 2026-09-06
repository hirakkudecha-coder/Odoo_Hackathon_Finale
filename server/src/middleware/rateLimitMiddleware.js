/**
 * Rate Limiting Middleware
 * Urban Furniture ERP - Enterprise Security Suite
 */
const { rateLimit } = require('express-rate-limit');

// Helper to determine if request should skip rate limiting
const shouldSkip = (req) => {
  // Allow test suites to bypass when explicitly flagged
  if (process.env.DISABLE_RATE_LIMIT === 'true') return true;
  if (req.headers['x-bypass-rate-limit'] === 'test-suite') return true;
  return false;
};

/**
 * Global API rate limiter: protects all /api endpoints from volumetric floods
 * Limit: 500 requests per 15 minutes per IP
 */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  skip: shouldSkip,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP address. Please try again after 15 minutes.',
      retryAfter: Math.ceil(req.rateLimit.resetTime ? (req.rateLimit.resetTime.getTime() - Date.now()) / 1000 : 900)
    });
  }
});

/**
 * Strict Auth rate limiter: prevents brute-force login and registration spam
 * Limit: 10 attempts per 15 minutes per IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: shouldSkip,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts from this IP address. Please try again after 15 minutes.',
      retryAfter: Math.ceil(req.rateLimit.resetTime ? (req.rateLimit.resetTime.getTime() - Date.now()) / 1000 : 900)
    });
  }
});

/**
 * Public Form rate limiter: prevents bot spam on concierge, tours, tickets, and partner applications
 * Limit: 20 submissions per hour per IP
 */
const publicFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: shouldSkip,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Form submission limit reached from this IP address. Please try again in an hour.',
      retryAfter: Math.ceil(req.rateLimit.resetTime ? (req.rateLimit.resetTime.getTime() - Date.now()) / 1000 : 3600)
    });
  }
});

module.exports = {
  globalLimiter,
  authLimiter,
  publicFormLimiter
};
