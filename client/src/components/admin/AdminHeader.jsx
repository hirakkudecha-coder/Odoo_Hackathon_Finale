import React from 'react';
import { Search, Bell, Calendar, ChevronDown, User, ExternalLink, Menu } from 'lucide-react';
import designerPortrait from '../../assets/images/designer_portrait.png';

export const AdminHeader = ({ onNavigateHome, onToggleSidebar }) => {
  return (
    <header className="bg-[#FAF8F5] border-b border-[#E8E1D5] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 select-none sticky top-0 z-30 shadow-2xs shrink-0">
      
      {/* Left: Hamburger Button & Search Input */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* Functional Hamburger Button for Desktop & Mobile Sidebar Toggle */}
        <button
          onClick={onToggleSidebar}
          className="p-2.5 rounded-xl bg-white border border-[#E4DCD0] text-[#14231C] hover:text-[#2D4A3E] hover:bg-[#F2ECE3] active:scale-95 transition-all cursor-pointer shadow-2xs shrink-0 flex items-center justify-center"
          aria-label="Toggle Navigation Sidebar"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5 text-[#14231C]" />
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
        <div className="flex items-center gap-3 pl-2 border-l border-[#E2DAD0]">
          <div className="w-9 h-9 rounded-full bg-[#E5DCD0] overflow-hidden border border-[#D5CBBF] shrink-0">
            <img 
              src={designerPortrait} 
              alt="Nikita Sharma" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-[#141A17] leading-none">
              Nikita Sharma
            </p>
            <p className="text-[10px] text-[#717E78] font-medium mt-0.5">
              Admin / Business Owner
            </p>
          </div>
        </div>

        {/* Productivity & Date Widget Card */}
        <div className="hidden xl:flex items-center gap-3 bg-white px-3.5 py-1.5 rounded-xl border border-[#E6DFD4] shadow-2xs text-left">
          <div className="text-left">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#2D4A3E] uppercase tracking-wider">
              <Calendar className="w-3 h-3 text-[#E86034]" />
              <span>Tue, 02 Sep 2025</span>
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
