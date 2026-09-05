import React, { useState } from 'react';
import {
  LayoutDashboard,
  Database,
  Users,
  Package,
  FileSpreadsheet,
  BookOpen,
  PieChart,
  ShoppingCart,
  ShoppingBag,
  CreditCard,
  Scale,
  Wallet,
  FileText,
  ChevronDown,
  ChevronRight,
  X,
  ArrowUpRight
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import creamLoungeChair from '../../assets/images/cream_lounge_chair.png';

export const AdminSidebar = ({
  activeMenu = 'dashboard',
  onSelectMenu,
  onNavigateHome,
  isOpen = true,
  onClose
}) => {
  // Accordion state: only one section open at a time; opening one closes the previous one
  const [openSubmenu, setOpenSubmenu] = useState('masterData');

  const toggleSubmenu = (menuId) => {
    setOpenSubmenu((prev) => (prev === menuId ? null : menuId));
  };

  const handleItemClick = (id) => {
    if (onSelectMenu) onSelectMenu(id);
    if (onClose && window.innerWidth < 1024) onClose();
  };

  const menuStructure = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      single: true,
    },
    {
      id: 'masterData',
      label: 'Master Data',
      icon: Database,
      hasDropdown: true,
      children: [
        { id: 'contacts', label: 'Contacts', icon: Users },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'chartOfAccounts', label: 'Chart of Accounts', icon: FileSpreadsheet },
        { id: 'journals', label: 'Journals', icon: BookOpen },
        { id: 'analyticAccounts', label: 'Analytic Accounts', icon: PieChart },
      ],
    },
    {
      id: 'purchase',
      label: 'Purchase',
      icon: ShoppingCart,
      hasDropdown: true,
      children: [
        { id: 'purchaseOrders', label: 'Purchase Orders' },
        { id: 'vendorBills', label: 'Vendor Bills' },
        { id: 'vendors', label: 'Vendors' },
      ],
    },
    {
      id: 'sales',
      label: 'Sales',
      icon: ShoppingBag,
      hasDropdown: true,
      children: [
        { id: 'salesOrders', label: 'Sales Orders' },
        { id: 'customerInvoices', label: 'Customer Invoices' },
        { id: 'customers', label: 'Customers' },
      ],
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: CreditCard,
      single: true,
    },
    {
      id: 'accounting',
      label: 'Accounting',
      icon: Scale,
      hasDropdown: true,
      children: [
        { id: 'journalEntries', label: 'Journal Entries' },
        { id: 'ledger', label: 'General Ledger' },
        { id: 'reconciliation', label: 'Bank Reconciliation' },
      ],
    },
    {
      id: 'budgets',
      label: 'Budgets',
      icon: Wallet,
      single: true,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      single: true,
    },
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

        {/* Top Header & Brand */}
        <div>
          <div className="p-4 sm:p-5 border-b border-[#1E332A]/80 flex items-center justify-between min-h-[73px]">
            <div
              onClick={() => {
                if (onNavigateHome) onNavigateHome();
                if (onClose && window.innerWidth < 1024) onClose();
              }}
              className="cursor-pointer transition-transform duration-300 hover:scale-[1.02] flex-1 flex justify-center items-center overflow-hidden"
              title="Click to view Public Storefront"
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

          {/* Navigation Section */}
          <nav className={`p-2.5 space-y-1.5 mt-2 text-xs ${!isOpen ? 'flex flex-col items-center' : ''}`}>
            {menuStructure.map((item) => {
              const Icon = item.icon;
              const isSingle = item.single;
              const isActive = activeMenu === item.id;
              const isMenuOpen = openSubmenu === item.id;

              if (!isOpen) {
                // Collapsed Icon-Only Mode with Hover Tooltip
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    title={item.label}
                    className={`relative p-3 rounded-xl transition-all duration-200 cursor-pointer group flex items-center justify-center ${isActive
                        ? 'bg-[#2D4A3E] text-[#FAF8F5] shadow-xs'
                        : 'text-[#85988F] hover:text-[#FAF8F5] hover:bg-[#1E332A]'
                      }`}
                  >
                    <Icon className="w-5 h-5" />

                    {/* Hover Floating Tooltip */}
                    <span className="absolute left-full ml-3 px-2.5 py-1 bg-[#1E332A] text-[#FAF8F5] text-[11px] font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-lg border border-[#2D4A3E]">
                      {item.label}
                    </span>
                  </button>
                );
              }

              // Full Expanded Mode
              if (isSingle) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-200 cursor-pointer ${isActive
                        ? 'bg-[#2D4A3E] text-[#FAF8F5] shadow-xs font-semibold'
                        : 'text-[#A1B3AB] hover:text-[#FAF8F5] hover:bg-[#1E332A]/60'
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#FAF8F5]' : 'text-[#85988F]'}`} />
                    <span className="flex-1 text-left">{item.label}</span>
                  </button>
                );
              }

              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => toggleSubmenu(item.id)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[#A1B3AB] hover:text-[#FAF8F5] hover:bg-[#1E332A]/60 font-medium transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[#85988F]" />
                      <span>{item.label}</span>
                    </div>
                    {isMenuOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-[#85988F]" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-[#85988F]" />
                    )}
                  </button>

                  {/* Submenu Children */}
                  {isMenuOpen && item.children && (
                    <div className="pl-6 space-y-0.5 border-l border-[#274438] ml-5 my-1">
                      {item.children.map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive = activeMenu === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleItemClick(sub.id)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-colors cursor-pointer text-left ${isSubActive
                                ? 'text-[#FAF8F5] bg-[#2D4A3E]/70 font-semibold'
                                : 'text-[#8EABA0] hover:text-[#FAF8F5] hover:bg-[#1E332A]/40'
                              }`}
                          >
                            {SubIcon && <SubIcon className="w-3.5 h-3.5 text-[#8EABA0]" />}
                            <span>{sub.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Motivational Callout (Shown when expanded) */}
        {isOpen ? (
          <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-[#1A2C23] to-[#122019] border border-[#274438] relative overflow-hidden group">
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center p-1 border border-white/10 shrink-0">
                <img
                  src={creamLoungeChair}
                  alt="Living Room Armchair"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-serif font-bold text-[#E5DCD0] leading-tight">
                  Better Furniture Business Everyday.
                </p>
                <button
                  onClick={() => {
                    if (onNavigateHome) onNavigateHome();
                    if (onClose && window.innerWidth < 1024) onClose();
                  }}
                  className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold text-[#8EABA0] hover:text-white mt-1 transition-colors cursor-pointer"
                >
                  <span>View Storefront</span>
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
              title="View Storefront"
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

export default AdminSidebar;
