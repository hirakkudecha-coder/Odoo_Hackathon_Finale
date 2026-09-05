import React, { useState } from 'react';
import { ComplianceModal } from './ComplianceModal';

export const Footer = ({ onOpenAuth, onNavigatePartnerHelpdesk, onNavigateAbout, onNavigateShowrooms }) => {
  const [complianceModal, setComplianceModal] = useState({ isOpen: false, tab: 'privacy' });

  return (
    <footer id="about" className="bg-[#101C17] text-[#FAF8F5] pt-14 pb-10 border-t border-[#1C2E26] relative overflow-hidden scroll-mt-24 w-full">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2D4A3E]/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Edge-to-edge container without restricting max-w */}
      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Navigation Columns: Sleek Minimalist Typography matching Reference */}
        <div className="pb-12 border-b border-[#1E332A]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-20 max-w-4xl text-xs">
            
            {/* Col 1: Company */}
            <div className="space-y-4">
              <h4 className="font-bold uppercase tracking-widest text-[#D2E7A4] text-[11px]">Company</h4>
              <ul className="space-y-2.5 text-[#A1B8AF]">
                <li>
                  <a
                    href="/partner-helpdesk#helpdesk"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigatePartnerHelpdesk) {
                        onNavigatePartnerHelpdesk('helpdesk');
                      } else {
                        window.history.pushState(null, '', '/partner-helpdesk#helpdesk');
                        window.dispatchEvent(new PopStateEvent('popstate'));
                      }
                    }}
                    className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-2 group"
                  >
                    <span>Help Desk</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#182B23] text-[#D2E7A4] border border-[#274438] group-hover:border-[#E86034] transition-colors">
                      24/7
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/partner-helpdesk#partner"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigatePartnerHelpdesk) {
                        onNavigatePartnerHelpdesk('partner');
                      } else {
                        window.history.pushState(null, '', '/partner-helpdesk#partner');
                        window.dispatchEvent(new PopStateEvent('popstate'));
                      }
                    }}
                    className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-2 group"
                  >
                    <span>Partner Program</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#182B23] text-[#E8C547] border border-[#274438] group-hover:border-[#E8C547] transition-colors">
                      Trade
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/#catalogue"
                    onClick={(e) => {
                      e.preventDefault();
                      const cat = document.getElementById('catalogue');
                      if (cat) {
                        cat.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        window.history.pushState(null, '', '/#catalogue');
                        window.dispatchEvent(new PopStateEvent('popstate'));
                      }
                    }}
                    className="hover:text-white transition-colors block cursor-pointer"
                  >
                    Categories
                  </a>
                </li>
                <li>
                  <a
                    href="/showrooms"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigateShowrooms) {
                        onNavigateShowrooms();
                      } else {
                        window.history.pushState(null, '', '/showrooms');
                        window.dispatchEvent(new PopStateEvent('popstate'));
                      }
                    }}
                    className="hover:text-white transition-colors block cursor-pointer"
                  >
                    Showroom Locator
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 2: About Us */}
            <div className="space-y-4">
              <h4 className="font-bold uppercase tracking-widest text-[#D2E7A4] text-[11px]">About Us</h4>
              <ul className="space-y-2.5 text-[#A1B8AF]">
                <li>
                  <a
                    href="/about#story"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigateAbout) {
                        onNavigateAbout('story');
                      } else {
                        window.history.pushState(null, '', '/about#story');
                        window.dispatchEvent(new PopStateEvent('popstate'));
                      }
                    }}
                    className="hover:text-white transition-colors block cursor-pointer"
                  >
                    Our Story
                  </a>
                </li>
                <li>
                  <a
                    href="/about#craftsmanship"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigateAbout) {
                        onNavigateAbout('craftsmanship');
                      } else {
                        window.history.pushState(null, '', '/about#craftsmanship');
                        window.dispatchEvent(new PopStateEvent('popstate'));
                      }
                    }}
                    className="hover:text-white transition-colors block cursor-pointer"
                  >
                    Craftsmanship
                  </a>
                </li>
                <li>
                  <a
                    href="/about#reviews"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigateAbout) {
                        onNavigateAbout('reviews');
                      } else {
                        window.history.pushState(null, '', '/about#reviews');
                        window.dispatchEvent(new PopStateEvent('popstate'));
                      }
                    }}
                    className="hover:text-white transition-colors block cursor-pointer"
                  >
                    Editorial Reviews
                  </a>
                </li>
                <li>
                  <a
                    href="/about#designers"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigateAbout) {
                        onNavigateAbout('designers');
                      } else {
                        window.history.pushState(null, '', '/about#designers');
                        window.dispatchEvent(new PopStateEvent('popstate'));
                      }
                    }}
                    className="hover:text-white transition-colors block cursor-pointer"
                  >
                    Contact Designers
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Contact */}
            <div className="space-y-4">
              <h4 className="font-bold uppercase tracking-widest text-[#D2E7A4] text-[11px]">Contact</h4>
              <div className="space-y-2.5 text-[#A1B8AF]">
                <a
                  href="mailto:concierge@urbanfurniture.com"
                  className="text-white hover:text-[#D2E7A4] transition-colors font-medium block"
                >
                  concierge@urbanfurniture.com
                </a>
                <a
                  href="tel:+9102248901200"
                  className="hover:text-white transition-colors block"
                >
                  +91 (022) 4890-1200
                </a>
                <div className="text-[11px] text-[#7E968D] pt-0.5 leading-relaxed">
                  <p>Atelier HQ: Nariman Point, Mumbai</p>
                  <p className="text-[10px] text-[#5D736A] mt-0.5">Mon – Sat · 09:00 to 20:00 IST</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Bar: Copyright, Social Icons, Privacy Policy matching Reference */}
        <div className="pt-8 flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4 text-xs text-[#7E968D]">
          <div>
            © 2026 Urban Furniture Accounting System. All rights reserved.
          </div>

          {/* Social Icons matching Reference */}
          <div className="flex items-center space-x-3">
            <a href="#" className="w-8 h-8 rounded-full bg-[#182B23] border border-[#274438] flex items-center justify-center text-[#A1B8AF] hover:text-white hover:border-[#E86034] transition-colors" aria-label="LinkedIn">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.66 1.66 0 0 0-1.66 1.66c0 .92.74 1.66 1.66 1.66.92 0 1.66-.74 1.66-1.66 0-.92-.74-1.66-1.66-1.66Z" /></svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-[#182B23] border border-[#274438] flex items-center justify-center text-[#A1B8AF] hover:text-white hover:border-[#E86034] transition-colors" aria-label="Facebook">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z" /></svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-[#182B23] border border-[#274438] flex items-center justify-center text-[#A1B8AF] hover:text-white hover:border-[#E86034] transition-colors" aria-label="X">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-[#182B23] border border-[#274438] flex items-center justify-center text-[#A1B8AF] hover:text-white hover:border-[#E86034] transition-colors" aria-label="Instagram">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg>
            </a>
          </div>

          <div className="flex items-center space-x-6 text-[11px]">
            <button
              onClick={() => setComplianceModal({ isOpen: true, tab: 'privacy' })}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setComplianceModal({ isOpen: true, tab: 'terms' })}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => setComplianceModal({ isOpen: true, tab: 'security' })}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Security
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Compliance Modal Dialog */}
      <ComplianceModal
        isOpen={complianceModal.isOpen}
        initialTab={complianceModal.tab}
        onClose={() => setComplianceModal({ isOpen: false, tab: 'privacy' })}
      />
    </footer>
  );
};

export default Footer;
