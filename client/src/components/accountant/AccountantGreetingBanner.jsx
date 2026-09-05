import React from 'react';
import { Calendar } from 'lucide-react';
import quoteBannerImg from '../../assets/images/quote_banner_graphic.png';

export const AccountantGreetingBanner = () => {
  return (
    <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-1 pb-2">
      
      {/* Left: Greeting and Subtitle */}
      <div className="flex-1">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141A17] tracking-tight">
          Good Morning, Aarav
        </h1>
        <p className="text-xs sm:text-sm text-[#5D6B64] mt-1 font-sans">
          Keep the numbers flowing. Here’s your accounting snapshot for today.
        </p>
      </div>

      {/* Middle & Right Collage: Motivational Quote, Framed Graphic & Date Pill */}
      <div className="flex items-center gap-4 sm:gap-6 self-stretch md:self-auto justify-between md:justify-end">
        
        {/* Quote Block */}
        <div className="hidden xl:flex flex-col text-left max-w-xs pl-4 border-l-2 border-[#2D4A3E]/30 py-0.5">
          <p className="font-serif italic text-xs sm:text-[13px] text-[#1F3D30] font-medium leading-snug">
            “Accurate numbers build stronger businesses.”
          </p>
          <span className="text-[9.5px] uppercase tracking-widest text-[#7A8A82] font-bold mt-1">
            — UNKNOWN
          </span>
        </div>

        {/* Small Framed Desk Graphic */}
        <div className="hidden md:block w-28 h-16 rounded-xl overflow-hidden shadow-xs border border-[#2D4A3E]/15 bg-white/60 shrink-0">
          <img 
            src={quoteBannerImg} 
            alt="Accounting Workspace" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Date Badge Pill */}
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-[#2D4A3E]/15 shadow-2xs text-[#2D4A3E] font-medium text-xs whitespace-nowrap">
          <Calendar className="w-3.5 h-3.5 text-[#2D4A3E]" />
          <span className="font-semibold text-[#141A17]">Tue, 02 Sep 2025</span>
        </div>

      </div>

    </div>
  );
};

export default AccountantGreetingBanner;
