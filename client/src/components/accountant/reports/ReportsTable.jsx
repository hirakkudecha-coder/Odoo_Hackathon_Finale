import React, { useState, useMemo } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { DocumentPdfModal } from '../DocumentPdfModal';
import { createFinancialReportPdfData, createMasterRegisterPdfData, downloadDirectPdf } from '../../../utils/pdfGenerator';

export const ReportsTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPdfDoc, setSelectedPdfDoc] = useState(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const initialReports = [
    {
      id: 1,
      name: 'Profit & Loss Statement',
      category: 'Financial Performance',
      period: 'Monthly & YTD',
      lastGenerated: 'Today, 02 Sep 2025',
      badge: 'bg-[#E5F7ED] text-[#1E7445]',
      icon: TrendingUp,
      status: 'Ready',
    },
    {
      id: 2,
      name: 'Balance Sheet (Statement of Financial Position)',
      category: 'Financial Position',
      period: 'As of 02 Sep 2025',
      lastGenerated: 'Today, 02 Sep 2025',
      badge: 'bg-[#EBF3FE] text-[#2563EB]',
      icon: DollarSign,
      status: 'Ready',
    },
    {
      id: 3,
      name: 'Cash Flow Statement',
      category: 'Liquidity',
      period: 'Q3 2025',
      lastGenerated: '01 Sep 2025',
      badge: 'bg-[#EBF3FE] text-[#2563EB]',
      icon: PieChart,
      status: 'Ready',
    },
    {
      id: 4,
      name: 'Aged Partner Receivables (Debtor Aging)',
      category: 'Credit & Audit',
      period: '30/60/90 Days',
      lastGenerated: '30 Aug 2025',
      badge: 'bg-[#FEF7EC] text-[#D97706]',
      icon: FileText,
      status: 'Ready',
    },
    {
      id: 5,
      name: 'Aged Partner Payables (Creditor Aging)',
      category: 'Credit & Audit',
      period: '30/60/90 Days',
      lastGenerated: '28 Aug 2025',
      badge: 'bg-[#FEF7EC] text-[#D97706]',
      icon: FileText,
      status: 'Ready',
    },
    {
      id: 6,
      name: 'GST / Tax Audit Summary Report',
      category: 'Statutory Compliance',
      period: 'August 2025',
      lastGenerated: '25 Aug 2025',
      badge: 'bg-[#F3E8FF] text-[#7E22CE]',
      icon: FileText,
      status: 'Ready',
    },
  ];

  const categories = ['All', 'Financial Performance', 'Financial Position', 'Liquidity', 'Credit & Audit', 'Statutory Compliance'];

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
  }, [searchQuery, activeCategory, sortAsc]);

  const itemsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(filteredReports.length / itemsPerPage));
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReports.slice(start, start + itemsPerPage);
  }, [filteredReports, currentPage]);

  const handleViewReportPdf = (report) => {
    const pdfData = createFinancialReportPdfData(report.name, report.period);
    setSelectedPdfDoc(pdfData);
    setIsPdfModalOpen(true);
  };

  const handleDownloadReportPdfDirect = (report) => {
    const pdfData = createFinancialReportPdfData(report.name, report.period);
    downloadDirectPdf(pdfData);
  };

  const handleExportAllReportsPdf = () => {
    const headers = ['Report Name', 'Category', 'Period', 'Last Generated', 'Status'];
    const rows = filteredReports.map((r) => [
      r.name,
      r.category,
      r.period,
      r.lastGenerated,
      r.status,
    ]);

    const pdfData = createMasterRegisterPdfData('Financial Intelligence & Audit Summary Report', headers, rows);
    downloadDirectPdf(pdfData);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-xs overflow-hidden transition-all duration-300">
      
      {/* 1. Header with Title & Export All */}
      <div className="p-5 sm:p-6 border-b border-[#F0EAE1] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#F4EFE6] text-[#1C3A2F] flex items-center justify-center border border-[#E5DDD0] shadow-2xs shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#141A17] tracking-tight">
              Financial Intelligence & Reports
            </h2>
            <p className="text-xs text-[#6B7A74] mt-0.5">
              Audited balance sheets, income statements, and tax audit schedules.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-[#8A9B93] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search reports..."
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
            onClick={handleExportAllReportsPdf}
            className="inline-flex items-center gap-2 bg-[#1C3A2F] hover:bg-[#142C23] text-[#FAF8F5] text-xs font-semibold px-4 py-2 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer shrink-0"
            title="Download full financial audit summary report as PDF directly"
          >
            <Download className="w-4 h-4" />
            <span>Export All (PDF)</span>
          </button>
        </div>
      </div>

      {/* 2. Category & Filter Bar */}
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
            title="Sort alphabetically"
          >
            <Filter className="w-3.5 h-3.5 text-[#738C80]" />
            <span>{sortAsc ? 'Name (A-Z)' : 'Name (Z-A)'}</span>
          </button>
        </div>
      </div>

      {/* 3. Main Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-187.5">
          <thead>
            <tr className="border-b border-[#EAE3D7] bg-[#F7F4EE] text-[11px] font-bold text-[#55665E] uppercase tracking-wider">
              <th className="py-3.5 pl-6 pr-3">Report Name</th>
              <th className="py-3.5 px-3">Category</th>
              <th className="py-3.5 px-3">Period</th>
              <th className="py-3.5 px-3">Last Generated</th>
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
                      onClick={() => handleViewReportPdf(rep)}
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
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        type="button" 
                        onClick={() => handleDownloadReportPdfDirect(rep)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF4EB] hover:bg-[#1C3A2F] text-[#1C3A2F] hover:text-white border border-[#E5DDD0] text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                        title="Download financial statement PDF directly"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
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
        <span>
          Showing {filteredReports.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
          {Math.min(currentPage * itemsPerPage, filteredReports.length)} of {filteredReports.length} reports
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
