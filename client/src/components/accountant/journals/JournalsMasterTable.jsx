import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Download, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  CheckCircle,
  Landmark,
  Wallet,
  ShoppingCart,
  ShoppingBag,
  FileSpreadsheet
} from 'lucide-react';
import { ViewModeToggle } from '../../common/ViewModeToggle';
import { createMasterRegisterPdfData, downloadDirectPdf } from '../../../utils/pdfGenerator';

export const JournalsMasterTable = () => {
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'Sales',
    defaultDebitAccount: '',
    defaultCreditAccount: '',
    status: 'active'
  });

  const initialJournals = [
    {
      _id: 'jrn-1',
      code: 'INV',
      name: 'Customer Invoices (Sales)',
      type: 'Sales',
      defaultDebitAccount: { _id: 'acc-1', code: '1100', name: 'Accounts Receivable' },
      defaultCreditAccount: { _id: 'acc-2', code: '4000', name: 'Furniture Sales Revenue' },
      status: 'active'
    },
    {
      _id: 'jrn-2',
      code: 'BILL',
      name: 'Vendor Bills (Purchases)',
      type: 'Purchase',
      defaultDebitAccount: { _id: 'acc-3', code: '5100', name: 'Raw Material Purchases' },
      defaultCreditAccount: { _id: 'acc-4', code: '2000', name: 'Accounts Payable' },
      status: 'active'
    },
    {
      _id: 'jrn-3',
      code: 'HDFC',
      name: 'HDFC Bank Current Account',
      type: 'Bank',
      defaultDebitAccount: { _id: 'acc-5', code: '1010', name: 'HDFC Bank Main Account' },
      defaultCreditAccount: { _id: 'acc-5', code: '1010', name: 'HDFC Bank Main Account' },
      status: 'active'
    },
    {
      _id: 'jrn-4',
      code: 'CSH',
      name: 'Cash Register on Hand',
      type: 'Cash',
      defaultDebitAccount: { _id: 'acc-6', code: '1000', name: 'Petty Cash on Hand' },
      defaultCreditAccount: { _id: 'acc-6', code: '1000', name: 'Petty Cash on Hand' },
      status: 'active'
    },
    {
      _id: 'jrn-5',
      code: 'GEN',
      name: 'General / Adjustment Journal',
      type: 'General',
      defaultDebitAccount: { _id: 'acc-7', code: '3100', name: 'Retained Earnings' },
      defaultCreditAccount: { _id: 'acc-7', code: '3100', name: 'Retained Earnings' },
      status: 'active'
    }
  ];

  const [journals, setJournals] = useState(initialJournals);

  const fetchJournalsAndAccounts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const [jrnRes, accRes] = await Promise.all([
        fetch('/api/journals', { headers }).catch(() => null),
        fetch('/api/accounts', { headers }).catch(() => null)
      ]);

      if (jrnRes && jrnRes.ok) {
        const jrnData = await jrnRes.json();
        if (jrnData.journals && jrnData.journals.length > 0) {
          setJournals(jrnData.journals);
        }
      }

      if (accRes && accRes.ok) {
        const accData = await accRes.json();
        if (accData.accounts) {
          setAccounts(accData.accounts);
        }
      } else {
        // Fallback default CoA for mapping
        setAccounts([
          { _id: 'acc-1', code: '1100', name: 'Accounts Receivable', type: 'Asset' },
          { _id: 'acc-2', code: '4000', name: 'Furniture Sales Revenue', type: 'Income' },
          { _id: 'acc-3', code: '5100', name: 'Raw Material Purchases', type: 'Expense' },
          { _id: 'acc-4', code: '2000', name: 'Accounts Payable', type: 'Liability' },
          { _id: 'acc-5', code: '1010', name: 'HDFC Bank Main Account', type: 'Asset' },
          { _id: 'acc-6', code: '1000', name: 'Petty Cash on Hand', type: 'Asset' },
          { _id: 'acc-7', code: '3100', name: 'Retained Earnings', type: 'Capital' }
        ]);
      }
    } catch (e) {
      console.warn('Error fetching journals master:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournalsAndAccounts();
  }, []);

  const filteredJournals = useMemo(() => {
    return journals.filter(j => {
      const matchesSearch = 
        j.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.code.toLowerCase().includes(searchQuery.toLowerCase());
      if (activeFilterTab !== 'All' && j.type !== activeFilterTab) return false;
      return matchesSearch;
    });
  }, [journals, searchQuery, activeFilterTab]);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredJournals.length / itemsPerPage) || 1;
  const paginatedJournals = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredJournals.slice(start, start + itemsPerPage);
  }, [filteredJournals, currentPage]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      code: '',
      name: '',
      type: 'Sales',
      defaultDebitAccount: accounts[0]?._id || '',
      defaultCreditAccount: accounts[1]?._id || '',
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      type: item.type,
      defaultDebitAccount: item.defaultDebitAccount?._id || item.defaultDebitAccount || '',
      defaultCreditAccount: item.defaultCreditAccount?._id || item.defaultCreditAccount || '',
      status: item.status || 'active'
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.name.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };

      const selectedDebit = accounts.find(a => a._id === formData.defaultDebitAccount);
      const selectedCredit = accounts.find(a => a._id === formData.defaultCreditAccount);

      if (editingItem) {
        const updated = journals.map(j => 
          j._id === editingItem._id 
            ? { ...j, ...formData, defaultDebitAccount: selectedDebit || j.defaultDebitAccount, defaultCreditAccount: selectedCredit || j.defaultCreditAccount } 
            : j
        );
        setJournals(updated);
        await fetch(`/api/journals/${editingItem._id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(formData)
        }).catch(() => {});
        setNotification({ type: 'success', text: `Journal "${formData.name}" updated successfully.` });
      } else {
        const newJrn = {
          _id: `jrn-${Date.now()}`,
          ...formData,
          code: formData.code.toUpperCase(),
          defaultDebitAccount: selectedDebit,
          defaultCreditAccount: selectedCredit
        };
        setJournals([newJrn, ...journals]);
        await fetch('/api/journals', {
          method: 'POST',
          headers,
          body: JSON.stringify(formData)
        }).catch(() => {});
        setNotification({ type: 'success', text: `Journal "${formData.name}" created.` });
      }

      setIsModalOpen(false);
      setTimeout(() => setNotification(null), 3000);
    } catch (e) {
      setNotification({ type: 'error', text: 'Failed to save journal.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this journal?')) return;
    setJournals(prev => prev.filter(j => j._id !== id));
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/journals/${id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      setNotification({ type: 'success', text: 'Journal deleted.' });
      setTimeout(() => setNotification(null), 3000);
    } catch (e) {}
  };

  const getJournalIcon = (type) => {
    switch (type) {
      case 'Sales': return <ShoppingCart className="w-4 h-4 text-emerald-600" />;
      case 'Purchase': return <ShoppingBag className="w-4 h-4 text-amber-600" />;
      case 'Bank': return <Landmark className="w-4 h-4 text-blue-600" />;
      case 'Cash': return <Wallet className="w-4 h-4 text-teal-600" />;
      default: return <BookOpen className="w-4 h-4 text-purple-600" />;
    }
  };

  const handleExportPDF = () => {
    const pdfData = createMasterRegisterPdfData(
      'Journals Master Register',
      [
        { header: 'Code', dataKey: 'code' },
        { header: 'Journal Name', dataKey: 'name' },
        { header: 'Type', dataKey: 'type' },
        { header: 'Default Debit Account', dataKey: 'debit' },
        { header: 'Default Credit Account', dataKey: 'credit' }
      ],
      filteredJournals.map(j => ({
        code: j.code,
        name: j.name,
        type: j.type,
        debit: j.defaultDebitAccount?.name ? `${j.defaultDebitAccount.code} - ${j.defaultDebitAccount.name}` : '-',
        credit: j.defaultCreditAccount?.name ? `${j.defaultCreditAccount.code} - ${j.defaultCreditAccount.name}` : '-'
      }))
    );
    downloadDirectPdf(pdfData, 'Journals_Master_Register.pdf');
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {notification && (
        <div className={`p-3 rounded-xl border flex items-center justify-between text-xs animate-fadeIn ${
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

      {/* Header & Controls */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#141A17] tracking-tight">
              Journals Master
            </h2>
            <p className="text-xs text-[#61726A]">
              Configure transaction ledgers (Sales, Purchase, Bank, Cash) and default Chart of Accounts mappings
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
            <button
              type="button"
              onClick={handleExportPDF}
              className="px-3 py-1.5 rounded-xl border border-[#DDD5C7] text-xs font-semibold text-[#3D4C44] hover:bg-[#FAF8F5] flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-3.5 py-1.5 rounded-xl bg-[#2D4A3E] text-[#FAF8F5] text-xs font-semibold hover:bg-[#233A31] flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Journal</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-[#EFE9E0]">
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-xl border border-[#E5DFD5] overflow-x-auto">
            {['All', 'Sales', 'Purchase', 'Bank', 'Cash', 'General'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => { setActiveFilterTab(tab); setCurrentPage(1); }}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeFilterTab === tab
                    ? 'bg-[#2D4A3E] text-[#FAF8F5] shadow-xs'
                    : 'text-[#61726A] hover:text-[#1E2623]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C9B93]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search code or name..."
              className="w-full bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl pl-8.5 pr-3 py-1.5 text-xs text-[#141A17] placeholder-[#8C9B93] focus:outline-hidden focus:border-[#2D4A3E]"
            />
          </div>
        </div>
      </div>

      {/* VIEW: KANBAN MODE */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedJournals.map((journal) => {
            return (
              <div 
                key={journal._id}
                className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E5DFD5] font-mono text-xs font-bold text-[#2D4A3E]">
                      {journal.code}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#F2EDE6] text-[#2D4A3E] border border-[#E2DAD0] flex items-center gap-1.5">
                      {getJournalIcon(journal.type)}
                      <span>{journal.type}</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-[#141A17] group-hover:text-[#2D4A3E] transition-colors">
                    {journal.name}
                  </h3>

                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="bg-[#FAF8F5] p-2 rounded-xl border border-[#EBE5DC]">
                      <span className="text-[10px] font-bold uppercase text-[#889890] block">
                        Default Debit Account
                      </span>
                      <span className="font-semibold text-[#141A17] truncate block">
                        {journal.defaultDebitAccount?.code ? `${journal.defaultDebitAccount.code} - ${journal.defaultDebitAccount.name}` : 'Not Assigned'}
                      </span>
                    </div>

                    <div className="bg-[#FAF8F5] p-2 rounded-xl border border-[#EBE5DC]">
                      <span className="text-[10px] font-bold uppercase text-[#889890] block">
                        Default Credit Account
                      </span>
                      <span className="font-semibold text-[#141A17] truncate block">
                        {journal.defaultCreditAccount?.code ? `${journal.defaultCreditAccount.code} - ${journal.defaultCreditAccount.name}` : 'Not Assigned'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#E5F7ED] text-[#1E7445]">
                    Active
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(journal)}
                      className="p-1.5 rounded-lg text-[#52645B] hover:bg-[#F5EFE6] hover:text-[#1E2623] transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(journal._id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VIEW: LIST TABLE MODE */
        <div className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E8E2D9] text-[11px] font-bold text-[#55655D] uppercase tracking-wider">
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Journal Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Default Debit Account (CoA)</th>
                  <th className="py-3 px-4">Default Credit Account (CoA)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE9E0] text-xs text-[#141A17]">
                {paginatedJournals.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-[#7E8E86]">
                      No journals found.
                    </td>
                  </tr>
                ) : (
                  paginatedJournals.map((journal) => (
                    <tr key={journal._id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#2D4A3E]">
                        {journal.code}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#141A17]">
                        {journal.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#F2EDE6] text-[#2D4A3E] border border-[#E2DAD0] inline-flex items-center gap-1.5">
                          {getJournalIcon(journal.type)}
                          <span>{journal.type}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#3A4A42]">
                        {journal.defaultDebitAccount?.name 
                          ? `${journal.defaultDebitAccount.code} - ${journal.defaultDebitAccount.name}` 
                          : <span className="text-gray-400 italic">Unassigned</span>}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#3A4A42]">
                        {journal.defaultCreditAccount?.name 
                          ? `${journal.defaultCreditAccount.code} - ${journal.defaultCreditAccount.name}` 
                          : <span className="text-gray-400 italic">Unassigned</span>}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#E5F7ED] text-[#1E7445]">
                          Active
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(journal)}
                            className="p-1.5 rounded-lg text-[#52645B] hover:bg-[#F2ECE4] hover:text-[#1E2623] cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(journal._id)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-[#E8E2D9] flex items-center justify-between text-xs text-[#6B7C74]">
            <span>
              Showing {filteredJournals.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredJournals.length)} of {filteredJournals.length} journals
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 rounded-lg border border-[#DDD5C7] disabled:opacity-40 hover:bg-[#FAF8F5] cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 font-bold text-[#141A17]">{currentPage} of {totalPages}</span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1.5 rounded-lg border border-[#DDD5C7] disabled:opacity-40 hover:bg-[#FAF8F5] cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT JOURNAL MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E2DAD0] shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE9E0]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#2D4A3E] text-[#FAF8F5] flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#141A17]">
                    {editingItem ? 'Edit Journal' : 'New Journal'}
                  </h3>
                  <p className="text-xs text-[#6C7C74]">Configure accounting ledger & CoA default mapping</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-[#889890] hover:text-[#1E2623] hover:bg-[#FAF8F5] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#141A17] mb-1">
                    Journal Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. INV, BILL, HDFC"
                    className="w-full bg-[#FAF8F5] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs font-mono uppercase text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#141A17] mb-1">
                    Journal Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs font-bold text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]"
                  >
                    <option value="Sales">Sales</option>
                    <option value="Purchase">Purchase</option>
                    <option value="Bank">Bank</option>
                    <option value="Cash">Cash</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141A17] mb-1">
                  Journal Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Customer Invoices, ICICI Bank"
                  className="w-full bg-[#FAF8F5] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]"
                />
              </div>

              {/* Chart of Accounts Mappings */}
              <div className="space-y-3 pt-1 border-t border-[#EFE9E0]">
                <span className="text-xs font-bold text-[#2D4A3E] block">
                  Default Chart of Accounts Mapping
                </span>

                <div>
                  <label className="block text-[11px] font-semibold text-[#55635D] mb-1">
                    Default Debit Account
                  </label>
                  <select
                    value={formData.defaultDebitAccount}
                    onChange={(e) => setFormData({ ...formData, defaultDebitAccount: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#DDD5C7] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]"
                  >
                    <option value="">-- Select Debit Account --</option>
                    {accounts.map(acc => (
                      <option key={acc._id} value={acc._id}>
                        {acc.code} - {acc.name} ({acc.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#55635D] mb-1">
                    Default Credit Account
                  </label>
                  <select
                    value={formData.defaultCreditAccount}
                    onChange={(e) => setFormData({ ...formData, defaultCreditAccount: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#DDD5C7] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]"
                  >
                    <option value="">-- Select Credit Account --</option>
                    {accounts.map(acc => (
                      <option key={acc._id} value={acc._id}>
                        {acc.code} - {acc.name} ({acc.type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#DDD5C7] text-xs font-semibold text-[#55635D] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2D4A3E] text-[#FAF8F5] text-xs font-semibold hover:bg-[#233A31] shadow-xs cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Create Journal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalsMasterTable;
