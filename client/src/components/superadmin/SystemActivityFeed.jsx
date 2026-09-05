import React from 'react';
import { 
  Building2, 
  UserPlus, 
  KeyRound, 
  Ban, 
  Settings, 
  ArrowRight 
} from 'lucide-react';

export const SystemActivityFeed = ({ onViewAll }) => {
  const activities = [
    {
      id: 1,
      title: 'New organization registered',
      detail: 'Urban Roots',
      time: '2 hours ago',
      icon: Building2,
      iconBg: 'bg-[#E5F7ED] text-[#1E7445]',
    },
    {
      id: 2,
      title: 'User added',
      detail: 'Rohan Mehta (Accountant)',
      time: '5 hours ago',
      icon: UserPlus,
      iconBg: 'bg-[#EBF3FE] text-[#2563EB]',
    },
    {
      id: 3,
      title: 'Role updated',
      detail: 'Manager → Admin',
      time: '1 day ago',
      icon: KeyRound,
      iconBg: 'bg-[#FEF7EC] text-[#D97706]',
    },
    {
      id: 4,
      title: 'Organization deactivated',
      detail: 'The Decor Co.',
      time: '2 days ago',
      icon: Ban,
      iconBg: 'bg-[#FDE8E8] text-[#DC2626]',
    },
    {
      id: 5,
      title: 'Settings updated',
      detail: 'Payment reminders enabled',
      time: '2 days ago',
      icon: Settings,
      iconBg: 'bg-[#F0EDE6] text-[#55665E]',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E1D5] shadow-2xs flex flex-col justify-between h-full text-left">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#F2EDE6]">
        <h3 className="font-serif-luxury font-bold text-lg text-[#141A17] tracking-tight">
          System Activity
        </h3>
        <button
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#2D4A3E] hover:text-[#14231C] hover:underline cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Activity Timeline List */}
      <div className="divide-y divide-[#F5EFE8] mt-1 flex-1 flex flex-col justify-around">
        {activities.map((act) => {
          const Icon = act.icon;
          return (
            <div key={act.id} className="py-2.5 flex items-center justify-between gap-3 hover:bg-[#FAF8F5] px-2 rounded-xl transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl ${act.iconBg} flex items-center justify-center shrink-0 border border-black/5 shadow-2xs`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#141A17]">
                    {act.title}
                  </p>
                  <p className="text-[11px] text-[#606E67]">
                    {act.detail}
                  </p>
                </div>
              </div>

              <span className="text-[10px] text-[#8C9892] shrink-0 font-numeric">
                {act.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SystemActivityFeed;
