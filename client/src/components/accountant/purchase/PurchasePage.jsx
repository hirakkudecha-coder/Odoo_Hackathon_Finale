import React, { useState } from 'react';
import { 
  Users, 
  Package, 
  ShoppingBag, 
  FileSpreadsheet, 
  BookOpen, 
  PieChart 
} from 'lucide-react';
import { PurchaseOrdersTable } from './PurchaseOrdersTable';
import purchaseBanner from '../../../assets/images/purchase_banner.png';

export const PurchasePage = ({ onNavigateTab }) => {
  const [activeTab, setActiveTab] = useState('purchases');

  const navigationTabs = [
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'purchases', label: 'Purchases', icon: ShoppingBag },
    { id: 'chartOfAccounts', label: 'Chart of Accounts', icon: FileSpreadsheet },
    { id: 'journals', label: 'Journals', icon: BookOpen },
    { id: 'analyticAccounts', label: 'Analytic Accounts', icon: PieChart },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Banner Row: Heading & Quote Banner Graphic */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        
        {/* Left: Purchase Heading */}
        <div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#141A17] tracking-tight font-bold">
            Purchases
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6963] mt-1">
            Manage your purchase orders, vendor bills, and supplier transactions.
          </p>
        </div>

        {/* Right: Quote Card Graphic */}
        <div className="w-full lg:w-auto flex justify-start lg:justify-end">
          <div className="rounded-2xl border border-[#E8E1D5] bg-white/90 overflow-hidden shadow-2xs hover:shadow-xs transition-all duration-300 w-full sm:w-95 md:w-105 lg:w-110 shrink-0">
            <img 
              src={purchaseBanner} 
              alt="Good procurement builds great products" 
              className="w-full h-22 sm:h-24 md:h-26 object-cover object-center block"
            />
          </div>
        </div>

      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
        {navigationTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 cursor-pointer shrink-0 shadow-2xs ${
                isActive
                  ? 'bg-[#1C3A2F] text-[#FAF8F5] shadow-xs'
                  : 'bg-white text-[#4A5952] border border-[#E8E1D5] hover:bg-[#FAF8F5] hover:text-[#141A17]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#FAF8F5]' : 'text-[#7A8A83]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active View: Purchase Orders Table */}
      <PurchaseOrdersTable />

    </div>
  );
};

export default PurchasePage;
