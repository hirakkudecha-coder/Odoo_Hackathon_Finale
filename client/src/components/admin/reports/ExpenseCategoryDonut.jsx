import React from 'react';

export const ExpenseCategoryDonut = () => {
  const expenseData = [
    { label: 'Raw Materials', percentage: 32, color: '#1C3A2F' },
    { label: 'Salaries & Wages', percentage: 22, color: '#5A8471' },
    { label: 'Rent & Utilities', percentage: 15, color: '#B49A78' },
    { label: 'Marketing', percentage: 12, color: '#C26D43' },
    { label: 'Office Expenses', percentage: 10, color: '#D4B896' },
    { label: 'Others', percentage: 9, color: '#CBD5E1' },
  ];

  // SVG Donut calculation
  const size = 180;
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E1D5] shadow-xs text-left h-full flex flex-col justify-between">
      {/* Title */}
      <h3 className="font-serif font-bold text-lg text-[#141A17] tracking-tight mb-4">
        Expense by Category
      </h3>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-auto">
        
        {/* SVG Donut Chart with Center Total */}
        <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
            {expenseData.map((item, index) => {
              const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
              accumulatedPercent += item.percentage;

              return (
                <circle
                  key={index}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 hover:opacity-90 cursor-pointer"
                />
              );
            })}
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="font-serif font-bold text-xs sm:text-sm text-[#141A17] tracking-tight leading-tight">
              ₹ 12,34,500
            </span>
            <span className="text-[10px] text-[#7A8A83] font-medium mt-0.5">
              Total Expenses
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 w-full space-y-2 text-xs">
          {expenseData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs py-0.5">
              <div className="flex items-center gap-2">
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: item.color }} 
                />
                <span className="text-[#4D5C56] font-medium text-[11.5px]">
                  {item.label}
                </span>
              </div>
              <span className="font-semibold text-[#141A17] text-[11.5px]">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ExpenseCategoryDonut;
