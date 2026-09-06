import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Calendar,
  ChevronDown, 
  Menu, 
  LogOut, 
  ExternalLink, 
  ShieldCheck, 
  FileSpreadsheet
} from 'lucide-react';
import { SecuritySettingsModal } from '../common/SecuritySettingsModal';

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
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [heartbeat, setHeartbeat] = useState({ status: 'checking', dbConnected: false, uptime: '' });

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

  // Dynamically format current date
  const formattedDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  // Fetch server heartbeat telemetry
  useEffect(() => {
    const fetchHeartbeat = async () => {
      try {
        const res = await fetch('/api/health/heartbeat');
        if (res.ok) {
          const data = await res.json();
          const hb = data.heartbeat || {};
          const upSec = hb.uptimeSeconds || 0;
          const h = Math.floor(upSec / 3600);
          const m = Math.floor((upSec % 3600) / 60);
          setHeartbeat({
            status: hb.status === 'ALIVE' ? 'online' : 'offline',
            dbConnected: hb.database?.connected ?? false,
            uptime: `${h}h ${m}m`
          });
        } else {
          setHeartbeat({ status: 'offline', dbConnected: false, uptime: '—' });
        }
      } catch (_) {
        setHeartbeat({ status: 'offline', dbConnected: false, uptime: '—' });
      }
    };

    fetchHeartbeat();
    const interval = setInterval(fetchHeartbeat, 30000);
    return () => clearInterval(interval);
  }, []);

  const notifications = [
    { id: 1, title: 'New Organization Registered', sub: 'Urban Roots created an account', time: '2h ago', unread: true },
    { id: 2, title: 'Subscription Alert', sub: 'The Decor Co. plan expiring in 7 days', time: '5h ago', unread: true },
    { id: 3, title: 'High Volume Transactions', sub: 'Elegant Homes crossed ₹10L monthly volume', time: '1d ago', unread: false },
    { id: 4, title: 'Database Backup Completed', sub: 'Daily automated snapshot stored safely', time: '1d ago', unread: false },
  ];

  return (
    <header className="bg-[#FAF8F5] border-b border-[#E8E1D5] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 select-none sticky top-0 z-30 shadow-2xs shrink-0">
      
      {/* Left Area: Sidebar Toggle & Search Bar (Admin Style) */}
      <div className="flex items-center gap-3.5 w-full md:w-auto">
        
        {/* Sidebar Toggle Button matching Admin style */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl bg-white border border-[#E4DCD0] text-[#14231C] hover:text-[#2D4A3E] hover:bg-[#F2ECE3] active:scale-95 transition-all cursor-pointer shadow-2xs shrink-0 flex items-center justify-center group"
          aria-label="Toggle Navigation Sidebar"
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <Menu className="w-5 h-5 text-[#14231C] group-hover:text-[#2D4A3E]" />
        </button>

        {/* Search Bar matching Admin style */}
        <div className="relative w-full md:w-80 lg:w-96 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8881]" />
          <input
            type="text"
            placeholder="Search anything (organizations, users, reports...)"
            onClick={onOpenSearch}
            className="w-full bg-white border border-[#E4DCD0] rounded-xl pl-10 pr-16 py-2 text-xs text-[#141A17] placeholder:text-[#8A9791] focus:outline-hidden focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E] shadow-2xs transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-[#F0EAE1] text-[10px] font-mono text-[#5F6B65] border border-[#DDD4C7] hidden sm:block">
            Ctrl K
          </div>
        </div>
      </div>

      {/* Right Area: Telemetry, Notifications & Super Admin Profile (Admin Style) */}
      <div className="flex items-center gap-5 w-full md:w-auto justify-end">
        
        {/* Server Status Indicator */}
        <div className="hidden lg:flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#E6DFD4] shadow-2xs text-[11px] text-[#4A5550]">
          {heartbeat.status === 'online' ? (
            <span className="flex items-center gap-1.5 text-[#2D7A4D] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              API Online
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[#9CA3AF]">
              <span className="w-2 h-2 rounded-full bg-[#9CA3AF]" />
              API Standby
            </span>
          )}
        </div>

        {/* Notification Bell matching Admin */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl bg-white border border-[#E6DFD4] text-[#4A5550] hover:text-[#1A2420] hover:bg-[#F5EFE6] transition-colors cursor-pointer shadow-2xs"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E86034] ring-2 ring-white animate-pulse" />
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-90 bg-white rounded-2xl shadow-xl border border-[#E8E1D5] py-2 z-50 animate-fadeIn text-left">
              <div className="px-4 py-2 border-b border-[#F0EAE1] flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-[#141A17]">System Notifications</span>
                <span className="text-[10px] bg-[#2D4A3E]/10 text-[#2D4A3E] px-2 py-0.5 rounded-full font-bold">4 New</span>
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

        {/* Super Admin Profile matching Admin Reference */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 pl-2 border-l border-[#E2DAD0] cursor-pointer hover:opacity-90 transition-opacity text-left group"
          >
            {/* Avatar with SA initials */}
            <div className="w-9 h-9 rounded-full bg-[#1C3A2F] text-[#FAF8F5] font-serif font-bold text-xs flex items-center justify-center border border-[#D5CBBF] shrink-0 shadow-2xs">
              SA
            </div>

            {/* Name & Administrator label */}
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-[#141A17] leading-none group-hover:text-[#2D4A3E] transition-colors">
                Super Admin
              </p>
              <p className="text-[10px] text-[#717E78] font-medium mt-0.5">
                Administrator
              </p>
            </div>

            <ChevronDown className={`w-3.5 h-3.5 text-[#7A8881] transition-transform duration-200 hidden sm:block ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile & Switch Menu Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E8E1D5] py-2 z-50 animate-fadeIn text-left">
              <div className="px-4 py-2.5 border-b border-[#F0EAE1]">
                <p className="text-xs font-bold text-[#141A17]">Super Admin Control</p>
                <p className="text-[10.5px] text-[#7A8A83] truncate">{currentUser?.email || 'superadmin@urbanfurniture.com'}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-[#E5F7ED] text-[#1E7445] text-[9.5px] font-bold">
                  Super Administrator
                </span>
              </div>

              <div className="py-1">
                {onNavigateAdmin && (
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onNavigateAdmin();
                    }}
                    className="w-full px-4 py-2 text-xs font-medium text-[#2D4A3E] hover:bg-[#FAF8F5] flex items-center gap-2 transition-colors cursor-pointer"
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
                    className="w-full px-4 py-2 text-xs font-medium text-[#2D4A3E] hover:bg-[#FAF8F5] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-[#2D4A3E]" />
                    <span>Switch to Accountant</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    setSecurityModalOpen(true);
                  }}
                  className="w-full px-4 py-2 text-xs font-medium text-[#2D4A3E] hover:bg-[#FAF8F5] flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#C88A58]" />
                  <span>Security & 2FA Settings</span>
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    if (onNavigateHome) onNavigateHome();
                  }}
                  className="w-full px-4 py-2 text-xs font-medium text-[#4B5953] hover:bg-[#FAF8F5] hover:text-[#141A17] flex items-center gap-2 transition-colors cursor-pointer"
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

        {/* Productivity & Date Widget Card */}
        <div className="hidden xl:flex items-center gap-3 bg-white px-3.5 py-1.5 rounded-xl border border-[#E6DFD4] shadow-2xs text-left">
          <div className="text-left">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#2D4A3E] uppercase tracking-wider">
              <Calendar className="w-3 h-3 text-[#E86034]" />
              <span>{formattedDate}</span>
            </div>
            <p className="text-[9.5px] text-[#6A7872] leading-tight">
              Make today productive for a better tomorrow.
            </p>
          </div>
        </div>

      </div>

      {/* Security & 2FA Settings Modal */}
      <SecuritySettingsModal
        isOpen={securityModalOpen}
        onClose={() => setSecurityModalOpen(false)}
        currentUser={currentUser}
      />
    </header>
  );
};

export default SuperAdminHeader;
