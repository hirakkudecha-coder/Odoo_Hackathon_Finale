import React from 'react';
import quoteGraphic from '../../assets/images/quote_banner_graphic.png';

export const SuperAdminGreetingBanner = ({ userName = 'Nikita' }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 sm:gap-6 bg-transparent">
      {/* Left: System Greeting & Subtitle */}
      <div className="text-left space-y-1">
        <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#141A17] tracking-tight font-bold">
          {getGreeting()}, {userName}
        </h1>
        <p className="text-xs sm:text-sm text-[#5C6B64] font-medium">
          Here's what's happening across your system today.
        </p>
      </div>

      {/* Right: Luxury Editorial Quote Banner matching screenshot */}
      <div className="w-full lg:w-auto flex justify-start lg:justify-end">
        <div className="rounded-2xl border border-[#E4DDD2] bg-white/95 overflow-hidden shadow-2xs hover:shadow-xs transition-all duration-300 w-full sm:w-[380px] md:w-[420px] lg:w-[460px] shrink-0 relative flex items-center p-3 sm:p-4 gap-4 bg-gradient-to-r from-[#FAF8F5] to-[#F5EFE6]">
          
          <div className="flex-1 text-left">
            <span className="font-serif text-2xl text-[#C29B38] leading-none block select-none">“</span>
            <p className="font-serif italic font-medium text-xs sm:text-[13px] text-[#2D3A34] -mt-2 leading-snug">
              Better systems build brighter futures.
            </p>
            <span className="text-[9.5px] uppercase tracking-wider font-bold text-[#8A9892] mt-1 block">
              Urban Furniture Global Operations
            </span>
          </div>

          <div className="w-20 sm:w-24 h-16 sm:h-18 rounded-xl overflow-hidden shrink-0 border border-[#E5DDD0] shadow-inner bg-[#EFE9DF]">
            <img 
              src={quoteGraphic} 
              alt="Better systems build brighter futures" 
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default SuperAdminGreetingBanner;
