import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const AccountantKpiCards = () => {
  const [metrics, setMetrics] = useState({
    salesToday: 48000,
    purchasesToday: 22500,
    pendingInvoicesAmt: 124000,
    pendingInvoicesCount: 12,
    pendingBillsAmt: 76500,
    pendingBillsCount: 8,
  });

  useEffect(() => {
    let isMounted = true;
    const fetchAccountantMetrics = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [plRes, invRes, billRes] = await Promise.all([
          fetch('/api/reports/profit-loss', { headers }).catch(() => null),
          fetch('/api/customer-invoices', { headers }).catch(() => null),
          fetch('/api/vendor-bills', { headers }).catch(() => null)
        ]);

        let sales = 48000;
        let purchases = 22500;
        let pendInvAmt = 124000;
        let pendInvCount = 12;
        let pendBillAmt = 76500;
        let pendBillCount = 8;

        if (plRes && plRes.ok) {
          const pl = await plRes.json();
          if (pl.report) {
            sales = pl.report.income?.total ?? sales;
            purchases = pl.report.expenses?.total ?? purchases;
          }
        }

        if (invRes && invRes.ok) {
          const invJson = await invRes.json();
          if (invJson.customerInvoices && Array.isArray(invJson.customerInvoices)) {
            const pendingList = invJson.customerInvoices.filter(i => i.status !== 'paid' && i.status !== 'cancelled');
            if (pendingList.length > 0) {
              pendInvCount = pendingList.length;
              pendInvAmt = pendingList.reduce((sum, i) => sum + ((i.totalAmount || 0) - (i.paidAmount || 0)), 0);
            }
          }
        }

        if (billRes && billRes.ok) {
          const billJson = await billRes.json();
          if (billJson.vendorBills && Array.isArray(billJson.vendorBills)) {
            const pendingList = billJson.vendorBills.filter(b => b.status !== 'paid' && b.status !== 'cancelled');
            if (pendingList.length > 0) {
              pendBillCount = pendingList.length;
              pendBillAmt = pendingList.reduce((sum, b) => sum + ((b.totalAmount || 0) - (b.paidAmount || 0)), 0);
            }
          }
        }

        if (isMounted) {
          setMetrics({
            salesToday: sales,
            purchasesToday: purchases,
            pendingInvoicesAmt: pendInvAmt,
            pendingInvoicesCount: pendInvCount,
            pendingBillsAmt: pendBillAmt,
            pendingBillsCount: pendBillCount,
          });
        }
      } catch (err) {
        console.warn('Accountant KPIs fetch error, using fallback:', err.message);
      }
    };
    fetchAccountantMetrics();
    return () => { isMounted = false; };
  }, []);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
      
      {/* 1. Sales Today (Mint Green Container) */}
      <div className="bg-[#EBF5EF] rounded-2xl p-4.5 border border-[#2D4A3E]/12 shadow-2xs flex flex-col justify-between transition-all hover:shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D2EADA] text-[#2D4A3E] flex items-center justify-center shadow-2xs">
              <FileText className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[11.5px] font-semibold text-[#5A6E63] uppercase tracking-wide">
                Sales Today
              </span>
              <div className="text-xl sm:text-2xl font-bold font-numeric text-[#141A17] tracking-tight mt-0.5">
                ₹ {metrics.salesToday.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 bg-[#D5EFE0] text-[#1D603A] text-[11px] font-bold font-numeric px-2 py-0.5 rounded-full shadow-2xs">
            <span>↑ 12%</span>
          </div>
        </div>

        {/* Sparkline Graph */}
        <div className="h-7 w-full mt-3">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24" preserveAspectRatio="none">
            <path
              d="M0 18 Q 20 16, 35 12 T 70 8 T 100 3"
              fill="none"
              stroke="#2E7D53"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* 2. Purchases Today (Warm Peach/Terracotta Container) */}
      <div className="bg-[#FDF3EB] rounded-2xl p-4.5 border border-[#C86D3B]/15 shadow-2xs flex flex-col justify-between transition-all hover:shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F9E2D2] text-[#C86D3B] flex items-center justify-center shadow-2xs">
              <Calendar className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[11.5px] font-semibold text-[#8B6450] uppercase tracking-wide">
                Purchases Today
              </span>
              <div className="text-xl sm:text-2xl font-bold font-numeric text-[#141A17] tracking-tight mt-0.5">
                ₹ {metrics.purchasesToday.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-[#C86D3B] text-[11px] font-bold font-numeric px-1.5 py-0.5">
            <span>↓ 8%</span>
          </div>
        </div>

        {/* Sparkline Graph */}
        <div className="h-7 w-full mt-3">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24" preserveAspectRatio="none">
            <path
              d="M0 8 Q 25 10, 45 18 T 80 14 T 100 19"
              fill="none"
              stroke="#C86D3B"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* 3. Pending Invoices (Soft Cream Container) */}
      <div className="bg-[#FAF7F2] rounded-2xl p-4.5 border border-[#2D4A3E]/10 shadow-2xs flex flex-col justify-between transition-all hover:shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EDE4D8] text-[#2D4A3E] flex items-center justify-center shadow-2xs">
              <Clock className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[11.5px] font-semibold text-[#66706B] uppercase tracking-wide">
                Pending Invoices
              </span>
              <div className="text-xl sm:text-2xl font-bold font-numeric text-[#141A17] tracking-tight mt-0.5">
                ₹ {metrics.pendingInvoicesAmt.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-[11px] font-medium font-numeric text-[#7A8A82]">
            {metrics.pendingInvoicesCount} invoices
          </span>
          <div className="h-6 w-24">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 80 20" preserveAspectRatio="none">
              <path
                d="M0 16 Q 25 15, 45 10 T 80 4"
                fill="none"
                stroke="#2E7D53"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 4. Pending Bills (Soft Cream / Warm Container) */}
      <div className="bg-[#FAF7F2] rounded-2xl p-4.5 border border-[#C86D3B]/10 shadow-2xs flex flex-col justify-between transition-all hover:shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F6E6DB] text-[#C86D3B] flex items-center justify-center shadow-2xs">
              <Clock className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[11.5px] font-semibold text-[#66706B] uppercase tracking-wide">
                Pending Bills
              </span>
              <div className="text-xl sm:text-2xl font-bold font-numeric text-[#141A17] tracking-tight mt-0.5">
                ₹ {metrics.pendingBillsAmt.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-[11px] font-medium text-[#7A8A82]">
            {metrics.pendingBillsCount} bills
          </span>
          <div className="h-6 w-24">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 80 20" preserveAspectRatio="none">
              <path
                d="M0 14 Q 25 12, 50 16 T 80 11"
                fill="none"
                stroke="#C86D3B"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AccountantKpiCards;
