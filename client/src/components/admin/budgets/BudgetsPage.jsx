import React, { useState } from 'react';
import { 
  PieChart, 
  Network, 
  Tag, 
  BarChart2, 
  Calendar, 
  Wallet, 
  Target, 
  ArrowUp 
} from 'lucide-react';
import { MonthlyBudgetChart } from './MonthlyBudgetChart';
import { ExpenseBreakdownChart } from './ExpenseBreakdownChart';
import { BudgetListTable } from './BudgetListTable';
import budgetsBanner from '../../../assets/images/budgets_banner.png';

export const BudgetsPage = ({ onNavigateTab, onCreateBudget }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const navigationTabs = [
    { id: 'overview', label: 'Budget Overview', icon: PieChart },
    { id: 'departments', label: 'Department Budgets', icon: Network },
    { id: 'categories', label: 'Category Budgets', icon: Tag },
    { id: 'budgetVsActual', label: 'Budget vs Actual', icon: BarChart2 },
    { id: 'planning', label: 'Budget Planning', icon: Calendar },
  ];

  const kpis = [
    {
      title: 'Total Budget',
      value: '₹ 25,00,000',
      change: '+10% from last year',
      icon: Wallet,
      iconBg: 'bg-[#E5F7ED]',
      iconColor: 'text-[#1E7445]',
      isProgress: false,
    },
    {
      title: 'Total Actual',
      value: '₹ 18,76,450',
      change: '+8% from last year',
      icon: PieChart,
      iconBg: 'bg-[#E2F0EC]',
      iconColor: 'text-[#2D4A3E]',
      isProgress: false,
    },
    {
      title: 'Variance',
      value: '₹ 6,23,550',
      change: '24.9% under budget',
      icon: BarChart2,
      iconBg: 'bg-[#E2F0EC]',
      iconColor: 'text-[#2D4A3E]',
      isProgress: false,
    },
    {
      title: 'Budget Utilization',
      value: '75.1%',
      progress: 75.1,
      icon: Target,
      iconBg: 'bg-[#FDF2E2]',
      iconColor: 'text-[#B45309]',
      isProgress: true,
    },
  ];

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Banner Row: Heading & Quote Banner Graphic */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        
        {/* Left: Budgets Heading */}
        <div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#141A17] tracking-tight font-bold">
            Budgets
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6963] mt-1">
            Plan, allocate and monitor your financial goals.
          </p>
        </div>

        {/* Right: "A budget is a plan for a better tomorrow." Quote Card */}
        <div className="w-full lg:w-auto flex justify-start lg:justify-end">
          <div className="rounded-2xl border border-[#E8E1D5] bg-white/90 overflow-hidden shadow-2xs hover:shadow-xs transition-all duration-300 w-full sm:w-[380px] md:w-[420px] lg:w-[450px] shrink-0">
            <img 
              src={budgetsBanner} 
              alt="A budget is a plan for a better tomorrow. — Warren Buffett" 
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
              <div className="flex items-center gap-3.5 w-full">
                <div className={`w-11 h-11 rounded-2xl ${kpi.iconBg} ${kpi.iconColor} flex items-center justify-center shrink-0 border border-black/5 shadow-2xs`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-semibold text-[#66756F] uppercase tracking-wider block">
                    {kpi.title}
                  </span>
                  <span className="font-numeric font-bold text-xl sm:text-2xl text-[#141A17] tracking-tight block">
                    {kpi.value}
                  </span>

                  {/* Either Trend Text or Utilization Progress Bar */}
                  {kpi.isProgress ? (
                    <div className="w-full bg-[#EFE9DF] rounded-full h-1.5 overflow-hidden mt-1.5">
                      <div 
                        style={{ width: `${kpi.progress}%` }}
                        className="h-full bg-[#2D4A3E] rounded-full"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-[10px] font-bold font-numeric text-[#1E7445] mt-0.5">
                      <ArrowUp className="w-3 h-3" />
                      <span>{kpi.change}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Row: Monthly Budget vs Actual Bar Chart (7 cols) + Expense Breakdown Donut (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 flex">
          <div className="w-full">
            <MonthlyBudgetChart />
          </div>
        </div>
        <div className="lg:col-span-5 flex">
          <div className="w-full">
            <ExpenseBreakdownChart />
          </div>
        </div>
      </div>

      {/* Bottom Row: Budget List Table */}
      <BudgetListTable onCreateBudget={onCreateBudget} />

    </div>
  );
};

export default BudgetsPage;
