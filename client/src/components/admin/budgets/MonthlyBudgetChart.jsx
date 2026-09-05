import React from 'react';

export const MonthlyBudgetChart = () => {
  const monthsData = [
    { month: 'Jan', budgeted: 3.8, actual: 2.8 },
    { month: 'Feb', budgeted: 4.8, actual: 3.2 },
    { month: 'Mar', budgeted: 4.0, actual: 3.0 },
    { month: 'Apr', budgeted: 4.0, actual: 3.1 },
    { month: 'May', budgeted: 3.6, actual: 5.4 },
    { month: 'Jun', budgeted: 4.0, actual: 3.0 },
    { month: 'Jul', budgeted: 4.8, actual: 2.9 },
    { month: 'Aug', budgeted: 4.0, actual: 3.0 },
    { month: 'Sep', budgeted: 4.3, actual: 3.0 },
    { month: 'Oct', budgeted: 4.3, actual: 3.2 },
    { month: 'Nov', budgeted: 5.4, actual: 4.2 },
    { month: 'Dec', budgeted: 3.9, actual: 2.8 },
  ];

  const maxVal = 6.0;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E1D5] shadow-xs text-left h-full flex flex-col justify-between">
      {/* Title & Legend Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
        <h3 className="font-serif font-bold text-lg text-[#141A17] tracking-tight">
          Monthly Budget vs Actual
        </h3>
        
        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#1C3A2F]"></span>
            <span className="text-[#55635D] font-medium text-[11px]">Budgeted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#8FA89B]"></span>
            <span className="text-[#55635D] font-medium text-[11px]">Actual</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative pt-2 pb-1 flex-1 flex flex-col justify-end">
        {/* Y Axis Guide Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-[#9BA8A2] font-mono pr-2">
          <div className="flex items-center gap-2 border-b border-[#F0EAE1] w-full pb-1">
            <span className="w-7 text-right">₹ 6L</span>
            <div className="flex-1"></div>
          </div>
          <div className="flex items-center gap-2 border-b border-[#F0EAE1] w-full pb-1">
            <span className="w-7 text-right">₹ 4L</span>
            <div className="flex-1"></div>
          </div>
          <div className="flex items-center gap-2 border-b border-[#F0EAE1] w-full pb-1">
            <span className="w-7 text-right">₹ 2L</span>
            <div className="flex-1"></div>
          </div>
          <div className="flex items-center gap-2 border-b border-[#E8E1D5] w-full pb-0.5">
            <span className="w-7 text-right">0</span>
            <div className="flex-1"></div>
          </div>
        </div>

        {/* Paired Bars */}
        <div className="relative z-10 pl-9 pr-1 flex items-end justify-between h-44 gap-1.5 sm:gap-2">
          {monthsData.map((d, i) => {
            const bHeight = `${(d.budgeted / maxVal) * 100}%`;
            const aHeight = `${(d.actual / maxVal) * 100}%`;
            return (
              <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-full">
                  {/* Budgeted Bar */}
                  <div 
                    style={{ height: bHeight }} 
                    className="w-full max-w-[12px] bg-[#1C3A2F] rounded-t-xs transition-all duration-300 group-hover:brightness-110"
                    title={`Budgeted: ₹ ${d.budgeted}L`}
                  />
                  {/* Actual Bar */}
                  <div 
                    style={{ height: aHeight }} 
                    className="w-full max-w-[12px] bg-[#8FA89B] rounded-t-xs transition-all duration-300 group-hover:brightness-110"
                    title={`Actual: ₹ ${d.actual}L`}
                  />
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-[#7A8A83] mt-2 group-hover:text-[#141A17] transition-colors">
                  {d.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MonthlyBudgetChart;
