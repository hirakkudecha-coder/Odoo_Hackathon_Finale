import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  ShoppingBag, 
  CreditCard, 
  BookOpen, 
  BarChart3, 
  Users, 
  Package, 
  FileText, 
  PieChart,
  X
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import loungeChairImg from '../../assets/images/cream_lounge_chair.png';

export const AccountantSidebar = ({ 
  activeMenu = 'dashboard', 
  onSelectMenu, 
  onNavigateHome, 
  isOpen = true, 
  onClose 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sales', label: 'Sales', icon: ShoppingCart },
    { id: 'purchases', label: 'Purchases', icon: ShoppingBag },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'budgets', label: 'Budgets & Analytics', icon: PieChart },
    { id: 'accounting', label: 'Accounting', icon: BookOpen },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'journalEntries', label: 'Journal Entries', icon: FileText },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Main Dark Forest Green Sidebar */}
      <aside 
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-[#14261D] text-[#E5EFEA] flex flex-col justify-between shrink-0 transition-all duration-300 shadow-2xl lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Brand Header & Navigation List */}
        <div className="flex flex-col flex-1 overflow-y-auto px-4 py-6 scrollbar-none">
          
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-6 mb-2 border-b border-[#2D4A3E]/30">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                onNavigateHome && onNavigateHome();
              }}
              className="group flex flex-col items-center mx-auto text-center cursor-pointer"
            >
              <BrandLogo light={true} size="default" align="center" />
            </a>
            
            <button 
              onClick={onClose}
              className="lg:hidden text-[#C5D4CD] hover:text-white p-1 rounded-md"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5 mt-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectMenu && onSelectMenu(item.id)}
                  type="button"
                  className={`w-full flex items-center px-3.5 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-[#234233] text-[#FAF8F5] shadow-xs border border-[#3E6551]/40' 
                      : 'text-[#A3B8AE] hover:text-[#FAF8F5] hover:bg-[#1C3629]/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#FAF8F5]' : 'text-[#8EA59B]'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Decorative Section with Luxury Chair & Typography */}
        <div className="p-4 pt-0">
          <div className="relative rounded-2xl overflow-hidden bg-linear-to-t from-[#0D1A14] via-[#14261D]/80 to-transparent border border-[#2D4A3E]/30 shadow-inner group">
            <div className="h-36 w-full relative overflow-hidden flex items-end justify-center">
              <img 
                src={loungeChairImg} 
                alt="Luxury Furniture" 
                className="w-full h-full object-cover object-center opacity-70 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0F1E16] via-[#0F1E16]/60 to-transparent" />
              
              <div className="absolute bottom-3 left-3 right-3 text-center">
                <p className="font-serif italic text-xs text-[#FAF8F5] font-medium leading-relaxed drop-shadow-sm">
                  “Numbers Support Better Spaces.”
                </p>
              </div>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
};

export default AccountantSidebar;
