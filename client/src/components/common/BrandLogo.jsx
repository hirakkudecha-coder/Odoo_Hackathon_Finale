import React from 'react';

export const BrandLogo = ({ className = '', light = false, size = 'default', align = 'center' }) => {
  const isLeft = align === 'left';
  const iconSize = size === 'large' ? 'w-11 h-11 mb-2' : size === 'small' ? 'w-6 h-6 mb-1' : 'w-8 h-8 mb-1.5';
  const titleSize = size === 'large' ? 'text-[15px] sm:text-[16px]' : size === 'small' ? 'text-[11px]' : 'text-[12px] sm:text-[13px]';
  const subSize = size === 'large' ? 'text-[9.5px]' : size === 'small' ? 'text-[7.5px]' : 'text-[8.5px]';

  return (
    <div className={`inline-flex flex-col ${isLeft ? 'items-start text-left' : 'items-center justify-center text-center'} group select-none bg-transparent transition-transform duration-300 hover:scale-[1.02] ${className}`}>
      
      {/* Architectural Arch Pavilion Icon — Exact SVG Geometry */}
      <div className={`${iconSize} flex items-center justify-center transition-colors duration-300 ${
        light ? 'text-[#FAF8F5]' : 'text-[#2D4A3E]'
      }`}>
        <svg 
          viewBox="0 0 40 44" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full stroke-current"
          strokeWidth="2.4"
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

      {/* Main Brand Name */}
      <span className={`font-serif tracking-[0.18em] ${titleSize} font-bold leading-tight uppercase transition-colors duration-300 ${
        light ? 'text-[#FAF8F5]' : 'text-[#2D4A3E]'
      }`}>
        Urban Furniture
      </span>

      {/* Subtitle */}
      <span className={`${subSize} tracking-[0.28em] uppercase font-semibold mt-0.5 leading-tight ${
        light ? 'text-[#C5D4CD]' : 'text-[#566B62]'
      }`}>
        Accounting System
      </span>
    </div>
  );
};

export default BrandLogo;
