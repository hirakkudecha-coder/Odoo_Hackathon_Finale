import React from 'react';
import { ArrowUpRight, TrendingUp, BarChart3, PieChart, FileText, ArrowRight } from 'lucide-react';

export const ReportingSection = ({ onOpenAuth }) => {
  return (
    <section id="reports" className="py-24 bg-[#F5F1EA] border-y border-[#E8E1D5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 reveal">
          <div className="max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#2D4A3E] block mb-2">
              Financial Intelligence
            </span>
            <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-[#141A17] tracking-tight">
              See the health <br />
              <span className="italic font-normal">of your business.</span>
            </h2>
          </div>
          <p className="text-sm text-[#4E5C56] max-w-sm">
            Instantaneous visibility into margins, working capital, inventory holding costs, and annual budget variances.
          </p>
        </div>

        {/* 3 Luxury Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Profit & Loss */}
          <div className="rounded-3xl bg-white p-6 sm:p-7 border border-[#E6DFD4] shadow-xs flex flex-col justify-between hover:shadow-lg transition-all reveal reveal-scale delay-100">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE3D8] mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#EAF2ED] text-[#2D4A3E] flex items-center justify-center font-serif font-bold text-sm">
                    P&L
                  </div>
                  <div>
                    <h3 className="font-serif-luxury font-bold text-lg text-[#141A17]">Profit & Loss</h3>
                    <span className="text-[10px] uppercase tracking-wider text-[#6A7670]">Fiscal Year 2026</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-[#E8F4EC] px-2.5 py-1 rounded-full">+24.8%</span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center text-[#4A5550]">
                  <span>Gross Sales Income</span>
                  <span className="font-mono font-semibold text-[#141A17]">₹18,42,000</span>
                </div>
                <div className="flex justify-between items-center text-[#4A5550]">
                  <span>Cost of Goods Sold (COGS)</span>
                  <span className="font-mono font-semibold text-[#8F3C1E]">- ₹9,85,000</span>
                </div>
                <div className="flex justify-between items-center text-[#4A5550]">
                  <span>Operating & Studio Expenses</span>
                  <span className="font-mono font-semibold text-[#8F3C1E]">- ₹2,74,000</span>
                </div>
                <div className="pt-3 border-t border-[#EAE3D8] flex justify-between items-center font-bold text-sm text-[#2D4A3E]">
                  <span>Net Operating Profit</span>
                  <span className="font-mono text-base">₹5,83,000</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#F0EBE2]">
              <span className="text-[11px] text-[#6A7570] block mb-2">Automated P&L computed from journal entries</span>
              <button
                onClick={() => onOpenAuth && onOpenAuth('signup')}
                className="text-xs font-bold uppercase tracking-wider text-[#2D4A3E] hover:text-[#E86034] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Generate Full Statement</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Balance Sheet */}
          <div className="rounded-3xl bg-white p-6 sm:p-7 border border-[#E6DFD4] shadow-xs flex flex-col justify-between hover:shadow-lg transition-all reveal reveal-scale delay-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE3D8] mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FDF0EB] text-[#E86034] flex items-center justify-center font-serif font-bold text-sm">
                    BS
                  </div>
                  <div>
                    <h3 className="font-serif-luxury font-bold text-lg text-[#141A17]">Balance Sheet</h3>
                    <span className="text-[10px] uppercase tracking-wider text-[#6A7670]">As of Today</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#2D4A3E] bg-[#EAF2ED] px-2.5 py-1 rounded-full">Balanced</span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center text-[#4A5550]">
                  <span>Current Assets (Cash & Bank)</span>
                  <span className="font-mono font-semibold text-[#141A17]">₹12,60,000</span>
                </div>
                <div className="flex justify-between items-center text-[#4A5550]">
                  <span>Inventory Assets (Stock)</span>
                  <span className="font-mono font-semibold text-[#141A17]">₹8,95,000</span>
                </div>
                <div className="flex justify-between items-center text-[#4A5550]">
                  <span>Current Liabilities (Payables)</span>
                  <span className="font-mono font-semibold text-[#8F3C1E]">₹4,15,000</span>
                </div>
                <div className="pt-3 border-t border-[#EAE3D8] flex justify-between items-center font-bold text-sm text-[#141A17]">
                  <span>Total Capital & Equity</span>
                  <span className="font-mono text-base text-[#2D4A3E]">₹17,40,000</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#F0EBE2]">
              <span className="text-[11px] text-[#6A7570] block mb-2">Real-time asset & liability balancing</span>
              <button
                onClick={() => onOpenAuth && onOpenAuth('signup')}
                className="text-xs font-bold uppercase tracking-wider text-[#2D4A3E] hover:text-[#E86034] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>View Balance Sheet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Budget vs Actual */}
          <div className="rounded-3xl bg-white p-6 sm:p-7 border border-[#E6DFD4] shadow-xs flex flex-col justify-between hover:shadow-lg transition-all">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE3D8] mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF17B] text-[#2B2806] flex items-center justify-center font-serif font-bold text-sm">
                    BG
                  </div>
                  <div>
                    <h3 className="font-serif-luxury font-bold text-lg text-[#141A17]">Budget Tracking</h3>
                    <span className="text-[10px] uppercase tracking-wider text-[#6A7670]">Q3 Production Plan</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-[#E8F4EC] px-2.5 py-1 rounded-full">On Target</span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <div className="flex justify-between text-[#4A5550] mb-1">
                    <span>Material Procurement</span>
                    <span className="font-mono font-semibold text-[#141A17]">78% Utilized</span>
                  </div>
                  <div className="w-full bg-[#EAE4DC] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#2D4A3E] h-full rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[#4A5550] mb-1">
                    <span>Showroom Operations</span>
                    <span className="font-mono font-semibold text-[#141A17]">62% Utilized</span>
                  </div>
                  <div className="w-full bg-[#EAE4DC] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#E86034] h-full rounded-full" style={{ width: '62%' }}></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EAE3D8] flex justify-between items-center font-bold text-sm text-[#141A17]">
                  <span>Favorable Variance</span>
                  <span className="font-mono text-base text-emerald-700">+ ₹1,12,000</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#F0EBE2]">
              <span className="text-[11px] text-[#6A7570] block mb-2">Continuous variance alerts & spend guardrails</span>
              <button
                onClick={() => onOpenAuth && onOpenAuth('signup')}
                className="text-xs font-bold uppercase tracking-wider text-[#2D4A3E] hover:text-[#E86034] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Manage Budgets</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
