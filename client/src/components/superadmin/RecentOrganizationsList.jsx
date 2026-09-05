import React from 'react';
import { Building2, ArrowRight } from 'lucide-react';

export const RecentOrganizationsList = ({ onViewAll }) => {
  const orgs = [
    { id: 1, name: 'Elegant Homes', date: '10 Aug 2024', status: 'Active', statusStyle: 'bg-[#E5F7ED] text-[#1E7445]', dot: 'bg-[#10B981]' },
    { id: 2, name: 'Modern Spaces', date: '08 Aug 2024', status: 'Active', statusStyle: 'bg-[#E5F7ED] text-[#1E7445]', dot: 'bg-[#10B981]' },
    { id: 3, name: 'Wood & More', date: '05 Aug 2024', status: 'Pending', statusStyle: 'bg-[#FEF7EC] text-[#D97706]', dot: 'bg-[#F59E0B]' },
    { id: 4, name: 'Interior Hub', date: '01 Aug 2024', status: 'Active', statusStyle: 'bg-[#E5F7ED] text-[#1E7445]', dot: 'bg-[#10B981]' },
    { id: 5, name: 'Space Living', date: '28 Jul 2024', status: 'Active', statusStyle: 'bg-[#E5F7ED] text-[#1E7445]', dot: 'bg-[#10B981]' },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E1D5] shadow-2xs flex flex-col justify-between h-full text-left">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#F2EDE6]">
        <h3 className="font-serif-luxury font-bold text-lg text-[#141A17] tracking-tight">
          Recent Organizations
        </h3>
        <button
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#2D4A3E] hover:text-[#14231C] hover:underline cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* List */}
      <div className="divide-y divide-[#F5EFE8] mt-1 flex-1 flex flex-col justify-around">
        {orgs.map((org) => (
          <div key={org.id} className="py-2.5 flex items-center justify-between gap-3 hover:bg-[#FAF8F5] px-2 rounded-xl transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#E8F3ED] text-[#1E7445] flex items-center justify-center shrink-0 border border-[#D3E8DC]">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#141A17] hover:text-[#2D4A3E] transition-colors">
                  {org.name}
                </p>
                <p className="text-[10.5px] text-[#7A8A83] font-numeric">
                  {org.date}
                </p>
              </div>
            </div>

            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${org.statusStyle}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${org.dot}`} />
              <span>{org.status}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrganizationsList;
