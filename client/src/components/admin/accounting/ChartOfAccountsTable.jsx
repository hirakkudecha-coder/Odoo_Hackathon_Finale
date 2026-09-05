import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Plus, 
  ChevronDown, 
  Download, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown 
} from 'lucide-react';
import { exportTableToPDF } from '../../../utils/pdfGenerator';

export const ChartOfAccountsTable = ({ onAddAccount }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [groupFilter, setGroupFilter] = useState('All Account Groups');
  const [statusFilter, setStatusFilter] = useState('Active Accounts');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const handleExportPDF = () => {
    const headers = ['Account Code', 'Account Name', 'Type', 'Account Group', 'Current Balance (₹)', 'Status'];
    const rows = filteredAccounts.map(a => [a.code, a.accountName, a.type, a.accountGroup, `₹ ${a.balance}`, a.status]);
    exportTableToPDF('Chart of Accounts Ledger', headers, rows);
  };

  const rawAccounts = [
    {
      id: 1,
      code: '1000',
      accountName: 'Cash in Hand',
      type: 'Asset',
      typeStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      accountGroup: 'Current Assets',
      balance: '1,25,400.00',
      status: 'Active',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 2,
      code: '1010',
      accountName: 'Bank Account',
      type: 'Asset',
      typeStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      accountGroup: 'Current Assets',
      balance: '8,75,230.00',
      status: 'Active',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 3,
      code: '1100',
      accountName: 'Accounts Receivable',
      type: 'Asset',
      typeStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      accountGroup: 'Current Assets',
      balance: '4,32,600.00',
      status: 'Active',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 4,
      code: '2000',
      accountName: 'Accounts Payable',
      type: 'Liability',
      typeStyle: 'bg-[#FEEFEA] text-[#E05A2B]',
      accountGroup: 'Current Liabilities',
      balance: '3,21,450.00',
      status: 'Active',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 5,
      code: '2100',
      accountName: 'GST Payable',
      type: 'Liability',
      typeStyle: 'bg-[#FEEFEA] text-[#E05A2B]',
      accountGroup: 'Current Liabilities',
      balance: '1,05,300.00',
      status: 'Active',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 6,
      code: '3000',
      accountName: "Owner's Equity",
      type: 'Equity',
      typeStyle: 'bg-[#EBF3FE] text-[#2563EB]',
      accountGroup: 'Equity',
      balance: '15,45,850.00',
      status: 'Active',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 7,
      code: '4000',
      accountName: 'Sales Revenue',
      type: 'Income',
      typeStyle: 'bg-[#F3E8FF] text-[#7C3AED]',
      accountGroup: 'Operating Income',
      balance: '28,67,400.00',
      status: 'Active',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 8,
      code: '5000',
      accountName: 'Purchase Expenses',
      type: 'Expense',
      typeStyle: 'bg-[#FEE2E2] text-[#DC2626]',
      accountGroup: 'Cost of Goods Sold',
      balance: '12,34,500.00',
      status: 'Active',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
      statusDot: 'bg-[#10B981]',
    },
  ];

  // Filter accounts
  const filteredAccounts = useMemo(() => {
    return rawAccounts.filter((acc) => {
      if (typeFilter !== 'All Types' && acc.type !== typeFilter) return false;
      if (groupFilter !== 'All Account Groups' && acc.accountGroup !== groupFilter) return false;
      if (statusFilter === 'Active Accounts' && acc.status !== 'Active') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          acc.code.toLowerCase().includes(q) ||
          acc.accountName.toLowerCase().includes(q) ||
          acc.type.toLowerCase().includes(q) ||
          acc.accountGroup.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery, typeFilter, groupFilter, statusFilter]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredAccounts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAccounts.map((a) => a.id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E8E1D5] shadow-xs text-left">
      
      {/* 1. Header Row: Title & Add Account Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#F0EAE1]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F0EC] text-[#2D4A3E] flex items-center justify-center shrink-0 border border-[#D5E5DD] shadow-2xs">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#141A17] tracking-tight">
              Chart of Accounts
            </h2>
            <p className="text-xs text-[#6B7A74] mt-0.5">
              View and manage your company's chart of accounts.
            </p>
          </div>
        </div>

        {/* Right: Search Input and Add Account CTA Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A9791]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search accounts..."
              className="w-full bg-[#FAF8F5] border border-[#E4DCD0] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#141A17] placeholder-[#8A9791] focus:outline-hidden focus:border-[#2D4A3E] focus:bg-white transition-all shadow-2xs"
            />
          </div>

          <button
            onClick={onAddAccount}
            className="inline-flex items-center gap-2 bg-[#1C3A2F] hover:bg-[#142921] active:scale-95 text-[#FAF8F5] px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Account</span>
          </button>
        </div>
      </div>

      {/* 2. Dropdown Filters Bar */}
      <div className="flex flex-wrap items-center justify-end gap-2.5 py-4">
        {/* All Types Dropdown */}
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="appearance-none bg-white border border-[#E4DCD0] rounded-xl px-3.5 py-1.5 pr-8 text-xs font-semibold text-[#4A5550] hover:bg-[#FAF8F5] transition-all cursor-pointer shadow-2xs focus:outline-hidden"
          >
            <option>All Types</option>
            <option>Asset</option>
            <option>Liability</option>
            <option>Equity</option>
            <option>Income</option>
            <option>Expense</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7A8881] pointer-events-none" />
        </div>

        {/* All Account Groups Dropdown */}
        <div className="relative">
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="appearance-none bg-white border border-[#E4DCD0] rounded-xl px-3.5 py-1.5 pr-8 text-xs font-semibold text-[#4A5550] hover:bg-[#FAF8F5] transition-all cursor-pointer shadow-2xs focus:outline-hidden"
          >
            <option>All Account Groups</option>
            <option>Current Assets</option>
            <option>Current Liabilities</option>
            <option>Equity</option>
            <option>Operating Income</option>
            <option>Cost of Goods Sold</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7A8881] pointer-events-none" />
        </div>

        {/* Active Accounts Dropdown */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-white border border-[#E4DCD0] rounded-xl px-3.5 py-1.5 pr-8 text-xs font-semibold text-[#4A5550] hover:bg-[#FAF8F5] transition-all cursor-pointer shadow-2xs focus:outline-hidden"
          >
            <option>Active Accounts</option>
            <option>All Statuses</option>
            <option>Archived</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7A8881] pointer-events-none" />
        </div>

        {/* Export Button */}
        <button 
          onClick={handleExportPDF}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#E4DCD0] bg-white text-xs font-semibold text-[#4A5550] hover:bg-[#FAF8F5] hover:text-[#1C3A2F] active:scale-95 transition-all cursor-pointer shadow-2xs"
          title="Export Chart of Accounts PDF"
        >
          <Download className="w-3.5 h-3.5 text-[#7A8881]" />
          <span>Export PDF</span>
        </button>
      </div>

      {/* 3. Table Container */}
      <div className="overflow-x-auto border border-[#EFE8DC] rounded-2xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#FAF8F5] text-[10px] uppercase font-bold text-[#6D7D76] tracking-wider border-b border-[#EFE8DC]">
              <th className="py-3.5 px-4 w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredAccounts.length && filteredAccounts.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-[#DDD4C7] text-[#1C3A2F] focus:ring-[#1C3A2F] cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-4 font-semibold">
                <div className="flex items-center gap-1">
                  <span>CODE</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-[#9AA8A1]" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold">
                <div className="flex items-center gap-1">
                  <span>ACCOUNT NAME</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-[#9AA8A1]" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold">
                <div className="flex items-center gap-1">
                  <span>TYPE</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-[#9AA8A1]" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold">
                <div className="flex items-center gap-1">
                  <span>ACCOUNT GROUP</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-[#9AA8A1]" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold">
                <div className="flex items-center gap-1">
                  <span>BALANCE (₹)</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-[#9AA8A1]" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold">
                <div className="flex items-center gap-1">
                  <span>STATUS</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-[#9AA8A1]" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold text-right">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#F4EFEA] bg-white">
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((a) => {
                const isSelected = selectedIds.includes(a.id);
                return (
                  <tr 
                    key={a.id} 
                    className={`hover:bg-[#FAF7F2] transition-colors duration-150 cursor-pointer group ${
                      isSelected ? 'bg-[#F9F6F0]' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(a.id)}
                        className="rounded border-[#DDD4C7] text-[#1C3A2F] focus:ring-[#1C3A2F] cursor-pointer"
                      />
                    </td>

                    {/* Code */}
                    <td className="py-3.5 px-4 font-mono font-medium text-[#2D4A3E] group-hover:underline">
                      {a.code}
                    </td>

                    {/* Account Name */}
                    <td className="py-3.5 px-4 font-medium text-[#141A17] group-hover:text-[#2D4A3E] transition-colors">
                      {a.accountName}
                    </td>

                    {/* Type Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${a.typeStyle}`}>
                        {a.type}
                      </span>
                    </td>

                    {/* Account Group */}
                    <td className="py-3.5 px-4 text-[#5A6963] font-medium">
                      {a.accountGroup}
                    </td>

                    {/* Balance */}
                    <td className="py-3.5 px-4 font-numeric font-bold text-[#141A17] text-xs">
                      {a.balance}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${a.statusStyle}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${a.statusDot}`}></span>
                        <span>{a.status}</span>
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
                  No accounts found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Footer & Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 pt-4 border-t border-[#F0EAE1] text-xs text-[#6B7A74]">
        <span>
          Showing 1–{filteredAccounts.length} of 124 accounts
        </span>

        <div className="flex items-center gap-1.5">
          <button 
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-[#E4DCD0] bg-white hover:bg-[#FAF8F5] text-[#55635D] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button className="w-8 h-8 rounded-lg bg-[#EAE3D6] text-[#1C3A2F] font-bold text-xs flex items-center justify-center border border-[#DDD4C7] shadow-2xs">
            1
          </button>
          <button className="w-8 h-8 rounded-lg bg-white hover:bg-[#FAF8F5] text-[#55635D] font-medium text-xs flex items-center justify-center border border-[#E4DCD0] cursor-pointer">
            2
          </button>
          <button className="w-8 h-8 rounded-lg bg-white hover:bg-[#FAF8F5] text-[#55635D] font-medium text-xs flex items-center justify-center border border-[#E4DCD0] cursor-pointer">
            3
          </button>
          <button className="w-8 h-8 rounded-lg bg-white hover:bg-[#FAF8F5] text-[#55635D] font-medium text-xs flex items-center justify-center border border-[#E4DCD0] cursor-pointer">
            4
          </button>
          <button className="w-8 h-8 rounded-lg bg-white hover:bg-[#FAF8F5] text-[#55635D] font-medium text-xs flex items-center justify-center border border-[#E4DCD0] cursor-pointer">
            5
          </button>
          <span className="px-1 text-[#8A9791]">...</span>
          <button className="w-8 h-8 rounded-lg bg-white hover:bg-[#FAF8F5] text-[#55635D] font-medium text-xs flex items-center justify-center border border-[#E4DCD0] cursor-pointer">
            16
          </button>

          <button 
            className="p-1.5 rounded-lg border border-[#E4DCD0] bg-white hover:bg-[#FAF8F5] text-[#55635D] cursor-pointer transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default ChartOfAccountsTable;
