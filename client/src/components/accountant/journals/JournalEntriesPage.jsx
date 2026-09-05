import React, { useState } from 'react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  FileText, 
  FileSpreadsheet, 
  BookOpen, 
  PieChart 
} from 'lucide-react';
import { JournalEntriesTable } from './JournalEntriesTable';
import purchaseBanner from '../../../assets/images/purchase_banner.png';

export const JournalEntriesPage = ({ onNavigateTab }) => {
  const [activeTab, setActiveTab] = useState('journals');

  const navigationTabs = [
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'chartOfAccounts', label: 'Chart of Accounts', icon: FileSpreadsheet },
    { id: 'journals', label: 'Journal Entries', icon: FileText },
    { id: 'analyticAccounts', label: 'Analytic Accounts', icon: PieChart },
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        <div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#141A17] tracking-tight font-bold">
            Journal Entries
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6963] mt-1">
            Record manual vouchers, adjustments, and double-entry transaction ledgers.
          </p>
        </div>

        <div className="w-full lg:w-auto flex justify-start lg:justify-end">
          <div className="rounded-2xl border border-[#E8E1D5] bg-white/90 overflow-hidden shadow-2xs w-full sm:w-95 md:w-105 lg:w-110 shrink-0">
            <img 
              src={purchaseBanner} 
              alt="Balanced entries ensure financial clarity" 
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
              onClick={() => setActiveTab(tab.id)}
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

      <JournalEntriesTable />
    </div>
  );
};

export default JournalEntriesPage;
