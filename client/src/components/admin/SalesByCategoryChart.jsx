import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const SalesByCategoryChart = () => {
  const [filter, setFilter] = useState('This Month');

  const categories = [
    { name: 'Chairs', percentage: 28, color: '#244637' },
    { name: 'Tables', percentage: 24, color: '#D65D33' },
    { name: 'Sofas', percentage: 20, color: '#E5A96E' },
    { name: 'Storage', percentage: 16, color: '#B0C2B9' },
    { name: 'Decor', percentage: 8, color: '#7E9187' },
    { name: 'Others', percentage: 4, color: '#3A4B43' },
  ];

  // SVG Donut calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E8E1D5] shadow-2xs text-left h-full flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F0EAE1]">
        <h3 className="font-serif font-bold text-base sm:text-lg text-[#141A17]">
          Sales by Category
        </h3>

        <button className="flex items-center gap-1.5 text-[11px] font-semibold text-[#4A5550] bg-[#FAF8F5] border border-[#E4DCD0] px-2.5 py-1 rounded-lg hover:bg-[#F2ECE3] transition-colors cursor-pointer">
          <span>{filter}</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Donut & Legend Container */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-auto">
        
        {/* Multi-Segment SVG Donut */}
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {categories.map((cat, idx) => {
              const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((cumulativePercent / 100) * circumference);
              cumulativePercent += cat.percentage;

              return (
                <circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke={cat.color}
                  strokeWidth="12"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  fill="transparent"
                  className="hover:opacity-90 transition-opacity cursor-pointer"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 pointer-events-none">
            <span className="font-serif font-bold text-xs text-[#141A17] leading-tight">
              ₹ 2,45,000
            </span>
            <span className="text-[8.5px] uppercase tracking-wider text-[#7B8A84] mt-0.5">
              Total Sales
            </span>
          </div>
        </div>

        {/* Legend Grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full sm:w-auto text-xs">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: cat.color }}
                ></span>
                <span className="text-[#55635D] text-[11px] font-medium">
                  {cat.name}
                </span>
              </div>
              <span className="font-semibold text-[#141A17] text-[11px]">
                {cat.percentage}%
              </span>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default SalesByCategoryChart;
