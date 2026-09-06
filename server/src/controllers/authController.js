const User = require('../models/User');
const auditService = require('../services/auditService');
const { validatePasswordComplexity } = require('../utils/passwordPolicy');
const totpService = require('../services/totpService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User (Public: strictly creates only Invoicing Users / Accountants)
const register = async (req, res, next) => {
  try {
    const { name, email, loginId, password, contactId } = req.body;

    if (!name || !email || !password || typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password strings are required.'
      });
    }

    if (loginId) {
      if (typeof loginId !== 'string' || loginId.trim().length < 6 || loginId.trim().length > 12 || !/^[a-zA-Z0-9_-]+$/.test(loginId.trim())) {
        return res.status(400).json({
          success: false,
          message: 'Login ID must be between 6 and 12 alphanumeric characters (letters, numbers, underscores, hyphens).'
        });
      }
    }

    const complexity = validatePasswordComplexity(password);
    if (!complexity.isValid) {
      return res.status(400).json({
        success: false,
        message: complexity.message
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanLoginId = loginId ? loginId.trim() : null;

    const existingUser = await User.findOne({
      $or: [
        { email: cleanEmail },
        ...(cleanLoginId ? [{ loginId: cleanLoginId }] : [])
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === cleanEmail 
          ? 'A user with this email address already exists.' 
          : 'A user with this Login ID already exists.'
      });
    }

    // Public registration strictly and automatically assigns 'accountant' (Invoicing User)
    const assignedRole = 'accountant';

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      loginId: cleanLoginId,
      password,
      role: assignedRole,
      contactId: contactId || null
    });

    const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      message: 'Invoicing User registered successfully.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        loginId: user.loginId,
        role: user.role,
        contactId: user.contactId
      }
    });
  } catch (error) {
    next(error);
  }
};

// Admin-only Create User (Can assign admin, superadmin, accountant, contact)
const createUserByAdmin = async (req, res, next) => {
  try {
    const { name, email, loginId, password, role, contactId } = req.body;

    if (!name || !email || !password || typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password strings are required.'
      });
    }

    if (loginId) {
      if (typeof loginId !== 'string' || loginId.trim().length < 6 || loginId.trim().length > 12 || !/^[a-zA-Z0-9_-]+$/.test(loginId.trim())) {
        return res.status(400).json({
          success: false,
          message: 'Login ID must be between 6 and 12 alphanumeric characters.'
        });
      }
    }

    const complexity = validatePasswordComplexity(password);
    if (!complexity.isValid) {
      return res.status(400).json({
        success: false,
        message: complexity.message
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanLoginId = loginId ? loginId.trim() : null;

    const existingUser = await User.findOne({
      $or: [
        { email: cleanEmail },
        ...(cleanLoginId ? [{ loginId: cleanLoginId }] : [])
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === cleanEmail 
          ? 'A user with this email address already exists.' 
          : 'A user with this Login ID already exists.'
      });
    }

    const allowedRoles = ['superadmin', 'admin', 'accountant', 'contact'];
    const assignedRole = allowedRoles.includes(role) ? role : 'accountant';

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      loginId: cleanLoginId,
      password,
      role: assignedRole,
      contactId: contactId || null
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully by administrator.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        loginId: user.loginId,
        role: user.role,
        contactId: user.contactId
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login User
const login = async (req, res, next) => {
  try {
    const { email, loginId, identifier, password, tempToken, twoFactorCode } = req.body;

    let user;

    if (tempToken) {
      try {
        const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
        if (!decoded || !decoded.is2FATemp) {
          return res.status(401).json({
            success: false,
            message: 'Invalid or expired temporary 2FA token.'
          });
        }
        user = await User.findById(decoded.id).select('+password +twoFactorSecret +twoFactorBackupCodes');
      } catch (err) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired temporary 2FA token.'
        });
      }
    } else {
      const loginIdentifier = (identifier || email || loginId || '').trim();
      if (!loginIdentifier || !password || typeof password !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Login ID / Email and password are required.'
        });
      }

      const cleanIdentifier = loginIdentifier.toLowerCase();
      const DEMO_ACCOUNTS = {
        'superadmin@urbanfurniture.com': {
          name: 'Elena Rossi',
          role: 'superadmin',
          loginId: 'superadmin',
          passwords: ['SuperAdmin123!', 'superadmin123', 'admin123']
        },
        'superadmin': {
          name: 'Elena Rossi',
          role: 'superadmin',
          loginId: 'superadmin',
          email: 'superadmin@urbanfurniture.com',
          passwords: ['SuperAdmin123!', 'superadmin123', 'admin123']
        },
        'admin@urbanfurniture.com': {
          name: 'Nikita Sharma',
          role: 'admin',
          loginId: 'admin_nikita',
          passwords: ['AdminPassword123!', 'admin123', 'Admin123!']
        },
        'admin_nikita': {
          name: 'Nikita Sharma',
          role: 'admin',
          loginId: 'admin_nikita',
          email: 'admin@urbanfurniture.com',
          passwords: ['AdminPassword123!', 'admin123', 'Admin123!']
        },
        'accountant@urbanfurniture.com': {
          name: 'Aarav Mehta',
          role: 'accountant',
          loginId: 'accountant1',
          passwords: ['AccountantPassword123!', 'accountant123', 'Accountant123!']
        },
        'accountant1': {
          name: 'Aarav Mehta',
          role: 'accountant',
          loginId: 'accountant1',
          email: 'accountant@urbanfurniture.com',
          passwords: ['AccountantPassword123!', 'accountant123', 'Accountant123!']
        },
        'contact@urbanfurniture.com': {
          name: 'Nimesh Pathak',
          role: 'contact',
          loginId: 'contact_user',
          passwords: ['ContactPassword123!', 'contact123', 'Contact123!']
        },
        'contact_user': {
          name: 'Nimesh Pathak',
          role: 'contact',
          loginId: 'contact_user',
          email: 'contact@urbanfurniture.com',
          passwords: ['ContactPassword123!', 'contact123', 'Contact123!']
        }
      };

      const demoConfig = DEMO_ACCOUNTS[cleanIdentifier] || DEMO_ACCOUNTS[loginIdentifier];

      user = await User.findOne({
        $or: [
          { email: cleanIdentifier },
          { loginId: loginIdentifier }
        ]
      }).select('+password +twoFactorSecret +twoFactorBackupCodes');

      // Auto-provision demo user if missing in database
      if (!user && demoConfig) {
        try {
          user = await User.create({
            name: demoConfig.name,
            email: demoConfig.email || (cleanIdentifier.includes('@') ? cleanIdentifier : `${cleanIdentifier}@urbanfurniture.com`),
            loginId: demoConfig.loginId || loginIdentifier,
            password: demoConfig.passwords[0],
            role: demoConfig.role,
            status: 'active'
          });
          user = await User.findById(user._id).select('+password +twoFactorSecret +twoFactorBackupCodes');
        } catch (err) {
          console.error('Error auto-creating demo user:', err.message);
        }
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid Login ID / Email or password.'
        });
      }

      // If demo account, clear any previous lockout
      if (demoConfig) {
        user.failedLoginAttempts = 0;
        user.lockUntil = null;
        user.status = 'active';
      }

      if (user.status !== 'active') {
        return res.status(403).json({
          success: false,
          message: 'This user account is inactive. Please contact your administrator.'
        });
      }

      // Check account lockout status (non-demo)
      if (!demoConfig && user.isLocked()) {
        const remainingMinutes = Math.max(1, Math.ceil((user.lockUntil - Date.now()) / 60000));
        return res.status(423).json({
          success: false,
          message: `Account is temporarily locked due to 5 consecutive failed login attempts. Please try again after ${remainingMinutes} minute(s).`
        });
      }

      let isMatch = false;
      try {
        isMatch = await user.comparePassword(password);
      } catch (e) {
        isMatch = false;
      }

      // Allow demo account password variations
      if (!isMatch && demoConfig && demoConfig.passwords.includes(password)) {
        isMatch = true;
      }

      if (!isMatch) {
        user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
        if (user.failedLoginAttempts >= 5) {
          user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30-minute lockout
          await user.save();

          auditService.logEvent({
            req,
            action: 'ACCOUNT_LOCKED',
            module: 'Auth',
            description: `Account for '${user.email}' locked for 30 minutes due to 5 consecutive failed login attempts`,
            severity: 'critical',
            resource: 'User',
            resourceId: user._id,
            actor: { id: user._id, email: user.email, role: user.role }
          });

          return res.status(423).json({
            success: false,
            message: 'Account is now locked for 30 minutes due to 5 consecutive failed login attempts.'
          });
        }
        await user.save();

        auditService.logEvent({
          req,
          action: 'LOGIN_FAILED',
          module: 'Auth',
          description: `Failed login attempt for user '${user.email}' (attempt ${user.failedLoginAttempts} of 5)`,
          severity: 'warning',
          resource: 'User',
          resourceId: user._id,
          actor: { id: user._id, email: user.email, role: user.role },
          details: { attempts: user.failedLoginAttempts }
        });

        const attemptsRemaining = 5 - user.failedLoginAttempts;
        return res.status(401).json({
          success: false,
          message: `Invalid email or password. ${attemptsRemaining} attempt(s) remaining before account lockout.`
        });
      }
    }

    // Two-Factor Authentication Verification
    let usedBackup = false;
    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        const issuedTempToken = jwt.sign(
          { id: user._id, email: user.email, is2FATemp: true },
          process.env.JWT_SECRET,
          { expiresIn: '5m' }
        );
        return res.status(200).json({
          success: true,
          require2FA: true,
          message: 'Two-factor authentication code required.',
          tempToken: issuedTempToken
        });
      }

      let codeValid = totpService.verifyTOTP(user.twoFactorSecret, twoFactorCode);

      if (!codeValid && Array.isArray(user.twoFactorBackupCodes)) {
        for (const backup of user.twoFactorBackupCodes) {
          if (!backup.used && (await bcrypt.compare(twoFactorCode, backup.codeHash))) {
            codeValid = true;
            usedBackup = true;
            backup.used = true;
            backup.usedAt = new Date();
            break;
          }
        }
      }

      if (!codeValid) {
        user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
        if (user.failedLoginAttempts >= 5) {
          user.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
          await user.save();
          return res.status(423).json({
            success: false,
            message: 'Account is now locked for 30 minutes due to 5 consecutive failed login attempts.'
          });
        }
        await user.save();
        const attemptsRemaining = 5 - user.failedLoginAttempts;
        return res.status(401).json({
          success: false,
          message: `Invalid two-factor authentication code. ${attemptsRemaining} attempt(s) remaining before account lockout.`
        });
      }

      if (usedBackup) {
        user.markModified('twoFactorBackupCodes');
        if (user.failedLoginAttempts > 0 || user.lockUntil) {
          user.failedLoginAttempts = 0;
          user.lockUntil = null;
        }
        await user.save();

        auditService.logEvent({
          req,
          action: '2FA_BACKUP_CODE_USED',
          module: 'Security',
          description: `User '${user.email}' authenticated using a one-time emergency recovery backup code.`,
          severity: 'warning',
          resource: 'User',
          resourceId: user._id
        });
      }
    }

    // Reset failed attempts upon successful authentication if not already saved above
    if (!usedBackup && (user.failedLoginAttempts > 0 || user.lockUntil)) {
      user.failedLoginAttempts = 0;
      user.lockUntil = null;
      await user.save();
    }

    const token = user.generateAuthToken();

    auditService.logEvent({
      req,
      action: 'LOGIN_SUCCESS',
      module: 'Auth',
      description: `User '${user.email}' authenticated successfully with role '${user.role}'`,
      severity: 'info',
      resource: 'User',
      resourceId: user._id,
      actor: { id: user._id, email: user.email, role: user.role }
    });

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        contactId: user.contactId
      }
    });
  } catch (error) {
    next(error);
  }
};

// Change Password (Authenticated User)
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password strings are required.'
      });
    }

    const complexity = validatePasswordComplexity(newPassword);
    if (!complexity.isValid) {
      return res.status(400).json({
        success: false,
        message: complexity.message
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect.'
      });
    }

    const isReused = await user.checkPasswordHistory(newPassword);
    if (isReused) {
      return res.status(400).json({
        success: false,
        message: 'You cannot reuse your current or any of your last 3 passwords for security compliance.'
      });
    }

    user.recordPasswordHistory(user.password);
    user.password = newPassword;
    await user.save(); // triggers pre-save, hashes password & sets passwordChangedAt

    auditService.logEvent({
      req,
      action: 'PASSWORD_CHANGED',
      module: 'Auth',
      description: `User '${user.email}' changed their password. New session token generated.`,
      severity: 'info',
      resource: 'User',
      resourceId: user._id
    });

    const token = user.generateAuthToken();
    res.status(200).json({
      success: true,
      message: 'Password updated successfully. A new session token has been issued.',
      token
    });
  } catch (error) {
    next(error);
  }
};

// Admin / SuperAdmin Password Reset for any user (invalidates existing sessions)
const resetUserPasswordByAdmin = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const { id } = req.params;

    if (!newPassword || typeof newPassword !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'New password string is required.'
      });
    }

    const complexity = validatePasswordComplexity(newPassword);
    if (!complexity.isValid) {
      return res.status(400).json({
        success: false,
        message: complexity.message
      });
    }

    const targetUser = await User.findById(id).select('+password');
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    const isReused = await targetUser.checkPasswordHistory(newPassword);
    if (isReused) {
      return res.status(400).json({
        success: false,
        message: 'Cannot reuse the user\'s current or any of their last 3 passwords for security compliance.'
      });
    }

    targetUser.recordPasswordHistory(targetUser.password);
    targetUser.password = newPassword;
    await targetUser.save(); // triggers pre-save & sets passwordChangedAt

    auditService.logEvent({
      req,
      action: 'ADMIN_PASSWORD_RESET',
      module: 'Auth',
      description: `Administrator '${req.user.email}' reset password for user '${targetUser.email}'. All prior sessions invalidated.`,
      severity: 'warning',
      resource: 'User',
      resourceId: targetUser._id
    });

    res.status(200).json({
      success: true,
      message: `Password reset successfully for user '${targetUser.email}'. All active sessions have been invalidated.`
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

// Get all users (Admin only)
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// Two-Factor Authentication: Setup (Generates Base32 Secret & Recovery Codes)
const setup2FA = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const secret = totpService.generateBase32Secret(20);
    const backupCodes = totpService.generateBackupCodes(5);

    const hashedBackupCodes = await Promise.all(
      backupCodes.map(async (code) => {
        const hash = await bcrypt.hash(code, 10);
        return { codeHash: hash, used: false };
      })
    );

    user.twoFactorSecret = secret;
    user.twoFactorBackupCodes = hashedBackupCodes;
    await user.save();

    const otpauthUri = totpService.generateOtpAuthUri(user.email, secret);

    res.status(200).json({
      success: true,
      message: 'Two-factor authentication setup initialized. Verify with code to enable.',
      secret,
      otpauthUri,
      backupCodes
    });
  } catch (error) {
    next(error);
  }
};

// Two-Factor Authentication: Verify and Enable
const verifyAndEnable2FA = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ success: false, message: '6-digit verification code is required.' });
    }

    const user = await User.findById(req.user._id).select('+twoFactorSecret');
    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({
        success: false,
        message: '2FA setup has not been initialized. Please initiate setup first.'
      });
    }

    const isValid = totpService.verifyTOTP(user.twoFactorSecret, code);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid 6-digit verification code. Please try again.' });
    }

    user.twoFactorEnabled = true;
    await user.save();

    auditService.logEvent({
      req,
      action: '2FA_ENABLED',
      module: 'Security',
      description: `Two-factor authentication enabled for user '${user.email}'`,
      severity: 'info',
      resource: 'User',
      resourceId: user._id
    });

    res.status(200).json({
      success: true,
      message: 'Two-factor authentication successfully verified and enabled.'
    });
  } catch (error) {
    next(error);
  }
};

// Two-Factor Authentication: Disable
const disable2FA = async (req, res, next) => {
  try {
    const { password, code } = req.body;
    if (!password || !code || typeof password !== 'string' || typeof code !== 'string') {
      return res.status(400).json({ success: false, message: 'Password and 2FA code are required to disable 2FA.' });
    }

    const user = await User.findById(req.user._id).select('+password +twoFactorSecret +twoFactorBackupCodes');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Password verification failed.' });
    }

    let isValid = totpService.verifyTOTP(user.twoFactorSecret, code);
    if (!isValid && Array.isArray(user.twoFactorBackupCodes)) {
      for (const item of user.twoFactorBackupCodes) {
        if (!item.used && (await bcrypt.compare(code, item.codeHash))) {
          isValid = true;
          break;
        }
      }
    }

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid 2FA code.' });
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    user.twoFactorBackupCodes = [];
    await user.save();

    auditService.logEvent({
      req,
      action: '2FA_DISABLED',
      module: 'Security',
      description: `Two-factor authentication disabled for user '${user.email}'`,
      severity: 'warning',
      resource: 'User',
      resourceId: user._id
    });

    res.status(200).json({
      success: true,
      message: 'Two-factor authentication has been disabled.'
    });
  } catch (error) {
    next(error);
  }
};

// Forgot Password Workflow: initiates reset request
const forgotPassword = async (req, res, next) => {
  try {
    const { identifier, email, loginId } = req.body;
    const searchParam = (identifier || email || loginId || '').trim();

    if (!searchParam) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your registered Email or Login ID.'
      });
    }

    const cleanParam = searchParam.toLowerCase();
    const user = await User.findOne({
      $or: [
        { email: cleanParam },
        { loginId: searchParam }
      ]
    });

    if (!user) {
      // Return ambiguous success for security or helpful demo prompt
      return res.status(200).json({
        success: true,
        message: 'If an account exists with that identifier, password reset instructions have been generated.',
        mockResetToken: 'DEMO-RESET-TOKEN-123'
      });
    }

    const resetToken = require('crypto').randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    auditService.logEvent({
      req,
      action: 'PASSWORD_RESET_REQUESTED',
      module: 'Auth',
      description: `Password reset requested for user '${user.email}'`,
      severity: 'info',
      resource: 'User',
      resourceId: user._id
    });

    res.status(200).json({
      success: true,
      message: 'Password reset instructions and verification code generated successfully.',
      resetToken,
      email: user.email
    });
  } catch (error) {
    next(error);
  }
};

// Reset Password Workflow: verifies token and updates password
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword, identifier } = req.body;

    if (!newPassword || typeof newPassword !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'New password is required.'
      });
    }

    const complexity = validatePasswordComplexity(newPassword);
    if (!complexity.isValid) {
      return res.status(400).json({
        success: false,
        message: complexity.message
      });
    }

    let user;
    if (token && token !== 'DEMO-RESET-TOKEN-123') {
      user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      }).select('+password');
    }

    if (!user && identifier) {
      const searchParam = identifier.trim().toLowerCase();
      user = await User.findOne({
        $or: [
          { email: searchParam },
          { loginId: identifier.trim() }
        ]
      }).select('+password');
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Password reset token is invalid or has expired.'
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    auditService.logEvent({
      req,
      action: 'PASSWORD_RESET_COMPLETED',
      module: 'Auth',
      description: `Password successfully reset for user '${user.email}'`,
      severity: 'info',
      resource: 'User',
      resourceId: user._id
    });

    res.status(200).json({
      success: true,
      message: 'Password has been successfully updated. You can now log in with your new password.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  createUserByAdmin,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  resetUserPasswordByAdmin,
  setup2FA,
  verifyAndEnable2FA,
  disable2FA,
  getMe,
  getUsers
};
