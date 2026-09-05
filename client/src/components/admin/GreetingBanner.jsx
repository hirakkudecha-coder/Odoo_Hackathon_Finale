import React from 'react';
import livingRoomHero from '../../assets/images/living_room_hero.png';

export const GreetingBanner = () => {
  return (
    <div className="flex flex-col lg:flex-row items-stretch justify-between gap-6 mb-6">
      
      {/* Left: Greeting Block */}
      <div className="flex flex-col justify-center text-left">
        <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#141A17] tracking-tight font-bold">
          Good Morning, Nikita
        </h1>
        <p className="text-xs sm:text-sm text-[#5B6963] mt-1">
          Here's what's happening with your furniture business today.
        </p>
      </div>

      {/* Right: Inspirational Quote Card matching reference */}
      <div className="bg-white/80 rounded-2xl border border-[#E8E1D5] px-6 py-4 flex items-center justify-between gap-6 shadow-2xs max-w-lg">
        <div className="text-left space-y-1">
          <p className="font-serif italic text-sm sm:text-base text-[#1C2E26] font-semibold leading-snug">
            “Good design is good business.”
          </p>
          <p className="text-[10px] tracking-widest uppercase font-bold text-[#8A9992]">
            — Thomas J. Watson
          </p>
        </div>

        {/* Living Room Graphic Vignette */}
        <div className="w-24 h-16 rounded-xl bg-[#F6F2EB] flex items-center justify-center p-1.5 shrink-0 border border-[#EAE3D6] overflow-hidden">
          <img 
            src={livingRoomHero} 
            alt="Design quote vignette" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>

    </div>
  );
};

export default GreetingBanner;
