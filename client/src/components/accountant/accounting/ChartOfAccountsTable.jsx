<<<<<<< HEAD
import React, { useState, useEffect, useMemo } from 'react';
=======
import React, { useState, useMemo } from 'react';
>>>>>>> 5fed872f0bf1975aaf0f133b5f60cbf0f78457af
import { 
  BookOpen, 
  Search, 
  Plus, 
  Filter, 
  Download, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  Printer,
  FileText,
  X,
  CheckCircle,
  Eye
} from 'lucide-react';
import { DocumentPdfModal } from '../DocumentPdfModal';
import { createMasterRegisterPdfData, downloadDirectPdf } from '../../../utils/pdfGenerator';

export const ChartOfAccountsTable = ({ onCreateAccount }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState('All');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortAsc, setSortAsc] = useState(false);
  const [activeRowMenuId, setActiveRowMenuId] = useState(null);
  const [selectedPdfDoc, setSelectedPdfDoc] = useState(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const initialAccounts = [
    {
      id: 1,
      code: '101000',
      name: 'Bank Current Account (HDFC)',
      type: 'Bank & Cash',
      typeBadge: 'bg-[#EBF3FE] text-[#2563EB]',
      currency: 'INR',
      balance: '₹ 14,85,200.00',
      status: 'Active',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 2,
      code: '102000',
      name: 'Petty Cash Desk',
      type: 'Bank & Cash',
      typeBadge: 'bg-[#EBF3FE] text-[#2563EB]',
      currency: 'INR',
      balance: '₹ 45,000.00',
      status: 'Active',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 3,
      code: '110000',
      name: 'Account Receivable (Trade Debtors)',
      type: 'Current Asset',
      typeBadge: 'bg-[#E5F7ED] text-[#1E7445]',
      currency: 'INR',
      balance: '₹ 3,88,500.00',
      status: 'Active',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 4,
      code: '120000',
      name: 'Finished Goods Furniture Inventory',
      type: 'Current Asset',
      typeBadge: 'bg-[#E5F7ED] text-[#1E7445]',
      currency: 'INR',
      balance: '₹ 28,40,000.00',
      status: 'Active',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 5,
      code: '200000',
      name: 'Account Payable (Trade Creditors)',
      type: 'Current Liability',
      typeBadge: 'bg-[#FEF7EC] text-[#D97706]',
      currency: 'INR',
      balance: '₹ 1,76,200.00',
      status: 'Active',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 6,
      code: '400000',
      name: 'Product Sales Revenue',
      type: 'Operating Income',
      typeBadge: 'bg-[#F3E8FF] text-[#7E22CE]',
      currency: 'INR',
      balance: '₹ 42,90,000.00',
      status: 'Active',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 7,
      code: '500000',
      name: 'Cost of Goods Sold (Raw Materials)',
      type: 'Expense',
      typeBadge: 'bg-[#FDE8E8] text-[#991B1B]',
      currency: 'INR',
      balance: '₹ 18,60,000.00',
      status: 'Active',
      statusDot: 'bg-[#10B981]',
    },
  ];

  const [accounts, setAccounts] = useState(initialAccounts);

  useEffect(() => {
    let isMounted = true;
    const loadAccounts = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch('/api/accounts', { headers });
        if (res.ok) {
          const json = await res.json();
          if (json.accounts && Array.isArray(json.accounts) && json.accounts.length > 0) {
            const mapped = json.accounts.map((acc, idx) => {
              const bal = Number(acc.currentBalance || 0);
              const balStr = `₹ ${Math.abs(bal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
              const rawType = acc.type || 'asset';
              let typeLabel = 'Current Asset';
              let typeBadge = 'bg-[#EBF3FE] text-[#2563EB]';

              if (rawType.toLowerCase().includes('bank') || rawType.toLowerCase().includes('cash')) {
                typeLabel = 'Bank & Cash';
                typeBadge = 'bg-[#E5F7ED] text-[#1E7445]';
              } else if (rawType.toLowerCase().includes('liability') || rawType.toLowerCase().includes('payable')) {
                typeLabel = 'Current Liability';
                typeBadge = 'bg-[#FEF7EC] text-[#D97706]';
              } else if (rawType.toLowerCase().includes('income') || rawType.toLowerCase().includes('revenue')) {
                typeLabel = 'Operating Income';
                typeBadge = 'bg-[#E5F7ED] text-[#1E7445]';
              } else if (rawType.toLowerCase().includes('expense')) {
                typeLabel = 'Operating Expense';
                typeBadge = 'bg-[#FDE8E8] text-[#991B1B]';
              }

              return {
                id: acc._id || idx + 1,
                code: acc.code || `ACC-${String(idx + 1).padStart(4, '0')}`,
                name: acc.name,
                type: typeLabel,
                typeBadge,
                balance: balStr,
                currency: 'INR',
                status: acc.status === 'active' ? 'Active' : 'Inactive',
                statusDot: acc.status === 'active' ? 'bg-[#10B981]' : 'bg-[#D97706]'
              };
            });
            if (isMounted) setAccounts(mapped);
          }
        }
      } catch (err) {
        console.warn('Live accounts fetch failed:', err.message);
      }
    };
    loadAccounts();
    return () => { isMounted = false; };
  }, []);

  const [newAccountForm, setNewAccountForm] = useState({
    code: '',
    name: '',
    type: 'Current Asset',
    balance: '',
    currency: 'INR',
    status: 'Active',
  });

  const filterTabs = ['All', 'Bank & Cash', 'Current Asset', 'Current Liability', 'Operating Income', 'Expense'];

  const filteredAccounts = useMemo(() => {
    let result = [...accounts];
    if (activeFilterTab !== 'All') {
      result = result.filter((a) => a.type.toLowerCase() === activeFilterTab.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((a) =>
        a.code.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      return sortAsc ? a.id - b.id : b.id - a.id;
    });
    return result;
  }, [accounts, searchQuery, activeFilterTab, sortAsc]);

  const itemsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / itemsPerPage));
  const paginatedAccounts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAccounts.slice(start, start + itemsPerPage);
  }, [filteredAccounts, currentPage]);

  const handleOpenCreateModal = () => {
    if (onCreateAccount) {
      onCreateAccount();
    } else {
      setIsCreateModalOpen(true);
    }
  };

  const handleSaveAccount = (e) => {
    e.preventDefault();
    if (!newAccountForm.code || !newAccountForm.name || !newAccountForm.balance) return;

    const nextId = accounts.length + 1;
    let typeBadge = 'bg-[#E5F7ED] text-[#1E7445]';
    if (newAccountForm.type === 'Bank & Cash') typeBadge = 'bg-[#EBF3FE] text-[#2563EB]';
    else if (newAccountForm.type === 'Current Liability') typeBadge = 'bg-[#FEF7EC] text-[#D97706]';
    else if (newAccountForm.type === 'Operating Income') typeBadge = 'bg-[#F3E8FF] text-[#7E22CE]';
    else if (newAccountForm.type === 'Expense') typeBadge = 'bg-[#FDE8E8] text-[#991B1B]';

    const newEntry = {
      id: nextId,
      code: newAccountForm.code,
      name: newAccountForm.name,
      type: newAccountForm.type,
      typeBadge,
      currency: newAccountForm.currency,
      balance: newAccountForm.balance.startsWith('₹') ? newAccountForm.balance : `₹ ${newAccountForm.balance}`,
      status: newAccountForm.status,
      statusDot: newAccountForm.status === 'Active' ? 'bg-[#10B981]' : 'bg-[#F59E0B]',
    };

    setAccounts([newEntry, ...accounts]);
    setIsCreateModalOpen(false);
    setNewAccountForm({
      code: '',
      name: '',
      type: 'Current Asset',
      balance: '',
      currency: 'INR',
      status: 'Active',
    });
  };

  const handleToggleStatus = (accId) => {
    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id === accId) {
          const nextStatus = a.status === 'Active' ? 'Inactive' : 'Active';
          const nextDot = nextStatus === 'Active' ? 'bg-[#10B981]' : 'bg-[#F59E0B]';
          return { ...a, status: nextStatus, statusDot: nextDot };
        }
        return a;
      })
    );
    setActiveRowMenuId(null);
  };

  const handleViewAccountPdf = (acc) => {
    const pdfData = {
      type: 'ACCOUNT',
      title: 'CHART OF ACCOUNTS LEDGER EXTRACT',
      documentNo: `ACC-${acc.code}`,
      date: '02 Sep 2025',
      dueDate: 'Audited Snapshot',
      status: acc.status,
      partner: {
        name: acc.name,
        company: `Classification: ${acc.type}`,
        city: 'Ahmedabad, Gujarat',
      },
      tableData: {
        headers: ['Posting Date', 'Transaction Details', 'Account Type', 'Balance'],
        rows: [
          ['01 Sep 2025', 'Opening Balance Forward', acc.type, acc.balance],
          ['02 Sep 2025', 'Current Month System Reconciliation', 'Verified', acc.balance],
        ],
      },
      notes: `Verified Chart of Accounts balance in ${acc.currency} maintained under Indian Accounting Standards.`,
    };

    setSelectedPdfDoc(pdfData);
    setIsPdfModalOpen(true);
    setActiveRowMenuId(null);
  };

  const handleDownloadAccountPdfDirect = (acc) => {
    const pdfData = {
      type: 'ACCOUNT',
      title: 'CHART OF ACCOUNTS LEDGER EXTRACT',
      documentNo: `ACC-${acc.code}`,
      date: '02 Sep 2025',
      dueDate: 'Audited Snapshot',
      status: acc.status,
      partner: {
        name: acc.name,
        company: `Classification: ${acc.type}`,
        city: 'Ahmedabad, Gujarat',
      },
      tableData: {
        headers: ['Posting Date', 'Transaction Details', 'Account Type', 'Balance'],
        rows: [
          ['01 Sep 2025', 'Opening Balance Forward', acc.type, acc.balance],
          ['02 Sep 2025', 'Current Month System Reconciliation', 'Verified', acc.balance],
        ],
      },
      notes: `Verified Chart of Accounts balance in ${acc.currency} maintained under Indian Accounting Standards.`,
    };

    downloadDirectPdf(pdfData);
    setActiveRowMenuId(null);
  };

  const handleExportPdf = () => {
    const headers = ['Code', 'Account Name', 'Account Type', 'Currency', 'Current Balance', 'Status'];
    const rows = filteredAccounts.map((a) => [
      a.code,
      a.name,
      a.type,
      a.currency,
      a.balance,
      a.status,
    ]);

    const pdfData = createMasterRegisterPdfData('Chart of Accounts & General Ledger Schedule', headers, rows);
    downloadDirectPdf(pdfData);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-xs overflow-hidden transition-all duration-300">
      
      {/* 1. Header */}
      <div className="p-5 sm:p-6 border-b border-[#F0EAE1] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#F4EFE6] text-[#1C3A2F] flex items-center justify-center border border-[#E5DDD0] shadow-2xs shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#141A17] tracking-tight">
              Chart of Accounts & General Ledger
            </h2>
            <p className="text-xs text-[#6B7A74] mt-0.5">
              Complete double-entry accounting ledger and balance accounts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-[#8A9B93] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search accounts..."
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
            <span className="hidden sm:inline">Add Account</span>
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
              <th className="py-3.5 pl-6 pr-3">Code</th>
              <th className="py-3.5 px-3">Account Name</th>
              <th className="py-3.5 px-3">Account Type</th>
              <th className="py-3.5 px-3">Currency</th>
              <th className="py-3.5 px-3">Current Balance</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 pr-6 pl-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EAE1] text-xs text-[#141A17]">
            {paginatedAccounts.map((acc) => {
              const isMenuOpen = activeRowMenuId === acc.id;

              return (
                <tr key={acc.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3.5 pl-6 pr-3">
                    <button
                      type="button"
                      onClick={() => handleViewAccountPdf(acc)}
                      className="font-semibold text-[#1C3A2F] hover:underline font-mono inline-flex items-center gap-1.5 cursor-pointer text-left group"
                      title="Click to view account ledger schedule PDF"
                    >
                      <span>{acc.code}</span>
                      <FileText className="w-3 h-3 text-[#738C80] group-hover:text-[#1C3A2F]" />
                    </button>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-[#141A17]">
                    {acc.name}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${acc.typeBadge} shadow-2xs`}>
                      {acc.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-[#55665E]">{acc.currency}</td>
                  <td className="py-3.5 px-3 font-bold font-serif text-[#141A17]">{acc.balance}</td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E5F7ED] text-[#1E7445]">
                      <span className={`w-1.5 h-1.5 rounded-full ${acc.statusDot}`} />
                      <span>{acc.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 pr-6 pl-3 text-right">
                    <div className="flex items-center justify-end gap-1 relative">
                      <button 
                        type="button" 
                        onClick={() => handleDownloadAccountPdfDirect(acc)}
                        className="p-1.5 rounded-lg text-[#738C80] hover:text-[#1C3A2F] hover:bg-[#EAE4DC] transition-colors cursor-pointer"
                        title="Download Account Schedule PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setActiveRowMenuId(isMenuOpen ? null : acc.id)}
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
                            onClick={() => handleViewAccountPdf(acc)}
                            className="w-full px-3.5 py-2 text-xs text-[#141A17] hover:bg-[#FAF8F5] flex items-center gap-2 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#1C3A2F]" />
                            <span>View Ledger PDF</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadAccountPdfDirect(acc)}
                            className="w-full px-3.5 py-2 text-xs text-[#141A17] hover:bg-[#FAF8F5] flex items-center gap-2 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-[#1C3A2F]" />
                            <span>Download PDF</span>
                          </button>
                          <div className="border-t border-[#F0EAE1] my-1"></div>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(acc.id)}
                            className="w-full px-3.5 py-2 text-xs text-[#1C3A2F] font-semibold hover:bg-[#FAF8F5] flex items-center gap-2 cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{acc.status === 'Active' ? 'Mark Inactive' : 'Mark Active'}</span>
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
          Showing {filteredAccounts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
          {Math.min(currentPage * itemsPerPage, filteredAccounts.length)} of {filteredAccounts.length} accounts
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

      {/* Create Account Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-2xl max-w-md w-full overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-[#F0EAE1] flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1C3A2F] text-white flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury font-bold text-base text-[#141A17]">Add Ledger Account</h3>
                  <p className="text-[11px] text-[#6B7A74]">Create a new double-entry ledger head</p>
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

            <form onSubmit={handleSaveAccount} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#141A17] mb-1">Account Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 130000"
                    value={newAccountForm.code}
                    onChange={(e) => setNewAccountForm({ ...newAccountForm, code: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F] focus:ring-1 focus:ring-[#1C3A2F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141A17] mb-1">Account Type</label>
                  <select
                    value={newAccountForm.type}
                    onChange={(e) => setNewAccountForm({ ...newAccountForm, type: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                  >
                    <option value="Current Asset">Current Asset</option>
                    <option value="Bank & Cash">Bank & Cash</option>
                    <option value="Current Liability">Current Liability</option>
                    <option value="Operating Income">Operating Income</option>
                    <option value="Expense">Expense</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141A17] mb-1">Account Name / Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Showroom Lease Security Deposit"
                  value={newAccountForm.name}
                  onChange={(e) => setNewAccountForm({ ...newAccountForm, name: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#141A17] mb-1">Current Balance (INR)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 150000"
                    value={newAccountForm.balance}
                    onChange={(e) => setNewAccountForm({ ...newAccountForm, balance: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141A17] mb-1">Status</label>
                  <select
                    value={newAccountForm.status}
                    onChange={(e) => setNewAccountForm({ ...newAccountForm, status: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
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
                  Save Account
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

export default ChartOfAccountsTable;
