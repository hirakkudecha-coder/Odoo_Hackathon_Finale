import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  Search, 
  Plus, 
  ChevronDown, 
  Download, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  ArrowUpDown
} from 'lucide-react';

export const PaymentsTable = ({ onRecordPayment }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [contactFilter, setContactFilter] = useState('All Contacts');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const rawPayments = [
    {
      id: 1,
      paymentId: 'PAY-2024-001',
      date: '12 Aug 2024',
      type: 'Received',
      typeStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      contact: 'Rohan Kapoor',
      mode: 'Bank Transfer',
      amount: '₹ 48,750.00',
      status: 'Completed',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      statusDot: 'bg-[#10B981]',
      reference: 'UTR123456',
    },
    {
      id: 2,
      paymentId: 'PAY-2024-002',
      date: '10 Aug 2024',
      type: 'Paid',
      typeStyle: 'bg-[#FEEFEA] text-[#E05A2B]',
      contact: 'HomeWorks Supplies',
      mode: 'UPI',
      amount: '₹ 27,300.00',
      status: 'Completed',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      statusDot: 'bg-[#10B981]',
      reference: 'UPI987654',
    },
    {
      id: 3,
      paymentId: 'PAY-2024-003',
      date: '08 Aug 2024',
      type: 'Received',
      typeStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      contact: 'Sheetal Living',
      mode: 'Cheque',
      amount: '₹ 1,12,500.00',
      status: 'Pending',
      statusStyle: 'bg-[#FEF7EC] text-[#D97706]',
      statusDot: 'bg-[#F59E0B]',
      reference: 'CHQ445566',
    },
    {
      id: 4,
      paymentId: 'PAY-2024-004',
      date: '05 Aug 2024',
      type: 'Paid',
      typeStyle: 'bg-[#FEEFEA] text-[#E05A2B]',
      contact: 'DesignCraft',
      mode: 'Bank Transfer',
      amount: '₹ 36,800.00',
      status: 'Completed',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      statusDot: 'bg-[#10B981]',
      reference: 'UTR778899',
    },
    {
      id: 5,
      paymentId: 'PAY-2024-005',
      date: '01 Aug 2024',
      type: 'Received',
      typeStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      contact: 'NextGen Interiors',
      mode: 'Cash',
      amount: '₹ 89,200.00',
      status: 'Completed',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      statusDot: 'bg-[#10B981]',
      reference: 'CASH001',
    },
    {
      id: 6,
      paymentId: 'PAY-2024-006',
      date: '28 Jul 2024',
      type: 'Paid',
      typeStyle: 'bg-[#FEEFEA] text-[#E05A2B]',
      contact: 'Urban Roots',
      mode: 'UPI',
      amount: '₹ 18,450.00',
      status: 'Failed',
      statusStyle: 'bg-[#FDE8E8] text-[#991B1B]',
      statusDot: 'bg-[#DC2626]',
      reference: 'UPI334455',
    },
    {
      id: 7,
      paymentId: 'PAY-2024-007',
      date: '25 Jul 2024',
      type: 'Received',
      typeStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      contact: 'Elegant Spaces',
      mode: 'Bank Transfer',
      amount: '₹ 92,600.00',
      status: 'Completed',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      statusDot: 'bg-[#10B981]',
      reference: 'UTR667788',
    },
    {
      id: 8,
      paymentId: 'PAY-2024-008',
      date: '20 Jul 2024',
      type: 'Paid',
      typeStyle: 'bg-[#FEEFEA] text-[#E05A2B]',
      contact: 'Modern Kreations',
      mode: 'Cheque',
      amount: '₹ 31,950.00',
      status: 'Pending',
      statusStyle: 'bg-[#FEF7EC] text-[#D97706]',
      statusDot: 'bg-[#F59E0B]',
      reference: 'CHQ112233',
    },
  ];

  // Filter payments
  const filteredPayments = useMemo(() => {
    return rawPayments.filter((payment) => {
      if (typeFilter !== 'All Types' && payment.type !== typeFilter) return false;
      if (statusFilter !== 'All Status' && payment.status !== statusFilter) return false;
      if (contactFilter !== 'All Contacts' && payment.contact !== contactFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          payment.paymentId.toLowerCase().includes(q) ||
          payment.contact.toLowerCase().includes(q) ||
          payment.date.toLowerCase().includes(q) ||
          payment.mode.toLowerCase().includes(q) ||
          payment.reference.toLowerCase().includes(q) ||
          payment.status.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery, typeFilter, statusFilter, contactFilter]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredPayments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPayments.map((p) => p.id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E8E1D5] shadow-xs text-left">
      
      {/* 1. Header Row: Title & Record Payment Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#F0EAE1]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F0EC] text-[#2D4A3E] flex items-center justify-center shrink-0 border border-[#D5E5DD] shadow-2xs">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#141A17] tracking-tight">
              Payments
            </h2>
            <p className="text-xs text-[#6B7A74] mt-0.5">
              View and manage all your payment transactions.
            </p>
          </div>
        </div>

        {/* Right: Search Input and Record Payment CTA Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A9791]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search payments..."
              className="w-full bg-[#FAF8F5] border border-[#E4DCD0] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#141A17] placeholder-[#8A9791] focus:outline-hidden focus:border-[#2D4A3E] focus:bg-white transition-all shadow-2xs"
            />
          </div>

          <button
            onClick={onRecordPayment}
            className="inline-flex items-center gap-2 bg-[#1C3A2F] hover:bg-[#142921] active:scale-95 text-[#FAF8F5] px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* 2. Dropdown Filters Bar */}
      <div className="flex flex-wrap items-center justify-end gap-2.5 py-4">
        {/* All Types Dropdown */}
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="appearance-none bg-white border border-[#E4DCD0] rounded-xl px-3.5 py-1.5 pr-8 text-xs font-semibold text-[#4A5550] hover:bg-[#FAF8F5] transition-all cursor-pointer shadow-2xs focus:outline-hidden"
          >
            <option>All Types</option>
            <option>Received</option>
            <option>Paid</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7A8881] pointer-events-none" />
        </div>

        {/* All Status Dropdown */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-white border border-[#E4DCD0] rounded-xl px-3.5 py-1.5 pr-8 text-xs font-semibold text-[#4A5550] hover:bg-[#FAF8F5] transition-all cursor-pointer shadow-2xs focus:outline-hidden"
          >
            <option>All Status</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7A8881] pointer-events-none" />
        </div>

        {/* All Contacts Dropdown */}
        <div className="relative">
          <select
            value={contactFilter}
            onChange={(e) => setContactFilter(e.target.value)}
            className="appearance-none bg-white border border-[#E4DCD0] rounded-xl px-3.5 py-1.5 pr-8 text-xs font-semibold text-[#4A5550] hover:bg-[#FAF8F5] transition-all cursor-pointer shadow-2xs focus:outline-hidden"
          >
            <option>All Contacts</option>
            <option>Rohan Kapoor</option>
            <option>HomeWorks Supplies</option>
            <option>Sheetal Living</option>
            <option>DesignCraft</option>
            <option>NextGen Interiors</option>
            <option>Urban Roots</option>
            <option>Elegant Spaces</option>
            <option>Modern Kreations</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7A8881] pointer-events-none" />
        </div>

        {/* Select Date Range */}
        <button className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#E4DCD0] bg-white text-xs font-semibold text-[#4A5550] hover:bg-[#FAF8F5] transition-all cursor-pointer shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-[#7A8881]" />
          <span>Select Date Range</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#7A8881]" />
        </button>

        {/* Export Button */}
        <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#E4DCD0] bg-white text-xs font-semibold text-[#4A5550] hover:bg-[#FAF8F5] hover:text-[#141A17] transition-all cursor-pointer shadow-2xs">
          <Download className="w-3.5 h-3.5 text-[#7A8881]" />
          <span>Export</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#7A8881]" />
        </button>
      </div>

      {/* 3. Table Container */}
      <div className="overflow-x-auto border border-[#EFE8DC] rounded-2xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#FAF8F5] text-[10px] uppercase font-bold text-[#6D7D76] tracking-wider border-b border-[#EFE8DC]">
              <th className="py-3.5 px-4 w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredPayments.length && filteredPayments.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-[#DDD4C7] text-[#1C3A2F] focus:ring-[#1C3A2F] cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-4 font-semibold">
                PAYMENT ID
              </th>
              <th className="py-3.5 px-4 font-semibold">
                <div className="flex items-center gap-1">
                  <span>DATE</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-[#9AA8A1]" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold">
                <div className="flex items-center gap-1">
                  <span>TYPE</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-[#9AA8A1]" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold">
                <div className="flex items-center gap-1">
                  <span>CONTACT</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-[#9AA8A1]" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold">
                <div className="flex items-center gap-1">
                  <span>MODE</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-[#9AA8A1]" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold">
                <div className="flex items-center gap-1">
                  <span>AMOUNT</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-[#9AA8A1]" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold">
                <div className="flex items-center gap-1">
                  <span>STATUS</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-[#9AA8A1]" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold">
                REFERENCE
              </th>
              <th className="py-3.5 px-4 font-semibold text-right">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#F4EFEA] bg-white">
            {filteredPayments.length > 0 ? (
              filteredPayments.map((p) => {
                const isSelected = selectedIds.includes(p.id);
                return (
                  <tr 
                    key={p.id} 
                    className={`hover:bg-[#FAF7F2] transition-colors duration-150 cursor-pointer group ${
                      isSelected ? 'bg-[#F9F6F0]' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(p.id)}
                        className="rounded border-[#DDD4C7] text-[#1C3A2F] focus:ring-[#1C3A2F] cursor-pointer"
                      />
                    </td>

                    {/* Payment ID */}
                    <td className="py-3.5 px-4 font-mono font-medium text-[#2D4A3E] group-hover:underline">
                      {p.paymentId}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-[#5A6963] font-medium text-[11.5px] font-numeric">
                      {p.date}
                    </td>

                    {/* Type Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${p.typeStyle}`}>
                        {p.type}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4 font-medium text-[#141A17] group-hover:text-[#2D4A3E] transition-colors">
                      {p.contact}
                    </td>

                    {/* Mode */}
                    <td className="py-3.5 px-4 text-[#5A6963] font-medium">
                      {p.mode}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-numeric font-bold text-[#141A17] text-xs">
                      {p.amount}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${p.statusStyle}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.statusDot}`}></span>
                        <span>{p.status}</span>
                      </span>
                    </td>

                    {/* Reference */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#6A7872]">
                      {p.reference}
                    </td>

                    {/* Actions Button */}
                    <td className="py-3.5 px-4 text-right">
                      <button 
                        className="p-1.5 rounded-lg text-[#85988F] hover:text-[#141A17] hover:bg-[#EFE9DF] transition-colors cursor-pointer"
                        title="More Options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={10} className="py-8 text-center text-[#7A8881] text-xs">
                  No payment transactions found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Footer & Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 pt-4 border-t border-[#F0EAE1] text-xs text-[#6B7A74]">
        <span>
          Showing 1–{filteredPayments.length} of 126 payments
        </span>

        <div className="flex items-center gap-1.5">
          <button 
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-[#E4DCD0] bg-white hover:bg-[#FAF8F5] text-[#55635D] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button className="w-8 h-8 rounded-lg bg-[#EAE3D6] text-[#1C3A2F] font-bold text-xs flex items-center justify-center border border-[#DDD4C7] shadow-2xs">
            1
          </button>
          <button className="w-8 h-8 rounded-lg bg-white hover:bg-[#FAF8F5] text-[#55635D] font-medium text-xs flex items-center justify-center border border-[#E4DCD0] cursor-pointer">
            2
          </button>
          <button className="w-8 h-8 rounded-lg bg-white hover:bg-[#FAF8F5] text-[#55635D] font-medium text-xs flex items-center justify-center border border-[#E4DCD0] cursor-pointer">
            3
          </button>
          <button className="w-8 h-8 rounded-lg bg-white hover:bg-[#FAF8F5] text-[#55635D] font-medium text-xs flex items-center justify-center border border-[#E4DCD0] cursor-pointer">
            4
          </button>
          <button className="w-8 h-8 rounded-lg bg-white hover:bg-[#FAF8F5] text-[#55635D] font-medium text-xs flex items-center justify-center border border-[#E4DCD0] cursor-pointer">
            5
          </button>
          <span className="px-1 text-[#8A9791]">...</span>
          <button className="w-8 h-8 rounded-lg bg-white hover:bg-[#FAF8F5] text-[#55635D] font-medium text-xs flex items-center justify-center border border-[#E4DCD0] cursor-pointer">
            16
          </button>

          <button 
            className="p-1.5 rounded-lg border border-[#E4DCD0] bg-white hover:bg-[#FAF8F5] text-[#55635D] cursor-pointer transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default PaymentsTable;
