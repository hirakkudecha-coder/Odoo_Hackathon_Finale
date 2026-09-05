import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
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
import { createPaymentReceiptPdfData, createMasterRegisterPdfData, downloadDirectPdf } from '../../../utils/pdfGenerator';

export const PaymentsTable = ({ onCreatePayment }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState('All');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPdfDoc, setSelectedPdfDoc] = useState(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const rawPayments = [
    {
      id: 1,
      payNo: 'PAY-2025-001',
      date: '02 Sep 2025',
      partner: 'Nimesh Pathak',
      type: 'Customer Receipt',
      partnerInitials: 'NP',
      partnerAvatarBg: 'bg-[#CCDCD2] text-[#1E3A2E]',
      method: 'Bank Transfer (NEFT)',
      amount: '₹ 24,500.00',
      status: 'Reconciled',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 2,
      payNo: 'PAY-2025-002',
      date: '01 Sep 2025',
      partner: 'Woodland Supplies',
      type: 'Vendor Payment',
      partnerInitials: 'WS',
      partnerAvatarBg: 'bg-[#DFD8CE] text-[#3D372E]',
      method: 'Online Banking',
      amount: '₹ 33,200.00',
      status: 'Completed',
      statusStyle: 'bg-[#EBF3FE] text-[#2563EB]',
      statusDot: 'bg-[#3B82F6]',
    },
    {
      id: 3,
      payNo: 'PAY-2025-003',
      date: '30 Aug 2025',
      partner: 'Urban Spaces',
      type: 'Customer Receipt',
      partnerInitials: 'US',
      partnerAvatarBg: 'bg-[#CCD4D8] text-[#22353D]',
      method: 'UPI Instant',
      amount: '₹ 18,400.00',
      status: 'Reconciled',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 4,
      payNo: 'PAY-2025-004',
      date: '28 Aug 2025',
      partner: 'Crafty Wood Co.',
      type: 'Vendor Payment',
      partnerInitials: 'CW',
      partnerAvatarBg: 'bg-[#D6DDD9] text-[#2C3B34]',
      method: 'Cheque Deposit',
      amount: '₹ 27,800.00',
      status: 'Completed',
      statusStyle: 'bg-[#EBF3FE] text-[#2563EB]',
      statusDot: 'bg-[#3B82F6]',
    },
    {
      id: 5,
      payNo: 'PAY-2025-005',
      date: '26 Aug 2025',
      partner: 'Meera & Co.',
      type: 'Customer Receipt',
      partnerInitials: 'MC',
      partnerAvatarBg: 'bg-[#F2DDD0] text-[#5C3826]',
      method: 'Credit Card',
      amount: '₹ 56,800.00',
      status: 'Pending',
      statusStyle: 'bg-[#FEF7EC] text-[#D97706]',
      statusDot: 'bg-[#F59E0B]',
    },
    {
      id: 6,
      payNo: 'PAY-2025-006',
      date: '24 Aug 2025',
      partner: 'Prime Metals',
      type: 'Vendor Payment',
      partnerInitials: 'PM',
      partnerAvatarBg: 'bg-[#CCD4D8] text-[#22353D]',
      method: 'Bank Transfer (RTGS)',
      amount: '₹ 19,600.00',
      status: 'Pending',
      statusStyle: 'bg-[#FEF7EC] text-[#D97706]',
      statusDot: 'bg-[#F59E0B]',
    },
  ];

  const filterTabs = ['All', 'Reconciled', 'Completed', 'Pending'];

  const filteredPayments = useMemo(() => {
    let result = rawPayments;
    if (activeFilterTab !== 'All') {
      result = result.filter((p) => p.status.toLowerCase() === activeFilterTab.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.payNo.toLowerCase().includes(q) ||
        p.partner.toLowerCase().includes(q) ||
        p.method.toLowerCase().includes(q) ||
        p.status.toLowerCase().includes(q)
      );
    }
    return result;
  }, [searchQuery, activeFilterTab]);

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

  const handleViewPaymentPdf = (payment) => {
    const pdfData = createPaymentReceiptPdfData(payment);
    setSelectedPdfDoc(pdfData);
    setIsPdfModalOpen(true);
  };

  const handleDownloadPaymentPdfDirect = (payment) => {
    const pdfData = createPaymentReceiptPdfData(payment);
    downloadDirectPdf(pdfData);
  };

  const handleExportPdf = () => {
    const targetPayments = selectedIds.length > 0
      ? filteredPayments.filter((p) => selectedIds.includes(p.id))
      : filteredPayments;

    const headers = ['Payment #', 'Partner', 'Type', 'Date', 'Method', 'Amount', 'Status'];
    const rows = targetPayments.map((p) => [
      p.payNo,
      p.partner,
      p.type,
      p.date,
      p.method,
      p.amount,
      p.status,
    ]);

    const pdfData = createMasterRegisterPdfData('Payments & Collections Register', headers, rows);
    downloadDirectPdf(pdfData);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-xs overflow-hidden transition-all duration-300">
      
      {/* 1. Table Top Header */}
      <div className="p-5 sm:p-6 border-b border-[#F0EAE1] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#F4EFE6] text-[#1C3A2F] flex items-center justify-center border border-[#E5DDD0] shadow-2xs shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#141A17] tracking-tight">
              Payments & Collections
            </h2>
            <p className="text-xs text-[#6B7A74] mt-0.5">
              Record incoming customer payments and outgoing supplier disbursements.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-[#8A9B93] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search payments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl pl-9 pr-3 py-2 text-xs text-[#141A17] placeholder:text-[#8A9B93] focus:outline-hidden focus:border-[#1C3A2F] focus:ring-1 focus:ring-[#1C3A2F] transition-all"
            />
          </div>

          <button
            type="button"
            onClick={onCreatePayment}
            className="inline-flex items-center gap-2 bg-[#1C3A2F] hover:bg-[#142C23] text-[#FAF8F5] text-xs font-semibold px-4 py-2 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Register Payment</span>
            <span className="sm:hidden">Pay</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Tabs */}
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
            className="inline-flex items-center gap-1.5 bg-white border border-[#E2DAD0] hover:bg-[#F5EFE6] text-[#4A5952] text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            <Filter className="w-3.5 h-3.5 text-[#738C80]" />
            <span>Filter</span>
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
                  checked={selectedIds.length > 0 && selectedIds.length === filteredPayments.length}
                  onChange={toggleSelectAll}
                  className="rounded-sm border-[#C5BBAF] text-[#1C3A2F] focus:ring-[#1C3A2F] cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-3">Payment #</th>
              <th className="py-3.5 px-3">Partner</th>
              <th className="py-3.5 px-3">Type</th>
              <th className="py-3.5 px-3">Date</th>
              <th className="py-3.5 px-3">Method</th>
              <th className="py-3.5 px-3">Amount</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 pr-6 pl-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EAE1] text-xs text-[#141A17]">
            {filteredPayments.map((pay) => {
              const isSelected = selectedIds.includes(pay.id);
              return (
                <tr
                  key={pay.id}
                  className={`hover:bg-[#FAF7F2] transition-colors ${
                    isSelected ? 'bg-[#F2ECE1]/60' : ''
                  }`}
                >
                  <td className="py-3.5 pl-6 pr-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectRow(pay.id)}
                      className="rounded-sm border-[#C5BBAF] text-[#1C3A2F] focus:ring-[#1C3A2F] cursor-pointer"
                    />
                  </td>
                  <td className="py-3.5 px-3">
                    <button
                      type="button"
                      onClick={() => handleViewPaymentPdf(pay)}
                      className="font-semibold text-[#1C3A2F] hover:text-[#11241D] hover:underline font-mono inline-flex items-center gap-1.5 cursor-pointer text-left group"
                      title="Click to view and print official Payment Receipt Voucher PDF"
                    >
                      <span>{pay.payNo}</span>
                      <FileText className="w-3 h-3 text-[#738C80] group-hover:text-[#1C3A2F] transition-colors" />
                    </button>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10.5px] font-bold ${pay.partnerAvatarBg} shadow-2xs shrink-0`}>
                        {pay.partnerInitials}
                      </div>
                      <span className="font-semibold text-[#141A17]">{pay.partner}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-[#55665E]">{pay.type}</td>
                  <td className="py-3.5 px-3 text-[#55665E]">{pay.date}</td>
                  <td className="py-3.5 px-3 text-[#55665E]">{pay.method}</td>
                  <td className="py-3.5 px-3 font-bold font-serif text-[#141A17]">{pay.amount}</td>
                  <td className="py-3.5 px-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${pay.statusStyle} shadow-2xs`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${pay.statusDot}`} />
                      <span>{pay.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 pr-6 pl-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        type="button" 
                        onClick={() => handleDownloadPaymentPdfDirect(pay)}
                        className="p-1.5 rounded-lg text-[#738C80] hover:text-[#1C3A2F] hover:bg-[#EAE4DC] transition-colors cursor-pointer"
                        title="Download Payment Voucher PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" className="p-1.5 rounded-lg text-[#738C80] hover:text-[#141A17] hover:bg-[#EAE4DC] transition-colors cursor-pointer">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 4. Pagination */}
      <div className="px-6 py-4 border-t border-[#F0EAE1] bg-[#FAF8F5]/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#55665E]">
        <span>Showing 1 to {filteredPayments.length} of {rawPayments.length} payments</span>
        <div className="flex items-center gap-1.5">
          <button type="button" className="p-1.5 rounded-lg border border-[#E2DAD0] bg-white hover:bg-[#F2ECE4] cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
          <span className="px-3 py-1 bg-[#1C3A2F] text-white font-bold rounded-lg shadow-2xs">1</span>
          <button type="button" className="p-1.5 rounded-lg border border-[#E2DAD0] bg-white hover:bg-[#F2ECE4] cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Document PDF Modal */}
      <DocumentPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        documentData={selectedPdfDoc}
      />

    </div>
  );
};

export default PaymentsTable;
