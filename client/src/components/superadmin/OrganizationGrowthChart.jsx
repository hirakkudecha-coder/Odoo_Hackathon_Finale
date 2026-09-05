import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const OrganizationGrowthChart = () => {
  const [period, setPeriod] = useState('Last 6 Months');

  const data = [
    { month: 'Mar', newOrgs: 4, existingOrgs: 7 },
    { month: 'Apr', newOrgs: 6, existingOrgs: 9 },
    { month: 'May', newOrgs: 7, existingOrgs: 12 },
    { month: 'Jun', newOrgs: 7, existingOrgs: 13 },
    { month: 'Jul', newOrgs: 8, existingOrgs: 15 },
    { month: 'Aug', newOrgs: 9, existingOrgs: 18 },
  ];

  const maxVal = 20;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E1D5] shadow-2xs flex flex-col justify-between h-full text-left">
      
      {/* Top Header & Period Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#F2EDE6]">
        <div>
          <h3 className="font-serif-luxury font-bold text-lg text-[#141A17] tracking-tight">
            Organization Growth
          </h3>
          <p className="text-xs text-[#6B7A74] mt-0.5">
            New organizations registered vs existing
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Legend */}
          <div className="hidden md:flex items-center gap-3 text-xs font-medium text-[#55665E]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E4839]" />
              <span>New Organizations</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D97736]" />
              <span>Existing Organizations</span>
            </span>
          </div>

          {/* Period Dropdown */}
          <div className="relative">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="appearance-none bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-1.5 pr-7 text-xs font-semibold text-[#3D4C45] hover:bg-[#F2ECE4] transition-all cursor-pointer shadow-2xs focus:outline-hidden"
            >
              <option>Last 6 Months</option>
              <option>Last 12 Months</option>
              <option>This Year (2026)</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#738C80] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Mobile Legend (Shown on small screens) */}
      <div className="flex md:hidden items-center gap-4 text-xs font-medium text-[#55665E] pt-3">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1E4839]" />
          <span>New Orgs</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D97736]" />
          <span>Existing Orgs</span>
        </span>
      </div>

      {/* Chart Canvas Area */}
      <div className="mt-6 flex-1 flex flex-col justify-end min-h-[190px]">
        <div className="flex items-end gap-3 sm:gap-6 w-full h-44 pb-2 border-b border-[#E8E1D5] relative">
          
          {/* Y-Axis Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] font-numeric text-[#8C9892]">
            <div className="border-b border-[#F2EDE6] w-full flex justify-between"><span>20</span></div>
            <div className="border-b border-[#F2EDE6] w-full flex justify-between"><span>15</span></div>
            <div className="border-b border-[#F2EDE6] w-full flex justify-between"><span>10</span></div>
            <div className="border-b border-[#F2EDE6] w-full flex justify-between"><span>5</span></div>
            <div className="flex justify-between"><span>0</span></div>
          </div>

          {/* Bars */}
          <div className="w-full flex justify-around items-end z-10 pl-6 pr-2 h-full">
            {data.map((item) => {
              const newHeight = (item.newOrgs / maxVal) * 100;
              const existingHeight = (item.existingOrgs / maxVal) * 100;

              return (
                <div key={item.month} className="flex flex-col items-center gap-1 group relative">
                  {/* Bar Group */}
                  <div className="flex items-end gap-1.5 h-36">
                    {/* New Orgs Bar (Green) */}
                    <div
                      style={{ height: `${newHeight}%` }}
                      className="w-3 sm:w-4.5 bg-[#1E4839] rounded-t-md hover:brightness-110 transition-all cursor-pointer relative"
                      title={`New: ${item.newOrgs}`}
                    />
                    {/* Existing Orgs Bar (Orange) */}
                    <div
                      style={{ height: `${existingHeight}%` }}
                      className="w-3 sm:w-4.5 bg-[#D97736] rounded-t-md hover:brightness-110 transition-all cursor-pointer relative"
                      title={`Existing: ${item.existingOrgs}`}
                    />
                  </div>

                  {/* Month Label */}
                  <span className="text-[11px] font-semibold text-[#66756F] group-hover:text-[#141A17] transition-colors mt-1 font-numeric">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </div>

    </div>
  );
};

export default OrganizationGrowthChart;
