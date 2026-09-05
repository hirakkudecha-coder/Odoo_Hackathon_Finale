import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Menu, 
  X, 
  LogOut, 
  ExternalLink, 
  ShieldCheck, 
  FileSpreadsheet, 
  Sparkles,
  Command,
  Building2
} from 'lucide-react';

export const SuperAdminHeader = ({ 
  onNavigateHome, 
  onNavigateAdmin,
  onNavigateAccountant,
  onToggleSidebar, 
  sidebarOpen,
  currentUser,
  onLogout,
  onOpenSearch
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  // Close menus when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: 'New Organization Registered', sub: 'Urban Roots created an account', time: '2h ago', unread: true },
    { id: 2, title: 'Subscription Alert', sub: 'The Decor Co. plan expiring in 7 days', time: '5h ago', unread: true },
    { id: 3, title: 'High Volume Transactions', sub: 'Elegant Homes crossed ₹10L monthly volume', time: '1d ago', unread: false },
    { id: 4, title: 'Database Backup Completed', sub: 'Daily automated snapshot stored safely', time: '1d ago', unread: false },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-[#E8E1D5] px-4 sm:px-6 py-3 shrink-0 sticky top-0 z-30 flex items-center justify-between gap-4">
      {/* Left Area: Sidebar Toggle & Search Bar */}
      <div className="flex items-center gap-3.5 flex-1 max-w-2xl">
        {/* Sidebar Toggle Button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-[#3A4A42] hover:text-[#141A17] hover:bg-[#F2EDE4] transition-colors cursor-pointer border border-[#E8E1D5]/60 shadow-2xs"
          aria-label="Toggle Sidebar"
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <Menu className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Global Super Search Bar with Ctrl+K shortcut */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9892]" />
          <input
            type="text"
            placeholder="Search anything (organizations, users, reports...)"
            onClick={onOpenSearch}
            className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-2xl pl-10 pr-16 py-2 text-xs text-[#141A17] placeholder-[#8C9892] focus:outline-hidden focus:border-[#2D4A3E] focus:bg-white focus:ring-1 focus:ring-[#2D4A3E] transition-all shadow-2xs"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-[#ECE5DB] border border-[#DDD4C7] text-[10px] font-mono font-bold text-[#6D7D76]">
            <span>Ctrl K</span>
          </div>
        </div>
      </div>

      {/* Right Area: Notifications & Super Admin Profile Capsule */}
      <div className="flex items-center gap-3 shrink-0">
        
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2.5 rounded-2xl bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-[#E5DDD0] text-[#3D4B44] transition-colors relative cursor-pointer shadow-2xs"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#E86034] text-[9px] font-bold text-white flex items-center justify-center border-2 border-white animate-pulse">
              8
            </span>
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-90 bg-white rounded-2xl shadow-xl border border-[#E8E1D5] py-2 z-50 animate-fadeIn">
              <div className="px-4 py-2 border-b border-[#F0EAE1] flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-[#141A17]">System Notifications</span>
                <span className="text-[10px] bg-[#2D4A3E]/10 text-[#2D4A3E] px-2 py-0.5 rounded-full font-bold">8 New</span>
              </div>
              <div className="divide-y divide-[#F5EFE8] max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-3 text-left hover:bg-[#FAF8F5] transition-colors cursor-pointer ${n.unread ? 'bg-[#FAF7F2]' : ''}`}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-[#141A17]">{n.title}</p>
                      <span className="text-[10px] text-[#8C9892] shrink-0 font-numeric">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#606E67] mt-0.5">{n.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Super Admin Profile Capsule */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1 sm:pr-3 rounded-2xl border border-[#E2DAD0] bg-[#FAF8F5] hover:bg-[#F2EDE4] transition-all cursor-pointer shadow-2xs"
          >
            {/* Avatar with SA initials */}
            <div className="w-9 h-9 rounded-xl bg-[#14231C] text-[#FAF8F5] font-serif font-bold text-xs flex items-center justify-center shadow-xs border border-[#274438]">
              SA
            </div>

            {/* Name & Administrator label */}
            <div className="text-left hidden md:block">
              <div className="text-xs font-bold text-[#141A17] leading-tight">
                Super Admin
              </div>
              <div className="text-[10.5px] text-[#6A7872] leading-tight font-medium">
                Administrator
              </div>
            </div>

            <ChevronDown className={`w-3.5 h-3.5 text-[#6A7872] transition-transform duration-200 hidden sm:block ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile & Switch Menu Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E8E1D5] py-2 z-50 animate-fadeIn text-left">
              <div className="px-4 py-2.5 border-b border-[#F0EAE1]">
                <p className="text-xs font-bold text-[#141A17]">Super Admin Control</p>
                <p className="text-[10.5px] text-[#7A8A83] truncate">{currentUser?.email || 'superadmin@urbanfurniture.com'}</p>
              </div>

              <div className="py-1">
                {onNavigateAdmin && (
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onNavigateAdmin();
                    }}
                    className="w-full px-4 py-2 text-xs font-semibold text-[#2D4A3E] hover:bg-[#FAF8F5] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#2D4A3E]" />
                    <span>Switch to Business Admin</span>
                  </button>
                )}

                {onNavigateAccountant && (
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onNavigateAccountant();
                    }}
                    className="w-full px-4 py-2 text-xs font-semibold text-[#2D4A3E] hover:bg-[#FAF8F5] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-[#2D4A3E]" />
                    <span>Switch to Accountant</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    if (onNavigateHome) onNavigateHome();
                  }}
                  className="w-full px-4 py-2 text-xs font-semibold text-[#4B5953] hover:bg-[#FAF8F5] flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-[#7A8A83]" />
                  <span>View Public Storefront</span>
                </button>
              </div>

              <div className="border-t border-[#F0EAE1] pt-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full px-4 py-2 text-xs font-semibold text-[#DC2626] hover:bg-[#FEE2E2]/60 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default SuperAdminHeader;
