import React from 'react';
import { 
  Building2, 
  UserPlus, 
  ShieldCheck, 
  FileText, 
  ArrowRight 
} from 'lucide-react';

export const SuperAdminQuickActions = ({ 
  onAddOrganization, 
  onAddUser, 
  onManageRoles, 
  onViewReports 
}) => {
  const actions = [
    {
      id: 'addOrg',
      title: 'Add Organization',
      icon: Building2,
      cardBg: 'bg-[#EBF5EF] hover:bg-[#E2F0E7]',
      iconBg: 'bg-[#D6ECD9] text-[#1E7445]',
      border: 'border-[#D5EADB]',
      onClick: onAddOrganization,
    },
    {
      id: 'addUser',
      title: 'Add User',
      icon: UserPlus,
      cardBg: 'bg-[#FDF3E9] hover:bg-[#FBE9D9]',
      iconBg: 'bg-[#FCE2CD] text-[#D97706]',
      border: 'border-[#F8DCC4]',
      onClick: onAddUser,
    },
    {
      id: 'manageRoles',
      title: 'Manage Roles',
      icon: ShieldCheck,
      cardBg: 'bg-[#FAF2E8] hover:bg-[#F5E8D8]',
      iconBg: 'bg-[#F3E1CA] text-[#92400E]',
      border: 'border-[#EED8BF]',
      onClick: onManageRoles,
    },
    {
      id: 'viewReports',
      title: 'View Reports',
      icon: FileText,
      cardBg: 'bg-[#EEF4FB] hover:bg-[#E1EDF9]',
      iconBg: 'bg-[#D7E6F7] text-[#2563EB]',
      border: 'border-[#D0E2F5]',
      onClick: onViewReports,
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E1D5] shadow-2xs flex flex-col justify-between h-full text-left">
      {/* Header */}
      <div className="pb-3.5 border-b border-[#F2EDE6]">
        <h3 className="font-serif-luxury font-bold text-lg text-[#141A17] tracking-tight">
          Quick Actions
        </h3>
      </div>

      {/* 2x2 Grid matching reference screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4 flex-1">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={act.onClick}
              className={`p-3.5 sm:p-4 rounded-2xl border ${act.border} ${act.cardBg} transition-all duration-200 cursor-pointer flex items-center justify-between group shadow-2xs hover:shadow-xs active:scale-[0.98] text-left`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${act.iconBg} flex items-center justify-center shrink-0 border border-black/5`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-semibold text-xs text-[#141A17] group-hover:text-[#1E3A2E] transition-colors">
                  {act.title}
                </span>
              </div>

              <ArrowRight className="w-4 h-4 text-[#7A8A83] group-hover:text-[#141A17] group-hover:translate-x-1 transition-all" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SuperAdminQuickActions;
