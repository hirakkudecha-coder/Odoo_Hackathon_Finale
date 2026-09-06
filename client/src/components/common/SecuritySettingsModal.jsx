import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  Key,
  Lock,
  Copy,
  Check,
  Download,
  QrCode,
  Smartphone,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  RefreshCw,
  FileText
} from 'lucide-react';

export const SecuritySettingsModal = ({ isOpen, onClose, currentUser, onUserUpdated }) => {
  const [activeTab, setActiveTab] = useState('2fa'); // '2fa' | 'password'
  
  // 2FA state
  const [twoFactorActive, setTwoFactorActive] = useState(Boolean(currentUser?.twoFactorEnabled));
  const [setupData, setSetupData] = useState(null); // { secret, otpauthUri, backupCodes }
  const [setupStep, setSetupStep] = useState(1); // 1: view QR/secret, 2: verify code
  const [totpCode, setTotpCode] = useState('');
  const [disablePassword, setDisablePassword] = useState('');
  const [disableTotpCode, setDisableTotpCode] = useState('');
  const [isDisabling, setIsDisabling] = useState(false);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);

  // Sync with current user changes
  useEffect(() => {
    if (isOpen) {
      setTwoFactorActive(Boolean(currentUser?.twoFactorEnabled));
      setErrorMessage('');
      setSuccessMessage('');
      setSetupData(null);
      setIsDisabling(false);
      setTotpCode('');
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const token = localStorage.getItem('token');

  // Password policy criteria checks
  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasDigit = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword);
  const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasDigit && hasSpecial;
  const passwordsMatch = newPassword && newPassword === confirmPassword;

  // 1. Initialize 2FA Setup
  const handleInitiateSetup = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to initialize 2FA setup.');
      }

      setSetupData(data);
      setSetupStep(1);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to communicate with authentication server.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify and Enable 2FA
  const handleVerifyAndEnable = async (e) => {
    if (e) e.preventDefault();
    if (!totpCode || totpCode.trim().length !== 6) {
      setErrorMessage('Please enter a valid 6-digit numeric verification code.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/auth/2fa/verify-and-enable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code: totpCode.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Verification failed. Code may be invalid or expired.');
      }

      setTwoFactorActive(true);
      setSetupData(null);
      setTotpCode('');
      setSuccessMessage('Two-factor authentication has been successfully verified and activated!');

      // Update stored user
      try {
        const localUser = JSON.parse(localStorage.getItem('user') || '{}');
        localUser.twoFactorEnabled = true;
        localStorage.setItem('user', JSON.stringify(localUser));
        if (onUserUpdated) onUserUpdated(localUser);
      } catch (_) {}

    } catch (err) {
      setErrorMessage(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Disable 2FA
  const handleDisable2FA = async (e) => {
    if (e) e.preventDefault();
    if (!disablePassword || !disableTotpCode) {
      setErrorMessage('Password and current 2FA code are required to disable 2FA.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          password: disablePassword,
          code: disableTotpCode.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to disable 2FA. Verify password and code.');
      }

      setTwoFactorActive(false);
      setIsDisabling(false);
      setDisablePassword('');
      setDisableTotpCode('');
      setSuccessMessage('Two-factor authentication has been disabled for your account.');

      // Update stored user
      try {
        const localUser = JSON.parse(localStorage.getItem('user') || '{}');
        localUser.twoFactorEnabled = false;
        localStorage.setItem('user', JSON.stringify(localUser));
        if (onUserUpdated) onUserUpdated(localUser);
      } catch (_) {}

    } catch (err) {
      setErrorMessage(err.message || 'Failed to disable 2FA.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Change Password
  const handleChangePassword = async (e) => {
    if (e) e.preventDefault();
    if (!currentPassword) {
      setErrorMessage('Current password is required.');
      return;
    }
    if (!isPasswordValid) {
      setErrorMessage('New password does not meet all required complexity standards.');
      return;
    }
    if (!passwordsMatch) {
      setErrorMessage('New password and confirmation do not match.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update password.');
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMessage('Password updated successfully! All other active sessions have been securely invalidated.');

    } catch (err) {
      setErrorMessage(err.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyKey = () => {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const handleCopyBackupCodes = () => {
    if (setupData?.backupCodes) {
      navigator.clipboard.writeText(setupData.backupCodes.join('\n'));
      setCopiedCodes(true);
      setTimeout(() => setCopiedCodes(false), 2000);
    }
  };

  const handleDownloadBackupCodes = () => {
    if (!setupData?.backupCodes) return;
    const content = `URBAN FURNITURE ERP - EMERGENCY RECOVERY BACKUP CODES\nGenerated: ${new Date().toLocaleString()}\nAccount: ${currentUser?.email || 'User'}\n\nEach code can only be used once to access your account if you lose your authenticator app:\n\n${setupData.backupCodes.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\nKeep these codes in a secure, confidential location.\n`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `urban_furniture_backup_codes_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#14231C]/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-[#FAF8F5] w-full max-w-2xl max-h-[90vh] rounded-3xl border border-[#E8E1D5] shadow-2xl overflow-hidden flex flex-col my-auto text-left relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#E8E1D5] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#14231C] text-[#FAF8F5] flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5 text-[#C88A58]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#141A17]">Security & Authentication</h3>
              <p className="text-xs text-[#6D7D76]">Manage multi-factor authentication, backup recovery codes, and password policies.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A8A83] hover:text-[#141A17] hover:bg-[#F2ECE4] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 border-b border-[#E8E1D5] flex gap-6 bg-white shrink-0">
          <button
            onClick={() => {
              setActiveTab('2fa');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === '2fa'
                ? 'border-[#2D4A3E] text-[#2D4A3E]'
                : 'border-transparent text-[#7A8A83] hover:text-[#141A17]'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Two-Factor Authentication</span>
            {twoFactorActive && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('password');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'password'
                ? 'border-[#2D4A3E] text-[#2D4A3E]'
                : 'border-transparent text-[#7A8A83] hover:text-[#141A17]'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Password Policy & Rotation</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 flex-1 overflow-y-auto">
          
          {/* Global Alert Messages */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: TWO-FACTOR AUTHENTICATION */}
          {activeTab === '2fa' && (
            <div className="space-y-6">
              
              {/* Current Status Card */}
              <div className="p-4 rounded-2xl bg-white border border-[#E8E1D5] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${twoFactorActive ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {twoFactorActive ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#141A17]">Two-Factor Authentication (TOTP)</h4>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        twoFactorActive ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {twoFactorActive ? 'ACTIVE & PROTECTED' : 'DISABLED'}
                      </span>
                    </div>
                    <p className="text-xs text-[#6A7872] mt-0.5">
                      {twoFactorActive
                        ? 'Your account requires an authenticator app code on every login.'
                        : 'Add an extra layer of defense against credential stuffing and brute-force cracking.'}
                    </p>
                  </div>
                </div>

                {!setupData && (
                  twoFactorActive ? (
                    <button
                      onClick={() => setIsDisabling(!isDisabling)}
                      className="px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold transition-all cursor-pointer shrink-0"
                    >
                      {isDisabling ? 'Cancel' : 'Disable 2FA'}
                    </button>
                  ) : (
                    <button
                      onClick={handleInitiateSetup}
                      disabled={loading}
                      className="px-4 py-2 rounded-xl bg-[#2D4A3E] text-white hover:bg-[#1E332A] text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0 flex items-center gap-1.5"
                    >
                      {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <QrCode className="w-3.5 h-3.5" />}
                      <span>Enable 2FA</span>
                    </button>
                  )
                )}
              </div>

              {/* 2FA SETUP WIZARD */}
              {setupData && !twoFactorActive && (
                <div className="p-5 rounded-2xl bg-white border border-[#E2DAD0] space-y-5 animate-fadeIn">
                  
                  <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1]">
                    <span className="font-serif font-bold text-sm text-[#141A17]">Configure Authenticator App</span>
                    <button
                      onClick={() => setSetupData(null)}
                      className="text-xs text-[#7A8A83] hover:text-[#141A17] cursor-pointer"
                    >
                      Cancel Setup
                    </button>
                  </div>

                  {/* Step 1: Scan / Enter Key */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Visual QR Representation */}
                    <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] text-center">
                      <div className="w-36 h-36 bg-white p-2.5 rounded-xl border border-[#DDD5C9] shadow-xs flex items-center justify-center relative group">
                        {/* Clean SVG Matrix graphic representing TOTP barcode */}
                        <svg className="w-full h-full text-[#14231C]" viewBox="0 0 100 100" fill="currentColor">
                          <rect x="5" y="5" width="25" height="25" fill="#14231C" />
                          <rect x="10" y="10" width="15" height="15" fill="#FFFFFF" />
                          <rect x="14" y="14" width="7" height="7" fill="#14231C" />
                          <rect x="70" y="5" width="25" height="25" fill="#14231C" />
                          <rect x="75" y="10" width="15" height="15" fill="#FFFFFF" />
                          <rect x="79" y="14" width="7" height="7" fill="#14231C" />
                          <rect x="5" y="70" width="25" height="25" fill="#14231C" />
                          <rect x="10" y="75" width="15" height="15" fill="#FFFFFF" />
                          <rect x="14" y="79" width="7" height="7" fill="#14231C" />
                          {/* Inner Data Cells */}
                          <rect x="35" y="10" width="8" height="8" />
                          <rect x="50" y="15" width="8" height="8" />
                          <rect x="35" y="25" width="8" height="8" />
                          <rect x="45" y="35" width="12" height="12" />
                          <rect x="15" y="45" width="8" height="8" />
                          <rect x="25" y="50" width="8" height="8" />
                          <rect x="65" y="45" width="8" height="8" />
                          <rect x="80" y="55" width="8" height="8" />
                          <rect x="40" y="65" width="8" height="8" />
                          <rect x="55" y="75" width="8" height="8" />
                          <rect x="70" y="75" width="8" height="8" />
                          <rect x="80" y="80" width="8" height="8" />
                        </svg>
                        <div className="absolute inset-0 bg-[#14231C]/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                          <span className="text-[10px] bg-white text-[#14231C] px-2 py-1 rounded shadow-xs font-bold">Standard RFC 6238</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#6A7872] mt-2.5">
                        Scan with Google Authenticator, Microsoft Authenticator, Authy, or 1Password.
                      </p>
                    </div>

                    {/* Manual Secret Key */}
                    <div className="space-y-3 flex flex-col justify-center">
                      <label className="text-xs font-bold text-[#141A17]">Or enter key manually:</label>
                      <div className="p-3 bg-[#FAF8F5] border border-[#E8E1D5] rounded-xl flex items-center justify-between gap-2">
                        <code className="text-xs font-mono font-bold text-[#2D4A3E] tracking-wider break-all">
                          {setupData.secret}
                        </code>
                        <button
                          type="button"
                          onClick={handleCopyKey}
                          className="p-1.5 rounded-lg bg-white border border-[#DDD5C9] text-[#2D4A3E] hover:bg-[#F2ECE4] cursor-pointer shadow-2xs shrink-0"
                          title="Copy Base32 Key"
                        >
                          {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-[10.5px] text-[#7A8A83] leading-relaxed">
                        Account Name: <span className="font-semibold text-[#141A17]">{currentUser?.email}</span><br />
                        Key Type: <span className="font-semibold text-[#141A17]">Time-based (30s window)</span>
                      </p>
                    </div>

                  </div>

                  {/* Step 2: Emergency Recovery Codes Vault */}
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-[#C88A58]" />
                        <span className="text-xs font-bold text-[#141A17]">Emergency Recovery Backup Codes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCopyBackupCodes}
                          className="px-2.5 py-1 rounded-lg bg-white border border-[#DDD5C9] text-[10.5px] font-bold text-[#2D4A3E] hover:bg-[#F2ECE4] cursor-pointer shadow-2xs flex items-center gap-1"
                        >
                          {copiedCodes ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCodes ? 'Copied' : 'Copy All'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleDownloadBackupCodes}
                          className="px-2.5 py-1 rounded-lg bg-white border border-[#DDD5C9] text-[10.5px] font-bold text-[#2D4A3E] hover:bg-[#F2ECE4] cursor-pointer shadow-2xs flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>Save .txt</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                      {setupData.backupCodes?.map((code, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-white border border-[#E2DAD0] text-center font-mono text-xs font-bold text-[#141A17]">
                          {code}
                        </div>
                      ))}
                    </div>
                    <p className="text-[10.5px] text-[#7A8A83]">
                      ⚠️ Store these codes in a password manager. Each code can be used exactly once if you lose your phone.
                    </p>
                  </div>

                  {/* Step 3: Enter Verification Code */}
                  <form onSubmit={handleVerifyAndEnable} className="p-4 rounded-2xl bg-white border border-[#E8E1D5] space-y-3">
                    <label className="text-xs font-bold text-[#141A17] block">
                      Verify Code to Complete Activation:
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        maxLength={6}
                        value={totpCode}
                        onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="000000"
                        className="w-40 bg-[#FAF8F5] border border-[#E4DCD0] rounded-xl px-4 py-2 text-center text-base font-mono font-bold text-[#141A17] tracking-widest focus:outline-hidden focus:border-[#2D4A3E] focus:bg-white focus:ring-1 focus:ring-[#2D4A3E]"
                      />
                      <button
                        type="submit"
                        disabled={loading || totpCode.length !== 6}
                        className="px-5 py-2.5 rounded-xl bg-[#2D4A3E] hover:bg-[#1E332A] text-white text-xs font-bold transition-all shadow-xs enabled:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                        <span>Verify & Activate 2FA</span>
                      </button>
                    </div>
                  </form>

                </div>
              )}

              {/* DISABLE 2FA FORM */}
              {isDisabling && twoFactorActive && (
                <form onSubmit={handleDisable2FA} className="p-5 rounded-2xl bg-white border border-red-200 space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-2 text-red-800">
                    <ShieldAlert className="w-4 h-4" />
                    <span className="text-xs font-bold">Disable Two-Factor Authentication</span>
                  </div>
                  <p className="text-xs text-[#6A7872]">
                    To confirm this sensitive change, please enter your current account password and live authenticator code.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#141A17] block mb-1">Current Password</label>
                      <input
                        type="password"
                        value={disablePassword}
                        onChange={(e) => setDisablePassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#FAF8F5] border border-[#E4DCD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E] focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#141A17] block mb-1">6-Digit 2FA Code</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={disableTotpCode}
                        onChange={(e) => setDisableTotpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="000000"
                        className="w-full bg-[#FAF8F5] border border-[#E4DCD0] rounded-xl px-3 py-2 text-center text-xs font-mono font-bold tracking-widest text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsDisabling(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-[#6D7D76] hover:bg-[#F2ECE4] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !disablePassword || disableTotpCode.length !== 6}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs enabled:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Disabling...' : 'Confirm Disable 2FA'}
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

          {/* TAB 2: PASSWORD ROTATION & POLICY */}
          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword} className="space-y-5">
              
              <div className="p-4 rounded-2xl bg-white border border-[#E8E1D5] space-y-3.5">
                <span className="text-xs font-bold text-[#141A17] block">Password Security Policy</span>
                <p className="text-xs text-[#6A7872]">
                  Urban Furniture ERP complies with OWASP enterprise standards. Changing your password immediately revokes all existing session tokens across all devices.
                </p>

                {/* Input Fields */}
                <div className="space-y-3 pt-1">
                  
                  {/* Current Password */}
                  <div>
                    <label className="text-xs font-bold text-[#141A17] block mb-1">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full bg-[#FAF8F5] border border-[#E4DCD0] rounded-xl pl-3 pr-10 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E] focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A8A83] hover:text-[#141A17] cursor-pointer"
                      >
                        {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="text-xs font-bold text-[#141A17] block mb-1">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full bg-[#FAF8F5] border border-[#E4DCD0] rounded-xl pl-3 pr-10 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E] focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A8A83] hover:text-[#141A17] cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="text-xs font-bold text-[#141A17] block mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full bg-[#FAF8F5] border border-[#E4DCD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E] focus:bg-white"
                    />
                  </div>

                </div>

                {/* Real-Time OWASP Complexity Chips */}
                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E1D5] space-y-2 text-left">
                  <span className="text-[11px] font-bold text-[#141A17] block">Required Complexity Checklist:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-700 font-bold' : 'text-[#7A8A83]'}`}>
                      {hasMinLength ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-[#DDD4C7]" />}
                      <span>At least 8 characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasUpperCase ? 'text-emerald-700 font-bold' : 'text-[#7A8A83]'}`}>
                      {hasUpperCase ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-[#DDD4C7]" />}
                      <span>At least 1 uppercase letter (A-Z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasLowerCase ? 'text-emerald-700 font-bold' : 'text-[#7A8A83]'}`}>
                      {hasLowerCase ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-[#DDD4C7]" />}
                      <span>At least 1 lowercase letter (a-z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasDigit ? 'text-emerald-700 font-bold' : 'text-[#7A8A83]'}`}>
                      {hasDigit ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-[#DDD4C7]" />}
                      <span>At least 1 numeric digit (0-9)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-700 font-bold' : 'text-[#7A8A83]'}`}>
                      {hasSpecial ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-[#DDD4C7]" />}
                      <span>At least 1 special character (!@#$...)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordsMatch ? 'text-emerald-700 font-bold' : 'text-[#7A8A83]'}`}>
                      {passwordsMatch ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-[#DDD4C7]" />}
                      <span>Passwords match</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-[#7A8A83] pt-1">
                    🛡️ Anti-Reuse: You cannot reuse your current or previous 3 passwords.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#6D7D76] hover:bg-[#F2ECE4] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !currentPassword || !isPasswordValid || !passwordsMatch}
                    className="px-5 py-2.5 rounded-xl bg-[#2D4A3E] hover:bg-[#1E332A] text-white text-xs font-bold transition-all shadow-xs enabled:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                    <span>Update Password</span>
                  </button>
                </div>

              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};

export default SecuritySettingsModal;
