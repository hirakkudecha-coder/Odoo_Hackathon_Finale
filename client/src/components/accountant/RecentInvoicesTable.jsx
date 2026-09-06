import React, { useState, useEffect } from 'react';
import { DocumentPdfModal } from './DocumentPdfModal';
import { createSalesOrderPdfData, downloadDirectPdf } from '../../utils/pdfGenerator';
import { FileText, Printer } from 'lucide-react';

export const RecentInvoicesTable = ({ onViewAll }) => {
  const [selectedPdfDoc, setSelectedPdfDoc] = useState(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const rawInvoices = [
    { id: 'INV-0012', customer: 'Nimesh Pathak', date: '02 Sep 2025', amount: '₹ 24,500', status: 'Paid' },
    { id: 'INV-0011', customer: 'Meera & Co.', date: '01 Sep 2025', amount: '₹ 56,800', status: 'Pending' },
    { id: 'INV-0010', customer: 'Studio Nest', date: '30 Aug 2025', amount: '₹ 32,000', status: 'Due' },
    { id: 'INV-0009', customer: 'Urban Spaces', date: '28 Aug 2025', amount: '₹ 18,400', status: 'Paid' },
    { id: 'INV-0008', customer: 'DesignHub Interiors', date: '26 Aug 2025', amount: '₹ 41,250', status: 'Pending' },
  ];

  const [invoices, setInvoices] = useState(rawInvoices);

  useEffect(() => {
    let isMounted = true;
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch('/api/customer-invoices', { headers });
        if (res.ok) {
          const json = await res.json();
          if (json.customerInvoices && Array.isArray(json.customerInvoices) && json.customerInvoices.length > 0) {
            const mapped = json.customerInvoices.slice(0, 5).map((inv, idx) => {
              const custName = inv.customer?.name || 'Customer';
              const dateStr = inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent';
              const amtStr = `₹ ${Number(inv.totalAmount || 0).toLocaleString('en-IN')}`;
              let statusLabel = 'Pending';
              if (inv.status === 'paid') statusLabel = 'Paid';
              else if (inv.status === 'posted' && new Date(inv.dueDate) < new Date()) statusLabel = 'Due';

              return {
                id: inv.invoiceNumber || `INV-${String(idx + 1).padStart(4, '0')}`,
                customer: custName,
                date: dateStr,
                amount: amtStr,
                status: statusLabel
              };
            });
            if (isMounted) setInvoices(mapped);
          }
        }
      } catch (err) {
        console.warn('Recent invoices fetch error, using fallback:', err.message);
      }
    };
    fetchInvoices();
    return () => { isMounted = false; };
  }, []);

  const handleOpenInvoicePdf = (inv) => {
    const pdfData = createSalesOrderPdfData({
      soNo: inv.id,
      customer: inv.customer,
      date: inv.date,
      totalAmount: inv.amount,
      status: inv.status,
    });
    setSelectedPdfDoc(pdfData);
    setIsPdfModalOpen(true);
  };

  const handleDownloadInvoicePdfDirect = (inv) => {
    const pdfData = createSalesOrderPdfData({
      soNo: inv.id,
      customer: inv.customer,
      date: inv.date,
      totalAmount: inv.amount,
      status: inv.status,
    });
    downloadDirectPdf(pdfData);
  };

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
          Recent Invoices
        </h3>
        <button 
          type="button"
          onClick={() => handleOpenInvoicePdf(invoices[0])}
          className="text-xs font-semibold text-[#2D4A3E] hover:text-[#182F25] hover:underline cursor-pointer inline-flex items-center gap-1"
          title="View latest invoice PDF"
        >
          <span>View Invoice PDF</span>
        </button>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[480px]">
          <thead>
            <tr className="border-b border-[#2D4A3E]/8 text-[11px] font-semibold text-[#7A8A82]">
              <th className="py-2.5 px-2 font-medium">Invoice #</th>
              <th className="py-2.5 px-2 font-medium">Customer</th>
              <th className="py-2.5 px-2 font-medium">Date</th>
              <th className="py-2.5 px-2 font-medium">Amount</th>
              <th className="py-2.5 px-2 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2D4A3E]/5 text-xs text-[#141A17]">
            {invoices.map((inv) => (
              <tr 
                key={inv.id} 
                onClick={() => handleOpenInvoicePdf(inv)}
                className="hover:bg-[#FAF8F5] transition-colors cursor-pointer group"
              >
                <td className="py-2.5 px-2 font-semibold text-[#2D4A3E] font-mono">
                  <span className="group-hover:underline inline-flex items-center gap-1">
                    {inv.id}
                    <FileText className="w-3 h-3 text-[#7A8A82] group-hover:text-[#2D4A3E]" />
                  </span>
                </td>
                <td className="py-2.5 px-2 font-medium text-[#141A17]">
                  {inv.customer}
                </td>
                <td className="py-2.5 px-2 text-[#687C72]">
                  {inv.date}
                </td>
                <td className="py-2.5 px-2 font-bold font-serif text-[#141A17]">
                  {inv.amount}
                </td>
                <td className="py-2.5 px-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {getStatusBadge(inv.status)}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadInvoicePdfDirect(inv);
                      }}
                      className="p-1 rounded-md text-[#7A8A82] hover:text-[#1C3A2F] hover:bg-[#EAE4DC] transition-colors"
                      title="Download Invoice PDF directly"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default RecentInvoicesTable;
