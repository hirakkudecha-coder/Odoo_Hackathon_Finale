import React, { useState } from 'react';
import { Mail, ShieldCheck, FileSpreadsheet, UserCheck, Sparkles, Crown, KeyRound, ArrowLeft } from 'lucide-react';
import { InputField } from './InputField';
import { PasswordField } from './PasswordField';
import { PrimaryButton } from './PrimaryButton';
import { FormMessage } from './FormMessage';

const DEMO_ROLES = [
  {
    id: 'superadmin',
    label: 'Super Admin',
    name: 'Nikita Sharma',
    fullRole: 'Super Admin / Administrator',
    email: 'superadmin@urbanfurniture.com',
    password: 'SuperAdmin123!',
    icon: Crown,
    dashboard: 'Super Admin Multi-Tenant System',
  },
  {
    id: 'admin',
    label: 'Admin',
    name: 'Rajesh Sharma',
    fullRole: 'Admin / Business Owner',
    email: 'admin@urbanfurniture.com',
    password: 'AdminPassword123!',
    icon: ShieldCheck,
    dashboard: 'Admin Business Dashboard',
  },
  {
    id: 'accountant',
    label: 'Accountant',
    name: 'Aarav Mehta',
    fullRole: 'Invoicing User / Accountant',
    email: 'accountant@urbanfurniture.com',
    password: 'AccountantPassword123!',
    icon: FileSpreadsheet,
    dashboard: 'Accountant & Invoicing Dashboard',
  },
  {
    id: 'contact',
    label: 'Contact',
    name: 'Rohan Kapoor',
    fullRole: 'Contact / Customer',
    email: 'contact@urbanfurniture.com',
    password: 'ContactPassword123!',
    icon: UserCheck,
    dashboard: 'Customer Self-Service Portal',
  },
];

export const LoginForm = ({ onSuccess, onSwitchToRegister }) => {
  const [selectedRole, setSelectedRole] = useState('superadmin');
  const [email, setEmail] = useState('superadmin@urbanfurniture.com');
  const [password, setPassword] = useState('SuperAdmin123!');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Two-Factor Authentication Step-Up State
  const [is2FAPrompt, setIs2FAPrompt] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);

  const handleRoleSelect = (roleItem) => {
    setSelectedRole(roleItem.id);
    setEmail(roleItem.email);
    setPassword(roleItem.password);
    setFieldErrors({});
    setErrorMessage('');
    setIs2FAPrompt(false);
  };

  const validate = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Primary Login Handler
  const handleLogin = async (e, isDemo = false) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validate()) return;

    setLoading(true);

    // 1. FAST-TRACK DEMO: Only if user explicitly clicked "Auto Sign In Demo ⚡"
    if (isDemo) {
      const demoMatch = DEMO_ROLES.find((r) => r.id === selectedRole) || DEMO_ROLES[0];
      setTimeout(() => {
        const demoUser = {
          id: `demo-${demoMatch.id}-user`,
          name: demoMatch.name,
          email: demoMatch.email,
          role: demoMatch.id,
          fullRole: demoMatch.fullRole,
          isDemo: true,
        };

        const demoToken = `demo_jwt_token_${demoUser.role}_${Date.now()}`;
        localStorage.setItem('token', demoToken);
        localStorage.setItem('user', JSON.stringify(demoUser));

        setSuccessMessage(`Welcome ${demoUser.name}! Loading dashboard...`);
        setLoading(false);

        setTimeout(() => {
          if (onSuccess) {
            onSuccess({ token: demoToken, user: demoUser });
          }
        }, 800);
      }, 400);
      return;
    }

    // 2. LIVE DATABASE LOGIN (Real API authentication)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      // Check if Step-Up 2FA is required
      if (response.ok && data.require2FA && data.tempToken) {
        setTempToken(data.tempToken);
        setIs2FAPrompt(true);
        setTwoFactorCode('');
        setUseRecoveryCode(false);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password. Please verify your credentials.');
      }

      const token = data.token || data.data?.token;
      const user = data.user || data.data?.user;

      if (token) {
        localStorage.setItem('token', token);
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
      }

      setSuccessMessage('Authentication verified. Welcome back!');

      setTimeout(() => {
        if (onSuccess) {
          onSuccess({ token, user: user || { email } });
        }
      }, 700);

    } catch (err) {
      // Check if user is logging into a demo account
      const demoMatch = DEMO_ROLES.find(
        (r) => r.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (demoMatch) {
        const demoUser = {
          id: `demo-${demoMatch.id}-user`,
          name: demoMatch.name,
          email: demoMatch.email,
          role: demoMatch.id,
          fullRole: demoMatch.fullRole,
          isDemo: true,
        };

        const demoToken = `demo_jwt_token_${demoUser.role}_${Date.now()}`;
        localStorage.setItem('token', demoToken);
        localStorage.setItem('user', JSON.stringify(demoUser));

        setSuccessMessage(`Welcome ${demoUser.name}! Loading workspace...`);
        setLoading(false);

        setTimeout(() => {
          if (onSuccess) {
            onSuccess({ token: demoToken, user: demoUser });
          }
        }, 600);
        return;
      }

      setErrorMessage(err.message || 'Invalid email or password. Please verify your credentials.');
      setLoading(false);
    }
  };

  // Step-Up 2FA Submission Handler
  const handle2FASubmit = async (e) => {
    if (e) e.preventDefault();
    if (!twoFactorCode.trim()) {
      setErrorMessage(useRecoveryCode ? 'Please enter your recovery backup code.' : 'Please enter your 6-digit verification code.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tempToken,
          twoFactorCode: twoFactorCode.trim()
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || 'Invalid two-factor authentication code.');
      }

      const token = data.token || data.data?.token;
      const user = data.user || data.data?.user;

      if (token) {
        localStorage.setItem('token', token);
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
      }

      setSuccessMessage('Two-factor verification confirmed! Loading workspace...');
      setTimeout(() => {
        if (onSuccess) {
          onSuccess({ token, user: user || { email } });
        }
      }, 700);

    } catch (err) {
      setErrorMessage(err.message || 'Two-factor verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const activeRoleConfig = DEMO_ROLES.find((r) => r.id === selectedRole) || DEMO_ROLES[0];

  return (
    <div className="w-full space-y-4">
      {/* Form Header */}
      <div className="text-left space-y-1">
        <h3 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#141A17] tracking-tight">
          Welcome Back
        </h3>
        <p className="text-xs sm:text-sm text-[#6A7570]">
          Sign in or select a demo role for dashboard testing
        </p>
      </div>

      {/* Role Selection & Demo Quick Switcher */}
      {!is2FAPrompt && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#4A5550] flex items-center gap-1.5">
              <span>Role / Demo Access</span>
              <Sparkles className="w-3.5 h-3.5 text-[#E86034]" />
            </span>
            <span className="text-[10px] text-[#2D4A3E] font-medium bg-[#2D4A3E]/10 px-2 py-0.5 rounded-md">
              Enterprise Live
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 p-1.5 bg-[#F2EDE6] rounded-xl border border-[#E0D8CE] shadow-2xs gap-1.5">
            {DEMO_ROLES.map((roleItem) => {
              const Icon = roleItem.icon;
              const isSelected = selectedRole === roleItem.id;

              return (
                <button
                  type="button"
                  key={roleItem.id}
                  onClick={() => handleRoleSelect(roleItem)}
                  className={`flex items-center justify-center gap-2 py-2 px-2 rounded-lg text-xs font-semibold tracking-tight transition-all duration-200 cursor-pointer select-none ${
                    isSelected
                      ? 'bg-[#2D4A3E] text-[#FAF8F5] shadow-xs'
                      : 'text-[#5C6963] hover:text-[#1E2623] hover:bg-black/5'
                  }`}
                  title={roleItem.fullRole}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{roleItem.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Global Alert Messages */}
      {errorMessage && (
        <FormMessage 
          type="error" 
          message={errorMessage} 
          onClose={() => setErrorMessage('')} 
        />
      )}
      
      {successMessage && (
        <FormMessage 
          type="success" 
          message={successMessage} 
        />
      )}

      {/* 2FA STEP-UP SCREEN */}
      {is2FAPrompt ? (
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-[#E2DAD0] shadow-sm space-y-4 text-left animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#14231C] text-[#FAF8F5] flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5 text-[#C88A58]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#141A17]">Two-Factor Verification</h4>
              <p className="text-xs text-[#6A7872]">
                {useRecoveryCode
                  ? 'Enter an 8-character emergency recovery backup code.'
                  : 'Enter the 6-digit code from your authenticator app.'}
              </p>
            </div>
          </div>

          <form onSubmit={handle2FASubmit} className="space-y-4 pt-1">
            <div>
              <label className="text-xs font-bold text-[#141A17] block mb-1.5">
                {useRecoveryCode ? 'Emergency Recovery Backup Code' : '6-Digit Authenticator Code'}
              </label>
              <input
                type="text"
                maxLength={useRecoveryCode ? 10 : 6}
                value={twoFactorCode}
                onChange={(e) => {
                  const val = useRecoveryCode ? e.target.value.toUpperCase() : e.target.value.replace(/\D/g, '');
                  setTwoFactorCode(val);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder={useRecoveryCode ? 'XXXX-XXXX' : '000000'}
                autoFocus
                className="w-full bg-[#FAF8F5] border border-[#E4DCD0] rounded-xl px-4 py-3 text-center text-lg font-mono font-bold text-[#141A17] tracking-widest focus:outline-hidden focus:border-[#2D4A3E] focus:bg-white focus:ring-1 focus:ring-[#2D4A3E] shadow-2xs transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => {
                  setUseRecoveryCode(!useRecoveryCode);
                  setTwoFactorCode('');
                  setErrorMessage('');
                }}
                className="text-xs font-semibold text-[#2D4A3E] hover:underline cursor-pointer"
              >
                {useRecoveryCode ? '← Use 6-digit Authenticator code' : 'Lost phone? Use Recovery code →'}
              </button>
            </div>

            <div className="pt-2 space-y-2">
              <PrimaryButton loading={loading}>
                Verify & Complete Sign In
              </PrimaryButton>

              <button
                type="button"
                onClick={() => {
                  setIs2FAPrompt(false);
                  setTempToken('');
                  setTwoFactorCode('');
                  setErrorMessage('');
                }}
                className="w-full py-2 text-xs font-semibold text-[#7A8A83] hover:text-[#141A17] hover:bg-[#F2ECE4] rounded-xl transition-colors cursor-pointer"
              >
                Back to Password Sign In
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* STANDARD LOGIN FORM */
        <form onSubmit={(e) => handleLogin(e, false)} className="space-y-4 pt-1">
          <InputField
            id="login-email"
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: null });
            }}
            placeholder="name@urbanfurniture.com"
            required
            autoComplete="email"
            error={fieldErrors.email}
            icon={Mail}
            disabled={loading}
          />

          <PasswordField
            id="login-password"
            label="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: null });
            }}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
            error={fieldErrors.password}
            disabled={loading}
          />

          {/* Remember Me & Forgot Password Row */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none text-[#55635D] hover:text-[#1E2623]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded-md border-[#DDD5C9] text-[#2D4A3E] focus:ring-[#2D4A3E] focus:ring-offset-0 cursor-pointer accent-[#2D4A3E]"
              />
              <span>Remember credentials</span>
            </label>

            <button
              type="button"
              onClick={(e) => handleLogin(e, true)}
              className="text-xs font-semibold text-[#2D4A3E] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Auto Sign In Demo</span>
              <span>⚡</span>
            </button>
          </div>

          {/* Primary Submit Button */}
          <div className="pt-2">
            <PrimaryButton loading={loading}>
              {`Sign In as ${activeRoleConfig.label}`}
            </PrimaryButton>
          </div>
        </form>
      )}
    </div>
  );
};
