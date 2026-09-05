import React from 'react';
import { ExternalLink } from 'lucide-react';

export const RecentTransactionsTable = () => {
  const transactions = [
    {
      date: '02 Sep 2025',
      type: 'Sale',
      reference: 'INV-0012',
      name: 'Nimesh Pathak',
      amount: '₹ 24,500',
      status: 'Paid',
      statusColor: 'bg-[#E5F7ED] text-[#1E7445]',
    },
    {
      date: '01 Sep 2025',
      type: 'Purchase',
      reference: 'PO-0034',
      name: 'Azure Furnitures',
      amount: '₹ 18,000',
      status: 'Pending',
      statusColor: 'bg-[#FEF3EB] text-[#D65D33]',
    },
    {
      date: '31 Aug 2025',
      type: 'Payment',
      reference: 'PAY-0045',
      name: 'DesignHub Interiors',
      amount: '₹ 12,000',
      status: 'Paid',
      statusColor: 'bg-[#E5F7ED] text-[#1E7445]',
    },
    {
      date: '30 Aug 2025',
      type: 'Sale',
      reference: 'INV-0011',
      name: 'Meera & Co.',
      amount: '₹ 56,800',
      status: 'Due',
      statusColor: 'bg-[#FDECE7] text-[#C95426]',
    },
    {
      date: '29 Aug 2025',
      type: 'Purchase',
      reference: 'BILL-0021',
      name: 'Woodland Supplies',
      amount: '₹ 33,200',
      status: 'Paid',
      statusColor: 'bg-[#E5F7ED] text-[#1E7445]',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E8E1D5] shadow-2xs text-left h-full flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F0EAE1]">
        <h3 className="font-serif font-bold text-base sm:text-lg text-[#141A17]">
          Recent Transactions
        </h3>
        <button className="text-xs font-semibold text-[#2D4A3E] hover:text-[#183327] hover:underline cursor-pointer">
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
              <tr key={idx} className="hover:bg-[#FAF8F5] transition-colors">
                <td className="py-3 text-[#5A6862] text-[11px] font-medium">
                  {tx.date}
                </td>
                <td className="py-3 text-[#141A17] font-medium">
                  {tx.type}
                </td>
                <td className="py-3 text-[#2D4A3E] font-mono text-[11px] font-bold">
                  {tx.reference}
                </td>
                <td className="py-3 text-[#141A17] font-semibold">
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
