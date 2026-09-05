import React, { useState } from 'react';
import { AccountantSidebar } from './AccountantSidebar';
import { AccountantHeader } from './AccountantHeader';
import { AccountantGreetingBanner } from './AccountantGreetingBanner';
import { AccountantKpiCards } from './AccountantKpiCards';
import { InvoiceBillStatusChart } from './InvoiceBillStatusChart';
import { PaymentOverviewDonut } from './PaymentOverviewDonut';
import { TopCustomersList } from './TopCustomersList';
import { RecentInvoicesTable } from './RecentInvoicesTable';
import { RecentBillsTable } from './RecentBillsTable';
import { AccountantBottomWidgets } from './AccountantBottomWidgets';

export const AccountantDashboard = ({ onNavigateHome, onNavigateAdminDashboard }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen w-full bg-[#F5F1EA] flex text-[#141A17] font-sans selection:bg-[#2D4A3E] selection:text-[#FAF8F5] relative overflow-hidden">
      
      {/* 1. Left Dark Forest Green Sidebar */}
      <AccountantSidebar
        activeMenu={activeMenu}
        onSelectMenu={(menuId) => setActiveMenu(menuId)}
        onNavigateHome={onNavigateHome}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Fixed Header */}
        <AccountantHeader 
          onNavigateHome={onNavigateHome}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 py-5 space-y-5 w-full">
          
          {/* Greeting & Motivational Quote Banner */}
          <AccountantGreetingBanner />

          {/* 4 Financial KPI Summary Cards */}
          <AccountantKpiCards />

          {/* Middle Row: Invoice & Bill Status Chart (5 cols) + Payment Overview Donut (4 cols) + Top Customers (3 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            <div className="lg:col-span-5 flex">
              <div className="w-full">
                <InvoiceBillStatusChart />
              </div>
            </div>

            <div className="lg:col-span-4 flex">
              <div className="w-full">
                <PaymentOverviewDonut />
              </div>
            </div>

            <div className="lg:col-span-3 flex">
              <div className="w-full">
                <TopCustomersList />
              </div>
            </div>
          </div>

          {/* Table Row: Recent Invoices (6 cols) & Recent Bills (6 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            <div className="lg:col-span-6 flex">
              <div className="w-full">
                <RecentInvoicesTable />
              </div>
            </div>

            <div className="lg:col-span-6 flex">
              <div className="w-full">
                <RecentBillsTable />
              </div>
            </div>
          </div>

          {/* Bottom Row: Quick Actions, Shortcuts, and Today's Tasks */}
          <AccountantBottomWidgets />

        </main>
      </div>

    </div>
  );
};

export default AccountantDashboard;
