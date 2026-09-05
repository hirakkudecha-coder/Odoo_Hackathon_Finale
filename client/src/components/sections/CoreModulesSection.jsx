import React from 'react';
import { ArrowUpRight, Users, Box, CreditCard, PieChart, FileSpreadsheet, ArrowRight } from 'lucide-react';

export const CoreModulesSection = ({ onOpenAuth }) => {
  const modules = [
    {
      num: '01',
      title: 'Contacts & Partners',
      subtitle: 'Customers & Vendors',
      description: 'Centralized directory for trade clients, retail buyers, fabric mills, and timber suppliers with credit terms and tax profiles.',
      icon: Users,
      bg: 'bg-white',
      border: 'border-[#E6DFD4]',
    },
    {
      num: '02',
      title: 'Products Master',
      subtitle: 'Furniture Catalogue',
      description: 'Structured variants for materials, finishes, and dimensions linked directly to inventory valuation accounts.',
      icon: Box,
      bg: 'bg-white',
      border: 'border-[#E6DFD4]',
    },
    {
      num: '03',
      title: 'Payments & Bills',
      subtitle: 'Cash & Bank Books',
      description: 'Track receivables, vendor disbursements, partial settlements, and automated debit/credit allocations in real-time.',
      icon: CreditCard,
      bg: 'bg-white',
      border: 'border-[#E6DFD4]',
    },
    {
      num: '04',
      title: 'Budget Controls',
      subtitle: 'Cost Centers & Targets',
      description: 'Establish monthly showroom allocations, raw material spend limits, and monitor live variance percentages.',
      icon: PieChart,
      bg: 'bg-white',
      border: 'border-[#E6DFD4]',
    },
    {
      num: '05',
      title: 'Reports & Audits',
      subtitle: 'P&L & Balance Sheet',
      description: 'Export GAAP-compliant financial statements, tax breakdown summaries, and item-level profitability matrices.',
      icon: FileSpreadsheet,
      bg: 'bg-white',
      border: 'border-[#E6DFD4]',
    },
  ];

  return (
    <section className="py-20 bg-[#F5F1EA] border-t border-[#E8E1D5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Title */}
        <div className="max-w-xl mb-12 space-y-3 reveal">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#2D4A3E]">
            Platform Architecture
          </span>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl text-[#141A17] tracking-tight">
            Designed for furniture operations, <br />
            <span className="italic font-normal">structured for scale.</span>
          </h2>
        </div>

        {/* 5 Numbered Editorial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.num}
                className={`p-7 rounded-3xl ${mod.bg} border ${mod.border} shadow-xs hover:shadow-md transition-all flex flex-col justify-between group reveal reveal-scale ${
                  idx === 0 ? 'delay-75' : idx === 1 ? 'delay-150' : idx === 2 ? 'delay-200' : idx === 3 ? 'delay-300' : 'delay-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-numeric font-bold text-3xl text-[#2D4A3E]/40 group-hover:text-[#2D4A3E] transition-colors">
                      {mod.num}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-[#F4EFEA] text-[#2D4A3E] flex items-center justify-center group-hover:bg-[#2D4A3E] group-hover:text-[#FAF8F5] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-serif-luxury font-bold text-xl text-[#141A17] mb-1">
                    {mod.title}
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8680] mb-3">
                    {mod.subtitle}
                  </p>
                  <p className="text-xs text-[#505D57] leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#EFE8DC] flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#2D4A3E]">Module Ready</span>
                  <button
                    onClick={() => onOpenAuth && onOpenAuth('signup')}
                    className="w-7 h-7 rounded-full bg-[#F4EFEA] text-[#2D4A3E] flex items-center justify-center hover:bg-[#2D4A3E] hover:text-[#FAF8F5] transition-colors cursor-pointer"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* 6th Highlight Card */}
          <div className="p-7 rounded-3xl bg-[#2D4A3E] text-[#FAF8F5] shadow-md flex flex-col justify-between group reveal reveal-scale delay-500">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-numeric font-bold text-3xl text-[#FAF8F5]/40">
                  06
                </span>
                <div className="w-10 h-10 rounded-2xl bg-[#3D5E50] text-[#FAF8F5] flex items-center justify-center">
                  ✦
                </div>
              </div>

              <h3 className="font-serif-luxury font-bold text-2xl text-[#FAF8F5] mb-2">
                Unified Ecosystem
              </h3>
              <p className="text-xs text-[#D1DDD6] leading-relaxed">
                Experience seamless interoperability across procurement, showroom point-of-sale, warehouse stock movement, and general ledger accounts.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[#3D5E50]">
              <button
                onClick={() => onOpenAuth && onOpenAuth('signup')}
                className="w-full py-3 bg-[#FAF8F5] text-[#2D4A3E] text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#EAE4DC] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Access Full Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
