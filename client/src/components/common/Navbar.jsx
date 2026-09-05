import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowUpRight, Menu, X, ShieldCheck, ChevronDown } from 'lucide-react';

export const Navbar = ({ onOpenAuth }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Accounting', href: '#accounting' },
    { name: 'Purchases', href: '#purchases' },
    { name: 'Sales', href: '#sales' },
    { name: 'Reports', href: '#reports' },
    { name: 'Catalogue', href: '#catalogue' },
    { name: 'About', href: '#about' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#FAF8F5]/90 backdrop-blur-md shadow-xs border-b border-[#2D4A3E]/10 py-3.5' 
        : 'bg-[#FAF8F5] py-5 border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-[#2D4A3E] text-[#FAF8F5] flex items-center justify-center font-serif font-bold text-lg tracking-wider transition-transform duration-300 group-hover:scale-105 shadow-xs">
              UF
            </div>
            <div className="flex flex-col">
              <span className="font-serif-luxury font-bold text-lg tracking-tight text-[#1A1F1D] leading-none group-hover:text-[#2D4A3E] transition-colors">
                Urban Furniture
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#66706B] mt-0.5">
                Accounting System
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7 text-xs font-medium uppercase tracking-wider text-[#3D4542]">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-[#2D4A3E] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#2D4A3E] hover:after:w-full after:transition-all after:duration-300"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Items */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Subtle Cart / System Badge */}
            <a 
              href="#catalogue"
              className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-[#3D4542] hover:text-[#2D4A3E] px-3 py-1.5 rounded-full border border-[#2D4A3E]/15 hover:border-[#2D4A3E]/40 transition-colors"
            >
              <span>Catalogue</span>
              <div className="w-5 h-5 rounded-full bg-[#EAE4DC] text-[#2D4A3E] flex items-center justify-center text-[10px] font-bold">
                8
              </div>
            </a>

            {/* Login Button */}
            <button
              onClick={() => onOpenAuth && onOpenAuth('login')}
              className="text-xs font-semibold uppercase tracking-wider text-[#1A1F1D] hover:text-[#2D4A3E] px-4 py-2 transition-colors cursor-pointer"
            >
              Sign In
            </button>

            {/* Primary CTA - Forest Green Pill Button */}
            <button
              onClick={() => onOpenAuth && onOpenAuth('signup')}
              className="flex items-center gap-1.5 bg-[#2D4A3E] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-full hover:bg-[#1E332A] transition-all duration-300 hover:shadow-md cursor-pointer group"
            >
              <span>Get Started</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#1A1F1D] hover:text-[#2D4A3E] rounded-md transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-[#2D4A3E]/10 pb-4 flex flex-col gap-3 animate-fadeIn">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium uppercase tracking-wider text-[#3D4542] hover:text-[#2D4A3E] py-1.5 px-2 rounded-md hover:bg-[#F2ECE4]"
              >
                {link.name}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-3 border-t border-[#2D4A3E]/10">
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
                  onOpenAuth && onOpenAuth('signup');
                }}
                className="w-full text-center py-2.5 text-sm font-semibold uppercase tracking-wider bg-[#2D4A3E] text-[#FAF8F5] rounded-full flex items-center justify-center gap-1.5"
              >
                <span>Get Started</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
