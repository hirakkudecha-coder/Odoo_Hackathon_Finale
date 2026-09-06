import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import livingRoomHero from '../../assets/living_room_hero.png';
import oliveChairImg from '../../assets/images/olive_chair.png';
import blueSofaImg from '../../assets/images/blue_sofa.png';

const SLIDES = [
  {
    headline: 'Crafting Spaces,\nGrowing Together.',
    subtext: 'Track sales, manage inventory, control finances — all in one place.',
    image: livingRoomHero,
    tag: 'INTEGRATED ERP & LEDGER',
  },
  {
    headline: 'Crafting Spaces,\nManaging Business.',
    subtext: 'Manage customers, vendors, products, sales, purchases, and accounting seamlessly.',
    image: oliveChairImg,
    tag: 'DOUBLE-ENTRY ACCOUNTING',
  },
  {
    headline: 'Precision Accounting,\nTimeless Design.',
    subtext: 'Real-time financial intelligence, balance sheets, and automated payment tracking.',
    image: blueSofaImg,
    tag: 'FINANCIAL INTELLIGENCE',
  },
];

export const BrandPanel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  };

  const slide = SLIDES[currentSlide];

  return (
    <div className="relative w-full h-full min-h-64 sm:min-h-80 md:min-h-125 bg-[#1E332A] text-[#FAF8F5] overflow-hidden rounded-3xl flex flex-col justify-between p-4 sm:p-6 lg:p-7 select-none shadow-xl">
      {/* Background Furniture Visual */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={slide.image}
          alt="Urban Furniture Interior"
          className="w-full h-full object-cover object-center transition-all duration-700 scale-105 ease-out"
        />
        {/* Deep Green Luxury Gradient & Organic Dark Curved Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-[#14231C]/90 via-[#1E332A]/70 to-[#14231C]/95 mix-blend-multiply" />
        <div className="absolute inset-0 bg-radial-at-t from-[#2D4A3E]/60 via-transparent to-[#101A15]/90" />
        
        {/* Editorial Curved Decorative Vector Wave */}
        <svg
          className="absolute -bottom-10 left-0 right-0 w-full text-[#14231C]/60 pointer-events-none opacity-40"
          viewBox="0 0 1440 320"
          fill="currentColor"
        >
          <path d="M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,165.3C672,171,768,213,864,224C960,235,1056,213,1152,186.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
      </div>

      {/* Top Brand Header - Recreated Vector Brand Logo */}
      <div className="relative z-10 flex items-center">
        <BrandLogo light={true} align="left" size="default" />
      </div>

      {/* Middle Hero Visual Editorial Headline & Copy */}
      <div className="relative z-10 my-auto py-2.5 sm:py-3 space-y-2 sm:space-y-3 max-w-md">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[9.5px] font-semibold tracking-widest uppercase text-[#FAF8F5]">
          <Sparkles className="w-3 h-3 text-[#E86034]" />
          <span>{slide.tag}</span>
        </div>

        <h1 className="font-serif-luxury text-xl sm:text-2xl lg:text-[32px] font-bold text-[#FAF8F5] leading-[1.2] tracking-tight whitespace-pre-line drop-shadow-sm">
          {slide.headline}
        </h1>

        <p className="text-xs sm:text-sm text-[#D7E2DC] leading-relaxed font-normal max-w-sm drop-shadow-2xs">
          {slide.subtext}
        </p>
      </div>

      {/* Bottom Carousel Controls & Trust Indicator */}
      <div className="relative z-10 pt-3 pb-0.5 flex items-center justify-between border-t border-white/15">
        {/* Navigation Arrows + Dots */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="w-7 h-7 rounded-full border border-white/30 bg-black/20 hover:bg-white/20 text-[#FAF8F5] flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentSlide === idx
                    ? 'w-5 h-2 bg-[#54B689]'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Slide"
            className="w-7 h-7 rounded-full border border-white/30 bg-black/20 hover:bg-white/20 text-[#FAF8F5] flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Security Badge */}
        <div className="hidden sm:flex items-center gap-1.5 text-[10.5px] text-[#C1CEC8]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#54B689]" />
          <span>Verified Enterprise Platform</span>
        </div>
      </div>
    </div>
  );
};

export default BrandPanel;
