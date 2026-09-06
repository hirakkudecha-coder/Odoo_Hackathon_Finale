import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  Download, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown 
} from 'lucide-react';
import { exportTableToPDF } from '../../../utils/pdfGenerator';

export const ContactsTableView = ({ onCreateContact }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Customers' | 'Vendors' | 'Others'
  const [currentPage, setCurrentPage] = useState(1);

  const handleExportPDF = () => {
    const headers = ['#', 'CONTACT NAME', 'TYPE', 'EMAIL', 'PHONE', 'CITY', 'STATUS'];
    const rows = filteredContacts.map((c, idx) => [
      String(idx + 1),
      c.name,
      c.type,
      c.email,
      c.phone,
      c.city,
      c.status
    ]);
    exportTableToPDF('CONTACTS & PARTNERS MASTER DIRECTORY', headers, rows);
  };

  const rawContacts = [
    {
      id: 1,
      name: 'Rohan Kapoor',
      initials: 'RK',
      avatarBg: 'bg-[#E5DCD0] text-[#14231C]',
      type: 'Customer',
      typeBadge: 'bg-[#E5F7ED] text-[#1E7445]',
      email: 'rohan@kapoorinteriors.com',
      phone: '+91 98765 43210',
      city: 'Mumbai',
      status: 'Active',
      statusBadge: 'bg-[#E5F7ED] text-[#1E7445]',
    },
    {
      id: 2,
      name: 'Sheetal Living',
      initials: 'SL',
      avatarBg: 'bg-[#E0E6E3] text-[#1F4536]',
      type: 'Customer',
      typeBadge: 'bg-[#E5F7ED] text-[#1E7445]',
      email: 'contact@sheetalliving.in',
      phone: '+91 98210 11223',
      city: 'Delhi',
      status: 'Active',
      statusBadge: 'bg-[#E5F7ED] text-[#1E7445]',
    },
    {
      id: 3,
      name: 'HomeWorks Supplies',
      initials: 'HW',
      avatarBg: 'bg-[#F4E8DC] text-[#8B4513]',
      type: 'Vendor',
      typeBadge: 'bg-[#FEF1E8] text-[#D65D33]',
      email: 'sales@homeworks.com',
      phone: '+91 98900 55667',
      city: 'Bengaluru',
      status: 'Active',
      statusBadge: 'bg-[#E5F7ED] text-[#1E7445]',
    },
    {
      id: 4,
      name: 'DesignCraft',
      initials: 'DC',
      avatarBg: 'bg-[#E5DCD0] text-[#14231C]',
      type: 'Vendor',
      typeBadge: 'bg-[#FEF1E8] text-[#D65D33]',
      email: 'info@designcraft.in',
      phone: '+91 97123 44556',
      city: 'Ahmedabad',
      status: 'Inactive',
      statusBadge: 'bg-[#FDECE7] text-[#C95426]',
    },
    {
      id: 5,
      name: 'NextGen Interiors',
      initials: 'NG',
      avatarBg: 'bg-[#E0E6E3] text-[#1F4536]',
      type: 'Customer',
      typeBadge: 'bg-[#E5F7ED] text-[#1E7445]',
      email: 'hello@nextgen.co',
      phone: '+91 98333 77889',
      city: 'Pune',
      status: 'Active',
      statusBadge: 'bg-[#E5F7ED] text-[#1E7445]',
    },
    {
      id: 6,
      name: 'Urban Roots',
      initials: 'UR',
      avatarBg: 'bg-[#E2E8F0] text-[#334155]',
      type: 'Other',
      typeBadge: 'bg-[#EBF3FE] text-[#2563EB]',
      email: 'info@urbanroots.in',
      phone: '+91 97654 32109',
      city: 'Jaipur',
      status: 'Active',
      statusBadge: 'bg-[#E5F7ED] text-[#1E7445]',
    },
  ];

  const [apiContacts, setApiContacts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadContacts = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch('/api/contacts', { headers });
        if (res.ok) {
          const json = await res.json();
          if (json.contacts && Array.isArray(json.contacts) && json.contacts.length > 0) {
            const mapped = json.contacts.map((c, idx) => {
              const initials = c.name ? c.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'CO';
              const isCust = c.type === 'Customer';
              const isVend = c.type === 'Vendor';
              return {
                id: c._id || idx + 1,
                name: c.name,
                initials,
                avatarBg: isCust ? 'bg-[#E5DCD0] text-[#14231C]' : isVend ? 'bg-[#F4E8DC] text-[#8B4513]' : 'bg-[#E0E6E3] text-[#1F4536]',
                type: c.type || 'Customer',
                typeBadge: isCust ? 'bg-[#E5F7ED] text-[#1E7445]' : isVend ? 'bg-[#FEF1E8] text-[#D65D33]' : 'bg-[#EBF3FE] text-[#2563EB]',
                email: c.email || '—',
                phone: c.mobile || '—',
                city: c.address?.city || 'India',
                status: c.status === 'archived' ? 'Inactive' : 'Active',
                statusBadge: c.status === 'archived' ? 'bg-[#FDECE7] text-[#C95426]' : 'bg-[#E5F7ED] text-[#1E7445]'
              };
            });
            if (isMounted) setApiContacts(mapped);
          }
        }
      } catch (err) {
        console.warn('Live contacts fetch failed, using fallback:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadContacts();
    return () => { isMounted = false; };
  }, []);

  const displayedContacts = apiContacts || rawContacts;

  // Filter contacts by tab and search
  const filteredContacts = useMemo(() => {
    return displayedContacts.filter((contact) => {
      // Tab filter
      if (activeTab === 'Customers' && contact.type !== 'Customer') return false;
      if (activeTab === 'Vendors' && contact.type !== 'Vendor') return false;
      if (activeTab === 'Others' && contact.type === 'Customer' && contact.type === 'Vendor') return false;

      // Search filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        return (
          contact.name.toLowerCase().includes(query) ||
          contact.email.toLowerCase().includes(query) ||
          contact.phone.includes(query) ||
          contact.city.toLowerCase().includes(query) ||
          contact.type.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [displayedContacts, activeTab, searchQuery]);

  const tabs = ['All', 'Customers', 'Vendors', 'Others'];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E8E1D5] shadow-xs text-left">
      
      {/* 1. Header Row: Title & Action Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#F0EAE1]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F0EC] text-[#2D4A3E] flex items-center justify-center shrink-0 border border-[#D5E5DD] shadow-2xs">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#141A17] tracking-tight">
              Contacts
            </h2>
            <p className="text-xs text-[#6B7A74] mt-0.5">
              Manage your customers, vendors and all contacts.
            </p>
          </div>
        </div>

        {/* Right Search and Create Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A9791]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts..."
              className="w-full bg-[#FAF8F5] border border-[#E4DCD0] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#141A17] placeholder-[#8A9791] focus:outline-hidden focus:border-[#2D4A3E] focus:bg-white transition-all shadow-2xs"
            />
          </div>

          <button
            onClick={onCreateContact}
            className="inline-flex items-center gap-2 bg-[#1C3A2F] hover:bg-[#142921] active:scale-95 text-[#FAF8F5] px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Contact</span>
          </button>
        </div>
      </div>

      {/* 2. Filter & Export Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F5F1EA]/80 rounded-xl border border-[#E8E1D5] w-full sm:w-auto overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#1C3A2F] text-[#FAF8F5] font-semibold shadow-2xs'
                    : 'text-[#66756F] hover:text-[#141A17] hover:bg-white/60'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Right Action Dropdowns: Filter & Export */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E4DCD0] bg-white text-xs font-semibold text-[#4A5550] hover:bg-[#FAF8F5] hover:text-[#141A17] transition-all cursor-pointer shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-[#7A8881]" />
            <span>Filter</span>
          </button>

          <button 
            onClick={handleExportPDF}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E4DCD0] bg-white text-xs font-semibold text-[#4A5550] hover:bg-[#FAF8F5] hover:text-[#1C3A2F] active:scale-95 transition-all cursor-pointer shadow-2xs"
            title="Export Contacts Directory PDF"
          >
            <Download className="w-3.5 h-3.5 text-[#7A8881]" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* 3. Table Container */}
      <div className="overflow-x-auto border border-[#EFE8DC] rounded-2xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#FAF8F5] text-[10px] uppercase font-bold text-[#6D7D76] tracking-wider border-b border-[#EFE8DC]">
              <th className="py-3.5 px-4 font-semibold">
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#141A17]">
                  <span>Name</span>
                  <ArrowUpDown className="w-3 h-3 text-[#A1B0A8]" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold">
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#141A17]">
                  <span>Type</span>
                  <ArrowUpDown className="w-3 h-3 text-[#A1B0A8]" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold">
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#141A17]">
                  <span>Email</span>
                  <ArrowUpDown className="w-3 h-3 text-[#A1B0A8]" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold">
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#141A17]">
                  <span>Phone</span>
                  <ArrowUpDown className="w-3 h-3 text-[#A1B0A8]" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold">
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#141A17]">
                  <span>City</span>
                  <ArrowUpDown className="w-3 h-3 text-[#A1B0A8]" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold">
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#141A17]">
                  <span>Status</span>
                  <ArrowUpDown className="w-3 h-3 text-[#A1B0A8]" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#F4EFEA] bg-white">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((c) => (
                <tr 
                  key={c.id} 
                  className="hover:bg-[#FAF7F2] transition-colors duration-150 cursor-pointer group"
                >
                  {/* Name with Initials Avatar */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${c.avatarBg} flex items-center justify-center font-bold text-[11px] shrink-0 border border-black/5 shadow-2xs`}>
                        {c.initials}
                      </div>
                      <span className="font-bold text-[#141A17] text-xs group-hover:text-[#2D4A3E] transition-colors">
                        {c.name}
                      </span>
                    </div>
                  </td>

                  {/* Type Badge */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${c.typeBadge}`}>
                      {c.type}
                    </span>
                  </td>

                  {/* Email */}
                  <td className="py-3.5 px-4 text-[#5A6963] font-medium text-[11.5px]">
                    {c.email}
                  </td>

                  {/* Phone */}
                  <td className="py-3.5 px-4 text-[#5A6963] font-mono text-[11.5px]">
                    {c.phone}
                  </td>

                  {/* City */}
                  <td className="py-3.5 px-4 text-[#141A17] font-medium">
                    {c.city}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${c.statusBadge}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      <span>{c.status}</span>
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
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#7A8881] text-xs">
                  No contacts found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Footer & Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 pt-4 border-t border-[#F0EAE1] text-xs text-[#6B7A74]">
        <span>
          Showing 1–{filteredContacts.length} of {rawContacts.length} contacts
        </span>

        <div className="flex items-center gap-1.5">
          <button 
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-[#E4DCD0] bg-white hover:bg-[#FAF8F5] text-[#55635D] disabled:opacity-40 disabled:cursor-not-allowed enabled:cursor-pointer transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button className="w-8 h-8 rounded-lg bg-[#EAE3D6] text-[#1C3A2F] font-bold text-xs flex items-center justify-center border border-[#DDD4C7] shadow-2xs">
            1
          </button>

          <button 
            disabled={true}
            className="p-1.5 rounded-lg border border-[#E4DCD0] bg-white hover:bg-[#FAF8F5] text-[#55635D] disabled:opacity-40 disabled:cursor-not-allowed enabled:cursor-pointer transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default ContactsTableView;
