import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import yellowOttoman from '../../assets/images/yellow_ottoman.png';
import oakCredenza from '../../assets/images/oak_credenza.png';

export const SpacesLivingSection = ({ onOpenAuth }) => {
  return (
    <section className="py-20 bg-[#FAF8F5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left: Editorial Statement & Link */}
          <div className="lg:col-span-4 space-y-6 reveal reveal-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAE2D4] text-[#2D4A3E] text-[11px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#E86034]" />
              Design Elevated
            </div>

            <h2 className="font-serif-luxury text-4xl sm:text-5xl text-[#141A17] leading-[1.08]">
              Creating spaces <br />
              <span className="italic font-normal">you'll love</span> <br />
              to live in
            </h2>

            <p className="text-xs sm:text-sm text-[#4E5B55] leading-relaxed">
              When financial operations and supply chains flow without friction, your designers, showroom managers, and craftsmen are liberated to focus on what matters: crafting exceptional living spaces.
            </p>

            <div className="pt-2">
              <button
                onClick={() => onOpenAuth && onOpenAuth('signup')}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#2D4A3E] hover:text-[#E86034] border-b-2 border-[#2D4A3E] pb-1 transition-all cursor-pointer"
              >
                <span>Learn More About the Platform</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center: Soft Peach/Pink Card with Mustard Yellow Ottoman */}
          <div className="lg:col-span-4 reveal reveal-scale delay-150">
            <div className="rounded-3xl bg-[#FFDFD6] p-6 sm:p-7 border border-[#F5C7BC] shadow-sm flex flex-col justify-between h-96 group hover:scale-[1.01] transition-transform duration-500">

              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-white/80 text-[#8B341B] text-[10px] font-bold uppercase tracking-wider">
                  #Furniture Design
                </span>
                <span className="text-[10px] font-bold text-[#8B341B] uppercase tracking-wider">
                  Model UF-OT-11
                </span>
              </div>

              {/* Mustard Yellow Ottoman Image */}
              <div className="py-3 flex justify-center">
                <img
                  src={yellowOttoman}
                  alt="Minimalist Mustard Yellow Storage Ottoman"
                  className="w-48 h-40 object-contain drop-shadow-xl group-hover:-translate-y-1 transition-transform duration-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E86034]"></span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A2A14]">
                    Handcrafted Finish
                  </span>
                </div>
                <h4 className="font-serif-luxury font-bold text-lg text-[#141A17] uppercase tracking-tight">
                  Furniture that lasts a lifetime
                </h4>
              </div>

            </div>
          </div>

          {/* Right: Wooden Dining Console with Books */}
          <div className="lg:col-span-4 space-y-4 reveal reveal-right delay-250">
            <div className="rounded-3xl bg-white p-6 border border-[#E6DFD4] shadow-xs group hover:shadow-md transition-shadow">

              <div className="h-52 rounded-2xl bg-[#F8F5EE] flex items-center justify-center overflow-hidden mb-4 p-4">
                <img
                  src={oakCredenza}
                  alt="Nordic Solid Oak Console with Books"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#2D4A3E]">
                  Luxury You Can Live In
                </span>
                <h4 className="font-serif-luxury font-bold text-base text-[#141A17]">
                  Atelier Dining & Console Bench
                </h4>
                <p className="text-[11px] text-[#6A7670]">
                  Track batch costs, supplier timber grade, and automated margin allocations.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
