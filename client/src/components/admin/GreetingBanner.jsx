import React from 'react';
import quoteBannerGraphic from '../../assets/images/quote_banner_graphic.png';

export const GreetingBanner = () => {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 mb-4">
      
      {/* Left: Greeting Block */}
      <div className="flex flex-col justify-center text-left">
        <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#141A17] tracking-tight font-bold">
          Good Morning, Nikita
        </h1>
        <p className="text-xs sm:text-sm text-[#5B6963] mt-1">
          Here's what's happening with your furniture business today.
        </p>
      </div>

      {/* Right: Provided Quote & Design Studio Banner Graphic */}
      <div className="w-full lg:w-auto flex justify-start lg:justify-end">
        <div className="rounded-2xl border border-[#E8E1D5] bg-white overflow-hidden shadow-2xs hover:shadow-md transition-shadow duration-300 max-w-lg xl:max-w-xl w-full">
          <img 
            src={quoteBannerGraphic} 
            alt="Good design is good business - Thomas J. Watson" 
            className="w-full h-auto max-h-28 sm:max-h-32 object-contain sm:object-cover object-center"
          />
        </div>
      </div>

    </div>
  );
};

export default GreetingBanner;
