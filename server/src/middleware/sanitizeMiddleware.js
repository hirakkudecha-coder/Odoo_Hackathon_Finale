/**
 * NoSQL Injection & Prototype Pollution Sanitization Middleware
 * Urban Furniture ERP - Enterprise Security Suite
 * 
 * Recursively inspects and sanitizes request bodies, query strings, and route parameters
 * to strip:
 * 1. MongoDB operators (keys starting with '$')
 * 2. Path/field traversal keys (containing '.')
 * 3. Prototype pollution vectors ('__proto__', 'constructor', 'prototype')
 */

const hasProhibitedKey = (key) => {
  return (
    key.startsWith('$') ||
    key.includes('.') ||
    key === '__proto__' ||
    key === 'constructor' ||
    key === 'prototype'
  );
};

const sanitizeValue = (data, depth = 0) => {
  // Prevent stack overflow recursion attacks
  if (depth > 20) {
    return data;
  }

  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      data[i] = sanitizeValue(data[i], depth + 1);
    }
    return data;
  }

  const keys = Object.keys(data);
  for (const key of keys) {
    if (hasProhibitedKey(key)) {
      // Strip dangerous MongoDB operator, prototype pollution, or path traversal key
      delete data[key];
    } else {
      data[key] = sanitizeValue(data[key], depth + 1);
    }
  }

  return data;
};

/**
 * Express middleware to sanitize req.body, req.query, and req.params
 */
const noSqlSanitizer = (req, res, next) => {
  if (req.body) {
    sanitizeValue(req.body);
  }
  if (req.query) {
    sanitizeValue(req.query);
  }
  if (req.params) {
    sanitizeValue(req.params);
  }
  next();
};

module.exports = {
  noSqlSanitizer,
  sanitizeValue
};
