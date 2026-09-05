import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Filter, 
  Download, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  Printer,
  X,
  CheckCircle,
  Eye
} from 'lucide-react';
import { DocumentPdfModal } from '../DocumentPdfModal';
import { createMasterRegisterPdfData, downloadDirectPdf } from '../../../utils/pdfGenerator';

export const JournalEntriesTable = ({ onCreateEntry }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState('All');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortAsc, setSortAsc] = useState(false);
  const [activeRowMenuId, setActiveRowMenuId] = useState(null);
  const [selectedPdfDoc, setSelectedPdfDoc] = useState(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const initialEntries = [
    {
      id: 1,
      entryNo: 'MISC/2025/09/0001',
      date: '02 Sep 2025',
      reference: 'Depreciation of Showroom Furniture',
      journal: 'Miscellaneous Operations',
      debit: '₹ 14,500.00',
      credit: '₹ 14,500.00',
      status: 'Posted',
      statusDot: 'bg-[#10B981]',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
    },
    {
      id: 2,
      entryNo: 'INV/2025/09/0012',
      date: '02 Sep 2025',
      reference: 'Customer Invoice - Nimesh Pathak',
      journal: 'Customer Invoices',
      debit: '₹ 24,500.00',
      credit: '₹ 24,500.00',
      status: 'Posted',
      statusDot: 'bg-[#10B981]',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
    },
    {
      id: 3,
      entryNo: 'BILL/2025/09/0021',
      date: '02 Sep 2025',
      reference: 'Vendor Bill - Azure Furniture',
      journal: 'Vendor Bills',
      debit: '₹ 18,000.00',
      credit: '₹ 18,000.00',
      status: 'Posted',
      statusDot: 'bg-[#10B981]',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
    },
    {
      id: 4,
      entryNo: 'BNK/2025/08/0045',
      date: '30 Aug 2025',
      reference: 'Bank Transfer Settlement - Woodland',
      journal: 'Bank',
      debit: '₹ 33,200.00',
      credit: '₹ 33,200.00',
      status: 'Posted',
      statusDot: 'bg-[#10B981]',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
    },
    {
      id: 5,
      entryNo: 'MISC/2025/08/0032',
      date: '28 Aug 2025',
      reference: 'End of Month Accrual Adjustment',
      journal: 'Miscellaneous Operations',
      debit: '₹ 8,750.00',
      credit: '₹ 8,750.00',
      status: 'Draft',
      statusDot: 'bg-[#F59E0B]',
      statusStyle: 'bg-[#FEF7EC] text-[#D97706]',
    },
  ];

  const [entries, setEntries] = useState(rawEntries);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadEntries = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch('/api/journal-entries', { headers });
        if (res.ok) {
          const json = await res.json();
          if (json.journalEntries && Array.isArray(json.journalEntries) && json.journalEntries.length > 0) {
            const mapped = json.journalEntries.map((je, idx) => {
              const dt = je.date ? new Date(je.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent';
              const deb = `₹ ${Number(je.totalDebit || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
              const cred = `₹ ${Number(je.totalCredit || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
              const isPosted = je.status === 'posted';

              return {
                id: je._id || idx + 1,
                entryNo: je.entryNumber || `JE-2026-${String(idx + 1).padStart(4, '0')}`,
                date: dt,
                reference: je.reference || je.partner?.name || 'General Operation',
                journal: je.journal?.name || 'General Operations',
                debit: deb,
                credit: cred,
                status: isPosted ? 'Posted' : je.status === 'cancelled' ? 'Cancelled' : 'Draft',
                statusDot: isPosted ? 'bg-[#10B981]' : je.status === 'cancelled' ? 'bg-[#DC2626]' : 'bg-[#3B82F6]',
                statusStyle: isPosted ? 'bg-[#E5F7ED] text-[#1E7445]' : je.status === 'cancelled' ? 'bg-[#FDE8E8] text-[#991B1B]' : 'bg-[#EBF3FE] text-[#2563EB]'
              };
            });
            if (isMounted) setEntries(mapped);
          }
        }
      } catch (err) {
        console.warn('Live journal entries fetch error, using fallback:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadEntries();
    return () => { isMounted = false; };
  }, []);

  const [newEntryForm, setNewEntryForm] = useState({
    reference: '',
    journal: 'Miscellaneous Operations',
    debit: '',
    credit: '',
    status: 'Posted',
  });

  const filterTabs = ['All', 'Posted', 'Draft', 'Customer Invoices', 'Vendor Bills', 'Bank'];

  const filteredEntries = useMemo(() => {
    let result = [...entries];
    if (activeFilterTab === 'Posted') result = result.filter((e) => e.status === 'Posted');
    else if (activeFilterTab === 'Draft') result = result.filter((e) => e.status === 'Draft');
    else if (activeFilterTab !== 'All') result = result.filter((e) => e.journal.toLowerCase().includes(activeFilterTab.toLowerCase()));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((e) =>
        e.entryNo.toLowerCase().includes(q) ||
        e.reference.toLowerCase().includes(q) ||
        e.journal.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      return sortAsc ? a.id - b.id : b.id - a.id;
    });
    return result;
  }, [entries, searchQuery, activeFilterTab, sortAsc]);

  const itemsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / itemsPerPage));
  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEntries.slice(start, start + itemsPerPage);
  }, [filteredEntries, currentPage]);

  const handleOpenCreateModal = () => {
    if (onCreateEntry) {
      onCreateEntry();
    } else {
      setIsCreateModalOpen(true);
    }
  };

  const handleSaveEntry = (e) => {
    e.preventDefault();
    if (!newEntryForm.reference || !newEntryForm.debit) return;

    const nextId = entries.length + 1;
    const formattedIdStr = String(nextId).padStart(4, '0');
    const prefix = newEntryForm.journal === 'Bank' ? 'BNK' : newEntryForm.journal === 'Customer Invoices' ? 'INV' : newEntryForm.journal === 'Vendor Bills' ? 'BILL' : 'MISC';
    
    const isPosted = newEntryForm.status === 'Posted';
    const statusStyle = isPosted ? 'bg-[#E5F7ED] text-[#1E7445]' : 'bg-[#FEF7EC] text-[#D97706]';
    const statusDot = isPosted ? 'bg-[#10B981]' : 'bg-[#F59E0B]';

    const debitVal = newEntryForm.debit.startsWith('₹') ? newEntryForm.debit : `₹ ${newEntryForm.debit}`;
    const creditVal = newEntryForm.credit ? (newEntryForm.credit.startsWith('₹') ? newEntryForm.credit : `₹ ${newEntryForm.credit}`) : debitVal;

    const newEntry = {
      id: nextId,
      entryNo: `${prefix}/2025/09/${formattedIdStr}`,
      date: 'Today, 02 Sep 2025',
      reference: newEntryForm.reference,
      journal: newEntryForm.journal,
      debit: debitVal,
      credit: creditVal,
      status: newEntryForm.status,
      statusDot,
      statusStyle,
    };

    setEntries([newEntry, ...entries]);
    setIsCreateModalOpen(false);
    setNewEntryForm({
      reference: '',
      journal: 'Miscellaneous Operations',
      debit: '',
      credit: '',
      status: 'Posted',
    });
  };

  const handleToggleEntryStatus = (entryId) => {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.id === entryId) {
          const nextStatus = e.status === 'Posted' ? 'Draft' : 'Posted';
          const nextStyle = nextStatus === 'Posted' ? 'bg-[#E5F7ED] text-[#1E7445]' : 'bg-[#FEF7EC] text-[#D97706]';
          const nextDot = nextStatus === 'Posted' ? 'bg-[#10B981]' : 'bg-[#F59E0B]';
          return { ...e, status: nextStatus, statusStyle: nextStyle, statusDot: nextDot };
        }
        return e;
      })
    );
    setActiveRowMenuId(null);
  };

  const handleViewJournalPdf = (entry) => {
    const pdfData = {
      type: 'JOURNAL',
      title: 'GENERAL LEDGER JOURNAL VOUCHER',
      documentNo: entry.entryNo,
      date: entry.date,
      dueDate: 'Audited & Balanced',
      status: entry.status,
      partner: {
        name: 'Accounts & Audit Control Desk',
        company: 'Urban Furniture ERP Core',
        city: 'Ahmedabad, Gujarat',
      },
      tableData: {
        headers: ['Account Head / Particulars', 'Debit (Rs.)', 'Credit (Rs.)'],
        rows: [
          [entry.reference, entry.debit, '-'],
          ['General Balancing Clearing Account', '-', entry.credit],
        ],
      },
      notes: `Balanced double-entry journal verified under transaction reference: ${entry.reference}`,
    };

    setSelectedPdfDoc(pdfData);
    setIsPdfModalOpen(true);
    setActiveRowMenuId(null);
  };

  const handleDownloadJournalPdfDirect = (entry) => {
    const pdfData = {
      type: 'JOURNAL',
      title: 'GENERAL LEDGER JOURNAL VOUCHER',
      documentNo: entry.entryNo,
      date: entry.date,
      dueDate: 'Audited & Balanced',
      status: entry.status,
      partner: {
        name: 'Accounts & Audit Control Desk',
        company: 'Urban Furniture ERP Core',
        city: 'Ahmedabad, Gujarat',
      },
      tableData: {
        headers: ['Account Head / Particulars', 'Debit (Rs.)', 'Credit (Rs.)'],
        rows: [
          [entry.reference, entry.debit, '-'],
          ['General Balancing Clearing Account', '-', entry.credit],
        ],
      },
      notes: `Balanced double-entry journal verified under transaction reference: ${entry.reference}`,
    };

    downloadDirectPdf(pdfData);
    setActiveRowMenuId(null);
  };

  const handleExportPdf = () => {
    const headers = ['Number', 'Date', 'Reference / Description', 'Journal', 'Total Debit', 'Total Credit', 'Status'];
    const rows = filteredEntries.map((e) => [
      e.entryNo,
      e.date,
      e.reference,
      e.journal,
      e.debit,
      e.credit,
      e.status,
    ]);

    const pdfData = createMasterRegisterPdfData('General Ledger Journal Entries Register', headers, rows);
    downloadDirectPdf(pdfData);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-xs overflow-hidden transition-all duration-300">
      
      {/* 1. Header */}
      <div className="p-5 sm:p-6 border-b border-[#F0EAE1] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#F4EFE6] text-[#1C3A2F] flex items-center justify-center border border-[#E5DDD0] shadow-2xs shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#141A17] tracking-tight">
              Journal Entries
            </h2>
            <p className="text-xs text-[#6B7A74] mt-0.5">
              Review and audit balanced debit-credit accounting journal records.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-[#8A9B93] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search journal entries..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl pl-9 pr-3 py-2 text-xs text-[#141A17] placeholder:text-[#8A9B93] focus:outline-hidden focus:border-[#1C3A2F] focus:ring-1 focus:ring-[#1C3A2F] transition-all"
            />
          </div>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 bg-[#1C3A2F] hover:bg-[#142C23] text-[#FAF8F5] text-xs font-semibold px-4 py-2 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Entry</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Toolbar */}
      <div className="px-5 sm:px-6 py-3.5 bg-[#FAF8F5]/80 border-b border-[#F0EAE1] flex flex-wrap items-center justify-between gap-3">
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

        <div className="flex items-center gap-2 ml-auto">
          <button 
            type="button" 
            onClick={() => setSortAsc(!sortAsc)}
            className="inline-flex items-center gap-1.5 bg-white border border-[#E2DAD0] hover:bg-[#F5EFE6] text-[#4A5952] text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
            title="Toggle sort order"
          >
            <Filter className="w-3.5 h-3.5 text-[#738C80]" />
            <span>{sortAsc ? 'Oldest First' : 'Newest First'}</span>
          </button>
          <button 
            type="button" 
            onClick={handleExportPdf}
            className="inline-flex items-center gap-1.5 bg-white border border-[#E2DAD0] hover:bg-[#F5EFE6] text-[#4A5952] text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
            title="Generate & Export PDF"
          >
            <Download className="w-3.5 h-3.5 text-[#738C80]" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* 3. Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-187.5">
          <thead>
            <tr className="border-b border-[#EAE3D7] bg-[#F7F4EE] text-[11px] font-bold text-[#55665E] uppercase tracking-wider">
              <th className="py-3.5 pl-6 pr-3">Number</th>
              <th className="py-3.5 px-3">Date</th>
              <th className="py-3.5 px-3">Reference / Description</th>
              <th className="py-3.5 px-3">Journal</th>
              <th className="py-3.5 px-3">Total Debit</th>
              <th className="py-3.5 px-3">Total Credit</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 pr-6 pl-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EAE1] text-xs text-[#141A17]">
            {paginatedEntries.map((e) => {
              const isMenuOpen = activeRowMenuId === e.id;

              return (
                <tr key={e.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3.5 pl-6 pr-3">
                    <button
                      type="button"
                      onClick={() => handleViewJournalPdf(e)}
                      className="font-semibold text-[#1C3A2F] hover:underline font-mono inline-flex items-center gap-1.5 cursor-pointer text-left group"
                      title="Click to view journal voucher PDF"
                    >
                      <span>{e.entryNo}</span>
                      <FileText className="w-3 h-3 text-[#738C80] group-hover:text-[#1C3A2F]" />
                    </button>
                  </td>
                  <td className="py-3.5 px-3 text-[#55665E]">{e.date}</td>
                  <td className="py-3.5 px-3 font-semibold text-[#141A17]">{e.reference}</td>
                  <td className="py-3.5 px-3 text-[#55665E]">{e.journal}</td>
                  <td className="py-3.5 px-3 font-bold font-serif text-[#141A17]">{e.debit}</td>
                  <td className="py-3.5 px-3 font-bold font-serif text-[#141A17]">{e.credit}</td>
                  <td className="py-3.5 px-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${e.statusStyle} shadow-2xs`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${e.statusDot}`} />
                      <span>{e.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 pr-6 pl-3 text-right">
                    <div className="flex items-center justify-end gap-1 relative">
                      <button 
                        type="button" 
                        onClick={() => handleDownloadJournalPdfDirect(e)}
                        className="p-1.5 rounded-lg text-[#738C80] hover:text-[#1C3A2F] hover:bg-[#EAE4DC] transition-colors cursor-pointer"
                        title="Download Journal Voucher PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setActiveRowMenuId(isMenuOpen ? null : e.id)}
                        className="p-1.5 rounded-lg text-[#738C80] hover:text-[#141A17] hover:bg-[#EAE4DC] transition-colors cursor-pointer"
                        title="More options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Context Menu */}
                      {isMenuOpen && (
                        <div className="absolute right-0 top-8 z-30 w-48 bg-white rounded-xl shadow-lg border border-[#E8E1D5] py-1 text-left">
                          <button
                            type="button"
                            onClick={() => handleViewJournalPdf(e)}
                            className="w-full px-3.5 py-2 text-xs text-[#141A17] hover:bg-[#FAF8F5] flex items-center gap-2 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#1C3A2F]" />
                            <span>View Voucher PDF</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadJournalPdfDirect(e)}
                            className="w-full px-3.5 py-2 text-xs text-[#141A17] hover:bg-[#FAF8F5] flex items-center gap-2 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-[#1C3A2F]" />
                            <span>Download PDF</span>
                          </button>
                          <div className="border-t border-[#F0EAE1] my-1"></div>
                          <button
                            type="button"
                            onClick={() => handleToggleEntryStatus(e.id)}
                            className="w-full px-3.5 py-2 text-xs text-[#1C3A2F] font-semibold hover:bg-[#FAF8F5] flex items-center gap-2 cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{e.status === 'Posted' ? 'Convert to Draft' : 'Post Entry'}</span>
                          </button>
                        </div>
                      )}
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
        <span>
          Showing {filteredEntries.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
          {Math.min(currentPage * itemsPerPage, filteredEntries.length)} of {filteredEntries.length} journal entries
        </span>
        <div className="flex items-center gap-1.5">
          <button 
            type="button" 
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-[#E2DAD0] bg-white hover:bg-[#F2ECE4] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => setCurrentPage(pageNum)}
              className={`px-3 py-1 font-bold rounded-lg cursor-pointer transition-all ${
                currentPage === pageNum
                  ? 'bg-[#1C3A2F] text-white shadow-2xs'
                  : 'bg-white text-[#4A5952] border border-[#E2DAD0] hover:bg-[#F2ECE4]'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button 
            type="button" 
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-[#E2DAD0] bg-white hover:bg-[#F2ECE4] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Create Journal Entry Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-2xl max-w-md w-full overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-[#F0EAE1] flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1C3A2F] text-white flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury font-bold text-base text-[#141A17]">New Journal Entry</h3>
                  <p className="text-[11px] text-[#6B7A74]">Record double-entry general ledger voucher</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-[#6B7A74] hover:text-[#141A17] hover:bg-[#EAE4DC] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-[#141A17] mb-1">Journal Type</label>
                <select
                  value={newEntryForm.journal}
                  onChange={(e) => setNewEntryForm({ ...newEntryForm, journal: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                >
                  <option value="Miscellaneous Operations">Miscellaneous Operations</option>
                  <option value="Customer Invoices">Customer Invoices</option>
                  <option value="Vendor Bills">Vendor Bills</option>
                  <option value="Bank">Bank</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141A17] mb-1">Reference / Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Factory Machinery Depreciation Adjustment"
                  value={newEntryForm.reference}
                  onChange={(e) => setNewEntryForm({ ...newEntryForm, reference: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#141A17] mb-1">Debit Amount (INR)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 15000"
                    value={newEntryForm.debit}
                    onChange={(e) => setNewEntryForm({ ...newEntryForm, debit: e.target.value, credit: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141A17] mb-1">Credit Amount (INR)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 15000"
                    value={newEntryForm.credit}
                    onChange={(e) => setNewEntryForm({ ...newEntryForm, credit: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141A17] mb-1">Posting Status</label>
                <select
                  value={newEntryForm.status}
                  onChange={(e) => setNewEntryForm({ ...newEntryForm, status: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                >
                  <option value="Posted">Posted (Finalized)</option>
                  <option value="Draft">Draft (Pending Review)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E2DAD0] text-[#55665E] hover:bg-[#FAF8F5] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1C3A2F] hover:bg-[#142C23] text-white font-semibold cursor-pointer shadow-xs"
                >
                  Save Entry
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

export default JournalEntriesTable;
