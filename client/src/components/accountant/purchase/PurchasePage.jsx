import React, { useState } from 'react';
import { 
  Users, 
  Package, 
  ShoppingBag, 
  FileSpreadsheet, 
  BookOpen, 
  PieChart,
  FileText
} from 'lucide-react';
import { PurchaseOrdersTable } from './PurchaseOrdersTable';
import { VendorBillsTable } from './VendorBillsTable';
import purchaseBanner from '../../../assets/images/purchase_banner.png';

export const PurchasePage = ({ onNavigateTab }) => {
  const [activeTab, setActiveTab] = useState('purchases');
  const [purchaseSubView, setPurchaseSubView] = useState('orders'); // 'orders' | 'bills'

  const navigationTabs = [
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'purchases', label: 'Purchases & Bills', icon: ShoppingBag },
    { id: 'chartOfAccounts', label: 'Chart of Accounts', icon: FileSpreadsheet },
    { id: 'journals', label: 'Journals', icon: BookOpen },
    { id: 'analyticAccounts', label: 'Analytic Accounts', icon: PieChart },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (onNavigateTab) {
      if (tabId === 'contacts') onNavigateTab('contacts');
      else if (tabId === 'products') onNavigateTab('products');
      else if (tabId === 'purchases') onNavigateTab('purchases');
      else if (tabId === 'chartOfAccounts') onNavigateTab('accounting');
      else if (tabId === 'journals') onNavigateTab('journalEntries');
      else if (tabId === 'analyticAccounts') onNavigateTab('accounting');
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Banner Row: Heading & Quote Banner Graphic */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        
        {/* Left: Purchase Heading */}
        <div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#141A17] tracking-tight font-bold">
            Purchases & Vendor Bills
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6963] mt-1">
            Manage your purchase orders, vendor bills, supplier payments, and expense analytics.
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

      {/* View Selector (Purchase Orders vs Vendor Bills) */}
      {activeTab === 'purchases' && (
        <div className="flex items-center gap-2 bg-[#F4EFE6] p-1.5 rounded-2xl w-fit border border-[#E5DDD0]">
          <button
            type="button"
            onClick={() => setPurchaseSubView('orders')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              purchaseSubView === 'orders'
                ? 'bg-[#1C3A2F] text-white shadow-xs'
                : 'text-[#5B6963] hover:text-[#141A17] hover:bg-white/60'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Purchase Orders (P00001)</span>
          </button>
          <button
            type="button"
            onClick={() => setPurchaseSubView('bills')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              purchaseSubView === 'bills'
                ? 'bg-[#1C3A2F] text-white shadow-xs'
                : 'text-[#5B6963] hover:text-[#141A17] hover:bg-white/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Vendor Bills (Bill/2026/0001)</span>
          </button>
        </div>
      )}

      {/* Active View: Purchase Orders Table or Vendor Bills Table */}
      {activeTab === 'purchases' && (
        purchaseSubView === 'orders' ? (
          <PurchaseOrdersTable onNavigateBills={() => setPurchaseSubView('bills')} />
        ) : (
          <VendorBillsTable onNavigateReport={() => onNavigateTab && onNavigateTab('budgets')} />
        )
      )}

    </div>
  );
};

export default PurchasePage;
