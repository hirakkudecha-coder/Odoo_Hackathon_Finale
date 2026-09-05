import React from 'react';

export const AuthTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex items-center justify-between pb-2.5 border-b border-[#EAE4DC] mb-3.5 pr-10 sm:pr-12">
      {/* Segmented Pill Switcher with Geometric Concentric Borders */}
      <div className="inline-flex p-1 bg-[#EFE9E0] rounded-full border border-[#DDD5C9] shadow-2xs">
        <button
          type="button"
          onClick={() => onTabChange('login')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
            activeTab === 'login'
              ? 'bg-[#2D4A3E] text-[#FAF8F5] shadow-sm'
              : 'text-[#5C6963] hover:text-[#1E2623]'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => onTabChange('register')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
            activeTab === 'register'
              ? 'bg-[#2D4A3E] text-[#FAF8F5] shadow-sm'
              : 'text-[#5C6963] hover:text-[#1E2623]'
          }`}
        >
          Register
        </button>
      </div>

      {/* Top Direct Switch Action link */}
      <div className="text-xs text-[#6A7570] truncate">
        {activeTab === 'login' ? (
          <span>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => onTabChange('register')}
              className="font-bold text-[#2D4A3E] hover:underline cursor-pointer ml-0.5"
            >
              Sign up
            </button>
          </span>
        ) : (
          <span>
            Have an account?{' '}
            <button
              type="button"
              onClick={() => onTabChange('login')}
              className="font-bold text-[#2D4A3E] hover:underline cursor-pointer ml-0.5"
            >
              Sign in
            </button>
          </span>
        )}
      </div>
    </div>
  );
};
