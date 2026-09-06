import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { BrandPanel } from './BrandPanel';
import { AuthTabs } from './AuthTabs';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';

export const AuthLayout = ({ initialMode = 'login', onNavigateHome, onSuccess }) => {
  const [activeTab, setActiveTab] = useState(
    initialMode === 'register' || initialMode === 'signup' 
      ? 'register' 
      : initialMode === 'forgot-password' 
      ? 'forgot-password' 
      : 'login'
  );

  useEffect(() => {
    setActiveTab(
      initialMode === 'register' || initialMode === 'signup' 
        ? 'register' 
        : initialMode === 'forgot-password' 
        ? 'forgot-password' 
        : 'login'
    );
  }, [initialMode]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const targetPath = tab === 'login' ? '/login' : tab === 'register' ? '/register' : '/forgot-password';
    window.history.pushState(null, '', targetPath);
  };

  const handleBackHome = (e) => {
    if (e) e.preventDefault();
    window.history.pushState(null, '', '/');
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] flex flex-col md:flex-row items-stretch selection:bg-[#2D4A3E] selection:text-[#FAF8F5] p-3 sm:p-4 lg:p-5 gap-4 sm:gap-5">
      {/* Left Visual Brand Panel - 50% Split */}
      <div className="w-full md:w-1/2 flex flex-col min-h-64 sm:min-h-80 md:min-h-125">
        <BrandPanel />
      </div>

      {/* Right Authentication Section - 50% Split (Symmetrically Framed, Zero Floating Voids) */}
      <div className="w-full md:w-1/2 bg-white rounded-3xl border border-[#E6DFD4] shadow-sm p-6 sm:p-8 lg:p-10 flex flex-col justify-between min-h-auto md:min-h-125">
        {/* Top: Back to Home link */}
        <div className="flex items-center justify-between pb-1">
          <button
            type="button"
            onClick={handleBackHome}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#55635D] hover:text-[#1E2623] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto my-auto py-2">
          {/* Top Segmented Tabs & Switch link */}
          {activeTab !== 'forgot-password' && (
            <AuthTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          )}

          {/* Render Form with Smooth Entrance */}
          <div className="transition-all duration-300">
            {activeTab === 'login' ? (
              <div className="animate-fadeIn w-full">
                <LoginForm
                  onSuccess={onSuccess}
                  onSwitchToRegister={() => handleTabChange('register')}
                  onSwitchToForgotPassword={() => handleTabChange('forgot-password')}
                />
              </div>
            ) : activeTab === 'register' ? (
              <div className="animate-fadeIn w-full">
                <RegisterForm
                  onSuccess={onSuccess}
                  onSwitchToLogin={() => handleTabChange('login')}
                />
              </div>
            ) : (
              <div className="animate-fadeIn w-full">
                <ForgotPasswordForm
                  onSwitchToLogin={() => handleTabChange('login')}
                />
              </div>
            )}
          </div>
        </div>

        {/* Security Footer */}
        <div className="pt-3 border-t border-[#EAE4DC] flex items-center justify-between text-[10.5px] text-[#7A8881] w-full">
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

export default AuthLayout;
