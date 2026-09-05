import React, { useState, useEffect } from 'react';

export const RecentBillsTable = ({ onViewAll }) => {
  const rawBills = [
    { id: 'BILL-0021', vendor: 'Azure Furniture', date: '02 Sep 2025', amount: '₹ 18,000', status: 'Pending' },
    { id: 'BILL-0020', vendor: 'Woodland Supplies', date: '30 Aug 2025', amount: '₹ 33,200', status: 'Paid' },
    { id: 'BILL-0019', vendor: 'Royal Hardware', date: '28 Aug 2025', amount: '₹ 12,500', status: 'Due' },
    { id: 'BILL-0018', vendor: 'Crafty Wood Co.', date: '26 Aug 2025', amount: '₹ 27,800', status: 'Paid' },
    { id: 'BILL-0017', vendor: 'Prime Metals', date: '24 Aug 2025', amount: '₹ 19,600', status: 'Pending' },
  ];

  const [bills, setBills] = useState(rawBills);

  useEffect(() => {
    let isMounted = true;
    const fetchBills = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch('/api/vendor-bills', { headers });
        if (res.ok) {
          const json = await res.json();
          if (json.vendorBills && Array.isArray(json.vendorBills) && json.vendorBills.length > 0) {
            const mapped = json.vendorBills.slice(0, 5).map((bill, idx) => {
              const vendName = bill.vendor?.name || 'Vendor';
              const dateStr = bill.billDate ? new Date(bill.billDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent';
              const amtStr = `₹ ${Number(bill.totalAmount || 0).toLocaleString('en-IN')}`;
              let statusLabel = 'Pending';
              if (bill.status === 'paid') statusLabel = 'Paid';
              else if (bill.status === 'posted' && new Date(bill.dueDate) < new Date()) statusLabel = 'Due';

              return {
                id: bill.billNumber || `BILL-${String(idx + 1).padStart(4, '0')}`,
                vendor: vendName,
                date: dateStr,
                amount: amtStr,
                status: statusLabel
              };
            });
            if (isMounted) setBills(mapped);
          }
        }
      } catch (err) {
        console.warn('Recent bills fetch error, using fallback:', err.message);
      }
    };
    fetchBills();
    return () => { isMounted = false; };
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#E1F3E7] text-[#1E6038]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E6038]" />
            Paid
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#FDF0E6] text-[#C86D3B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C86D3B]" />
            Pending
          </span>
        );
      case 'Due':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#FBE7E7] text-[#D33D3D]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D33D3D]" />
            Due
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-[#2D4A3E]/10 shadow-2xs flex flex-col justify-between h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-sm font-bold text-[#141A17] font-serif tracking-tight">
          Recent Bills
        </h3>
        <button 
          type="button"
          className="text-xs font-semibold text-[#2D4A3E] hover:text-[#182F25] hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2D4A3E]/8 text-[11px] font-semibold text-[#7A8A82]">
              <th className="py-2.5 px-2 font-medium">Bill</th>
              <th className="py-2.5 px-2 font-medium">Vendor</th>
              <th className="py-2.5 px-2 font-medium">Date</th>
              <th className="py-2.5 px-2 font-medium">Amount</th>
              <th className="py-2.5 px-2 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2D4A3E]/5 text-xs text-[#141A17]">
            {bills.map((bill) => (
              <tr key={bill.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                <td className="py-2.5 px-2 font-semibold text-[#2D4A3E]">
                  {bill.id}
                </td>
                <td className="py-2.5 px-2 font-medium text-[#141A17]">
                  {bill.vendor}
                </td>
                <td className="py-2.5 px-2 text-[#687C72]">
                  {bill.date}
                </td>
                <td className="py-2.5 px-2 font-bold font-serif text-[#141A17]">
                  {bill.amount}
                </td>
                <td className="py-2.5 px-2 text-right">
                  {getStatusBadge(bill.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default RecentBillsTable;
