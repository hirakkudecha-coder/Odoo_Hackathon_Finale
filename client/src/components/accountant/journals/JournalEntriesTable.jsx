import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Filter, 
  Download, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';

export const JournalEntriesTable = ({ onCreateEntry }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState('All');

  const rawEntries = [
    {
      id: 1,
      entryNo: 'MISC/2025/09/0001',
      date: '02 Sep 2025',
      reference: 'Depreciation of Showroom Furniture',
      journal: 'Miscellaneous Operations',
      debit: '₹ 14,500.00',
      credit: '₹ 14,500.00',
      status: 'Posted',
      statusDot: 'bg-[#10B981]',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
    },
    {
      id: 2,
      entryNo: 'INV/2025/09/0012',
      date: '02 Sep 2025',
      reference: 'Customer Invoice - Nimesh Pathak',
      journal: 'Customer Invoices',
      debit: '₹ 24,500.00',
      credit: '₹ 24,500.00',
      status: 'Posted',
      statusDot: 'bg-[#10B981]',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
    },
    {
      id: 3,
      entryNo: 'BILL/2025/09/0021',
      date: '02 Sep 2025',
      reference: 'Vendor Bill - Azure Furniture',
      journal: 'Vendor Bills',
      debit: '₹ 18,000.00',
      credit: '₹ 18,000.00',
      status: 'Posted',
      statusDot: 'bg-[#10B981]',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
    },
    {
      id: 4,
      entryNo: 'BNK/2025/08/0045',
      date: '30 Aug 2025',
      reference: 'Bank Transfer Settlement - Woodland',
      journal: 'Bank',
      debit: '₹ 33,200.00',
      credit: '₹ 33,200.00',
      status: 'Posted',
      statusDot: 'bg-[#10B981]',
      statusStyle: 'bg-[#E5F7ED] text-[#1E7445]',
    },
    {
      id: 5,
      entryNo: 'MISC/2025/08/0032',
      date: '28 Aug 2025',
      reference: 'End of Month Accrual Adjustment',
      journal: 'Miscellaneous Operations',
      debit: '₹ 8,750.00',
      credit: '₹ 8,750.00',
      status: 'Draft',
      statusDot: 'bg-[#F59E0B]',
      statusStyle: 'bg-[#FEF7EC] text-[#D97706]',
    },
  ];

  const filterTabs = ['All', 'Posted', 'Draft', 'Customer Invoices', 'Vendor Bills', 'Bank'];

  const filteredEntries = useMemo(() => {
    let result = rawEntries;
    if (activeFilterTab === 'Posted') result = result.filter((e) => e.status === 'Posted');
    else if (activeFilterTab === 'Draft') result = result.filter((e) => e.status === 'Draft');
    else if (activeFilterTab !== 'All') result = result.filter((e) => e.journal === activeFilterTab);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((e) =>
        e.entryNo.toLowerCase().includes(q) ||
        e.reference.toLowerCase().includes(q) ||
        e.journal.toLowerCase().includes(q)
      );
    }
    return result;
  }, [searchQuery, activeFilterTab]);

  return (
    <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-xs overflow-hidden transition-all duration-300">
      <div className="p-5 sm:p-6 border-b border-[#F0EAE1] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#F4EFE6] text-[#1C3A2F] flex items-center justify-center border border-[#E5DDD0] shadow-2xs shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#141A17] tracking-tight">
              Journal Entries
            </h2>
            <p className="text-xs text-[#6B7A74] mt-0.5">
              Review and audit balanced debit-credit accounting journal records.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-[#8A9B93] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search journal entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl pl-9 pr-3 py-2 text-xs text-[#141A17] placeholder:text-[#8A9B93] focus:outline-hidden focus:border-[#1C3A2F] focus:ring-1 focus:ring-[#1C3A2F] transition-all"
            />
          </div>

          <button
            type="button"
            onClick={onCreateEntry}
            className="inline-flex items-center gap-2 bg-[#1C3A2F] hover:bg-[#142C23] text-[#FAF8F5] text-xs font-semibold px-4 py-2 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Entry</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      <div className="px-5 sm:px-6 py-3.5 bg-[#FAF8F5]/80 border-b border-[#F0EAE1] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilterTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeFilterTab === tab
                  ? 'bg-[#1C3A2F] text-white shadow-2xs'
                  : 'bg-white text-[#5B6963] border border-[#E8E1D5] hover:bg-[#F2ECE4] hover:text-[#141A17]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button type="button" className="inline-flex items-center gap-1.5 bg-white border border-[#E2DAD0] hover:bg-[#F5EFE6] text-[#4A5952] text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-[#738C80]" />
            <span>Filter</span>
          </button>
          <button type="button" className="inline-flex items-center gap-1.5 bg-white border border-[#E2DAD0] hover:bg-[#F5EFE6] text-[#4A5952] text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs">
            <Download className="w-3.5 h-3.5 text-[#738C80]" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-187.5">
          <thead>
            <tr className="border-b border-[#EAE3D7] bg-[#F7F4EE] text-[11px] font-bold text-[#55665E] uppercase tracking-wider">
              <th className="py-3.5 pl-6 pr-3">Number</th>
              <th className="py-3.5 px-3">Date</th>
              <th className="py-3.5 px-3">Reference / Description</th>
              <th className="py-3.5 px-3">Journal</th>
              <th className="py-3.5 px-3">Total Debit</th>
              <th className="py-3.5 px-3">Total Credit</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 pr-6 pl-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EAE1] text-xs text-[#141A17]">
            {filteredEntries.map((e) => (
              <tr key={e.id} className="hover:bg-[#FAF7F2] transition-colors">
                <td className="py-3.5 pl-6 pr-3 font-semibold text-[#1C3A2F] font-mono">
                  {e.entryNo}
                </td>
                <td className="py-3.5 px-3 text-[#55665E]">{e.date}</td>
                <td className="py-3.5 px-3 font-semibold text-[#141A17]">{e.reference}</td>
                <td className="py-3.5 px-3 text-[#55665E]">{e.journal}</td>
                <td className="py-3.5 px-3 font-bold font-serif text-[#141A17]">{e.debit}</td>
                <td className="py-3.5 px-3 font-bold font-serif text-[#141A17]">{e.credit}</td>
                <td className="py-3.5 px-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${e.statusStyle} shadow-2xs`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${e.statusDot}`} />
                    <span>{e.status}</span>
                  </span>
                </td>
                <td className="py-3.5 pr-6 pl-3 text-right">
                  <button type="button" className="p-1.5 rounded-lg text-[#738C80] hover:text-[#141A17] hover:bg-[#EAE4DC] transition-colors cursor-pointer">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-[#F0EAE1] bg-[#FAF8F5]/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#55665E]">
        <span>Showing 1 to {filteredEntries.length} of {rawEntries.length} journal entries</span>
        <div className="flex items-center gap-1.5">
          <button type="button" className="p-1.5 rounded-lg border border-[#E2DAD0] bg-white hover:bg-[#F2ECE4] cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
          <span className="px-3 py-1 bg-[#1C3A2F] text-white font-bold rounded-lg shadow-2xs">1</span>
          <button type="button" className="p-1.5 rounded-lg border border-[#E2DAD0] bg-white hover:bg-[#F2ECE4] cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
};

export default JournalEntriesTable;
