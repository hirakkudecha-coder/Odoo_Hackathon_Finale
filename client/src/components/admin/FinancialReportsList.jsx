import React from 'react';
import { 
  FileText, 
  TrendingUp, 
  Clock, 
  IndianRupee, 
  ChevronRight,
  Receipt,
  Download
} from 'lucide-react';
import { generateFinancialReportPDF } from '../../utils/pdfGenerator';

export const FinancialReportsList = ({ onSelectReport }) => {
  const reports = [
    {
      id: 'balanceSheet',
      title: 'Balance Sheet',
      desc: "View your company's financial position",
      icon: FileText,
      iconColor: 'text-[#1F6E43]',
      iconBg: 'bg-[#E5F7ED]',
    },
    {
      id: 'profitLoss',
      title: 'Profit & Loss',
      desc: 'Analyze your business performance',
      icon: TrendingUp,
      iconColor: 'text-[#1F6E43]',
      iconBg: 'bg-[#E5F7ED]',
    },
    {
      id: 'budgetReport',
      title: 'Budget Report',
      desc: 'Track planned vs actual spending',
      icon: Clock,
      iconColor: 'text-[#1F6E43]',
      iconBg: 'bg-[#E5F7ED]',
    },
    {
      id: 'agedReceivables',
      title: 'Aged Receivables',
      desc: 'See pending customer payments',
      icon: IndianRupee,
      iconColor: 'text-[#1F6E43]',
      iconBg: 'bg-[#E5F7ED]',
    },
    {
      id: 'agedPayables',
      title: 'Aged Payables',
      desc: 'See pending vendor payments',
      icon: Receipt,
      iconColor: 'text-[#1F6E43]',
      iconBg: 'bg-[#E5F7ED]',
    },
  ];

  const handleReportClick = (rep) => {
    if (onSelectReport) {
      onSelectReport(rep.id);
    }
    generateFinancialReportPDF(rep.title);
  };

  const handleViewAll = () => {
    generateFinancialReportPDF('Consolidated Financial Summary');
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E8E1D5] shadow-2xs hover:shadow-md transition-shadow duration-300 text-left h-full flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F0EAE1]">
        <h3 className="font-serif font-bold text-base sm:text-lg text-[#141A17]">
          Reports
        </h3>
        <button 
          onClick={handleViewAll}
          className="text-xs font-semibold text-[#2D4A3E] hover:text-[#183327] hover:underline cursor-pointer transition-colors flex items-center gap-1"
          title="Download Consolidated Financial Summary PDF"
        >
          <Download className="w-3 h-3 text-[#2D4A3E]" />
          <span>Export All</span>
        </button>
      </div>

      {/* Reports List */}
      <div className="space-y-2 my-auto">
        {reports.map((rep) => {
          const Icon = rep.icon;
          return (
            <button
              key={rep.id}
              onClick={() => handleReportClick(rep)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF6F0] hover:border hover:border-[#E8E1D5]/60 hover:shadow-2xs transition-all duration-200 cursor-pointer group text-left"
              title={`Download ${rep.title} PDF Statement`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${rep.iconBg} ${rep.iconColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200 shadow-2xs`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#141A17] group-hover:text-[#2D4A3E] transition-colors">
                    {rep.title}
                  </h4>
                  <p className="text-[10px] text-[#718079]">
                    {rep.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[#A1B0A8] group-hover:text-[#2D4A3E] transition-colors">
                <span className="text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">PDF</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
};

export default FinancialReportsList;
