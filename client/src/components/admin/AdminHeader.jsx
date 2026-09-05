import React, { useState, useEffect } from 'react';
import { Search, Bell, Calendar, ChevronDown, User, ExternalLink, Menu, Wifi, WifiOff } from 'lucide-react';
import designerPortrait from '../../assets/images/designer_portrait.png';

export const AdminHeader = ({ onNavigateHome, onToggleSidebar, sidebarOpen, currentUser, onLogout }) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  // Read stored user as fallback
  const storedUser = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, []);

  const activeUser = currentUser || storedUser;
  const userName = activeUser?.name || 'Nikita Sharma';
  const userRole = activeUser?.fullRole || (activeUser?.role === 'admin' ? 'Admin / Business Owner' : activeUser?.role || 'Admin / Business Owner');
  const userEmail = activeUser?.email || 'admin@urbanfurniture.com';

  const initials = userName
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'NS';

  // Dynamically format current date (e.g. Sat, 05 Sep 2026)
  const formattedDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const [heartbeat, setHeartbeat] = useState({ status: 'checking', dbConnected: false, uptime: '' });
  const [user, setUser] = useState({ name: 'Admin User', role: 'Admin' });

  useEffect(() => {
    // Load logged-in user info from localStorage
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUser({ name: u.name || 'Admin User', role: u.role || 'Admin' });
      } catch (_) {}
    }

    // Fetch server heartbeat
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
    const interval = setInterval(fetchHeartbeat, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[#FAF8F5] border-b border-[#E8E1D5] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 select-none sticky top-0 z-30 shadow-2xs shrink-0">
      
      {/* Left: Hamburger & Search Input & Brand if Collapsed */}
      <div className="flex items-center gap-3.5 w-full md:w-auto">
        
        {/* Hamburger Toggle Button with refined styling */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl bg-white border border-[#E4DCD0] text-[#14231C] hover:text-[#2D4A3E] hover:bg-[#F2ECE3] active:scale-95 transition-all cursor-pointer shadow-2xs shrink-0 flex items-center justify-center group"
          aria-label="Toggle Navigation Sidebar"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5 text-[#14231C] group-hover:text-[#2D4A3E]" />
        </button>

        {/* Search Input matching reference */}
        <div className="relative w-full md:w-80 lg:w-96 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8881]" />
          <input
            type="text"
            placeholder="Search anything (e.g. invoice, product, contact...)"
            className="w-full bg-white border border-[#E4DCD0] rounded-xl pl-10 pr-16 py-2 text-xs text-[#141A17] placeholder-[#8A9791] focus:outline-hidden focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E] shadow-2xs transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-[#F0EAE1] text-[10px] font-mono text-[#5F6B65] border border-[#DDD4C7] hidden sm:block">
            Ctrl K
          </div>
        </div>
      </div>

      {/* Right User & Actions Module */}
      <div className="flex items-center gap-5 w-full md:w-auto justify-end">
        
        {/* Notification Bell */}
        <button 
          className="relative p-2 rounded-xl bg-white border border-[#E6DFD4] text-[#4A5550] hover:text-[#1A2420] hover:bg-[#F5EFE6] transition-colors cursor-pointer shadow-2xs"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E86034] ring-2 ring-white"></span>
        </button>

        {/* User Profile matching reference */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-3 pl-2 border-l border-[#E2DAD0] cursor-pointer hover:opacity-90 transition-opacity text-left group"
          >
            <div className="w-9 h-9 rounded-full bg-[#1C3A2F] text-[#FAF8F5] font-bold text-xs flex items-center justify-center border border-[#D5CBBF] shrink-0 shadow-2xs overflow-hidden">
              {userName === 'Nikita Sharma' ? (
                <img 
                  src={designerPortrait} 
                  alt={userName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
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
                      window.location.href = '/login';
                    }
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#DC2626] hover:bg-[#FEE2E2]/50 transition-colors cursor-pointer text-left font-semibold"
                >
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

    </header>
  );
};

export default AdminHeader;
