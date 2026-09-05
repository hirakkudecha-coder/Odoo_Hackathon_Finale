<<<<<<< HEAD
import React, { useState, useEffect, useMemo } from 'react';
=======
import React, { useState, useMemo } from 'react';
>>>>>>> 5fed872f0bf1975aaf0f133b5f60cbf0f78457af
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  Download, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  Printer,
  FileText,
  X,
  CheckCircle,
  Eye
} from 'lucide-react';
import { DocumentPdfModal } from '../DocumentPdfModal';
import { createMasterRegisterPdfData, downloadDirectPdf } from '../../../utils/pdfGenerator';

export const ContactsTable = ({ onCreateContact }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState('All');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortAsc, setSortAsc] = useState(false);
  const [activeRowMenuId, setActiveRowMenuId] = useState(null);
  const [selectedPdfDoc, setSelectedPdfDoc] = useState(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const initialContacts = [
    {
      id: 1,
      name: 'Rohan Kapoor',
      initials: 'RK',
      avatarBg: 'bg-[#CCDCD2] text-[#1E3A2E]',
      type: 'Customer',
      typeBadge: 'bg-[#E5F7ED] text-[#1E7445]',
      email: 'rohankapoor@interiors.com',
      phone: '+91 98765 44210',
      city: 'Mumbai',
      status: 'Active',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 2,
      name: 'Sheetal Living',
      initials: 'SL',
      avatarBg: 'bg-[#E0E6E3] text-[#1F4536]',
      type: 'Customer',
      typeBadge: 'bg-[#E5F7ED] text-[#1E7445]',
      email: 'contact@sheetalliving.in',
      phone: '+91 99210 11222',
      city: 'Delhi',
      status: 'Active',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 3,
      name: 'HomeWorks Supplies',
      initials: 'HW',
      avatarBg: 'bg-[#F2DDD0] text-[#5C3826]',
      type: 'Vendor',
      typeBadge: 'bg-[#FEF7EC] text-[#D97706]',
      email: 'sales@homeworks.com',
      phone: '+91 91100 55667',
      city: 'Bengaluru',
      status: 'Active',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 4,
      name: 'DesignCraft',
      initials: 'DC',
      avatarBg: 'bg-[#DFD8CE] text-[#3D372E]',
      type: 'Vendor',
      typeBadge: 'bg-[#FEF7EC] text-[#D97706]',
      email: 'info@designcraft.in',
      phone: '+91 97123 44558',
      city: 'Ahmedabad',
      status: 'Inactive',
      statusDot: 'bg-[#D97706]',
    },
    {
      id: 5,
      name: 'NextGen Interiors',
      initials: 'NG',
      avatarBg: 'bg-[#D6DDD9] text-[#2C3B34]',
      type: 'Customer',
      typeBadge: 'bg-[#E5F7ED] text-[#1E7445]',
      email: 'hello@nextgen.co',
      phone: '+91 99333 77009',
      city: 'Pune',
      status: 'Active',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 6,
      name: 'Urban Roots',
      initials: 'UR',
      avatarBg: 'bg-[#CCD4D8] text-[#22353D]',
      type: 'Other',
      typeBadge: 'bg-[#EBF3FE] text-[#2563EB]',
      email: 'info@urbanroots.in',
      phone: '+91 97654 32120',
      city: 'Jaipur',
      status: 'Active',
      statusDot: 'bg-[#10B981]',
    },
  ];

  const [contacts, setContacts] = useState(initialContacts);

  useEffect(() => {
    let isMounted = true;
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch('/api/contacts', { headers });
        if (res.ok) {
          const json = await res.json();
          if (json.contacts && Array.isArray(json.contacts) && json.contacts.length > 0) {
            const mapped = json.contacts.map((c, idx) => {
              const initials = c.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
              const type = c.type === 'vendor' ? 'Vendor' : c.type === 'both' ? 'Both' : 'Customer';
              const isCustomer = type === 'Customer';
              return {
                id: c._id || idx + 1,
                name: c.name,
                initials: initials || 'CO',
                avatarBg: isCustomer ? 'bg-[#CCDCD2] text-[#1E3A2E]' : 'bg-[#F2DDD0] text-[#5C3826]',
                type: type,
                typeBadge: isCustomer ? 'bg-[#E5F7ED] text-[#1E7445]' : 'bg-[#FEF7EC] text-[#D97706]',
                email: c.email || '—',
                phone: c.phone || '—',
                city: c.city || 'National',
                status: c.status === 'active' ? 'Active' : 'Inactive',
                statusDot: c.status === 'active' ? 'bg-[#10B981]' : 'bg-[#D97706]',
              };
            });
            if (isMounted) setContacts(mapped);
          }
        }
      } catch (err) {
        console.warn('Live contacts fetch failed:', err.message);
      }
    };
    fetchContacts();
    return () => { isMounted = false; };
  }, []);

  const [newContactForm, setNewContactForm] = useState({
    name: '',
    type: 'Customer',
    email: '',
    phone: '',
    city: '',
    status: 'Active',
  });

  const filterTabs = ['All', 'Customers', 'Vendors', 'Others'];

  const filteredContacts = useMemo(() => {
    let result = [...contacts];
    if (activeFilterTab === 'Customers') result = result.filter((c) => c.type === 'Customer');
    if (activeFilterTab === 'Vendors') result = result.filter((c) => c.type === 'Vendor');
    if (activeFilterTab === 'Others') result = result.filter((c) => c.type === 'Other');
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    });
    return result;
  }, [contacts, searchQuery, activeFilterTab, sortAsc]);

  const itemsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(filteredContacts.length / itemsPerPage));
  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredContacts.slice(start, start + itemsPerPage);
  }, [filteredContacts, currentPage]);

  const handleOpenCreateModal = () => {
    if (onCreateContact) {
      onCreateContact();
    } else {
      setIsCreateModalOpen(true);
    }
  };

  const handleSaveContact = (e) => {
    e.preventDefault();
    if (!newContactForm.name || !newContactForm.email) return;

    const nextId = contacts.length + 1;
    const initials = newContactForm.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'CT';
    
    let typeBadge = 'bg-[#E5F7ED] text-[#1E7445]';
    if (newContactForm.type === 'Vendor') typeBadge = 'bg-[#FEF7EC] text-[#D97706]';
    else if (newContactForm.type === 'Other') typeBadge = 'bg-[#EBF3FE] text-[#2563EB]';

    const newEntry = {
      id: nextId,
      name: newContactForm.name,
      initials,
      avatarBg: 'bg-[#CCDCD2] text-[#1E3A2E]',
      type: newContactForm.type,
      typeBadge,
      email: newContactForm.email,
      phone: newContactForm.phone || '+91 98000 00000',
      city: newContactForm.city || 'Ahmedabad',
      status: newContactForm.status,
      statusDot: newContactForm.status === 'Active' ? 'bg-[#10B981]' : 'bg-[#D97706]',
    };

    setContacts([newEntry, ...contacts]);
    setIsCreateModalOpen(false);
    setNewContactForm({
      name: '',
      type: 'Customer',
      email: '',
      phone: '',
      city: '',
      status: 'Active',
    });
  };

  const handleToggleStatus = (contactId) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === contactId) {
          const nextStatus = c.status === 'Active' ? 'Inactive' : 'Active';
          const nextDot = nextStatus === 'Active' ? 'bg-[#10B981]' : 'bg-[#D97706]';
          return { ...c, status: nextStatus, statusDot: nextDot };
        }
        return c;
      })
    );
    setActiveRowMenuId(null);
  };

  const handleViewContactPdf = (c) => {
    const pdfData = {
      type: 'CONTACT',
      title: 'PARTNER PROFILE DOSSIER',
      documentNo: `PARTNER-${c.id}`,
      date: '02 Sep 2025',
      dueDate: 'Active Registry',
      status: c.status,
      partner: {
        name: c.name,
        email: c.email,
        phone: c.phone,
        city: c.city,
      },
      tableData: {
        headers: ['Field', 'Details'],
        rows: [
          ['Partner Name', c.name],
          ['Category', c.type],
          ['Official Email', c.email],
          ['Contact Phone', c.phone],
          ['Operating City', c.city],
          ['Account Status', c.status],
        ],
      },
      notes: 'Certified contact and partner record retrieved from Urban Furniture master directory.',
    };

    setSelectedPdfDoc(pdfData);
    setIsPdfModalOpen(true);
    setActiveRowMenuId(null);
  };

  const handleDownloadContactPdfDirect = (c) => {
    const pdfData = {
      type: 'CONTACT',
      title: 'PARTNER PROFILE DOSSIER',
      documentNo: `PARTNER-${c.id}`,
      date: '02 Sep 2025',
      dueDate: 'Active Registry',
      status: c.status,
      partner: {
        name: c.name,
        email: c.email,
        phone: c.phone,
        city: c.city,
      },
      tableData: {
        headers: ['Field', 'Details'],
        rows: [
          ['Partner Name', c.name],
          ['Category', c.type],
          ['Official Email', c.email],
          ['Contact Phone', c.phone],
          ['Operating City', c.city],
          ['Account Status', c.status],
        ],
      },
      notes: 'Certified contact and partner record retrieved from Urban Furniture master directory.',
    };

    downloadDirectPdf(pdfData);
    setActiveRowMenuId(null);
  };

  const handleExportPdf = () => {
    const headers = ['Name', 'Type', 'Email', 'Phone', 'City', 'Status'];
    const rows = filteredContacts.map((c) => [
      c.name,
      c.type,
      c.email,
      c.phone,
      c.city,
      c.status,
    ]);

    const pdfData = createMasterRegisterPdfData('Contacts & Corporate Partners Master Register', headers, rows);
    downloadDirectPdf(pdfData);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-xs overflow-hidden transition-all duration-300">
      
      {/* 1. Header */}
      <div className="p-5 sm:p-6 border-b border-[#F0EAE1] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#F4EFE6] text-[#1C3A2F] flex items-center justify-center border border-[#E5DDD0] shadow-2xs shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#141A17] tracking-tight">
              Contacts Master
            </h2>
            <p className="text-xs text-[#6B7A74] mt-0.5">
              Manage your customers, suppliers, contractors and corporate partners.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-[#8A9B93] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl pl-9 pr-3 py-2 text-xs text-[#141A17] placeholder:text-[#8A9B93] focus:outline-hidden focus:border-[#1C3A2F] focus:ring-1 focus:ring-[#1C3A2F] transition-all"
            />
          </div>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 bg-[#1C3A2F] hover:bg-[#142C23] text-[#FAF8F5] text-xs font-semibold px-4 py-2 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Contact</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Toolbar */}
      <div className="px-5 sm:px-6 py-3.5 bg-[#FAF8F5]/80 border-b border-[#F0EAE1] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveFilterTab(tab);
                setCurrentPage(1);
              }}
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
          <button 
            type="button" 
            onClick={() => setSortAsc(!sortAsc)}
            className="inline-flex items-center gap-1.5 bg-white border border-[#E2DAD0] hover:bg-[#F5EFE6] text-[#4A5952] text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
            title="Toggle alphabetical sort"
          >
            <Filter className="w-3.5 h-3.5 text-[#738C80]" />
            <span>{sortAsc ? 'Name (A-Z)' : 'Name (Z-A)'}</span>
          </button>
          <button 
            type="button" 
            onClick={handleExportPdf}
            className="inline-flex items-center gap-1.5 bg-white border border-[#E2DAD0] hover:bg-[#F5EFE6] text-[#4A5952] text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
            title="Generate & Export PDF"
          >
            <Download className="w-3.5 h-3.5 text-[#738C80]" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* 3. Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-187.5">
          <thead>
            <tr className="border-b border-[#EAE3D7] bg-[#F7F4EE] text-[11px] font-bold text-[#55665E] uppercase tracking-wider">
              <th className="py-3.5 pl-6 pr-3">Name</th>
              <th className="py-3.5 px-3">Type</th>
              <th className="py-3.5 px-3">Email</th>
              <th className="py-3.5 px-3">Phone</th>
              <th className="py-3.5 px-3">City</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 pr-6 pl-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EAE1] text-xs text-[#141A17]">
            {paginatedContacts.map((c) => {
              const isMenuOpen = activeRowMenuId === c.id;

              return (
                <tr key={c.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3.5 pl-6 pr-3">
                    <button
                      type="button"
                      onClick={() => handleViewContactPdf(c)}
                      className="flex items-center gap-2.5 text-left cursor-pointer group"
                      title="Click to view partner dossier PDF"
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10.5px] font-bold ${c.avatarBg} shadow-2xs shrink-0`}>
                        {c.initials}
                      </div>
                      <span className="font-semibold text-[#141A17] group-hover:text-[#1C3A2F] group-hover:underline">
                        {c.name}
                      </span>
                    </button>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${c.typeBadge} shadow-2xs`}>
                      {c.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-[#55665E]">{c.email}</td>
                  <td className="py-3.5 px-3 text-[#55665E]">{c.phone}</td>
                  <td className="py-3.5 px-3 text-[#55665E]">{c.city}</td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E5F7ED] text-[#1E7445]">
                      <span className={`w-1.5 h-1.5 rounded-full ${c.statusDot}`} />
                      <span>{c.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 pr-6 pl-3 text-right">
                    <div className="flex items-center justify-end gap-1 relative">
                      <button 
                        type="button" 
                        onClick={() => handleDownloadContactPdfDirect(c)}
                        className="p-1.5 rounded-lg text-[#738C80] hover:text-[#1C3A2F] hover:bg-[#EAE4DC] transition-colors cursor-pointer"
                        title="Download Partner Dossier PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setActiveRowMenuId(isMenuOpen ? null : c.id)}
                        className="p-1.5 rounded-lg text-[#738C80] hover:text-[#141A17] hover:bg-[#EAE4DC] transition-colors cursor-pointer"
                        title="More options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Context Menu */}
                      {isMenuOpen && (
                        <div className="absolute right-0 top-8 z-30 w-48 bg-white rounded-xl shadow-lg border border-[#E8E1D5] py-1 text-left">
                          <button
                            type="button"
                            onClick={() => handleViewContactPdf(c)}
                            className="w-full px-3.5 py-2 text-xs text-[#141A17] hover:bg-[#FAF8F5] flex items-center gap-2 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#1C3A2F]" />
                            <span>View Dossier PDF</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadContactPdfDirect(c)}
                            className="w-full px-3.5 py-2 text-xs text-[#141A17] hover:bg-[#FAF8F5] flex items-center gap-2 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-[#1C3A2F]" />
                            <span>Download PDF</span>
                          </button>
                          <div className="border-t border-[#F0EAE1] my-1"></div>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(c.id)}
                            className="w-full px-3.5 py-2 text-xs text-[#1C3A2F] font-semibold hover:bg-[#FAF8F5] flex items-center gap-2 cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{c.status === 'Active' ? 'Mark Inactive' : 'Mark Active'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 4. Pagination */}
      <div className="px-6 py-4 border-t border-[#F0EAE1] bg-[#FAF8F5]/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#55665E]">
        <span>
          Showing {filteredContacts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
          {Math.min(currentPage * itemsPerPage, filteredContacts.length)} of {filteredContacts.length} contacts
        </span>
        <div className="flex items-center gap-1.5">
          <button 
            type="button" 
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-[#E2DAD0] bg-white hover:bg-[#F2ECE4] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => setCurrentPage(pageNum)}
              className={`px-3 py-1 font-bold rounded-lg cursor-pointer transition-all ${
                currentPage === pageNum
                  ? 'bg-[#1C3A2F] text-white shadow-2xs'
                  : 'bg-white text-[#4A5952] border border-[#E2DAD0] hover:bg-[#F2ECE4]'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button 
            type="button" 
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-[#E2DAD0] bg-white hover:bg-[#F2ECE4] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Create Contact Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-2xl max-w-md w-full overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-[#F0EAE1] flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1C3A2F] text-white flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury font-bold text-base text-[#141A17]">Create Contact</h3>
                  <p className="text-[11px] text-[#6B7A74]">Add customer or vendor partner entity</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-[#6B7A74] hover:text-[#141A17] hover:bg-[#EAE4DC] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-[#141A17] mb-1">Partner / Entity Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paramount Living Ltd."
                  value={newContactForm.name}
                  onChange={(e) => setNewContactForm({ ...newContactForm, name: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F] focus:ring-1 focus:ring-[#1C3A2F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#141A17] mb-1">Entity Type</label>
                  <select
                    value={newContactForm.type}
                    onChange={(e) => setNewContactForm({ ...newContactForm, type: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                  >
                    <option value="Customer">Customer</option>
                    <option value="Vendor">Vendor</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141A17] mb-1">Operating City</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai"
                    value={newContactForm.city}
                    onChange={(e) => setNewContactForm({ ...newContactForm, city: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#141A17] mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. office@paramount.com"
                    value={newContactForm.email}
                    onChange={(e) => setNewContactForm({ ...newContactForm, email: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141A17] mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98222 11000"
                    value={newContactForm.phone}
                    onChange={(e) => setNewContactForm({ ...newContactForm, phone: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E2DAD0] text-[#55665E] hover:bg-[#FAF8F5] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1C3A2F] hover:bg-[#142C23] text-white font-semibold cursor-pointer shadow-xs"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document PDF Modal */}
      <DocumentPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        documentData={selectedPdfDoc}
      />

    </div>
  );
};

export default ContactsTable;
