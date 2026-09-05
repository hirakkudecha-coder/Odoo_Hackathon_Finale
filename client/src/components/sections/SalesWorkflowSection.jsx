import React from 'react';
import { ArrowUpRight, CheckCircle2, FileText, ArrowRight, UserCheck, Receipt, CreditCard } from 'lucide-react';

export const SalesWorkflowSection = ({ onOpenAuth }) => {
  const steps = [
    { num: '01', title: 'Customer & Quotation', desc: 'Select client profile with pre-configured price lists and credit limits.' },
    { num: '02', title: 'Confirmed Sales Order', desc: 'Auto-reserves inventory items and calculates delivery dispatch dates.' },
    { num: '03', title: 'Customer Tax Invoice', desc: 'Generates GST-compliant invoice with itemized line tax and discounts.' },
    { num: '04', title: 'Payment & Receipt', desc: 'Direct bank reconciliation with automatic Accounts Receivable clearance.' },
    { num: '05', title: 'Journal Entry', desc: 'Balanced Dr. Bank/Receivable and Cr. Sales Income + Output Tax.' },
  ];

  return (
    <section id="sales" className="py-20 bg-[#FAF8F5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Editorial Statement & Visual Diagram */}
          <div className="lg:col-span-6 space-y-6 reveal reveal-left">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#2D4A3E]">
              Sales & Revenue Pipeline
            </span>

            <h2 className="font-serif-luxury text-4xl sm:text-5xl text-[#141A17] leading-[1.08] tracking-tight">
              Turn every sale <br />
              <span className="italic font-normal">into a clear financial story.</span>
            </h2>

            <p className="text-xs sm:text-sm text-[#4A5550] leading-relaxed">
              Track custom showroom orders, client invoices, and payment receipts without manual bookkeeping friction. From quote to journal, each step is automated and transparent.
            </p>

            {/* Step-by-step editorial list */}
            <div className="space-y-3 pt-2">
              {steps.map((s, idx) => (
                <div key={s.num} className={`flex items-start gap-3.5 p-3 rounded-2xl bg-[#F5EFE6] border border-[#E8DFD3] hover:bg-white transition-colors reveal reveal-left ${
                  idx === 0 ? 'delay-75' : idx === 1 ? 'delay-150' : idx === 2 ? 'delay-200' : idx === 3 ? 'delay-300' : 'delay-400'
                }`}>
                  <span className="font-serif-luxury font-bold text-base text-[#2D4A3E] w-6 shrink-0 mt-0.5">
                    {s.num}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#141A17]">{s.title}</h4>
                    <p className="text-[11px] text-[#55635D]">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => onOpenAuth && onOpenAuth('signup')}
                className="inline-flex items-center gap-2 bg-[#2D4A3E] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full hover:bg-[#1E332A] transition-all cursor-pointer shadow-xs"
              >
                <span>Launch Sales Module</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right: Realistic Mini Sales Order & Invoice Card Preview */}
          <div className="lg:col-span-6 reveal reveal-right delay-200">
            <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#E6DFD4] shadow-md relative group">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE3D8]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#2D4A3E] text-white flex items-center justify-center text-xs font-bold font-serif">
                    SO
                  </div>
                  <div>
                    <h4 className="font-serif-luxury font-bold text-base text-[#141A17]">Sales Order #SO-2026-089</h4>
                    <span className="text-[10px] uppercase tracking-wider text-[#6A7670]">Customer: Oberoi Luxury Penthouse</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#E8F4EC] text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                  Invoiced & Paid
                </span>
              </div>

              {/* Order Lines */}
              <div className="py-5 space-y-3">
                <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-[#FAF8F5] border border-[#EFE9DF]">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🛋️</span>
                    <div>
                      <p className="font-semibold text-[#141A17]">Nordic Sand 3-Seater Sofa</p>
                      <p className="text-[10px] text-[#6A7670]">Qty: 2 • Unit: ₹54,900</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-[#141A17]">₹1,09,800</span>
                </div>

                <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-[#FAF8F5] border border-[#EFE9DF]">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🪑</span>
                    <div>
                      <p className="font-semibold text-[#141A17]">Olive Velvet Lounge Chair</p>
                      <p className="text-[10px] text-[#6A7670]">Qty: 1 • Unit: ₹37,900</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-[#141A17]">₹37,900</span>
                </div>
              </div>

              {/* Calculation Summary */}
              <div className="pt-4 border-t border-[#EAE3D8] space-y-2 text-xs">
                <div className="flex justify-between text-[#55635D]">
                  <span>Untaxed Subtotal:</span>
                  <span className="font-mono text-[#141A17]">₹1,47,700</span>
                </div>
                <div className="flex justify-between text-[#55635D]">
                  <span>GST (18% SGST + CGST):</span>
                  <span className="font-mono text-[#141A17]">₹26,586</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#141A17] pt-2 border-t border-[#F0EBE2]">
                  <span>Total Invoiced Amount:</span>
                  <span className="font-mono text-base text-[#2D4A3E]">₹1,74,286</span>
                </div>
              </div>

              {/* Connected Journal Badge */}
              <div className="mt-5 p-3 rounded-xl bg-[#EAF2ED] border border-[#C5DEC8] flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2 text-[#2D4A3E] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Journal Entry Posted: #JE-2026-441</span>
                </div>
                <span className="font-mono text-[#2D4A3E] font-bold">₹1,74,286 Dr = Cr</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
