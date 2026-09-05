import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export const TopCustomersList = () => {
  const [selectedRange, setSelectedRange] = useState('This Month');

  const rawCustomers = [
    { rank: 1, initial: 'N', name: 'Nimesh Pathak', amount: '₹ 1,24,000', color: 'bg-[#CCDCD2] text-[#1E3A2E]' },
    { rank: 2, initial: 'D', name: 'DesignHub Interiors', amount: '₹ 96,000', color: 'bg-[#DFD8CE] text-[#3D372E]' },
    { rank: 3, initial: 'M', name: 'Meera & Co.', amount: '₹ 68,500', color: 'bg-[#F2DDD0] text-[#5C3826]' },
    { rank: 4, initial: 'S', name: 'Studio Nest', amount: '₹ 52,000', color: 'bg-[#D6DDD9] text-[#2C3B34]' },
    { rank: 5, initial: 'U', name: 'Urban Spaces', amount: '₹ 48,000', color: 'bg-[#CCD4D8] text-[#22353D]' },
  ];

  const [customers, setCustomers] = useState(rawCustomers);

  useEffect(() => {
    let isMounted = true;
    const fetchTopCustomers = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch('/api/customer-invoices', { headers });
        if (res.ok) {
          const json = await res.json();
          if (json.customerInvoices && Array.isArray(json.customerInvoices) && json.customerInvoices.length > 0) {
            // Aggregate totals per customer
            const map = {};
            json.customerInvoices.forEach(inv => {
              const name = inv.customer?.name || 'Customer';
              map[name] = (map[name] || 0) + Number(inv.totalAmount || 0);
            });

            const colors = [
              'bg-[#CCDCD2] text-[#1E3A2E]',
              'bg-[#DFD8CE] text-[#3D372E]',
              'bg-[#F2DDD0] text-[#5C3826]',
              'bg-[#D6DDD9] text-[#2C3B34]',
              'bg-[#CCD4D8] text-[#22353D]'
            ];

            const sorted = Object.entries(map)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([name, val], idx) => ({
                rank: idx + 1,
                initial: name[0] || 'C',
                name,
                amount: `₹ ${val.toLocaleString('en-IN')}`,
                color: colors[idx % colors.length]
              }));

            if (isMounted && sorted.length > 0) setCustomers(sorted);
          }
        }
      } catch (err) {
        console.warn('Top customers fetch error, using fallback:', err.message);
      }
    };
    fetchTopCustomers();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-[#2D4A3E]/10 shadow-2xs flex flex-col justify-between h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-sm font-bold text-[#141A17] font-serif tracking-tight">
          Top Customers <span className="text-xs font-normal text-[#66706B]">(By Invoice Value)</span>
        </h3>

        <div className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-[#2D4A3E] bg-[#FAF8F5] border border-[#2D4A3E]/15 rounded-lg cursor-pointer">
          <span>{selectedRange}</span>
          <ChevronDown className="w-3 h-3 text-[#566B62]" />
        </div>
      </div>

      {/* Customer List */}
      <div className="space-y-2.5 my-auto">
        {customers.map((c) => (
          <div 
            key={c.rank} 
            className="flex items-center justify-between py-1 px-1 rounded-xl hover:bg-[#FAF8F5] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#8E9B95] w-3 text-center">
                {c.rank}
              </span>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${c.color} shadow-2xs`}>
                {c.initial}
              </div>
              <span className="text-xs font-semibold text-[#141A17] truncate max-w-30 xl:max-w-35">
                {c.name}
              </span>
            </div>

            <span className="text-xs font-bold font-serif text-[#141A17] shrink-0 ml-2">
              {c.amount}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default TopCustomersList;
