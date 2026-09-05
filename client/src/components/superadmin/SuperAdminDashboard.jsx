import React, { useState, useEffect } from 'react';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { SuperAdminHeader } from './SuperAdminHeader';
import { SuperAdminGreetingBanner } from './SuperAdminGreetingBanner';
import { SuperAdminKpiCards } from './SuperAdminKpiCards';
import { OrganizationGrowthChart } from './OrganizationGrowthChart';
import { RecentOrganizationsList } from './RecentOrganizationsList';
import { UserDistributionDonut } from './UserDistributionDonut';
import { SystemActivityFeed } from './SystemActivityFeed';
import { SubscriptionStatusCard } from './SubscriptionStatusCard';
import { SuperAdminQuickActions } from './SuperAdminQuickActions';

// Sub-pages
import { OrganizationsPage } from './organizations/OrganizationsPage';
import { SuperAdminUsersPage } from './users/SuperAdminUsersPage';
import { RolesPermissionsPage } from './roles/RolesPermissionsPage';
import { SystemSettingsPage } from './settings/SystemSettingsPage';
import { ActivityLogsPage } from './logs/ActivityLogsPage';
import { SuperAdminReportsPage } from './reports/SuperAdminReportsPage';
import { SuperAdminSupportPage } from './support/SuperAdminSupportPage';

export const SuperAdminDashboard = ({ 
  onNavigateHome, 
  onNavigateAdmin,
  onNavigateAccountant,
  currentUser, 
  onLogout 
}) => {
  const [activeMenu, setActiveMenu] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash.replace('#', '');
    return params.get('tab') || hash || 'dashboard';
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Synchronize browser history when tab changes
  const handleSelectMenu = (menuId) => {
    setActiveMenu(menuId);
    const targetUrl = menuId === 'dashboard' ? '/superadmin' : `/superadmin?tab=${menuId}`;
    window.history.pushState(null, '', targetUrl);
  };

  // Sync state on browser back/forward buttons
  useEffect(() => {
    const onLocationChange = () => {
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash.replace('#', '');
      setActiveMenu(params.get('tab') || hash || 'dashboard');
    };
    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  return (
    <div className="h-screen w-full bg-[#F5F1EA] flex text-[#141A17] font-sans selection:bg-[#2D4A3E] selection:text-[#FAF8F5] relative overflow-hidden">
      
      {/* 1. Left Dark Forest Green Sidebar */}
      <SuperAdminSidebar
        activeMenu={activeMenu}
        onSelectMenu={handleSelectMenu}
        onNavigateHome={onNavigateHome}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Header */}
        <SuperAdminHeader
          onNavigateHome={onNavigateHome}
          onNavigateAdmin={onNavigateAdmin}
          onNavigateAccountant={onNavigateAccountant}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          sidebarOpen={sidebarOpen}
          currentUser={currentUser}
          onLogout={onLogout}
        />

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 py-6 space-y-6 w-full">
          
          {/* Conditional Sub-views */}
          {activeMenu === 'organizations' ? (
            <OrganizationsPage onNavigateTab={handleSelectMenu} />
          ) : activeMenu === 'users' ? (
            <SuperAdminUsersPage />
          ) : activeMenu === 'roles' ? (
            <RolesPermissionsPage />
          ) : activeMenu === 'settings' ? (
            <SystemSettingsPage />
          ) : activeMenu === 'logs' ? (
            <ActivityLogsPage />
          ) : activeMenu === 'reports' ? (
            <SuperAdminReportsPage />
          ) : activeMenu === 'support' ? (
            <SuperAdminSupportPage />
          ) : (
            <>
              {/* Top Greeting & Luxury Quote Banner */}
              <SuperAdminGreetingBanner 
                userName={currentUser?.name?.split(' ')[0] || 'Nikita'} 
              />

              {/* 4 Top KPI Cards */}
              <SuperAdminKpiCards />

              {/* Middle Row: Organization Growth (6 cols) + Recent Orgs (3.2 cols) + User Distribution Donut (2.8 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                <div className="lg:col-span-6 flex">
                  <div className="w-full">
                    <OrganizationGrowthChart />
                  </div>
                </div>

                <div className="lg:col-span-3 flex">
                  <div className="w-full">
                    <RecentOrganizationsList onViewAll={() => setActiveMenu('organizations')} />
                  </div>
                </div>

                <div className="lg:col-span-3 flex">
                  <div className="w-full">
                    <UserDistributionDonut />
                  </div>
                </div>
              </div>

              {/* Bottom Row: System Activity (4.5 cols) + Subscription Status (4 cols) + Quick Actions (3.5 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                <div className="lg:col-span-5 flex">
                  <div className="w-full">
                    <SystemActivityFeed onViewAll={() => setActiveMenu('logs')} />
                  </div>
                </div>

                <div className="lg:col-span-4 flex">
                  <div className="w-full">
                    <SubscriptionStatusCard onNavigateOrgs={() => setActiveMenu('organizations')} />
                  </div>
                </div>

                <div className="lg:col-span-3 flex">
                  <div className="w-full">
                    <SuperAdminQuickActions
                      onAddOrganization={() => setActiveMenu('organizations')}
                      onAddUser={() => setActiveMenu('users')}
                      onManageRoles={() => setActiveMenu('roles')}
                      onViewReports={() => setActiveMenu('reports')}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

        </main>
      </div>

    </div>
  );
};

export default SuperAdminDashboard;
