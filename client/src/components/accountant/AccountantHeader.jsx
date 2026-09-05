import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import designerPortrait from '../../assets/images/designer_portrait.png';

export const AccountantHeader = ({ onToggleSidebar, onNavigateHome, currentUser, onLogout }) => {
  const storedUser = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, []);

  const activeUser = currentUser || storedUser;
  const userName = activeUser?.name || 'Aarav Mehta';
  const userRole = activeUser?.fullRole || (activeUser?.role === 'accountant' ? 'Invoicing User / Accountant' : activeUser?.role || 'Invoicing User / Accountant');

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#2D4A3E]/10 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left Section: Mobile Menu Toggle & Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-[#2D4A3E] hover:bg-[#EAE4DC] transition-colors cursor-pointer border border-[#2D4A3E]/15"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Box */}
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#758A80]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search invoices, bills, contacts, products..."
              className="w-full pl-10 pr-14 py-2 bg-white/80 hover:bg-white focus:bg-white text-xs text-[#141A17] placeholder-[#758A80] rounded-xl border border-[#2D4A3E]/15 focus:outline-hidden focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E] transition-all shadow-2xs"
            />
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
              <span className="px-1.5 py-0.5 text-[10px] font-semibold text-[#758A80] bg-[#F2ECE4] rounded border border-[#2D4A3E]/15">
                Ctrl K
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Notification & User Profile */}
        <div className="flex items-center gap-4 shrink-0">
          
          {/* Notification Icon with Red Dot */}
          <button 
            type="button"
            className="relative p-2 text-[#2D4A3E] hover:bg-[#EAE4DC]/70 rounded-full transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D9534F] rounded-full ring-2 ring-[#FAF8F5]" />
          </button>

          {/* Vertical Divider */}
          <div className="h-7 w-px bg-[#2D4A3E]/15" />

          {/* User Profile Card */}
          <div className="flex items-center gap-2.5 pl-1 select-none">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#2D4A3E]/20 shadow-2xs bg-[#EAE4DC] flex items-center justify-center shrink-0">
              <img 
                src={designerPortrait} 
                alt={userName} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
                }}
              />
            </div>
            
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-[#141A17] leading-tight">
                {userName}
              </span>
              <span className="text-[10.5px] font-medium text-[#687C72] leading-tight mt-0.5">
                {userRole}
              </span>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="ml-2 text-[10.5px] font-bold text-[#DC2626] hover:underline cursor-pointer"
                title="Sign Out"
              >
                Sign Out
              </button>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

export default AccountantHeader;
