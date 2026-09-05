import React, { useState } from 'react';
import { 
  FileText, 
  BarChart2, 
  Package, 
  Percent, 
  LayoutGrid, 
  CreditCard, 
  Coins, 
  PieChart, 
  ArrowUp 
} from 'lucide-react';
import { IncomeVsExpensesChart } from './IncomeVsExpensesChart';
import { ExpenseCategoryDonut } from './ExpenseCategoryDonut';
import { AvailableReportsTable } from './AvailableReportsTable';
import reportsBanner from '../../../assets/images/reports_banner.png';

export const ReportsPage = ({ onNavigateTab, onGenerateReport }) => {
  const [activeTab, setActiveTab] = useState('financial');

  const navigationTabs = [
    { id: 'financial', label: 'Financial Reports', icon: FileText },
    { id: 'sales', label: 'Sales Reports', icon: BarChart2 },
    { id: 'purchase', label: 'Purchase Reports', icon: Package },
    { id: 'tax', label: 'Tax Reports', icon: Percent },
    { id: 'custom', label: 'Custom Reports', icon: LayoutGrid },
  ];

  const kpis = [
    {
      title: 'Total Revenue',
      value: '₹ 28,67,400',
      change: '+12% from last period',
      icon: BarChart2,
      iconBg: 'bg-[#E2F0EC]',
      iconColor: 'text-[#2D4A3E]',
    },
    {
      title: 'Total Expenses',
      value: '₹ 12,34,500',
      change: '+6% from last period',
      icon: CreditCard,
      iconBg: 'bg-[#FEEFEA]',
      iconColor: 'text-[#E05A2B]',
    },
    {
      title: 'Net Profit',
      value: '₹ 16,32,900',
      change: '+18% from last period',
      icon: Coins,
      iconBg: 'bg-[#E5F7ED]',
      iconColor: 'text-[#1E7445]',
    },
    {
      title: 'Profit Margin',
      value: '56.9%',
      change: '+4.2% from last period',
      icon: PieChart,
      iconBg: 'bg-[#FDF2E2]',
      iconColor: 'text-[#B45309]',
    },
  ];

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Banner Row: Heading & Quote Banner Graphic */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        
        {/* Left: Reports Heading */}
        <div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#141A17] tracking-tight font-bold">
            Reports
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6963] mt-1">
            Gain insights with powerful financial reports.
          </p>
        </div>

        {/* Right: "Numbers tell a story. We help you read it better." Quote Card */}
        <div className="w-full lg:w-auto flex justify-start lg:justify-end">
          <div className="rounded-2xl border border-[#E8E1D5] bg-white/90 overflow-hidden shadow-2xs hover:shadow-xs transition-all duration-300 w-full sm:w-[380px] md:w-[420px] lg:w-[450px] shrink-0">
            <img 
              src={reportsBanner} 
              alt="Numbers tell a story. We help you read it better." 
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
                  <div className="flex items-center gap-1 text-[10px] font-bold text-[#1E7445] mt-0.5">
                    <ArrowUp className="w-3 h-3" />
                    <span>{kpi.change}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Row: Income vs Expenses (7 cols) + Expense by Category Donut (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 flex">
          <div className="w-full">
            <IncomeVsExpensesChart />
          </div>
        </div>
        <div className="lg:col-span-5 flex">
          <div className="w-full">
            <ExpenseCategoryDonut />
          </div>
        </div>
      </div>

      {/* Bottom Row: Available Reports Table */}
      <AvailableReportsTable onGenerateReport={onGenerateReport} />

    </div>
  );
};

export default ReportsPage;
