import React, { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { BrandPanel } from './BrandPanel';
import { AuthTabs } from './AuthTabs';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export const AuthContainer = ({
  initialMode = 'login',
  onClose,
  onSuccess,
  isModal = false,
}) => {
  const [activeTab, setActiveTab] = useState(initialMode === 'register' || initialMode === 'signup' ? 'register' : 'login');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="relative w-full max-w-4xl bg-[#FAF8F5] rounded-3xl border border-[#E6DFD4] shadow-2xl overflow-hidden flex flex-col md:flex-row md:min-h-[460px] transition-none">
      {/* Close Button if rendered inside a modal */}
      {isModal && onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 z-30 p-1.5 rounded-full text-[#6A7570] hover:text-[#141A17] bg-[#FAF8F5] hover:bg-[#EAE4DC] border border-[#E6DFD4] shadow-xs transition-colors cursor-pointer"
          aria-label="Close Authentication Modal"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Left Visual Brand Panel - Fixed 50% split width */}
      <div className="w-full md:w-1/2 md:basis-1/2 p-3 sm:p-3.5 shrink-0 flex h-full">
        <BrandPanel />
      </div>

      {/* Right Authentication Form Container - Fixed 50% split width & snug padding */}
      <div className="w-full md:w-1/2 md:basis-1/2 p-5 sm:p-6 lg:p-7 pb-4 flex flex-col justify-between h-full shrink-0">
        <div className="flex-1 flex flex-col">
          {/* Top Segmented Tabs & Quick Switch */}
          <AuthTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          {/* Mode Switch with Compact Natural Height */}
          <div className="flex-1 flex flex-col justify-center">
            {activeTab === 'login' ? (
              <div className="animate-fadeIn w-full">
                <LoginForm
                  onSuccess={onSuccess}
                  onSwitchToRegister={() => setActiveTab('register')}
                />
              </div>
            ) : (
              <div className="animate-fadeIn w-full">
                <RegisterForm
                  onSuccess={onSuccess}
                  onSwitchToLogin={() => setActiveTab('login')}
                />
              </div>
            )}
          </div>
        </div>

        {/* Security & Ledger Compliance Footer */}
        <div className="mt-3 pt-2.5 pb-0.5 border-t border-[#EAE4DC] flex items-center justify-between text-[10px] text-[#7A8881]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Double-Entry Accounting & Ledger Security</span>
          </div>
          <span>v2.4 Enterprise</span>
        </div>
      </div>
    </div>
  );
};
