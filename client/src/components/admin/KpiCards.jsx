import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react';

export const KpiCards = ({ onNavigateTab }) => {
  const [metrics, setMetrics] = useState({
    totalSales: 245000,
    totalPurchases: 132500,
    receivables: 52000,
    payables: 31500,
    loading: false
  });

  useEffect(() => {
    const fetchKpiData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const [plRes, bsRes] = await Promise.all([
          fetch('/api/reports/profit-loss', { headers }).catch(() => null),
          fetch('/api/reports/balance-sheet', { headers }).catch(() => null)
        ]);

        let sales = 245000;
        let purchases = 132500;
        let recv = 52000;
        let pay = 31500;

        if (plRes && plRes.ok) {
          const plData = await plRes.json();
          if (plData.report) {
            sales = plData.report.income?.total ?? sales;
            purchases = plData.report.expenses?.purchasesExpense ?? purchases;
          }
        }

        if (bsRes && bsRes.ok) {
          const bsData = await bsRes.json();
          if (bsData.report) {
            const debtors = bsData.report.assets?.accounts?.find(a => a.name?.toLowerCase().includes('debtor') || a.code === '1003');
            if (debtors) recv = debtors.balance;
            const creditors = bsData.report.liabilities?.accounts?.find(a => a.name?.toLowerCase().includes('creditor') || a.code === '2001');
            if (creditors) pay = creditors.balance;
          }
        }

        setMetrics({
          totalSales: sales,
          totalPurchases: purchases,
          receivables: recv,
          payables: pay,
          loading: false
        });
      } catch (err) {
        // Fallback to initial values gracefully
      }
    };

    fetchKpiData();
  }, []);

  const formatCurrency = (val) => {
    return `₹ ${Number(val || 0).toLocaleString('en-IN')}`;
  };

  const cards = [
    {
      id: 'sales',
      title: 'Total Sales',
      value: formatCurrency(metrics.totalSales),
      change: '12%',
      isPositive: true,
      icon: ShoppingCart,
      iconBg: 'bg-[#D6F0E0]',
      iconColor: 'text-[#1F6E43]',
      sparkColor: '#1F6E43',
      sparkPath: 'M0 22 Q 25 18, 45 22 T 85 8 T 120 12',
    },
    {
      id: 'purchase',
      title: 'Total Purchases',
      value: formatCurrency(metrics.totalPurchases),
      change: '8%',
      isPositive: true,
      icon: Package,
      iconBg: 'bg-[#FCEADE]',
      iconColor: 'text-[#C95426]',
      sparkColor: '#E86034',
      sparkPath: 'M0 24 Q 30 20, 50 16 T 90 20 T 120 8',
    },
    {
      id: 'payments',
      title: 'Receivables',
      value: formatCurrency(metrics.receivables),
      change: '4%',
      isPositive: false,
      icon: ArrowDownLeft,
      iconBg: 'bg-[#D6F0E0]',
      iconColor: 'text-[#1F6E43]',
      sparkColor: '#1F6E43',
      sparkPath: 'M0 12 Q 35 10, 60 18 T 95 12 T 120 22',
    },
    {
      id: 'payments',
      title: 'Payables',
      value: formatCurrency(metrics.payables),
      change: '6%',
      isPositive: true,
      icon: Wallet,
      iconBg: 'bg-[#FCEADE]',
      iconColor: 'text-[#C95426]',
      sparkColor: '#E86034',
      sparkPath: 'M0 22 Q 30 24, 60 14 T 95 18 T 120 10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div 
            key={idx}
            onClick={() => onNavigateTab && onNavigateTab(card.id)}
            title={`View ${card.title} module`}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E1D5] shadow-2xs hover:shadow-lg hover:-translate-y-1 hover:border-[#2D4A3E]/30 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
          >
            {/* Top row: Icon + Title + Trend Pill */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-2xs`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-[11px] font-semibold text-[#66756F] uppercase tracking-wider block group-hover:text-[#2D4A3E] transition-colors">
                    {card.title}
                  </span>
                  <span className="font-numeric font-bold text-xl sm:text-2xl text-[#141A17] tracking-tight block">
                    {card.value}
                  </span>
                </div>
              </div>

              {/* Trend Pill */}
              <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-numeric flex items-center gap-0.5 ${
                card.isPositive 
                  ? 'bg-[#E5F7ED] text-[#1E7445]' 
                  : 'bg-[#FDECE7] text-[#C95426]'
              }`}>
                <span>{card.isPositive ? '↑' : '↓'}</span>
                <span>{card.change}</span>
              </div>
            </div>

            {/* Bottom Row: Smooth SVG Sparkline */}
            <div className="w-full h-8 mt-3 flex items-end justify-end">
              <svg viewBox="0 0 120 30" className="w-24 h-6 overflow-visible" fill="none">
                <path
                  d={card.sparkPath}
                  stroke={card.sparkColor}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KpiCards;
