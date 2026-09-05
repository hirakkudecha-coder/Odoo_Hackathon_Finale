<<<<<<< HEAD
export { SalesOrdersTable, default } from '../../admin/sales/SalesOrdersTable';
=======
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
  ArrowUpDown,
  Printer,
  FileText
} from 'lucide-react';
import { DocumentPdfModal } from '../DocumentPdfModal';
import { createSalesOrderPdfData, createMasterRegisterPdfData, downloadDirectPdf } from '../../../utils/pdfGenerator';

export const SalesOrdersTable = ({ onCreateSO }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState('All');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPdfDoc, setSelectedPdfDoc] = useState(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeRowMenuId, setActiveRowMenuId] = useState(null);
  const [sortAsc, setSortAsc] = useState(false);

  const [orders, setOrders] = useState([
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
  ]);

  const filterTabs = ['All', 'Quotation', 'Confirmed', 'Invoiced', 'Cancelled'];

  // Filter & Sort orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];
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
    if (sortAsc) {
      result.reverse();
    }
    return result;
  }, [orders, searchQuery, activeFilterTab, sortAsc]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedOrders.map((o) => o.id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleViewInvoicePdf = (order) => {
    const pdfData = createSalesOrderPdfData(order);
    setSelectedPdfDoc(pdfData);
    setIsPdfModalOpen(true);
    setActiveRowMenuId(null);
  };

  const handleDownloadInvoicePdfDirect = (order) => {
    const pdfData = createSalesOrderPdfData(order);
    downloadDirectPdf(pdfData);
    setActiveRowMenuId(null);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status: newStatus,
              statusStyle:
                newStatus === 'Invoiced'
                  ? 'bg-[#E5F7ED] text-[#1E7445]'
                  : newStatus === 'Confirmed'
                  ? 'bg-[#EBF3FE] text-[#2563EB]'
                  : 'bg-[#FDE8E8] text-[#991B1B]',
              statusDot:
                newStatus === 'Invoiced'
                  ? 'bg-[#10B981]'
                  : newStatus === 'Confirmed'
                  ? 'bg-[#3B82F6]'
                  : 'bg-[#DC2626]',
            }
          : o
      )
    );
    setActiveRowMenuId(null);
  };

  const handleExportPdf = () => {
    const targetOrders = selectedIds.length > 0
      ? filteredOrders.filter((o) => selectedIds.includes(o.id))
      : filteredOrders;

    const headers = ['Order #', 'Customer', 'Date', 'Items', 'Total Amount', 'Status'];
    const rows = targetOrders.map((o) => [
      o.soNo,
      o.customer,
      o.date,
      o.items,
      o.totalAmount,
      o.status,
    ]);

    const pdfData = createMasterRegisterPdfData('Sales Orders Register', headers, rows);
    downloadDirectPdf(pdfData);
  };

  const [newCustomerName, setNewCustomerName] = useState('');
  const [newOrderAmount, setNewOrderAmount] = useState('');
  const [newOrderItems, setNewOrderItems] = useState('2 items');

  const handleCreateNewOrder = (e) => {
    e.preventDefault();
    if (!newCustomerName.trim() || !newOrderAmount.trim()) return;

    const newOrder = {
      id: Date.now(),
      soNo: `SO-2025-00${orders.length + 1}`,
      date: '02 Sep 2025',
      customer: newCustomerName,
      customerInitials: newCustomerName.slice(0, 2).toUpperCase(),
      customerAvatarBg: 'bg-[#CCDCD2] text-[#1E3A2E]',
      items: newOrderItems || '1 item',
      totalAmount: `₹ ${Number(newOrderAmount.replace(/[^0-9.-]+/g, '') || 0).toLocaleString('en-IN')}.00`,
      status: 'Confirmed',
      statusStyle: 'bg-[#EBF3FE] text-[#2563EB]',
      statusDot: 'bg-[#3B82F6]',
    };

    setOrders([newOrder, ...orders]);
    setNewCustomerName('');
    setNewOrderAmount('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-xs overflow-hidden transition-all duration-300">
      
      {/* 1. Table Top Header */}
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
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl pl-9 pr-3 py-2 text-xs text-[#141A17] placeholder:text-[#8A9B93] focus:outline-hidden focus:border-[#1C3A2F] focus:ring-1 focus:ring-[#1C3A2F] transition-all"
            />
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={() => {
              if (onCreateSO) onCreateSO();
              else setIsCreateModalOpen(true);
            }}
            className="inline-flex items-center gap-2 bg-[#1C3A2F] hover:bg-[#142C23] text-[#FAF8F5] text-xs font-semibold px-4 py-2 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer shrink-0"
            title="Create Sales Order"
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
              onClick={() => {
                setActiveFilterTab(tab);
                setCurrentPage(1);
              }}
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
            onClick={() => setSortAsc((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 border border-[#E2DAD0] text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs ${
              sortAsc ? 'bg-[#1C3A2F] text-white' : 'bg-white hover:bg-[#F5EFE6] text-[#4A5952]'
            }`}
            title="Toggle sort direction"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortAsc ? 'Oldest First' : 'Newest First'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportPdf}
            className="inline-flex items-center gap-1.5 bg-white border border-[#E2DAD0] hover:bg-[#F5EFE6] text-[#4A5952] text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
            title="Generate & Export PDF Report"
          >
            <Download className="w-3.5 h-3.5 text-[#738C80]" />
            <span>Export PDF</span>
          </button>
        </div>

      </div>

      {/* 3. Main Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-187.5">
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
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-[#738C80]">
                  No sales orders found matching your search.
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => {
                const isSelected = selectedIds.includes(order.id);
                const isMenuOpen = activeRowMenuId === order.id;

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
                    <td className="py-3.5 px-3">
                      <button
                        type="button"
                        onClick={() => handleViewInvoicePdf(order)}
                        className="font-semibold text-[#1C3A2F] hover:text-[#11241D] hover:underline font-mono text-xs inline-flex items-center gap-1.5 cursor-pointer text-left group"
                        title="Click to view and print official Tax Invoice PDF"
                      >
                        <span>{order.soNo}</span>
                        <FileText className="w-3 h-3 text-[#738C80] group-hover:text-[#1C3A2F] transition-colors" />
                      </button>
                    </td>

                    {/* Customer */}
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
                    <td className="py-3.5 pr-6 pl-3 text-right relative">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleDownloadInvoicePdfDirect(order)}
                          className="p-1.5 rounded-lg text-[#738C80] hover:text-[#1C3A2F] hover:bg-[#EAE4DC] transition-colors cursor-pointer"
                          title="Download Tax Invoice PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setActiveRowMenuId((prev) => (prev === order.id ? null : order.id))}
                            className="p-1.5 rounded-lg text-[#738C80] hover:text-[#141A17] hover:bg-[#EAE4DC] transition-colors cursor-pointer"
                            title="Actions menu"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-[#E8E1D5] shadow-xl py-1.5 z-40 text-left text-xs">
                              <button
                                type="button"
                                onClick={() => handleViewInvoicePdf(order)}
                                className="w-full px-3 py-1.5 text-left text-[#141A17] hover:bg-[#FAF8F5] transition-colors flex items-center gap-2 cursor-pointer"
                              >
                                <FileText className="w-3.5 h-3.5 text-[#2D4A3E]" />
                                <span>View PDF Preview</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownloadInvoicePdfDirect(order)}
                                className="w-full px-3 py-1.5 text-left text-[#141A17] hover:bg-[#FAF8F5] transition-colors flex items-center gap-2 cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5 text-[#2D4A3E]" />
                                <span>Download PDF</span>
                              </button>
                              <div className="my-1 border-t border-[#F0EAE1]" />
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(order.id, 'Invoiced')}
                                className="w-full px-3 py-1.5 text-left text-[#1E7445] hover:bg-[#E5F7ED] transition-colors cursor-pointer"
                              >
                                Mark as Invoiced
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(order.id, 'Confirmed')}
                                className="w-full px-3 py-1.5 text-left text-[#2563EB] hover:bg-[#EBF3FE] transition-colors cursor-pointer"
                              >
                                Mark as Confirmed
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
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
          Showing {Math.min(filteredOrders.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredOrders.length, currentPage * itemsPerPage)} of {filteredOrders.length} orders
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-[#E2DAD0] bg-white hover:bg-[#F2ECE4] disabled:opacity-40 disabled:cursor-not-allowed enabled:cursor-pointer transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i + 1}
              type="button"
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer shadow-2xs ${
                currentPage === i + 1
                  ? 'bg-[#1C3A2F] text-white'
                  : 'bg-white border border-[#E2DAD0] hover:bg-[#F2ECE4] text-[#141A17]'
              }`}
            >
              {i + 1}
            </button>
          ))}
          
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg border border-[#E2DAD0] bg-white hover:bg-[#F2ECE4] disabled:opacity-40 disabled:cursor-not-allowed enabled:cursor-pointer transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Inline Create Sales Order Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-[#141A17]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-2xl p-6 w-full max-w-md text-left">
            <h3 className="font-serif font-bold text-lg text-[#141A17] mb-1">Create Sales Order</h3>
            <p className="text-xs text-[#6B7A74] mb-4">Add a new customer sales order to the live register.</p>
            <form onSubmit={handleCreateNewOrder} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#141A17] mb-1">Customer / Client Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Interiors & Co."
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#141A17] mb-1">Order Items Summary</label>
                <input
                  type="text"
                  placeholder="e.g. 3 items (Living Room Set)"
                  value={newOrderItems}
                  onChange={(e) => setNewOrderItems(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#141A17] mb-1">Total Amount (₹)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 75000"
                  value={newOrderAmount}
                  onChange={(e) => setNewOrderAmount(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                />
              </div>
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E2DAD0] text-xs font-semibold text-[#5B6963] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1C3A2F] hover:bg-[#142C23] text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Save Sales Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document PDF Modal */}
      <DocumentPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        documentData={selectedPdfDoc}
      />

    </div>
  );
};

export default SalesOrdersTable;
>>>>>>> cf98a0a0b97483e2b0ad6dae9cda8ce59f23bfe6
