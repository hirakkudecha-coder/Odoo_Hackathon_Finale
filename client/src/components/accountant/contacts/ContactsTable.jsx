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
  Printer,
  FileText,
  X,
  CheckCircle,
  Eye,
  MapPin,
  Phone,
  Mail,
  Camera,
  Edit2
} from 'lucide-react';
import { ViewModeToggle } from '../../common/ViewModeToggle';
import { DocumentPdfModal } from '../DocumentPdfModal';
import { createMasterRegisterPdfData, downloadDirectPdf } from '../../../utils/pdfGenerator';

export const ContactsTable = ({ onCreateContact }) => {
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState('All');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortAsc, setSortAsc] = useState(false);
  const [activeRowMenuId, setActiveRowMenuId] = useState(null);
  const [selectedPdfDoc, setSelectedPdfDoc] = useState(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const initialContacts = [
    {
      id: 'c-1',
      name: 'Rohan Kapoor',
      initials: 'RK',
      avatarBg: 'bg-[#CCDCD2] text-[#1E3A2E]',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      type: 'Customer',
      typeBadge: 'bg-[#E5F7ED] text-[#1E7445]',
      email: 'rohankapoor@interiors.com',
      phone: '+91 98765 44210',
      address: {
        street: '42, Altamount Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        pincode: '400026'
      },
      city: 'Mumbai',
      status: 'Active',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 'c-2',
      name: 'Sheetal Living Studios',
      initials: 'SL',
      avatarBg: 'bg-[#E0E6E3] text-[#1F4536]',
      profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      type: 'Customer',
      typeBadge: 'bg-[#E5F7ED] text-[#1E7445]',
      email: 'contact@sheetalliving.in',
      phone: '+91 99210 11222',
      address: {
        street: '88, Defence Colony',
        city: 'Delhi',
        state: 'Delhi',
        country: 'India',
        pincode: '110024'
      },
      city: 'Delhi',
      status: 'Active',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 'c-3',
      name: 'HomeWorks Supplies Ltd',
      initials: 'HW',
      avatarBg: 'bg-[#F2DDD0] text-[#5C3826]',
      profileImage: '',
      type: 'Vendor',
      typeBadge: 'bg-[#FEF7EC] text-[#D97706]',
      email: 'sales@homeworks.com',
      phone: '+91 91100 55667',
      address: {
        street: '12, Industrial Area, Peenya',
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
        pincode: '560058'
      },
      city: 'Bengaluru',
      status: 'Active',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 'c-4',
      name: 'DesignCraft Timber Co',
      initials: 'DC',
      avatarBg: 'bg-[#DFD8CE] text-[#3D372E]',
      profileImage: '',
      type: 'Vendor',
      typeBadge: 'bg-[#FEF7EC] text-[#D97706]',
      email: 'info@designcraft.in',
      phone: '+91 97123 44558',
      address: {
        street: '104, GIDC Estate',
        city: 'Ahmedabad',
        state: 'Gujarat',
        country: 'India',
        pincode: '382445'
      },
      city: 'Ahmedabad',
      status: 'Inactive',
      statusDot: 'bg-[#D97706]',
    },
    {
      id: 'c-5',
      name: 'NextGen Commercial Interiors',
      initials: 'NG',
      avatarBg: 'bg-[#D6DDD9] text-[#2C3B34]',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      type: 'Customer',
      typeBadge: 'bg-[#E5F7ED] text-[#1E7445]',
      email: 'hello@nextgen.co',
      phone: '+91 99333 77009',
      address: {
        street: '55, Koregaon Park',
        city: 'Pune',
        state: 'Maharashtra',
        country: 'India',
        pincode: '411001'
      },
      city: 'Pune',
      status: 'Active',
      statusDot: 'bg-[#10B981]',
    },
    {
      id: 'c-6',
      name: 'Urban Roots Artisan Guild',
      initials: 'UR',
      avatarBg: 'bg-[#CCD4D8] text-[#22353D]',
      profileImage: '',
      type: 'Both',
      typeBadge: 'bg-[#EBF3FE] text-[#2563EB]',
      email: 'info@urbanroots.in',
      phone: '+91 97654 32120',
      address: {
        street: '21, MI Road',
        city: 'Jaipur',
        state: 'Rajasthan',
        country: 'India',
        pincode: '302001'
      },
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
              const rawType = (c.type || 'Customer');
              const isCustomer = rawType === 'Customer';
              const isVendor = rawType === 'Vendor';
              return {
                id: c._id || idx + 1,
                name: c.name,
                initials: initials || 'CO',
                profileImage: c.profileImage || '',
                avatarBg: isCustomer ? 'bg-[#CCDCD2] text-[#1E3A2E]' : isVendor ? 'bg-[#F2DDD0] text-[#5C3826]' : 'bg-[#CCD4D8] text-[#22353D]',
                type: rawType,
                typeBadge: isCustomer ? 'bg-[#E5F7ED] text-[#1E7445]' : isVendor ? 'bg-[#FEF7EC] text-[#D97706]' : 'bg-[#EBF3FE] text-[#2563EB]',
                email: c.email || '—',
                phone: c.mobile || c.phone || '—',
                address: {
                  street: c.address?.street || '',
                  city: c.address?.city || c.city || 'Ahmedabad',
                  state: c.address?.state || 'Gujarat',
                  country: c.address?.country || 'India',
                  pincode: c.address?.pincode || '380015'
                },
                city: c.address?.city || c.city || 'Ahmedabad',
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
    street: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    profileImage: '',
    status: 'Active',
    createPortalUser: false,
    portalPassword: ''
  });

  const filterTabs = ['All', 'Customers', 'Vendors', 'Both'];

  const filteredContacts = useMemo(() => {
    let result = [...contacts];
    if (activeFilterTab === 'Customers') result = result.filter((c) => c.type === 'Customer');
    if (activeFilterTab === 'Vendors') result = result.filter((c) => c.type === 'Vendor');
    if (activeFilterTab === 'Both') result = result.filter((c) => c.type === 'Both');
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        (c.address?.street && c.address.street.toLowerCase().includes(q))
      );
    }
    result.sort((a, b) => {
      return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    });
    return result;
  }, [contacts, searchQuery, activeFilterTab, sortAsc]);

  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(filteredContacts.length / itemsPerPage));
  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredContacts.slice(start, start + itemsPerPage);
  }, [filteredContacts, currentPage]);

  const handleOpenCreateModal = () => {
    setEditingContact(null);
    setNewContactForm({
      name: '',
      type: 'Customer',
      email: '',
      phone: '',
      street: '',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      pincode: '380015',
      profileImage: '',
      status: 'Active',
      createPortalUser: false,
      portalPassword: ''
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (c) => {
    setEditingContact(c);
    setNewContactForm({
      name: c.name,
      type: c.type,
      email: c.email,
      phone: c.phone,
      street: c.address?.street || '',
      city: c.address?.city || c.city || '',
      state: c.address?.state || '',
      country: c.address?.country || 'India',
      pincode: c.address?.pincode || '',
      profileImage: c.profileImage || '',
      status: c.status,
      createPortalUser: false,
      portalPassword: ''
    });
    setIsCreateModalOpen(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewContactForm(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveContact = async (e) => {
    e.preventDefault();
    if (!newContactForm.name || !newContactForm.email) return;

    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const payload = {
        name: newContactForm.name,
        type: newContactForm.type,
        email: newContactForm.email,
        mobile: newContactForm.phone || '+91 98000 00000',
        address: {
          street: newContactForm.street,
          city: newContactForm.city || 'Ahmedabad',
          state: newContactForm.state || 'Gujarat',
          country: newContactForm.country || 'India',
          pincode: newContactForm.pincode || '380015'
        },
        profileImage: newContactForm.profileImage,
        status: newContactForm.status.toLowerCase(),
        createPortalUser: newContactForm.createPortalUser,
        portalPassword: newContactForm.portalPassword || 'UrbanPass@2026'
      };

      if (editingContact) {
        const updated = contacts.map(c => c.id === editingContact.id ? {
          ...c,
          name: newContactForm.name,
          type: newContactForm.type,
          email: newContactForm.email,
          phone: newContactForm.phone,
          profileImage: newContactForm.profileImage,
          address: payload.address,
          city: payload.address.city,
          status: newContactForm.status
        } : c);
        setContacts(updated);
        await fetch(`/api/contacts/${editingContact.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        }).catch(() => {});
      } else {
        const res = await fetch('/api/contacts', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        }).catch(() => null);

        let savedContact = {};
        if (res && res.ok) {
          const json = await res.json();
          savedContact = json.contact || {};
        }

        const nextId = savedContact._id || `c-${Date.now()}`;
        const initials = newContactForm.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'CT';
        
        let typeBadge = 'bg-[#E5F7ED] text-[#1E7445]';
        if (newContactForm.type === 'Vendor') typeBadge = 'bg-[#FEF7EC] text-[#D97706]';
        else if (newContactForm.type === 'Both') typeBadge = 'bg-[#EBF3FE] text-[#2563EB]';

        const newEntry = {
          id: nextId,
          name: newContactForm.name,
          initials,
          profileImage: newContactForm.profileImage,
          avatarBg: 'bg-[#CCDCD2] text-[#1E3A2E]',
          type: newContactForm.type,
          typeBadge,
          email: newContactForm.email,
          phone: newContactForm.phone || '+91 98000 00000',
          address: payload.address,
          city: payload.address.city,
          status: newContactForm.status,
          statusDot: newContactForm.status === 'Active' ? 'bg-[#10B981]' : 'bg-[#D97706]',
        };

        setContacts([newEntry, ...contacts]);
      }
    } catch (err) {
      console.error('Error saving contact:', err);
    }

    setIsCreateModalOpen(false);
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
    const fullAddr = `${c.address?.street ? c.address.street + ', ' : ''}${c.address?.city || c.city}, ${c.address?.state || ''} ${c.address?.pincode || ''}, ${c.address?.country || 'India'}`;
    const pdfData = {
      type: 'CONTACT',
      title: 'PARTNER PROFILE DOSSIER',
      documentNo: `PARTNER-${c.id}`,
      date: new Date().toLocaleDateString('en-GB'),
      dueDate: 'Active Registry',
      status: c.status,
      partner: {
        name: c.name,
        email: c.email,
        phone: c.phone,
        city: c.city,
        address: fullAddr
      },
      tableData: {
        headers: ['Field', 'Details'],
        rows: [
          ['Partner Name', c.name],
          ['Category', c.type],
          ['Official Email', c.email],
          ['Contact Phone', c.phone],
          ['Full Address', fullAddr],
          ['Account Status', c.status],
        ],
      },
      notes: 'Certified contact and partner record retrieved from Urban Furniture master directory.',
    };

    setSelectedPdfDoc(pdfData);
    setIsPdfModalOpen(true);
    setActiveRowMenuId(null);
  };

  const handleExportPdf = () => {
    const headers = ['Name', 'Type', 'Email', 'Phone', 'City / Address', 'Status'];
    const rows = filteredContacts.map((c) => [
      c.name,
      c.type,
      c.email,
      c.phone,
      `${c.address?.street ? c.address.street + ', ' : ''}${c.city}`,
      c.status,
    ]);

    const pdfData = createMasterRegisterPdfData('Contacts Master Register', headers, rows);
    downloadDirectPdf(pdfData, 'Contacts_Master_Register.pdf');
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-xs overflow-hidden transition-all duration-300 space-y-0">
      
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

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          
          <div className="relative flex-1 md:w-56">
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
            onClick={handleExportPdf}
            className="inline-flex items-center gap-1.5 bg-white border border-[#E2DAD0] hover:bg-[#F5EFE6] text-[#4A5952] text-xs font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>

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

        <button 
          type="button" 
          onClick={() => setSortAsc(!sortAsc)}
          className="inline-flex items-center gap-1.5 bg-white border border-[#E2DAD0] hover:bg-[#F5EFE6] text-[#4A5952] text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
        >
          <span>Sort: {sortAsc ? 'A-Z' : 'Z-A'}</span>
        </button>
      </div>

      {/* 3. VIEW: KANBAN VIEW */}
      {viewMode === 'kanban' ? (
        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedContacts.map((c) => (
            <div 
              key={c.id}
              className="bg-white rounded-2xl border border-[#E5DFD5] p-5 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {c.profileImage ? (
                      <img 
                        src={c.profileImage} 
                        alt={c.name} 
                        className="w-12 h-12 rounded-2xl object-cover border border-[#DDD5C7] shadow-2xs shrink-0" 
                      />
                    ) : (
                      <div className={`w-12 h-12 rounded-2xl ${c.avatarBg} font-bold text-sm flex items-center justify-center border border-black/5 shadow-2xs shrink-0`}>
                        {c.initials}
                      </div>
                    )}
                    <div>
                      <h3 className="font-serif font-bold text-sm sm:text-base text-[#141A17] group-hover:text-[#1C3A2F] transition-colors leading-tight">
                        {c.name}
                      </h3>
                      <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-md text-[10.5px] font-bold ${c.typeBadge}`}>
                        {c.type}
                      </span>
                    </div>
                  </div>

                  <span className={`w-2.5 h-2.5 rounded-full ${c.statusDot} shrink-0 mt-1`} title={c.status} />
                </div>

                <div className="space-y-1.5 text-xs text-[#52645B] pt-2 border-t border-[#F0EAE1]">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-[#889890] shrink-0" />
                    <span className="truncate">{c.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#889890] shrink-0" />
                    <span>{c.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#7A8A82]">
                    <MapPin className="w-3.5 h-3.5 text-[#889890] shrink-0" />
                    <span className="truncate">
                      {c.address?.street ? `${c.address.street}, ` : ''}{c.city}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleViewContactPdf(c)}
                  className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#1C3A2F] hover:underline cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Dossier</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(c)}
                    className="p-1.5 rounded-lg text-[#55665E] hover:bg-[#FAF8F5] cursor-pointer"
                    title="Edit Contact"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(c.id)}
                    className="p-1.5 rounded-lg text-[#1C3A2F] hover:bg-[#FAF8F5] cursor-pointer"
                    title={c.status === 'Active' ? 'Deactivate' : 'Activate'}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 4. VIEW: TABLE LIST VIEW */
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#F0EAE1] text-[11px] font-bold text-[#55665E] uppercase tracking-wider">
                <th className="py-3 px-6">Partner Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Official Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">City / Region</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EAE1] text-xs text-[#141A17]">
              {paginatedContacts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-[#7A8A82]">
                    No contacts found.
                  </td>
                </tr>
              ) : (
                paginatedContacts.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-[#141A17]">
                      <div className="flex items-center gap-3">
                        {c.profileImage ? (
                          <img src={c.profileImage} alt={c.name} className="w-8 h-8 rounded-xl object-cover border border-[#DDD5C7]" />
                        ) : (
                          <div className={`w-8 h-8 rounded-xl ${c.avatarBg} font-bold text-xs flex items-center justify-center shrink-0`}>
                            {c.initials}
                          </div>
                        )}
                        <span>{c.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${c.typeBadge}`}>
                        {c.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#55665E]">{c.email}</td>
                    <td className="py-3.5 px-4 text-[#55665E]">{c.phone}</td>
                    <td className="py-3.5 px-4 text-[#55665E]">{c.city}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold ${
                        c.status === 'Active' ? 'bg-[#E5F7ED] text-[#1E7445]' : 'bg-[#FEF7EC] text-[#D97706]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.statusDot}`} />
                        <span>{c.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleViewContactPdf(c)}
                          className="p-1.5 rounded-lg text-[#55665E] hover:bg-[#F2ECE4] hover:text-[#141A17] cursor-pointer"
                          title="View PDF Dossier"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(c)}
                          className="p-1.5 rounded-lg text-[#55665E] hover:bg-[#F2ECE4] hover:text-[#141A17] cursor-pointer"
                          title="Edit Contact"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. Pagination */}
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
            className="p-1.5 rounded-lg border border-[#E2DAD0] bg-white hover:bg-[#F2ECE4] enabled:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
            className="p-1.5 rounded-lg border border-[#E2DAD0] bg-white hover:bg-[#F2ECE4] enabled:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Create / Edit Contact Modal with Full Address & Image Upload */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto text-left animate-scaleUp">
            <div className="p-5 border-b border-[#F0EAE1] flex items-center justify-between bg-[#FAF8F5] sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1C3A2F] text-white flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury font-bold text-base text-[#141A17]">
                    {editingContact ? 'Edit Contact' : 'Create Contact'}
                  </h3>
                  <p className="text-[11px] text-[#6B7A74]">Full profile with address and photo</p>
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
              {/* Profile Photo Upload */}
              <div className="flex items-center gap-4 p-3 bg-[#FAF8F5] rounded-2xl border border-[#E5DFD5]">
                {newContactForm.profileImage ? (
                  <img 
                    src={newContactForm.profileImage} 
                    alt="Preview" 
                    className="w-14 h-14 rounded-2xl object-cover border border-[#DDD5C7]" 
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-[#E8E1D5] text-[#55665E] flex items-center justify-center">
                    <Camera className="w-6 h-6" />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#141A17]">Profile / Brand Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-[11px] text-[#66776F] file:mr-2.5 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#1C3A2F] file:text-white hover:file:bg-[#142C23] file:cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141A17] mb-1">Partner / Entity Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paramount Living Ltd."
                  value={newContactForm.name}
                  onChange={(e) => setNewContactForm({ ...newContactForm, name: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#141A17] mb-1">Entity Type *</label>
                  <select
                    value={newContactForm.type}
                    onChange={(e) => setNewContactForm({ ...newContactForm, type: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs font-bold text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                  >
                    <option value="Customer">Customer</option>
                    <option value="Vendor">Vendor</option>
                    <option value="Both">Both (Customer & Vendor)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141A17] mb-1">Status</label>
                  <select
                    value={newContactForm.status}
                    onChange={(e) => setNewContactForm({ ...newContactForm, status: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#141A17] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="office@paramount.com"
                    value={newContactForm.email}
                    onChange={(e) => setNewContactForm({ ...newContactForm, email: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141A17] mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98222 11000"
                    value={newContactForm.phone}
                    onChange={(e) => setNewContactForm({ ...newContactForm, phone: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                  />
                </div>
              </div>

              {/* Full Address Fields */}
              <div className="space-y-2.5 pt-2 border-t border-[#EFE9E0]">
                <span className="text-xs font-bold text-[#1C3A2F] block">Address Details</span>
                
                <div>
                  <label className="block text-[11px] font-semibold text-[#55665E] mb-1">Street Address</label>
                  <input
                    type="text"
                    placeholder="e.g. 104, Signature Tower, SG Highway"
                    value={newContactForm.street}
                    onChange={(e) => setNewContactForm({ ...newContactForm, street: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#55665E] mb-1">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Ahmedabad"
                      value={newContactForm.city}
                      onChange={(e) => setNewContactForm({ ...newContactForm, city: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#55665E] mb-1">State</label>
                    <input
                      type="text"
                      placeholder="e.g. Gujarat"
                      value={newContactForm.state}
                      onChange={(e) => setNewContactForm({ ...newContactForm, state: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#55665E] mb-1">Country</label>
                    <input
                      type="text"
                      value={newContactForm.country}
                      onChange={(e) => setNewContactForm({ ...newContactForm, country: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#55665E] mb-1">Pincode</label>
                    <input
                      type="text"
                      placeholder="e.g. 380015"
                      value={newContactForm.pincode}
                      onChange={(e) => setNewContactForm({ ...newContactForm, pincode: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
                    />
                  </div>
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
                  className="px-5 py-2 rounded-xl bg-[#1C3A2F] hover:bg-[#142C23] text-white font-semibold cursor-pointer shadow-xs"
                >
                  {editingContact ? 'Save Changes' : 'Create Contact'}
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
