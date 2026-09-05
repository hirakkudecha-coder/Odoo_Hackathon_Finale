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
import { SalesPage } from './sales/SalesPage';
import { PurchasePage } from './purchase/PurchasePage';
import { PaymentsPage } from './payments/PaymentsPage';
import { AccountingPage } from './accounting/AccountingPage';
import { ReportsPage } from './reports/ReportsPage';
import { ContactsPage } from './contacts/ContactsPage';
import { ProductsPage } from './products/ProductsPage';
import { JournalEntriesPage } from './journals/JournalEntriesPage';
import { BudgetsPage } from './budgets/BudgetsPage';

export const AccountantDashboard = ({ onNavigateHome, onNavigateAdminDashboard, currentUser, onLogout }) => {
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
          currentUser={currentUser}
          onLogout={onLogout}
        />

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 py-5 space-y-5 w-full">
          
          {/* Conditional Views */}
          {activeMenu === 'sales' ? (
            <SalesPage onNavigateTab={(tabId) => setActiveMenu(tabId)} />
          ) : activeMenu === 'purchases' || activeMenu === 'purchase' ? (
            <PurchasePage onNavigateTab={(tabId) => setActiveMenu(tabId)} />
          ) : activeMenu === 'payments' ? (
            <PaymentsPage onNavigateTab={(tabId) => setActiveMenu(tabId)} />
          ) : activeMenu === 'budgets' ? (
            <BudgetsPage onNavigateTab={(tabId) => setActiveMenu(tabId)} />
          ) : activeMenu === 'accounting' ? (
            <AccountingPage onNavigateTab={(tabId) => setActiveMenu(tabId)} />
          ) : activeMenu === 'reports' ? (
            <ReportsPage onNavigateTab={(tabId) => setActiveMenu(tabId)} />
          ) : activeMenu === 'contacts' ? (
            <ContactsPage onNavigateTab={(tabId) => setActiveMenu(tabId)} />
          ) : activeMenu === 'products' ? (
            <ProductsPage onNavigateTab={(tabId) => setActiveMenu(tabId)} />
          ) : activeMenu === 'journalEntries' || activeMenu === 'journals' ? (
            <JournalEntriesPage onNavigateTab={(tabId) => setActiveMenu(tabId)} />
          ) : (
            <>
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
              <AccountantBottomWidgets onNavigateTab={(tabId) => setActiveMenu(tabId)} />
            </>
          )}

        </main>
      </div>

    </div>
  );
};

export default AccountantDashboard;
