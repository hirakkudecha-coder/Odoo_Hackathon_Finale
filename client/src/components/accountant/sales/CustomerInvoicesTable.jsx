import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Download, 
  CheckCircle, 
  CreditCard, 
  ExternalLink, 
  Eye, 
  Printer, 
  Mail, 
  X, 
  ChevronLeft, 
  ChevronRight,
  PieChart,
  ArrowRight,
  Trash2,
  Calendar,
  Layers
} from 'lucide-react';
import { createMasterRegisterPdfData, downloadDirectPdf } from '../../../utils/pdfGenerator';
import { DocumentPdfModal } from '../DocumentPdfModal';

export const CustomerInvoicesTable = ({ onNavigateTab }) => {
  const [invoices, setInvoices] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [products, setProducts] = useState([]);
  const [analyticAccounts, setAnalyticAccounts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState(null);

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState(null);
  const [paymentSuccessData, setPaymentSuccessData] = useState(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [selectedPdfDoc, setSelectedPdfDoc] = useState(null);

  // Payment Form
  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    paymentMode: 'Bank', // 'Bank' or 'Cash'
    journalId: '',
    paymentDate: new Date().toISOString().split('T')[0],
    memo: ''
  });

  // Invoice Create Form
  const [invoiceForm, setInvoiceForm] = useState({
    customer: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [
      {
        product: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        taxPercent: 18,
        analyticAccount: '',
        account: ''
      }
    ]
  });

  const initialInvoices = [
    {
      _id: 'inv-1',
      invoiceNumber: 'INV/2026/0001',
      customer: { _id: 'c-1', name: 'Rohan Kapoor', email: 'rohankapoor@interiors.com' },
      salesOrder: { _id: 'so-1', orderNumber: 'S00001' },
      invoiceDate: '2026-02-14',
      dueDate: '2026-03-16',
      untaxedAmount: 72000,
      taxAmount: 12960,
      totalAmount: 84960,
      paidAmount: 84960,
      status: 'paid',
      items: [
        {
          description: 'Nordic Royal Blue Sofa (3-Seater)',
          quantity: 1,
          unitPrice: 72000,
          subtotal: 72000,
          analyticAccount: { _id: 'ana-2', name: 'Custom Residential Projects', code: 'ANA-1002' }
        }
      ]
    },
    {
      _id: 'inv-2',
      invoiceNumber: 'INV/2026/0002',
      customer: { _id: 'c-2', name: 'Sheetal Living Studios', email: 'contact@sheetalliving.in' },
      salesOrder: { _id: 'so-2', orderNumber: 'S00002' },
      invoiceDate: '2026-02-28',
      dueDate: '2026-03-30',
      untaxedAmount: 138000,
      taxAmount: 24840,
      totalAmount: 162840,
      paidAmount: 0,
      status: 'confirmed',
      items: [
        {
          description: 'Minimalist Oak Credenza Batch',
          quantity: 3,
          unitPrice: 46000,
          subtotal: 138000,
          analyticAccount: { _id: 'ana-4', name: 'Corporate Workspace Fitouts', code: 'ANA-1004' }
        }
      ]
    },
    {
      _id: 'inv-3',
      invoiceNumber: 'INV/2026/0003',
      customer: { _id: 'c-5', name: 'NextGen Commercial Interiors', email: 'hello@nextgen.co' },
      salesOrder: null, // Created fresh standalone
      invoiceDate: '2026-03-02',
      dueDate: '2026-04-01',
      untaxedAmount: 28000,
      taxAmount: 5040,
      totalAmount: 33040,
      paidAmount: 0,
      status: 'draft',
      items: [
        {
          description: 'Bespoke Atelier Space Planning & 3D Render',
          quantity: 1,
          unitPrice: 28000,
          subtotal: 28000,
          analyticAccount: { _id: 'ana-2', name: 'Custom Residential Projects', code: 'ANA-1002' }
        }
      ]
    }
  ];

  const fetchInvoiceData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const [invRes, cRes, pRes, aRes, accRes] = await Promise.all([
        fetch('/api/customer-invoices', { headers }).catch(() => null),
        fetch('/api/contacts', { headers }).catch(() => null),
        fetch('/api/products', { headers }).catch(() => null),
        fetch('/api/analytic-accounts', { headers }).catch(() => null),
        fetch('/api/accounts', { headers }).catch(() => null)
      ]);

      if (invRes && invRes.ok) {
        const data = await invRes.json();
        if (data.invoices && data.invoices.length > 0) {
          setInvoices(data.invoices);
        } else {
          setInvoices(initialInvoices);
        }
      } else {
        setInvoices(initialInvoices);
      }

      if (cRes && cRes.ok) {
        const cData = await cRes.json();
        if (cData.contacts) setContacts(cData.contacts);
      }
      if (pRes && pRes.ok) {
        const pData = await pRes.json();
        if (pData.products) setProducts(pData.products);
      }
      if (aRes && aRes.ok) {
        const aData = await aRes.json();
        if (aData.analyticAccounts) setAnalyticAccounts(aData.analyticAccounts);
      }
      if (accRes && accRes.ok) {
        const accData = await accRes.json();
        if (accData.accounts) setAccounts(accData.accounts);
      }
    } catch (e) {
      setInvoices(initialInvoices);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoiceData();
  }, []);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch = 
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inv.customer?.name && inv.customer.name.toLowerCase().includes(searchQuery.toLowerCase()));

      if (activeFilterTab === 'Draft') return matchesSearch && inv.status === 'draft';
      if (activeFilterTab === 'Confirmed') return matchesSearch && (inv.status === 'confirmed' || inv.status === 'posted');
      if (activeFilterTab === 'Paid') return matchesSearch && inv.status === 'paid';
      if (activeFilterTab === 'Cancelled') return matchesSearch && inv.status === 'cancelled';
      return matchesSearch;
    });
  }, [invoices, searchQuery, activeFilterTab]);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage) || 1;
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInvoices.slice(start, start + itemsPerPage);
  }, [filteredInvoices, currentPage]);

  const handleOpenCreate = () => {
    setInvoiceForm({
      customer: contacts[0]?._id || '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [
        {
          product: products[0]?._id || '',
          description: products[0]?.name || 'Furniture Product',
          quantity: 1,
          unitPrice: products[0]?.salesPrice || 10000,
          taxPercent: 18,
          analyticAccount: analyticAccounts[0]?._id || '',
          account: accounts.find(a => a.type === 'Income')?._id || ''
        }
      ]
    });
    setCreateModalOpen(true);
  };

  const handleAddItem = () => {
    setInvoiceForm(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          product: products[0]?._id || '',
          description: products[0]?.name || '',
          quantity: 1,
          unitPrice: products[0]?.salesPrice || 0,
          taxPercent: 18,
          analyticAccount: analyticAccounts[0]?._id || '',
          account: accounts.find(a => a.type === 'Income')?._id || ''
        }
      ]
    }));
  };

  const handleRemoveItem = (index) => {
    if (invoiceForm.items.length <= 1) return;
    setInvoiceForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...invoiceForm.items];
    updated[index][field] = value;

    if (field === 'product') {
      const prod = products.find(p => p._id === value);
      if (prod) {
        updated[index].description = prod.name;
        updated[index].unitPrice = Number(prod.salesPrice) || 0;
      }
    }

    setInvoiceForm(prev => ({ ...prev, items: updated }));
  };

  const handleSaveInvoice = async (e) => {
    e.preventDefault();
    if (!invoiceForm.customer || invoiceForm.items.length === 0) return;

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };

      const selectedCustomer = contacts.find(c => c._id === invoiceForm.customer);
      const res = await fetch('/api/customer-invoices', {
        method: 'POST',
        headers,
        body: JSON.stringify(invoiceForm)
      }).catch(() => null);

      let created = null;
      if (res && res.ok) {
        const json = await res.json();
        created = json.invoice;
      }

      let untaxed = 0;
      let tax = 0;
      invoiceForm.items.forEach(item => {
        const base = Number(item.quantity) * Number(item.unitPrice);
        untaxed += base;
        tax += base * (Number(item.taxPercent || 18) / 100);
      });

      const newInv = created || {
        _id: `inv-${Date.now()}`,
        invoiceNumber: `INV/2026/${String(invoices.length + 1).padStart(4, '0')}`,
        customer: selectedCustomer || { name: 'Customer' },
        salesOrder: null,
        invoiceDate: invoiceForm.invoiceDate,
        dueDate: invoiceForm.dueDate,
        untaxedAmount: untaxed,
        taxAmount: tax,
        totalAmount: untaxed + tax,
        paidAmount: 0,
        status: 'draft',
        items: invoiceForm.items
      };

      setInvoices([newInv, ...invoices]);
      setCreateModalOpen(false);
      setNotification({ type: 'success', text: `Customer Invoice "${newInv.invoiceNumber}" created.` });
      setTimeout(() => setNotification(null), 3500);
    } catch (e) {
      setNotification({ type: 'error', text: 'Error saving invoice.' });
    }
  };

  const handleConfirmInvoice = async (inv) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/customer-invoices/${inv._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status: 'confirmed' })
      }).catch(() => {});

      setInvoices(prev => prev.map(i => i._id === inv._id ? { ...i, status: 'confirmed' } : i));
      setNotification({ type: 'success', text: `Invoice ${inv.invoiceNumber} confirmed & posted to Sales Income A/c.` });
      setTimeout(() => setNotification(null), 3500);
    } catch (e) {}
  };

  // REGISTER PAYMENT
  const handleOpenPaymentModal = (inv) => {
    setSelectedInvoiceForPayment(inv);
    const remaining = (inv.totalAmount || 0) - (inv.paidAmount || 0);
    setPaymentForm({
      amount: remaining > 0 ? remaining : inv.totalAmount,
      paymentMode: 'Bank',
      journalId: 'HDFC Current Bank A/c',
      paymentDate: new Date().toISOString().split('T')[0],
      memo: `Payment settlement for Invoice ${inv.invoiceNumber}`
    });
    setPaymentSuccessData(null);
    setPaymentModalOpen(true);
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    if (!selectedInvoiceForPayment) return;

    try {
      const token = localStorage.getItem('token');
      const paidAmt = Number(paymentForm.amount) || selectedInvoiceForPayment.totalAmount;

      await fetch(`/api/customer-invoices/${selectedInvoiceForPayment._id}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          amount: paidAmt,
          paymentMode: paymentForm.paymentMode,
          paymentDate: paymentForm.paymentDate
        })
      }).catch(() => {});

      setInvoices(prev => prev.map(i => i._id === selectedInvoiceForPayment._id ? {
        ...i,
        paidAmount: i.totalAmount,
        status: 'paid'
      } : i));

      setPaymentSuccessData({
        receiptNo: `REC/2026/${Math.floor(1000 + Math.random() * 9000)}`,
        invoiceNumber: selectedInvoiceForPayment.invoiceNumber,
        partner: selectedInvoiceForPayment.customer?.name || 'Customer',
        amount: paidAmt,
        mode: paymentForm.paymentMode,
        date: paymentForm.paymentDate
      });

      setNotification({ type: 'success', text: `Payment of ₹${paidAmt.toLocaleString('en-IN')} received successfully via ${paymentForm.paymentMode}.` });
      setTimeout(() => setNotification(null), 4000);
    } catch (e) {
      setNotification({ type: 'error', text: 'Error recording payment.' });
    }
  };

  const handlePrintPaymentReceipt = () => {
    if (!paymentSuccessData) return;
    const pdfData = {
      type: 'PAYMENT_RECEIPT',
      title: 'OFFICIAL PAYMENT RECEIPT',
      documentNo: paymentSuccessData.receiptNo,
      date: paymentSuccessData.date,
      dueDate: 'PAID IN FULL',
      status: 'Settled',
      partner: {
        name: paymentSuccessData.partner,
        email: 'Official Customer Entity',
        phone: `Mode: ${paymentSuccessData.mode}`,
        city: 'Urban Furniture Atelier'
      },
      tableData: {
        headers: ['Payment Attribute', 'Details'],
        rows: [
          ['Invoice Settled', paymentSuccessData.invoiceNumber],
          ['Payment Receipt Number', paymentSuccessData.receiptNo],
          ['Payment Mode', paymentSuccessData.mode],
          ['Settled Date', paymentSuccessData.date],
          ['Total Amount Paid', `₹ ${Number(paymentSuccessData.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`],
          ['Payment Status', 'Confirmed & Reconciled']
        ]
      },
      notes: 'Payment has been credited to ledger and linked to customer invoice record.'
    };

    setSelectedPdfDoc(pdfData);
    setPdfModalOpen(true);
  };

  const handleSendMail = () => {
    alert(`Payment confirmation and PDF receipt successfully dispatched to ${selectedInvoiceForPayment?.customer?.email || 'customer email'}.`);
  };

  const handleViewInvoicePdf = (inv) => {
    const pdfData = {
      type: 'INVOICE',
      title: 'TAX INVOICE',
      documentNo: inv.invoiceNumber,
      date: new Date(inv.invoiceDate).toLocaleDateString('en-GB'),
      dueDate: new Date(inv.dueDate).toLocaleDateString('en-GB'),
      status: inv.status,
      partner: {
        name: inv.customer?.name || 'Customer',
        email: inv.customer?.email || '-',
        phone: 'Urban Client',
        city: 'India'
      },
      tableData: {
        headers: ['Description / Item', 'Qty', 'Unit Price', 'Analytics', 'Amount'],
        rows: (inv.items || []).map(item => [
          item.description || 'Furniture Item',
          item.quantity || 1,
          `₹ ${Number(item.unitPrice || 0).toLocaleString('en-IN')}`,
          item.analyticAccount?.name || 'General Analytic',
          `₹ ${Number(item.subtotal || (item.quantity * item.unitPrice) || 0).toLocaleString('en-IN')}`
        ])
      },
      notes: 'Thank you for choosing Urban Furniture. Payment due as per agreed trade terms.'
    };

    setSelectedPdfDoc(pdfData);
    setPdfModalOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#E5F7ED] text-[#1E7445] border border-emerald-200">Paid</span>;
      case 'confirmed':
      case 'posted':
        return <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Confirmed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-red-50 text-red-700 border border-red-200">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#FEF7EC] text-[#D97706] border border-amber-200">Draft</span>;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-xs overflow-hidden transition-all duration-300 space-y-0">
      {/* Toast Notification */}
      {notification && (
        <div className={`m-4 p-3 rounded-xl border flex items-center justify-between text-xs animate-fadeIn ${
          notification.type === 'success' 
            ? 'bg-[#E5F7ED] border-[#A8E5C1] text-[#1E7445]' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span className="font-semibold">{notification.text}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-black/50 hover:text-black">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-[#F0EAE1] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#F4EFE6] text-[#1C3A2F] flex items-center justify-center border border-[#E5DDD0] shadow-2xs shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#141A17] tracking-tight">
              Customer Invoices
            </h2>
            <p className="text-xs text-[#6B7A74] mt-0.5">
              Accountant CRUD lifecycle, source SO traceability, line-item budget analytics, and payment settlement
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search className="w-4 h-4 text-[#8A9B93] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search invoice or customer..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl pl-9 pr-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
            />
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-[#1C3A2F] hover:bg-[#142C23] text-[#FAF8F5] text-xs font-semibold px-4 py-2 rounded-xl shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-5 sm:px-6 py-3.5 bg-[#FAF8F5]/80 border-b border-[#F0EAE1] flex items-center gap-1.5 overflow-x-auto">
        {['All', 'Draft', 'Confirmed', 'Paid', 'Cancelled'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => { setActiveFilterTab(tab); setCurrentPage(1); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeFilterTab === tab
                ? 'bg-[#1C3A2F] text-white shadow-2xs'
                : 'bg-white text-[#5B6963] border border-[#E8E1D5] hover:bg-[#F2ECE4]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Invoices Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#FAF8F5] border-b border-[#F0EAE1] text-[11px] font-bold text-[#55665E] uppercase tracking-wider">
              <th className="py-3 px-6">Invoice Number</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Source Order</th>
              <th className="py-3 px-4">Invoice Date</th>
              <th className="py-3 px-4">Budget Analytic / CoA</th>
              <th className="py-3 px-4 text-right">Total Amount</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EAE1] text-[#141A17]">
            {paginatedInvoices.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-8 text-center text-[#7A8A82]">
                  No customer invoices found matching criteria.
                </td>
              </tr>
            ) : (
              paginatedInvoices.map((inv) => {
                const firstItem = inv.items?.[0];
                const analyticAcc = firstItem?.analyticAccount;

                return (
                  <tr key={inv._id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-bold text-[#1C3A2F]">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#141A17]">
                      {inv.customer?.name || 'Customer'}
                    </td>
                    <td className="py-3.5 px-4">
                      {inv.salesOrder ? (
                        <span className="px-2.5 py-0.5 rounded-md bg-[#FAF8F5] border border-[#DDD5C7] text-[#1C3A2F] font-mono font-bold text-[11px] inline-flex items-center gap-1 shadow-2xs">
                          <span>{inv.salesOrder.orderNumber || 'SO'}</span>
                          <ExternalLink className="w-3 h-3 text-[#1C3A2F]" />
                        </span>
                      ) : (
                        <span className="text-[11px] text-gray-400 italic">Direct Invoice</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#55665E]">
                      {new Date(inv.invoiceDate).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-[11px] font-semibold text-[#141A17]">
                          {analyticAcc?.name || 'Sales Income Account'}
                        </span>
                        {analyticAcc && (
                          <button
                            type="button"
                            onClick={() => { if (onNavigateTab) onNavigateTab('budgets'); }}
                            className="text-[10px] font-bold text-[#1C3A2F] hover:underline inline-flex items-center gap-1"
                            title="Open Budget Analytic Report"
                          >
                            <PieChart className="w-3 h-3" />
                            <span>View Budget Analytics →</span>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#141A17]">
                      ₹ {Number(inv.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {getStatusBadge(inv.status)}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleViewInvoicePdf(inv)}
                          className="p-1.5 rounded-lg text-[#55665E] hover:bg-[#F2ECE4] cursor-pointer"
                          title="Print / View Invoice PDF"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {inv.status === 'draft' && (
                          <button
                            type="button"
                            onClick={() => handleConfirmInvoice(inv)}
                            className="px-2.5 py-1 rounded-lg bg-[#1C3A2F] text-white font-semibold text-[11px] hover:bg-[#142C23] cursor-pointer shadow-2xs"
                          >
                            Confirm
                          </button>
                        )}

                        {['confirmed', 'posted'].includes(inv.status) && (
                          <button
                            type="button"
                            onClick={() => handleOpenPaymentModal(inv)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-semibold text-[11px] hover:bg-emerald-800 cursor-pointer shadow-2xs flex items-center gap-1"
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>Pay</span>
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

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-[#F0EAE1] bg-[#FAF8F5]/80 flex items-center justify-between text-xs text-[#55665E]">
        <span>
          Showing {filteredInvoices.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length} invoices
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-[#DDD5C7] disabled:opacity-40 hover:bg-white cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 font-bold text-[#141A17]">{currentPage} of {totalPages}</span>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg border border-[#DDD5C7] disabled:opacity-40 hover:bg-white cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CREATE INVOICE MODAL WITH LINE-LEVEL ANALYTICS */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E2DAD0] shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 animate-scaleUp text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE9E0]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1C3A2F] text-white flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#141A17]">New Customer Invoice</h3>
                  <p className="text-xs text-[#6C7C74]">Default CoA line assignment: 4000 - Sales Income A/c</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded-lg text-[#889890] hover:text-[#1E2623] hover:bg-[#FAF8F5] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInvoice} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#141A17] mb-1">Customer Partner *</label>
                  <select
                    value={invoiceForm.customer}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, customer: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#DDD5C7] rounded-xl px-3 py-2 text-xs font-semibold text-[#141A17]"
                  >
                    {contacts.map(c => (
                      <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#55665E] mb-1">Invoice Date</label>
                  <input
                    type="date"
                    value={invoiceForm.invoiceDate}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, invoiceDate: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#DDD5C7] rounded-xl px-3 py-1.5 text-xs text-[#141A17]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#55665E] mb-1">Due Date</label>
                  <input
                    type="date"
                    value={invoiceForm.dueDate}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#DDD5C7] rounded-xl px-3 py-1.5 text-xs text-[#141A17]"
                  />
                </div>
              </div>

              {/* Line Items with Budget Analytics Column */}
              <div className="space-y-2 pt-2 border-t border-[#EFE9E0]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#1C3A2F]">Invoice Lines & Budget Analytics</span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-3 py-1 bg-[#FAF8F5] border border-[#DDD5C7] rounded-lg text-xs font-semibold text-[#1C3A2F] hover:bg-[#EAE4DC] flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {invoiceForm.items.map((item, idx) => (
                    <div key={idx} className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#E5DFD5] grid grid-cols-12 gap-2 items-center text-xs">
                      <div className="col-span-4">
                        <label className="block text-[10px] font-bold text-[#66776F] mb-0.5">Product</label>
                        <select
                          value={item.product}
                          onChange={(e) => handleItemChange(idx, 'product', e.target.value)}
                          className="w-full bg-white border border-[#DDD5C7] rounded-lg px-2 py-1.5 text-xs font-medium"
                        >
                          {products.map(p => (
                            <option key={p._id || p.id} value={p._id || p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-[10px] font-bold text-[#66776F] mb-0.5">Qty</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          className="w-full bg-white border border-[#DDD5C7] rounded-lg px-2 py-1.5 text-xs"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-[10px] font-bold text-[#66776F] mb-0.5">Unit Price</label>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                          className="w-full bg-white border border-[#DDD5C7] rounded-lg px-2 py-1.5 text-xs font-semibold"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="block text-[10px] font-bold text-[#66776F] mb-0.5">Budget Analytics</label>
                        <select
                          value={item.analyticAccount}
                          onChange={(e) => handleItemChange(idx, 'analyticAccount', e.target.value)}
                          className="w-full bg-white border border-[#DDD5C7] rounded-lg px-2 py-1.5 text-xs font-semibold text-[#1C3A2F]"
                        >
                          <option value="">-- Analytic Account --</option>
                          {analyticAccounts.map(a => (
                            <option key={a._id} value={a._id}>{a.code} - {a.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-1 text-center pt-3">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1 rounded text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#EFE9E0] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#DDD5C7] text-xs font-semibold text-[#55635D] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1C3A2F] text-white text-xs font-semibold hover:bg-[#142C23]"
                >
                  Create Invoice (Draft)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAYMENT MODAL (AUTOFILL PARTNER, BANK/CASH, PRINT & SEND) */}
      {paymentModalOpen && selectedInvoiceForPayment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E2DAD0] shadow-2xl max-w-md w-full p-6 space-y-4 animate-scaleUp text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE9E0]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#141A17]">Register Customer Payment</h3>
                  <p className="text-xs text-[#6C7C74]">{selectedInvoiceForPayment.invoiceNumber}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPaymentModalOpen(false)}
                className="p-1 rounded-lg text-[#889890] hover:text-[#1E2623] hover:bg-[#FAF8F5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {paymentSuccessData ? (
              <div className="space-y-4 text-center py-2">
                <div className="w-12 h-12 rounded-full bg-[#E5F7ED] text-[#1E7445] flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#141A17]">Payment Recorded!</h4>
                  <p className="text-xs text-[#55665E] mt-1">
                    Receipt <strong>{paymentSuccessData.receiptNo}</strong> generated for ₹{Number(paymentSuccessData.amount).toLocaleString('en-IN')}.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handlePrintPaymentReceipt}
                    className="px-4 py-2 bg-[#1C3A2F] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs hover:bg-[#142C23]"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendMail}
                    className="px-4 py-2 bg-white border border-[#DDD5C7] text-[#141A17] text-xs font-semibold rounded-xl flex items-center gap-1.5 hover:bg-[#FAF8F5]"
                  >
                    <Mail className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Send via Mail</span>
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setPaymentModalOpen(false)}
                    className="text-xs text-[#66776F] hover:underline"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmPayment} className="space-y-3.5 text-xs">
                {/* Autofilled Partner */}
                <div>
                  <label className="block text-xs font-semibold text-[#55665E] mb-1">Partner Entity (Autofilled)</label>
                  <input
                    type="text"
                    disabled
                    value={selectedInvoiceForPayment.customer?.name || 'Customer Partner'}
                    className="w-full bg-[#FAF8F5] border border-[#DDD5C7] rounded-xl px-3 py-2 text-xs font-bold text-[#141A17] opacity-80"
                  />
                </div>

                {/* Amount Due (Autofilled) */}
                <div>
                  <label className="block text-xs font-semibold text-[#55665E] mb-1">Amount Due / Settlement (INR) *</label>
                  <input
                    type="number"
                    required
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    className="w-full bg-white border border-[#DDD5C7] rounded-xl px-3 py-2 text-xs font-bold text-[#141A17]"
                  />
                </div>

                {/* Payment Mode Selection (Bank or Cash) */}
                <div>
                  <label className="block text-xs font-semibold text-[#55665E] mb-1">Payment Mode *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentForm({ ...paymentForm, paymentMode: 'Bank', journalId: 'HDFC Current Bank A/c' })}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        paymentForm.paymentMode === 'Bank'
                          ? 'bg-[#1C3A2F] text-white border-[#1C3A2F] shadow-xs'
                          : 'bg-[#FAF8F5] text-[#55665E] border-[#DDD5C7]'
                      }`}
                    >
                      <span>Bank Transfer</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentForm({ ...paymentForm, paymentMode: 'Cash', journalId: 'Petty Cash Register' })}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        paymentForm.paymentMode === 'Cash'
                          ? 'bg-[#1C3A2F] text-white border-[#1C3A2F] shadow-xs'
                          : 'bg-[#FAF8F5] text-[#55665E] border-[#DDD5C7]'
                      }`}
                    >
                      <span>Cash on Hand</span>
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EFE9E0] flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-[#DDD5C7] text-xs font-semibold text-[#55635D] hover:bg-[#FAF8F5]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 shadow-xs"
                  >
                    Confirm & Settle
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* PDF Modal */}
      <DocumentPdfModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        documentData={selectedPdfDoc}
      />
    </div>
  );
};

export default CustomerInvoicesTable;
