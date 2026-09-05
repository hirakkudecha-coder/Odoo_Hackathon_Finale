import React, { useState } from 'react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  BookOpen, 
  PieChart,
  FileSpreadsheet 
} from 'lucide-react';
import { ChartOfAccountsTable } from './ChartOfAccountsTable';
import purchaseBanner from '../../../assets/images/purchase_banner.png';

export const AccountingPage = ({ onNavigateTab }) => {
  const [activeTab, setActiveTab] = useState('accounting');

  const navigationTabs = [
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'accounting', label: 'Chart of Accounts', icon: FileSpreadsheet },
    { id: 'journals', label: 'Journals', icon: BookOpen },
    { id: 'analyticAccounts', label: 'Analytic Accounts', icon: PieChart },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (onNavigateTab) {
      if (tabId === 'contacts') onNavigateTab('contacts');
      else if (tabId === 'products') onNavigateTab('products');
      else if (tabId === 'accounting') onNavigateTab('accounting');
      else if (tabId === 'journals') onNavigateTab('journalEntries');
      else if (tabId === 'analyticAccounts') onNavigateTab('accounting');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        <div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#141A17] tracking-tight font-bold">
            Accounting Ledger
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6963] mt-1">
            Maintain your chart of accounts, assets, liabilities, and double-entry general ledger.
          </p>
        </div>

        <div className="w-full lg:w-auto flex justify-start lg:justify-end">
          <div className="rounded-2xl border border-[#E8E1D5] bg-white/90 overflow-hidden shadow-2xs w-full sm:w-95 md:w-105 lg:w-110 shrink-0">
            <img 
              src={purchaseBanner} 
              alt="Precise ledgers build sound balance sheets" 
              className="w-full h-22 sm:h-24 md:h-26 object-cover object-center block"
            />
          </div>
        </div>
      </div>

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

      <ChartOfAccountsTable />
    </div>
  );
};

export default AccountingPage;
