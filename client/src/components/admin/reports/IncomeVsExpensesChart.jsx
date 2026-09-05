import React from 'react';

export const IncomeVsExpensesChart = () => {
  const monthsData = [
    { month: 'Jan', income: 7.8, expenses: 4.8 },
    { month: 'Feb', income: 5.8, expenses: 3.2 },
    { month: 'Mar', income: 6.7, expenses: 4.0 },
    { month: 'Apr', income: 5.9, expenses: 4.2 },
    { month: 'May', income: 7.2, expenses: 5.4 },
    { month: 'Jun', income: 6.1, expenses: 3.9 },
    { month: 'Jul', income: 6.0, expenses: 3.8 },
    { month: 'Aug', income: 7.3, expenses: 4.6 },
    { month: 'Sep', income: 6.3, expenses: 3.9 },
    { month: 'Oct', income: 6.4, expenses: 4.1 },
    { month: 'Nov', income: 7.9, expenses: 4.7 },
    { month: 'Dec', income: 6.2, expenses: 4.5 },
  ];

  const maxVal = 10.0;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E1D5] shadow-xs text-left h-full flex flex-col justify-between">
      {/* Title & Legend Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
        <h3 className="font-serif font-bold text-lg text-[#141A17] tracking-tight">
          Income vs Expenses
        </h3>
        
        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#1C3A2F]"></span>
            <span className="text-[#55635D] font-medium text-[11px]">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#8FA89B]"></span>
            <span className="text-[#55635D] font-medium text-[11px]">Expenses</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative pt-2 pb-1 flex-1 flex flex-col justify-end">
        {/* Y Axis Guide Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-[#9BA8A2] font-mono pr-2">
          <div className="flex items-center gap-2 border-b border-[#F0EAE1] w-full pb-1">
            <span className="w-7 text-right">₹ 10L</span>
            <div className="flex-1"></div>
          </div>
          <div className="flex items-center gap-2 border-b border-[#F0EAE1] w-full pb-1">
            <span className="w-7 text-right">₹ 8L</span>
            <div className="flex-1"></div>
          </div>
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
            const iHeight = `${(d.income / maxVal) * 100}%`;
            const eHeight = `${(d.expenses / maxVal) * 100}%`;
            return (
              <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-full">
                  {/* Income Bar */}
                  <div 
                    style={{ height: iHeight }} 
                    className="w-full max-w-[12px] bg-[#1C3A2F] rounded-t-xs transition-all duration-300 group-hover:brightness-110"
                    title={`Income: ₹ ${d.income}L`}
                  />
                  {/* Expense Bar */}
                  <div 
                    style={{ height: eHeight }} 
                    className="w-full max-w-[12px] bg-[#8FA89B] rounded-t-xs transition-all duration-300 group-hover:brightness-110"
                    title={`Expenses: ₹ ${d.expenses}L`}
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

export default IncomeVsExpensesChart;
