import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  Filter, 
  Download, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  X,
  Trash2,
  CheckCircle2,
  FileText,
  PackageCheck,
  CreditCard,
  Eye,
  AlertCircle
} from 'lucide-react';

export const PurchaseOrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState('All');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form state for Create PO
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    vendor: '',
    orderDate: new Date().toISOString().split('T')[0],
    notes: '',
    items: [{ product: '', quantity: 1, unitPrice: 0, subtotal: 0 }]
  });

  const staticFallback = [
    {
      id: 'mock-1',
      _id: 'mock-1',
      orderNumber: 'PO/2026/001',
      date: '02 Sep 2026',
      vendorName: 'Azure Furniture',
      vendorInitials: 'AF',
      vendorAvatarBg: 'bg-[#CCDCD2] text-[#1E3A2E]',
      itemCount: 5,
      totalAmount: 48750,
      status: 'received',
      items: []
    },
    {
      id: 'mock-2',
      _id: 'mock-2',
      orderNumber: 'PO/2026/002',
      date: '30 Aug 2026',
      vendorName: 'Woodland Supplies',
      vendorInitials: 'WS',
      vendorAvatarBg: 'bg-[#DFD8CE] text-[#3D372E]',
      itemCount: 3,
      totalAmount: 33200,
      status: 'confirmed',
      items: []
    },
    {
      id: 'mock-3',
      _id: 'mock-3',
      orderNumber: 'PO/2026/003',
      date: '28 Aug 2026',
      vendorName: 'Royal Hardware',
      vendorInitials: 'RH',
      vendorAvatarBg: 'bg-[#F2DDD0] text-[#5C3826]',
      itemCount: 8,
      totalAmount: 12500,
      status: 'billed',
      items: []
    },
    {
      id: 'mock-4',
      _id: 'mock-4',
      orderNumber: 'PO/2026/004',
      date: '26 Aug 2026',
      vendorName: 'Crafty Wood Co.',
      vendorInitials: 'CW',
      vendorAvatarBg: 'bg-[#D6DDD9] text-[#2C3B34]',
      itemCount: 4,
      totalAmount: 27800,
      status: 'draft',
      items: []
    }
  ];

  // Fetch live purchase orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const res = await fetch('/api/purchase-orders', { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.purchaseOrders && data.purchaseOrders.length > 0) {
          const mapped = data.purchaseOrders.map(po => {
            const vName = po.vendor?.name || 'Vendor';
            const initials = vName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'VN';
            const d = new Date(po.orderDate || po.createdAt);
            const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
            return {
              id: po._id,
              _id: po._id,
              orderNumber: po.orderNumber,
              date: dateStr,
              vendorName: vName,
              vendorInitials: initials,
              vendorAvatarBg: 'bg-[#CCDCD2] text-[#1E3A2E]',
              itemCount: po.items ? po.items.length : 1,
              totalAmount: po.totalAmount || 0,
              status: po.status || 'draft',
              items: po.items || [],
              rawOrder: po
            };
          });
          setOrders(mapped);
        } else {
          setOrders(staticFallback);
        }
      } else {
        setOrders(staticFallback);
      }
    } catch {
      setOrders(staticFallback);
    } finally {
      setLoading(false);
    }
  };

  // Fetch vendors and products for form
  const fetchFormData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const [cRes, pRes] = await Promise.all([
        fetch('/api/contacts', { headers }).catch(() => null),
        fetch('/api/products', { headers }).catch(() => null)
      ]);

      if (cRes && cRes.ok) {
        const cData = await cRes.json();
        setVendors(cData.contacts || []);
      }
      if (pRes && pRes.ok) {
        const pData = await pRes.json();
        setProducts(pData.products || []);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchFormData();
  }, []);

  const showNotify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Multi-item row handlers
  const handleAddItemRow = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { product: '', quantity: 1, unitPrice: 0, subtotal: 0 }]
    }));
  };

  const handleRemoveItemRow = (idx) => {
    if (formData.items.length === 1) return;
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx)
    }));
  };

  const handleItemChange = (idx, field, val) => {
    setFormData(prev => {
      const updated = [...prev.items];
      const item = { ...updated[idx], [field]: val };

      if (field === 'product') {
        const prod = products.find(p => p._id === val);
        if (prod) {
          item.unitPrice = prod.costPrice || 0;
        }
      }

      const qty = Number(item.quantity) || 0;
      const price = Number(item.unitPrice) || 0;
      item.subtotal = Math.round(qty * price * 100) / 100;

      updated[idx] = item;
      return { ...prev, items: updated };
    });
  };

  const calculateGrandTotal = () => {
    return Math.round(
      formData.items.reduce((sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0) * 100
    ) / 100;
  };

  // Submit Create PO
  const handleSubmitPO = async (e) => {
    e.preventDefault();
    if (!formData.vendor) {
      showNotify('Please select a supplier / vendor', 'error');
      return;
    }
    if (formData.items.some(it => !it.product)) {
      showNotify('Please select a product for all line item rows', 'error');
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/purchase-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          vendor: formData.vendor,
          orderDate: formData.orderDate,
          notes: formData.notes,
          items: formData.items.map(it => ({
            product: it.product,
            quantity: Number(it.quantity),
            unitPrice: Number(it.unitPrice)
          }))
        })
      });

      const data = await res.json();
      if (res.ok) {
        showNotify('Purchase Order created successfully!', 'success');
        setCreateModalOpen(false);
        setFormData({
          vendor: '',
          orderDate: new Date().toISOString().split('T')[0],
          notes: '',
          items: [{ product: '', quantity: 1, unitPrice: 0, subtotal: 0 }]
        });
        fetchOrders();
      } else {
        showNotify(data.message || 'Failed to create purchase order', 'error');
      }
    } catch {
      showNotify('Error connecting to server', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Lifecycle Action: Confirm PO
  const handleConfirmOrder = async (orderId) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/purchase-orders/${orderId}/confirm`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (res.ok) {
        showNotify('Purchase Order confirmed successfully!', 'success');
        fetchOrders();
        setDetailModalOpen(false);
      } else {
        showNotify(data.message || 'Failed to confirm purchase order', 'error');
      }
    } catch {
      showNotify('Error connecting to server', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Lifecycle Action: Receive Goods (Goods Receipt)
  const handleReceiveGoods = async (order) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const receiptRes = await fetch('/api/goods-receipts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          receiptNumber: `GR/${new Date().getFullYear()}/${Date.now().toString().slice(-5)}`,
          purchaseOrder: order.id,
          vendor: order.rawOrder?.vendor?._id || order.rawOrder?.vendor || vendors[0]?._id,
          receiptDate: new Date().toISOString(),
          items: (order.items && order.items.length > 0 ? order.items : [
            { product: products[0]?._id, quantity: 1, unitPrice: order.totalAmount, totalPrice: order.totalAmount }
          ]).map(it => ({
            product: it.product?._id || it.product,
            quantity: it.quantity || 1,
            unitPrice: it.unitPrice || 1000,
            totalPrice: Math.round((it.quantity || 1) * (it.unitPrice || 1000) * 100) / 100
          }))
        })
      });

      const receiptData = await receiptRes.json();
      if (receiptRes.ok) {
        // Confirm goods receipt to update warehouse inventory
        await fetch(`/api/goods-receipts/${receiptData.goodsReceipt._id}/confirm`, {
          method: 'POST',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });

        // Update PO status to received
        await fetch(`/api/purchase-orders/${order.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ status: 'received' })
        });

        showNotify('Goods received and inventory updated successfully!', 'success');
        fetchOrders();
        setDetailModalOpen(false);
      } else {
        showNotify(receiptData.message || 'Failed to record goods receipt', 'error');
      }
    } catch {
      showNotify('Error recording goods receipt', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Lifecycle Action: Generate & Post Vendor Bill
  const handleBillOrder = async (order) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const billRes = await fetch('/api/vendor-bills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          vendor: order.rawOrder?.vendor?._id || order.rawOrder?.vendor || vendors[0]?._id,
          purchaseOrder: order.id,
          billDate: new Date().toISOString(),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          items: (order.items && order.items.length > 0 ? order.items : [
            { product: products[0]?._id, quantity: 1, unitPrice: order.totalAmount }
          ]).map(it => ({
            product: it.product?._id || it.product,
            quantity: it.quantity || 1,
            unitPrice: it.unitPrice || 1000
          }))
        })
      });

      const billData = await billRes.json();
      if (billRes.ok) {
        // Post bill into double-entry accounting engine (Debit Expense, Credit Creditors)
        await fetch(`/api/vendor-bills/${billData.vendorBill._id}/post`, {
          method: 'POST',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });

        // Update PO status to billed
        await fetch(`/api/purchase-orders/${order.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ status: 'billed' })
        });

        showNotify('Vendor Bill posted to General Ledger successfully!', 'success');
        fetchOrders();
        setDetailModalOpen(false);
      } else {
        showNotify(billData.message || 'Failed to create vendor bill', 'error');
      }
    } catch {
      showNotify('Error processing vendor bill', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Lifecycle Action: Pay Vendor Bill
  const handlePayVendor = async (order) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const payRes = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          paymentType: 'send_money',
          partner: order.rawOrder?.vendor?._id || order.rawOrder?.vendor || vendors[0]?._id,
          amount: order.totalAmount,
          paymentMethod: 'Bank Transfer (RTGS)',
          notes: `Settlement for ${order.orderNumber}`
        })
      });

      const payData = await payRes.json();
      if (payRes.ok) {
        showNotify(`Vendor Payment of ₹${order.totalAmount.toLocaleString('en-IN')} recorded & balanced!`, 'success');
        fetchOrders();
        setDetailModalOpen(false);
      } else {
        showNotify(payData.message || 'Failed to register vendor payment', 'error');
      }
    } catch {
      showNotify('Error registering payment', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filterTabs = ['All', 'Draft', 'Confirmed', 'Received', 'Billed'];

  const filteredOrders = useMemo(() => {
    let result = orders;
    if (activeFilterTab !== 'All') {
      result = result.filter(o => o.status.toLowerCase() === activeFilterTab.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.vendorName.toLowerCase().includes(q) ||
        o.date.toLowerCase().includes(q) ||
        o.status.toLowerCase().includes(q)
      );
    }
    return result;
  }, [orders, searchQuery, activeFilterTab]);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return { style: 'bg-[#EBF3FE] text-[#2563EB]', dot: 'bg-[#3B82F6]', label: 'Confirmed PO' };
      case 'received':
        return { style: 'bg-[#E0F2FE] text-[#0369A1]', dot: 'bg-[#0EA5E9]', label: 'Goods Received' };
      case 'billed':
        return { style: 'bg-[#E5F7ED] text-[#1E7445]', dot: 'bg-[#10B981]', label: 'Billed / Posted' };
      case 'paid':
        return { style: 'bg-[#DCFCE7] text-[#15803D]', dot: 'bg-[#22C55E]', label: 'Paid & Settled' };
      case 'cancelled':
        return { style: 'bg-[#FDE8E8] text-[#991B1B]', dot: 'bg-[#DC2626]', label: 'Cancelled' };
      default:
        return { style: 'bg-[#FEF7EC] text-[#D97706]', dot: 'bg-[#F59E0B]', label: 'Draft / RFQ' };
    }
  };

  const grandTotal = calculateGrandTotal();

  return (
    <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-xs overflow-hidden transition-all duration-300">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 ${
          notification.type === 'error' ? 'bg-[#991B1B] text-white' : 'bg-[#1C3A2F] text-[#FAF8F5]'
        }`}>
          {notification.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* 1. Table Top Header */}
      <div className="p-5 sm:p-6 border-b border-[#F0EAE1] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#F4EFE6] text-[#1C3A2F] flex items-center justify-center border border-[#E5DDD0] shadow-2xs shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#141A17] tracking-tight">
              Purchase Orders & RFQs
            </h2>
            <p className="text-xs text-[#6B7A74] mt-0.5">
              Manage vendor procurement, goods receipts, and vendor bill posting.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-[#8A9B93] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search POs, suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl pl-9 pr-3 py-2 text-xs text-[#141A17] placeholder:text-[#8A9B93] focus:outline-hidden focus:border-[#1C3A2F] focus:ring-1 focus:ring-[#1C3A2F] transition-all"
            />
          </div>

          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#1C3A2F] hover:bg-[#142C23] text-[#FAF8F5] text-xs font-semibold px-4 py-2 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Purchase Order</span>
            <span className="sm:hidden">Create</span>
          </button>
        </div>

      </div>

      {/* 2. Filter Tabs & Action Toolbar */}
      <div className="px-5 sm:px-6 py-3.5 bg-[#FAF8F5]/80 border-b border-[#F0EAE1] flex flex-wrap items-center justify-between gap-3">
        
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

        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={fetchOrders}
            className="inline-flex items-center gap-1.5 bg-white border border-[#E2DAD0] hover:bg-[#F5EFE6] text-[#4A5952] text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            <span>↻ Refresh</span>
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
                  onChange={() => setSelectedIds(selectedIds.length === filteredOrders.length ? [] : filteredOrders.map(o => o.id))}
                  className="rounded-sm border-[#C5BBAF] text-[#1C3A2F] focus:ring-[#1C3A2F] cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-3">PO #</th>
              <th className="py-3.5 px-3">Supplier</th>
              <th className="py-3.5 px-3">Date</th>
              <th className="py-3.5 px-3">Items</th>
              <th className="py-3.5 px-3">Total Amount</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 pr-6 pl-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EAE1] text-xs text-[#141A17]">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-[#738C80]">
                  No purchase orders found matching your search.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const isSelected = selectedIds.includes(order.id);
                const badge = getStatusBadge(order.status);
                return (
                  <tr
                    key={order.id}
                    className={`hover:bg-[#FAF7F2] transition-colors group cursor-pointer ${
                      isSelected ? 'bg-[#F2ECE1]/60' : ''
                    }`}
                    onClick={() => {
                      setSelectedOrder(order);
                      setDetailModalOpen(true);
                    }}
                  >
                    <td className="py-3.5 pl-6 pr-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => setSelectedIds(prev => prev.includes(order.id) ? prev.filter(i => i !== order.id) : [...prev, order.id])}
                        className="rounded-sm border-[#C5BBAF] text-[#1C3A2F] focus:ring-[#1C3A2F] cursor-pointer"
                      />
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-[#1C3A2F] font-mono text-xs">
                      {order.orderNumber}
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10.5px] font-bold ${order.vendorAvatarBg} shadow-2xs shrink-0`}>
                          {order.vendorInitials}
                        </div>
                        <span className="font-semibold text-[#141A17]">
                          {order.vendorName}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-[#55665E]">
                      {order.date}
                    </td>

                    <td className="py-3.5 px-3 text-[#55665E]">
                      {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
                    </td>

                    <td className="py-3.5 px-3 font-bold font-serif text-[#141A17]">
                      ₹ {Number(order.totalAmount || 0).toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${badge.style} shadow-2xs`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        <span>{badge.label}</span>
                      </span>
                    </td>

                    <td className="py-3.5 pr-6 pl-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOrder(order);
                          setDetailModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 bg-[#F5F1EA] hover:bg-[#EAE4DC] text-[#2D4A3E] px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
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
          Showing {filteredOrders.length} purchase orders
        </span>
        <div className="text-[11px] text-[#7A8A83] font-medium">
          Integrated with inventory receipts and vendor payable ledgers
        </div>
      </div>

      {/* CREATE PURCHASE ORDER MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E4DCD0] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-[#F0EAE1] flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1C3A2F] text-white flex items-center justify-center shadow-xs">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold text-[#141A17]">Create Purchase Order</h3>
                  <p className="text-xs text-[#6B7A74]">Multi-product procurement requisition from supplier</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-[#8A9B93] hover:text-[#141A17] hover:bg-[#EAE4DC] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitPO} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A5550] mb-1.5">Supplier / Vendor *</label>
                  <select
                    required
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                  >
                    <option value="">-- Select Vendor --</option>
                    {vendors.map(v => (
                      <option key={v._id} value={v._id}>{v.name} ({v.type})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A5550] mb-1.5">Order Date</label>
                  <input
                    type="date"
                    value={formData.orderDate}
                    onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                  />
                </div>
              </div>

              {/* Line Items Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-2">
                  <h4 className="text-xs font-bold text-[#141A17] uppercase tracking-wider">Purchase Items</h4>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1C3A2F] hover:text-[#10241D] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {formData.items.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3D7]">
                      <div className="flex-1">
                        <select
                          required
                          value={item.product}
                          onChange={(e) => handleItemChange(idx, 'product', e.target.value)}
                          className="w-full bg-white border border-[#E2DAD0] rounded-lg px-2.5 py-1.5 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                        >
                          <option value="">Select Raw Material / Product...</option>
                          {products.map(p => (
                            <option key={p._id} value={p._id}>
                              {p.name} (Cost: ₹{p.costPrice})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="w-20">
                        <input
                          type="number"
                          min="1"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          className="w-full bg-white border border-[#E2DAD0] rounded-lg px-2 py-1.5 text-xs text-[#141A17] text-center"
                        />
                      </div>

                      <div className="w-28">
                        <input
                          type="number"
                          min="0"
                          placeholder="Unit Cost"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                          className="w-full bg-white border border-[#E2DAD0] rounded-lg px-2 py-1.5 text-xs text-[#141A17] text-right font-mono"
                        />
                      </div>

                      <div className="w-24 text-right font-bold text-xs font-serif text-[#141A17] px-2">
                        ₹ {item.subtotal.toLocaleString('en-IN')}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        disabled={formData.items.length === 1}
                        className="p-1.5 text-[#A34335] hover:bg-[#FBE8E6] rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grand Total */}
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E1D5] flex items-center justify-between text-xs">
                <span className="font-bold text-[#4A5550]">Total Procurement Cost:</span>
                <span className="font-serif font-bold text-base text-[#1C3A2F]">₹ {grandTotal.toLocaleString('en-IN')}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A5550] mb-1">Vendor Instructions & Notes</label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Delivery warehouse instructions or material grade..."
                  className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0EAE1]">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E2DAD0] text-xs font-semibold text-[#4A5550] hover:bg-[#F2ECE4] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-[#1C3A2F] hover:bg-[#142C23] text-[#FAF8F5] text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {actionLoading ? 'Creating...' : 'Save & Issue RFQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PO DETAIL & WORKFLOW MODAL */}
      {detailModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E4DCD0] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="p-6 border-b border-[#F0EAE1] flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1C3A2F] text-white flex items-center justify-center shadow-xs">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold text-[#141A17]">{selectedOrder.orderNumber}</h3>
                  <p className="text-xs text-[#6B7A74]">{selectedOrder.vendorName} • {selectedOrder.date}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="p-1.5 rounded-lg text-[#8A9B93] hover:text-[#141A17] hover:bg-[#EAE4DC] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper */}
            <div className="px-6 py-4 bg-[#F7F4EE] border-b border-[#EAE3D7] flex items-center justify-between text-[11px] font-bold">
              <div className={`flex items-center gap-1.5 ${['draft', 'confirmed', 'received', 'billed', 'paid'].includes(selectedOrder.status) ? 'text-[#1C3A2F]' : 'text-[#8A9B93]'}`}>
                <span className="w-5 h-5 rounded-full bg-[#1C3A2F] text-white flex items-center justify-center text-[9px]">1</span>
                <span>RFQ</span>
              </div>
              <div className="h-0.5 w-6 bg-[#D8CFBF]" />
              <div className={`flex items-center gap-1.5 ${['confirmed', 'received', 'billed', 'paid'].includes(selectedOrder.status) ? 'text-[#1C3A2F]' : 'text-[#8A9B93]'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] ${['confirmed', 'received', 'billed', 'paid'].includes(selectedOrder.status) ? 'bg-[#1C3A2F] text-white' : 'bg-[#E0D7C8] text-[#7A8A83]'}`}>2</span>
                <span>Confirmed PO</span>
              </div>
              <div className="h-0.5 w-6 bg-[#D8CFBF]" />
              <div className={`flex items-center gap-1.5 ${['received', 'billed', 'paid'].includes(selectedOrder.status) ? 'text-[#1C3A2F]' : 'text-[#8A9B93]'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] ${['received', 'billed', 'paid'].includes(selectedOrder.status) ? 'bg-[#1C3A2F] text-white' : 'bg-[#E0D7C8] text-[#7A8A83]'}`}>3</span>
                <span>Goods Received</span>
              </div>
              <div className="h-0.5 w-6 bg-[#D8CFBF]" />
              <div className={`flex items-center gap-1.5 ${['billed', 'paid'].includes(selectedOrder.status) ? 'text-[#1C3A2F]' : 'text-[#8A9B93]'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] ${['billed', 'paid'].includes(selectedOrder.status) ? 'bg-[#1C3A2F] text-white' : 'bg-[#E0D7C8] text-[#7A8A83]'}`}>4</span>
                <span>Vendor Billed</span>
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8E1D5]">
                <div>
                  <span className="text-[#7A8A83] block text-[10px] uppercase font-bold">Vendor</span>
                  <span className="font-semibold text-[#141A17]">{selectedOrder.vendorName}</span>
                </div>
                <div>
                  <span className="text-[#7A8A83] block text-[10px] uppercase font-bold">Date</span>
                  <span className="font-semibold text-[#141A17]">{selectedOrder.date}</span>
                </div>
                <div>
                  <span className="text-[#7A8A83] block text-[10px] uppercase font-bold">Total Cost</span>
                  <span className="font-serif font-bold text-[#1C3A2F] text-sm">₹ {Number(selectedOrder.totalAmount).toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[#7A8A83] block text-[10px] uppercase font-bold">Status</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(selectedOrder.status).style}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Procurement Actions */}
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E4DCD0] space-y-3">
                <h4 className="text-xs font-bold text-[#141A17] uppercase tracking-wider">Procurement Action Buttons</h4>
                <div className="flex flex-wrap gap-2.5">
                  {selectedOrder.status === 'draft' && (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleConfirmOrder(selectedOrder.id)}
                      className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3.5 py-2 rounded-xl font-semibold text-xs shadow-2xs transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Order (RFQ → Purchase Order)</span>
                    </button>
                  )}

                  {selectedOrder.status === 'confirmed' && (
                    <>
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleReceiveGoods(selectedOrder)}
                        className="inline-flex items-center gap-1.5 bg-[#0284C7] hover:bg-[#0369A1] text-white px-3.5 py-2 rounded-xl font-semibold text-xs shadow-2xs transition-all cursor-pointer"
                      >
                        <PackageCheck className="w-4 h-4" />
                        <span>Receive Goods (Create Goods Receipt)</span>
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleBillOrder(selectedOrder)}
                        className="inline-flex items-center gap-1.5 bg-[#1C3A2F] hover:bg-[#142C23] text-white px-3.5 py-2 rounded-xl font-semibold text-xs shadow-2xs transition-all cursor-pointer"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Create & Post Vendor Bill</span>
                      </button>
                    </>
                  )}

                  {selectedOrder.status === 'received' && (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleBillOrder(selectedOrder)}
                      className="inline-flex items-center gap-1.5 bg-[#1C3A2F] hover:bg-[#142C23] text-white px-3.5 py-2 rounded-xl font-semibold text-xs shadow-2xs transition-all cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Generate & Post Vendor Bill</span>
                    </button>
                  )}

                  {selectedOrder.status === 'billed' && (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handlePayVendor(selectedOrder)}
                      className="inline-flex items-center gap-1.5 bg-[#15803D] hover:bg-[#166534] text-white px-3.5 py-2 rounded-xl font-semibold text-xs shadow-2xs transition-all cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pay Vendor Bill & Update Creditors</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#FAF8F5] border-t border-[#F0EAE1] flex justify-end">
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#E2DAD0] text-xs font-semibold text-[#4A5550] hover:bg-[#F2ECE4] cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default PurchaseOrdersTable;
