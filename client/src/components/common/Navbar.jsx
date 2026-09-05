import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Menu, X, ChevronRight, UserPlus } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const Navbar = ({ onOpenAuth, onOpenCreateUser, onOpenDashboard, onOpenAccountant }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Chronological menu order matching the exact flow of the page
  const navLinks = [
    { name: 'Features', href: '#features', id: 'features' },
    { name: 'Catalogue', href: '#catalogue', id: 'catalogue' },
    { name: 'Sales', href: '#sales', id: 'sales' },
    { name: 'Purchases', href: '#purchases', id: 'purchases' },
    { name: 'Accounting', href: '#accounting', id: 'accounting' },
    { name: 'Reports', href: '#reports', id: 'reports' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Contact', href:'#contact',id:'about'}
  ];

  // Scroll listener for elevation and active section tracking (Scroll Spy)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Determine active section based on scroll position
      const scrollPosition = window.scrollY + 180;
      let currentSection = '';

      for (const link of navLinks) {
        const element = document.getElementById(link.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            currentSection = link.id;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const yOffset = -80; // Offset for sticky navbar
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      {/* Main Header Container with Distinct Elevation & Frame */}
      <div className={`transition-all duration-300 ${
        scrolled 
          ? 'bg-[#FAF8F5]/95 backdrop-blur-xl shadow-[0_12px_30px_-10px_rgba(20,30,25,0.12)] border-b border-[#2D4A3E]/20 py-2 sm:py-2.5' 
          : 'bg-[#FAF8F5]/90 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(20,30,25,0.06)] border-b border-[#2D4A3E]/12 py-2.5 sm:py-3'
      }`}>
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            
            {/* Left Column: Brand Logo */}
            <div className="flex items-center justify-start shrink-0">
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group shrink-0 flex items-center"
              >
                <BrandLogo />
              </a>
            </div>

            {/* Center Column: Desktop Navigation Links (Centered in available space) */}
            <div className="hidden xl:flex items-center justify-center flex-1 mx-2">
              <nav className="flex items-center justify-center bg-[#F2ECE4]/75 p-1 rounded-full border border-[#2D4A3E]/12 shadow-inner">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`text-[10px] 2xl:text-[11px] font-semibold uppercase tracking-wider px-2 2xl:px-2.5 py-1.5 rounded-full transition-all duration-200 flex items-center justify-center whitespace-nowrap ${
                        isActive 
                          ? 'bg-[#2D4A3E] text-[#FAF8F5] shadow-xs' 
                          : 'text-[#3D4542] hover:text-[#141A17] hover:bg-white/60'
                      }`}
                    >
                      {link.name}
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Right Column: Action Items */}
            <div className="flex items-center justify-end shrink-0 gap-1.5 2xl:gap-2">
              <div className="hidden sm:flex items-center justify-end gap-1.5 2xl:gap-2 shrink-0">
                {/* Create User Button */}
                {onOpenCreateUser && (
                  <button
                    type="button"
                    onClick={() => onOpenCreateUser()}
                    className="h-8 xl:h-8.5 flex items-center gap-1.5 text-[10.5px] xl:text-[11px] font-semibold uppercase tracking-wider text-[#2D4A3E] hover:bg-[#2D4A3E]/10 px-2.5 xl:px-3 rounded-full border border-[#2D4A3E]/20 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create User</span>
                  </button>
                )}

                {/* Login Button */}
                <button
                  type="button"
                  onClick={() => onOpenAuth && onOpenAuth('login')}
                  className="h-8 xl:h-8.5 flex items-center justify-center text-[10.5px] xl:text-[11px] font-bold uppercase tracking-wider text-[#1A1F1D] hover:text-[#2D4A3E] px-2 xl:px-2.5 rounded-full transition-colors cursor-pointer whitespace-nowrap"
                >
                  Sign In
                </button>

                {/* Primary CTA - Forest Green Pill Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenDashboard) {
                      onOpenDashboard();
                    } else if (onOpenAuth) {
                      onOpenAuth('signup');
                    }
                  }}
                  className="h-8 xl:h-8.5 flex items-center justify-center gap-1 bg-[#2D4A3E] hover:bg-[#1E332A] text-[#FAF8F5] text-[10.5px] xl:text-[11px] font-semibold uppercase tracking-wider px-3 xl:px-3.5 rounded-full shadow-xs hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer group whitespace-nowrap"
                >
                  <span>{onOpenDashboard ? 'Dashboard ↗' : 'Get Started'}</span>
                  {!onOpenDashboard && (
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  )}
                </button>

                {/* Accountant Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenAccountant) {
                      onOpenAccountant();
                    } else {
                      window.history.pushState(null, '', '/accountant');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }
                  }}
                  className="h-8 xl:h-8.5 flex items-center justify-center gap-1 bg-[#C86D3B] hover:bg-[#B05B2D] text-[#FAF8F5] text-[10.5px] xl:text-[11px] font-semibold uppercase tracking-wider px-3 xl:px-3.5 rounded-full shadow-xs hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer whitespace-nowrap"
                >
                  <span>Accountant ↗</span>
                </button>
              </div>

              {/* Mobile / Tablet Menu Button (Shown below XL) */}
              <div className="flex xl:hidden items-center gap-2 ml-2">
                <button
                  onClick={() => {
                    if (onOpenDashboard) {
                      onOpenDashboard();
                    } else if (onOpenAuth) {
                      onOpenAuth('signup');
                    }
                  }}
                  className="text-[11px] font-bold uppercase tracking-wider bg-[#2D4A3E] text-[#FAF8F5] px-3 py-1.5 rounded-full sm:hidden"
                >
                  {onOpenDashboard ? 'Dashboard' : 'Get Started'}
                </button>
                <button
                  onClick={() => {
                    if (onOpenAccountant) {
                      onOpenAccountant();
                    } else {
                      window.history.pushState(null, '', '/accountant');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }
                  }}
                  className="text-[11px] font-bold uppercase tracking-wider bg-[#C86D3B] text-[#FAF8F5] px-2.5 py-1.5 rounded-full sm:hidden"
                >
                  Accountant
                </button>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-[#1A1F1D] hover:text-[#2D4A3E] hover:bg-[#EAE4DC]/60 rounded-lg transition-colors border border-[#2D4A3E]/15 cursor-pointer"
                  aria-label="Toggle Navigation"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

          </div>

          {/* Mobile / Tablet Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="xl:hidden mt-3 pt-3 border-t border-[#2D4A3E]/15 pb-4 flex flex-col gap-1.5 animate-fadeIn bg-[#FAF8F5] rounded-2xl p-4 shadow-xl border border-[#2D4A3E]/10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#66706B] px-2 mb-1">
                Navigation Sequence
              </span>
              {navLinks.map((link, idx) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`flex items-center justify-between text-xs font-semibold uppercase tracking-wider py-2.5 px-3 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-[#2D4A3E] text-[#FAF8F5]' 
                        : 'text-[#3D4542] hover:text-[#2D4A3E] hover:bg-[#EAE4DC]/50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`text-[10px] ${isActive ? 'text-[#FAF8F5]/70' : 'text-[#8E9B95]'}`}>
                        0{idx + 1}
                      </span>
                      <span>{link.name}</span>
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-[#FAF8F5]' : 'text-[#8E9B95]'}`} />
                  </a>
                );
              })}

              <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-[#2D4A3E]/15">
                {onOpenCreateUser && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenCreateUser();
                    }}
                    className="w-full text-center py-2 text-sm font-semibold uppercase tracking-wider text-[#2D4A3E] border border-[#2D4A3E]/30 rounded-full flex items-center justify-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create User</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth && onOpenAuth('login');
                  }}
                  className="w-full text-center py-2 text-sm font-semibold uppercase tracking-wider text-[#1A1F1D] border border-[#2D4A3E]/20 rounded-full"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenDashboard) {
                      onOpenDashboard();
                    } else if (onOpenAuth) {
                      onOpenAuth('signup');
                    }
                  }}
                  className="w-full text-center py-2.5 text-sm font-semibold uppercase tracking-wider bg-[#2D4A3E] text-[#FAF8F5] rounded-full flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>{onOpenDashboard ? 'Open Admin Workspace' : 'Get Started'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenAccountant) {
                      onOpenAccountant();
                    } else {
                      window.history.pushState(null, '', '/accountant');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }
                  }}
                  className="w-full text-center py-2.5 text-sm font-semibold uppercase tracking-wider bg-[#C86D3B] text-[#FAF8F5] rounded-full flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Open Accountant Workspace</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};

export default Navbar;
