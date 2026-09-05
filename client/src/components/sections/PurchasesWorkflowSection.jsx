import React from 'react';
import { ArrowUpRight, Truck, PackageCheck, FileCheck, CheckCircle2 } from 'lucide-react';

export const PurchasesWorkflowSection = ({ onOpenAuth }) => {
  return (
    <section id="purchases" className="py-20 bg-[#F5F1EA] border-y border-[#E8E1D5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Supplier Bill Preview Card */}
          <div className="lg:col-span-6 order-2 lg:order-1 reveal reveal-left delay-200">
            <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#E6DFD4] shadow-md relative group">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE3D8]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#E86034] text-white flex items-center justify-center text-xs font-bold font-serif">
                    PO
                  </div>
                  <div>
                    <h4 className="font-serif-luxury font-bold text-base text-[#141A17]">Purchase Order #PO-2026-034</h4>
                    <span className="text-[10px] uppercase tracking-wider text-[#6A7670]">Vendor: Timber Craft Mills Ltd.</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#FAF17B] text-[#333005] text-[10px] font-bold uppercase tracking-wider">
                  Goods Received
                </span>
              </div>

              {/* Items List */}
              <div className="py-5 space-y-3">
                <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-[#FAF8F5] border border-[#EFE9DF]">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🪵</span>
                    <div>
                      <p className="font-semibold text-[#141A17]">Teak Wood Frames (Grade A)</p>
                      <p className="text-[10px] text-[#6A7670]">Qty: 50 Sets • Unit: ₹1,200</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-[#141A17]">₹60,000</span>
                </div>

                <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-[#FAF8F5] border border-[#EFE9DF]">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🧵</span>
                    <div>
                      <p className="font-semibold text-[#141A17]">Belgian Linen Upholstery (Meters)</p>
                      <p className="text-[10px] text-[#6A7670]">Qty: 100m • Unit: ₹450</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-[#141A17]">₹45,000</span>
                </div>
              </div>

              {/* Calculation Summary */}
              <div className="pt-4 border-t border-[#EAE3D8] space-y-2 text-xs">
                <div className="flex justify-between text-[#55635D]">
                  <span>Untaxed Total:</span>
                  <span className="font-mono text-[#141A17]">₹1,05,000</span>
                </div>
                <div className="flex justify-between text-[#55635D]">
                  <span>Input GST Credit (18%):</span>
                  <span className="font-mono text-emerald-700">+ ₹18,900</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#141A17] pt-2 border-t border-[#F0EBE2]">
                  <span>Vendor Bill Total:</span>
                  <span className="font-mono text-base text-[#E86034]">₹1,23,900</span>
                </div>
              </div>

              {/* Stock Valuation Badge */}
              <div className="mt-5 p-3 rounded-xl bg-[#FDF0EB] border border-[#F5CDBF] flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2 text-[#8B341B] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#E86034]" />
                  <span>Inventory Stock Value Increased: ₹1,05,000</span>
                </div>
                <span className="font-mono text-[#8B341B] font-bold">Dr. Assets</span>
              </div>

            </div>
          </div>

          {/* Right: Editorial Narrative */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6 reveal reveal-right">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#2D4A3E]">
              Procurement & Vendor Supply
            </span>

            <h2 className="font-serif-luxury text-4xl sm:text-5xl text-[#141A17] leading-[1.08] tracking-tight">
              From supplier <br />
              <span className="italic font-normal">to settled bill.</span>
            </h2>

            <p className="text-xs sm:text-sm text-[#4A5550] leading-relaxed">
              Keep material procurement structured and predictable. Track purchase requisitions, incoming warehouse receipts, vendor bill approvals, and cash outflows with zero guesswork.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-[#E6DFD4]">
                <Truck className="w-5 h-5 text-[#2D4A3E] mb-2" />
                <h4 className="text-xs font-bold text-[#141A17] uppercase tracking-wider">Goods Receipt Matching</h4>
                <p className="text-[11px] text-[#6A7670] mt-1">Ensure supplier invoices match the exact quantities received in your warehouse.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E6DFD4]">
                <FileCheck className="w-5 h-5 text-[#E86034] mb-2" />
                <h4 className="text-xs font-bold text-[#141A17] uppercase tracking-wider">Input Tax Credits</h4>
                <p className="text-[11px] text-[#6A7670] mt-1">Automatic debiting of Input GST accounts to maximize tax deduction claims.</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onOpenAuth && onOpenAuth('signup')}
                className="inline-flex items-center gap-2 bg-[#2D4A3E] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full hover:bg-[#1E332A] transition-all cursor-pointer shadow-xs"
              >
                <span>Explore Purchase Ledger</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
