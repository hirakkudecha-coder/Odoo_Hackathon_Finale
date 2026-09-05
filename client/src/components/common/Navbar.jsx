import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Menu, X, ChevronRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const Navbar = ({ onOpenAuth }) => {
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
          ? 'bg-[#FAF8F5]/95 backdrop-blur-xl shadow-[0_12px_30px_-10px_rgba(20,30,25,0.12)] border-b border-[#2D4A3E]/20 py-2.5' 
          : 'bg-[#FAF8F5]/90 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(20,30,25,0.06)] border-b border-[#2D4A3E]/12 py-3'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Custom Brand Logo Component (Architectural Arch + Typography in SVG/CSS) */}
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group shrink-0"
            >
              <BrandLogo />
            </a>

            {/* Desktop Navigation Links — In Exact Chronological Order */}
            <nav className="hidden xl:flex items-center bg-[#F2ECE4]/75 p-1.5 rounded-full border border-[#2D4A3E]/12 shadow-inner">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full transition-all duration-200 ${
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

            {/* Medium screen Nav (without container pill) */}
            <nav className="hidden md:flex xl:hidden items-center space-x-4 text-xs font-semibold uppercase tracking-wider text-[#3D4542]">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`transition-colors py-1 px-2 rounded-md ${
                      isActive 
                        ? 'text-[#2D4A3E] bg-[#EAE3D6] font-bold' 
                        : 'hover:text-[#2D4A3E]'
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}
            </nav>

            {/* Right Action Items */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              
              {/* Quick Catalogue Pill with Counter */}
              <a 
                href="#catalogue"
                onClick={(e) => handleNavClick(e, '#catalogue')}
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#2D4A3E] hover:text-[#1A1F1D] px-3 py-1.5 rounded-full bg-[#EAE4DC]/80 hover:bg-[#E2DACF] border border-[#2D4A3E]/15 transition-all duration-200"
              >
                <span>Catalogue</span>
                <span className="w-5 h-5 rounded-full bg-[#2D4A3E] text-[#FAF8F5] flex items-center justify-center text-[10px] font-bold">
                  8
                </span>
              </a>

              {/* Login Button */}
              <button
                onClick={() => onOpenAuth && onOpenAuth('login')}
                className="text-xs font-bold uppercase tracking-wider text-[#1A1F1D] hover:text-[#2D4A3E] px-3.5 py-2 transition-colors cursor-pointer"
              >
                Sign In
              </button>

              {/* Primary CTA Button */}
              <button
                onClick={() => onOpenAuth && onOpenAuth('signup')}
                className="flex items-center gap-1.5 bg-[#2D4A3E] hover:bg-[#1E332A] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider px-4.5 py-2.5 rounded-full shadow-xs hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
              >
                <span>Get Started</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => onOpenAuth && onOpenAuth('signup')}
                className="text-[11px] font-bold uppercase tracking-wider bg-[#2D4A3E] text-[#FAF8F5] px-3 py-1.5 rounded-full"
              >
                Get Started
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#1A1F1D] hover:text-[#2D4A3E] hover:bg-[#EAE4DC]/60 rounded-lg transition-colors border border-[#2D4A3E]/15"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 pt-3 border-t border-[#2D4A3E]/15 pb-4 flex flex-col gap-1.5 animate-fadeIn bg-[#FAF8F5] rounded-2xl p-4 shadow-xl border border-[#2D4A3E]/10">
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
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth && onOpenAuth('login');
                  }}
                  className="w-full text-center py-2.5 text-xs font-bold uppercase tracking-wider text-[#1A1F1D] border border-[#2D4A3E]/25 rounded-full hover:bg-white transition-colors"
                >
                  Sign In to Portal
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth && onOpenAuth('signup');
                  }}
                  className="w-full text-center py-3 text-xs font-bold uppercase tracking-wider bg-[#2D4A3E] text-[#FAF8F5] rounded-full flex items-center justify-center gap-1.5 shadow-md"
                >
                  <span>Launch Accounting Workspace</span>
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
