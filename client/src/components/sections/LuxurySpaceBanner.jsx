import React from 'react';
import { ArrowUpRight, Sparkles, ArrowRight } from 'lucide-react';
import cyanArmchair from '../../assets/images/cyan_armchair.png';

export const LuxurySpaceBanner = () => {
  return (
    <section className="py-16 bg-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Editorial Heading with Aesthetic Pill */}
        <div className="text-center space-y-3 mb-12 reveal">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#2D4A3E]/15 text-[11px] font-bold uppercase tracking-widest text-[#2D4A3E]">
            <Sparkles className="w-3.5 h-3.5 text-[#E86034]" />
            Aesthetic Harmony
          </div>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-[#141A17] tracking-tight">
            Luxury in every transaction
          </h2>
          <p className="text-sm text-[#55635D] max-w-lg mx-auto">
            From the initial quotation to final bank reconciliation, experience fluidity designed for furniture ateliers.
          </p>
        </div>

        {/* Asymmetric composition matching reference */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left Asymmetric Badges */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col justify-center items-center lg:items-end gap-6 reveal reveal-left delay-150">

            {/* Yellow Round Badge */}
            <div className="w-40 sm:w-48 p-4 rounded-3xl bg-[#F6ED78] border border-[#E0D75D] shadow-xs flex flex-col items-center text-center group hover:rotate-1 transition-transform">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl shadow-xs mb-2">
                🛋️
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#353205]">
                Live the Look
              </span>
              <p className="text-[10px] text-[#4F4B08] mt-1 leading-tight">
                Immerse yourself in precision craftsmanship and double-entry accuracy.
              </p>
            </div>

            {/* Orange Circular CTA Badge */}
            <div className="flex items-center gap-3 bg-[#FAF8F5] p-3 rounded-full border border-[#E6DFD4] shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#E86034] text-white flex items-center justify-center shadow-xs">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <div className="pr-3 text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#66726D]">Flow & Balance</p>
                <p className="text-xs font-serif font-bold text-[#141A17]">Bringing Warmth to Every Room</p>
              </div>
            </div>

          </div>

          {/* Right Mint / Cyan Feature Card with Cyan Armchair */}
          <div className="lg:col-span-8 reveal reveal-right delay-200">
            <div className="rounded-3xl bg-[#D2F0DE] p-6 sm:p-10 border border-[#B8E5CA] shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 group">

              {/* Cyan Accent Armchair Image */}
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-4 bg-white/40 rounded-full blur-xl"></div>
                  <img
                    src={cyanArmchair}
                    alt="Cyan Velvet Armchair"
                    className="relative w-64 sm:w-72 h-52 sm:h-60 object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Text side */}
              <div className="w-full md:w-1/2 space-y-4 text-left">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#183C28] text-white text-[10px] font-bold uppercase tracking-wider">
                    #Recom
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-[#183C28] text-[10px] font-bold uppercase tracking-wider border border-[#183C28]/20">
                    #Bespoke Ledger
                  </span>
                </div>

                <h3 className="font-serif-luxury font-bold text-2xl sm:text-3xl text-[#143623] leading-snug">
                  Curated workflows for your furniture business
                </h3>

                <p className="text-xs sm:text-sm text-[#26533A] leading-relaxed">
                  Our architecture connects catalogue variants, purchase orders, customer invoices, and automated general ledger accounts in one unified rhythm.
                </p>

                <div className="pt-2">
                  <a
                    href="#sales"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#143623] hover:text-[#E86034] transition-colors group/link"
                  >
                    <span>View Sales & Invoicing Flow</span>
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
