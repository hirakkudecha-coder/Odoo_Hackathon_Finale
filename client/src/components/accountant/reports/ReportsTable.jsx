import React, { useState } from 'react';
import { 
  BarChart3, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  ArrowUpRight,
  TrendingUp,
  PieChart,
  DollarSign
} from 'lucide-react';

export const ReportsTable = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const reports = [
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

  return (
    <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-xs overflow-hidden transition-all duration-300">
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl pl-9 pr-3 py-2 text-xs text-[#141A17] placeholder-[#8A9B93] focus:outline-hidden focus:border-[#1C3A2F] focus:ring-1 focus:ring-[#1C3A2F] transition-all"
            />
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 bg-[#1C3A2F] hover:bg-[#142C23] text-[#FAF8F5] text-xs font-semibold px-4 py-2 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Export All</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[750px]">
          <thead>
            <tr className="border-b border-[#EAE3D7] bg-[#F7F4EE] text-[11px] font-bold text-[#55665E] uppercase tracking-wider">
              <th className="py-3.5 pl-6 pr-3">Report Name</th>
              <th className="py-3.5 px-3">Category</th>
              <th className="py-3.5 px-3">Period</th>
              <th className="py-3.5 px-3">Last Generated</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 pr-6 pl-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EAE1] text-xs text-[#141A17]">
            {reports.map((rep) => {
              const Icon = rep.icon;
              return (
                <tr key={rep.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3.5 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#FAF6EE] text-[#1C3A2F] flex items-center justify-center border border-[#E8E1D5] shadow-2xs shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-[#141A17]">{rep.name}</span>
                    </div>
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
                    <button type="button" className="inline-flex items-center gap-1 text-xs font-semibold text-[#1C3A2F] hover:underline cursor-pointer">
                      <span>View</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsTable;
