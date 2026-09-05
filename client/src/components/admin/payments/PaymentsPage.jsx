import React, { useState } from 'react';
import { 
  Users, 
  Package, 
  FileText, 
  BookOpen, 
  CreditCard, 
  ArrowUp, 
  ArrowDown, 
  Briefcase 
} from 'lucide-react';
import { PaymentsTable } from './PaymentsTable';
import paymentsBanner from '../../../assets/images/payments_banner.png';

export const PaymentsPage = ({ onNavigateTab, onRecordPayment }) => {
  const [activeTab, setActiveTab] = useState('payments');

  const navigationTabs = [
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'chartOfAccounts', label: 'Chart of Accounts', icon: FileText },
    { id: 'journals', label: 'Journals', icon: BookOpen },
    { id: 'payments', label: 'Payments', icon: CreditCard },
  ];

  const kpis = [
    {
      title: 'Total Received',
      value: '₹ 8,92,450',
      change: '+14% from last month',
      icon: ArrowUp,
      iconBg: 'bg-[#E5F7ED]',
      iconColor: 'text-[#1E7445]',
      trendColor: 'text-[#1E7445]',
    },
    {
      title: 'Total Paid',
      value: '₹ 6,38,200',
      change: '+8% from last month',
      icon: ArrowDown,
      iconBg: 'bg-[#FEEFEA]',
      iconColor: 'text-[#E05A2B]',
      trendColor: 'text-[#1E7445]',
    },
    {
      title: 'Pending Payments',
      value: '₹ 1,45,300',
      change: '+5% from last month',
      icon: Briefcase,
      iconBg: 'bg-[#E2F0EC]',
      iconColor: 'text-[#2D4A3E]',
      trendColor: 'text-[#D97706]',
    },
    {
      title: 'Total Transactions',
      value: '126',
      change: '+18% from last month',
      icon: FileText,
      iconBg: 'bg-[#FDF2E2]',
      iconColor: 'text-[#B45309]',
      trendColor: 'text-[#1E7445]',
    },
  ];

  const handleTabClick = (tabId) => {
    if (tabId === 'contacts' || tabId === 'products' || tabId === 'chartOfAccounts' || tabId === 'journals') {
      if (onNavigateTab) {
        onNavigateTab('masterData');
      }
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Banner Row: Heading & Quote Banner Graphic */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        
        {/* Left: Payments Heading */}
        <div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#141A17] tracking-tight font-bold">
            Payments
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6963] mt-1">
            Track and manage all incoming and outgoing payments.
          </p>
        </div>

        {/* Right: "Cash flow creates freedom." Quote Card */}
        <div className="w-full lg:w-auto flex justify-start lg:justify-end">
          <div className="rounded-2xl border border-[#E8E1D5] bg-white/90 overflow-hidden shadow-2xs hover:shadow-xs transition-all duration-300 w-full sm:w-[380px] md:w-[420px] lg:w-[440px] shrink-0">
            <img 
              src={paymentsBanner} 
              alt="Cash flow creates freedom. — Robert Kiyosaki" 
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

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-5 border border-[#E8E1D5] shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-2xl ${kpi.iconBg} ${kpi.iconColor} flex items-center justify-center shrink-0 border border-black/5 shadow-2xs`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-[#66756F] uppercase tracking-wider block">
                    {kpi.title}
                  </span>
                  <span className="font-serif font-bold text-xl sm:text-2xl text-[#141A17] tracking-tight block">
                    {kpi.value}
                  </span>
                  <div className={`flex items-center gap-1 text-[10px] font-bold ${kpi.trendColor} mt-0.5`}>
                    <ArrowUp className="w-3 h-3" />
                    <span>{kpi.change}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active View: Payments Table */}
      {activeTab === 'payments' && (
        <PaymentsTable onRecordPayment={onRecordPayment} />
      )}

      {activeTab !== 'payments' && (
        <div className="bg-white rounded-3xl p-12 border border-[#E8E1D5] shadow-xs text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#F5F1EA] text-[#2D4A3E] flex items-center justify-center mx-auto border border-[#E4DCD0]">
            <CreditCard className="w-7 h-7" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#141A17]">
            {navigationTabs.find((t) => t.id === activeTab)?.label}
          </h3>
          <p className="text-xs text-[#6B7A74] max-w-sm mx-auto">
            Payment processing, reconciliation, and automated receipts are active.
          </p>
        </div>
      )}

    </div>
  );
};

export default PaymentsPage;
