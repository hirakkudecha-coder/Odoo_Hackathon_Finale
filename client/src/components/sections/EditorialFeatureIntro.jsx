import React from 'react';
import { ArrowUpRight, Users, Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';

export const EditorialFeatureIntro = ({ onOpenAuth }) => {
  return (
    <section id="features" className="py-20 bg-[#F5F1EA] border-y border-[#E8E1D5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Credenza / Console + Designer Pill */}
          <div className="lg:col-span-5 space-y-6 reveal reveal-left">
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#2D4A3E] border-b border-[#2D4A3E]/30 pb-0.5">
                Luxury You Can Live In
              </span>
            </div>

            <p className="text-sm text-[#4A5550] leading-relaxed">
              Our accounting system redefines furniture business management with bespoke workflows that balance high-end catalogue design, procurement cycles, and real-time ledger fidelity.
            </p>

            {/* Mid-century wooden console card */}
            <div className="relative rounded-3xl bg-white p-6 border border-[#E4DDD1] shadow-xs group hover:shadow-md transition-shadow">
              <div className="h-48 sm:h-56 flex items-center justify-center overflow-hidden rounded-2xl bg-[#FAF8F5] mb-4">
                <img
                  src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80"
                  alt="Mid-century Solid Oak Console"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif-luxury font-bold text-base text-[#141A17]">Nordic Oak Credenza</h4>
                  <p className="text-[11px] text-[#6A7670]">SKU: UF-CR-809 • In Stock (42 units)</p>
                </div>
                <a
                  href="#catalogue"
                  className="text-xs font-bold uppercase tracking-wider text-[#2D4A3E] hover:text-[#E86034] transition-colors"
                >
                  Collection →
                </a>
              </div>
            </div>

            {/* Designer / Auditor Pill matching the reference orange designer badge */}
            <div className="flex items-center gap-4 bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E6DFD4]">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                alt="Accountant & Curator"
                className="w-12 h-12 rounded-xl object-cover border border-[#2D4A3E]/20"
              />
              <div className="flex-1">
                <p className="text-xs font-bold text-[#141A17]">Artisanal Precision</p>
                <p className="text-[11px] text-[#55635D]">Engineered for furniture manufacturers & interior studios</p>
              </div>
              <a href="#about" className="text-xs font-bold uppercase text-[#2D4A3E] hover:underline flex items-center gap-0.5">
                <span>About</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

          {/* Right Column: Editorial Statement matching reference */}
          <div className="lg:col-span-7 lg:pl-8 space-y-6 reveal reveal-right delay-200">
            
            <div className="inline-block px-3 py-1 rounded-full bg-[#EAE2D4] text-[#2D4A3E] text-[11px] font-bold uppercase tracking-widest">
              Design Architecture
            </div>

            <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-[#141A17] leading-[1.08]">
              Plush{' '}
              <span className="inline-flex items-center justify-center align-middle mx-1 w-10 h-10 rounded-xl bg-[#D2E7A4] text-[#244211] shadow-xs rotate-[4deg]">
                <span className="text-xl">🪑</span>
              </span>{' '}
              structures <br />
              for the modern <br />
              <span className="italic">financial aesthetic</span>
            </h2>

            <p className="text-base text-[#46534E] leading-relaxed max-w-xl">
              An embodiment of refined accounting logic and timeless operational elegance. Experience automated double-entry postings, multi-stage sales tracking, and real-time vendor bill reconciliations without corporate software clutter.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/70 border border-[#E4DCCE]">
                <div className="w-7 h-7 rounded-full bg-[#2D4A3E]/10 text-[#2D4A3E] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-[#141A17] uppercase tracking-wider">Zero Discrepancies</h4>
                  <p className="text-xs text-[#55635D] mt-0.5">Every sales invoice generates an exact, balanced debit & credit entry.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/70 border border-[#E4DCCE]">
                <div className="w-7 h-7 rounded-full bg-[#E86034]/10 text-[#E86034] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-[#141A17] uppercase tracking-wider">Inventory Valuation</h4>
                  <p className="text-xs text-[#55635D] mt-0.5">Real-time asset balance updates whenever goods are received.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => onOpenAuth && onOpenAuth('signup')}
                className="flex items-center gap-2 bg-[#2D4A3E] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider px-7 py-3.5 rounded-full hover:bg-[#1E332A] transition-all shadow-md cursor-pointer group"
              >
                <span>Explore System</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <a
                href="#accounting"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#141A17] hover:text-[#2D4A3E] px-4 py-3 border border-[#141A17]/20 rounded-full hover:bg-white/80 transition-all"
              >
                <span>View Accounting Engine</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
