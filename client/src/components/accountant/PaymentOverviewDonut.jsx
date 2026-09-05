import React, { useState } from 'react';
import { ChevronDown, TrendingUp } from 'lucide-react';

export const PaymentOverviewDonut = () => {
  const [selectedRange, setSelectedRange] = useState('This Year');

  // Breakdown metrics
  // Paid = 68%, Pending = 25%, Overdue = 7%
  // Circumference for r=38 is 2 * PI * 38 = 238.76
  const circumference = 238.76;
  const paidDash = (68 / 100) * circumference;
  const pendingDash = (24 / 100) * circumference;
  const overdueDash = (8 / 100) * circumference;

  return (
    <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-[#2D4A3E]/10 shadow-2xs flex flex-col justify-between h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-sm font-bold text-[#141A17] font-serif tracking-tight">
          Payment Overview
        </h3>
        
        <div className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-[#2D4A3E] bg-[#FAF8F5] border border-[#2D4A3E]/15 rounded-lg cursor-pointer">
          <span>{selectedRange}</span>
          <ChevronDown className="w-3 h-3 text-[#566B62]" />
        </div>
      </div>

      {/* Middle Row: Donut Chart + Breakdown Legend */}
      <div className="flex items-center justify-between gap-3 my-auto py-2">
        
        {/* SVG Donut Chart */}
        <div className="relative w-28 h-28 xl:w-30 xl:h-30 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background track */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#EBE5DC"
              strokeWidth="11"
            />
            
            {/* Overdue (Taupe Gray) Segment */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#8E9B95"
              strokeWidth="11"
              strokeDasharray={`${overdueDash} ${circumference}`}
              strokeDashoffset={`-${paidDash + pendingDash}`}
              strokeLinecap="butt"
            />

            {/* Pending (Terracotta Orange) Segment */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#C86D3B"
              strokeWidth="11"
              strokeDasharray={`${pendingDash} ${circumference}`}
              strokeDashoffset={`-${paidDash}`}
              strokeLinecap="butt"
            />

            {/* Paid (Dark Forest Green) Segment */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#244335"
              strokeWidth="11"
              strokeDasharray={`${paidDash} ${circumference}`}
              strokeDashoffset="0"
              strokeLinecap="butt"
            />
          </svg>

          {/* Center Text in Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-bold font-serif text-[#141A17] leading-none">
              68%
            </span>
            <span className="text-[10px] font-semibold text-[#66706B] mt-0.5">
              Paid
            </span>
          </div>
        </div>

        {/* Legend List & Amounts */}
        <div className="flex flex-col gap-2 flex-1 pl-2">
          {/* Paid */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#244335]" />
              <span className="font-medium text-[#4D5A53]">Paid</span>
            </div>
            <span className="font-bold font-serif text-[#141A17]">₹ 2,18,000</span>
          </div>

          {/* Pending */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C86D3B]" />
              <span className="font-medium text-[#4D5A53]">Pending</span>
            </div>
            <span className="font-bold font-serif text-[#141A17]">₹ 82,500</span>
          </div>

          {/* Overdue */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8E9B95]" />
              <span className="font-medium text-[#4D5A53]">Overdue</span>
            </div>
            <span className="font-bold font-serif text-[#141A17]">₹ 24,000</span>
          </div>
        </div>

      </div>

      {/* Bottom Insight Pill */}
      <div className="mt-3 flex items-center gap-2 bg-[#EAF4EE] px-3 py-2 rounded-xl border border-[#2D4A3E]/12">
        <TrendingUp className="w-3.5 h-3.5 text-[#244335] shrink-0" />
        <p className="text-[11px] text-[#244335] font-medium leading-tight">
          Payments received are 14% higher than last month.
        </p>
      </div>

    </div>
  );
};

export default PaymentOverviewDonut;
