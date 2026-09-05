import React, { useState } from 'react';
import { 
  X, 
  User, 
  AtSign, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Crown, 
  FileText, 
  Users, 
  UserPlus, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import oliveChairImg from '../../assets/images/olive_chair.png';

export const CreateUserModal = ({ isOpen = true, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('create');
  const [fullName, setFullName] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('admin');
  const [accountActive, setAccountActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Real-time password criteria validation
  const rules = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[@#$%!^&*]/.test(password),
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName.trim() || !userId.trim() || !email.trim() || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const allRulesPassed = Object.values(rules).every(Boolean);
    if (!allRulesPassed) {
      setErrorMessage('Please ensure your password satisfies all security criteria.');
      return;
    }

    setLoading(true);

    try {
      const newUser = {
        name: fullName.trim(),
        username: userId.trim(),
        email: email.trim(),
        role: selectedRole,
        isActive: accountActive,
        createdAt: new Date().toISOString(),
      };

      // Store in local users list for admin testing
      const existingUsers = JSON.parse(localStorage.getItem('uf_team_users') || '[]');
      existingUsers.push(newUser);
      localStorage.setItem('uf_team_users', JSON.stringify(existingUsers));

      setSuccessMessage(`User "${fullName}" created successfully with ${selectedRole === 'admin' ? 'Admin' : selectedRole === 'accountant' ? 'Accountant' : 'Contact'} privileges!`);
      
      setTimeout(() => {
        setLoading(false);
        if (onSuccess) onSuccess(newUser);
        if (onClose) onClose();
      }, 1200);

    } catch (err) {
      setErrorMessage('Failed to create user. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl bg-[#FAF8F5] rounded-3xl border border-[#E6DFD4] shadow-2xl overflow-hidden flex flex-col md:flex-row my-auto transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 z-30 p-1.5 rounded-full text-[#6A7570] hover:text-[#141A17] bg-[#FAF8F5] hover:bg-[#EAE4DC] border border-[#E6DFD4] shadow-xs transition-colors cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* LEFT BRAND VISUAL PANEL */}
        <div className="w-full md:w-[42%] p-3.5 sm:p-4 shrink-0 flex flex-col">
          <div className="relative w-full h-full min-h-[460px] md:min-h-[560px] bg-[#1E332A] text-[#FAF8F5] overflow-hidden rounded-3xl flex flex-col justify-between p-6 lg:p-7 select-none shadow-xl">
            {/* Background Furniture Image */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={oliveChairImg}
                alt="Urban Furniture Architecture"
                className="w-full h-full object-cover object-center scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#14231C]/90 via-[#1E332A]/75 to-[#14231C]/95 mix-blend-multiply" />
              <div className="absolute inset-0 bg-radial-at-t from-[#2D4A3E]/60 via-transparent to-[#101A15]/90" />
            </div>

            {/* Top Brand Header */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FAF8F5] text-[#1E332A] flex items-center justify-center font-serif font-extrabold text-base shadow-md border border-[#EAE3D8]/40">
                UF
              </div>
              <div>
                <h2 className="font-serif-luxury font-bold text-base text-[#FAF8F5] tracking-tight leading-tight">
                  Urban Furniture
                </h2>
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.2em] text-[#D0DAD4]">
                  ACCOUNTING SYSTEM
                </p>
              </div>
            </div>

            {/* Middle Editorial Text */}
            <div className="relative z-10 my-auto py-4 space-y-3 max-w-sm">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] font-semibold tracking-widest uppercase text-[#FAF8F5]">
                <UserPlus className="w-3.5 h-3.5 text-[#E86034]" />
                <span>BUILD YOUR TEAM</span>
              </div>

              <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#FAF8F5] leading-[1.15] tracking-tight drop-shadow-sm">
                People<br />
                Power<br />
                Better Business.
              </h1>

              <p className="text-xs text-[#D7E2DC] leading-relaxed font-normal">
                Create user accounts, assign the right roles, and keep your business running smoothly together.
              </p>
            </div>

            {/* Bottom Bar */}
            <div className="relative z-10 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-[#C1CEC8]">
              <div className="flex items-center gap-2">
                <button 
                  type="button" 
                  className="w-7 h-7 rounded-full border border-white/30 bg-black/20 hover:bg-white/20 text-[#FAF8F5] flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <span className="w-5 h-1.5 rounded-full bg-[#54B689]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                </div>
                <button 
                  type="button" 
                  className="w-7 h-7 rounded-full border border-white/30 bg-black/20 hover:bg-white/20 text-[#FAF8F5] flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[10.5px] font-medium text-[#D7E2DC]">Manage Access. Grow Together.</span>
            </div>
          </div>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="w-full md:w-[58%] p-5 sm:p-6 lg:p-7 flex flex-col justify-between">
          <form onSubmit={handleCreateUser} className="space-y-3.5">
            {/* Top Switch Tabs */}
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC] pr-8">
              <div className="inline-flex p-1 bg-[#F2EDE6] rounded-xl border border-[#E0D8CE] shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('create')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide bg-[#2D4A3E] text-[#FAF8F5] shadow-xs cursor-default"
                >
                  Create User
                </button>
              </div>
            </div>

            {/* Heading & Subtitle */}
            <div className="text-left space-y-0.5">
              <h3 className="font-serif-luxury text-2xl sm:text-[26px] font-bold text-[#141A17] tracking-tight">
                Create a New User
              </h3>
              <p className="text-xs text-[#6A7570]">
                Add a team member to give them access to the system.
              </p>
            </div>

            {/* Alert Messages */}
            {errorMessage && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs animate-fadeIn">
                <Check className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Row 1: Full Name & User ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1 text-left">
                <label className="block text-[10.5px] font-semibold tracking-wider uppercase text-[#4A5550]">
                  FULL NAME <span className="text-[#E86034]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C9892] absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full bg-white border border-[#DDD5C9] rounded-xl pl-9 pr-3 py-2 text-xs text-[#141A17] placeholder:text-[#9EA8A2] focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="block text-[10.5px] font-semibold tracking-wider uppercase text-[#4A5550]">
                  USER ID <span className="text-[#E86034]">*</span>
                </label>
                <div className="relative">
                  <AtSign className="w-4 h-4 text-[#8C9892] absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="e.g. aaron123"
                    className="w-full bg-white border border-[#DDD5C9] rounded-xl pl-9 pr-3 py-2 text-xs text-[#141A17] placeholder:text-[#9EA8A2] focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E] outline-none"
                  />
                </div>
                <p className="text-[10px] text-[#8C9892]">Unique ID (6–12 characters)</p>
              </div>
            </div>

            {/* Row 2: Email Address */}
            <div className="space-y-1 text-left">
              <label className="block text-[10.5px] font-semibold tracking-wider uppercase text-[#4A5550]">
                EMAIL ADDRESS <span className="text-[#E86034]">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8C9892] absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@urbanfurniture.com"
                  className="w-full bg-white border border-[#DDD5C9] rounded-xl pl-9 pr-3 py-2 text-xs text-[#141A17] placeholder:text-[#9EA8A2] focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E] outline-none"
                />
              </div>
              <p className="text-[10px] text-[#8C9892]">Email must be unique and not already registered</p>
            </div>

            {/* Row 3: Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1 text-left">
                <label className="block text-[10.5px] font-semibold tracking-wider uppercase text-[#4A5550]">
                  PASSWORD <span className="text-[#E86034]">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C9892] absolute left-3 top-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full bg-white border border-[#DDD5C9] rounded-xl pl-9 pr-9 py-2 text-xs text-[#141A17] placeholder:text-[#9EA8A2] focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#8C9892] hover:text-[#2D4A3E] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="block text-[10.5px] font-semibold tracking-wider uppercase text-[#4A5550]">
                  CONFIRM PASSWORD <span className="text-[#E86034]">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C9892] absolute left-3 top-3 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full bg-white border border-[#DDD5C9] rounded-xl pl-9 pr-9 py-2 text-xs text-[#141A17] placeholder:text-[#9EA8A2] focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-[#8C9892] hover:text-[#2D4A3E] cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Security Rules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 text-[10.5px] text-[#6A7570] pt-0.5">
              <div className={`flex items-center gap-1.5 ${rules.length ? 'text-emerald-700 font-medium' : ''}`}>
                <span className={`w-2.5 h-2.5 rounded-full border flex items-center justify-center text-[8px] ${rules.length ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-[#DDD5C9]'}`}>
                  {rules.length ? '✓' : ''}
                </span>
                <span>At least 8 characters</span>
              </div>

              <div className={`flex items-center gap-1.5 ${rules.lowercase ? 'text-emerald-700 font-medium' : ''}`}>
                <span className={`w-2.5 h-2.5 rounded-full border flex items-center justify-center text-[8px] ${rules.lowercase ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-[#DDD5C9]'}`}>
                  {rules.lowercase ? '✓' : ''}
                </span>
                <span>A small letter (a–z)</span>
              </div>

              <div className={`flex items-center gap-1.5 ${rules.uppercase ? 'text-emerald-700 font-medium' : ''}`}>
                <span className={`w-2.5 h-2.5 rounded-full border flex items-center justify-center text-[8px] ${rules.uppercase ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-[#DDD5C9]'}`}>
                  {rules.uppercase ? '✓' : ''}
                </span>
                <span>A capital letter (A–Z)</span>
              </div>

              <div className={`flex items-center gap-1.5 ${rules.number ? 'text-emerald-700 font-medium' : ''}`}>
                <span className={`w-2.5 h-2.5 rounded-full border flex items-center justify-center text-[8px] ${rules.number ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-[#DDD5C9]'}`}>
                  {rules.number ? '✓' : ''}
                </span>
                <span>A number (0–9)</span>
              </div>

              <div className={`flex items-center gap-1.5 sm:col-span-2 ${rules.special ? 'text-emerald-700 font-medium' : ''}`}>
                <span className={`w-2.5 h-2.5 rounded-full border flex items-center justify-center text-[8px] ${rules.special ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-[#DDD5C9]'}`}>
                  {rules.special ? '✓' : ''}
                </span>
                <span>A special character (e.g. @, #, $, %)</span>
              </div>
            </div>

            {/* Row 4: Role Selection */}
            <div className="space-y-1.5 text-left pt-1">
              <label className="block text-[10.5px] font-semibold tracking-wider uppercase text-[#4A5550]">
                ROLE <span className="text-[#E86034]">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Admin Role */}
                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                    selectedRole === 'admin'
                      ? 'bg-[#EBF5F0] border-[#2D4A3E] ring-1 ring-[#2D4A3E]/30 shadow-xs'
                      : 'bg-white border-[#DDD5C9] hover:border-[#B5AAA0]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Crown className="w-4 h-4 text-[#2D4A3E]" />
                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${selectedRole === 'admin' ? 'border-[#2D4A3E] bg-[#2D4A3E]' : 'border-[#DDD5C9]'}`}>
                      {selectedRole === 'admin' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                  </div>
                  <h4 className="text-[11.5px] font-bold text-[#141A17] leading-tight">Admin / Business Owner</h4>
                  <p className="text-[10px] text-[#6A7570] leading-tight mt-1">Full access to all modules and settings.</p>
                </button>

                {/* Accountant Role */}
                <button
                  type="button"
                  onClick={() => setSelectedRole('accountant')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                    selectedRole === 'accountant'
                      ? 'bg-[#EBF5F0] border-[#2D4A3E] ring-1 ring-[#2D4A3E]/30 shadow-xs'
                      : 'bg-white border-[#DDD5C9] hover:border-[#B5AAA0]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <FileText className="w-4 h-4 text-[#2D4A3E]" />
                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${selectedRole === 'accountant' ? 'border-[#2D4A3E] bg-[#2D4A3E]' : 'border-[#DDD5C9]'}`}>
                      {selectedRole === 'accountant' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                  </div>
                  <h4 className="text-[11.5px] font-bold text-[#141A17] leading-tight">Invoicing User / Accountant</h4>
                  <p className="text-[10px] text-[#6A7570] leading-tight mt-1">Access to invoicing, accounting and financial operations.</p>
                </button>

                {/* Contact Role */}
                <button
                  type="button"
                  onClick={() => setSelectedRole('contact')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                    selectedRole === 'contact'
                      ? 'bg-[#EBF5F0] border-[#2D4A3E] ring-1 ring-[#2D4A3E]/30 shadow-xs'
                      : 'bg-white border-[#DDD5C9] hover:border-[#B5AAA0]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Users className="w-4 h-4 text-[#2D4A3E]" />
                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${selectedRole === 'contact' ? 'border-[#2D4A3E] bg-[#2D4A3E]' : 'border-[#DDD5C9]'}`}>
                      {selectedRole === 'contact' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                  </div>
                  <h4 className="text-[11.5px] font-bold text-[#141A17] leading-tight">Contact</h4>
                  <p className="text-[10px] text-[#6A7570] leading-tight mt-1">Can only view their own invoices/bills and make payments.</p>
                </button>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="pt-2 border-t border-[#EAE4DC] flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Account Status Switch */}
              <div className="flex items-center gap-2.5 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setAccountActive(!accountActive)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    accountActive ? 'bg-[#2D4A3E]' : 'bg-[#DDD5C9]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      accountActive ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold uppercase text-[#4A5550]">ACCOUNT STATUS</span>
                    <span className="text-[10.5px] font-semibold text-[#2D4A3E]">{accountActive ? 'Active' : 'Inactive'}</span>
                  </div>
                  <p className="text-[9.5px] text-[#8C9892]">User will be able to log in to the system.</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-white hover:bg-[#F4EFEA] border border-[#DDD5C9] rounded-xl text-xs font-semibold text-[#55635D] transition-all cursor-pointer shadow-2xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-[#2D4A3E] hover:bg-[#1E332A] text-[#FAF8F5] rounded-xl text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{loading ? 'Creating User...' : 'Create User'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
