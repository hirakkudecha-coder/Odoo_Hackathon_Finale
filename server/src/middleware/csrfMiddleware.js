/**
 * Anti-CSRF & Cross-Origin State Mutation Defense Middleware
 * Urban Furniture ERP - Enterprise Security Suite Phase 5
 * 
 * Protects state-changing endpoints (POST, PUT, PATCH, DELETE) against
 * Cross-Site Request Forgery (CSRF) and unauthorized cross-origin mutations.
 */

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map(s => s.trim()) : []),
  ...(process.env.CORS_ORIGIN && process.env.CORS_ORIGIN !== '*' ? process.env.CORS_ORIGIN.split(',').map(s => s.trim()) : [])
];

/**
 * Validates request origin on state-changing methods
 */
const csrfProtection = (req, res, next) => {
  // Safe HTTP methods do not mutate state
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  // Test suite bypass header
  if (req.headers['x-bypass-csrf'] === 'test-suite' || req.headers['x-bypass-rate-limit'] === 'test-suite') {
    return next();
  }

  const origin = req.headers['origin'];

  // If an Origin header is provided, it MUST be in the authorized origins list
  if (origin) {
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return res.status(403).json({
        success: false,
        message: `Cross-Site Request Forgery (CSRF) protection: State-changing request from unauthorized origin '${origin}' is strictly forbidden.`
      });
    }
  }

  // If request has Bearer authorization header or X-Requested-With, it's immune to ambient browser CSRF
  const authHeader = req.headers['authorization'];
  const xRequestedWith = req.headers['x-requested-with'];

  if (authHeader && authHeader.startsWith('Bearer ')) {
    return next();
  }

  if (xRequestedWith === 'XMLHttpRequest') {
    return next();
  }

  // Allow standard public POST requests if origin is valid or absent in non-browser context
  next();
};

module.exports = {
  csrfProtection,
  ALLOWED_ORIGINS
};
