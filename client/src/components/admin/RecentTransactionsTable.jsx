import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

const STATIC_FALLBACK = [
  { date: '05 Sep 2026', type: 'Sale', reference: 'INV-0012', name: 'Nimesh Pathak', amount: '₹ 24,500', status: 'Paid', statusColor: 'bg-[#E5F7ED] text-[#1E7445]' },
  { date: '04 Sep 2026', type: 'Purchase', reference: 'PO-0034', name: 'Azure Furnitures', amount: '₹ 18,000', status: 'Pending', statusColor: 'bg-[#FEF3EB] text-[#D65D33]' },
  { date: '03 Sep 2026', type: 'Payment', reference: 'PAY-0045', name: 'DesignHub Interiors', amount: '₹ 12,000', status: 'Paid', statusColor: 'bg-[#E5F7ED] text-[#1E7445]' },
  { date: '02 Sep 2026', type: 'Sale', reference: 'INV-0011', name: 'Meera & Co.', amount: '₹ 56,800', status: 'Due', statusColor: 'bg-[#FDECE7] text-[#C95426]' },
  { date: '01 Sep 2026', type: 'Purchase', reference: 'BILL-0021', name: 'Woodland Supplies', amount: '₹ 33,200', status: 'Paid', statusColor: 'bg-[#E5F7ED] text-[#1E7445]' },
];

const statusMeta = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'posted' || s === 'paid' || s === 'delivered') return { label: 'Paid', color: 'bg-[#E5F7ED] text-[#1E7445]' };
  if (s === 'draft') return { label: 'Pending', color: 'bg-[#FEF3EB] text-[#D65D33]' };
  if (s === 'partial') return { label: 'Partial', color: 'bg-[#FFF8E8] text-[#B8860B]' };
  if (s === 'cancelled') return { label: 'Cancelled', color: 'bg-[#F5F5F5] text-[#888]' };
  return { label: 'Due', color: 'bg-[#FDECE7] text-[#C95426]' };
};

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatCurrency = (val) => `₹ ${Number(val || 0).toLocaleString('en-IN')}`;

export const RecentTransactionsTable = () => {
  const [transactions, setTransactions] = useState(STATIC_FALLBACK);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const [jeRes, payRes] = await Promise.all([
          fetch('/api/journal-entries?status=posted', { headers }).catch(() => null),
          fetch('/api/payments', { headers }).catch(() => null),
        ]);

        const rows = [];

        if (jeRes && jeRes.ok) {
          const jeData = await jeRes.json();
          const entries = jeData.journalEntries || jeData.data || [];
          entries.slice(0, 5).forEach(je => {
            const sm = statusMeta(je.status);
            rows.push({
              date: formatDate(je.date || je.createdAt),
              type: je.journal?.type || 'Journal',
              reference: je.reference || je.entryNumber || '—',
              name: je.journal?.name || 'General Ledger',
              amount: formatCurrency(je.totalDebit ?? je.totalAmount ?? 0),
              status: sm.label,
              statusColor: sm.color,
            });
          });
        }

        if (payRes && payRes.ok) {
          const payData = await payRes.json();
          const payments = payData.payments || payData.data || [];
          payments.slice(0, 3).forEach(p => {
            const sm = statusMeta(p.status || 'paid');
            rows.push({
              date: formatDate(p.paymentDate || p.createdAt),
              type: p.paymentType === 'send_money' ? 'Payment Out' : 'Payment In',
              reference: p.paymentNumber || '—',
              name: p.partner?.name || '—',
              amount: formatCurrency(p.amount || 0),
              status: sm.label,
              statusColor: sm.color,
            });
          });
        }

        if (rows.length > 0) {
          setTransactions(rows.slice(0, 7));
        }
      } catch (err) {
        // Fallback to static
      }
    };

    fetchTransactions();
  }, []);



  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E8E1D5] shadow-2xs hover:shadow-md transition-shadow duration-300 text-left h-full flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F0EAE1]">
        <h3 className="font-serif font-bold text-base sm:text-lg text-[#141A17]">
          Recent Transactions
        </h3>
        <button className="text-xs font-semibold text-[#2D4A3E] hover:text-[#183327] hover:underline cursor-pointer transition-colors">
          View All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[10px] uppercase font-bold text-[#718079] tracking-wider border-b border-[#F0EAE1] pb-2">
              <th className="py-2.5 font-semibold">Date</th>
              <th className="py-2.5 font-semibold">Type</th>
              <th className="py-2.5 font-semibold">Reference</th>
              <th className="py-2.5 font-semibold">Name</th>
              <th className="py-2.5 font-semibold text-right">Amount</th>
              <th className="py-2.5 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F6F2EC]">
            {transactions.map((tx, idx) => (
              <tr key={idx} className="hover:bg-[#FAF6F0] transition-colors duration-150 cursor-pointer group">
                <td className="py-3 text-[#5A6862] text-[11px] font-medium group-hover:text-[#141A17]">
                  {tx.date}
                </td>
                <td className="py-3 text-[#141A17] font-medium">
                  {tx.type}
                </td>
                <td className="py-3 text-[#2D4A3E] font-mono text-[11px] font-bold group-hover:underline">
                  {tx.reference}
                </td>
                <td className="py-3 text-[#141A17] font-semibold group-hover:text-[#2D4A3E]">
                  {tx.name}
                </td>
                <td className="py-3 text-right font-serif font-bold text-[#141A17]">
                  {tx.amount}
                </td>
                <td className="py-3 text-right">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${tx.statusColor}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span>{tx.status}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default RecentTransactionsTable;
