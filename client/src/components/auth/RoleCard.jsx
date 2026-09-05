import React from 'react';
import { ShieldCheck, FileSpreadsheet, UserCheck, Check } from 'lucide-react';

export const ROLE_DEFINITIONS = [
  {
    id: 'admin',
    label: 'Admin / Business Owner',
    shortLabel: 'Admin / Owner',
    description: 'Manage master data, transactions, accounting, and business reports.',
    icon: ShieldCheck,
  },
  {
    id: 'accountant',
    label: 'Invoicing User / Accountant',
    shortLabel: 'Accountant',
    description: 'Manage master data, record transactions, and access accounting reports.',
    icon: FileSpreadsheet,
  },
  {
    id: 'contact',
    label: 'Contact',
    shortLabel: 'Contact',
    description: 'Access your own invoices/bills and make payments.',
    icon: UserCheck,
  },
];

export const RoleCard = ({ role, isSelected, onSelect }) => {
  const Icon = role.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(role.id)}
      className={`w-full text-left p-2.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-2.5 relative ${
        isSelected
          ? 'bg-[#2D4A3E] border-[#2D4A3E] text-[#FAF8F5] shadow-sm'
          : 'bg-white border-[#DDD5C9] text-[#2E3833] hover:border-[#B5AAA0] hover:bg-[#FAF8F5]'
      }`}
    >
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
          isSelected ? 'bg-white/15 text-[#FAF8F5]' : 'bg-[#2D4A3E]/10 text-[#2D4A3E]'
        }`}
      >
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-semibold tracking-wide ${
              isSelected ? 'text-[#FAF8F5]' : 'text-[#141A17]'
            }`}
          >
            {role.label}
          </span>
        </div>
        <p
          className={`text-[10.5px] leading-tight mt-0.5 ${
            isSelected ? 'text-[#D7E2DC]' : 'text-[#6A7570]'
          }`}
        >
          {role.description}
        </p>
      </div>

      {isSelected && (
        <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-white">
          <Check className="w-2.5 h-2.5 stroke-[3]" />
        </div>
      )}
    </button>
  );
};
