import React, { useState, useEffect, useMemo } from 'react';
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
  AlertTriangle,
  Trash2,
  Eye,
  ArrowUpDown,
  BookOpen
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

  // Accounts list for multi-line journal entry builder
  const [accountsList, setAccountsList] = useState([
    { _id: 'acc-1', code: '101000', name: 'Bank Current Account (HDFC)' },
    { _id: 'acc-2', code: '102000', name: 'Petty Cash Desk' },
    { _id: 'acc-3', code: '110000', name: 'Account Receivable (Trade Debtors)' },
    { _id: 'acc-4', code: '120000', name: 'Finished Goods Furniture Inventory' },
    { _id: 'acc-5', code: '200000', name: 'Account Payable (Trade Creditors)' },
    { _id: 'acc-6', code: '400000', name: 'Product Sales Revenue' },
    { _id: 'acc-7', code: '500000', name: 'Cost of Goods Sold (Raw Materials)' },
    { _id: 'acc-8', code: '601000', name: 'Showroom Rent & Utilities' },
  ]);

  // Partners list for multi-line journal entry builder
  const [partnersList, setPartnersList] = useState([
    { _id: 'p-1', name: 'Nimesh Pathak' },
    { _id: 'p-2', name: 'Azure Furniture Ltd' },
    { _id: 'p-3', name: 'Meera & Co.' },
    { _id: 'p-4', name: 'Woodland Timber Suppliers' },
    { _id: 'p-5', name: 'Studio Nest' },
  ]);

  const initialEntries = [
    {
      id: 1,
      entryNo: 'MISC/2026/0001',
      date: '02 Sep 2026',
      reference: 'Depreciation of Showroom Furniture',
      journal: 'Miscellaneous Operations',
      debit: '₹ 14,500.00',
      credit: '₹ 14,500.00',
      status: 'Posted',
      statusDot: 'bg-[#10B981]',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      lines: [
        { accountName: 'Showroom Rent & Utilities', debit: 14500, credit: 0, label: 'Depreciation charge' },
        { accountName: 'Finished Goods Furniture Inventory', debit: 0, credit: 14500, label: 'Asset depreciation adjustment' }
      ]
    },
    {
      id: 2,
      entryNo: 'INV/2026/0012',
      date: '02 Sep 2026',
      reference: 'Customer Invoice - Nimesh Pathak',
      journal: 'Customer Invoices',
      debit: '₹ 24,500.00',
      credit: '₹ 24,500.00',
      status: 'Posted',
      statusDot: 'bg-[#10B981]',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      lines: [
        { accountName: 'Account Receivable (Trade Debtors)', debit: 24500, credit: 0, label: 'Customer Receivable' },
        { accountName: 'Product Sales Revenue', debit: 0, credit: 24500, label: 'Sales Revenue' }
      ]
    },
    {
      id: 3,
      entryNo: 'BILL/2026/0021',
      date: '02 Sep 2026',
      reference: 'Vendor Bill - Azure Furniture',
      journal: 'Vendor Bills',
      debit: '₹ 18,000.00',
      credit: '₹ 18,000.00',
      status: 'Posted',
      statusDot: 'bg-[#10B981]',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      lines: [
        { accountName: 'Cost of Goods Sold (Raw Materials)', debit: 18000, credit: 0, label: 'Raw materials stock' },
        { accountName: 'Account Payable (Trade Creditors)', debit: 0, credit: 18000, label: 'Vendor Payable' }
      ]
    },
    {
      id: 4,
      entryNo: 'BNK/2026/0045',
      date: '30 Aug 2026',
      reference: 'Bank Transfer Settlement - Woodland',
      journal: 'Bank',
      debit: '₹ 33,200.00',
      credit: '₹ 33,200.00',
      status: 'Posted',
      statusDot: 'bg-[#10B981]',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      lines: [
        { accountName: 'Account Payable (Trade Creditors)', debit: 33200, credit: 0, label: 'Supplier settlement' },
        { accountName: 'Bank Current Account (HDFC)', debit: 0, credit: 33200, label: 'Bank disbursement' }
      ]
    },
    {
      id: 5,
      entryNo: 'MISC/2026/0032',
      date: '28 Aug 2026',
      reference: 'End of Month Accrual Adjustment',
      journal: 'Miscellaneous Operations',
      debit: '₹ 8,750.00',
      credit: '₹ 8,750.00',
      status: 'Draft',
      statusDot: 'bg-[#F59E0B]',
      statusStyle: 'bg-[#FEF7EC] text-[#D97706]',
      lines: [
        { accountName: 'Showroom Rent & Utilities', debit: 8750, credit: 0, label: 'Accrual entry' },
        { accountName: 'Account Payable (Trade Creditors)', debit: 0, credit: 8750, label: 'Accrued liability' }
      ]
    },
  ];

  const [entries, setEntries] = useState(initialEntries);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadEntriesAndMasters = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        // Fetch accounts
        const accRes = await fetch('/api/accounts', { headers });
        if (accRes.ok) {
          const accJson = await accRes.json();
          if (accJson.accounts && accJson.accounts.length > 0) {
            setAccountsList(accJson.accounts);
          }
        }

        // Fetch contacts
        const contRes = await fetch('/api/contacts', { headers });
        if (contRes.ok) {
          const contJson = await contRes.json();
          if (contJson.contacts && contJson.contacts.length > 0) {
            setPartnersList(contJson.contacts);
          }
        }

        // Fetch journal entries
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
                entryNo: je.entryNumber || `MISC/2026/${String(idx + 1).padStart(4, '0')}`,
                date: dt,
                reference: je.reference || je.partner?.name || 'General Operation',
                journal: je.journal?.name || 'General Operations',
                debit: deb,
                credit: cred,
                status: isPosted ? 'Posted' : je.status === 'cancelled' ? 'Cancelled' : 'Draft',
                statusDot: isPosted ? 'bg-[#10B981]' : je.status === 'cancelled' ? 'bg-[#DC2626]' : 'bg-[#3B82F6]',
                statusStyle: isPosted ? 'bg-[#E5F7ED] text-[#1E7445]' : je.status === 'cancelled' ? 'bg-[#FDE8E8] text-[#991B1B]' : 'bg-[#EBF3FE] text-[#2563EB]',
                lines: je.lines || []
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
    loadEntriesAndMasters();
    return () => { isMounted = false; };
  }, []);

  // Multi-line builder state
  const [newEntryForm, setNewEntryForm] = useState({
    reference: '',
    journal: 'Miscellaneous Operations',
    date: new Date().toISOString().split('T')[0],
    status: 'Posted',
    lines: [
      { accountId: '', partnerId: '', label: '', debit: 0, credit: 0 },
      { accountId: '', partnerId: '', label: '', debit: 0, credit: 0 },
    ]
  });

  const handleAddLine = () => {
    setNewEntryForm((prev) => ({
      ...prev,
      lines: [...prev.lines, { accountId: '', partnerId: '', label: '', debit: 0, credit: 0 }]
    }));
  };

  const handleRemoveLine = (index) => {
    if (newEntryForm.lines.length <= 2) return;
    setNewEntryForm((prev) => ({
      ...prev,
      lines: prev.lines.filter((_, idx) => idx !== index)
    }));
  };

  const handleLineChange = (index, field, value) => {
    setNewEntryForm((prev) => {
      const updatedLines = [...prev.lines];
      updatedLines[index] = {
        ...updatedLines[index],
        [field]: (field === 'debit' || field === 'credit') ? (parseFloat(value) || 0) : value
      };
      return { ...prev, lines: updatedLines };
    });
  };

  // Balancing computations
  const totalDebits = useMemo(() => {
    return newEntryForm.lines.reduce((sum, line) => sum + (Number(line.debit) || 0), 0);
  }, [newEntryForm.lines]);

  const totalCredits = useMemo(() => {
    return newEntryForm.lines.reduce((sum, line) => sum + (Number(line.credit) || 0), 0);
  }, [newEntryForm.lines]);

  const imbalance = Math.abs(totalDebits - totalCredits);
  const isBalanced = totalDebits > 0 && Math.abs(totalDebits - totalCredits) < 0.01;

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

  const handleSaveEntry = async (e) => {
    e.preventDefault();
    if (!newEntryForm.reference) {
      alert('Please provide an entry reference / description.');
      return;
    }
    if (!isBalanced) {
      alert('Cannot save or post an unbalanced journal entry! Total debits must strictly equal total credits.');
      return;
    }

    const nextId = entries.length + 1;
    const formattedIdStr = String(nextId).padStart(4, '0');
    const prefix = newEntryForm.journal === 'Bank' ? 'BNK' : newEntryForm.journal === 'Customer Invoices' ? 'INV' : newEntryForm.journal === 'Vendor Bills' ? 'BILL' : 'MISC';
    
    const isPosted = newEntryForm.status === 'Posted';
    const statusStyle = isPosted ? 'bg-[#E5F7ED] text-[#1E7445]' : 'bg-[#FEF7EC] text-[#D97706]';
    const statusDot = isPosted ? 'bg-[#10B981]' : 'bg-[#F59E0B]';

    const debitVal = `₹ ${Number(totalDebits).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    const creditVal = `₹ ${Number(totalCredits).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

    const newEntry = {
      id: nextId,
      entryNo: `${prefix}/2026/${formattedIdStr}`,
      date: new Date(newEntryForm.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      reference: newEntryForm.reference,
      journal: newEntryForm.journal,
      debit: debitVal,
      credit: creditVal,
      status: newEntryForm.status,
      statusDot,
      statusStyle,
      lines: newEntryForm.lines.map(l => {
        const foundAcc = accountsList.find(a => a._id === l.accountId);
        return {
          accountName: foundAcc ? foundAcc.name : 'General Account',
          debit: Number(l.debit) || 0,
          credit: Number(l.credit) || 0,
          label: l.label || newEntryForm.reference
        };
      })
    };

    setEntries([newEntry, ...entries]);
    setIsCreateModalOpen(false);

    // Sync to backend if endpoint exists
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;
      await fetch('/api/journal-entries', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          entryNumber: newEntry.entryNo,
          date: newEntryForm.date,
          reference: newEntryForm.reference,
          status: newEntryForm.status.toLowerCase(),
          lines: newEntryForm.lines.map(l => ({
            account: l.accountId || accountsList[0]?._id,
            partner: l.partnerId || undefined,
            label: l.label || newEntryForm.reference,
            debit: Number(l.debit) || 0,
            credit: Number(l.credit) || 0
          }))
        })
      });
    } catch (err) {
      console.warn('Backend sync for journal entry skipped:', err.message);
    }

    // Reset form
    setNewEntryForm({
      reference: '',
      journal: 'Miscellaneous Operations',
      date: new Date().toISOString().split('T')[0],
      status: 'Posted',
      lines: [
        { accountId: '', partnerId: '', label: '', debit: 0, credit: 0 },
        { accountId: '', partnerId: '', label: '', debit: 0, credit: 0 },
      ]
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
    const tableRows = entry.lines && entry.lines.length > 0
      ? entry.lines.map(l => [
          l.accountName || 'Ledger Account',
          l.debit > 0 ? `₹ ${Number(l.debit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-',
          l.credit > 0 ? `₹ ${Number(l.credit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'
        ])
      : [
          [entry.reference, entry.debit, '-'],
          ['General Balancing Clearing Account', '-', entry.credit],
        ];

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
        rows: tableRows,
      },
      notes: `Balanced double-entry journal verified under transaction reference: ${entry.reference}`,
    };

    setSelectedPdfDoc(pdfData);
    setIsPdfModalOpen(true);
    setActiveRowMenuId(null);
  };

  const handleDownloadJournalPdfDirect = (entry) => {
    const tableRows = entry.lines && entry.lines.length > 0
      ? entry.lines.map(l => [
          l.accountName || 'Ledger Account',
          l.debit > 0 ? `₹ ${Number(l.debit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-',
          l.credit > 0 ? `₹ ${Number(l.credit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'
        ])
      : [
          [entry.reference, entry.debit, '-'],
          ['General Balancing Clearing Account', '-', entry.credit],
        ];

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
        rows: tableRows,
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
            className="p-1.5 rounded-lg border border-[#E2DAD0] bg-white hover:bg-[#F2ECE4] enabled:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
            className="p-1.5 rounded-lg border border-[#E2DAD0] bg-white hover:bg-[#F2ECE4] enabled:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dynamic Multi-line Create Journal Entry Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200 my-auto">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#F0EAE1] flex items-center justify-between bg-[#FAF8F5] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#1C3A2F] text-white flex items-center justify-center shadow-xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury font-bold text-lg text-[#141A17]">New Journal Entry (Double-Entry)</h3>
                  <p className="text-xs text-[#6B7A74]">Multi-line General Ledger voucher with live balancing enforcement</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-xl text-[#6B7A74] hover:text-[#141A17] hover:bg-[#EAE4DC] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveEntry} className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
              {/* Header Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#141A17] mb-1">Journal</label>
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
                  <label className="block text-xs font-semibold text-[#141A17] mb-1">Accounting Date</label>
                  <input
                    type="date"
                    required
                    value={newEntryForm.date}
                    onChange={(e) => setNewEntryForm({ ...newEntryForm, date: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                  >
                  </input>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141A17] mb-1">Initial Status</label>
                  <select
                    value={newEntryForm.status}
                    onChange={(e) => setNewEntryForm({ ...newEntryForm, status: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                  >
                    <option value="Posted">Posted (Finalized)</option>
                    <option value="Draft">Draft (Pending Audit)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141A17] mb-1">Reference / Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly Showroom Rent & Utilities Allocation"
                  value={newEntryForm.reference}
                  onChange={(e) => setNewEntryForm({ ...newEntryForm, reference: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                />
              </div>

              {/* Multi-line Journal Items Table */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-[#141A17] uppercase tracking-wider">Journal Items</h4>
                  <button
                    type="button"
                    onClick={handleAddLine}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#EAE4DC] border border-[#E2DAD0] text-[#1C3A2F] font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Line</span>
                  </button>
                </div>

                <div className="border border-[#E8E1D5] rounded-2xl overflow-hidden bg-white shadow-2xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F7F4EE] border-b border-[#EAE3D7] text-[11px] font-bold text-[#55665E] uppercase">
                        <th className="py-2.5 px-3 w-44">Account</th>
                        <th className="py-2.5 px-3 w-36">Partner</th>
                        <th className="py-2.5 px-3">Label</th>
                        <th className="py-2.5 px-3 w-28 text-right">Debit (₹)</th>
                        <th className="py-2.5 px-3 w-28 text-right">Credit (₹)</th>
                        <th className="py-2.5 px-2 w-10 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EAE1]">
                      {newEntryForm.lines.map((line, idx) => (
                        <tr key={idx} className="hover:bg-[#FAF8F5]">
                          <td className="py-2 px-3">
                            <select
                              value={line.accountId}
                              onChange={(e) => handleLineChange(idx, 'accountId', e.target.value)}
                              className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-lg px-2 py-1.5 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                            >
                              <option value="">Select Account...</option>
                              {accountsList.map((acc) => (
                                <option key={acc._id} value={acc._id}>
                                  {acc.code ? `[${acc.code}] ` : ''}{acc.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={line.partnerId}
                              onChange={(e) => handleLineChange(idx, 'partnerId', e.target.value)}
                              className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-lg px-2 py-1.5 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                            >
                              <option value="">None / Internal</option>
                              {partnersList.map((p) => (
                                <option key={p._id} value={p._id}>{p.name}</option>
                              ))}
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              placeholder="Line label"
                              value={line.label}
                              onChange={(e) => handleLineChange(idx, 'label', e.target.value)}
                              className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-lg px-2 py-1.5 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              value={line.debit || ''}
                              onChange={(e) => handleLineChange(idx, 'debit', e.target.value)}
                              className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-lg px-2 py-1.5 text-xs text-right font-mono text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              value={line.credit || ''}
                              onChange={(e) => handleLineChange(idx, 'credit', e.target.value)}
                              className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-lg px-2 py-1.5 text-xs text-right font-mono text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveLine(idx)}
                              disabled={newEntryForm.lines.length <= 2}
                              className="p-1 rounded text-[#8A9B93] hover:text-[#DC2626] hover:bg-[#FDE8E8] disabled:opacity-30 disabled:hover:text-[#8A9B93] disabled:hover:bg-transparent cursor-pointer"
                              title="Delete line"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-[#F7F4EE] border-t border-[#EAE3D7] font-bold">
                      <tr>
                        <td colSpan={3} className="py-2.5 px-3 text-right uppercase text-[11px] text-[#55665E]">
                          Totals
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-xs text-[#1C3A2F]">
                          ₹ {totalDebits.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-xs text-[#1C3A2F]">
                          ₹ {totalCredits.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Live Balancing Enforcement Indicator */}
              <div className="pt-1">
                {isBalanced ? (
                  <div className="p-3 rounded-2xl bg-[#E5F7ED] border border-[#A7F3D0] flex items-center justify-between text-[#1E7445]">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0" />
                      <span className="font-bold text-xs">Balanced Entry</span>
                      <span className="text-[11px] text-[#2D6A4F]">— Debits exactly match Credits (₹ {totalDebits.toLocaleString('en-IN', { minimumFractionDigits: 2 })})</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold bg-white px-2 py-0.5 rounded-lg border border-[#A7F3D0]">
                      Diff: ₹ 0.00
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-between text-[#991B1B]">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0" />
                      <span className="font-bold text-xs">Unbalanced Entry</span>
                      <span className="text-[11px] text-[#7F1D1D]">— Total Debit must equal Total Credit before saving or posting.</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold bg-white px-2 py-0.5 rounded-lg border border-[#FECACA] text-[#DC2626]">
                      Imbalance: ₹ {imbalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between">
                <span className="text-[11px] text-[#6B7A74]">
                  {newEntryForm.lines.length} lines configured
                </span>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-[#E2DAD0] text-[#55665E] hover:bg-[#FAF8F5] font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isBalanced}
                    className="px-4 py-2 rounded-xl bg-[#1C3A2F] hover:bg-[#142C23] disabled:bg-[#7A8A83] disabled:cursor-not-allowed text-white font-semibold cursor-pointer shadow-xs transition-all"
                  >
                    {newEntryForm.status === 'Posted' ? 'Post Journal Entry' : 'Save as Draft'}
                  </button>
                </div>
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
