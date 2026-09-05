import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  ShieldCheck, 
  Settings, 
  FileText, 
  BarChart3, 
  Headphones, 
  ChevronUp, 
  X,
  ArrowUpRight
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import botanicalPlant from '../../assets/images/botanical_plant.png';

export const SuperAdminSidebar = ({ 
  activeMenu = 'dashboard', 
  onSelectMenu, 
  onNavigateHome,
  isOpen = true,
  onClose 
}) => {
  const handleItemClick = (id) => {
    if (onSelectMenu) onSelectMenu(id);
    if (onClose && window.innerWidth < 1024) onClose();
  };

  const mainMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'organizations', label: 'Organizations', icon: Building2 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'roles', label: 'Roles & Permissions', icon: ShieldCheck },
    { id: 'settings', label: 'System Settings', icon: Settings },
    { id: 'logs', label: 'Activity Logs', icon: FileText },
  ];

  const secondaryMenuItems = [
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'support', label: 'Support', icon: Headphones },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-[#14231C] text-[#FAF8F5] h-screen flex flex-col justify-between border-r border-[#1E332A] select-none shrink-0 transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden
        lg:static
        ${isOpen 
          ? 'w-64 translate-x-0 shadow-2xl lg:shadow-none lg:w-64' 
          : '-translate-x-full w-64 lg:translate-x-0 lg:w-20'
        }
      `}>
        {/* Top Header & Navigation Links */}
        <div>
          {/* Brand Logo */}
          <div className="p-4 sm:p-5 border-b border-[#1E332A]/80 flex items-center justify-between min-h-[73px]">
            <div 
              onClick={() => {
                if (onNavigateHome) onNavigateHome();
                if (onClose && window.innerWidth < 1024) onClose();
              }}
              className="cursor-pointer transition-transform duration-300 hover:scale-[1.02] flex-1 flex justify-center items-center overflow-hidden"
              title="Urban Furniture Accounting System"
            >
              {isOpen ? (
                <BrandLogo light={true} />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-[#1E332A] flex items-center justify-center text-white font-serif font-bold text-lg border border-[#2D4A3E]">
                  UF
                </div>
              )}
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#1C2E26] hover:bg-[#274438] text-[#8EABA0] hover:text-white transition-colors lg:hidden cursor-pointer"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Super Admin Role Capsule Accordion Header */}
          {isOpen ? (
            <div className="px-3 pt-3">
              <div className="bg-[#1C2E25] border border-[#274438] rounded-2xl p-2.5 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#E5ECE8]">
                  <div className="w-6 h-6 rounded-lg bg-[#2D4A3E] flex items-center justify-center text-[#FAF8F5]">
                    <Settings className="w-3.5 h-3.5" />
                  </div>
                  <span>Super Admin</span>
                </div>
                <ChevronUp className="w-4 h-4 text-[#8EABA0]" />
              </div>
            </div>
          ) : (
            <div className="p-3 flex justify-center">
              <div className="w-8 h-8 rounded-xl bg-[#1C2E25] border border-[#274438] flex items-center justify-center text-[#E5ECE8]" title="Super Admin Role">
                <Settings className="w-4 h-4" />
              </div>
            </div>
          )}

          {/* Main Navigation Menu */}
          <nav className={`p-3 space-y-1 text-xs ${!isOpen ? 'flex flex-col items-center' : ''}`}>
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;

              if (!isOpen) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    title={item.label}
                    className={`relative p-3 rounded-xl transition-all duration-200 cursor-pointer group flex items-center justify-center ${
                      isActive
                        ? 'bg-[#2D4A3E] text-[#FAF8F5] shadow-xs'
                        : 'text-[#85988F] hover:text-[#FAF8F5] hover:bg-[#1E332A]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="absolute left-full ml-3 px-2.5 py-1 bg-[#1E332A] text-[#FAF8F5] text-[11px] font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-lg border border-[#2D4A3E]">
                      {item.label}
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-200 cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#2D4A3E] text-[#FAF8F5] shadow-xs font-semibold'
                      : 'text-[#A1B3AB] hover:text-[#FAF8F5] hover:bg-[#1E332A]/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#FAF8F5]' : 'text-[#85988F]'}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              );
            })}

            {/* Separator */}
            <div className="py-2">
              <div className="border-t border-[#1E332A]/60" />
            </div>

            {/* Secondary Menu (Reports & Support) */}
            {secondaryMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;

              if (!isOpen) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    title={item.label}
                    className={`relative p-3 rounded-xl transition-all duration-200 cursor-pointer group flex items-center justify-center ${
                      isActive
                        ? 'bg-[#2D4A3E] text-[#FAF8F5] shadow-xs'
                        : 'text-[#85988F] hover:text-[#FAF8F5] hover:bg-[#1E332A]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="absolute left-full ml-3 px-2.5 py-1 bg-[#1E332A] text-[#FAF8F5] text-[11px] font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-lg border border-[#2D4A3E]">
                      {item.label}
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-200 cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#2D4A3E] text-[#FAF8F5] shadow-xs font-semibold'
                      : 'text-[#A1B3AB] hover:text-[#FAF8F5] hover:bg-[#1E332A]/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#FAF8F5]' : 'text-[#85988F]'}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Botanical Plant & Motto matching screenshot */}
        {isOpen ? (
          <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-[#182B21] to-[#0F1B15] border border-[#274438]/80 relative overflow-hidden group">
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-14 flex items-center justify-center shrink-0">
                <img 
                  src={botanicalPlant} 
                  alt="Botanical Plant" 
                  className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-left">
                <p className="text-xs font-serif font-bold text-[#E5DCD0] leading-tight">
                  Stronger Businesses Together.
                </p>
                <button
                  onClick={() => {
                    if (onNavigateHome) onNavigateHome();
                    if (onClose && window.innerWidth < 1024) onClose();
                  }}
                  className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold text-[#8EABA0] hover:text-white mt-1 transition-colors cursor-pointer"
                >
                  <span>Public Portal</span>
                  <ArrowUpRight className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 mb-2 flex justify-center">
            <button
              onClick={() => {
                if (onNavigateHome) onNavigateHome();
              }}
              title="Public Storefront"
              className="p-2.5 rounded-xl bg-[#1E332A] hover:bg-[#2D4A3E] text-[#8EABA0] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default SuperAdminSidebar;
