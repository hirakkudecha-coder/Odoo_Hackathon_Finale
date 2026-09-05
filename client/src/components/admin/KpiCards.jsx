import React from 'react';
import { ShoppingCart, Package, ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react';

export const KpiCards = () => {
  const cards = [
    {
      title: 'Total Sales',
      value: '₹ 2,45,000',
      change: '12%',
      isPositive: true,
      icon: ShoppingCart,
      iconBg: 'bg-[#D6F0E0]',
      iconColor: 'text-[#1F6E43]',
      sparkColor: '#1F6E43',
      sparkPath: 'M0 22 Q 25 18, 45 22 T 85 8 T 120 12',
    },
    {
      title: 'Total Purchases',
      value: '₹ 1,32,500',
      change: '8%',
      isPositive: true,
      icon: Package,
      iconBg: 'bg-[#FCEADE]',
      iconColor: 'text-[#C95426]',
      sparkColor: '#E86034',
      sparkPath: 'M0 24 Q 30 20, 50 16 T 90 20 T 120 8',
    },
    {
      title: 'Receivables',
      value: '₹ 52,000',
      change: '4%',
      isPositive: false,
      icon: ArrowDownLeft,
      iconBg: 'bg-[#D6F0E0]',
      iconColor: 'text-[#1F6E43]',
      sparkColor: '#1F6E43',
      sparkPath: 'M0 12 Q 35 10, 60 18 T 95 12 T 120 22',
    },
    {
      title: 'Payables',
      value: '₹ 31,500',
      change: '6%',
      isPositive: true,
      icon: Wallet,
      iconBg: 'bg-[#FCEADE]',
      iconColor: 'text-[#C95426]',
      sparkColor: '#E86034',
      sparkPath: 'M0 22 Q 30 24, 60 14 T 95 18 T 120 10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div 
            key={idx}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E1D5] shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            {/* Top row: Icon + Title + Trend Pill */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-[11px] font-semibold text-[#66756F] uppercase tracking-wider block">
                    {card.title}
                  </span>
                  <span className="font-serif font-bold text-xl sm:text-2xl text-[#141A17] tracking-tight block">
                    {card.value}
                  </span>
                </div>
              </div>

              {/* Trend Pill */}
              <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-0.5 ${
                card.isPositive 
                  ? 'bg-[#E5F7ED] text-[#1E7445]' 
                  : 'bg-[#FDECE7] text-[#C95426]'
              }`}>
                <span>{card.isPositive ? '↑' : '↓'}</span>
                <span>{card.change}</span>
              </div>
            </div>

            {/* Bottom Row: Smooth SVG Sparkline */}
            <div className="w-full h-8 mt-3 flex items-end justify-end">
              <svg viewBox="0 0 120 30" className="w-24 h-6 overflow-visible" fill="none">
                <path
                  d={card.sparkPath}
                  stroke={card.sparkColor}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KpiCards;
