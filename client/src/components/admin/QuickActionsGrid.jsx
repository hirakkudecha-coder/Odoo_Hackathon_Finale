import React from 'react';
import { 
  FileText, 
  ShoppingCart, 
  Plus, 
  UserPlus, 
  PackagePlus, 
  BookOpen, 
  Settings2 
} from 'lucide-react';

export const QuickActionsGrid = ({ onActionClick }) => {
  const actions = [
    {
      id: 'newSale',
      title: 'New Sale',
      icon: FileText,
      iconBg: 'bg-[#E5F7ED]',
      iconColor: 'text-[#1E7445]',
    },
    {
      id: 'newPurchase',
      title: 'New Purchase',
      icon: ShoppingCart,
      iconBg: 'bg-[#FEF1E8]',
      iconColor: 'text-[#D65D33]',
    },
    {
      id: 'registerPayment',
      title: 'Register Payment',
      icon: Plus,
      iconBg: 'bg-[#FDF4E7]',
      iconColor: 'text-[#996515]',
    },
    {
      id: 'addContact',
      title: 'Add Contact',
      icon: UserPlus,
      iconBg: 'bg-[#E5F7ED]',
      iconColor: 'text-[#1E7445]',
    },
    {
      id: 'addProduct',
      title: 'Add Product',
      icon: PackagePlus,
      iconBg: 'bg-[#FEF1E8]',
      iconColor: 'text-[#D65D33]',
    },
    {
      id: 'journalEntry',
      title: 'Journal Entry',
      icon: BookOpen,
      iconBg: 'bg-[#EBF7F2]',
      iconColor: 'text-[#2D4A3E]',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E8E1D5] shadow-2xs text-left h-full flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F0EAE1]">
        <div>
          <h3 className="font-serif font-bold text-base sm:text-lg text-[#141A17]">
            Quick Actions
          </h3>
          <p className="text-[11px] text-[#6B7A74]">
            Create new records quickly.
          </p>
        </div>

        <button className="flex items-center gap-1.5 text-xs text-[#6B7A74] hover:text-[#141A17] transition-colors cursor-pointer">
          <Settings2 className="w-3.5 h-3.5" />
          <span>Customize</span>
        </button>
      </div>

      {/* 2x3 Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-auto">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => onActionClick && onActionClick(act.id)}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-[#EBE4D8] bg-[#FAF8F5]/60 hover:bg-white hover:border-[#2D4A3E]/30 hover:shadow-xs transition-all duration-200 cursor-pointer group text-left"
            >
              <div className={`w-8 h-8 rounded-lg ${act.iconBg} ${act.iconColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-[#1A2420] group-hover:text-[#2D4A3E] transition-colors">
                {act.title}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
};

export default QuickActionsGrid;
