import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Play, Sparkles, CheckCircle2, ChevronRight, Layers, DollarSign, TrendingUp } from 'lucide-react';
import livingRoomHero1 from '../../assets/living_room_hero.png';
import livingRoomHero2 from '../../assets/living_room_hero2.png';
import livingRoomHero3 from '../../assets/living_room_hero3.png';
import orangeSofa from '../../assets/images/orange_sofa.png';
import creamLoungeChair from '../../assets/images/cream_lounge_chair.png';
import botanicalPlant from '../../assets/images/botanical_plant.png';

export const HeroSection = ({ onOpenAuth }) => {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  const heroImages = [
    { src: livingRoomHero1, alt: 'Urban Furniture Living Room Ensemble 1' },
    { src: livingRoomHero2, alt: 'Urban Furniture Living Room Ensemble 2' },
    { src: livingRoomHero3, alt: 'Urban Furniture Living Room Ensemble 3' },
  ];

  // Auto change hero image every 2 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <section className="relative overflow-hidden pt-6 pb-20 md:pt-10 md:pb-28">
      {/* Subtle organic watermark texture */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-editorial-pattern"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top Eyebrow & Headline Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          <div className="lg:col-span-6 space-y-4 reveal reveal-left">

            {/* Small subtle eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE4DC] text-[#2D4A3E] text-[11px] font-semibold uppercase tracking-widest border border-[#2D4A3E]/10">
              <span className="w-2 h-2 rounded-full bg-[#E86034] animate-pulse"></span>
              Urban Furniture • Accounting Platform
            </div>

            {/* Editorial Serif Headline matching reference */}
            <h1 className="font-serif-luxury text-5xl sm:text-6xl md:text-7xl lg:text-[80px] leading-[1.02] tracking-tight text-[#141A17]">
              Style{' '}
              <span className="inline-flex items-center justify-center align-middle mx-1 -mt-2 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#E8C547] text-[#1E332A] shadow-xs rotate-[-6deg] hover:rotate-0 transition-transform duration-300">
                <span className="text-2xl sm:text-3xl">🪑</span>
              </span>{' '}
              Meets <br className="hidden sm:inline" />
              <span className="italic font-normal">Precision</span>
            </h1>

            {/* Subtext */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-2">
              <p className="text-[#4A5550] text-sm sm:text-base max-w-md leading-relaxed font-normal">
                Rooted in a passion for craftsmanship and financial clarity. Manage sales, purchases, double-entry journals, and cash flow in one seamless editorial workspace.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => onOpenAuth && onOpenAuth('signup')}
                className="flex items-center gap-2.5 bg-[#2D4A3E] text-[#FAF8F5] text-xs sm:text-sm font-semibold uppercase tracking-wider px-7 py-3.5 rounded-full hover:bg-[#1E332A] transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer group"
              >
                <span>Curate Business</span>
                <span className="w-5 h-5 rounded-full bg-[#3D5E50] flex items-center justify-center text-[10px]">
                  01
                </span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <a
                href="#accounting"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#141A17] hover:text-[#2D4A3E] px-4 py-3 border-b-2 border-[#141A17]/30 hover:border-[#2D4A3E] transition-all"
              >
                <span>Explore Ledger</span>
                <span className="text-xs">⟶</span>
              </a>
            </div>
          </div>

          {/* Top Right Auto-Rotating Living Room Ensemble (2-second interval, same position and size) */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-end justify-center reveal reveal-right delay-150">
            <div className="w-full max-w-xl relative flex items-center justify-center h-[320px] sm:h-[390px] md:h-[440px]">
              {heroImages.map((item, index) => (
                <img
                  key={index}
                  src={item.src}
                  alt={item.alt}
                  className={`absolute inset-0 m-auto w-full h-auto max-h-[380px] sm:max-h-[440px] object-contain filter drop-shadow-2xl transition-all duration-700 ease-in-out ${
                    currentHeroIndex === index
                      ? 'opacity-100 scale-100 z-10'
                      : 'opacity-0 scale-95 z-0 pointer-events-none'
                  }`}
                />
              ))}
            </div>

            {/* Subtle Carousel Progress Dots */}
            <div className="flex items-center gap-2 mt-2">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentHeroIndex(index)}
                  aria-label={`Slide ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                    currentHeroIndex === index
                      ? 'w-7 bg-[#2D4A3E]'
                      : 'w-2 bg-[#2D4A3E]/20 hover:bg-[#2D4A3E]/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Hero Collage Section - Exactly mirroring the Reference Image Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mt-6">

          {/* Left Mini Badge / Collection item */}
          <div className="lg:col-span-2 hidden lg:flex flex-col gap-4 reveal reveal-left delay-200">
            <div className="p-3.5 rounded-2xl bg-white border border-[#E6E0D6] shadow-xs hover:shadow-md transition-shadow">
              <div className="w-full h-24 rounded-xl bg-[#F5F2EB] flex items-center justify-center p-2 mb-2">
                <img
                  src={creamLoungeChair}
                  alt="Minimal Lounge Chair"
                  className="w-20 h-20 object-contain drop-shadow-sm"
                />
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#68756F]">
                Latest Releases
              </div>
              <div className="text-xs font-serif font-bold text-[#141A17]">
                Executive Series
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#E8EFE8] border border-[#2D4A3E]/10 text-[#2D4A3E]">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider mb-1">
                <TrendingUp className="w-3 h-3 text-[#2D4A3E]" /> Real-time Control
              </div>
              <p className="text-[11px] leading-tight text-[#3A4E45]">
                Instant journal postings for every furniture sale & inventory receipt.
              </p>
            </div>
          </div>

          {/* Central Showcase: Vibrant Orange Luxury Sofa with Model */}
          <div className="lg:col-span-6 relative reveal reveal-scale delay-300">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#FAF4EC] to-[#F1E9DE] p-6 sm:p-8 border border-[#E8E0D5] shadow-lg group">

              {/* Floating Headline inside sofa card */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#E86034] text-white flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-widest text-[#2D4A3E]">
                      Crafting Comfort
                    </span>
                    <span className="block font-serif-luxury font-bold text-lg text-[#141A17]">
                      One Ledger at a Time.
                    </span>
                  </div>
                </div>

                <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-white/80 backdrop-blur-xs text-[10px] font-semibold text-[#2D4A3E] uppercase border border-[#2D4A3E]/10">
                  Double-Entry Native
                </span>
              </div>

              {/* Main Image: Orange Sofa with Plaid Throw */}
              <div className="relative py-2 flex justify-center items-center">
                <img
                  src={orangeSofa}
                  alt="Luxury Modern Orange Living Room Sofa"
                  className="w-full max-h-72 sm:max-h-80 object-cover rounded-2xl shadow-xl group-hover:scale-[1.01] transition-transform duration-500"
                />

                {/* Floating Tag over Sofa */}
                <div className="absolute bottom-6 left-8 bg-[#FAF8F5]/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-[#2D4A3E]/10 flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <div className="text-left">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#66726D]">Inventory Value</p>
                    <p className="text-xs font-bold text-[#141A17]">₹4,28,500 <span className="text-[10px] font-normal text-emerald-600 font-sans">+14% MoM</span></p>
                  </div>
                </div>
              </div>

              {/* Bottom text */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#2D4A3E]/10 text-xs">
                <span className="text-[#55635D] italic font-serif">Aesthetic balance for retail & wholesale</span>
                <a href="#sales" className="font-semibold text-[#2D4A3E] hover:text-[#E86034] uppercase text-[11px] tracking-wider transition-colors">
                  View Sales Workflow →
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Live the Look Card + Tall Botanical Plant Card */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 reveal reveal-right delay-400">

            {/* Live the Look Pill Card */}
            <div className="p-5 rounded-3xl bg-white border border-[#E6E0D6] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#F3ECE1] flex items-center justify-center text-lg">
                  🛋️
                </div>
                <div>
                  <h3 className="font-serif-luxury font-bold text-base text-[#141A17]">Live the Look</h3>
                  <p className="text-[11px] text-[#6A7670]">Harmonized inventory & accounts</p>
                </div>
              </div>
              <p className="text-xs text-[#4A5550] leading-relaxed mb-3">
                Create an elegant operating space with our unified sales orders, customer invoices, and automated debit/credit balancing.
              </p>
              <a href="#accounting" className="inline-flex items-center text-[11px] font-bold uppercase tracking-wider text-[#2D4A3E] hover:text-[#E86034] gap-1 transition-colors">
                <span>View Collection & Ledger</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Lime / Sage Plant Card matching reference */}
            <div className="rounded-3xl bg-[#CEE69E]/80 p-5 border border-[#B3D377] flex items-center justify-between shadow-xs group hover:bg-[#CEE69E] transition-colors">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2A4418]">
                  Organic Harmony
                </span>
                <h4 className="font-serif-luxury font-bold text-base text-[#19300D] leading-tight">
                  Aesthetic minimalism is timeless
                </h4>
                <p className="text-[11px] text-[#334E1D] pt-1">
                  Balanced Books • Effortless Flow
                </p>
              </div>
              <div className="w-20 h-24 flex-shrink-0 flex items-center justify-center">
                <img
                  src={botanicalPlant}
                  alt="Minimal Plant"
                  className="w-16 h-20 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
