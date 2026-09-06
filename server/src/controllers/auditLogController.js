/**
 * Audit Log Controller
 * Urban Furniture ERP - Enterprise Security Suite
 */
const AuditLog = require('../models/AuditLog');
const escapeRegex = require('../utils/escapeRegex');

/**
 * Get paginated audit logs (Admin & SuperAdmin only)
 */
const getAuditLogs = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const filter = {};

    // Filter by module
    if (req.query.module && req.query.module !== 'All') {
      filter.module = req.query.module;
    }

    // Filter by severity
    if (req.query.severity && req.query.severity !== 'All') {
      filter.severity = req.query.severity.toLowerCase();
    }

    // Filter by action
    if (req.query.action) {
      filter.action = req.query.action;
    }

    // Filter by date range
    if (req.query.startDate || req.query.endDate) {
      filter.timestamp = {};
      if (req.query.startDate) {
        filter.timestamp.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter.timestamp.$lte = new Date(req.query.endDate);
      }
    }

    // Search query on description, actorEmail, or action
    if (req.query.search) {
      const sanitizedSearch = escapeRegex(req.query.search.trim());
      filter.$or = [
        { description: { $regex: sanitizedSearch, $options: 'i' } },
        { actorEmail: { $regex: sanitizedSearch, $options: 'i' } },
        { action: { $regex: sanitizedSearch, $options: 'i' } },
        { resourceId: { $regex: sanitizedSearch, $options: 'i' } }
      ];
    }

    const totalCount = await AuditLog.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit) || 1;

    const auditLogs = await AuditLog.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: auditLogs.length,
      totalCount,
      totalPages,
      currentPage: page,
      limit,
      auditLogs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAuditLogs
};
