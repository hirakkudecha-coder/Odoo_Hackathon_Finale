import React, { useState } from 'react';
import { 
  ShoppingCart, 
  FileText, 
  CreditCard, 
  Users, 
  Package, 
  IndianRupee,
  ArrowUp
} from 'lucide-react';
import { SalesOrdersTable } from '../../accountant/sales/SalesOrdersTable';
import { ContactsTableView } from '../masterData/ContactsTableView';
import { ProductsTable } from '../../accountant/products/ProductsTable';
import { PaymentsTable } from '../payments/PaymentsTable';
import salesBanner from '../../../assets/images/sales_banner.png';

export const SalesPage = ({ onNavigateTab, onOpenCreateUser }) => {
  const [activeTab, setActiveTab] = useState('salesOrders');

  const navigationTabs = [
    { id: 'salesOrders', label: 'Sales Orders', icon: ShoppingCart },
    { id: 'salesInvoices', label: 'Sales Invoices', icon: FileText },
    { id: 'receipts', label: 'Receipts', icon: CreditCard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
  ];

  const kpis = [
    {
      title: 'Total Sales Orders',
      value: '48',
      change: '+12% from last month',
      icon: ShoppingCart,
      iconBg: 'bg-[#E5F7ED]',
      iconColor: 'text-[#1E7445]',
    },
    {
      title: 'Total Invoices',
      value: '36',
      change: '+8% from last month',
      icon: FileText,
      iconBg: 'bg-[#E5F7ED]',
      iconColor: 'text-[#1E7445]',
    },
    {
      title: 'Total Sales Amount',
      value: '₹ 12,48,500',
      change: '+15% from last month',
      icon: IndianRupee,
      iconBg: 'bg-[#E5F7ED]',
      iconColor: 'text-[#1E7445]',
    },
    {
      title: 'Active Customers',
      value: '28',
      change: '+4% from last month',
      icon: Users,
      iconBg: 'bg-[#E5F7ED]',
      iconColor: 'text-[#1E7445]',
    },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Banner Row: Heading & Quote Banner Graphic */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        
        {/* Left: Sales Heading */}
        <div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#141A17] tracking-tight font-bold">
            Sales
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6963] mt-1">
            Create, manage and track your sales orders, invoices and customer transactions.
          </p>
        </div>

        {/* Right: "Happy customers build lasting businesses." Quote Card */}
        <div className="w-full lg:w-auto flex justify-start lg:justify-end">
          <div className="rounded-2xl border border-[#E8E1D5] bg-white/90 overflow-hidden shadow-2xs hover:shadow-xs transition-all duration-300 w-full sm:w-[380px] md:w-[420px] lg:w-[440px] shrink-0">
            <img 
              src={salesBanner} 
              alt="Happy customers build lasting businesses" 
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
                  <span className="font-serif font-bold text-xl sm:text-2xl text-[#141A17] tracking-tight block">
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

      {/* Active View */}
      {(activeTab === 'salesOrders' || activeTab === 'salesInvoices') && (
        <SalesOrdersTable onCreateSO={onOpenCreateUser} />
      )}

      {activeTab === 'receipts' && (
        <PaymentsTable onRecordPayment={onOpenCreateUser} />
      )}

      {activeTab === 'customers' && (
        <ContactsTableView onCreateContact={onOpenCreateUser} />
      )}

      {activeTab === 'products' && (
        <ProductsTable onCreateProduct={onOpenCreateUser} />
      )}

    </div>
  );
};

export default SalesPage;
