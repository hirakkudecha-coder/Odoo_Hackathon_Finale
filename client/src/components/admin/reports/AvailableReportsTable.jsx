import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  ChevronDown, 
  Download, 
  MoreVertical, 
  Calendar 
} from 'lucide-react';
import { generateFinancialReportPDF } from '../../../utils/pdfGenerator';

export const AvailableReportsTable = ({ onGenerateReport }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [downloadingId, setDownloadingId] = useState(null);

  const handleDownloadPDF = (report) => {
    setDownloadingId(report.id);
    try {
      generateFinancialReportPDF(report.name);
    } finally {
      setTimeout(() => setDownloadingId(null), 600);
    }
  };

  const rawReports = [
    {
      id: 1,
      name: 'Profit & Loss Statement',
      description: 'Summary of income and expenses',
      type: 'Financial',
      typeStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      lastGenerated: '12 Aug 2024, 10:24 AM',
    },
    {
      id: 2,
      name: 'Balance Sheet',
      description: 'Assets, liabilities and equity',
      type: 'Financial',
      typeStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      lastGenerated: '10 Aug 2024, 03:18 PM',
    },
    {
      id: 3,
      name: 'Cash Flow Statement',
      description: 'Cash inflows and outflows',
      type: 'Financial',
      typeStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      lastGenerated: '08 Aug 2024, 11:42 AM',
    },
    {
      id: 4,
      name: 'Sales Summary Report',
      description: 'Detailed sales breakdown',
      type: 'Sales',
      typeStyle: 'bg-[#EBF3FE] text-[#2563EB]',
      lastGenerated: '05 Aug 2024, 09:30 AM',
    },
    {
      id: 5,
      name: 'Purchase Summary Report',
      description: 'Detailed purchase breakdown',
      type: 'Purchase',
      typeStyle: 'bg-[#F3E8FF] text-[#7C3AED]',
      lastGenerated: '01 Aug 2024, 04:15 PM',
    },
    {
      id: 6,
      name: 'Tax Summary Report',
      description: 'GST and tax liabilities',
      type: 'Tax',
      typeStyle: 'bg-[#FEF7EC] text-[#D97706]',
      lastGenerated: '28 Jul 2024, 01:20 PM',
    },
  ];

  const filteredReports = useMemo(() => {
    return rawReports.filter((r) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredReports.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredReports.map((r) => r.id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E8E1D5] shadow-xs text-left">
      
      {/* 1. Header Row: Title & Action Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#F0EAE1]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F0EC] text-[#2D4A3E] flex items-center justify-center shrink-0 border border-[#D5E5DD] shadow-2xs">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#141A17] tracking-tight">
              Available Reports
            </h2>
            <p className="text-xs text-[#6B7A74] mt-0.5">
              Generate and download detailed reports.
            </p>
          </div>
        </div>

        {/* Right Search, Date Range & Generate Report CTA */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A9791]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports..."
              className="w-full bg-[#FAF8F5] border border-[#E4DCD0] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#141A17] placeholder-[#8A9791] focus:outline-hidden focus:border-[#2D4A3E] focus:bg-white transition-all shadow-2xs"
            />
          </div>

          {/* Date Range Picker Dropdown */}
          <div className="relative">
            <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E4DCD0] bg-white text-xs font-semibold text-[#4A5550] hover:bg-[#FAF8F5] transition-all cursor-pointer shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-[#7A8881]" />
              <span>01 Aug 2024 – 31 Aug 2024</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#7A8881]" />
            </button>
          </div>

          <button
            onClick={() => {
              generateFinancialReportPDF('Executive Financial Statement');
              if (onGenerateReport) onGenerateReport();
            }}
            className="inline-flex items-center gap-2 bg-[#1C3A2F] hover:bg-[#142921] active:scale-95 text-[#FAF8F5] px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Generate PDF Report</span>
          </button>
        </div>
      </div>

      {/* 2. Table Container */}
      <div className="overflow-x-auto border border-[#EFE8DC] rounded-2xl mt-5">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#FAF8F5] text-[10px] uppercase font-bold text-[#6D7D76] tracking-wider border-b border-[#EFE8DC]">
              <th className="py-3.5 px-4 w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredReports.length && filteredReports.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-[#DDD4C7] text-[#1C3A2F] focus:ring-[#1C3A2F] cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-4 font-semibold">
                REPORT NAME
              </th>
              <th className="py-3.5 px-4 font-semibold">
                DESCRIPTION
              </th>
              <th className="py-3.5 px-4 font-semibold">
                TYPE
              </th>
              <th className="py-3.5 px-4 font-semibold">
                LAST GENERATED
              </th>
              <th className="py-3.5 px-4 font-semibold text-right">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#F4EFEA] bg-white">
            {filteredReports.length > 0 ? (
              filteredReports.map((r) => {
                const isSelected = selectedIds.includes(r.id);
                return (
                  <tr 
                    key={r.id} 
                    className={`hover:bg-[#FAF7F2] transition-colors duration-150 cursor-pointer group ${
                      isSelected ? 'bg-[#F9F6F0]' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(r.id)}
                        className="rounded border-[#DDD4C7] text-[#1C3A2F] focus:ring-[#1C3A2F] cursor-pointer"
                      />
                    </td>

                    {/* Report Name with File Icon */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-[#7A8A83] shrink-0" />
                        <span className="font-semibold text-[#141A17] text-xs group-hover:text-[#2D4A3E] transition-colors">
                          {r.name}
                        </span>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4 text-[#5A6963] font-medium">
                      {r.description}
                    </td>

                    {/* Type Tag Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10.5px] font-bold ${r.typeStyle}`}>
                        {r.type}
                      </span>
                    </td>

                    {/* Last Generated Timestamp */}
                    <td className="py-3.5 px-4 text-[#5A6963] font-medium text-[11.5px]">
                      {r.lastGenerated}
                    </td>

                    {/* Actions: Download Icon & More Vertical Options */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => handleDownloadPDF(r)}
                          className="p-1.5 rounded-lg text-[#2D4A3E] hover:text-[#141A17] hover:bg-[#E5F7ED] active:scale-95 transition-all cursor-pointer"
                          title={`Download ${r.name} PDF`}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDownloadPDF(r)}
                          className="p-1.5 rounded-lg text-[#85988F] hover:text-[#141A17] hover:bg-[#EFE9DF] transition-colors cursor-pointer"
                          title="More Options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#7A8881] text-xs">
                  No reports found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Footer */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#F0EAE1] text-xs text-[#6B7A74]">
        <span>
          Showing 1–{filteredReports.length} of 6 reports
        </span>
      </div>

    </div>
  );
};

export default AvailableReportsTable;
