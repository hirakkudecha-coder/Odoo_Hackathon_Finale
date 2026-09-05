import React, { useState } from 'react';
import { ChevronDown, TrendingUp } from 'lucide-react';

export const ProfitLossCard = () => {
  const [timeframe, setTimeframe] = useState('This Year');

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E8E1D5] shadow-2xs flex flex-col justify-between h-full text-left">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F0EAE1]">
        <h3 className="font-serif font-bold text-base sm:text-lg text-[#141A17]">
          Profit & Loss Overview
        </h3>

        <button className="flex items-center gap-1.5 text-[11px] font-semibold text-[#4A5550] bg-[#FAF8F5] border border-[#E4DCD0] px-2.5 py-1 rounded-lg hover:bg-[#F2ECE3] transition-colors cursor-pointer">
          <span>{timeframe}</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Breakdown Items */}
      <div className="space-y-3 my-2 text-xs">
        
        {/* Sales Income */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1F6E43]"></span>
            <span className="text-[#55635D] font-medium">Sales Income</span>
          </div>
          <span className="font-serif font-bold text-sm text-[#141A17]">
            ₹ 2,45,000
          </span>
        </div>

        {/* Purchase Costs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D65D33]"></span>
            <span className="text-[#55635D] font-medium">Purchase Costs</span>
          </div>
          <span className="font-serif font-bold text-sm text-[#141A17]">
            ₹ 1,32,500
          </span>
        </div>

        {/* Operating Expenses */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8E9C94]"></span>
            <span className="text-[#55635D] font-medium">Operating Expenses</span>
          </div>
          <span className="font-serif font-bold text-sm text-[#141A17]">
            ₹ 31,000
          </span>
        </div>

        {/* Net Profit Bar */}
        <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between">
          <span className="font-semibold text-xs text-[#2A3631]">
            Net Profit
          </span>
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-base text-[#141A17]">
              ₹ 81,500
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#E5F7ED] text-[#1E7445] text-[10px] font-bold">
              ↑ 14%
            </span>
          </div>
        </div>

      </div>

      {/* Motivational Margin Callout Banner */}
      <div className="mt-4 p-3 rounded-xl bg-[#EAF7EE] border border-[#CDECD7] flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-[#1F6E43] text-white flex items-center justify-center shrink-0">
          <TrendingUp className="w-3.5 h-3.5" />
        </div>
        <p className="text-[11px] text-[#1F5436] leading-tight">
          Your profit margin has improved by <strong className="font-bold">14%</strong> compared to last year.
        </p>
      </div>

    </div>
  );
};

export default ProfitLossCard;
