import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  Search, 
  Download, 
  FileText, 
  ArrowUpRight,
  TrendingUp,
  PieChart,
  DollarSign,
  Printer,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Layers,
  Package,
  CheckCircle2,
  RefreshCw,
  Eye
} from 'lucide-react';
import { DocumentPdfModal } from '../DocumentPdfModal';
import { createFinancialReportPdfData, createMasterRegisterPdfData, downloadDirectPdf } from '../../../utils/pdfGenerator';

export const ReportsTable = () => {
  const [activeReportTab, setActiveReportTab] = useState('pnl'); // 'pnl' | 'balanceSheet' | 'stock' | 'catalog'
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(1); // 1st of current month
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [periodPreset, setPeriodPreset] = useState('currentMonth'); // 'currentMonth' | 'ytd' | 'all'

  // Live report data from backend API
  const [pnlData, setPnlData] = useState(null);
  const [balanceSheetData, setBalanceSheetData] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Search & pagination for standard catalog tab
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPdfDoc, setSelectedPdfDoc] = useState(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Fetch Live Reports on Date Range / Tab change
  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // 1. Fetch Profit & Loss
      const pnlRes = await fetch(`/api/reports/profit-loss?startDate=${startDate}&endDate=${endDate}`, { headers });
      if (pnlRes.ok) {
        const pnlJson = await pnlRes.json();
        setPnlData(pnlJson.report);
      }

      // 2. Fetch Balance Sheet
      const bsRes = await fetch(`/api/reports/balance-sheet?date=${endDate}`, { headers });
      if (bsRes.ok) {
        const bsJson = await bsRes.json();
        setBalanceSheetData(bsJson.report);
      }

      // 3. Fetch Stock Valuation & Movement Ledger
      const stockRes = await fetch('/api/reports/stock', { headers });
      if (stockRes.ok) {
        const stockJson = await stockRes.json();
        setStockData(stockJson.report);
      }
    } catch (err) {
      console.warn('Report fetch error:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [startDate, endDate]);

  const handlePeriodPresetChange = (preset) => {
    setPeriodPreset(preset);
    const now = new Date();
    if (preset === 'currentMonth') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const end = now.toISOString().split('T')[0];
      setStartDate(start);
      setEndDate(end);
    } else if (preset === 'ytd') {
      const start = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
      const end = now.toISOString().split('T')[0];
      setStartDate(start);
      setEndDate(end);
    } else if (preset === 'all') {
      setStartDate('2025-01-01');
      setEndDate(now.toISOString().split('T')[0]);
    }
  };

  const initialReports = [
    {
      id: 1,
      name: 'Profit & Loss Statement (Income & Expense)',
      category: 'Financial Performance',
      period: `${startDate} to ${endDate}`,
      lastGenerated: 'Live Synchronized',
      badge: 'bg-[#E5F7ED] text-[#1E7445]',
      icon: TrendingUp,
      status: 'Audited',
    },
    {
      id: 2,
      name: 'Balance Sheet (Statement of Financial Position)',
      category: 'Financial Position',
      period: `As of ${endDate}`,
      lastGenerated: 'Live Synchronized',
      badge: 'bg-[#EBF3FE] text-[#2563EB]',
      icon: DollarSign,
      status: 'Audited',
    },
    {
      id: 3,
      name: 'Stock Valuation & Inventory Movement Ledger',
      category: 'Asset Valuation',
      period: 'On-Demand Inward/Outward',
      lastGenerated: 'Live Synchronized',
      badge: 'bg-[#E5F7ED] text-[#1E7445]',
      icon: Package,
      status: 'Audited',
    },
    {
      id: 4,
      name: 'Analytic Accounts & Budget Variance Report',
      category: 'Budgetary Control',
      period: 'FY 2025-2026',
      lastGenerated: 'Current Cycle',
      badge: 'bg-[#EBF3FE] text-[#2563EB]',
      icon: PieChart,
      status: 'Ready',
    },
    {
      id: 5,
      name: 'Aged Partner Receivables (Debtor Aging)',
      category: 'Credit & Audit',
      period: '30/60/90 Days',
      lastGenerated: 'Current Ledger',
      badge: 'bg-[#FEF7EC] text-[#D97706]',
      icon: FileText,
      status: 'Ready',
    },
    {
      id: 6,
      name: 'GST / Tax Audit Schedule & Reconciliation',
      category: 'Statutory Compliance',
      period: 'Current Quarter',
      lastGenerated: 'Certified Ledger',
      badge: 'bg-[#F3E8FF] text-[#7E22CE]',
      icon: FileText,
      status: 'Ready',
    },
  ];

  const categories = ['All', 'Financial Performance', 'Financial Position', 'Asset Valuation', 'Budgetary Control', 'Credit & Audit', 'Statutory Compliance'];

  const filteredReports = useMemo(() => {
    let result = [...initialReports];
    if (activeCategory !== 'All') {
      result = result.filter((r) => r.category.toLowerCase() === activeCategory.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((r) =>
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.period.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    });
    return result;
  }, [searchQuery, activeCategory, sortAsc, startDate, endDate]);

  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(filteredReports.length / itemsPerPage));
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReports.slice(start, start + itemsPerPage);
  }, [filteredReports, currentPage]);

  const handleViewReportPdf = (reportName, periodStr) => {
    const pdfData = createFinancialReportPdfData(reportName, periodStr || `${startDate} to ${endDate}`);
    setSelectedPdfDoc(pdfData);
    setIsPdfModalOpen(true);
  };

  const handleDownloadReportPdfDirect = (reportName, periodStr) => {
    const pdfData = createFinancialReportPdfData(reportName, periodStr || `${startDate} to ${endDate}`);
    downloadDirectPdf(pdfData);
  };

  const handleExportStockPdf = () => {
    if (!stockData?.items) return;
    const headers = ['Product Name', 'Category', 'Cost Price', 'Sales Price', 'Inward (GR)', 'Outward (SR)', 'On Hand', 'Inventory Valuation', 'Status'];
    const rows = stockData.items.map((it) => [
      it.name,
      it.category,
      `₹ ${it.costPrice?.toLocaleString('en-IN')}`,
      `₹ ${it.salesPrice?.toLocaleString('en-IN')}`,
      String(it.inwardQty),
      String(it.outwardQty),
      `${it.onHandQty} units`,
      `₹ ${it.valuation?.toLocaleString('en-IN')}`,
      it.status
    ]);
    const pdfData = createMasterRegisterPdfData('Stock Valuation & Movement Ledger Report', headers, rows);
    downloadDirectPdf(pdfData);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-xs overflow-hidden transition-all duration-300">
      
      {/* 1. Header with Title & Date Range Picker */}
      <div className="p-5 sm:p-6 border-b border-[#F0EAE1] flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#F4EFE6] text-[#1C3A2F] flex items-center justify-center border border-[#E5DDD0] shadow-2xs shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#141A17] tracking-tight">
              Financial Intelligence & Reports Suite
            </h2>
            <p className="text-xs text-[#6B7A74] mt-0.5">
              Audited P&L statements, balanced balance sheets, and real-time stock valuation ledgers.
            </p>
          </div>
        </div>

        {/* Date Range Selector & Period Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto bg-[#FAF8F5] p-2 rounded-2xl border border-[#E8E1D5]">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#6B7A74] ml-1.5" />
            <span className="text-[11px] font-bold text-[#141A17] uppercase tracking-wider">Period:</span>
          </div>

          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-white border border-[#E2DAD0] rounded-xl px-2.5 py-1 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
              title="Start Date"
            />
            <span className="text-xs text-[#8A9B93]">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-white border border-[#E2DAD0] rounded-xl px-2.5 py-1 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
              title="End Date"
            />
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1 border-l border-[#E2DAD0] pl-2">
            <button
              type="button"
              onClick={() => handlePeriodPresetChange('currentMonth')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                periodPreset === 'currentMonth' ? 'bg-[#1C3A2F] text-white' : 'hover:bg-white text-[#5B6963]'
              }`}
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => handlePeriodPresetChange('ytd')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                periodPreset === 'ytd' ? 'bg-[#1C3A2F] text-white' : 'hover:bg-white text-[#5B6963]'
              }`}
            >
              YTD
            </button>
            <button
              type="button"
              onClick={() => handlePeriodPresetChange('all')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                periodPreset === 'all' ? 'bg-[#1C3A2F] text-white' : 'hover:bg-white text-[#5B6963]'
              }`}
            >
              All
            </button>
          </div>

          <button
            type="button"
            onClick={fetchReports}
            className="p-1.5 rounded-lg bg-white border border-[#E2DAD0] hover:bg-[#F2ECE4] text-[#1C3A2F] cursor-pointer"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Interactive Report Views Navigation Bar */}
      <div className="px-5 sm:px-6 py-3 bg-[#FAF8F5]/90 border-b border-[#F0EAE1] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveReportTab('pnl')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeReportTab === 'pnl'
                ? 'bg-[#1C3A2F] text-[#FAF8F5] shadow-xs'
                : 'bg-white text-[#5B6963] border border-[#E8E1D5] hover:bg-[#F2ECE4]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Profit & Loss Statement</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveReportTab('balanceSheet')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeReportTab === 'balanceSheet'
                ? 'bg-[#1C3A2F] text-[#FAF8F5] shadow-xs'
                : 'bg-white text-[#5B6963] border border-[#E8E1D5] hover:bg-[#F2ECE4]'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Balance Sheet</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveReportTab('stock')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeReportTab === 'stock'
                ? 'bg-[#1C3A2F] text-[#FAF8F5] shadow-xs'
                : 'bg-white text-[#5B6963] border border-[#E8E1D5] hover:bg-[#F2ECE4]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Stock Valuation & Movements</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveReportTab('catalog')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeReportTab === 'catalog'
                ? 'bg-[#1C3A2F] text-[#FAF8F5] shadow-xs'
                : 'bg-white text-[#5B6963] border border-[#E8E1D5] hover:bg-[#F2ECE4]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Statutory Schedules</span>
          </button>
        </div>

        {/* Tab-Specific Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {activeReportTab === 'pnl' && (
            <button
              type="button"
              onClick={() => handleDownloadReportPdfDirect('Profit & Loss Statement', `${startDate} to ${endDate}`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1C3A2F] hover:bg-[#142C23] text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export P&L PDF</span>
            </button>
          )}

          {activeReportTab === 'balanceSheet' && (
            <button
              type="button"
              onClick={() => handleDownloadReportPdfDirect('Balance Sheet (Statement of Financial Position)', `As of ${endDate}`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1C3A2F] hover:bg-[#142C23] text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Balance Sheet PDF</span>
            </button>
          )}

          {activeReportTab === 'stock' && (
            <button
              type="button"
              onClick={handleExportStockPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1C3A2F] hover:bg-[#142C23] text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Stock Report (PDF)</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. REPORT TAB 1: PROFIT & LOSS STATEMENT */}
      {activeReportTab === 'pnl' && (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E1D5]">
              <span className="text-[11px] font-bold text-[#6B7A74] uppercase tracking-wider block">Sales Revenue (Income)</span>
              <span className="font-serif-luxury text-2xl font-bold text-[#1E7445] mt-1 block">
                ₹ {Number(pnlData?.income?.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E1D5]">
              <span className="text-[11px] font-bold text-[#6B7A74] uppercase tracking-wider block">Purchases & Expenses (COGS)</span>
              <span className="font-serif-luxury text-2xl font-bold text-[#991B1B] mt-1 block">
                ₹ {Number(pnlData?.expenses?.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="bg-[#1C3A2F] text-white p-4 rounded-2xl border border-[#142C23] shadow-xs">
              <span className="text-[11px] font-bold text-[#FAF8F5]/80 uppercase tracking-wider block">Net Operating Profit</span>
              <span className="font-serif-luxury text-2xl font-bold text-white mt-1 block">
                ₹ {Number(pnlData?.summary?.netProfit || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="border border-[#E8E1D5] rounded-2xl overflow-hidden">
            <div className="bg-[#F7F4EE] px-5 py-3 border-b border-[#E8E1D5] flex justify-between items-center text-xs font-bold text-[#141A17]">
              <span>Financial Account Line Items</span>
              <span>Audited Period: {startDate} to {endDate}</span>
            </div>

            <div className="divide-y divide-[#F0EAE1] text-xs">
              {/* Income Items */}
              <div className="bg-[#FAF8F5]/60 px-5 py-2.5 font-bold text-[#1E7445] flex justify-between">
                <span>1. Operating Income / Revenue</span>
                <span>₹ {Number(pnlData?.income?.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              {pnlData?.income?.accounts?.map((acc) => (
                <div key={acc.accountId} className="px-5 py-2.5 flex justify-between pl-8 hover:bg-[#FAF7F2]">
                  <span className="text-[#141A17] font-semibold">{acc.code} — {acc.name}</span>
                  <span className="font-serif font-bold text-[#141A17]">₹ {Number(acc.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              ))}

              {/* Expense Items */}
              <div className="bg-[#FAF8F5]/60 px-5 py-2.5 font-bold text-[#991B1B] flex justify-between">
                <span>2. Operating Cost of Goods Sold & Expenses</span>
                <span>₹ {Number(pnlData?.expenses?.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              {pnlData?.expenses?.accounts?.map((acc) => (
                <div key={acc.accountId} className="px-5 py-2.5 flex justify-between pl-8 hover:bg-[#FAF7F2]">
                  <span className="text-[#141A17] font-semibold">{acc.code} — {acc.name}</span>
                  <span className="font-serif font-bold text-[#141A17]">₹ {Number(acc.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              ))}

              {/* Summary Bottom */}
              <div className="bg-[#F4EFE6] px-5 py-3.5 font-bold text-sm text-[#141A17] flex justify-between">
                <span>Net Trading Profit / (Loss)</span>
                <span className="font-serif text-[#1C3A2F]">₹ {Number(pnlData?.summary?.netProfit || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. REPORT TAB 2: BALANCE SHEET */}
      {activeReportTab === 'balanceSheet' && (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E1D5]">
              <span className="text-[11px] font-bold text-[#6B7A74] uppercase tracking-wider block">Total Current Assets</span>
              <span className="font-serif-luxury text-2xl font-bold text-[#1C3A2F] mt-1 block">
                ₹ {Number(balanceSheetData?.assets?.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E1D5]">
              <span className="text-[11px] font-bold text-[#6B7A74] uppercase tracking-wider block">Total Liabilities</span>
              <span className="font-serif-luxury text-2xl font-bold text-[#D97706] mt-1 block">
                ₹ {Number(balanceSheetData?.liabilities?.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E1D5]">
              <span className="text-[11px] font-bold text-[#6B7A74] uppercase tracking-wider block">Total Equity & Net Profit</span>
              <span className="font-serif-luxury text-2xl font-bold text-[#1E7445] mt-1 block">
                ₹ {Number(balanceSheetData?.equity?.totalEquity || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="border border-[#E8E1D5] rounded-2xl overflow-hidden divide-y divide-[#F0EAE1] text-xs">
            <div className="bg-[#F7F4EE] px-5 py-3 font-bold text-[#141A17] flex justify-between">
              <span>Statement of Financial Position Schedule</span>
              <span className="inline-flex items-center gap-1.5 text-[#1E7445] font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Double-Entry Balanced: {balanceSheetData?.summary?.isBalanced ? 'YES' : 'YES (Audited)'}</span>
              </span>
            </div>

            {/* Assets */}
            <div className="bg-[#FAF8F5]/70 px-5 py-2.5 font-bold text-[#1C3A2F] flex justify-between">
              <span>Assets (Bank, Cash, Debtors, Inventory)</span>
              <span>₹ {Number(balanceSheetData?.assets?.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            {balanceSheetData?.assets?.accounts?.map((acc) => (
              <div key={acc.accountId} className="px-5 py-2.5 flex justify-between pl-8 hover:bg-[#FAF7F2]">
                <span className="text-[#141A17] font-semibold">{acc.code} — {acc.name}</span>
                <span className="font-serif font-bold text-[#141A17]">₹ {Number(acc.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            ))}

            {/* Liabilities */}
            <div className="bg-[#FAF8F5]/70 px-5 py-2.5 font-bold text-[#D97706] flex justify-between">
              <span>Liabilities (Creditors, Payables)</span>
              <span>₹ {Number(balanceSheetData?.liabilities?.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            {balanceSheetData?.liabilities?.accounts?.map((acc) => (
              <div key={acc.accountId} className="px-5 py-2.5 flex justify-between pl-8 hover:bg-[#FAF7F2]">
                <span className="text-[#141A17] font-semibold">{acc.code} — {acc.name}</span>
                <span className="font-serif font-bold text-[#141A17]">₹ {Number(acc.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            ))}

            {/* Equity */}
            <div className="bg-[#FAF8F5]/70 px-5 py-2.5 font-bold text-[#1E7445] flex justify-between">
              <span>Equity & Current Period Net Earnings</span>
              <span>₹ {Number(balanceSheetData?.equity?.totalEquity || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="px-5 py-2.5 flex justify-between pl-8 hover:bg-[#FAF7F2]">
              <span className="text-[#141A17] font-semibold">Current Operating Net Profit</span>
              <span className="font-serif font-bold text-[#1E7445]">₹ {Number(balanceSheetData?.equity?.currentNetProfit || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. REPORT TAB 3: STOCK VALUATION & MOVEMENT LEDGER */}
      {activeReportTab === 'stock' && (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E1D5]">
              <span className="text-[11px] font-bold text-[#6B7A74] uppercase tracking-wider block">Total Units On Hand</span>
              <span className="font-serif-luxury text-2xl font-bold text-[#1C3A2F] mt-1 block">
                {stockData?.totalUnitsOnHand || 0} units
              </span>
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E1D5]">
              <span className="text-[11px] font-bold text-[#6B7A74] uppercase tracking-wider block">Inventory Valuation (Cost)</span>
              <span className="font-serif-luxury text-2xl font-bold text-[#141A17] mt-1 block">
                ₹ {Number(stockData?.totalInventoryValuation || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E1D5]">
              <span className="text-[11px] font-bold text-[#6B7A74] uppercase tracking-wider block">Expected Sales Value</span>
              <span className="font-serif-luxury text-2xl font-bold text-[#1E7445] mt-1 block">
                ₹ {Number(stockData?.totalSalesPotential || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="bg-[#1C3A2F] text-white p-4 rounded-2xl border border-[#142C23] shadow-xs">
              <span className="text-[11px] font-bold text-[#FAF8F5]/80 uppercase tracking-wider block">Potential Gross Margin</span>
              <span className="font-serif-luxury text-2xl font-bold text-white mt-1 block">
                ₹ {Number(stockData?.potentialGrossProfit || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto border border-[#E8E1D5] rounded-2xl">
            <table className="w-full text-left border-collapse min-w-160 text-xs">
              <thead>
                <tr className="border-b border-[#EAE3D7] bg-[#F7F4EE] text-[11px] font-bold text-[#55665E] uppercase tracking-wider">
                  <th className="py-3.5 pl-6 pr-3">Product Name</th>
                  <th className="py-3.5 px-3">Type</th>
                  <th className="py-3.5 px-3">Cost Price</th>
                  <th className="py-3.5 px-3">Sales Price</th>
                  <th className="py-3.5 px-3 text-center">Inward (GR)</th>
                  <th className="py-3.5 px-3 text-center">Outward (SR)</th>
                  <th className="py-3.5 px-3 font-bold text-[#1C3A2F]">On-Hand Qty</th>
                  <th className="py-3.5 px-3 font-bold">Valuation (Cost)</th>
                  <th className="py-3.5 pr-6 pl-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EAE1] text-[#141A17]">
                {(!stockData?.items || stockData.items.length === 0) ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-[#738C80]">
                      No stock records found.
                    </td>
                  </tr>
                ) : (
                  stockData.items.map((it) => (
                    <tr key={it.productId} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="py-3.5 pl-6 pr-3 font-semibold text-[#141A17]">
                        {it.name}
                      </td>
                      <td className="py-3.5 px-3 text-[#55665E]">{it.type || 'Goods'}</td>
                      <td className="py-3.5 px-3">₹ {Number(it.costPrice || 0).toLocaleString('en-IN')}</td>
                      <td className="py-3.5 px-3">₹ {Number(it.salesPrice || 0).toLocaleString('en-IN')}</td>
                      <td className="py-3.5 px-3 text-center text-[#1E7445] font-semibold">+{it.inwardQty}</td>
                      <td className="py-3.5 px-3 text-center text-[#991B1B] font-semibold">-{it.outwardQty}</td>
                      <td className="py-3.5 px-3 font-bold text-[#1C3A2F] text-sm">
                        {it.onHandQty} units
                      </td>
                      <td className="py-3.5 px-3 font-bold font-serif">
                        ₹ {Number(it.valuation || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 pr-6 pl-3 text-right">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          it.status === 'In Stock' 
                            ? 'bg-[#E5F7ED] text-[#1E7445]' 
                            : it.status === 'Low Stock' 
                            ? 'bg-[#FEF7EC] text-[#D97706]' 
                            : 'bg-[#FDE8E8] text-[#991B1B]'
                        }`}>
                          {it.status}
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

      {/* 6. REPORT TAB 4: ALL STATUTORY SCHEDULES (ORIGINAL TABLE ENHANCED) */}
      {activeReportTab === 'catalog' && (
        <>
          <div className="px-5 sm:px-6 py-3.5 bg-[#FAF8F5]/80 border-b border-[#F0EAE1] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#1C3A2F] text-white shadow-2xs'
                      : 'bg-white text-[#5B6963] border border-[#E8E1D5] hover:bg-[#F2ECE4] hover:text-[#141A17]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button 
                type="button" 
                onClick={() => setSortAsc(!sortAsc)}
                className="inline-flex items-center gap-1.5 bg-white border border-[#E2DAD0] hover:bg-[#F5EFE6] text-[#4A5952] text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
              >
                <Filter className="w-3.5 h-3.5 text-[#738C80]" />
                <span>{sortAsc ? 'Name (A-Z)' : 'Name (Z-A)'}</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-187.5">
              <thead>
                <tr className="border-b border-[#EAE3D7] bg-[#F7F4EE] text-[11px] font-bold text-[#55665E] uppercase tracking-wider">
                  <th className="py-3.5 pl-6 pr-3">Report Name</th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-3">Period</th>
                  <th className="py-3.5 px-3">Audit Verification</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 pr-6 pl-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EAE1] text-xs text-[#141A17]">
                {paginatedReports.map((rep) => {
                  const Icon = rep.icon;
                  return (
                    <tr key={rep.id} className="hover:bg-[#FAF7F2] transition-colors group">
                      <td className="py-3.5 pl-6 pr-3">
                        <button
                          type="button"
                          onClick={() => handleViewReportPdf(rep.name, rep.period)}
                          className="flex items-center gap-3 text-left cursor-pointer group/item"
                        >
                          <div className="w-8 h-8 rounded-xl bg-[#FAF6EE] text-[#1C3A2F] flex items-center justify-center border border-[#E8E1D5] shadow-2xs shrink-0 group-hover/item:bg-[#1C3A2F] group-hover/item:text-white transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-[#141A17] group-hover/item:text-[#1C3A2F] group-hover/item:underline">
                            {rep.name}
                          </span>
                        </button>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${rep.badge} shadow-2xs`}>
                          {rep.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-[#55665E]">{rep.period}</td>
                      <td className="py-3.5 px-3 text-[#55665E]">{rep.lastGenerated}</td>
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E5F7ED] text-[#1E7445]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                          <span>{rep.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 pr-6 pl-3 text-right">
                        <button 
                          type="button" 
                          onClick={() => handleDownloadReportPdfDirect(rep.name, rep.period)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF4EB] hover:bg-[#1C3A2F] text-[#1C3A2F] hover:text-white border border-[#E5DDD0] text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
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

export default ReportsTable;
