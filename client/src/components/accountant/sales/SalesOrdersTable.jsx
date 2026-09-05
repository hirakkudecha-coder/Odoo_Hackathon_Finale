import React, { useState, useMemo } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  Filter, 
  Download, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';

export const SalesOrdersTable = ({ onCreateSO }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState('All');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const rawOrders = [
    {
      id: 1,
      soNo: 'SO-2025-001',
      date: '02 Sep 2025',
      customer: 'Nimesh Pathak',
      customerInitials: 'NP',
      customerAvatarBg: 'bg-[#CCDCD2] text-[#1E3A2E]',
      items: '4 items',
      totalAmount: '₹ 1,24,000.00',
      status: 'Invoiced',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 2,
      soNo: 'SO-2025-002',
      date: '01 Sep 2025',
      customer: 'DesignHub Interiors',
      customerInitials: 'DI',
      customerAvatarBg: 'bg-[#DFD8CE] text-[#3D372E]',
      items: '6 items',
      totalAmount: '₹ 96,000.00',
      status: 'Confirmed',
      statusStyle: 'bg-[#EBF3FE] text-[#2563EB]',
      statusDot: 'bg-[#3B82F6]',
    },
    {
      id: 3,
      soNo: 'SO-2025-003',
      date: '30 Aug 2025',
      customer: 'Meera & Co.',
      customerInitials: 'MC',
      customerAvatarBg: 'bg-[#F2DDD0] text-[#5C3826]',
      items: '3 items',
      totalAmount: '₹ 68,500.00',
      status: 'Invoiced',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 4,
      soNo: 'SO-2025-004',
      date: '28 Aug 2025',
      customer: 'Studio Nest',
      customerInitials: 'SN',
      customerAvatarBg: 'bg-[#D6DDD9] text-[#2C3B34]',
      items: '2 items',
      totalAmount: '₹ 52,000.00',
      status: 'Quotation',
      statusStyle: 'bg-[#FEF7EC] text-[#D97706]',
      statusDot: 'bg-[#F59E0B]',
    },
    {
      id: 5,
      soNo: 'SO-2025-005',
      date: '26 Aug 2025',
      customer: 'Urban Spaces',
      customerInitials: 'US',
      customerAvatarBg: 'bg-[#CCD4D8] text-[#22353D]',
      items: '5 items',
      totalAmount: '₹ 48,000.00',
      status: 'Confirmed',
      statusStyle: 'bg-[#EBF3FE] text-[#2563EB]',
      statusDot: 'bg-[#3B82F6]',
    },
    {
      id: 6,
      soNo: 'SO-2025-006',
      date: '24 Aug 2025',
      customer: 'Aura Living',
      customerInitials: 'AL',
      customerAvatarBg: 'bg-[#E0E6E3] text-[#1F4536]',
      items: '1 item',
      totalAmount: '₹ 24,500.00',
      status: 'Invoiced',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 7,
      soNo: 'SO-2025-007',
      date: '21 Aug 2025',
      customer: 'Luxe Decor',
      customerInitials: 'LD',
      customerAvatarBg: 'bg-[#E8EFF5] text-[#2C5282]',
      items: '3 items',
      totalAmount: '₹ 38,200.00',
      status: 'Cancelled',
      statusStyle: 'bg-[#FDE8E8] text-[#991B1B]',
      statusDot: 'bg-[#DC2626]',
    },
  ];

  const filterTabs = ['All', 'Quotation', 'Confirmed', 'Invoiced', 'Cancelled'];

  // Filter orders by search & status tab
  const filteredOrders = useMemo(() => {
    let result = rawOrders;
    if (activeFilterTab !== 'All') {
      result = result.filter((o) => o.status.toLowerCase() === activeFilterTab.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((o) =>
        o.soNo.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.date.toLowerCase().includes(q) ||
        o.status.toLowerCase().includes(q)
      );
    }
    return result;
  }, [searchQuery, activeFilterTab]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOrders.map((o) => o.id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-xs overflow-hidden transition-all duration-300">
      
      {/* 1. Table Top Header: Title, Description, Search & Primary CTA */}
      <div className="p-5 sm:p-6 border-b border-[#F0EAE1] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Title Block with Icon */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#F4EFE6] text-[#1C3A2F] flex items-center justify-center border border-[#E5DDD0] shadow-2xs shrink-0">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#141A17] tracking-tight">
              Sales Orders
            </h2>
            <p className="text-xs text-[#6B7A74] mt-0.5">
              Manage your customer orders, quotations, and invoice records.
            </p>
          </div>
        </div>

        {/* Search & Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-[#8A9B93] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search sales orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl pl-9 pr-3 py-2 text-xs text-[#141A17] placeholder-[#8A9B93] focus:outline-hidden focus:border-[#1C3A2F] focus:ring-1 focus:ring-[#1C3A2F] transition-all"
            />
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={onCreateSO}
            className="inline-flex items-center gap-2 bg-[#1C3A2F] hover:bg-[#142C23] text-[#FAF8F5] text-xs font-semibold px-4 py-2 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Sales Order</span>
            <span className="sm:hidden">Create</span>
          </button>
        </div>

      </div>

      {/* 2. Filter Tabs & Action Toolbar */}
      <div className="px-5 sm:px-6 py-3.5 bg-[#FAF8F5]/80 border-b border-[#F0EAE1] flex flex-wrap items-center justify-between gap-3">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilterTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeFilterTab === tab
                  ? 'bg-[#1C3A2F] text-white shadow-2xs'
                  : 'bg-white text-[#5B6963] border border-[#E8E1D5] hover:bg-[#F2ECE4] hover:text-[#141A17]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Secondary Toolbar: Filter & Export */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 bg-white border border-[#E2DAD0] hover:bg-[#F5EFE6] text-[#4A5952] text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            <Filter className="w-3.5 h-3.5 text-[#738C80]" />
            <span>Filter</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 bg-white border border-[#E2DAD0] hover:bg-[#F5EFE6] text-[#4A5952] text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#738C80]" />
            <span>Export</span>
          </button>
        </div>

      </div>

      {/* 3. Main Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[750px]">
          <thead>
            <tr className="border-b border-[#EAE3D7] bg-[#F7F4EE] text-[11px] font-bold text-[#55665E] uppercase tracking-wider">
              <th className="py-3.5 pl-6 pr-3 w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.length > 0 && selectedIds.length === filteredOrders.length}
                  onChange={toggleSelectAll}
                  className="rounded-sm border-[#C5BBAF] text-[#1C3A2F] focus:ring-[#1C3A2F] cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-3">
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#141A17]">
                  <span>Order #</span>
                  <ArrowUpDown className="w-3 h-3 text-[#8A9B93]" />
                </div>
              </th>
              <th className="py-3.5 px-3">
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#141A17]">
                  <span>Customer</span>
                  <ArrowUpDown className="w-3 h-3 text-[#8A9B93]" />
                </div>
              </th>
              <th className="py-3.5 px-3">
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#141A17]">
                  <span>Date</span>
                  <ArrowUpDown className="w-3 h-3 text-[#8A9B93]" />
                </div>
              </th>
              <th className="py-3.5 px-3">Items</th>
              <th className="py-3.5 px-3">
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#141A17]">
                  <span>Total Amount</span>
                  <ArrowUpDown className="w-3 h-3 text-[#8A9B93]" />
                </div>
              </th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 pr-6 pl-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EAE1] text-xs text-[#141A17]">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-[#738C80]">
                  No sales orders found matching your search.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const isSelected = selectedIds.includes(order.id);
                return (
                  <tr
                    key={order.id}
                    className={`hover:bg-[#FAF7F2] transition-colors group ${
                      isSelected ? 'bg-[#F2ECE1]/60' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 pl-6 pr-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(order.id)}
                        className="rounded-sm border-[#C5BBAF] text-[#1C3A2F] focus:ring-[#1C3A2F] cursor-pointer"
                      />
                    </td>

                    {/* Order No */}
                    <td className="py-3.5 px-3 font-semibold text-[#1C3A2F] font-mono text-xs">
                      {order.soNo}
                    </td>

                    {/* Customer with Initials Badge */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10.5px] font-bold ${order.customerAvatarBg} shadow-2xs shrink-0`}>
                          {order.customerInitials}
                        </div>
                        <span className="font-semibold text-[#141A17]">
                          {order.customer}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-3 text-[#55665E]">
                      {order.date}
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-3 text-[#55665E]">
                      {order.items}
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-3 font-bold font-serif text-[#141A17]">
                      {order.totalAmount}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${order.statusStyle} shadow-2xs`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${order.statusDot}`} />
                        <span>{order.status}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 pr-6 pl-3 text-right">
                      <button
                        type="button"
                        className="p-1.5 rounded-lg text-[#738C80] hover:text-[#141A17] hover:bg-[#EAE4DC] transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Pagination Footer */}
      <div className="px-6 py-4 border-t border-[#F0EAE1] bg-[#FAF8F5]/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#55665E]">
        <span>
          Showing 1 to {filteredOrders.length} of {rawOrders.length} orders
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-[#E2DAD0] bg-white hover:bg-[#F2ECE4] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="px-3 py-1 bg-[#1C3A2F] text-white font-bold rounded-lg shadow-2xs">
            1
          </span>
          <button
            type="button"
            className="px-3 py-1 bg-white border border-[#E2DAD0] hover:bg-[#F2ECE4] text-[#141A17] font-semibold rounded-lg transition-colors cursor-pointer"
          >
            2
          </button>
          
          <button
            type="button"
            className="p-1.5 rounded-lg border border-[#E2DAD0] bg-white hover:bg-[#F2ECE4] cursor-pointer transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default SalesOrdersTable;
