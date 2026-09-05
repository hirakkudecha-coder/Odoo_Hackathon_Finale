import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const SalesPurchasesChart = () => {
  const [filter, setFilter] = useState('This Year');

  const data = [
    { month: 'Jan', sales: 55, purchases: 35 },
    { month: 'Feb', sales: 70, purchases: 50 },
    { month: 'Mar', sales: 68, purchases: 52 },
    { month: 'Apr', sales: 62, purchases: 65 },
    { month: 'May', sales: 75, purchases: 72 },
    { month: 'Jun', sales: 65, purchases: 70 },
    { month: 'Jul', sales: 80, purchases: 74 },
    { month: 'Aug', sales: 95, purchases: 62 },
    { month: 'Sep', sales: 100, purchases: 68 },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E8E1D5] shadow-2xs flex flex-col justify-between h-full">
      
      {/* Header: Title + Legend + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-2 border-b border-[#F0EAE1]">
        <div className="text-left">
          <h3 className="font-serif font-bold text-base sm:text-lg text-[#141A17]">
            Sales vs Purchases
          </h3>
        </div>

        <div className="flex items-center gap-4">
          {/* Legend */}
          <div className="flex items-center gap-3 text-[11px] font-medium text-[#55635D]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#244637]"></span>
              <span>Sales</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#D65D33]"></span>
              <span>Purchases</span>
            </div>
          </div>

          {/* Timeframe selector */}
          <div className="relative">
            <button className="flex items-center gap-1.5 text-[11px] font-semibold text-[#4A5550] bg-[#FAF8F5] border border-[#E4DCD0] px-2.5 py-1 rounded-lg hover:bg-[#F2ECE3] transition-colors cursor-pointer">
              <span>{filter}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative flex items-end justify-between pt-6 pb-2 h-52 w-full gap-2 sm:gap-3">
        
        {/* Y Axis Guide Lines & Labels */}
        <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between pointer-events-none text-[9px] text-[#9AA7A1] pr-2">
          <div className="flex items-center w-full">
            <span className="w-6 text-left shrink-0">2L</span>
            <div className="flex-1 border-b border-dashed border-[#EAE3D8]"></div>
          </div>
          <div className="flex items-center w-full">
            <span className="w-6 text-left shrink-0">1.5L</span>
            <div className="flex-1 border-b border-dashed border-[#EAE3D8]"></div>
          </div>
          <div className="flex items-center w-full">
            <span className="w-6 text-left shrink-0">1L</span>
            <div className="flex-1 border-b border-dashed border-[#EAE3D8]"></div>
          </div>
          <div className="flex items-center w-full">
            <span className="w-6 text-left shrink-0">50K</span>
            <div className="flex-1 border-b border-dashed border-[#EAE3D8]"></div>
          </div>
          <div className="flex items-center w-full">
            <span className="w-6 text-left shrink-0">0</span>
            <div className="flex-1 border-b border-[#D8CFBF]"></div>
          </div>
        </div>

        {/* Dual Bars Container */}
        <div className="flex items-end justify-between w-full pl-8 z-10">
          {data.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1 flex-1">
              <div className="flex items-end gap-1 h-36">
                {/* Sales Bar (Forest Green) */}
                <div
                  style={{ height: `${item.sales}%` }}
                  className="w-2.5 sm:w-3.5 bg-[#244637] hover:bg-[#183327] rounded-t-xs transition-all duration-300 group relative cursor-pointer"
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-[#1A1F1D] text-white text-[9px] px-1.5 py-0.5 rounded shadow-sm pointer-events-none whitespace-nowrap z-20">
                    ₹{(item.sales * 2450).toLocaleString()}
                  </div>
                </div>

                {/* Purchases Bar (Warm Terracotta) */}
                <div
                  style={{ height: `${item.purchases}%` }}
                  className="w-2.5 sm:w-3.5 bg-[#D65D33] hover:bg-[#B84720] rounded-t-xs transition-all duration-300 group relative cursor-pointer"
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-[#1A1F1D] text-white text-[9px] px-1.5 py-0.5 rounded shadow-sm pointer-events-none whitespace-nowrap z-20">
                    ₹{(item.purchases * 1950).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Month label */}
              <span className="text-[10px] font-medium text-[#65736D] mt-1">
                {item.month}
              </span>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default SalesPurchasesChart;
