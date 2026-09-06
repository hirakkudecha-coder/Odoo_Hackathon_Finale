import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  Bell, 
  Calendar, 
  ChevronDown, 
  ExternalLink, 
  Menu, 
  ShieldCheck, 
  LogOut,
  Sparkles
} from 'lucide-react';
import designerPortrait from '../../assets/images/designer_portrait.png';
import { SecuritySettingsModal } from '../common/SecuritySettingsModal';

export const AccountantHeader = ({ onToggleSidebar, onNavigateHome, currentUser, onLogout }) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [heartbeat, setHeartbeat] = useState({ status: 'checking', dbConnected: false, uptime: '' });

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const storedUser = useMemo(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, []);

  const activeUser = currentUser || storedUser;
  const userName = activeUser?.name || 'Aarav Mehta';
  const userRole = activeUser?.role || 'Head Accountant';
  const userEmail = activeUser?.email || 'accountant@urbanfurniture.com';

  const initials = userName
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'AM';

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

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Invoice INV-2026-002 Settled', time: '10m ago', unread: true },
    { id: 2, title: 'Vendor Bill BILL-2026-002 Due Soon', time: '1h ago', unread: true },
    { id: 3, title: 'Q2 GST Reconciliation Ready', time: '3h ago', unread: false },
  ]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header className="bg-[#FAF8F5] border-b border-[#E8E1D5] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 select-none sticky top-0 z-30 shadow-2xs shrink-0">
      
      {/* Left Section: Hamburger & Search Input (Admin Style) */}
      <div className="flex items-center gap-3.5 w-full md:w-auto">
        
        {/* Hamburger Toggle Button matching Admin style */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl bg-white border border-[#E4DCD0] text-[#14231C] hover:text-[#2D4A3E] hover:bg-[#F2ECE3] active:scale-95 transition-all cursor-pointer shadow-2xs shrink-0 flex items-center justify-center group"
          aria-label="Toggle Navigation Sidebar"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5 text-[#14231C] group-hover:text-[#2D4A3E]" />
        </button>

        {/* Search Input matching Admin style */}
        <div className="relative w-full md:w-80 lg:w-96 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8881]" />
          <input
            type="text"
            placeholder="Search invoices, bills, contacts, products..."
            className="w-full bg-white border border-[#E4DCD0] rounded-xl pl-10 pr-16 py-2 text-xs text-[#141A17] placeholder:text-[#8A9791] focus:outline-hidden focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E] shadow-2xs transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-[#F0EAE1] text-[10px] font-mono text-[#5F6B65] border border-[#DDD4C7] hidden sm:block">
            Ctrl K
          </div>
        </div>
      </div>

      {/* Right User & Actions Module (Admin Style) */}
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

        {/* Notification Bell with Red Dot & Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl bg-white border border-[#E6DFD4] text-[#4A5550] hover:text-[#1A2420] hover:bg-[#F5EFE6] transition-colors cursor-pointer shadow-2xs"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E86034] ring-2 ring-white" />
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl border border-[#E8E1D5] shadow-xl p-3 z-50 animate-fadeIn text-left">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F0EAE1]">
                <span className="text-xs font-bold text-[#141A17] font-serif">Accounting Alerts</span>
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-[10px] text-[#1C3A2F] font-semibold cursor-pointer hover:underline"
                >
                  Mark all read
                </button>
              </div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div 
                    key={n.id} 
                    onClick={() => setNotifications((prev) => prev.map((item) => item.id === n.id ? { ...item, unread: false } : item))}
                    className={`p-2 rounded-xl text-xs transition-colors cursor-pointer ${n.unread ? 'bg-[#FAF7F2] font-semibold text-[#141A17]' : 'text-[#5B6963] hover:bg-[#FAF8F5]'}`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="truncate">{n.title}</span>
                      <span className="text-[9.5px] text-[#8A9B93] shrink-0">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Matching Admin Reference */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-3 pl-2 border-l border-[#E2DAD0] cursor-pointer hover:opacity-90 transition-opacity text-left group"
          >
            <div className="w-9 h-9 rounded-full bg-[#1C3A2F] text-[#FAF8F5] font-bold text-xs flex items-center justify-center border border-[#D5CBBF] shrink-0 shadow-2xs overflow-hidden">
              <img 
                src={designerPortrait} 
                alt={userName} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-[#141A17] leading-none group-hover:text-[#2D4A3E] transition-colors">
                {userName}
              </p>
              <p className="text-[10px] text-[#717E78] font-medium mt-0.5">
                {userRole}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#7A8881] hidden sm:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#E8E1D5] shadow-xl p-3 z-50 animate-fadeIn text-left">
              <div className="pb-2.5 mb-2.5 border-b border-[#F0EAE1]">
                <p className="text-xs font-bold text-[#141A17]">{userName}</p>
                <p className="text-[10px] text-[#717E78] truncate">{userEmail}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-[#E5F7ED] text-[#1E7445] text-[9.5px] font-bold">
                  {userRole}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    setSecurityModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#2D4A3E] hover:bg-[#FAF8F5] transition-colors cursor-pointer text-left font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C88A58]" />
                  <span>Security & 2FA Settings</span>
                </button>

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    if (onNavigateHome) onNavigateHome();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#4A5550] hover:bg-[#FAF8F5] hover:text-[#141A17] transition-colors cursor-pointer text-left font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Public Storefront</span>
                </button>

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    if (onLogout) {
                      onLogout();
                    } else {
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      window.history.pushState(null, '', '/login');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#DC2626] hover:bg-[#FEE2E2]/50 transition-colors cursor-pointer text-left font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
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
        currentUser={activeUser}
      />

    </header>
  );
};

export default AccountantHeader;
