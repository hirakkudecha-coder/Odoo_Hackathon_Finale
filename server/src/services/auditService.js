/**
 * Audit Logging Service
 * Urban Furniture ERP - Enterprise Security Suite
 */
const AuditLog = require('../models/AuditLog');
const { maskSensitiveData } = require('../utils/maskSensitiveData');

/**
 * Records an immutable audit log entry asynchronously without blocking request pipeline
 */
const logEvent = async ({
  req = null,
  action,
  module = 'System',
  description,
  severity = 'info',
  resource = null,
  resourceId = null,
  details = {},
  actor = null
}) => {
  try {
    let actorId = null;
    let actorEmail = 'system@internal';
    let actorRole = 'system';
    let ipAddress = '127.0.0.1';
    let userAgent = 'Internal/API';

    // Extract caller metadata from Express req
    if (req) {
      if (req.user) {
        actorId = req.user._id || null;
        actorEmail = req.user.email || 'authenticated_user';
        actorRole = req.user.role || 'user';
      }
      ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || '127.0.0.1';
      userAgent = req.headers['user-agent'] || 'Unknown';
    }

    // Explicit actor override (e.g. during login when req.user is not yet populated)
    if (actor) {
      if (actor.id || actor._id) actorId = actor.id || actor._id;
      if (actor.email) actorEmail = actor.email;
      if (actor.role) actorRole = actor.role;
    }

    const sanitizedDetails = details ? maskSensitiveData(details) : {};

    await AuditLog.create({
      actorId,
      actorEmail,
      actorRole,
      action,
      module,
      description,
      severity,
      ipAddress,
      userAgent,
      resource,
      resourceId: resourceId ? String(resourceId) : null,
      details: sanitizedDetails
    });
  } catch (err) {
    // Non-blocking: log warning to server console, never throw error into main business logic
    console.warn(`[AuditService Warning] Failed to persist audit log for '${action}':`, err.message);
  }
};

module.exports = {
  logEvent
};
