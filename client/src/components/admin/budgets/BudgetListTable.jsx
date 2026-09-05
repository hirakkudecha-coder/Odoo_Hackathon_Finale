import React, { useState, useMemo } from 'react';
import { 
  BarChart2, 
  Search, 
  Plus, 
  ChevronDown, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  ArrowUpDown
} from 'lucide-react';

export const BudgetListTable = ({ onCreateBudget }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('Select Year');
  const [selectedIds, setSelectedIds] = useState([]);

  const rawBudgets = [
    {
      id: 1,
      department: 'Production',
      budgetAmount: '8,00,000',
      actualAmount: '6,25,400',
      variance: '1,74,600',
      utilization: 78,
      status: 'On Track',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 2,
      department: 'Marketing',
      budgetAmount: '4,00,000',
      actualAmount: '3,95,600',
      variance: '4,400',
      utilization: 99,
      status: 'At Risk',
      statusStyle: 'bg-[#FEF7EC] text-[#D97706]',
      statusDot: 'bg-[#F59E0B]',
    },
    {
      id: 3,
      department: 'Administration',
      budgetAmount: '3,00,000',
      actualAmount: '2,10,300',
      variance: '89,700',
      utilization: 70,
      status: 'On Track',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 4,
      department: 'Research & Development',
      budgetAmount: '2,50,000',
      actualAmount: '1,80,750',
      variance: '69,250',
      utilization: 72,
      status: 'On Track',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 5,
      department: 'Human Resources',
      budgetAmount: '2,00,000',
      actualAmount: '1,64,400',
      variance: '35,600',
      utilization: 82,
      status: 'On Track',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 6,
      department: 'IT & Infrastructure',
      budgetAmount: '1,50,000',
      actualAmount: '99,600',
      variance: '50,400',
      utilization: 66,
      status: 'On Track',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      statusDot: 'bg-[#10B981]',
    },
  ];

  const filteredBudgets = useMemo(() => {
    return rawBudgets.filter((b) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          b.department.toLowerCase().includes(q) ||
          b.status.toLowerCase().includes(q) ||
          b.budgetAmount.includes(q)
        );
      }
      return true;
    });
  }, [searchQuery]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredBudgets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredBudgets.map((b) => b.id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E8E1D5] shadow-xs text-left">
      
      {/* 1. Header Row: Title & Action Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#F0EAE1]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F0EC] text-[#2D4A3E] flex items-center justify-center shrink-0 border border-[#D5E5DD] shadow-2xs">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#141A17] tracking-tight">
              Budget List
            </h2>
            <p className="text-xs text-[#6B7A74] mt-0.5">
              Manage and track all departmental budgets.
            </p>
          </div>
        </div>

        {/* Right Search, Select Year & Create Button */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A9791]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search budgets..."
              className="w-full bg-[#FAF8F5] border border-[#E4DCD0] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#141A17] placeholder-[#8A9791] focus:outline-hidden focus:border-[#2D4A3E] focus:bg-white transition-all shadow-2xs"
            />
          </div>

          {/* Select Year Dropdown */}
          <div className="relative">
            <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E4DCD0] bg-white text-xs font-semibold text-[#4A5550] hover:bg-[#FAF8F5] transition-all cursor-pointer shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-[#7A8881]" />
              <span>Select Year</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#7A8881]" />
            </button>
          </div>

          <button
            onClick={onCreateBudget}
            className="inline-flex items-center gap-2 bg-[#1C3A2F] hover:bg-[#142921] active:scale-95 text-[#FAF8F5] px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Budget</span>
          </button>
        </div>
      </div>

      {/* 2. Table Container */}
      <div className="overflow-x-auto border border-[#EFE8DC] rounded-2xl mt-5">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#FAF8F5] text-[10px] uppercase font-bold text-[#6D7D76] tracking-wider border-b border-[#EFE8DC]">
              <th className="py-3.5 px-4 w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredBudgets.length && filteredBudgets.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-[#DDD4C7] text-[#1C3A2F] focus:ring-[#1C3A2F] cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-4 font-semibold">
                <div className="flex items-center gap-1">
                  <span>DEPARTMENT</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-[#9AA8A1]" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold">
                <div className="flex items-center gap-1">
                  <span>BUDGET AMOUNT (₹)</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-[#9AA8A1]" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold">
                <div className="flex items-center gap-1">
                  <span>ACTUAL AMOUNT (₹)</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-[#9AA8A1]" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold">
                <div className="flex items-center gap-1">
                  <span>VARIANCE (₹)</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-[#9AA8A1]" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold min-w-[140px]">
                UTILIZATION
              </th>
              <th className="py-3.5 px-4 font-semibold">
                STATUS
              </th>
              <th className="py-3.5 px-4 font-semibold text-right">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#F4EFEA] bg-white">
            {filteredBudgets.length > 0 ? (
              filteredBudgets.map((b) => {
                const isSelected = selectedIds.includes(b.id);
                return (
                  <tr 
                    key={b.id} 
                    className={`hover:bg-[#FAF7F2] transition-colors duration-150 cursor-pointer group ${
                      isSelected ? 'bg-[#F9F6F0]' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(b.id)}
                        className="rounded border-[#DDD4C7] text-[#1C3A2F] focus:ring-[#1C3A2F] cursor-pointer"
                      />
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4 font-medium text-[#141A17] group-hover:text-[#2D4A3E] transition-colors">
                      {b.department}
                    </td>

                    {/* Budget Amount */}
                    <td className="py-3.5 px-4 font-medium text-[#4A5952]">
                      {b.budgetAmount}
                    </td>

                    {/* Actual Amount */}
                    <td className="py-3.5 px-4 font-medium text-[#4A5952]">
                      {b.actualAmount}
                    </td>

                    {/* Variance */}
                    <td className="py-3.5 px-4 font-medium text-[#4A5952]">
                      {b.variance}
                    </td>

                    {/* Utilization Progress Bar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 sm:w-28 bg-[#EFE9DF] rounded-full h-2 overflow-hidden">
                          <div 
                            style={{ width: `${b.utilization}%` }}
                            className={`h-full rounded-full ${
                              b.status === 'At Risk' ? 'bg-[#2D4A3E]' : 'bg-[#2D4A3E]'
                            }`}
                          />
                        </div>
                        <span className="font-semibold text-xs text-[#141A17] min-w-[32px]">
                          {b.utilization}%
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${b.statusStyle}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${b.statusDot}`}></span>
                        <span>{b.status}</span>
                      </span>
                    </td>

                    {/* Actions Button */}
                    <td className="py-3.5 px-4 text-right">
                      <button 
                        className="p-1.5 rounded-lg text-[#85988F] hover:text-[#141A17] hover:bg-[#EFE9DF] transition-colors cursor-pointer"
                        title="More Options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-8 text-center text-[#7A8881] text-xs">
                  No budgets found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Footer & Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 pt-4 border-t border-[#F0EAE1] text-xs text-[#6B7A74]">
        <span>
          Showing 1–{filteredBudgets.length} of 6 budgets
        </span>

        <div className="flex items-center gap-1.5">
          <button 
            disabled
            className="p-1.5 rounded-lg border border-[#E4DCD0] bg-white text-[#55635D] opacity-40 cursor-not-allowed transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button className="w-8 h-8 rounded-lg bg-[#EAE3D6] text-[#1C3A2F] font-bold text-xs flex items-center justify-center border border-[#DDD4C7] shadow-2xs">
            1
          </button>

          <button 
            disabled
            className="p-1.5 rounded-lg border border-[#E4DCD0] bg-white text-[#55635D] opacity-40 cursor-not-allowed transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default BudgetListTable;
