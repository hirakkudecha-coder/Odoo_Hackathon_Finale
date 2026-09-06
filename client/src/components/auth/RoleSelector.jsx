import React from 'react';
import { ROLE_DEFINITIONS } from './RoleCard';
import { Info } from 'lucide-react';

export const RoleSelector = ({ selectedRole = 'admin', onRoleChange }) => {
  const activeRoleObj = ROLE_DEFINITIONS.find((r) => r.id === selectedRole) || ROLE_DEFINITIONS[0];

  return (
    <div className="space-y-1.5 text-left w-full">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#4A5550]">
          System Role <span className="text-[#E86034]">*</span>
        </label>
        <span className="text-[10px] text-[#8C9892]">Role-based access</span>
      </div>

      {/* Compact Segmented Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-4 p-1 bg-[#F2EDE6] rounded-xl border border-[#E0D8CE] shadow-2xs gap-1">
        {ROLE_DEFINITIONS.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <button
              type="button"
              key={role.id}
              onClick={() => onRoleChange(role.id)}
              className={`flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-lg text-[11.5px] font-semibold tracking-tight transition-all duration-200 cursor-pointer select-none ${
                isSelected
                  ? 'bg-[#2D4A3E] text-[#FAF8F5] shadow-xs'
                  : 'text-[#5C6963] hover:text-[#1E2623] hover:bg-black/5'
              }`}
              title={role.label}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{role.shortLabel || role.label}</span>
            </button>
          );
        })}
      </div>

      {/* Subtle 1-line Role Description */}
      <div className="flex items-center gap-1.5 px-1 text-[10.5px] text-[#6A7570] animate-fadeIn">
        <Info className="w-3 h-3 text-[#2D4A3E] shrink-0" />
        <span className="truncate">{activeRoleObj.description}</span>
      </div>
    </div>
  );
};
