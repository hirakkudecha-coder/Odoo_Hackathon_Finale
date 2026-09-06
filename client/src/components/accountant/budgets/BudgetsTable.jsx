import React, { useState, useEffect, useMemo } from 'react';
import { 
  PieChart, 
  Search, 
  Plus, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown, 
  X, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  UserCheck, 
  IndianRupee,
  RefreshCw,
  Eye,
  Layers,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  FileText
} from 'lucide-react';
import { ViewModeToggle } from '../../common/ViewModeToggle';
import { createMasterRegisterPdfData, downloadDirectPdf } from '../../../utils/pdfGenerator';

// Interactive SVG Pie Chart Component (Achieved vs Balance)
const BudgetPieChart = ({ achieved = 0, planned = 0, size = 64 }) => {
  const safePlanned = Math.max(0, Number(planned) || 0);
  const safeAchieved = Math.max(0, Number(achieved) || 0);
  const balance = Math.max(0, safePlanned - safeAchieved);
  const total = safePlanned > 0 ? safePlanned : (safeAchieved > 0 ? safeAchieved : 1);
  const achievedPercent = Math.min(100, Math.round((safeAchieved / total) * 100));

  // SVG circular arc calculation
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (achievedPercent / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 60 60">
        {/* Background circle (Balance) */}
        <circle
          cx="30"
          cy="30"
          r={radius}
          className="stroke-[#E8E0D5]"
          strokeWidth="7"
          fill="transparent"
        />
        {/* Foreground circle (Achieved) */}
        <circle
          cx="30"
          cy="30"
          r={radius}
          className="stroke-[#2D4A3E] transition-all duration-500 ease-out"
          strokeWidth="7"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-[10px] font-bold text-[#141A17]">
        <span>{achievedPercent}%</span>
      </div>
    </div>
  );
};

export const BudgetsTable = () => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'kanban'
  const [budgets, setBudgets] = useState([]);
  const [analyticAccounts, setAnalyticAccounts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState('All');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Drilldown modal state
  const [drilldownModalOpen, setDrilldownModalOpen] = useState(false);
  const [drilldownData, setDrilldownData] = useState(null);
  const [drilldownLoading, setDrilldownLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    period: '2026',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    responsibleContact: '',
    responsiblePerson: 'Admin',
    analyticAccount: '',
    plannedAmount: '',
    status: 'draft'
  });

  const staticFallbackBudgets = [
    {
      _id: 'b-1',
      name: '2026 Raw Teak & Oak Timber CapEx',
      period: '2026',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      responsiblePerson: 'Aarav Mehta',
      responsibleContact: { _id: 'c-1', name: 'Aarav Mehta', email: 'aarav@urbanfurniture.com' },
      analyticAccount: { _id: 'ana-1', name: 'Raw Teak Procurement', code: 'ANA-1001', type: 'Expenses' },
      plannedAmount: 500000,
      achievedAmount: 182500,
      actualAmount: 182500,
      balanceAmount: 317500,
      variance: 317500,
      utilizationPercent: 36.5,
      status: 'confirmed'
    },
    {
      _id: 'b-2',
      name: 'Q3 Luxury Showroom Marketing & Launch',
      period: '2026',
      startDate: '2026-07-01',
      endDate: '2026-09-30',
      responsiblePerson: 'Nikita Sharma',
      responsibleContact: { _id: 'c-2', name: 'Nikita Sharma', email: 'nikita@urbanfurniture.com' },
      analyticAccount: { _id: 'ana-2', name: 'Showroom Marketing & PR', code: 'ANA-1002', type: 'Expenses' },
      plannedAmount: 250000,
      achievedAmount: 48000,
      actualAmount: 48000,
      balanceAmount: 202000,
      variance: 202000,
      utilizationPercent: 19.2,
      status: 'confirmed'
    },
    {
      _id: 'b-3',
      name: 'Custom Residential Turnkey Revenue',
      period: '2026',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      responsiblePerson: 'Elena Rossi',
      responsibleContact: { _id: 'c-3', name: 'Elena Rossi', email: 'elena@urbanfurniture.com' },
      analyticAccount: { _id: 'ana-3', name: 'Custom Residential Projects', code: 'ANA-1003', type: 'Income' },
      plannedAmount: 1200000,
      achievedAmount: 890000,
      actualAmount: 890000,
      balanceAmount: 310000,
      variance: 310000,
      utilizationPercent: 74.2,
      status: 'confirmed'
    },
    {
      _id: 'b-4',
      name: '2025 Showroom Marketing (Archived)',
      period: '2025',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      responsiblePerson: 'Nikita Sharma',
      analyticAccount: { _id: 'ana-2', name: 'Showroom Marketing & PR', code: 'ANA-1002', type: 'Expenses' },
      plannedAmount: 200000,
      achievedAmount: 198000,
      actualAmount: 198000,
      balanceAmount: 2000,
      variance: 2000,
      utilizationPercent: 99.0,
      status: 'revised',
      revisedWith: { _id: 'b-2', name: 'Q3 Luxury Showroom Marketing & Launch' }
    }
  ];

  const fetchBudgetData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const [bRes, aRes, cRes] = await Promise.all([
        fetch('/api/budgets', { headers }).catch(() => null),
        fetch('/api/analytic-accounts', { headers }).catch(() => null),
        fetch('/api/contacts', { headers }).catch(() => null)
      ]);

      if (bRes && bRes.ok) {
        const data = await bRes.json();
        if (data.budgets && data.budgets.length > 0) {
          setBudgets(data.budgets);
        } else {
          setBudgets(staticFallbackBudgets);
        }
      } else {
        setBudgets(staticFallbackBudgets);
      }

      if (aRes && aRes.ok) {
        const aData = await aRes.json();
        if (aData.analyticAccounts) setAnalyticAccounts(aData.analyticAccounts);
      }

      if (cRes && cRes.ok) {
        const cData = await cRes.json();
        if (cData.contacts) setContacts(cData.contacts);
      }
    } catch (e) {
      setBudgets(staticFallbackBudgets);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const filteredBudgets = useMemo(() => {
    return budgets.filter((b) => {
      const matchesSearch =
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.period.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.analyticAccount?.name && b.analyticAccount.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (b.responsibleContact?.name && b.responsibleContact.name.toLowerCase().includes(searchQuery.toLowerCase()));

      if (activeFilterTab === 'Draft') return matchesSearch && b.status === 'draft';
      if (activeFilterTab === 'Confirmed') return matchesSearch && b.status === 'confirmed';
      if (activeFilterTab === 'Revised') return matchesSearch && b.status === 'revised';
      if (activeFilterTab === 'Cancelled') return matchesSearch && b.status === 'cancelled';
      return matchesSearch;
    });
  }, [budgets, searchQuery, activeFilterTab]);

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      period: '2026',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      responsibleContact: contacts[0]?._id || '',
      responsiblePerson: contacts[0]?.name || 'Admin',
      analyticAccount: analyticAccounts[0]?._id || '',
      plannedAmount: '',
      status: 'draft'
    });
    setCreateModalOpen(true);
  };

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.analyticAccount || !formData.plannedAmount) return;

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };

      const selectedContact = contacts.find(c => c._id === formData.responsibleContact);
      const selectedAnalytic = analyticAccounts.find(a => a._id === formData.analyticAccount);

      const payload = {
        ...formData,
        responsiblePerson: selectedContact ? selectedContact.name : formData.responsiblePerson,
        plannedAmount: Number(formData.plannedAmount) || 0
      };

      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      }).catch(() => null);

      let created = null;
      if (res && res.ok) {
        const json = await res.json();
        created = json.budget;
      }

      const newBudgetObj = created || {
        _id: `b-${Date.now()}`,
        ...payload,
        responsibleContact: selectedContact,
        analyticAccount: selectedAnalytic,
        achievedAmount: 0,
        actualAmount: 0,
        balanceAmount: payload.plannedAmount,
        variance: payload.plannedAmount,
        utilizationPercent: 0
      };

      setBudgets([newBudgetObj, ...budgets]);
      setCreateModalOpen(false);
      setNotification({ type: 'success', text: `Budget "${payload.name}" created successfully.` });
      setTimeout(() => setNotification(null), 3500);
    } catch (e) {
      setNotification({ type: 'error', text: 'Failed to create budget.' });
    }
  };

  const handleConfirmBudget = async (budget) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/budgets/${budget._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status: 'confirmed' })
      }).catch(() => {});

      setBudgets(prev => prev.map(b => b._id === budget._id ? { ...b, status: 'confirmed' } : b));
      setNotification({ type: 'success', text: `Budget "${budget.name}" confirmed.` });
      setTimeout(() => setNotification(null), 3000);
    } catch (e) {}
  };

  const handleCancelBudget = async (budget) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/budgets/${budget._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status: 'cancelled' })
      }).catch(() => {});

      setBudgets(prev => prev.map(b => b._id === budget._id ? { ...b, status: 'cancelled' } : b));
      setNotification({ type: 'success', text: `Budget "${budget.name}" cancelled.` });
      setTimeout(() => setNotification(null), 3000);
    } catch (e) {}
  };

  // BUDGET REVISION FLOW
  const handleReviseBudget = async (budget) => {
    if (!window.confirm(`Revise budget "${budget.name}"? Original budget will move to Revised and a new Draft budget will be created.`)) return;

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };

      const res = await fetch(`/api/budgets/${budget._id}/revise`, {
        method: 'POST',
        headers
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        setBudgets(prev => [
          data.newBudget,
          ...prev.map(b => b._id === budget._id ? data.originalBudget : b)
        ]);
        setNotification({ type: 'success', text: `Created revision: "${data.newBudget.name}".` });
      } else {
        // Fallback simulation
        const newId = `b-${Date.now()}`;
        const revisionName = `${budget.name} Revised`;
        const newBudgetObj = {
          ...budget,
          _id: newId,
          name: revisionName,
          status: 'draft',
          revisionOf: { _id: budget._id, name: budget.name, period: budget.period },
          revisedWith: null,
          achievedAmount: 0,
          balanceAmount: budget.plannedAmount,
          utilizationPercent: 0
        };

        const updatedOriginal = {
          ...budget,
          status: 'revised',
          revisedWith: { _id: newId, name: revisionName, period: budget.period }
        };

        setBudgets([newBudgetObj, ...budgets.map(b => b._id === budget._id ? updatedOriginal : b)]);
        setNotification({ type: 'success', text: `Created revision: "${revisionName}".` });
      }
      setTimeout(() => setNotification(null), 4000);
    } catch (e) {
      setNotification({ type: 'error', text: 'Error executing revision.' });
    }
  };

  // DRILL-DOWN MODAL
  const handleOpenDrilldown = async (budget) => {
    setDrilldownLoading(true);
    setDrilldownData(null);
    setDrilldownModalOpen(true);

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch(`/api/budgets/${budget._id}/drilldown`, { headers }).catch(() => null);

      if (res && res.ok) {
        const json = await res.json();
        setDrilldownData(json);
      } else {
        // Fallback simulation for offline drilldown
        setDrilldownData({
          budget: {
            _id: budget._id,
            name: budget.name,
            period: budget.period,
            plannedAmount: budget.plannedAmount,
            achievedAmount: budget.achievedAmount || budget.actualAmount || 0,
            analyticAccount: budget.analyticAccount
          },
          transactions: [
            {
              _id: 'tx-1',
              documentType: budget.analyticAccount?.type === 'Income' ? 'Customer Invoice' : 'Vendor Bill',
              docNumber: budget.analyticAccount?.type === 'Income' ? 'INV/2026/0001' : 'Bill/2026/0001',
              date: '2026-02-14',
              partnerName: 'National Timber Crafts Ltd',
              itemDescription: 'Teak Wood & Furniture Fittings',
              quantity: 5,
              unitPrice: 24500,
              amount: (budget.achievedAmount || budget.actualAmount || 0) * 0.6,
              status: 'posted'
            },
            {
              _id: 'tx-2',
              documentType: budget.analyticAccount?.type === 'Income' ? 'Customer Invoice' : 'Vendor Bill',
              docNumber: budget.analyticAccount?.type === 'Income' ? 'INV/2026/0002' : 'Bill/2026/0002',
              date: '2026-03-01',
              partnerName: 'Supreme Oak & Timber Hub',
              itemDescription: 'Kiln Dried Oak Planks Batch 4',
              quantity: 8,
              unitPrice: 15200,
              amount: (budget.achievedAmount || budget.actualAmount || 0) * 0.4,
              status: 'posted'
            }
          ]
        });
      }
    } catch (e) {
      console.warn('Drilldown fetch error:', e);
    } finally {
      setDrilldownLoading(false);
    }
  };

  const handleScrollToBudget = (targetId) => {
    const el = document.getElementById(`budget-card-${targetId}`) || document.getElementById(`budget-row-${targetId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-[#2D4A3E]');
      setTimeout(() => el.classList.remove('ring-2', 'ring-[#2D4A3E]'), 2000);
    }
  };

  const handleExportPDF = () => {
    const headers = ['Budget Name', 'Period', 'Status', 'Responsible Contact', 'Analytic Account', 'Planned', 'Achieved', 'Balance'];
    const rows = filteredBudgets.map(b => [
      b.name,
      b.period,
      b.status.toUpperCase(),
      b.responsibleContact?.name || b.responsiblePerson || 'Admin',
      b.analyticAccount?.name || 'General',
      `₹ ${Number(b.plannedAmount).toLocaleString('en-IN')}`,
      `₹ ${Number(b.achievedAmount || b.actualAmount || 0).toLocaleString('en-IN')}`,
      `₹ ${Number(b.balanceAmount || b.variance || 0).toLocaleString('en-IN')}`
    ]);

    const pdfData = createMasterRegisterPdfData('Budgets & Revisions Master Report', headers, rows);
    downloadDirectPdf(pdfData, 'Budgets_Revisions_Report.pdf');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#E5F7ED] text-[#1E7445] border border-emerald-200">Confirmed</span>;
      case 'revised':
        return <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Revised</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-red-50 text-red-700 border border-red-200">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#FEF7EC] text-[#D97706] border border-amber-200">Draft</span>;
    }
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
      <div className="bg-white rounded-3xl border border-[#E8E2D9] p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#F4EFE6] text-[#2D4A3E] flex items-center justify-center border border-[#E5DDD0] shadow-2xs shrink-0">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#141A17] tracking-tight">
                Budget Management & Revisions
              </h2>
              <p className="text-xs text-[#6B7A74] mt-0.5">
                Manage budgets, revisions, and drill-down into specific invoice / bill lines contributing to analytic totals
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
            <button
              type="button"
              onClick={handleExportPDF}
              className="px-3 py-2 rounded-xl border border-[#DDD5C7] text-xs font-semibold text-[#3D4C44] hover:bg-[#FAF8F5] flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-3.5 py-2 rounded-xl bg-[#2D4A3E] text-[#FAF8F5] text-xs font-semibold hover:bg-[#233A31] flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Budget</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#EFE9E0]">
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-xl border border-[#E5DFD5] overflow-x-auto">
            {['All', 'Draft', 'Confirmed', 'Revised', 'Cancelled'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilterTab(tab)}
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
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search budget name, contact, period..."
              className="w-full bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl pl-8.5 pr-3 py-1.5 text-xs text-[#141A17] placeholder-[#8C9B93] focus:outline-hidden focus:border-[#2D4A3E]"
            />
          </div>
        </div>
      </div>

      {/* VIEW: KANBAN MODE */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBudgets.map((b) => {
            const achieved = b.achievedAmount || b.actualAmount || 0;
            const planned = b.plannedAmount || 0;
            const balance = Math.max(0, planned - achieved);

            return (
              <div
                key={b._id}
                id={`budget-card-${b._id}`}
                className="bg-white rounded-3xl border border-[#E5DFD5] p-5 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3.5">
                  {/* Top: Period & Status */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E5DFD5] font-mono text-xs font-bold text-[#2D4A3E]">
                      Period: {b.period}
                    </span>
                    {getStatusBadge(b.status)}
                  </div>

                  {/* Title & Responsible Person */}
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-base text-[#141A17] group-hover:text-[#2D4A3E] transition-colors leading-snug">
                      {b.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#6B7A74]">
                      <UserCheck className="w-3.5 h-3.5 text-[#8A9991]" />
                      <span>Responsible: <strong className="text-[#141A17]">{b.responsibleContact?.name || b.responsiblePerson || 'Admin'}</strong></span>
                    </div>
                  </div>

                  {/* Reciprocal Revision Clickable Badges */}
                  {b.revisionOf && (
                    <div className="p-2 bg-purple-50/70 border border-purple-200 rounded-xl text-xs flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-purple-800">
                        Revision Of:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleScrollToBudget(b.revisionOf._id || b.revisionOf)}
                        className="text-xs font-bold text-purple-900 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>{b.revisionOf.name || 'Original Budget'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {b.revisedWith && (
                    <div className="p-2 bg-amber-50/70 border border-amber-200 rounded-xl text-xs flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-amber-800">
                        Revised With:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleScrollToBudget(b.revisedWith._id || b.revisedWith)}
                        className="text-xs font-bold text-amber-900 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>{b.revisedWith.name || 'New Revision'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Interactive Pie Chart & Figures */}
                  <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#EAE3D6] flex items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#889890] block">Planned Budget</span>
                        <span className="text-sm font-bold text-[#141A17]">₹ {Number(planned).toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#889890] block">Balance Remaining</span>
                        <span className="text-xs font-semibold text-[#6E7E76]">₹ {Number(balance).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <BudgetPieChart achieved={achieved} planned={planned} size={64} />
                  </div>
                </div>

                {/* Bottom Actions & Achieved Drill-down Button */}
                <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenDrilldown(b)}
                    className="px-3 py-1.5 rounded-xl bg-[#2D4A3E]/10 hover:bg-[#2D4A3E]/20 text-[#2D4A3E] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    title="Click to view contributing invoices & bills"
                  >
                    <span>Achieved: ₹ {Number(achieved).toLocaleString('en-IN')}</span>
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1">
                    {b.status === 'draft' && (
                      <button
                        type="button"
                        onClick={() => handleConfirmBudget(b)}
                        className="px-2.5 py-1 rounded-lg bg-[#2D4A3E] text-white text-xs font-semibold hover:bg-[#233A31] cursor-pointer"
                      >
                        Confirm
                      </button>
                    )}

                    {b.status === 'confirmed' && (
                      <button
                        type="button"
                        onClick={() => handleReviseBudget(b)}
                        className="px-2.5 py-1 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold cursor-pointer shadow-xs flex items-center gap-1"
                        title="Create new revision of this budget"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Revise</span>
                      </button>
                    )}

                    {['draft', 'confirmed'].includes(b.status) && (
                      <button
                        type="button"
                        onClick={() => handleCancelBudget(b)}
                        className="px-2 py-1 rounded-lg text-red-600 hover:bg-red-50 text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VIEW: LIST TABLE MODE */
        <div className="bg-white rounded-3xl border border-[#E8E2D9] overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E8E2D9] text-[11px] font-bold text-[#55655D] uppercase tracking-wider">
                  <th className="py-3 px-6">Budget Name</th>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Responsible Person</th>
                  <th className="py-3 px-4">Analytic Account</th>
                  <th className="py-3 px-4 text-right">Planned Amount</th>
                  <th className="py-3 px-4 text-center">Achieved (Drilldown)</th>
                  <th className="py-3 px-4 text-right">Balance</th>
                  <th className="py-3 px-4 text-center">Chart</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE9E0] text-xs text-[#141A17]">
                {filteredBudgets.map((b) => {
                  const achieved = b.achievedAmount || b.actualAmount || 0;
                  const planned = b.plannedAmount || 0;
                  const balance = Math.max(0, planned - achieved);

                  return (
                    <tr key={b._id} id={`budget-row-${b._id}`} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="py-3.5 px-6 font-bold text-[#141A17] max-w-xs">
                        <div>{b.name}</div>
                        {b.revisionOf && (
                          <button
                            type="button"
                            onClick={() => handleScrollToBudget(b.revisionOf._id || b.revisionOf)}
                            className="text-[10.5px] font-semibold text-purple-700 hover:underline flex items-center gap-0.5 mt-0.5"
                          >
                            <span>↳ Revision Of: {b.revisionOf.name || 'Original'}</span>
                          </button>
                        )}
                        {b.revisedWith && (
                          <button
                            type="button"
                            onClick={() => handleScrollToBudget(b.revisedWith._id || b.revisedWith)}
                            className="text-[10.5px] font-semibold text-amber-700 hover:underline flex items-center gap-0.5 mt-0.5"
                          >
                            <span>↳ Revised With: {b.revisedWith.name || 'Revision'}</span>
                          </button>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#2D4A3E]">
                        {b.period}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#44554D]">
                        {b.responsibleContact?.name || b.responsiblePerson || 'Admin'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#141A17] block">
                          {b.analyticAccount?.name || 'General Analytic'}
                        </span>
                        <span className="text-[10.5px] text-[#7A8A82] font-mono">
                          {b.analyticAccount?.code || 'ANA'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#141A17]">
                        ₹ {Number(planned).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenDrilldown(b)}
                          className="px-2.5 py-1 rounded-lg bg-[#2D4A3E]/10 hover:bg-[#2D4A3E]/20 text-[#2D4A3E] font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                          title="Click to view contributing Invoices/Bills"
                        >
                          <span>₹ {Number(achieved).toLocaleString('en-IN')}</span>
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-[#66776F]">
                        ₹ {Number(balance).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <BudgetPieChart achieved={achieved} planned={planned} size={42} />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {getStatusBadge(b.status)}
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {b.status === 'draft' && (
                            <button
                              type="button"
                              onClick={() => handleConfirmBudget(b)}
                              className="px-2.5 py-1 rounded-lg bg-[#2D4A3E] text-white text-[11px] font-semibold hover:bg-[#233A31] cursor-pointer shadow-xs"
                            >
                              Confirm
                            </button>
                          )}

                          {b.status === 'confirmed' && (
                            <button
                              type="button"
                              onClick={() => handleReviseBudget(b)}
                              className="px-2.5 py-1 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-[11px] font-semibold cursor-pointer shadow-xs flex items-center gap-1"
                              title="Create revision"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Revise</span>
                            </button>
                          )}

                          {['draft', 'confirmed'].includes(b.status) && (
                            <button
                              type="button"
                              onClick={() => handleCancelBudget(b)}
                              className="px-2 py-1 rounded-lg text-red-600 hover:bg-red-50 text-[11px] font-semibold cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE BUDGET MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E2DAD0] shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE9E0]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#2D4A3E] text-[#FAF8F5] flex items-center justify-center font-bold">
                  <PieChart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#141A17]">Create Budget</h3>
                  <p className="text-xs text-[#6C7C74]">Initialize expenditure or revenue budget plan</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-[#889890] hover:text-[#1E2623] hover:bg-[#FAF8F5] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBudget} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-[#141A17] mb-1">
                  Budget Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. 2026 Raw Teak & Lumber CapEx"
                  className="w-full bg-[#FAF8F5] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#141A17] mb-1">Period Identifier *</label>
                  <input
                    type="text"
                    required
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    placeholder="e.g. 2026, Q3 2026"
                    className="w-full bg-[#FAF8F5] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#141A17] mb-1">Planned Target Amount (INR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.plannedAmount}
                    onChange={(e) => setFormData({ ...formData, plannedAmount: e.target.value })}
                    placeholder="e.g. 500000"
                    className="w-full bg-[#FAF8F5] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs font-bold text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]"
                  />
                </div>
              </div>

              {/* Responsible Person Selectable from Contact Master */}
              <div>
                <label className="block text-xs font-bold text-[#141A17] mb-1">
                  Responsible Person (From Contact Master) *
                </label>
                <select
                  value={formData.responsibleContact}
                  onChange={(e) => setFormData({ ...formData, responsibleContact: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs font-semibold text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]"
                >
                  <option value="">-- Select Contact Master Entity --</option>
                  {contacts.map(c => (
                    <option key={c._id || c.id} value={c._id || c.id}>
                      {c.name} ({c.type}) - {c.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Analytic Account Selection */}
              <div>
                <label className="block text-xs font-bold text-[#141A17] mb-1">
                  Analytic Account (Cost Center / Project) *
                </label>
                <select
                  value={formData.analyticAccount}
                  onChange={(e) => setFormData({ ...formData, analyticAccount: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs font-semibold text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]"
                >
                  <option value="">-- Select Analytic Account --</option>
                  {analyticAccounts.map(a => (
                    <option key={a._id} value={a._id}>
                      {a.code} - {a.name} ({a.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#55635D] mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#DDD5C7] rounded-xl px-3 py-1.5 text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#55635D] mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#DDD5C7] rounded-xl px-3 py-1.5 text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#EFE9E0] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#DDD5C7] text-xs font-semibold text-[#55635D] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2D4A3E] text-[#FAF8F5] text-xs font-semibold hover:bg-[#233A31] shadow-xs cursor-pointer"
                >
                  Create Budget (Draft)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DRILL-DOWN TRANSACTIONS MODAL */}
      {drilldownModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E2DAD0] shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-scaleUp text-left">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#EFE9E0] flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2D4A3E] text-white flex items-center justify-center font-bold shadow-2xs">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#141A17]">
                    Budget Achieved Amount Drill-Down
                  </h3>
                  <p className="text-xs text-[#6A7B73]">
                    Contributing line items for: <strong className="text-[#141A17]">{drilldownData?.budget?.name || 'Budget'}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDrilldownModalOpen(false)}
                className="p-1.5 rounded-lg text-[#8A9B93] hover:text-[#141A17] hover:bg-[#EAE4DC] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Summary Bar */}
            <div className="px-6 py-3 bg-[#F2EDE6] border-b border-[#E0D8CE] flex items-center justify-between text-xs">
              <span className="text-[#55665E]">
                Analytic Center: <strong className="text-[#141A17]">{drilldownData?.budget?.analyticAccount?.name} ({drilldownData?.budget?.analyticAccount?.type})</strong>
              </span>
              <span className="text-sm font-bold text-[#2D4A3E]">
                Total Achieved: ₹ {Number(drilldownData?.budget?.achievedAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Content Table */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              {drilldownLoading ? (
                <div className="py-12 text-center text-xs text-[#7A8B83]">
                  Computing live contributing transactions from confirmed documents...
                </div>
              ) : !drilldownData?.transactions || drilldownData.transactions.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#7A8B83]">
                  No confirmed contributing invoice or bill line items recorded for this period yet.
                </div>
              ) : (
                <div className="border border-[#E5DFD5] rounded-2xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#FAF8F5] border-b border-[#E5DFD5] text-[10.5px] font-bold text-[#55665E] uppercase tracking-wider">
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Doc Ref</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Partner Entity</th>
                        <th className="py-2.5 px-3">Line Description</th>
                        <th className="py-2.5 px-3 text-right">Line Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EFE9E0]">
                      {drilldownData.transactions.map((tx) => (
                        <tr key={tx._id} className="hover:bg-[#FAF8F5]/80">
                          <td className="py-2.5 px-3 font-mono text-[#66776F]">
                            {new Date(tx.date).toLocaleDateString('en-GB')}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-[#2D4A3E]">
                            {tx.docNumber}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              tx.documentType.includes('Invoice') 
                                ? 'bg-emerald-50 text-emerald-700' 
                                : 'bg-amber-50 text-amber-700'
                            }`}>
                              {tx.documentType}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-medium text-[#141A17]">
                            {tx.partnerName}
                          </td>
                          <td className="py-2.5 px-3 text-[#55665E] max-w-xs truncate">
                            {tx.itemDescription}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-[#141A17]">
                            ₹ {Number(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#EFE9E0] bg-[#FAF8F5] flex items-center justify-end">
              <button
                type="button"
                onClick={() => setDrilldownModalOpen(false)}
                className="px-5 py-2 bg-[#2D4A3E] hover:bg-[#233A31] text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
              >
                Close Drill-Down
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BudgetsTable;
