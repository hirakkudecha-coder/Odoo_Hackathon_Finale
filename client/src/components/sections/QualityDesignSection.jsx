import React from 'react';
import { ArrowUpRight, CheckCircle2, Shield, Sparkles, RefreshCw } from 'lucide-react';
import rattanChair from '../../assets/images/rattan_chair.png';

export const QualityDesignSection = () => {
  return (
    <section className="py-20 bg-[#F7F3EB] border-y border-[#E8E1D5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Left: Soft Yellow Bulb / Lighting Card matching reference */}
          <div className="lg:col-span-3 reveal reveal-left delay-100">
            <div className="rounded-3xl bg-[#FAF17B] p-6 border border-[#E4DC68] shadow-xs flex flex-col justify-between h-80 group hover:scale-[1.02] transition-transform">
              <div className="w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-xs flex items-center justify-center text-3xl shadow-xs mx-auto">
                💡
              </div>

              <div className="text-center space-y-1">
                <h4 className="font-serif-luxury font-bold text-lg text-[#2B2806]">
                  Ambient Clarity
                </h4>
                <p className="text-[11px] text-[#47430B] leading-tight">
                  Illuminate cash flows and supplier lead-times with crystal-clear reporting.
                </p>
              </div>

              <div className="pt-2 text-center">
                <a
                  href="#accounting"
                  className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#2B2806] border-b border-[#2B2806]/40 pb-0.5"
                >
                  Ledger Engine →
                </a>
              </div>
            </div>
          </div>

          {/* Center: Rattan / Teal Chair with Floating Badges matching reference */}
          <div className="lg:col-span-5 flex justify-center reveal reveal-scale delay-200">
            <div className="relative p-6 bg-white rounded-3xl border border-[#E4DCCE] shadow-md w-full max-w-sm text-center">

              {/* Floating Badge 1: Terracotta Delivery Badge */}
              <div className="absolute -top-3 left-4 bg-[#E86034] text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-xs animate-bounce">
                Delivery: Reconciled
              </div>

              {/* Floating Badge 2: Sage Comfort Badge */}
              <div className="absolute -bottom-3 right-4 bg-[#CEE69E] text-[#213D0E] px-3.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-xs border border-[#AECB78]">
                Double Entry: Balanced
              </div>

              {/* Central Rattan / Teal Chair */}
              <div className="py-4 flex justify-center">
                <img
                  src={rattanChair}
                  alt="Teal Rattan Studio Armchair"
                  className="w-56 h-56 object-contain filter drop-shadow-xl hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="pt-2 border-t border-[#EAE3D8]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6A7570]">
                  Model UF-RT-402
                </span>
                <h4 className="font-serif-luxury font-bold text-base text-[#141A17]">
                  Woven Rattan Accent Chair
                </h4>
              </div>
            </div>
          </div>

          {/* Right: Editorial Headline & Statement */}
          <div className="lg:col-span-4 space-y-6 reveal reveal-right delay-300">

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E86034]"></span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#2D4A3E]">
                Operational Permanence
              </span>
            </div>

            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl text-[#141A17] leading-[1.1]">
              Lasting{' '}
              <span className="inline-flex items-center justify-center align-middle mx-0.5 w-8 h-8 rounded-full bg-[#E86034] text-white text-xs">
                ✦
              </span>{' '}
              quality <br />
              meets timeless <br />
              <span className="italic">financial structure</span>
            </h2>

            <p className="text-xs sm:text-sm text-[#4E5B55] leading-relaxed">
              Every sales order, supplier consignment, and payment installment is permanently recorded with complete audit trails and double-entry accuracy.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#2D4A3E] text-white flex items-center justify-center text-[10px]">
                  ✓
                </div>
                <span className="text-xs font-semibold text-[#141A17]">Complete Supplier Bill Verification</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#2D4A3E] text-white flex items-center justify-center text-[10px]">
                  ✓
                </div>
                <span className="text-xs font-semibold text-[#141A17]">Automated Customer Payment Allocation</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#2D4A3E] text-white flex items-center justify-center text-[10px]">
                  ✓
                </div>
                <span className="text-xs font-semibold text-[#141A17]">Real-time Bank & Cash Book Reconciliations</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
