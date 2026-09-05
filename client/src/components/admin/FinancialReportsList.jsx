import React from 'react';
import { 
  FileText, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  ChevronRight,
  Receipt
} from 'lucide-react';

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
      icon: DollarSign,
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

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E8E1D5] shadow-2xs text-left h-full flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F0EAE1]">
        <h3 className="font-serif font-bold text-base sm:text-lg text-[#141A17]">
          Reports
        </h3>
        <button className="text-xs font-semibold text-[#2D4A3E] hover:text-[#183327] hover:underline cursor-pointer">
          View All
        </button>
      </div>

      {/* Reports List */}
      <div className="space-y-2.5 my-auto">
        {reports.map((rep) => {
          const Icon = rep.icon;
          return (
            <button
              key={rep.id}
              onClick={() => onSelectReport && onSelectReport(rep.id)}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF8F5] transition-colors cursor-pointer group text-left"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${rep.iconBg} ${rep.iconColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
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

              <ChevronRight className="w-4 h-4 text-[#A1B0A8] group-hover:text-[#2D4A3E] group-hover:translate-x-0.5 transition-all" />
            </button>
          );
        })}
      </div>

    </div>
  );
};

export default FinancialReportsList;
