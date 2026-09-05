import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';

export const SubscriptionStatusCard = ({ onNavigateOrgs }) => {
  const data = [
    { label: 'Active', count: 10, color: 'bg-[#1E4839]', stroke: '#1E4839' },
    { label: 'Expiring Soon', count: 1, color: 'bg-[#D97736]', stroke: '#D97736' },
    { label: 'Expired', count: 1, color: 'bg-[#DC2626]', stroke: '#DC2626' },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E1D5] shadow-2xs flex flex-col justify-between h-full text-left">
      {/* Header */}
      <div className="pb-3.5 border-b border-[#F2EDE6]">
        <h3 className="font-serif-luxury font-bold text-lg text-[#141A17] tracking-tight">
          Subscription Status
        </h3>
      </div>

      {/* Donut & Legend Row */}
      <div className="flex items-center justify-between gap-4 my-auto py-2">
        {/* Donut Chart Visual */}
        <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Circumference = 2 * PI * 38 ≈ 238.76 */}
            {/* Active (10/12 ≈ 83.33% => 198.96 len) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#1E4839"
              strokeWidth="14"
              strokeDasharray="198.96 238.76"
              strokeDashoffset="0"
            />
            {/* Expiring Soon (1/12 ≈ 8.33% => 19.89 len) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#D97736"
              strokeWidth="14"
              strokeDasharray="19.89 238.76"
              strokeDashoffset="-198.96"
            />
            {/* Expired (1/12 ≈ 8.33% => 19.89 len) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#DC2626"
              strokeWidth="14"
              strokeDasharray="19.89 238.76"
              strokeDashoffset="-218.85"
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-numeric font-bold text-xl text-[#141A17] leading-none">
              12
            </span>
            <span className="text-[10px] text-[#6B7A74] font-medium mt-0.5">
              Total Orgs
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2.5 flex-1 pl-2">
          {data.map((item) => (
            <div key={item.label} className="flex items-center justify-between text-xs text-[#55665E]">
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="font-medium text-[#2E3B35]">{item.label}</span>
              </span>
              <span className="font-numeric font-bold text-[#141A17]">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Alert Callout matching reference design */}
      <div className="p-3 bg-[#FAF7F2] border border-[#EBE3D7] rounded-2xl flex items-center justify-between gap-2 mt-2">
        <div className="flex items-center gap-2 text-xs text-[#5C4736]">
          <Clock className="w-4 h-4 text-[#D97736] shrink-0" />
          <span className="text-[11.5px] font-medium leading-tight">
            1 organization's subscription expires in 7 days.
          </span>
        </div>
        <button
          onClick={onNavigateOrgs}
          className="text-xs font-bold text-[#2D4A3E] hover:underline flex items-center gap-0.5 shrink-0 cursor-pointer"
        >
          <span>View</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default SubscriptionStatusCard;
