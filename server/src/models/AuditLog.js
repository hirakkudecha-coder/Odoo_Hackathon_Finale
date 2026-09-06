/**
 * Immutable Audit Log Mongoose Model
 * Urban Furniture ERP - Enterprise Security Suite & SOX/GAAP Compliance
 */
const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    actorEmail: {
      type: String,
      default: 'system@internal'
    },
    actorRole: {
      type: String,
      default: 'system'
    },
    action: {
      type: String,
      required: [true, 'Audit action code is required'],
      index: true
    },
    module: {
      type: String,
      required: [true, 'Module name is required'],
      enum: [
        'Auth',
        'General Ledger',
        'Purchases',
        'Sales',
        'Payments',
        'Inventory',
        'Contacts',
        'Products',
        'Budgets',
        'Concierge',
        'Security',
        'System'
      ],
      index: true
    },
    description: {
      type: String,
      required: [true, 'Audit log description is required']
    },
    severity: {
      type: String,
      enum: ['info', 'warning', 'critical', 'success'],
      default: 'info',
      index: true
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1'
    },
    userAgent: {
      type: String,
      default: 'Internal/ERP'
    },
    resource: {
      type: String,
      default: null,
      index: true
    },
    resourceId: {
      type: String,
      default: null
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    timestamp: {
      type: Date,
      default: Date.now,
      immutable: true,
      index: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

// Compound indexes for performant audit queries
auditLogSchema.index({ module: 1, timestamp: -1 });
auditLogSchema.index({ actorEmail: 1, timestamp: -1 });
auditLogSchema.index({ severity: 1, timestamp: -1 });

// Immutability Guards: prevent modification or deletion of statutory audit records
const blockMutation = function (next) {
  const error = new Error('IMMUTABILITY VIOLATION: Audit log records are permanent and cannot be modified or deleted.');
  error.statusCode = 403;
  next(error);
};

auditLogSchema.pre('updateOne', blockMutation);
auditLogSchema.pre('updateMany', blockMutation);
auditLogSchema.pre('findOneAndUpdate', blockMutation);
auditLogSchema.pre('deleteOne', blockMutation);
auditLogSchema.pre('deleteMany', blockMutation);
auditLogSchema.pre('findOneAndDelete', blockMutation);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
