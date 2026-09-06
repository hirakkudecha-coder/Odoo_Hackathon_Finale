const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['superadmin', 'admin', 'accountant', 'contact'],
      default: 'accountant'
    },
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
      default: null
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    failedLoginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: {
      type: Date
    },
    passwordChangedAt: {
      type: Date
    },
    passwordHistory: [
      {
        hash: { type: String, required: true },
        changedAt: { type: Date, default: Date.now }
      }
    ],
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    twoFactorSecret: {
      type: String,
      select: false
    },
    twoFactorBackupCodes: [
      {
        codeHash: { type: String, required: true },
        used: { type: Boolean, default: false },
        usedAt: { type: Date }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Helper to check if account is currently locked
userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Check if candidate password matches current password or any password in history
userSchema.methods.checkPasswordHistory = async function (candidatePassword) {
  if (this.password) {
    const isCurrent = await bcrypt.compare(candidatePassword, this.password);
    if (isCurrent) return true;
  }
  if (Array.isArray(this.passwordHistory)) {
    for (const item of this.passwordHistory) {
      if (item && item.hash) {
        const isMatch = await bcrypt.compare(candidatePassword, item.hash);
        if (isMatch) return true;
      }
    }
  }
  return false;
};

// Push old password hash to history and trim to last 3 entries
userSchema.methods.recordPasswordHistory = function (oldHash) {
  if (!this.passwordHistory) {
    this.passwordHistory = [];
  }
  if (oldHash) {
    this.passwordHistory.unshift({ hash: oldHash, changedAt: new Date() });
    if (this.passwordHistory.length > 3) {
      this.passwordHistory = this.passwordHistory.slice(0, 3);
    }
  }
};

// Hash password before save & set passwordChangedAt timestamp
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.passwordChangedAt = new Date();
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function () {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('FATAL CONFIGURATION ERROR: JWT_SECRET environment variable is missing');
  }
  const payload = {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    contactId: this.contactId
  };

  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(payload, secret, { expiresIn });
};

// Exclude sensitive credentials from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.twoFactorSecret;
  delete user.twoFactorBackupCodes;
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
