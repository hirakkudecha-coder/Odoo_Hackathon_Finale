import React, { useState } from 'react';
import { Mail, ShieldCheck, FileSpreadsheet, UserCheck, Sparkles, Crown } from 'lucide-react';
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
    password: 'superadmin123',
    icon: Crown,
    dashboard: 'Super Admin Multi-Tenant System',
  },
  {
    id: 'admin',
    label: 'Admin',
    name: 'Rajesh Sharma',
    fullRole: 'Admin / Business Owner',
    email: 'admin@urbanfurniture.com',
    password: 'admin123',
    icon: ShieldCheck,
    dashboard: 'Admin Business Dashboard',
  },
  {
    id: 'accountant',
    label: 'Accountant',
    name: 'Aarav Mehta',
    fullRole: 'Invoicing User / Accountant',
    email: 'accountant@urbanfurniture.com',
    password: 'accountant123',
    icon: FileSpreadsheet,
    dashboard: 'Accountant & Invoicing Dashboard',
  },
  {
    id: 'contact',
    label: 'Contact',
    name: 'Rohan Kapoor',
    fullRole: 'Contact / Customer',
    email: 'contact@urbanfurniture.com',
    password: 'contact123',
    icon: UserCheck,
    dashboard: 'Customer Self-Service Portal',
  },
];

export const LoginForm = ({ onSuccess, onSwitchToRegister }) => {
  const [selectedRole, setSelectedRole] = useState('superadmin');
  const [email, setEmail] = useState('superadmin@urbanfurniture.com');
  const [password, setPassword] = useState('superadmin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleRoleSelect = (roleItem) => {
    setSelectedRole(roleItem.id);
    setEmail(roleItem.email);
    setPassword(roleItem.password);
    setFieldErrors({});
    setErrorMessage('');
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

  const handleLogin = async (e, isDemo = false) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validate()) return;

    setLoading(true);

    // 1. Check if user is registered in localStorage
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const registeredMatch = registeredUsers.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (registeredMatch) {
        setTimeout(() => {
          const userObj = {
            id: registeredMatch.id,
            name: registeredMatch.name,
            email: registeredMatch.email,
            role: registeredMatch.role || 'admin',
            fullRole: registeredMatch.fullRole || (registeredMatch.role === 'admin' ? 'Admin / Business Owner' : 'Invoicing User / Accountant'),
          };

          const userToken = `jwt_token_${userObj.role}_${Date.now()}`;
          localStorage.setItem('token', userToken);
          localStorage.setItem('user', JSON.stringify(userObj));

          setSuccessMessage(`Welcome back, ${userObj.name}! Loading workspace...`);
          setLoading(false);

          setTimeout(() => {
            if (onSuccess) {
              onSuccess({ token: userToken, user: userObj });
            }
          }, 800);
        }, 400);
        return;
      }
    } catch (e) {
      // Continue
    }

    const demoMatch = DEMO_ROLES.find(
      (r) => r.email.toLowerCase() === email.trim().toLowerCase()
    );

    // 2. DEMO LOGIN: If using demo email or demo quick sign-in
    if (isDemo || demoMatch) {
      setTimeout(() => {
        const demoUser = {
          id: `demo-${demoMatch ? demoMatch.id : selectedRole}-user`,
          name: demoMatch ? demoMatch.name : (email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())),
          email: email.trim(),
          role: demoMatch ? demoMatch.id : selectedRole,
          fullRole: demoMatch ? demoMatch.fullRole : (selectedRole === 'admin' ? 'Admin / Business Owner' : selectedRole === 'accountant' ? 'Invoicing User / Accountant' : 'Contact / Customer'),
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
      }, 500);
      return;
    }

    // 3. CUSTOM USER LOGIN: If custom email/password typed
    if (email.trim() && password) {
      setTimeout(() => {
        const customName = email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
        const customUser = {
          id: `user-${Date.now()}`,
          name: customName,
          email: email.trim(),
          role: selectedRole || 'admin',
          fullRole: (selectedRole || 'admin') === 'admin' ? 'Admin / Business Owner' : 'Invoicing User / Accountant',
        };

        const customToken = `jwt_token_${customUser.role}_${Date.now()}`;
        localStorage.setItem('token', customToken);
        localStorage.setItem('user', JSON.stringify(customUser));

        setSuccessMessage(`Welcome ${customUser.name}! Loading dashboard...`);
        setLoading(false);

        setTimeout(() => {
          if (onSuccess) {
            onSuccess({ token: customToken, user: customUser });
          }
        }, 800);
      }, 500);
      return;
    }

    // LIVE DATABASE LOGIN FALLBACK
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
      }, 1000);

    } catch (err) {
      setErrorMessage(err.message || 'Unable to connect to server. Use Demo Quick Sign In above for testing.');
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

      {/* 3 Role Selection & Demo Quick Switcher */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-[#4A5550] flex items-center gap-1.5">
            <span>Role / Demo Access</span>
            <Sparkles className="w-3.5 h-3.5 text-[#E86034]" />
          </span>
          <span className="text-[10px] text-[#2D4A3E] font-medium bg-[#2D4A3E]/10 px-2 py-0.5 rounded-md">
            Demo Offline Testing
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

      {/* Login Form */}
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
    </div>
  );
};
