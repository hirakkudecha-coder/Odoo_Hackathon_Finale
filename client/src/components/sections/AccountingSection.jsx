import React, { useState } from 'react';
import { ArrowUpRight, Scale, BookOpen, Layers, CheckCircle2, ShieldAlert } from 'lucide-react';

export const AccountingSection = ({ onOpenAuth }) => {
  const [activeTab, setActiveTab] = useState('sales');

  const journalEntries = {
    sales: {
      title: 'Customer Invoice Posting (Sale of 2x Olive Armchairs)',
      ref: 'INV-2026-0042',
      date: '05 Sep 2026',
      lines: [
        { code: '1100', account: 'Accounts Receivable (Customer: Atelier Studio)', debit: '₹89,442', credit: '-' },
        { code: '4000', account: 'Sales Income (Furniture Products)', debit: '-', credit: '₹75,800' },
        { code: '2200', account: 'Output GST Payable (18%)', debit: '-', credit: '₹13,642' },
      ],
      totalDebit: '₹89,442',
      totalCredit: '₹89,442',
      status: 'Balanced & Posted'
    },
    purchase: {
      title: 'Vendor Bill Receipt (Supplier: Timber & Weave Ltd)',
      ref: 'BILL-2026-0118',
      date: '04 Sep 2026',
      lines: [
        { code: '1500', account: 'Inventory Asset (Raw Timber / Frames)', debit: '₹45,000', credit: '-' },
        { code: '2150', account: 'Input GST Receivable (18%)', debit: '₹8,100', credit: '-' },
        { code: '2000', account: 'Accounts Payable (Timber & Weave)', debit: '-', credit: '₹53,100' },
      ],
      totalDebit: '₹53,100',
      totalCredit: '₹53,100',
      status: 'Balanced & Posted'
    },
    payment: {
      title: 'Customer Bank Payment Settlement',
      ref: 'PAY-2026-0089',
      date: '05 Sep 2026',
      lines: [
        { code: '1010', account: 'HDFC Corporate Bank Account', debit: '₹89,442', credit: '-' },
        { code: '1100', account: 'Accounts Receivable (Atelier Studio)', debit: '-', credit: '₹89,442' },
      ],
      totalDebit: '₹89,442',
      totalCredit: '₹89,442',
      status: 'Settled & Cleared'
    }
  };

  const current = journalEntries[activeTab];

  return (
    <section id="accounting" className="py-24 bg-[#FAF8F5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="max-w-2xl mb-12 space-y-3 reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE3D6] text-[#2D4A3E] text-[11px] font-bold uppercase tracking-widest">
            <Scale className="w-3.5 h-3.5 text-[#2D4A3E]" />
            Double-Entry Accounting Core
          </div>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-[#141A17] tracking-tight">
            Every transaction <br />
            <span className="italic font-normal">has a place.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#4C5853] leading-relaxed">
            Accounting made intuitive, not intimidating. Every sales order, vendor bill, and bank transfer creates automated, mathematically balanced debit and credit entries.
          </p>
        </div>

        {/* Interactive Journal Entry Preview Card */}
        <div className="rounded-3xl bg-white border border-[#E4DCCE] shadow-lg overflow-hidden reveal reveal-scale delay-150">
          
          {/* Tab Selection Bar */}
          <div className="bg-[#F6F2EB] px-6 py-4 border-b border-[#E8E1D5] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#68756F] mr-2">
                Live Scenario:
              </span>
              <button
                onClick={() => setActiveTab('sales')}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'sales'
                    ? 'bg-[#2D4A3E] text-[#FAF8F5] shadow-xs'
                    : 'bg-white text-[#3E4844] hover:bg-[#EAE3D8]'
                }`}
              >
                01 Sales Invoice
              </button>
              <button
                onClick={() => setActiveTab('purchase')}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'purchase'
                    ? 'bg-[#2D4A3E] text-[#FAF8F5] shadow-xs'
                    : 'bg-white text-[#3E4844] hover:bg-[#EAE3D8]'
                }`}
              >
                02 Vendor Bill
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'payment'
                    ? 'bg-[#2D4A3E] text-[#FAF8F5] shadow-xs'
                    : 'bg-white text-[#3E4844] hover:bg-[#EAE3D8]'
                }`}
              >
                03 Bank Settlement
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#2D4A3E] bg-[#EAF2ED] px-3 py-1.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{current.status}</span>
            </div>
          </div>

          {/* Journal Entry Content */}
          <div className="p-6 sm:p-8">
            
            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-[#EFE9DF]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#717E77] tracking-wider">Transaction Context</span>
                <h4 className="font-serif-luxury font-bold text-lg text-[#141A17]">{current.title}</h4>
              </div>
              <div className="flex items-center gap-6 text-xs text-[#55635D]">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-[#717E77]">Voucher Ref</span>
                  <span className="font-mono font-bold text-[#141A17]">{current.ref}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-[#717E77]">Posting Date</span>
                  <span className="font-semibold text-[#141A17]">{current.date}</span>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm min-w-[520px]">
                <thead>
                  <tr className="border-b border-[#E8E1D5] text-[#6A7570] uppercase text-[10px] tracking-wider font-bold">
                    <th className="pb-3 w-20">Code</th>
                    <th className="pb-3">Account Title & Description</th>
                    <th className="pb-3 text-right w-36">Debit (Dr)</th>
                    <th className="pb-3 text-right w-36">Credit (Cr)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE1]">
                  {current.lines.map((line, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="py-3.5 font-mono text-[#6A7570] text-xs font-semibold">{line.code}</td>
                      <td className="py-3.5 font-medium text-[#141A17]">{line.account}</td>
                      <td className="py-3.5 text-right font-mono font-semibold text-[#141A17]">
                        {line.debit !== '-' ? (
                          <span className="text-[#2D4A3E] bg-[#EAF2ED] px-2 py-0.5 rounded-md">{line.debit}</span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                      <td className="py-3.5 text-right font-mono font-semibold text-[#141A17]">
                        {line.credit !== '-' ? (
                          <span className="text-[#8F3C1E] bg-[#FDF0EB] px-2 py-0.5 rounded-md">{line.credit}</span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[#2D4A3E] bg-[#FAF8F5] font-bold text-xs sm:text-sm text-[#141A17]">
                    <td colSpan={2} className="py-4 uppercase tracking-widest text-[#2D4A3E] font-sans">
                      Balance Verification (Dr = Cr)
                    </td>
                    <td className="py-4 text-right font-mono text-base text-[#2D4A3E]">{current.totalDebit}</td>
                    <td className="py-4 text-right font-mono text-base text-[#2D4A3E]">{current.totalCredit}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Bottom Insight Notice */}
            <div className="mt-6 p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                <p className="text-xs text-[#4F5B55]">
                  Automated trial balance and general ledger synchronization completed in real-time.
                </p>
              </div>
              <button
                onClick={() => onOpenAuth && onOpenAuth('signup')}
                className="text-xs font-bold uppercase tracking-wider text-[#2D4A3E] hover:text-[#E86034] transition-colors flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Launch Accounting Module</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
