import React from 'react';
import { ArrowUpRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import orangeSofa from '../../assets/images/orange_sofa.png';

export const FinalCTASection = ({ onOpenAuth }) => {
  return (
    <section className="py-24 bg-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="rounded-3xl bg-gradient-to-br from-[#F5EFE6] via-[#FAF6F0] to-[#EAE2D4] p-8 sm:p-14 lg:p-16 border border-[#E4DCCE] shadow-md relative overflow-hidden reveal reveal-scale">
          
          {/* Subtle decorative background glow */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#2D4A3E]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 reveal reveal-left delay-100">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[#2D4A3E] text-[11px] font-bold uppercase tracking-widest border border-[#2D4A3E]/10">
                <Sparkles className="w-3.5 h-3.5 text-[#E86034]" />
                Begin Your Operational Upgrade
              </div>

              <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-[#141A17] leading-[1.05] tracking-tight">
                Bring clarity to every transaction.
              </h2>

              <p className="text-sm sm:text-base text-[#4E5C56] leading-relaxed max-w-lg">
                One dedicated platform for your furniture business — seamlessly linking showroom sales orders, vendor purchases, inventory valuation, and balanced double-entry journals.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={() => onOpenAuth && onOpenAuth('signup')}
                  className="flex items-center gap-2 bg-[#2D4A3E] text-[#FAF8F5] text-xs sm:text-sm font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#1E332A] transition-all shadow-md cursor-pointer group"
                >
                  <span>Get Started Now</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => onOpenAuth && onOpenAuth('login')}
                  className="flex items-center gap-2 bg-white text-[#141A17] hover:text-[#2D4A3E] text-xs sm:text-sm font-bold uppercase tracking-wider px-7 py-4 rounded-full border border-[#141A17]/20 hover:border-[#2D4A3E] transition-all cursor-pointer shadow-xs"
                >
                  <span>Sign In to Portal</span>
                </button>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#5A6862]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2D4A3E]" />
                  <span>Double-Entry Compliant</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2D4A3E]" />
                  <span>Real-Time P&L & Balance Sheet</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2D4A3E]" />
                  <span>Complete Audit Trails</span>
                </div>
              </div>

            </div>

            {/* Right Furniture Visual */}
            <div className="lg:col-span-5 flex justify-center reveal reveal-right delay-200">
              <div className="relative">
                <div className="w-72 sm:w-80 h-72 sm:h-80 rounded-full bg-white/60 p-6 flex items-center justify-center shadow-lg border border-[#E6DFD4]">
                  <img
                    src={orangeSofa}
                    alt="Luxury Modern Couch"
                    className="w-72 h-48 object-cover rounded-2xl shadow-xl hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
