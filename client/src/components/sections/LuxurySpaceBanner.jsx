import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import cyanArmchair from '../../assets/images/cyan_armchair.png';
import creamLoungeChair from '../../assets/images/cream_lounge_chair.png';

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

        {/* Balanced Dual Luxury Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

          {/* Left Companion Luxury Card (Warm Almond / Editorial Sand) */}
          <div className="reveal reveal-left delay-150 flex">
            <div className="w-full rounded-3xl bg-[#FBF4EC] p-6 sm:p-8 md:p-10 border border-[#EADCCB] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 group hover:shadow-md transition-all duration-300">

              {/* Cream Lounge Chair Image Showcase */}
              <div className="w-full md:w-1/2 flex justify-center order-1 md:order-1">
                <div className="relative">
                  <div className="absolute -inset-4 bg-white/50 rounded-full blur-xl"></div>
                  <img
                    src={creamLoungeChair}
                    alt="Cream Modern Lounge Chair"
                    className="relative w-56 sm:w-64 h-48 sm:h-56 object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Text Side */}
              <div className="w-full md:w-1/2 space-y-3.5 text-left order-2 md:order-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E86034] text-white text-[10px] font-bold uppercase tracking-wider">
                    #Atelier
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-[#7A5038] text-[10px] font-bold uppercase tracking-wider border border-[#EADCCB]">
                    #Ledger Sync
                  </span>
                </div>

                <h3 className="font-serif-luxury font-bold text-2xl sm:text-3xl text-[#2C211A] leading-snug">
                  Precision craft meets automated accounts
                </h3>

                <p className="text-xs sm:text-sm text-[#615147] leading-relaxed">
                  Track procurement batches, custom upholstery finishes, and real-time inventory valuations across all showrooms.
                </p>

                <div className="pt-2">
                  <a
                    href="#catalogue"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2C211A] hover:text-[#E86034] transition-colors group/link"
                  >
                    <span>Explore Catalogue & Assets</span>
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Right Mint / Cyan Feature Card with Cyan Armchair */}
          <div className="reveal reveal-right delay-200 flex">
            <div className="w-full rounded-3xl bg-[#D2F0DE] p-6 sm:p-8 md:p-10 border border-[#B8E5CA] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 group hover:shadow-md transition-all duration-300">

              {/* Cyan Accent Armchair Image */}
              <div className="w-full md:w-1/2 flex justify-center order-1 md:order-1">
                <div className="relative">
                  <div className="absolute -inset-4 bg-white/40 rounded-full blur-xl"></div>
                  <img
                    src={cyanArmchair}
                    alt="Cyan Velvet Armchair"
                    className="relative w-56 sm:w-64 h-48 sm:h-56 object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Text Side */}
              <div className="w-full md:w-1/2 space-y-3.5 text-left order-2 md:order-2">
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
                  Our architecture connects catalogue variants, purchase orders, customer invoices, and automated accounts in one rhythm.
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

export default LuxurySpaceBanner;
