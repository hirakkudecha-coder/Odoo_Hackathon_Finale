import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  Feather,
  LifeBuoy,
  Building2,
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  ChevronDown,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Users,
  Send,
  ShieldCheck
} from 'lucide-react';

export const ConciergeLeadsPage = ({ onNavigateTab }) => {
  const [activeTab, setActiveTab] = useState('inquiries'); // 'inquiries' | 'tours' | 'tickets' | 'partners'
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState(null);

  // Detail inspection modal state
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null); // 'inquiry' | 'tour' | 'ticket' | 'partner'

  // Data states
  const [inquiries, setInquiries] = useState([]);
  const [tours, setTours] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [partners, setPartners] = useState([]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch all 4 datasets
  const fetchAllData = async () => {
    try {
      setRefreshing(true);
      const [inqRes, tourRes, tktRes, partnerRes] = await Promise.all([
        fetch('/api/inquiries/designer').catch(() => null),
        fetch('/api/showrooms/bookings').catch(() => null),
        fetch('/api/helpdesk/tickets').catch(() => null),
        fetch('/api/partners').catch(() => null)
      ]);

      if (inqRes && inqRes.ok) {
        const d = await inqRes.json();
        setInquiries(d.inquiries || []);
      }
      if (tourRes && tourRes.ok) {
        const d = await tourRes.json();
        setTours(d.bookings || []);
      }
      if (tktRes && tktRes.ok) {
        const d = await tktRes.json();
        setTickets(d.tickets || []);
      }
      if (partnerRes && partnerRes.ok) {
        const d = await partnerRes.json();
        setPartners(d.partners || []);
      }
    } catch (err) {
      console.error('Failed to fetch concierge data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Update Status Handlers
  const handleUpdateInquiryStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/inquiries/designer/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setInquiries(prev => prev.map(item => item._id === id ? { ...item, status: newStatus } : item));
        showToast(`Inquiry marked as ${newStatus}`);
      }
    } catch {
      showToast('Failed to update inquiry status', 'error');
    }
  };

  const handleUpdateTourStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/showrooms/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setTours(prev => prev.map(item => item._id === id ? { ...item, status: newStatus } : item));
        showToast(`Tour booking marked as ${newStatus}`);
      }
    } catch {
      showToast('Failed to update tour status', 'error');
    }
  };

  const handleUpdateTicketStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/helpdesk/tickets/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setTickets(prev => prev.map(item => item._id === id ? { ...item, status: newStatus } : item));
        showToast(`Ticket status changed to ${newStatus}`);
      }
    } catch {
      showToast('Failed to update ticket status', 'error');
    }
  };

  const handleUpdatePartnerStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/partners/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setPartners(prev => prev.map(item => item._id === id ? { ...item, status: newStatus } : item));
        showToast(`Partner status updated to ${newStatus}`);
      }
    } catch {
      showToast('Failed to update partner status', 'error');
    }
  };

  // Filtered lists
  const filteredInquiries = useMemo(() => {
    return inquiries.filter(item => {
      const matchSearch = (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.projectType || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.inquiryNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [inquiries, searchQuery, statusFilter]);

  const filteredTours = useMemo(() => {
    return tours.filter(item => {
      const matchSearch = (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.showroom || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.bookingCode || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [tours, searchQuery, statusFilter]);

  const filteredTickets = useMemo(() => {
    return tickets.filter(item => {
      const matchSearch = (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.ticketNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.subject || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [tickets, searchQuery, statusFilter]);

  const filteredPartners = useMemo(() => {
    return partners.filter(item => {
      const matchSearch = (item.studioName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.contactPerson || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.partnerCode || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [partners, searchQuery, statusFilter]);

  const navigationTabs = [
    { id: 'inquiries', label: 'Designer Inquiries', icon: Feather, count: inquiries.length },
    { id: 'tours', label: 'Showroom Tours', icon: Compass, count: tours.length },
    { id: 'tickets', label: 'Helpdesk Tickets', icon: LifeBuoy, count: tickets.length },
    { id: 'partners', label: 'Trade Partner Guild', icon: Building2, count: partners.length },
  ];

  return (
    <div className="space-y-6 text-left">
      
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-semibold animate-fadeIn ${
          toast.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-800'
            : 'bg-[#FAF8F5] border-[#2D4A3E]/20 text-[#141A17]'
        }`}>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#EBF3EF] text-[#1E7445] border border-[#D0E6DA] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Public Inbound Telemetry</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#141A17] tracking-tight font-bold">
            Concierge, Leads & Patron Inbox
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6963] mt-1 max-w-2xl">
            Triage bespoke architectural inquiries, review patron showroom bookings, resolve concierge tickets, and approve studio trade memberships in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAllData}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-[#E8E1D5] text-[#2D4A3E] text-xs font-semibold hover:bg-[#FAF8F5] transition-all shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Refresh Inbox'}</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Designer Inquiries',
            count: inquiries.length,
            badge: `${inquiries.filter(i => i.status === 'new').length} New Leads`,
            icon: Feather,
            bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
            tabId: 'inquiries'
          },
          {
            title: 'Showroom Tours',
            count: tours.length,
            badge: `${tours.filter(t => t.status === 'confirmed').length} Upcoming`,
            icon: Compass,
            bg: 'bg-amber-50 text-amber-800 border-amber-200',
            tabId: 'tours'
          },
          {
            title: 'Concierge Tickets',
            count: tickets.length,
            badge: `${tickets.filter(t => t.status === 'Submitted' || t.status === 'In Progress').length} Open`,
            icon: LifeBuoy,
            bg: 'bg-blue-50 text-blue-800 border-blue-200',
            tabId: 'tickets'
          },
          {
            title: 'Partner Applications',
            count: partners.length,
            badge: `${partners.filter(p => p.status === 'approved').length} Active Guild`,
            icon: Building2,
            bg: 'bg-purple-50 text-purple-800 border-purple-200',
            tabId: 'partners'
          }
        ].map((c, i) => {
          const Icon = c.icon;
          const isActive = activeTab === c.tabId;
          return (
            <div
              key={i}
              onClick={() => {
                setActiveTab(c.tabId);
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className={`p-4 sm:p-5 rounded-3xl border transition-all duration-200 cursor-pointer shadow-2xs flex items-center justify-between ${
                isActive
                  ? 'bg-[#1C3A2F] text-white border-[#1C3A2F] shadow-sm'
                  : 'bg-white text-[#141A17] border-[#E8E1D5] hover:border-[#1C3A2F]/40'
              }`}
            >
              <div className="space-y-1">
                <span className={`text-[11px] font-bold uppercase tracking-wider block ${isActive ? 'text-[#FAF8F5]/80' : 'text-[#66756F]'}`}>
                  {c.title}
                </span>
                <span className={`text-2xl font-bold font-numeric block ${isActive ? 'text-white' : 'text-[#141A17]'}`}>
                  {c.count}
                </span>
                <span className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                  isActive ? 'bg-white/15 border-white/30 text-white' : c.bg
                }`}>
                  {c.badge}
                </span>
              </div>
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                isActive ? 'bg-white/10 text-white border-white/20' : 'bg-[#F5F2EC] text-[#2D4A3E] border-[#E8E1D5]'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap border-b border-[#E8E1D5] pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {navigationTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setStatusFilter('all');
                  setSearchQuery('');
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                  isActive
                    ? 'bg-[#1C3A2F] text-[#FAF8F5] shadow-xs'
                    : 'bg-white text-[#4A5952] border border-[#E8E1D5] hover:bg-[#FAF8F5]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#7A8A83]'}`} />
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-numeric font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#EAE4DC] text-[#4A5952]'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Global Search & Status Filter */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#7A8A83] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-white border border-[#E8E1D5] rounded-xl text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-[#E8E1D5] rounded-xl text-xs text-[#4A5952] focus:outline-hidden focus:border-[#2D4A3E] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            {activeTab === 'inquiries' && (
              <>
                <option value="new">New</option>
                <option value="reviewing">Reviewing</option>
                <option value="contacted">Contacted</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </>
            )}
            {activeTab === 'tours' && (
              <>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="rescheduled">Rescheduled</option>
                <option value="cancelled">Cancelled</option>
              </>
            )}
            {activeTab === 'tickets' && (
              <>
                <option value="Submitted">Submitted</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </>
            )}
            {activeTab === 'partners' && (
              <>
                <option value="approved">Approved</option>
                <option value="applied">Applied</option>
                <option value="under_review">Under Review</option>
                <option value="suspended">Suspended</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* TAB 1: BESPOKE DESIGNER INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E8E1D5] text-[#66756F] uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-3.5 px-4">Inquiry Code</th>
                  <th className="py-3.5 px-4">Client Name & Email</th>
                  <th className="py-3.5 px-4">Project Scope</th>
                  <th className="py-3.5 px-4">Est. Budget</th>
                  <th className="py-3.5 px-4">Assigned Lead</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E1D5]/60">
                {filteredInquiries.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-[#7A8A83]">
                      No designer commission inquiries found matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredInquiries.map(inq => (
                    <tr key={inq._id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#2D4A3E]">
                        {inq.inquiryNumber || 'INQ-PENDING'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#141A17]">{inq.name}</div>
                        <div className="text-[11px] text-[#7A8A83]">{inq.email} {inq.phone ? `· ${inq.phone}` : ''}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF5ED] text-[#2D4A3E] border border-[#E6DEC8]">
                          {inq.projectType}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-numeric font-medium text-[#141A17]">
                        {inq.estimatedBudget}
                      </td>
                      <td className="py-3 px-4 text-[#55635D] max-w-xs truncate">
                        {inq.assignedLead}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={inq.status}
                          onChange={e => handleUpdateInquiryStatus(inq._id, e.target.value)}
                          className={`text-[10.5px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border cursor-pointer ${
                            inq.status === 'new'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : inq.status === 'contacted'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : inq.status === 'scheduled'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-stone-100 text-stone-700 border-stone-300'
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="contacted">Contacted</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedItem(inq);
                            setModalType('inquiry');
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2D4A3E] hover:text-[#141A17] bg-[#FAF8F5] hover:bg-[#EAE4DC] px-2.5 py-1 rounded-lg border border-[#E8E1D5] transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Context</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SHOWROOM TOUR RESERVATIONS */}
      {activeTab === 'tours' && (
        <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E8E1D5] text-[#66756F] uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-3.5 px-4">Booking Code</th>
                  <th className="py-3.5 px-4">Showroom Atelier</th>
                  <th className="py-3.5 px-4">Patron Details</th>
                  <th className="py-3.5 px-4">Schedule Slot</th>
                  <th className="py-3.5 px-4">Party Size</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E1D5]/60">
                {filteredTours.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-[#7A8A83]">
                      No showroom tour reservations found matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredTours.map(tour => (
                    <tr key={tour._id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#2D4A3E]">
                        {tour.bookingCode || 'UF-TOUR-PENDING'}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#141A17]">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#E86034]" />
                          <span>{tour.showroom}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#141A17]">{tour.name}</div>
                        <div className="text-[11px] text-[#7A8A83]">{tour.email} {tour.phone ? `· ${tour.phone}` : ''}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#141A17]">{tour.date}</div>
                        <div className="text-[11px] text-[#7A8A83]">{tour.timeSlot}</div>
                      </td>
                      <td className="py-3 px-4 text-[#55635D]">
                        {tour.guests}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={tour.status}
                          onChange={e => handleUpdateTourStatus(tour._id, e.target.value)}
                          className={`text-[10.5px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border cursor-pointer ${
                            tour.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : tour.status === 'completed'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : tour.status === 'rescheduled'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="rescheduled">Rescheduled</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedItem(tour);
                            setModalType('tour');
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2D4A3E] hover:text-[#141A17] bg-[#FAF8F5] hover:bg-[#EAE4DC] px-2.5 py-1 rounded-lg border border-[#E8E1D5] transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Notes</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: HELPDESK TICKETS */}
      {activeTab === 'tickets' && (
        <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E8E1D5] text-[#66756F] uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-3.5 px-4">Ticket Number</th>
                  <th className="py-3.5 px-4">Client / Ledger Ref</th>
                  <th className="py-3.5 px-4">Subject & Category</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Assigned Agent</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E1D5]/60">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-[#7A8A83]">
                      No concierge tickets found matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map(tkt => (
                    <tr key={tkt._id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#2D4A3E]">
                        {tkt.ticketNumber || tkt._id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#141A17]">{tkt.name}</div>
                        <div className="text-[11px] text-[#7A8A83]">{tkt.email} {tkt.referenceNo ? `· ${tkt.referenceNo}` : ''}</div>
                      </td>
                      <td className="py-3 px-4 max-w-sm">
                        <div className="font-semibold text-[#141A17] line-clamp-1">{tkt.subject}</div>
                        <div className="text-[10px] text-[#7A8A83] uppercase tracking-wider">{tkt.category}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          tkt.priority?.includes('Urgent') || tkt.priority === 'High'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : tkt.priority === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {tkt.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#55635D]">
                        {tkt.assignedAgent}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={tkt.status}
                          onChange={e => handleUpdateTicketStatus(tkt._id, e.target.value)}
                          className={`text-[10.5px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border cursor-pointer ${
                            tkt.status === 'Resolved'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : tkt.status === 'In Progress'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedItem(tkt);
                            setModalType('ticket');
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2D4A3E] hover:text-[#141A17] bg-[#FAF8F5] hover:bg-[#EAE4DC] px-2.5 py-1 rounded-lg border border-[#E8E1D5] transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: TRADE PARTNER GUILD APPLICATIONS */}
      {activeTab === 'partners' && (
        <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E8E1D5] text-[#66756F] uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-3.5 px-4">Partner Code</th>
                  <th className="py-3.5 px-4">Studio / Firm</th>
                  <th className="py-3.5 px-4">Lead Architect</th>
                  <th className="py-3.5 px-4">Annual Volume</th>
                  <th className="py-3.5 px-4">Guild Tier & Margin</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Quick Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E1D5]/60">
                {filteredPartners.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-[#7A8A83]">
                      No trade partner studio applications found matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredPartners.map(partner => (
                    <tr key={partner._id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#2D4A3E]">
                        {partner.partnerCode || 'UF-TRADE-PENDING'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#141A17]">{partner.studioName}</div>
                        <div className="text-[11px] text-[#7A8A83]">GSTIN: {partner.gstin || 'Unspecified'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#141A17]">{partner.contactPerson}</div>
                        <div className="text-[11px] text-[#7A8A83]">{partner.email} · {partner.phone}</div>
                      </td>
                      <td className="py-3 px-4 font-numeric font-bold text-[#141A17]">
                        ₹{(partner.procurementVolume || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF5ED] text-[#2D4A3E] border border-[#E6DEC8]">
                          {partner.tier || 'Silver Atelier'} ({partner.commissionRate || 20}%)
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          partner.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : partner.status === 'under_review'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-stone-100 text-stone-700 border-stone-300'
                        }`}>
                          {partner.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        {partner.status !== 'approved' && (
                          <button
                            onClick={() => handleUpdatePartnerStatus(partner._id, 'approved')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold transition-all cursor-pointer shadow-2xs"
                          >
                            Approve
                          </button>
                        )}
                        {partner.status !== 'under_review' && partner.status !== 'approved' && (
                          <button
                            onClick={() => handleUpdatePartnerStatus(partner._id, 'under_review')}
                            className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold transition-all cursor-pointer shadow-2xs"
                          >
                            Review
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedItem(partner);
                            setModalType('partner');
                          }}
                          className="px-2 py-1 rounded-lg bg-[#FAF8F5] border border-[#E8E1D5] text-[#2D4A3E] hover:bg-[#EAE4DC] text-[11px] font-semibold transition-all cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAIL INSPECTION MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#E8E1D5] shadow-2xl space-y-4 animate-fadeIn text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D5]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E86034]" />
                <h3 className="font-serif-luxury text-lg font-bold text-[#141A17]">
                  {modalType === 'inquiry' && 'Bespoke Inquiry Context'}
                  {modalType === 'tour' && 'Showroom Tour Reservation'}
                  {modalType === 'ticket' && 'Concierge Support Message'}
                  {modalType === 'partner' && 'Trade Partner Studio Profile'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-full hover:bg-[#FAF8F5] text-[#7A8A83] hover:text-[#141A17] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalType === 'inquiry' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 bg-[#FAF8F5] p-3 rounded-2xl border border-[#E8E1D5]">
                  <div>
                    <span className="text-[10px] uppercase text-[#7A8A83] font-bold">Client</span>
                    <p className="font-semibold text-[#141A17]">{selectedItem.name}</p>
                    <p className="text-[#55635D]">{selectedItem.email}</p>
                    <p className="text-[#55635D]">{selectedItem.phone}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#7A8A83] font-bold">Project Scope</span>
                    <p className="font-semibold text-[#141A17]">{selectedItem.projectType}</p>
                    <p className="text-[#55635D]">Budget: {selectedItem.estimatedBudget}</p>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#7A8A83] font-bold block mb-1">Client Message & Vision</span>
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] text-[#141A17] leading-relaxed">
                    {selectedItem.message || 'No detailed message provided by client.'}
                  </div>
                </div>
                <div className="text-[11px] text-[#7A8A83]">
                  Assigned Lead: <strong className="text-[#141A17]">{selectedItem.assignedLead}</strong>
                </div>
              </div>
            )}

            {modalType === 'tour' && (
              <div className="space-y-3 text-xs">
                <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E8E1D5] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-[#2D4A3E]">{selectedItem.bookingCode}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      {selectedItem.status}
                    </span>
                  </div>
                  <p className="font-semibold text-[#141A17] text-sm">{selectedItem.showroom}</p>
                  <p className="text-[#55635D]">Patron: {selectedItem.name} ({selectedItem.email} · {selectedItem.phone})</p>
                  <p className="text-[#55635D]">Date: {selectedItem.date} at {selectedItem.timeSlot} ({selectedItem.guests})</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#7A8A83] font-bold block mb-1">Patron Notes</span>
                  <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] text-[#141A17]">
                    {selectedItem.notes || 'No special requirements noted.'}
                  </div>
                </div>
              </div>
            )}

            {modalType === 'ticket' && (
              <div className="space-y-3 text-xs">
                <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E8E1D5] space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-[#2D4A3E]">{selectedItem.ticketNumber}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                      {selectedItem.status}
                    </span>
                  </div>
                  <p className="font-bold text-[#141A17] text-sm">{selectedItem.subject}</p>
                  <p className="text-[#55635D]">Category: {selectedItem.category}</p>
                  <p className="text-[#55635D]">Client: {selectedItem.name} ({selectedItem.email})</p>
                  {selectedItem.referenceNo && (
                    <p className="text-[#2D4A3E] font-mono">Reference: {selectedItem.referenceNo}</p>
                  )}
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#7A8A83] font-bold block mb-1">Issue Description</span>
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] text-[#141A17] leading-relaxed">
                    {selectedItem.message}
                  </div>
                </div>
              </div>
            )}

            {modalType === 'partner' && (
              <div className="space-y-3 text-xs">
                <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E8E1D5] space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-[#2D4A3E]">{selectedItem.partnerCode}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      {selectedItem.status}
                    </span>
                  </div>
                  <p className="font-bold text-[#141A17] text-base">{selectedItem.studioName}</p>
                  <p className="text-[#55635D]">Lead Architect: {selectedItem.contactPerson}</p>
                  <p className="text-[#55635D]">Email: {selectedItem.email} · Phone: {selectedItem.phone}</p>
                  {selectedItem.website && (
                    <p className="text-[#2D4A3E]">Website: {selectedItem.website}</p>
                  )}
                  <p className="text-[#55635D]">GSTIN: {selectedItem.gstin || 'Not Provided'}</p>
                </div>
                <div className="p-3 rounded-2xl bg-[#FAF5ED] border border-[#E6DEC8] text-center">
                  <span className="text-[10px] font-bold uppercase text-[#7A8A83] block">Unlocked Tier & Privilege</span>
                  <p className="font-serif-luxury font-bold text-base text-[#141A17]">
                    {selectedItem.tier} ({selectedItem.commissionRate}% Margin)
                  </p>
                  <p className="text-[11px] text-[#55635D]">
                    Projected Annual Volume: ₹{(selectedItem.procurementVolume || 0).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2 rounded-full bg-[#2D4A3E] text-white text-xs font-semibold hover:bg-[#1E332A] transition-colors cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ConciergeLeadsPage;
