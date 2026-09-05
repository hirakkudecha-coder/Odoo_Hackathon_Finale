import React, { useState } from 'react';
import { 
  ShoppingCart, 
  FileText, 
  Users, 
  Package, 
  IndianRupee,
  Receipt,
  ArrowUp
} from 'lucide-react';
import { PurchaseOrdersTable } from './PurchaseOrdersTable';
import purchaseBanner from '../../../assets/images/purchase_banner.png';

export const PurchasePage = ({ onNavigateTab, onCreatePO }) => {
  const [activeTab, setActiveTab] = useState('purchaseOrders');

  const navigationTabs = [
    { id: 'purchaseOrders', label: 'Purchase Orders', icon: ShoppingCart },
    { id: 'purchaseBills', label: 'Purchase Bills', icon: FileText },
    { id: 'suppliers', label: 'Suppliers & Vendors', icon: Users },
    { id: 'receipts', label: 'Goods Receipts', icon: Receipt },
  ];

  const kpis = [
    {
      title: 'Total Purchase Orders',
      value: '42',
      change: '+10% from last month',
      icon: ShoppingCart,
      iconBg: 'bg-[#E5F7ED]',
      iconColor: 'text-[#1E7445]',
    },
    {
      title: 'Total Purchase Bills',
      value: '38',
      change: '+6% from last month',
      icon: FileText,
      iconBg: 'bg-[#E5F7ED]',
      iconColor: 'text-[#1E7445]',
    },
    {
      title: 'Procurement Amount',
      value: '₹ 8,92,400',
      change: '+14% from last month',
      icon: IndianRupee,
      iconBg: 'bg-[#E5F7ED]',
      iconColor: 'text-[#1E7445]',
    },
    {
      title: 'Active Suppliers',
      value: '18',
      change: '+2 new this quarter',
      icon: Users,
      iconBg: 'bg-[#E5F7ED]',
      iconColor: 'text-[#1E7445]',
    },
  ];

  const handleTabClick = (tabId) => {
    if (tabId === 'suppliers' && onNavigateTab) {
      onNavigateTab('masterData');
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Banner Row: Heading & Quote Banner Graphic */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        
        {/* Left: Purchase Heading */}
        <div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#141A17] tracking-tight font-bold">
            Purchase
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6963] mt-1">
            Manage your purchase orders, bills and supplier transactions.
          </p>
        </div>

        {/* Right: "Good procurement builds great products." Quote Card */}
        <div className="w-full lg:w-auto flex justify-start lg:justify-end">
          <div className="rounded-2xl border border-[#E8E1D5] bg-white/90 overflow-hidden shadow-2xs hover:shadow-xs transition-all duration-300 w-full sm:w-[380px] md:w-[420px] lg:w-[440px] shrink-0">
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
                <div className={`w-11 h-11 rounded-2xl ${kpi.iconBg} ${kpi.iconColor} flex items-center justify-center shrink-0 border border-[#D5E8DC] shadow-2xs`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-[#66756F] uppercase tracking-wider block">
                    {kpi.title}
                  </span>
                  <span className="font-numeric font-bold text-xl sm:text-2xl text-[#141A17] tracking-tight block">
                    {kpi.value}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-bold font-numeric text-[#1E7445] mt-0.5">
                    <ArrowUp className="w-3 h-3" />
                    <span>{kpi.change}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active View: Purchase Orders Table */}
      <PurchaseOrdersTable onCreatePO={onCreatePO} />

    </div>
  );
};

export default PurchasePage;
