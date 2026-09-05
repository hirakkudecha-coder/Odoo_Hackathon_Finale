import React, { useState } from 'react';
import { ArrowUpRight, Send, Mail, Phone, MapPin, Check } from 'lucide-react';

export const Footer = ({ onOpenAuth }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer id="about" className="bg-[#101C17] text-[#FAF8F5] pt-20 pb-10 border-t border-[#1C2E26] relative overflow-hidden">
      
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2D4A3E]/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Section: Brand + Newsletter + Center Blue Sofa Showcase matching Reference */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[#1E332A] items-center">
          
          {/* Left: Brand & Newsletter */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2D4A3E] text-[#FAF8F5] flex items-center justify-center font-serif font-bold text-xl border border-white/10 shadow-sm">
                UF
              </div>
              <div className="flex flex-col">
                <span className="font-serif-luxury font-bold text-2xl tracking-tight text-white">
                  Urban Furniture
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-[#8EABA0]">
                  Accounting System
                </span>
              </div>
            </div>

            <p className="text-xs text-[#A1B8AF] leading-relaxed max-w-sm">
              The premier business operating workspace for furniture ateliers, bespoke fabricators, and design showrooms.
            </p>

            {/* Newsletter input matching reference with terracotta submit button */}
            <form onSubmit={handleNewsletter} className="relative max-w-md">
              <div className="flex items-center bg-[#182B23] rounded-full p-1.5 border border-[#274438] focus-within:border-[#E86034] transition-colors">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-transparent px-4 text-xs text-white placeholder-[#688277] focus:outline-hidden"
                  required
                />
                <button
                  type="submit"
                  className="w-9 h-9 rounded-full bg-[#E86034] text-white flex items-center justify-center hover:bg-[#D55025] transition-all shrink-0 cursor-pointer shadow-sm"
                  aria-label="Subscribe"
                >
                  {subscribed ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4 ml-0.5" />}
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-emerald-400 mt-2 pl-4">Thank you for subscribing to Urban Furniture updates.</p>
              )}
            </form>

            <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#FAF8F5] tracking-tight pt-2 leading-snug">
              Redefine the way you <br />
              <span className="italic font-normal text-[#D2E7A4]">Live at Home & Run your Business.</span>
            </h3>

          </div>

          {/* Center/Right: Deep Blue Modern Sofa image matching reference */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-end">
            <div className="w-full max-w-lg bg-[#15251F] rounded-3xl p-6 border border-[#223B2F] relative group hover:border-[#2D4A3E] transition-colors">
              <div className="flex justify-between items-center text-xs text-[#8EABA0] mb-4">
                <span className="uppercase tracking-wider font-bold text-[10px]">Royal Velvet Collection</span>
                <span className="font-mono text-white text-xs">SKU: UF-ROYAL-BLU</span>
              </div>
              
              <div className="py-2 flex justify-center">
                <img
                  src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80"
                  alt="Royal Blue Luxury Sofa"
                  className="w-full max-h-48 object-contain filter drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[#223B2F] text-[11px]">
                <span className="text-[#A1B8AF]">General Ledger Assets</span>
                <span className="text-emerald-400 font-bold">Auto-Synchronized</span>
              </div>
            </div>
          </div>

        </div>

        {/* Middle Navigation Columns matching Reference */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-14 border-b border-[#1E332A] text-xs">
          
          {/* Col 1 */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-widest text-[#D2E7A4] text-[11px]">Company</h4>
            <ul className="space-y-2 text-[#A1B8AF]">
              <li><a href="#about" className="hover:text-white transition-colors">Help Desk</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Partner Program</a></li>
              <li><a href="#catalogue" className="hover:text-white transition-colors">Categories</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Showroom Locator</a></li>
            </ul>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-widest text-[#D2E7A4] text-[11px]">Modules</h4>
            <ul className="space-y-2 text-[#A1B8AF]">
              <li><a href="#accounting" className="hover:text-white transition-colors">Double-Entry Ledger</a></li>
              <li><a href="#sales" className="hover:text-white transition-colors">Sales & Invoicing</a></li>
              <li><a href="#purchases" className="hover:text-white transition-colors">Purchase Orders & Bills</a></li>
              <li><a href="#reports" className="hover:text-white transition-colors">P&L and Balance Sheet</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-widest text-[#D2E7A4] text-[11px]">About Us</h4>
            <ul className="space-y-2 text-[#A1B8AF]">
              <li><a href="#about" className="hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Craftsmanship</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Editorial Reviews</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Contact Designers</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-widest text-[#D2E7A4] text-[11px]">Support</h4>
            <ul className="space-y-2 text-[#A1B8AF]">
              <li><a href="#about" className="hover:text-white transition-colors">Accounting Setup Guide</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Chart of Accounts Map</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">GST / Tax Configuration</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Data Export & Backup</a></li>
            </ul>
          </div>

          {/* Col 5: Contact */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <h4 className="font-bold uppercase tracking-widest text-[#D2E7A4] text-[11px]">Contact</h4>
            <div className="space-y-2 text-[#A1B8AF]">
              <p className="text-white font-medium">concierge@urbanfurniture.com</p>
              <p>+91 (022) 4890-1200</p>
              <p className="text-[11px] text-[#7E968D]">Atelier HQ: Nariman Point, Mumbai</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Social Icons, Privacy Policy matching Reference */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7E968D]">
          
          <div>
            © 2026 Urban Furniture Accounting System. All rights reserved.
          </div>

          {/* Social Icons matching Reference */}
          <div className="flex items-center space-x-3">
            <a href="#" className="w-8 h-8 rounded-full bg-[#182B23] border border-[#274438] flex items-center justify-center text-[#A1B8AF] hover:text-white hover:border-[#E86034] transition-colors" aria-label="LinkedIn">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.66 1.66 0 0 0-1.66 1.66c0 .92.74 1.66 1.66 1.66.92 0 1.66-.74 1.66-1.66 0-.92-.74-1.66-1.66-1.66Z"/></svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-[#182B23] border border-[#274438] flex items-center justify-center text-[#A1B8AF] hover:text-white hover:border-[#E86034] transition-colors" aria-label="Facebook">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z"/></svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-[#182B23] border border-[#274438] flex items-center justify-center text-[#A1B8AF] hover:text-white hover:border-[#E86034] transition-colors" aria-label="X">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-[#182B23] border border-[#274438] flex items-center justify-center text-[#A1B8AF] hover:text-white hover:border-[#E86034] transition-colors" aria-label="Instagram">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
            </a>
          </div>

          <div className="flex items-center space-x-6 text-[11px]">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>

        </div>

      </div>
    </footer>
  );
};
