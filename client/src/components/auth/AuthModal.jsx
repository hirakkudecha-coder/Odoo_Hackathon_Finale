import React, { useState } from 'react';
import { X, Lock, Mail, User, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-md rounded-3xl bg-[#FAF8F5] p-8 border border-[#E6DFD4] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#6A7570] hover:text-[#141A17] hover:bg-[#EAE4DC] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#2D4A3E] text-[#FAF8F5] flex items-center justify-center font-serif font-bold text-xl mx-auto shadow-sm">
            UF
          </div>
          <h3 className="font-serif-luxury font-bold text-2xl text-[#141A17]">
            {mode === 'login' ? 'Welcome to Urban Furniture' : 'Create Business Account'}
          </h3>
          <p className="text-xs text-[#55635D]">
            {mode === 'login' 
              ? 'Enter your credentials to access the accounting workspace.'
              : 'Start your unified furniture accounting management.'}
          </p>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif font-bold text-lg text-[#141A17]">
              {mode === 'login' ? 'Authentication Verified' : 'Account Ready'}
            </h4>
            <p className="text-xs text-[#55635D]">
              Connecting to Urban Furniture accounting ledger...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A5550] mb-1">
                  Full Name / Studio Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C9892] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Atelier Living Designs"
                    className="w-full bg-white border border-[#DDD5C9] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A5550] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8C9892] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@urbanfurniture.com"
                  className="w-full bg-white border border-[#DDD5C9] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A5550] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8C9892] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white border border-[#DDD5C9] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#2D4A3E] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#1E332A] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{mode === 'login' ? 'Sign In to Workspace' : 'Create New Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Switch Mode */}
            <div className="text-center pt-3 border-t border-[#EAE3D8] text-xs text-[#55635D]">
              {mode === 'login' ? (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="font-bold text-[#2D4A3E] hover:underline cursor-pointer"
                  >
                    Get Started
                  </button>
                </span>
              ) : (
                <span>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="font-bold text-[#2D4A3E] hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </span>
              )}
            </div>

          </form>
        )}

        <div className="mt-4 pt-3 text-center text-[10px] text-[#78857F] flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Double-Entry Accounting & 256-Bit Ledger Security</span>
        </div>

      </div>
    </div>
  );
};
