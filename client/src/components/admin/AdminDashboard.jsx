import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { GreetingBanner } from './GreetingBanner';
import { KpiCards } from './KpiCards';
import { SalesPurchasesChart } from './SalesPurchasesChart';
import { ProfitLossCard } from './ProfitLossCard';
import { BudgetSnapshotCard } from './BudgetSnapshotCard';
import { RecentTransactionsTable } from './RecentTransactionsTable';
import { QuickActionsGrid } from './QuickActionsGrid';
import { TopSellingProducts } from './TopSellingProducts';
import { SalesByCategoryChart } from './SalesByCategoryChart';
import { FinancialReportsList } from './FinancialReportsList';

export const AdminDashboard = ({ onNavigateHome, onOpenCreateUser }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSelectMenu = (menuId) => {
    setActiveMenu(menuId);
    // If user clicks contacts/createUser, we can trigger corresponding modal or view
    if (menuId === 'contacts' && onOpenCreateUser) {
      onOpenCreateUser();
    }
  };

  const handleQuickAction = (actionId) => {
    if (actionId === 'addContact' && onOpenCreateUser) {
      onOpenCreateUser();
    } else {
      console.log(`Triggered quick action: ${actionId}`);
    }
  };

  return (
    <div className="h-screen w-full bg-[#F5F1EA] flex text-[#141A17] font-sans selection:bg-[#2D4A3E] selection:text-[#FAF8F5] relative overflow-hidden">
      
      {/* 1. Left Dark Forest Green Sidebar (Responsive Drawer on Mobile, Collapsible on Desktop) */}
      <AdminSidebar
        activeMenu={activeMenu}
        onSelectMenu={handleSelectMenu}
        onNavigateHome={onNavigateHome}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 2. Main Content Area with Fixed Top Header and Scrollable Dashboard Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Header with Hamburger Toggle (100% Fixed at Top - Never scrolls away) */}
        <AdminHeader 
          onNavigateHome={onNavigateHome} 
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          sidebarOpen={sidebarOpen}
        />

        {/* Dashboard Main Scrollable Body with Unified Fluid Grid Padding */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 py-6 space-y-6 w-full">
          
          {/* Greeting & Motivational Banner */}
          <GreetingBanner />

          {/* 4 Financial KPI Summary Cards */}
          <KpiCards />

          {/* Middle Row 1: Charts & Financial Health */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Sales vs Purchases Bar Chart (6 cols) */}
            <div className="lg:col-span-6 flex">
              <div className="w-full">
                <SalesPurchasesChart />
              </div>
            </div>

            {/* Profit & Loss Overview (3 cols) */}
            <div className="lg:col-span-3 flex">
              <div className="w-full">
                <ProfitLossCard />
              </div>
            </div>

            {/* Budget Snapshot (3 cols) */}
            <div className="lg:col-span-3 flex">
              <div className="w-full">
                <BudgetSnapshotCard />
              </div>
            </div>

          </div>

          {/* Middle Row 2: Transactions & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Recent Transactions Table (7 cols) */}
            <div className="lg:col-span-7 flex">
              <div className="w-full">
                <RecentTransactionsTable />
              </div>
            </div>

            {/* Quick Actions Grid (5 cols) */}
            <div className="lg:col-span-5 flex">
              <div className="w-full">
                <QuickActionsGrid onActionClick={handleQuickAction} />
              </div>
            </div>

          </div>

          {/* Lower Row 3: Product Performance, Category Distribution & Report Links */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Top Selling Products (4 cols) */}
            <div className="lg:col-span-4 flex">
              <div className="w-full">
                <TopSellingProducts />
              </div>
            </div>

            {/* Sales by Category Donut Chart (4.5 cols) */}
            <div className="lg:col-span-5 flex">
              <div className="w-full">
                <SalesByCategoryChart />
              </div>
            </div>

            {/* Reports List (3.5 cols) */}
            <div className="lg:col-span-3 flex">
              <div className="w-full">
                <FinancialReportsList />
              </div>
            </div>

          </div>

        </main>
      </div>

    </div>
  );
};

export default AdminDashboard;
