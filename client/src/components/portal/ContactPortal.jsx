import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  CreditCard, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  LogOut, 
  Shield, 
  User, 
  ArrowUpRight, 
  IndianRupee, 
  Receipt, 
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  X,
  Sparkles
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { DocumentPdfModal } from '../accountant/DocumentPdfModal';
import { createCustomerInvoicePdfData, createVendorBillPdfData, downloadDirectPdf } from '../../utils/pdfGenerator';

export const ContactPortal = ({ currentUser, onLogout, onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash.replace('#', '');
    return params.get('tab') || hash || 'invoices';
  });
  const [invoices, setInvoices] = useState([]);
  const [bills, setBills] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Synchronize browser history when tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const targetUrl = tabId === 'invoices' ? '/portal' : `/portal?tab=${tabId}`;
    window.history.pushState(null, '', targetUrl);
  };

  // Sync state on browser back/forward buttons
  useEffect(() => {
    const onLocationChange = () => {
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash.replace('#', '');
      setActiveTab(params.get('tab') || hash || 'invoices');
    };
    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);
  
  // Payment settlement modal state
  const [settleModalOpen, setSettleModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null); // invoice or bill being paid
  const [settleAmount, setSettleAmount] = useState('');
  const [settleMethod, setSettleMethod] = useState('Bank'); // 'Bank' | 'Cash'
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // PDF Preview modal state
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [selectedPdfDoc, setSelectedPdfDoc] = useState(null);

  const contactName = currentUser?.name || 'Valued Partner';
  const contactEmail = currentUser?.email || 'partner@urbanfurniture.com';
  const isVendor = currentUser?.role === 'contact' && currentUser?.isVendor;

  // Fetch Invoices, Bills, and Orders for the logged-in contact
  useEffect(() => {
    let isMounted = true;
    const fetchPortalData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // 1. Fetch Invoices
        const invRes = await fetch('/api/customer-invoices', { headers });
        if (invRes.ok) {
          const invJson = await invRes.json();
          if (invJson.customerInvoices && Array.isArray(invJson.customerInvoices)) {
            if (isMounted) setInvoices(invJson.customerInvoices);
          }
        }

        // 2. Fetch Bills
        const billRes = await fetch('/api/vendor-bills', { headers });
        if (billRes.ok) {
          const billJson = await billRes.json();
          if (billJson.vendorBills && Array.isArray(billJson.vendorBills)) {
            if (isMounted) setBills(billJson.vendorBills);
          }
        }

        // 3. Fetch Sales Orders & Purchase Orders
        const soRes = await fetch('/api/sales-orders', { headers });
        if (soRes.ok) {
          const soJson = await soRes.json();
          if (soJson.salesOrders && Array.isArray(soJson.salesOrders)) {
            if (isMounted) setOrders(soJson.salesOrders);
          }
        }
      } catch (err) {
        console.warn('Portal data fetch error:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchPortalData();
    return () => { isMounted = false; };
  }, []);

  // Compute summary stats
  const totalInvoiced = useMemo(() => {
    return invoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);
  }, [invoices]);

  const totalOutstanding = useMemo(() => {
    return invoices.reduce((acc, inv) => {
      if (inv.status !== 'paid') {
        return acc + ((inv.totalAmount || 0) - (inv.paidAmount || 0));
      }
      return acc;
    }, 0);
  }, [invoices]);

  const totalBillsPayable = useMemo(() => {
    return bills.reduce((acc, b) => {
      if (b.status !== 'paid') {
        return acc + ((b.totalAmount || 0) - (b.paidAmount || 0));
      }
      return acc;
    }, 0);
  }, [bills]);

  // Open Settle / Pay Modal
  const handleOpenSettle = (doc, type = 'invoice') => {
    setSelectedDocument({ ...doc, docType: type });
    const outstanding = Math.max(0, (doc.totalAmount || 0) - (doc.paidAmount || 0));
    setSettleAmount(outstanding > 0 ? String(outstanding) : String(doc.totalAmount || 0));
    setSettleMethod('Bank');
    setSettleModalOpen(true);
  };

  // Submit Payment / Settle Document
  const handleExecutePayment = async (e) => {
    e.preventDefault();
    if (!selectedDocument || !settleAmount || Number(settleAmount) <= 0) return;

    setIsSubmittingPayment(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const isInvoice = selectedDocument.docType === 'invoice';
      const payload = {
        paymentType: isInvoice ? 'receive_money' : 'send_money',
        amount: Number(settleAmount),
        paymentMethod: settleMethod,
        paymentDate: new Date(),
        notes: `Online portal settlement for ${selectedDocument.invoiceNumber || selectedDocument.billNumber || 'Document'} via ${settleMethod}`
      };

      if (isInvoice) {
        payload.customerInvoice = selectedDocument._id;
        payload.partner = selectedDocument.customer?._id || selectedDocument.customer;
      } else {
        payload.vendorBill = selectedDocument._id;
        payload.partner = selectedDocument.vendor?._id || selectedDocument.vendor;
      }

      const res = await fetch('/api/payments', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Payment processing failed');
      }

      // Update local state
      if (isInvoice) {
        setInvoices(prev => prev.map(inv => {
          if (inv._id === selectedDocument._id) {
            const newPaid = (inv.paidAmount || 0) + Number(settleAmount);
            return {
              ...inv,
              paidAmount: newPaid,
              status: newPaid >= inv.totalAmount - 0.01 ? 'paid' : 'partial'
            };
          }
          return inv;
        }));
      } else {
        setBills(prev => prev.map(b => {
          if (b._id === selectedDocument._id) {
            const newPaid = (b.paidAmount || 0) + Number(settleAmount);
            return {
              ...b,
              paidAmount: newPaid,
              status: newPaid >= b.totalAmount - 0.01 ? 'paid' : 'partial'
            };
          }
          return b;
        }));
      }

      setSettleModalOpen(false);
      alert(`Payment of ₹ ${Number(settleAmount).toLocaleString('en-IN')} successfully processed via ${settleMethod}! Your document is now updated.`);
    } catch (err) {
      alert(`Payment Error: ${err.message}`);
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  // View PDF
  const handleViewPdf = (doc, type = 'invoice') => {
    let pdfData = null;
    if (type === 'invoice') {
      pdfData = createCustomerInvoicePdfData(doc);
    } else {
      pdfData = createVendorBillPdfData(doc);
    }
    setSelectedPdfDoc(pdfData);
    setPdfModalOpen(true);
  };

  // Download Direct PDF
  const handleDownloadPdf = (doc, type = 'invoice') => {
    let pdfData = null;
    if (type === 'invoice') {
      pdfData = createCustomerInvoicePdfData(doc);
    } else {
      pdfData = createVendorBillPdfData(doc);
    }
    downloadDirectPdf(pdfData);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141A17] flex flex-col selection:bg-[#2D4A3E] selection:text-[#FAF8F5]">
      
      {/* Top Luxury Navbar */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#2D4A3E]/15 py-3 px-4 sm:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={(e) => {
                e.preventDefault();
                if (onNavigateHome) onNavigateHome();
                else {
                  window.history.pushState(null, '', '/');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }
              }}
              className="cursor-pointer text-left group"
              title="Return to Public Storefront"
            >
              <BrandLogo />
            </button>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#1C3A2F] text-[#FAF8F5] text-[10px] font-bold uppercase tracking-widest">
              Partner Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F2ECE4] border border-[#2D4A3E]/15 text-xs font-semibold text-[#1C3A2F]">
              <div className="w-5 h-5 rounded-full bg-[#1C3A2F] text-[#FAF8F5] flex items-center justify-center text-[10px] font-bold">
                {contactName.charAt(0).toUpperCase()}
              </div>
              <span className="truncate max-w-35 sm:max-w-none">{contactName}</span>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#DC2626]/30 text-[#DC2626] hover:bg-[#FEE2E2] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Banner Greeting */}
        <div className="bg-[#1C3A2F] text-[#FAF8F5] rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#2A5243] rounded-full filter blur-3xl opacity-30 -mr-20 -mt-20 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#FAF8F5] text-xs font-medium backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#F2C94C]" />
                <span>Self-Service Financial Account</span>
              </div>
              <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-tight">
                Welcome, {contactName}
              </h1>
              <p className="text-xs sm:text-sm text-[#FAF8F5]/80 max-w-xl">
                View your issued invoices, track payment status, download certified PDF receipts, and settle outstanding balances in real time.
              </p>
            </div>

            {/* Quick KPI Overview */}
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 min-w-35 sm:min-w-40 flex-1 md:flex-none">
                <span className="text-[10px] uppercase font-bold text-[#FAF8F5]/70 tracking-widest block">
                  Total Invoiced
                </span>
                <span className="font-serif-luxury text-lg sm:text-xl font-bold text-white mt-1 block">
                  ₹ {totalInvoiced.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 min-w-35 sm:min-w-40 flex-1 md:flex-none">
                <span className="text-[10px] uppercase font-bold text-[#F2C94C] tracking-widest block">
                  Outstanding Due
                </span>
                <span className="font-serif-luxury text-lg sm:text-xl font-bold text-[#F2C94C] mt-1 block">
                  ₹ {totalOutstanding.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E8E1D5] pb-2">
          <button
            type="button"
            onClick={() => handleTabChange('invoices')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'invoices'
                ? 'bg-[#1C3A2F] text-[#FAF8F5] shadow-xs'
                : 'bg-white text-[#5B6963] border border-[#E8E1D5] hover:bg-[#F2ECE4]'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>My Invoices ({invoices.length})</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('bills')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'bills'
                ? 'bg-[#1C3A2F] text-[#FAF8F5] shadow-xs'
                : 'bg-white text-[#5B6963] border border-[#E8E1D5] hover:bg-[#F2ECE4]'
            }`}
          >
            <IndianRupee className="w-4 h-4" />
            <span>Vendor Bills ({bills.length})</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('orders')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#1C3A2F] text-[#FAF8F5] shadow-xs'
                : 'bg-white text-[#5B6963] border border-[#E8E1D5] hover:bg-[#F2ECE4]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders & Delivery ({orders.length})</span>
          </button>
        </div>

        {/* Tab 1: Customer Invoices */}
        {activeTab === 'invoices' && (
          <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#F0EAE1] flex items-center justify-between">
              <div>
                <h2 className="font-serif-luxury text-lg font-bold text-[#141A17]">
                  Customer Invoices & Billing Statements
                </h2>
                <p className="text-xs text-[#6B7A74] mt-0.5">
                  Tax invoices issued to your account. Settle balances instantly via Bank or Cash.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-160">
                <thead>
                  <tr className="border-b border-[#EAE3D7] bg-[#F7F4EE] text-[11px] font-bold text-[#55665E] uppercase tracking-wider">
                    <th className="py-3.5 pl-6 pr-3">Invoice #</th>
                    <th className="py-3.5 px-3">Date</th>
                    <th className="py-3.5 px-3">Due Date</th>
                    <th className="py-3.5 px-3">Total Amount</th>
                    <th className="py-3.5 px-3">Paid Amount</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 pr-6 pl-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EAE1] text-xs text-[#141A17]">
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[#738C80]">
                        No invoices found for this partner account.
                      </td>
                    </tr>
                  ) : (
                    invoices.map((inv) => {
                      const outstanding = Math.max(0, (inv.totalAmount || 0) - (inv.paidAmount || 0));
                      const isPaid = inv.status === 'paid' || outstanding <= 0.01;
                      const isPartial = inv.status === 'partial' || (inv.paidAmount > 0 && !isPaid);

                      return (
                        <tr key={inv._id} className="hover:bg-[#FAF7F2] transition-colors">
                          <td className="py-3.5 pl-6 pr-3 font-semibold text-[#1C3A2F]">
                            {inv.invoiceNumber}
                          </td>
                          <td className="py-3.5 px-3 text-[#55665E]">
                            {inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString('en-GB') : '—'}
                          </td>
                          <td className="py-3.5 px-3 text-[#55665E]">
                            {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('en-GB') : '—'}
                          </td>
                          <td className="py-3.5 px-3 font-bold font-serif">
                            ₹ {Number(inv.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3.5 px-3 text-[#1E7445] font-semibold">
                            ₹ {Number(inv.paidAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3.5 px-3">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold shadow-2xs ${
                              isPaid 
                                ? 'bg-[#E5F7ED] text-[#1E7445]' 
                                : isPartial 
                                ? 'bg-[#FEF7EC] text-[#D97706]' 
                                : 'bg-[#FDE8E8] text-[#991B1B]'
                            }`}>
                              {isPaid ? 'Paid' : isPartial ? 'Partially Paid' : 'Unpaid'}
                            </span>
                          </td>
                          <td className="py-3.5 pr-6 pl-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleViewPdf(inv, 'invoice')}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E2DAD0] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#1C3A2F] cursor-pointer"
                                title="View PDF Preview"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>PDF</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDownloadPdf(inv, 'invoice')}
                                className="p-1.5 rounded-lg border border-[#E2DAD0] bg-white hover:bg-[#FAF8F5] text-[#1C3A2F] cursor-pointer"
                                title="Download Certified PDF"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>

                              {!isPaid && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenSettle(inv, 'invoice')}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1C3A2F] hover:bg-[#142C23] text-white text-xs font-bold shadow-xs cursor-pointer"
                                >
                                  <CreditCard className="w-3.5 h-3.5" />
                                  <span>Pay Online</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Vendor Bills */}
        {activeTab === 'bills' && (
          <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#F0EAE1] flex items-center justify-between">
              <div>
                <h2 className="font-serif-luxury text-lg font-bold text-[#141A17]">
                  Supplier Bills & Payables
                </h2>
                <p className="text-xs text-[#6B7A74] mt-0.5">
                  Procurement invoices and supplier accounts payable records.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-160">
                <thead>
                  <tr className="border-b border-[#EAE3D7] bg-[#F7F4EE] text-[11px] font-bold text-[#55665E] uppercase tracking-wider">
                    <th className="py-3.5 pl-6 pr-3">Bill #</th>
                    <th className="py-3.5 px-3">Date</th>
                    <th className="py-3.5 px-3">Due Date</th>
                    <th className="py-3.5 px-3">Total Amount</th>
                    <th className="py-3.5 px-3">Settled</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 pr-6 pl-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EAE1] text-xs text-[#141A17]">
                  {bills.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[#738C80]">
                        No vendor bills registered under this account.
                      </td>
                    </tr>
                  ) : (
                    bills.map((b) => {
                      const outstanding = Math.max(0, (b.totalAmount || 0) - (b.paidAmount || 0));
                      const isPaid = b.status === 'paid' || outstanding <= 0.01;

                      return (
                        <tr key={b._id} className="hover:bg-[#FAF7F2] transition-colors">
                          <td className="py-3.5 pl-6 pr-3 font-semibold text-[#1C3A2F]">
                            {b.billNumber}
                          </td>
                          <td className="py-3.5 px-3 text-[#55665E]">
                            {b.billDate ? new Date(b.billDate).toLocaleDateString('en-GB') : '—'}
                          </td>
                          <td className="py-3.5 px-3 text-[#55665E]">
                            {b.dueDate ? new Date(b.dueDate).toLocaleDateString('en-GB') : '—'}
                          </td>
                          <td className="py-3.5 px-3 font-bold font-serif">
                            ₹ {Number(b.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3.5 px-3 text-[#1E7445] font-semibold">
                            ₹ {Number(b.paidAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3.5 px-3">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold shadow-2xs ${
                              isPaid ? 'bg-[#E5F7ED] text-[#1E7445]' : 'bg-[#FEF7EC] text-[#D97706]'
                            }`}>
                              {isPaid ? 'Paid' : 'Unpaid'}
                            </span>
                          </td>
                          <td className="py-3.5 pr-6 pl-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleViewPdf(b, 'bill')}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E2DAD0] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#1C3A2F] cursor-pointer"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>PDF</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDownloadPdf(b, 'bill')}
                                className="p-1.5 rounded-lg border border-[#E2DAD0] bg-white hover:bg-[#FAF8F5] text-[#1C3A2F] cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Orders & Deliveries */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#F0EAE1] flex items-center justify-between">
              <div>
                <h2 className="font-serif-luxury text-lg font-bold text-[#141A17]">
                  Orders & Fulfillment Status
                </h2>
                <p className="text-xs text-[#6B7A74] mt-0.5">
                  Real-time fulfillment, confirmed sales orders, and goods dispatch notes.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-160">
                <thead>
                  <tr className="border-b border-[#EAE3D7] bg-[#F7F4EE] text-[11px] font-bold text-[#55665E] uppercase tracking-wider">
                    <th className="py-3.5 pl-6 pr-3">Order #</th>
                    <th className="py-3.5 px-3">Date</th>
                    <th className="py-3.5 px-3">Items Count</th>
                    <th className="py-3.5 px-3">Order Total</th>
                    <th className="py-3.5 px-3">Fulfillment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EAE1] text-xs text-[#141A17]">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-[#738C80]">
                        No active orders recorded for this account.
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o._id} className="hover:bg-[#FAF7F2] transition-colors">
                        <td className="py-3.5 pl-6 pr-3 font-semibold text-[#1C3A2F]">
                          {o.orderNumber}
                        </td>
                        <td className="py-3.5 px-3 text-[#55665E]">
                          {o.orderDate ? new Date(o.orderDate).toLocaleDateString('en-GB') : '—'}
                        </td>
                        <td className="py-3.5 px-3 text-[#55665E]">
                          {o.items?.length || 0} line items
                        </td>
                        <td className="py-3.5 px-3 font-bold font-serif">
                          ₹ {Number(o.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E5F7ED] text-[#1E7445]">
                            {o.status || 'Confirmed'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* Online Payment Settlement Modal */}
      {settleModalOpen && selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-2xl max-w-md w-full overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-[#F0EAE1] flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#1C3A2F] text-white flex items-center justify-center shadow-xs">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury font-bold text-base text-[#141A17]">
                    Settle Payment Online
                  </h3>
                  <p className="text-[11px] text-[#6B7A74]">
                    Direct settlement for {selectedDocument.invoiceNumber || selectedDocument.billNumber}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSettleModalOpen(false)}
                className="p-1 rounded-lg text-[#6B7A74] hover:text-[#141A17] hover:bg-[#EAE4DC] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecutePayment} className="p-5 space-y-4 text-xs">
              <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E8E1D5] space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B7A74]">Document Total:</span>
                  <span className="font-bold text-[#141A17]">₹ {Number(selectedDocument.totalAmount || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B7A74]">Already Paid:</span>
                  <span className="text-[#1E7445] font-semibold">₹ {Number(selectedDocument.paidAmount || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-[#E8E1D5] pt-1.5 flex justify-between text-xs">
                  <span className="font-bold text-[#141A17]">Outstanding Balance:</span>
                  <span className="font-bold text-[#DC2626]">
                    ₹ {Math.max(0, (selectedDocument.totalAmount || 0) - (selectedDocument.paidAmount || 0)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141A17] mb-1">
                  Payment Amount (INR)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={Math.max(0, (selectedDocument.totalAmount || 0) - (selectedDocument.paidAmount || 0))}
                  value={settleAmount}
                  onChange={(e) => setSettleAmount(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs font-bold text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F] focus:ring-1 focus:ring-[#1C3A2F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141A17] mb-1">
                  Payment Journal / Channel
                </label>
                <select
                  value={settleMethod}
                  onChange={(e) => setSettleMethod(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                >
                  <option value="Bank">Bank Journal (1001 - HDFC Bank Online Transfer / UPI)</option>
                  <option value="Cash">Cash Journal (1002 - Cash in Hand Desk Settlement)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSettleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E2DAD0] text-[#55665E] hover:bg-[#FAF8F5] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayment}
                  className="px-5 py-2 rounded-xl bg-[#1C3A2F] hover:bg-[#142C23] text-white font-semibold cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmittingPayment ? 'Processing...' : `Confirm & Pay ₹ ${Number(settleAmount || 0).toLocaleString('en-IN')}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document PDF Modal */}
      <DocumentPdfModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        documentData={selectedPdfDoc}
      />

    </div>
  );
};

export default ContactPortal;
