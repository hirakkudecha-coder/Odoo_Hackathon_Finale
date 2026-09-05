import React from 'react';
import quoteBannerGraphic from '../../assets/images/quote_banner_graphic.png';

export const GreetingBanner = ({ userName = 'Nikita' }) => {
  // Dynamically calculate greeting based on local time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 22) return 'Good Evening';
    return 'Good Night';
  };

  const greeting = getGreeting();

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 mb-4">
      
      {/* Left: Dynamic Greeting Block */}
      <div className="flex flex-col justify-center text-left">
        <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#141A17] tracking-tight font-bold">
          {greeting}, {userName}
        </h1>
        <p className="text-xs sm:text-sm text-[#5B6963] mt-1">
          Here's what's happening with your furniture business today.
        </p>
      </div>

      {/* Right: Provided Quote & Design Studio Banner Graphic */}
      <div className="w-full lg:w-auto flex justify-start lg:justify-end">
        <div className="rounded-2xl border border-[#E8E1D5] bg-white/90 overflow-hidden shadow-2xs hover:shadow-xs transition-all duration-300 w-full sm:w-[380px] md:w-[420px] lg:w-[440px] shrink-0">
          <img 
            src={quoteBannerGraphic} 
            alt="Good design is good business - Thomas J. Watson" 
            className="w-full h-22 sm:h-24 md:h-26 object-cover object-center block"
          />
        </div>
      </div>

    </div>
  );
};

export default GreetingBanner;
