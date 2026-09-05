import React from 'react';
import { MoreVertical } from 'lucide-react';

export const UserDistributionDonut = () => {
  const roles = [
    { name: 'Accountant', percent: '42%', color: 'bg-[#1E4839]', hex: '#1E4839' },
    { name: 'Manager', percent: '24%', color: 'bg-[#D97736]', hex: '#D97736' },
    { name: 'Viewer', percent: '18%', color: 'bg-[#D4A373]', hex: '#D4A373' },
    { name: 'Admin', percent: '10%', color: 'bg-[#92400E]', hex: '#92400E' },
    { name: 'Others', percent: '6%', color: 'bg-[#A1B3AB]', hex: '#A1B3AB' },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E1D5] shadow-2xs flex flex-col justify-between h-full text-left">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#F2EDE6]">
        <h3 className="font-serif-luxury font-bold text-lg text-[#141A17] tracking-tight">
          User Distribution
        </h3>
        <button className="p-1 text-[#8C9892] hover:text-[#141A17] rounded-lg transition-colors cursor-pointer">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Donut Chart Visual */}
      <div className="my-3 flex justify-center items-center relative">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* SVG circle stroke segments (total circumference = 2 * PI * 38 ≈ 238.76) */}
            {/* 1. Accountant 42% (len = 100.28, offset = 0) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#1E4839"
              strokeWidth="14"
              strokeDasharray="100.28 238.76"
              strokeDashoffset="0"
            />
            {/* 2. Manager 24% (len = 57.30, offset = -100.28) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#D97736"
              strokeWidth="14"
              strokeDasharray="57.30 238.76"
              strokeDashoffset="-100.28"
            />
            {/* 3. Viewer 18% (len = 42.98, offset = -157.58) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#D4A373"
              strokeWidth="14"
              strokeDasharray="42.98 238.76"
              strokeDashoffset="-157.58"
            />
            {/* 4. Admin 10% (len = 23.88, offset = -200.56) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#92400E"
              strokeWidth="14"
              strokeDasharray="23.88 238.76"
              strokeDashoffset="-200.56"
            />
            {/* 5. Others 6% (len = 14.32, offset = -224.44) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#A1B3AB"
              strokeWidth="14"
              strokeDasharray="14.32 238.76"
              strokeDashoffset="-224.44"
            />
          </svg>

          {/* Center Text inside Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-numeric font-bold text-xl text-[#141A17] leading-none">
              248
            </span>
            <span className="text-[10px] text-[#6B7A74] font-medium mt-0.5">
              Total Users
            </span>
          </div>
        </div>
      </div>

      {/* Legend list below */}
      <div className="space-y-1.5 pt-2 border-t border-[#F2EDE6]">
        {roles.map((r) => (
          <div key={r.name} className="flex items-center justify-between text-xs text-[#55665E]">
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${r.color}`} />
              <span className="font-medium text-[#2E3B35]">{r.name}</span>
            </span>
            <span className="font-numeric font-bold text-[#141A17]">{r.percent}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDistributionDonut;
