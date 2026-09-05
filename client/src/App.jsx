import React, { useState, useEffect } from 'react';
import { useScrollObserver } from './hooks/useScrollObserver';
import { Navbar } from './components/common/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { EditorialFeatureIntro } from './components/sections/EditorialFeatureIntro';
import { LuxurySpaceBanner } from './components/sections/LuxurySpaceBanner';
import { ProductCatalogSection } from './components/sections/ProductCatalogSection';
import { QualityDesignSection } from './components/sections/QualityDesignSection';
import { SalesWorkflowSection } from './components/sections/SalesWorkflowSection';
import { PurchasesWorkflowSection } from './components/sections/PurchasesWorkflowSection';
import { AccountingSection } from './components/sections/AccountingSection';
import { ReportingSection } from './components/sections/ReportingSection';
import { DashboardPreviewSection } from './components/sections/DashboardPreviewSection';
import { SpacesLivingSection } from './components/sections/SpacesLivingSection';
import { CoreModulesSection } from './components/sections/CoreModulesSection';
import { FinalCTASection } from './components/sections/FinalCTASection';
import { Footer } from './components/common/Footer';
import { AuthLayout } from './components/auth/AuthLayout';
import { CreateUserModal } from './components/admin/CreateUserModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

export const App = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);

  // Sync route on popstate (browser back/forward)
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Trigger formal editorial scroll entrance animations whenever currentPath changes
  useScrollObserver(currentPath);

  const handleOpenAuth = (mode = 'login') => {
    const targetPath = mode === 'register' || mode === 'signup' ? '/register' : '/login';
    window.history.pushState(null, '', targetPath);
    setCurrentPath(targetPath);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNavigateHome = () => {
    window.history.pushState(null, '', '/');
    setCurrentPath('/');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNavigateDashboard = () => {
    window.history.pushState(null, '', '/dashboard');
    setCurrentPath('/dashboard');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleOpenCreateUser = () => {
    setCreateUserModalOpen(true);
  };

  const handleCloseCreateUser = () => {
    setCreateUserModalOpen(false);
  };

  // FULL SCREEN ADMIN DASHBOARD: Accessible at /dashboard or #dashboard
  if (
    currentPath === '/dashboard' || 
    currentPath.endsWith('/dashboard') || 
    window.location.hash === '#dashboard'
  ) {
    return (
      <>
        <AdminDashboard
          onNavigateHome={handleNavigateHome}
          onOpenCreateUser={handleOpenCreateUser}
        />
        <CreateUserModal
          isOpen={createUserModalOpen}
          onClose={handleCloseCreateUser}
        />
      </>
    );
  }

  // FULL SCREEN LOGIN PAGE: Accessible at /login
  if (currentPath === '/login' || currentPath.endsWith('/login') || window.location.hash === '#login') {
    return (
      <AuthLayout
        initialMode="login"
        onNavigateHome={handleNavigateHome}
        onSuccess={handleNavigateDashboard}
      />
    );
  }

  // FULL SCREEN REGISTER / SIGNUP PAGE: Accessible at /register or /signup
  if (
    currentPath === '/register' || 
    currentPath === '/signup' || 
    currentPath.endsWith('/register') || 
    currentPath.endsWith('/signup') ||
    window.location.hash === '#register' ||
    window.location.hash === '#signup'
  ) {
    return (
      <AuthLayout
        initialMode="register"
        onNavigateHome={handleNavigateHome}
        onSuccess={handleNavigateDashboard}
      />
    );
  }

  // LANDING PAGE: Accessible at /
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1F1D] flex flex-col selection:bg-[#2D4A3E] selection:text-[#FAF8F5]">
      
      {/* Editorial Luxury Top Navigation */}
      <Navbar 
        onOpenAuth={handleOpenAuth} 
        onOpenCreateUser={handleOpenCreateUser}
        onOpenDashboard={handleNavigateDashboard}
      />

      {/* Main Long-Form Editorial Content */}
      <main className="flex-1">
        
        {/* 1. Hero Section — Style Meets Precision & Luxury Collage */}
        <HeroSection onOpenAuth={handleOpenAuth} />

        {/* 2. Editorial Feature Intro — Plush Designs for the Modern Aesthetic */}
        <EditorialFeatureIntro onOpenAuth={handleOpenAuth} />

        {/* 3. Luxury Space Banner — Luxury in Every Space */}
        <LuxurySpaceBanner />

        {/* 4. Product Master & Asset Catalogue — Turning Spaces Into Places You Love */}
        <ProductCatalogSection onOpenAuth={handleOpenAuth} />

        {/* 5. Quality & Design — Lasting Quality Meets Timeless Financial Structure */}
        <QualityDesignSection />

        {/* 6. Sales & Invoicing Workflow — Turn Every Sale into a Clear Financial Story */}
        <SalesWorkflowSection onOpenAuth={handleOpenAuth} />

        {/* 7. Procurement & Purchases — From Supplier to Settled Bill */}
        <PurchasesWorkflowSection onOpenAuth={handleOpenAuth} />

        {/* 8. Double-Entry Accounting Ledger — Every Transaction Has a Place */}
        <AccountingSection onOpenAuth={handleOpenAuth} />

        {/* 9. Reporting & Financial Intelligence — See the Health of Your Business */}
        <ReportingSection onOpenAuth={handleOpenAuth} />

        {/* 10. Executive Dashboard Preview — One View. The Whole Business */}
        <DashboardPreviewSection onOpenAuth={handleOpenAuth} />

        {/* 11. Spaces & Living Section — Creating Spaces You'll Love to Live In */}
        <SpacesLivingSection onOpenAuth={handleOpenAuth} />

        {/* 12. Core Modules Grid — 01 to 05 Structured Modules */}
        <CoreModulesSection onOpenAuth={handleOpenAuth} />

        {/* 13. Final High-Impact CTA — Bring Clarity to Every Transaction */}
        <FinalCTASection onOpenAuth={handleOpenAuth} />

      </main>

      {/* Luxury Dark Forest Footer */}
      <Footer onOpenAuth={handleOpenAuth} />

      {/* Admin Create User Interactive Modal */}
      <CreateUserModal
        isOpen={createUserModalOpen}
        onClose={handleCloseCreateUser}
      />

    </div>
  );
};

export default App;