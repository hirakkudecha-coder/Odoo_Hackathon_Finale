import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  Filter, 
  Download, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
  FileText
} from 'lucide-react';
import { generatePurchaseOrderPDF, exportTableToPDF } from '../../../utils/pdfGenerator';

export const PurchaseOrdersTable = ({ onCreatePO }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Purchase Orders'); // 'Purchase Orders' | 'Purchase Bills' | 'Suppliers' | 'Payments'
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const handleExportPDF = () => {
    const headers = ['#', 'PO #', 'SUPPLIER', 'DATE', 'ITEMS', 'TOTAL AMOUNT', 'STATUS'];
    const rows = filteredOrders.map((o, idx) => [
      String(idx + 1),
      o.poNo,
      o.supplier,
      o.date,
      o.items,
      o.totalAmount,
      o.status
    ]);
    exportTableToPDF('PURCHASE ORDERS PROCUREMENT REGISTER', headers, rows);
  };

  const handleDownloadPO = (order) => {
    generatePurchaseOrderPDF(order);
  };

  const rawOrders = [
    {
      id: 1,
      poNo: 'PO-2024-001',
      date: '12 Aug 2024',
      supplier: 'HomeWorks Supplies',
      supplierInitials: 'HW',
      supplierAvatarBg: 'bg-[#F4E8DC] text-[#8B4513]',
      items: '5 items',
      totalAmount: '₹ 48,750.00',
      status: 'Received',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 2,
      poNo: 'PO-2024-002',
      date: '10 Aug 2024',
      supplier: 'DesignCraft',
      supplierInitials: 'DC',
      supplierAvatarBg: 'bg-[#E5DCD0] text-[#14231C]',
      items: '3 items',
      totalAmount: '₹ 27,300.00',
      status: 'Ordered',
      statusStyle: 'bg-[#EBF3FE] text-[#2563EB]',
      statusDot: 'bg-[#3B82F6]',
    },
    {
      id: 3,
      poNo: 'PO-2024-003',
      date: '08 Aug 2024',
      supplier: 'Sheetal Living',
      supplierInitials: 'SL',
      supplierAvatarBg: 'bg-[#E0E6E3] text-[#1F4536]',
      items: '8 items',
      totalAmount: '₹ 1,12,500.00',
      status: 'Received',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 4,
      poNo: 'PO-2024-004',
      date: '05 Aug 2024',
      supplier: 'Urban Roots',
      supplierInitials: 'UR',
      supplierAvatarBg: 'bg-[#E2E8F0] text-[#334155]',
      items: '4 items',
      totalAmount: '₹ 36,800.00',
      status: 'Partially Received',
      statusStyle: 'bg-[#FEF7EC] text-[#D97706]',
      statusDot: 'bg-[#F59E0B]',
    },
    {
      id: 5,
      poNo: 'PO-2024-005',
      date: '01 Aug 2024',
      supplier: 'NextGen Interiors',
      supplierInitials: 'NG',
      supplierAvatarBg: 'bg-[#E0E6E3] text-[#1F4536]',
      items: '6 items',
      totalAmount: '₹ 89,200.00',
      status: 'Pending',
      statusStyle: 'bg-[#FDECE7] text-[#C95426]',
      statusDot: 'bg-[#EF4444]',
    },
    {
      id: 6,
      poNo: 'PO-2024-006',
      date: '28 Jul 2024',
      supplier: 'Rohan Kapoor & Co.',
      supplierInitials: 'RK',
      supplierAvatarBg: 'bg-[#E5DCD0] text-[#14231C]',
      items: '2 items',
      totalAmount: '₹ 18,450.00',
      status: 'Received',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 7,
      poNo: 'PO-2024-007',
      date: '25 Jul 2024',
      supplier: 'Elegant Spaces',
      supplierInitials: 'EL',
      supplierAvatarBg: 'bg-[#E8EFF5] text-[#2C5282]',
      items: '7 items',
      totalAmount: '₹ 92,600.00',
      status: 'Ordered',
      statusStyle: 'bg-[#EBF3FE] text-[#2563EB]',
      statusDot: 'bg-[#3B82F6]',
    },
    {
      id: 8,
      poNo: 'PO-2024-008',
      date: '20 Jul 2024',
      supplier: 'DesignCraft',
      supplierInitials: 'DC',
      supplierAvatarBg: 'bg-[#E5DCD0] text-[#14231C]',
      items: '3 items',
      totalAmount: '₹ 31,950.00',
      status: 'Cancelled',
      statusStyle: 'bg-[#FDE8E8] text-[#991B1B]',
      statusDot: 'bg-[#DC2626]',
    },
  ];

  const [apiOrders, setApiOrders] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch('/api/purchase-orders', { headers });
        if (res.ok) {
          const json = await res.json();
          if (json.purchaseOrders && Array.isArray(json.purchaseOrders) && json.purchaseOrders.length > 0) {
            const mapped = json.purchaseOrders.map((po, idx) => {
              const supName = po.vendor?.name || 'Primary Supplier';
              const initials = supName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
              const dateStr = po.orderDate ? new Date(po.orderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent';
              const amtStr = `₹ ${Number(po.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
              const rawStatus = (po.status || 'draft').toLowerCase();

              let statusLabel = 'Ordered';
              let statusStyle = 'bg-[#EBF3FE] text-[#2563EB]';
              let statusDot = 'bg-[#3B82F6]';

              if (rawStatus === 'confirmed') {
                statusLabel = 'Confirmed';
                statusStyle = 'bg-[#E5F7ED] text-[#1E7445]';
                statusDot = 'bg-[#10B981]';
              } else if (rawStatus === 'received') {
                statusLabel = 'Received';
                statusStyle = 'bg-[#E5F7ED] text-[#1E7445]';
                statusDot = 'bg-[#10B981]';
              } else if (rawStatus === 'cancelled') {
                statusLabel = 'Cancelled';
                statusStyle = 'bg-[#FDE8E8] text-[#991B1B]';
                statusDot = 'bg-[#DC2626]';
              }

              return {
                id: po._id || idx + 1,
                poNo: po.orderNumber || `PO-2026-${String(idx + 1).padStart(3, '0')}`,
                date: dateStr,
                supplier: supName,
                supplierInitials: initials,
                supplierAvatarBg: 'bg-[#F4E8DC] text-[#8B4513]',
                items: `${po.items?.length || 1} items`,
                totalAmount: amtStr,
                status: statusLabel,
                statusStyle,
                statusDot
              };
            });
            if (isMounted) setApiOrders(mapped);
          }
        }
      } catch (err) {
        console.warn('Live purchase orders fetch failed, using fallback:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadOrders();
    return () => { isMounted = false; };
  }, []);

  const displayedOrders = apiOrders || rawOrders;

  // Filter purchase orders
  const filteredOrders = useMemo(() => {
    return displayedOrders.filter((order) => {
      if (statusFilter !== 'All Status' && order.status !== statusFilter) return false;
      if (activeTab === 'Suppliers' && !['HomeWorks Supplies', 'Sheetal Living', 'DesignCraft'].includes(order.supplier)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          order.poNo.toLowerCase().includes(q) ||
          order.supplier.toLowerCase().includes(q) ||
          order.date.toLowerCase().includes(q) ||
          order.status.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [displayedOrders, searchQuery, statusFilter, activeTab]);

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

  const tabs = ['Purchase Orders', 'Purchase Bills', 'Suppliers', 'Payments'];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E8E1D5] shadow-xs text-left">
      
      {/* 1. Header Row: Title & Action Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#F0EAE1]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F0EC] text-[#2D4A3E] flex items-center justify-center shrink-0 border border-[#D5E5DD] shadow-2xs">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#141A17] tracking-tight">
              Purchase Orders
            </h2>
            <p className="text-xs text-[#6B7A74] mt-0.5">
              Create and manage your purchase orders with suppliers.
            </p>
          </div>
        </div>

        {/* Right Search and Create Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A9791]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search purchase orders..."
              className="w-full bg-[#FAF8F5] border border-[#E4DCD0] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#141A17] placeholder:text-[#8A9791] focus:outline-hidden focus:border-[#2D4A3E] focus:bg-white transition-all shadow-2xs"
            />
          </div>

          <button
            onClick={onCreatePO}
            className="inline-flex items-center gap-2 bg-[#1C3A2F] hover:bg-[#142921] active:scale-95 text-[#FAF8F5] px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Purchase Order</span>
          </button>
        </div>
      </div>

      {/* 2. Filter & Export Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F5F1EA]/80 rounded-xl border border-[#E8E1D5] w-full sm:w-auto overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#1C3A2F] text-[#FAF8F5] font-semibold shadow-2xs'
                    : 'text-[#66756F] hover:text-[#141A17] hover:bg-white/60'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Right Action Dropdowns: Filter & Export */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Status Filter Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-[#E4DCD0] rounded-xl px-3.5 py-1.5 pr-8 text-xs font-semibold text-[#4A5550] hover:bg-[#FAF8F5] transition-all cursor-pointer shadow-2xs focus:outline-hidden"
            >
              <option>All Status</option>
              <option>Received</option>
              <option>Ordered</option>
              <option>Partially Received</option>
              <option>Pending</option>
              <option>Cancelled</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7A8881] pointer-events-none" />
          </div>

          <button 
            onClick={handleExportPDF}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E4DCD0] bg-white text-xs font-semibold text-[#4A5550] hover:bg-[#FAF8F5] hover:text-[#1C3A2F] active:scale-95 transition-all cursor-pointer shadow-2xs"
            title="Export Purchase Orders Register PDF"
          >
            <Download className="w-3.5 h-3.5 text-[#7A8881]" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* 3. Table Container */}
      <div className="overflow-x-auto border border-[#EFE8DC] rounded-2xl">
        <table className="w-full text-left text-xs min-w-[750px]">
          <thead>
            <tr className="bg-[#FAF8F5] text-[10px] uppercase font-bold text-[#6D7D76] tracking-wider border-b border-[#EFE8DC]">
              <th className="py-3.5 px-4 w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredOrders.length && filteredOrders.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-[#DDD4C7] text-[#1C3A2F] focus:ring-[#1C3A2F] cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-4 font-semibold">
                PO NO.
              </th>
              <th className="py-3.5 px-4 font-semibold">
                DATE
              </th>
              <th className="py-3.5 px-4 font-semibold">
                SUPPLIER
              </th>
              <th className="py-3.5 px-4 font-semibold">
                ITEMS
              </th>
              <th className="py-3.5 px-4 font-semibold">
                TOTAL AMOUNT
              </th>
              <th className="py-3.5 px-4 font-semibold">
                STATUS
              </th>
              <th className="py-3.5 px-4 font-semibold text-right">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#F4EFEA] bg-white">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((o) => {
                const isSelected = selectedIds.includes(o.id);
                return (
                  <tr 
                    key={o.id} 
                    className={`hover:bg-[#FAF7F2] transition-colors duration-150 cursor-pointer group ${
                      isSelected ? 'bg-[#F9F6F0]' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(o.id)}
                        className="rounded border-[#DDD4C7] text-[#1C3A2F] focus:ring-[#1C3A2F] cursor-pointer"
                      />
                    </td>

                    {/* PO Number */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2D4A3E] group-hover:underline">
                      {o.poNo}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-[#5A6963] font-medium text-[11.5px] font-numeric">
                      {o.date}
                    </td>

                    {/* Supplier with Avatar Initials */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full ${o.supplierAvatarBg} flex items-center justify-center font-bold text-[10px] shrink-0 border border-black/5 shadow-2xs`}>
                          {o.supplierInitials}
                        </div>
                        <span className="font-bold text-[#141A17] text-xs group-hover:text-[#2D4A3E] transition-colors">
                          {o.supplier}
                        </span>
                      </div>
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-4 text-[#5A6963] font-medium font-numeric">
                      {o.items}
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-4 font-numeric font-bold text-[#141A17] text-xs">
                      {o.totalAmount}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${o.statusStyle}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${o.statusDot}`}></span>
                        <span>{o.status}</span>
                      </span>
                    </td>

                    {/* Actions Button */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadPO(o);
                          }}
                          className="p-1.5 rounded-lg text-[#2D4A3E] hover:bg-[#EAE3D6] hover:text-[#141A17] active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                          title={`Download PO for ${o.poNo}`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-semibold hidden md:inline">PDF</span>
                        </button>
                        <button 
                          className="p-1.5 rounded-lg text-[#85988F] hover:text-[#141A17] hover:bg-[#EFE9DF] transition-colors cursor-pointer"
                          title="More Options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-8 text-center text-[#7A8881] text-xs">
                  No purchase orders found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Footer & Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 pt-4 border-t border-[#F0EAE1] text-xs text-[#6B7A74]">
        <span>
          Showing 1–{filteredOrders.length} of {rawOrders.length} purchase orders
        </span>

        <div className="flex items-center gap-1.5">
          <button 
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-[#E4DCD0] bg-white hover:bg-[#FAF8F5] text-[#55635D] disabled:opacity-40 disabled:cursor-not-allowed enabled:cursor-pointer transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button className="w-8 h-8 rounded-lg bg-[#EAE3D6] text-[#1C3A2F] font-bold text-xs flex items-center justify-center border border-[#DDD4C7] shadow-2xs">
            1
          </button>

          <button 
            disabled={true}
            className="p-1.5 rounded-lg border border-[#E4DCD0] bg-white hover:bg-[#FAF8F5] text-[#55635D] disabled:opacity-40 disabled:cursor-not-allowed enabled:cursor-pointer transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default PurchaseOrdersTable;
