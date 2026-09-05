import React from 'react';
import { TrendingUp, Sparkles, Target, ArrowUpRight } from 'lucide-react';
import dashboardBannerGraphic from '../../assets/images/dashboard_banner_graphic.jpg';

export const GreetingBanner = () => {
  return (
    <div className="flex flex-col lg:flex-row items-stretch justify-between gap-5 mb-2">
      
      {/* Left: Greeting Block */}
      <div className="flex flex-col justify-center text-left">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F0EC] text-[#2D4A3E] border border-[#D0E0D7]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
            Live Studio Operations
          </span>
          <span className="text-[11px] text-[#85988F] font-medium hidden sm:inline">
            • Q3 Fiscal Year 2025-26
          </span>
        </div>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#141A17] tracking-tight font-bold">
          Good Morning, Nikita
        </h1>
        <p className="text-xs sm:text-sm text-[#5B6963] mt-1">
          Here's what's happening with your furniture business today.
        </p>
      </div>

      {/* Right: Modern Studio Performance & Graphic Banner Card */}
      <div className="bg-gradient-to-r from-white to-[#FAF6F0] rounded-2xl border border-[#E8E1D5] p-3.5 sm:p-4 flex items-center justify-between gap-4 sm:gap-6 shadow-2xs hover:shadow-md transition-all duration-300 group">
        
        {/* Metric & Target Highlights */}
        <div className="text-left space-y-2">
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded-md bg-[#2D4A3E]/10 text-[#2D4A3E]">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-[11px] font-bold text-[#14231C] tracking-wide uppercase">
              Daily Target
            </span>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#15803D] bg-[#DCFCE7] px-1.5 py-0.5 rounded-md border border-[#BBF7D0]">
              <TrendingUp className="w-3 h-3" />
              +18.4%
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-bold font-serif text-[#14231C]">
                ₹ 2,45,000
              </span>
              <span className="text-[11px] text-[#7A8881]">
                / ₹ 3,00,000
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-36 sm:w-44 h-1.5 bg-[#EAE3D6] rounded-full mt-1.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#2D4A3E] to-[#E86034] rounded-full transition-all duration-500"
                style={{ width: '82%' }}
              />
            </div>
          </div>

          <p className="text-[10px] text-[#7A8881] font-medium">
            82% achieved • <span className="text-[#2D4A3E] font-semibold">14 orders remaining</span>
          </p>
        </div>

        {/* 3D Luxury Graphic Thumbnail with Hover Zoom */}
        <div className="w-28 sm:w-36 h-20 sm:h-22 rounded-xl bg-[#EBE5DA] relative overflow-hidden border border-[#DDD4C7] shrink-0 shadow-inner group-hover:border-[#2D4A3E]/30 transition-colors">
          <img 
            src={dashboardBannerGraphic} 
            alt="Luxury Studio Design Render" 
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
          <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-white">
            <span className="text-[9px] font-semibold tracking-wider uppercase drop-shadow-xs">
              Studio Suite
            </span>
            <ArrowUpRight className="w-3 h-3 opacity-90 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

      </div>

    </div>
  );
};

export default GreetingBanner;
