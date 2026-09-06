import React, { useState } from 'react';
import { User, Mail, AtSign, CheckCircle2, ShieldCheck, FileSpreadsheet } from 'lucide-react';
import { InputField } from './InputField';
import { PasswordField } from './PasswordField';
import { PrimaryButton } from './PrimaryButton';
import { FormMessage } from './FormMessage';

export const RegisterForm = ({ onSuccess, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [loginId, setLoginId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Strict password complexity rules
  const rules = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password),
  };

  const validate = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = 'Full Name or Studio Name is required';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!loginId.trim()) {
      errors.loginId = 'Login ID is required';
    } else if (loginId.trim().length < 6 || loginId.trim().length > 12) {
      errors.loginId = 'Login ID must be 6 to 12 characters';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(loginId.trim())) {
      errors.loginId = 'Login ID can only contain letters, numbers, and underscores';
    }

    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (!Object.values(rules).every(Boolean)) {
      errors.password = 'Password must meet all complexity requirements';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirmation password is required';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validate()) return;

    setLoading(true);

    try {
      let token = null;
      let user = null;

      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name.trim(),
            loginId: loginId.trim(),
            email: email.trim().toLowerCase(),
            password,
            role: 'accountant', // Strict assignment
          }),
        });

        const data = await response.json().catch(() => ({}));
        if (response.ok) {
          token = data.token || data.data?.token;
          user = data.user || data.data?.user;
        } else {
          throw new Error(data.message || 'Registration failed');
        }
      } catch (e) {
        if (!e.message.includes('Failed to fetch')) {
          throw e;
        }
      }

      const registeredUser = user || {
        id: `user-${Date.now()}`,
        name: name.trim(),
        loginId: loginId.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        role: 'accountant',
        fullRole: 'Invoicing User / Accountant'
      };

      try {
        const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        const updatedUsers = [
          ...existingUsers.filter(u => u.email.toLowerCase() !== registeredUser.email.toLowerCase()),
          registeredUser
        ];
        localStorage.setItem('registered_users', JSON.stringify(updatedUsers));
      } catch (e) {
        // Continue
      }

      const authToken = token || `reg_token_${Date.now()}`;
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(registeredUser));

      setSuccessMessage(`Welcome ${registeredUser.name}! Setting up Invoicing workspace...`);

      setTimeout(() => {
        if (onSuccess) {
          onSuccess({ token: authToken, user: registeredUser });
        }
      }, 1000);

    } catch (err) {
      setErrorMessage(err.message || 'Registration error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Form Header */}
      <div className="text-left space-y-1">
        <h3 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#141A17] tracking-tight">
          Create Account
        </h3>
        <p className="text-xs sm:text-sm text-[#6A7570]">
          Sign up as an Invoicing User for Urban Furniture ERP
        </p>
      </div>

      {/* Role Badge Indicator */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#F2EDE6] rounded-xl border border-[#E0D8CE] text-xs text-[#2D4A3E]">
        <FileSpreadsheet className="w-4 h-4 text-[#2D4A3E] shrink-0" />
        <span className="font-semibold">Assigned Role:</span>
        <span className="bg-[#2D4A3E] text-[#FAF8F5] text-[10px] font-bold px-2 py-0.5 rounded-md">
          Invoicing User (Accountant)
        </span>
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

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
        {/* Full Name */}
        <InputField
          id="register-name"
          label="Full Name / Studio Name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: null });
          }}
          placeholder="e.g. Alex Morgan"
          required
          autoComplete="name"
          error={fieldErrors.name}
          icon={User}
          disabled={loading}
        />

        {/* Login ID & Email in grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InputField
            id="register-loginId"
            label="Login ID (6–12 Chars)"
            type="text"
            value={loginId}
            onChange={(e) => {
              setLoginId(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''));
              if (fieldErrors.loginId) setFieldErrors({ ...fieldErrors, loginId: null });
            }}
            placeholder="e.g. alex_m123"
            required
            autoComplete="username"
            error={fieldErrors.loginId}
            icon={AtSign}
            disabled={loading}
          />

          <InputField
            id="register-email"
            label="Work Email Address"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: null });
            }}
            placeholder="alex@urbanfurniture.com"
            required
            autoComplete="email"
            error={fieldErrors.email}
            icon={Mail}
            disabled={loading}
          />
        </div>

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <PasswordField
            id="register-password"
            label="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: null });
            }}
            placeholder="Min. 8 chars"
            required
            autoComplete="new-password"
            error={fieldErrors.password}
            disabled={loading}
          />

          <PasswordField
            id="register-confirm-password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: null });
            }}
            placeholder="Repeat password"
            required
            autoComplete="new-password"
            error={fieldErrors.confirmPassword}
            disabled={loading}
          />
        </div>

        {/* Real-time Strict Password Complexity Indicators */}
        <div className="p-2.5 bg-[#FAF8F5] border border-[#E4DCD0] rounded-xl text-xs space-y-1">
          <div className="font-semibold text-[#2D4A3E] text-[11px]">Password Complexity:</div>
          <div className="grid grid-cols-2 gap-1 text-[11px]">
            <div className={`flex items-center gap-1.5 ${rules.length ? 'text-emerald-700 font-medium' : 'text-gray-500'}`}>
              <CheckCircle2 className={`w-3.5 h-3.5 ${rules.length ? 'text-emerald-600' : 'text-gray-400'}`} />
              <span>&gt; 8 characters</span>
            </div>
            <div className={`flex items-center gap-1.5 ${rules.uppercase ? 'text-emerald-700 font-medium' : 'text-gray-500'}`}>
              <CheckCircle2 className={`w-3.5 h-3.5 ${rules.uppercase ? 'text-emerald-600' : 'text-gray-400'}`} />
              <span>1 Uppercase (A-Z)</span>
            </div>
            <div className={`flex items-center gap-1.5 ${rules.lowercase ? 'text-emerald-700 font-medium' : 'text-gray-500'}`}>
              <CheckCircle2 className={`w-3.5 h-3.5 ${rules.lowercase ? 'text-emerald-600' : 'text-gray-400'}`} />
              <span>1 Lowercase (a-z)</span>
            </div>
            <div className={`flex items-center gap-1.5 ${rules.special ? 'text-emerald-700 font-medium' : 'text-gray-500'}`}>
              <CheckCircle2 className={`w-3.5 h-3.5 ${rules.special ? 'text-emerald-600' : 'text-gray-400'}`} />
              <span>1 Special character</span>
            </div>
          </div>
        </div>

        {/* Primary Submit Button */}
        <div className="pt-1">
          <PrimaryButton loading={loading}>
            Create Invoicing User Account
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
