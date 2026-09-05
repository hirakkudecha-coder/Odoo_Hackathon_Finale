import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { HeroSlideshow } from '../common/HeroSlideshow';
import { KineticText } from '../animations/KineticText';
import { TetherDraggable } from '../animations/TetherDraggable';
import { MagneticButton } from '../animations/MagneticButton';
import { AmbientMeshGlow } from '../animations/AmbientMeshGlow';
import { StackingCardsContainer } from '../animations/StackingCardsContainer';

export const HeroSection = ({ onOpenAuth }) => {
  return (
    <section className="relative pt-6 pb-6 md:pt-10 md:pb-8">
      {/* Subtle organic watermark texture */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-editorial-pattern"></div>

      {/* Fellou-style ambient mesh glow orbs */}
      <AmbientMeshGlow />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top Eyebrow & Headline Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          <div className="lg:col-span-6 space-y-4 reveal reveal-left">

            {/* Small subtle eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE4DC] text-[#2D4A3E] text-[11px] font-semibold uppercase tracking-widest border border-[#2D4A3E]/10">
              <span className="w-2 h-2 rounded-full bg-[#E86034] animate-pulse"></span>
              Urban Furniture • Accounting Platform
            </div>

            {/* Editorial Serif Headline matching reference with Fellou KineticText & TetherDraggable */}
            <h1 className="font-serif-luxury text-5xl sm:text-6xl md:text-7xl lg:text-[80px] leading-[1.02] tracking-tight text-[#141A17]">
              <KineticText text="Style" />{' '}
              <TetherDraggable className="mx-1 -mt-2 align-middle">
                <span className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#E8C547] text-[#1E332A] shadow-xs rotate-[-6deg] hover:rotate-0 transition-transform duration-300">
                  <span className="text-2xl sm:text-3xl">🪑</span>
                </span>
              </TetherDraggable>{' '}
              <KineticText text="Meets" /> <br className="hidden sm:inline" />
              <span className="italic font-normal">
                <KineticText text="Precision" delay={0.2} />
              </span>
            </h1>

            {/* Subtext */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-2">
              <p className="text-[#4A5550] text-sm sm:text-base max-w-md leading-relaxed font-normal">
                Rooted in a passion for craftsmanship and financial clarity. Manage sales, purchases, double-entry journals, and cash flow in one seamless editorial workspace.
              </p>
            </div>

            {/* CTAs with Magnetic Buttons & single-line button guarantee */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <MagneticButton
                onClick={() => onOpenAuth && onOpenAuth('signup')}
                className="whitespace-nowrap shrink-0 flex items-center gap-2.5 bg-[#2D4A3E] text-[#FAF8F5] text-xs sm:text-sm font-semibold uppercase tracking-wider px-5 sm:px-7 py-3 sm:py-3.5 rounded-full hover:bg-[#1E332A] transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer group"
              >
                <span>Curate Business</span>
                <span className="w-5 h-5 rounded-full bg-[#3D5E50] flex items-center justify-center text-[10px]">
                  01
                </span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </MagneticButton>

              <MagneticButton
                strength={0.2}
                className="whitespace-nowrap shrink-0 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#141A17] hover:text-[#2D4A3E] px-4 py-3 border-b-2 border-[#141A17]/30 hover:border-[#2D4A3E] transition-all"
              >
                <a href="#accounting" className="inline-flex items-center gap-2">
                  <span>Explore Ledger</span>
                  <span className="text-xs">⟶</span>
                </a>
              </MagneticButton>
            </div>
          </div>

          {/* Top Right User-Provided Living Room Ensembles Slideshow */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end reveal reveal-right delay-150 w-full">
            <HeroSlideshow />
          </div>
        </div>

        {/* Fellou-style Interactive Scroll-Driven Stacking Cards */}
        <StackingCardsContainer />

      </div>
    </section>
  );
};

export default HeroSection;
