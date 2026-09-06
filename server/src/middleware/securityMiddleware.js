/**
 * Security Headers and TLS/Reverse Proxy Middleware
 * Urban Furniture ERP - Phase 5 Remediation
 */

/**
 * Applies defense-in-depth HTTP security headers to all responses
 */
const securityHeaders = (req, res, next) => {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking / frame embedding
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // Cross-Site Scripting (XSS) filter for legacy browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer Policy: Send full URL on same-origin, domain-only on cross-origin
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Restrict access to sensitive browser features/APIs
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // Content Security Policy (CSP)
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data: https: blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self'"
  );

  // Cross-Origin Isolation & Resource Sharing Policies
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');

  // HTTP Strict Transport Security (HSTS): 1 year + subdomains + preload
  // Sent on all HTTPS requests or when behind a TLS-terminating reverse proxy
  const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
  if (isSecure || process.env.NODE_ENV === 'production' || process.env.ENABLE_HSTS === 'true') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  next();
};

/**
 * Disables browser and intermediate proxy caching for sensitive endpoints
 */
const noCacheSensitiveEndpoints = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
};

/**
 * Enforces HTTPS redirection when running behind a TLS reverse proxy in production
 */
const enforceHttps = (req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const shouldEnforce = process.env.ENFORCE_HTTPS === 'true' || (isProduction && process.env.DISABLE_HTTPS_REDIRECT !== 'true');

  if (shouldEnforce) {
    const proto = req.headers['x-forwarded-proto'];
    const isHttps = req.secure || proto === 'https';

    if (!isHttps && proto === 'http') {
      const host = req.headers['x-forwarded-host'] || req.headers.host || req.hostname;
      return res.redirect(301, `https://${host}${req.url}`);
    }
  }

  next();
};

module.exports = {
  securityHeaders,
  noCacheSensitiveEndpoints,
  enforceHttps
};
