import React from 'react';

export const BrandLogo = ({ className = '', light = false }) => {
  return (
    <div className={`inline-flex flex-col items-center justify-center text-center group cursor-pointer select-none bg-transparent transition-transform duration-300 hover:scale-[1.02] ${className}`}>
      
      {/* Architectural Arch Pavilion Icon — Forest Green */}
      <div className={`w-8 h-8 mb-1.5 flex items-center justify-center transition-colors duration-300 ${
        light ? 'text-[#E5D2B8] group-hover:text-[#FAF8F5]' : 'text-[#2D4A3E] group-hover:text-[#1E332A]'
      }`}>
        <svg 
          viewBox="0 0 40 44" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full stroke-current"
          strokeWidth="2.3"
        >
          {/* Outer Arch */}
          <path 
            d="M6 40V18C6 10.268 12.268 4 20 4C27.732 4 34 10.268 34 18V40" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* Inner Arch */}
          <path 
            d="M12 40V19C12 14.5817 15.5817 11 20 11C24.4183 11 28 14.5817 28 19V40" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* Horizontal Transom Beam */}
          <path 
            d="M6 22H34" 
            strokeLinecap="round" 
          />
          {/* Center Inner Doorway Arch */}
          <path 
            d="M17 40V29C17 27.3431 18.3431 26 20 26C21.6569 26 23 27.3431 23 29V40" 
            strokeLinecap="round" 
          />
          {/* Top Keystone Spire */}
          <path 
            d="M20 4V11" 
            strokeLinecap="round" 
          />
        </svg>
      </div>

      {/* Main Brand Name — Forest Green */}
      <span className={`font-serif tracking-[0.16em] text-[12px] sm:text-[13px] font-bold leading-none uppercase transition-colors duration-300 ${
        light ? 'text-[#FAF8F5] group-hover:text-[#E5D2B8]' : 'text-[#2D4A3E] group-hover:text-[#172620]'
      }`}>
        Urban Furniture
      </span>

      {/* Subtitle */}
      <span className={`text-[8px] sm:text-[8.5px] tracking-[0.26em] uppercase font-bold mt-1 leading-none ${
        light ? 'text-[#8EABA0]' : 'text-[#566B62]'
      }`}>
        Accounting System
      </span>
    </div>
  );
};

export default BrandLogo;
