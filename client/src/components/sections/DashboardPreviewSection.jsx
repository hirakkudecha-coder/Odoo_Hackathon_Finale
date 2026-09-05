import React from 'react';
import { ArrowUpRight, TrendingUp, TrendingDown, DollarSign, Wallet, ArrowDownRight, Activity } from 'lucide-react';

export const DashboardPreviewSection = ({ onOpenAuth }) => {
  return (
    <section className="py-24 bg-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3 reveal">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#2D4A3E]">
            Executive Cockpit
          </span>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-[#141A17] tracking-tight">
            One view. <br />
            <span className="italic font-normal">The whole business.</span>
          </h2>
          <p className="text-sm text-[#4E5B55]">
            Experience how our accounting workspace consolidates sales, procurement, accounts receivable, and operating profit into unified visual clarity.
          </p>
        </div>

        {/* Realistic Application Dashboard Mockup */}
        <div className="rounded-3xl bg-[#14231D] p-4 sm:p-8 border border-[#22392F] shadow-2xl text-white reveal reveal-scale delay-150">
          
          {/* Mock Window Top Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-[#223B2F] mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#E86034]"></div>
              <div className="w-3 h-3 rounded-full bg-[#FAF17B]"></div>
              <div className="w-3 h-3 rounded-full bg-[#6FCF97]"></div>
              <span className="text-xs font-mono text-[#8FAEA2] ml-3 hidden sm:inline">
                urbanfurniture.app/portal/dashboard
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-[#1E3B2E] px-3 py-1 rounded-full border border-emerald-500/30">
                Live Data Feed
              </span>
              <button
                onClick={() => onOpenAuth && onOpenAuth('signup')}
                className="text-xs font-bold uppercase tracking-wider bg-[#FAF8F5] text-[#14231D] px-4 py-1.5 rounded-full hover:bg-[#EAE4DC] transition-colors cursor-pointer"
              >
                Launch Portal
              </button>
            </div>
          </div>

          {/* 4 Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            
            <div className="p-5 rounded-2xl bg-[#1A2E26] border border-[#264438]">
              <div className="flex justify-between items-start text-xs text-[#95B2A6] mb-2">
                <span>Total Monthly Sales</span>
                <span className="text-emerald-400 text-[11px] font-bold">+18.2%</span>
              </div>
              <div className="text-2xl font-bold font-serif text-white">₹18,42,500</div>
              <div className="text-[10px] text-[#719083] mt-1">42 Orders Delivered</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#1A2E26] border border-[#264438]">
              <div className="flex justify-between items-start text-xs text-[#95B2A6] mb-2">
                <span>Material Purchases</span>
                <span className="text-[#E86034] text-[11px] font-bold">Planned</span>
              </div>
              <div className="text-2xl font-bold font-serif text-white">₹9,85,200</div>
              <div className="text-[10px] text-[#719083] mt-1">16 Vendor Invoices</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#1A2E26] border border-[#264438]">
              <div className="flex justify-between items-start text-xs text-[#95B2A6] mb-2">
                <span>Receivables (Due)</span>
                <span className="text-emerald-400 text-[11px] font-bold">94% Current</span>
              </div>
              <div className="text-2xl font-bold font-serif text-white">₹3,40,000</div>
              <div className="text-[10px] text-[#719083] mt-1">Avg 12 days collection</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#1A2E26] border border-[#264438]">
              <div className="flex justify-between items-start text-xs text-[#95B2A6] mb-2">
                <span>Payables (Due)</span>
                <span className="text-[#E86034] text-[11px] font-bold">On Schedule</span>
              </div>
              <div className="text-2xl font-bold font-serif text-white">₹2,15,000</div>
              <div className="text-[10px] text-[#719083] mt-1">0 overdue supplier bills</div>
            </div>

          </div>

          {/* Graphical Activity & Recent Transactions Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Sales vs Purchases Bar Chart Mockup */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-[#1A2E26] border border-[#264438]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="font-serif-luxury font-bold text-lg text-white">Revenue vs Procurement Flow</h4>
                  <p className="text-[10px] text-[#8EAFA3]">Monthly comparison of gross turnover against timber & fabric expenses</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Sales</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#E86034]"></span> Purchases</span>
                </div>
              </div>

              {/* Visual Bars */}
              <div className="space-y-4 pt-2">
                {[
                  { month: 'May', sales: 75, purchases: 45, val: '₹14.2L / ₹8.5L' },
                  { month: 'Jun', sales: 85, purchases: 50, val: '₹16.0L / ₹9.2L' },
                  { month: 'Jul', sales: 65, purchases: 40, val: '₹12.8L / ₹7.6L' },
                  { month: 'Aug', sales: 90, purchases: 55, val: '₹17.1L / ₹9.8L' },
                  { month: 'Sep', sales: 95, purchases: 52, val: '₹18.4L / ₹9.8L' },
                ].map((row) => (
                  <div key={row.month} className="space-y-1">
                    <div className="flex justify-between text-xs text-[#A1B8AF]">
                      <span className="font-mono font-bold text-white">{row.month}</span>
                      <span className="text-[11px] font-mono">{row.val}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 h-2.5">
                      <div className="bg-[#244234] rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${row.sales}%` }}></div>
                      </div>
                      <div className="bg-[#244234] rounded-full overflow-hidden">
                        <div className="bg-[#E86034] h-full rounded-full transition-all duration-500" style={{ width: `${row.purchases}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Ledger Activity Feed */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#1A2E26] border border-[#264438] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-serif-luxury font-bold text-lg text-white">Recent Journal Entries</h4>
                  <span className="text-[10px] text-emerald-400 font-mono">Real-time</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#14231D] border border-[#223B2F] flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">Sales Inv #42 (Oberoi Living)</p>
                      <p className="text-[10px] text-[#7E9C90]">Dr. Receivables / Cr. Sales</p>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">+₹89,442</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#14231D] border border-[#223B2F] flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">Bill #118 (Timber Craft Mills)</p>
                      <p className="text-[10px] text-[#7E9C90]">Dr. Inventory / Cr. Payables</p>
                    </div>
                    <span className="font-mono text-[#E86034] font-bold">-₹53,100</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#14231D] border border-[#223B2F] flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">Bank Receipt (Atelier Studio)</p>
                      <p className="text-[10px] text-[#7E9C90]">Dr. HDFC Bank / Cr. Debtors</p>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">+₹89,442</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#223B2F]">
                <button
                  onClick={() => onOpenAuth && onOpenAuth('signup')}
                  className="w-full py-2.5 bg-[#2D4A3E] hover:bg-[#3D5E50] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors text-center cursor-pointer"
                >
                  View General Ledger in App →
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
