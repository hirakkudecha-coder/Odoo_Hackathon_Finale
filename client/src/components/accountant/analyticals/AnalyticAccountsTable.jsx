import React, { useState, useEffect, useMemo } from 'react';
import { 
  PieChart, 
  Search, 
  Plus, 
  Filter, 
  Download, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  TrendingDown,
  X,
  CheckCircle,
  Tag,
  FolderKanban,
  Edit2,
  Trash2
} from 'lucide-react';
import { ViewModeToggle } from '../../common/ViewModeToggle';
import { createMasterRegisterPdfData, downloadDirectPdf } from '../../../utils/pdfGenerator';

export const AnalyticAccountsTable = () => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'kanban'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeRowMenuId, setActiveRowMenuId] = useState(null);
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'Expenses',
    description: '',
    status: 'active'
  });

  const initialAnalyticAccounts = [
    {
      _id: 'ana-1',
      code: 'ANA-1001',
      name: 'Showroom Interior Fitting & Display',
      type: 'Expenses',
      description: 'CapEx and maintenance for physical retail showrooms.',
      balance: 145000,
      status: 'active'
    },
    {
      _id: 'ana-2',
      code: 'ANA-1002',
      name: 'Custom Residential Projects',
      type: 'Income',
      description: 'Turnkey architectural interior design contracts.',
      balance: 890000,
      status: 'active'
    },
    {
      _id: 'ana-3',
      code: 'ANA-1003',
      name: 'Raw Teak & Timber Procurement',
      type: 'Expenses',
      description: 'Sourcing timber logs, kiln drying, and processing.',
      balance: 320000,
      status: 'active'
    },
    {
      _id: 'ana-4',
      code: 'ANA-1004',
      name: 'Corporate Workspace Fitouts',
      type: 'Income',
      description: 'Commercial B2B office packages & institutional supply.',
      balance: 1250000,
      status: 'active'
    },
    {
      _id: 'ana-5',
      code: 'ANA-1005',
      name: 'Designer Atelier Marketing & PR',
      type: 'Expenses',
      description: 'Architectural expos, editorial campaigns, luxury events.',
      balance: 95000,
      status: 'active'
    },
    {
      _id: 'ana-6',
      code: 'ANA-1006',
      name: 'Freight & National Logistics',
      type: 'Expenses',
      description: 'Interstate transport, packaging, White-glove delivery.',
      balance: 78000,
      status: 'active'
    }
  ];

  const [analyticAccounts, setAnalyticAccounts] = useState(initialAnalyticAccounts);

  const fetchAnalyticAccounts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch('/api/analytic-accounts', { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.analyticAccounts && data.analyticAccounts.length > 0) {
          setAnalyticAccounts(data.analyticAccounts);
        }
      }
    } catch (e) {
      console.warn('Using local analytic accounts fallback:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticAccounts();
  }, []);

  const filteredAccounts = useMemo(() => {
    return analyticAccounts.filter((item) => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.code && item.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

      if (activeFilterTab === 'Income') return matchesSearch && item.type === 'Income';
      if (activeFilterTab === 'Expenses') return matchesSearch && (item.type === 'Expenses' || item.type === 'Expense');
      return matchesSearch;
    });
  }, [analyticAccounts, searchQuery, activeFilterTab]);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage) || 1;
  const paginatedAccounts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAccounts.slice(start, start + itemsPerPage);
  }, [filteredAccounts, currentPage]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      code: `ANA-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'Expenses',
      description: '',
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      code: item.code || '',
      type: item.type === 'Income' ? 'Income' : 'Expenses',
      description: item.description || '',
      status: item.status || 'active'
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };

      if (editingItem) {
        // Update
        const updatedList = analyticAccounts.map(acc => 
          acc._id === editingItem._id ? { ...acc, ...formData } : acc
        );
        setAnalyticAccounts(updatedList);
        await fetch(`/api/analytic-accounts/${editingItem._id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(formData)
        }).catch(() => {});
        setNotification({ type: 'success', text: `Analytic account "${formData.name}" updated.` });
      } else {
        // Create
        const newItem = {
          _id: `ana-${Date.now()}`,
          ...formData,
          balance: 0
        };
        setAnalyticAccounts([newItem, ...analyticAccounts]);
        await fetch('/api/analytic-accounts', {
          method: 'POST',
          headers,
          body: JSON.stringify(formData)
        }).catch(() => {});
        setNotification({ type: 'success', text: `Analytic account "${formData.name}" created.` });
      }

      setIsModalOpen(false);
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setNotification({ type: 'error', text: 'Error saving analytic account.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this analytic account?')) return;
    setAnalyticAccounts(prev => prev.filter(a => a._id !== id));
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/analytic-accounts/${id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      setNotification({ type: 'success', text: 'Analytic account deleted.' });
      setTimeout(() => setNotification(null), 3000);
    } catch (e) {}
  };

  const handleExportPDF = () => {
    const pdfData = createMasterRegisterPdfData(
      'Analytic Accounts Master Register',
      [
        { header: 'Code', dataKey: 'code' },
        { header: 'Account Name', dataKey: 'name' },
        { header: 'Type', dataKey: 'type' },
        { header: 'Description', dataKey: 'description' },
        { header: 'Status', dataKey: 'status' }
      ],
      filteredAccounts.map(a => ({
        code: a.code || '-',
        name: a.name,
        type: a.type,
        description: a.description || '-',
        status: a.status || 'Active'
      }))
    );
    downloadDirectPdf(pdfData, 'Analytic_Accounts_Register.pdf');
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
              Analytic Accounts (Analyticals)
            </h2>
            <p className="text-xs text-[#61726A]">
              Manage cost centers, income projects, and departmental budget tracking accounts
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
              <span>Add Analytic Account</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-[#EFE9E0]">
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-xl border border-[#E5DFD5]">
            {['All', 'Income', 'Expenses'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => { setActiveFilterTab(tab); setCurrentPage(1); }}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
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
              placeholder="Search code, name, description..."
              className="w-full bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl pl-8.5 pr-3 py-1.5 text-xs text-[#141A17] placeholder-[#8C9B93] focus:outline-hidden focus:border-[#2D4A3E]"
            />
          </div>
        </div>
      </div>

      {/* VIEW: KANBAN MODE */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedAccounts.map((account) => {
            const isIncome = account.type === 'Income';
            return (
              <div 
                key={account._id}
                className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E5DFD5] font-mono text-[11px] font-bold text-[#2D4A3E]">
                      {account.code || 'ANA-AUTO'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold flex items-center gap-1 ${
                      isIncome 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {isIncome ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {account.type}
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-[#141A17] group-hover:text-[#2D4A3E] transition-colors line-clamp-2">
                    {account.name}
                  </h3>
                  <p className="text-xs text-[#6E7E76] line-clamp-2 min-h-[32px]">
                    {account.description || 'Dedicated analytic ledger unit for tracking revenue and expenditure transactions.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A9991] block">
                      Activity Balance
                    </span>
                    <span className="text-sm font-bold text-[#141A17]">
                      ₹ {Number(account.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(account)}
                      className="p-1.5 rounded-lg text-[#52645B] hover:bg-[#F5EFE6] hover:text-[#1E2623] transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(account._id)}
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
                  <th className="py-3 px-4">Analytic Account Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-right">Recorded Balance</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE9E0] text-xs text-[#141A17]">
                {paginatedAccounts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-[#7E8E86]">
                      No analytic accounts found matching your query.
                    </td>
                  </tr>
                ) : (
                  paginatedAccounts.map((account) => {
                    const isIncome = account.type === 'Income';
                    return (
                      <tr key={account._id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-semibold text-[#2D4A3E]">
                          {account.code || '-'}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#141A17]">
                          {account.name}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold inline-flex items-center gap-1 ${
                            isIncome 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {isIncome ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {account.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#66776F] max-w-xs truncate">
                          {account.description || '-'}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-[#141A17]">
                          ₹ {Number(account.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#E5F7ED] text-[#1E7445]">
                            {account.status || 'Active'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(account)}
                              className="p-1.5 rounded-lg text-[#52645B] hover:bg-[#F2ECE4] hover:text-[#1E2623] cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(account._id)}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

          {/* Pagination */}
          <div className="p-4 border-t border-[#E8E2D9] flex items-center justify-between text-xs text-[#6B7C74]">
            <span>
              Showing {filteredAccounts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredAccounts.length)} of {filteredAccounts.length} accounts
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

      {/* CREATE / EDIT ANALYTIC ACCOUNT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E2DAD0] shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE9E0]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#2D4A3E] text-[#FAF8F5] flex items-center justify-center font-bold">
                  <PieChart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#141A17]">
                    {editingItem ? 'Edit Analytic Account' : 'New Analytic Account'}
                  </h3>
                  <p className="text-xs text-[#6C7C74]">Enter master details for budget & analytics mapping</p>
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
                    Account Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g. ANA-1001"
                    className="w-full bg-[#FAF8F5] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs font-mono text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#141A17] mb-1">
                    Analytic Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs font-bold text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]"
                  >
                    <option value="Expenses">Expenses (Cost Center)</option>
                    <option value="Income">Income (Revenue Center)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141A17] mb-1">
                  Analytic Account Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Showroom Fitouts or Corporate Projects"
                  className="w-full bg-[#FAF8F5] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141A17] mb-1">
                  Description / Tracking Purpose
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe projects, vendors, or invoice lines assigned to this account..."
                  className="w-full bg-[#FAF8F5] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]"
                />
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
                  {editingItem ? 'Save Changes' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticAccountsTable;
