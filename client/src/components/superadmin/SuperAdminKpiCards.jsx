import React from 'react';
import { 
  Building2, 
  Users, 
  FileText, 
  IndianRupee, 
  ArrowUp, 
  MoreVertical 
} from 'lucide-react';

export const SuperAdminKpiCards = () => {
  const cards = [
    {
      id: 'orgs',
      title: 'Total Organizations',
      value: '12',
      change: '+20% from last month',
      icon: Building2,
      iconBg: 'bg-[#E5F5EC] text-[#1E7445]',
      sparkColor: '#1E7445',
      sparkPath: 'M0,18 Q15,8 30,14 T60,6 T90,12 T110,2',
    },
    {
      id: 'users',
      title: 'Total Users',
      value: '248',
      change: '+18% from last month',
      icon: Users,
      iconBg: 'bg-[#FDF0E6] text-[#D97706]',
      sparkColor: '#D97706',
      sparkPath: 'M0,16 Q15,12 30,6 T60,14 T90,4 T110,2',
    },
    {
      id: 'subs',
      title: 'Active Subscriptions',
      value: '10',
      change: '+25% from last month',
      icon: FileText,
      iconBg: 'bg-[#E5F5EC] text-[#1E7445]',
      sparkColor: '#1E7445',
      sparkPath: 'M0,18 Q20,15 40,8 T80,10 T110,3',
    },
    {
      id: 'revenue',
      title: 'Total Revenue (All Orgs)',
      value: '₹ 12,48,300',
      change: '+12% from last month',
      icon: IndianRupee,
      iconBg: 'bg-[#F5ECE0] text-[#92400E]',
      sparkColor: '#92400E',
      sparkPath: 'M0,16 Q15,10 35,12 T70,6 T110,2',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 text-left">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="bg-white rounded-3xl p-5 border border-[#E8E1D5] shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative flex flex-col justify-between"
          >
            {/* Top row: Icon & 3-dots Menu */}
            <div className="flex items-center justify-between">
              <div className={`w-11 h-11 rounded-2xl ${card.iconBg} flex items-center justify-center shadow-2xs border border-black/5`}>
                <Icon className="w-5 h-5" />
              </div>
              
              <button 
                className="p-1 text-[#8C9892] hover:text-[#141A17] hover:bg-[#F5EFE8] rounded-lg transition-colors cursor-pointer"
                title="Options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Middle: Title & Value */}
            <div className="mt-4">
              <span className="text-xs font-semibold text-[#66756F] block">
                {card.title}
              </span>
              <span className="font-numeric font-bold text-2xl sm:text-3xl text-[#141A17] tracking-tight block mt-1">
                {card.value}
              </span>
            </div>

            {/* Bottom Row: Percentage increase & Mini Sparkline SVG */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F2EDE6]">
              <div className="flex items-center gap-1 text-[11px] font-bold font-numeric text-[#1E7445]">
                <ArrowUp className="w-3 h-3" />
                <span>{card.change}</span>
              </div>

              {/* Sparkline */}
              <div className="w-16 h-5">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 110 20">
                  <path
                    d={card.sparkPath}
                    fill="none"
                    stroke={card.sparkColor}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
};

export default SuperAdminKpiCards;
