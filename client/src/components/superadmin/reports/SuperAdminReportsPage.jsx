import React from 'react';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Building2, 
  IndianRupee, 
  Users, 
  ArrowUpRight 
} from 'lucide-react';
import { exportTableToPDF } from '../../../utils/pdfGenerator';

export const SuperAdminReportsPage = () => {
  const orgRevenues = [
    { name: 'Elegant Homes', mrr: '₹ 1,84,000', ytd: '₹ 18,40,000', users: 34, growth: '+24%' },
    { name: 'Modern Spaces', mrr: '₹ 1,15,000', ytd: '₹ 11,50,000', users: 22, growth: '+18%' },
    { name: 'Interior Hub', mrr: '₹ 2,40,000', ytd: '₹ 24,00,000', users: 48, growth: '+32%' },
    { name: 'Urban Roots Co.', mrr: '₹ 2,10,000', ytd: '₹ 21,00,000', users: 41, growth: '+15%' },
    { name: 'Sheetal Living', mrr: '₹ 1,65,000', ytd: '₹ 16,50,000', users: 31, growth: '+20%' },
    { name: 'DesignCraft Atelier', mrr: '₹ 1,32,000', ytd: '₹ 13,20,000', users: 26, growth: '+12%' },
  ];

  const handleExportPDF = () => {
    const headers = ['#', 'ORGANIZATION', 'MRR REVENUE', 'YTD CUMULATIVE', 'ACTIVE USERS', 'GROWTH RATE'];
    const rows = orgRevenues.map((r, idx) => [
      String(idx + 1),
      r.name,
      r.mrr,
      r.ytd,
      String(r.users),
      r.growth
    ]);
    exportTableToPDF('SUPER ADMIN CROSS-ORGANIZATION FINANCIAL PERFORMANCE REPORT', headers, rows);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#141A17] tracking-tight font-bold">
            Cross-Tenant Financial Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6963] mt-1">
            Aggregated metrics, subscription revenues, and growth analytics across all business units.
          </p>
        </div>

        <button
          onClick={handleExportPDF}
          className="inline-flex items-center gap-2 bg-[#1C3A2F] hover:bg-[#142921] active:scale-95 text-[#FAF8F5] px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer shadow-sm shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Executive Report PDF</span>
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-5 border border-[#E8E1D5] shadow-2xs">
          <span className="text-xs font-semibold text-[#66756F]">Total Monthly Recurring Revenue (MRR)</span>
          <span className="font-numeric font-bold text-2xl sm:text-3xl text-[#141A17] block mt-1">₹ 12,48,300</span>
          <span className="text-[11px] font-bold text-[#1E7445] mt-1 block">↑ +12.4% vs last quarter</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#E8E1D5] shadow-2xs">
          <span className="text-xs font-semibold text-[#66756F]">Platform Gross Invoiced Volume</span>
          <span className="font-numeric font-bold text-2xl sm:text-3xl text-[#141A17] block mt-1">₹ 2,84,50,000</span>
          <span className="text-[11px] font-bold text-[#1E7445] mt-1 block">↑ 100% Balanced Books across 12 Orgs</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#E8E1D5] shadow-2xs">
          <span className="text-xs font-semibold text-[#66756F]">Average Revenue Per Account (ARPA)</span>
          <span className="font-numeric font-bold text-2xl sm:text-3xl text-[#141A17] block mt-1">₹ 1,04,025</span>
          <span className="text-[11px] font-bold text-[#1E7445] mt-1 block">Healthy enterprise tier ratio</span>
        </div>
      </div>

      {/* Revenue Breakdown Table */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E8E1D5] shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE1]">
          <h3 className="font-serif font-bold text-lg text-[#141A17]">
            Tenant Performance Ranking
          </h3>
        </div>

        <div className="overflow-x-auto border border-[#EFE8DC] rounded-2xl mt-4">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead>
              <tr className="bg-[#FAF8F5] text-[10.5px] uppercase font-bold text-[#6D7D76] tracking-wider border-b border-[#EFE8DC]">
                <th className="py-3.5 px-4 font-semibold">ORGANIZATION</th>
                <th className="py-3.5 px-4 font-semibold">MRR</th>
                <th className="py-3.5 px-4 font-semibold">YTD VOLUME</th>
                <th className="py-3.5 px-4 font-semibold">ACTIVE SEATS</th>
                <th className="py-3.5 px-4 font-semibold text-right">GROWTH RATE</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F4EFEA] bg-white">
              {orgRevenues.map((r, idx) => (
                <tr key={idx} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#141A17]">
                    {r.name}
                  </td>
                  <td className="py-3.5 px-4 font-numeric font-bold text-[#2D4A3E]">
                    {r.mrr}
                  </td>
                  <td className="py-3.5 px-4 font-numeric font-medium text-[#4A5550]">
                    {r.ytd}
                  </td>
                  <td className="py-3.5 px-4 font-numeric font-medium text-[#4A5550]">
                    {r.users} users
                  </td>
                  <td className="py-3.5 px-4 text-right font-numeric font-bold text-[#1E7445]">
                    {r.growth}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminReportsPage;
