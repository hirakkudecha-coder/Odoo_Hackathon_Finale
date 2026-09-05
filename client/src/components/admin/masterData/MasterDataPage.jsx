import React, { useState } from 'react';
import { 
  Users, 
  Package, 
  FileSpreadsheet, 
  BookOpen, 
  PieChart 
} from 'lucide-react';
import { ContactsTableView } from './ContactsTableView';
import masterDataBanner from '../../../assets/images/master_data_banner.png';

export const MasterDataPage = ({ onOpenCreateUser }) => {
  const [activeTab, setActiveTab] = useState('contacts');

  const navigationTabs = [
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'chartOfAccounts', label: 'Chart of Accounts', icon: FileSpreadsheet },
    { id: 'journals', label: 'Journals', icon: BookOpen },
    { id: 'analyticAccounts', label: 'Analytic Accounts', icon: PieChart },
  ];

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Banner Row: Heading & Quote Banner Graphic */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        
        {/* Left: Master Data Heading */}
        <div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#141A17] tracking-tight font-bold">
            Master Data
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6963] mt-1">
            Manage and maintain your essential business data in one place.
          </p>
        </div>

        {/* Right: "Organized data builds stronger businesses" Quote Card */}
        <div className="w-full lg:w-auto flex justify-start lg:justify-end">
          <div className="rounded-2xl border border-[#E8E1D5] bg-white/90 overflow-hidden shadow-2xs hover:shadow-xs transition-all duration-300 w-full sm:w-[380px] md:w-[420px] lg:w-[440px] shrink-0">
            <img 
              src={masterDataBanner} 
              alt="Organized data builds stronger businesses" 
              className="w-full h-22 sm:h-24 md:h-26 object-cover object-center block"
            />
          </div>
        </div>

      </div>

      {/* Sub-navigation Tabs: Contacts, Products, Chart of Accounts, Journals, Analytic Accounts */}
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

      {/* Active Tab View */}
      {activeTab === 'contacts' && (
        <ContactsTableView onCreateContact={onOpenCreateUser} />
      )}

      {activeTab !== 'contacts' && (
        <div className="bg-white rounded-3xl p-12 border border-[#E8E1D5] shadow-xs text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#F5F1EA] text-[#2D4A3E] flex items-center justify-center mx-auto border border-[#E4DCD0]">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#141A17]">
            {navigationTabs.find((t) => t.id === activeTab)?.label}
          </h3>
          <p className="text-xs text-[#6B7A74] max-w-sm mx-auto">
            This module is ready for live ERP catalog synchronization. Manage records, analytic tags, and ledger bindings seamlessly.
          </p>
        </div>
      )}

    </div>
  );
};

export default MasterDataPage;
