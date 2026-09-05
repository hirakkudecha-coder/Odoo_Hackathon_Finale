import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const InvoiceBillStatusChart = () => {
  const [selectedRange, setSelectedRange] = useState('This Year');

  // Exact data distribution from photo (Jan to Sep)
  // Values normalized to 200K (2L) max height scale
  const data = [
    { month: 'Jan', invoices: 110, bills: 50 },
    { month: 'Feb', invoices: 125, bills: 90 },
    { month: 'Mar', invoices: 128, bills: 125 },
    { month: 'Apr', invoices: 115, bills: 132 },
    { month: 'May', invoices: 140, bills: 125 },
    { month: 'Jun', invoices: 118, bills: 128 },
    { month: 'Jul', invoices: 130, bills: 115 },
    { month: 'Aug', invoices: 150, bills: 125 },
    { month: 'Sep', invoices: 145, bills: 110 },
  ];

  const maxVal = 200; // Represents 2L

  return (
    <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-[#2D4A3E]/10 shadow-2xs flex flex-col justify-between h-full">
      
      {/* Header with Title, Legend & Dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="text-sm font-bold text-[#141A17] font-serif tracking-tight">
          Invoice & Bill Status
        </h3>

        <div className="flex items-center gap-4">
          {/* Legend */}
          <div className="flex items-center gap-3 text-[11px] font-medium text-[#4F5E56]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#244335]" />
              <span>Invoices</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C86D3B]" />
              <span>Bills</span>
            </div>
          </div>

          {/* Selector Dropdown */}
          <div className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-[#2D4A3E] bg-[#FAF8F5] border border-[#2D4A3E]/15 rounded-lg cursor-pointer">
            <span>{selectedRange}</span>
            <ChevronDown className="w-3 h-3 text-[#566B62]" />
          </div>
        </div>
      </div>

      {/* Grouped Bar Chart Area */}
      <div className="relative w-full h-52 flex items-end pt-4 pb-1">
        
        {/* Y-Axis Gridlines & Labels */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-[#8E9B95] font-medium pr-2">
          <div className="flex items-center justify-between border-b border-[#2D4A3E]/8 pb-0.5">
            <span className="w-6">2L</span>
            <div className="flex-1 border-b border-dashed border-[#2D4A3E]/10 ml-2" />
          </div>
          <div className="flex items-center justify-between border-b border-[#2D4A3E]/8 pb-0.5">
            <span className="w-6">1.5L</span>
            <div className="flex-1 border-b border-dashed border-[#2D4A3E]/10 ml-2" />
          </div>
          <div className="flex items-center justify-between border-b border-[#2D4A3E]/8 pb-0.5">
            <span className="w-6">1L</span>
            <div className="flex-1 border-b border-dashed border-[#2D4A3E]/10 ml-2" />
          </div>
          <div className="flex items-center justify-between border-b border-[#2D4A3E]/8 pb-0.5">
            <span className="w-6">50K</span>
            <div className="flex-1 border-b border-dashed border-[#2D4A3E]/10 ml-2" />
          </div>
          <div className="flex items-center justify-between">
            <span className="w-6">0</span>
            <div className="flex-1 border-b border-[#2D4A3E]/15 ml-2" />
          </div>
        </div>

        {/* Bars Container */}
        <div className="w-full pl-8 pr-1 grid grid-cols-9 gap-1 sm:gap-2 h-full items-end z-10">
          {data.map((item) => {
            const invoiceHeight = (item.invoices / maxVal) * 100;
            const billHeight = (item.bills / maxVal) * 100;

            return (
              <div key={item.month} className="flex flex-col items-center h-full justify-end group">
                <div className="flex items-end gap-1 h-[78%] w-full justify-center">
                  
                  {/* Invoice Bar (Dark Green) */}
                  <div
                    style={{ height: `${invoiceHeight}%` }}
                    className="w-2.5 sm:w-3.5 bg-[#244335] rounded-t-xs hover:bg-[#182F25] transition-all duration-300"
                    title={`Invoices: ₹ ${(item.invoices * 1000).toLocaleString()}`}
                  />
                  
                  {/* Bill Bar (Terracotta Orange) */}
                  <div
                    style={{ height: `${billHeight}%` }}
                    className="w-2.5 sm:w-3.5 bg-[#C86D3B] rounded-t-xs hover:bg-[#A8582C] transition-all duration-300"
                    title={`Bills: ₹ ${(item.bills * 1000).toLocaleString()}`}
                  />
                </div>

                {/* X-Axis Month Label */}
                <span className="text-[10.5px] font-medium text-[#687C72] mt-2 group-hover:text-[#141A17] transition-colors">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};

export default InvoiceBillStatusChart;
