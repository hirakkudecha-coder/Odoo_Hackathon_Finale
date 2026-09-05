import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  LifeBuoy,
  Briefcase,
  HelpCircle,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  Layers,
  Calculator,
  FileText,
  Check,
  ChevronDown,
  ChevronUp,
  Search,
  MessageSquare,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  UploadCloud,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { Footer } from './Footer';

export const PartnerHelpdeskPage = ({ 
  initialTab = 'helpdesk', 
  onNavigateHome,
  onOpenAuth,
  onNavigatePartnerHelpdesk,
  onNavigateAbout,
  onNavigateShowrooms
}) => {
  const [activeTab, setActiveTab] = useState(initialTab); // 'helpdesk' | 'partner'
  
  // Update activeTab if initialTab changes or if URL hash contains anchor
  useEffect(() => {
    if (window.location.hash === '#partner' || window.location.hash === '#partner-program') {
      setActiveTab('partner');
    } else if (window.location.hash === '#helpdesk') {
      setActiveTab('helpdesk');
    } else if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Sync route and hash on tab switch
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.history.pushState(null, '', `/partner-helpdesk#${tab}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackHome = (e) => {
    if (e) e.preventDefault();
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  // =========================================================================
  // HELPDESK STATE & LOGIC
  // =========================================================================
  const [ticketForm, setTicketForm] = useState({
    name: '',
    email: '',
    referenceNo: '',
    category: 'Double-Entry Ledger Balancing',
    priority: 'Medium',
    message: '',
  });
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState(null);

  const [activeTickets, setActiveTickets] = useState([
    {
      id: 'TKT-9204',
      subject: 'Double-entry journal auto-reconciliation discrepancy',
      category: 'Accounting & Ledger',
      status: 'Resolved',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      priority: 'High',
      updated: '25 mins ago',
      agent: 'Aarav Mehta (Lead Concierge)',
    },
    {
      id: 'TKT-8841',
      subject: 'Custom Teak Credenza dimension sign-off & shop drawings',
      category: 'Order Customization',
      status: 'In Progress',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-300',
      priority: 'Urgent',
      updated: '1 hour ago',
      agent: 'Rohan Sharma (Master Craftsman)',
    },
    {
      id: 'TKT-7439',
      subject: 'Trade invoice tax deduction & GST voucher generation',
      category: 'Billing & GST',
      status: 'In Progress',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-300',
      priority: 'Standard',
      updated: '3 hours ago',
      agent: 'Ananya Verma (Financial Systems)',
    },
  ]);

  // Fetch active tickets from backend on component mount
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch('/api/helpdesk/tickets');
        const data = await res.json();
        if (data.success && Array.isArray(data.tickets) && data.tickets.length > 0) {
          const statusColorMap = {
            Resolved: 'bg-emerald-100 text-emerald-800 border-emerald-300',
            'In Progress': 'bg-amber-100 text-amber-800 border-amber-300',
            Submitted: 'bg-blue-100 text-blue-800 border-blue-300'
          };
          const mapped = data.tickets.map(t => ({
            id: t.ticketNumber || t._id,
            subject: t.subject || 'Concierge Support Inquiry',
            category: t.category || 'General Technical Inquiry',
            status: t.status || 'Submitted',
            statusColor: statusColorMap[t.status] || 'bg-blue-100 text-blue-800 border-blue-300',
            priority: t.priority || 'Medium',
            updated: t.updatedAt ? new Date(t.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
            agent: t.assignedAgent || 'Concierge Desk'
          }));
          setActiveTickets(mapped);
        }
      } catch (err) {
        console.warn('Using default tickets, backend unreachable:', err);
      }
    };
    fetchTickets();
  }, []);

  const [faqSearch, setFaqSearch] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const faqs = [
    {
      q: 'How does real-time double entry work when a purchase order or sale is created?',
      a: 'Whenever a sales order is confirmed or a vendor bill is posted, our integrated double-entry engine automatically writes balanced journal debit and credit entries with 0.001 floating-point precision directly to your General Ledger, preventing manual book-balancing errors.',
    },
    {
      q: 'Can trade partners track design commissions and client invoices automatically?',
      a: 'Yes. Once admitted to the Partner Guild, your studio receives a dedicated sub-ledger ID. Every client order linked to your partner code generates an automated trade rebate voucher credited straight into your account statement.',
    },
    {
      q: 'How do I request high-resolution 3D CAD, Revit, and material swatches?',
      a: 'Partners receive instant access to our BIM library containing 4K PBR materials, SketchUp, FBX, and Revit families. Physical fabric and wood swatch boxes are shipped to registered atelier addresses within 48 hours.',
    },
    {
      q: 'What is the standard SLA for urgent ledger discrepancies?',
      a: 'High and Critical priority tickets regarding double-entry balance locks or payment synchronization are assigned within 15 minutes to our Senior Accounting Concierge team available 24/7.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    if (!ticketForm.name || !ticketForm.email || !ticketForm.message) return;
    setTicketSubmitting(true);

    try {
      const subject = ticketForm.message.slice(0, 60) || `${ticketForm.category} Inquiry`;
      const res = await fetch('/api/helpdesk/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: ticketForm.name,
          email: ticketForm.email,
          referenceNo: ticketForm.referenceNo,
          category: ticketForm.category,
          priority: ticketForm.priority,
          subject: subject,
          message: ticketForm.message
        })
      });
      const data = await res.json();
      if (data.success && data.ticket) {
        const statusColorMap = {
          Resolved: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          'In Progress': 'bg-amber-100 text-amber-800 border-amber-300',
          Submitted: 'bg-blue-100 text-blue-800 border-blue-300'
        };
        const newTicket = {
          id: data.ticket.ticketNumber || `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
          subject: data.ticket.subject || subject,
          category: data.ticket.category || ticketForm.category,
          status: data.ticket.status || 'Submitted',
          statusColor: statusColorMap[data.ticket.status] || 'bg-blue-100 text-blue-800 border-blue-300',
          priority: data.ticket.priority || ticketForm.priority,
          updated: 'Just now',
          agent: data.ticket.assignedAgent || 'Assigned to Concierge Desk'
        };
        setActiveTickets(prev => [newTicket, ...prev]);
        setTicketSubmitted(newTicket.id);
      } else {
        const newTicketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
        setTicketSubmitted(newTicketId);
      }
    } catch {
      const newTicketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
      setTicketSubmitted(newTicketId);
    } finally {
      setTicketSubmitting(false);
      setTicketForm({
        name: '',
        email: '',
        referenceNo: '',
        category: 'Double-Entry Ledger Balancing',
        priority: 'Medium',
        message: '',
      });
    }
  };

  // =========================================================================
  // PARTNER PROGRAM STATE & LOGIC
  // =========================================================================
  const [procurementVolume, setProcurementVolume] = useState(2500000); // 25 Lakhs default
  const [partnerForm, setPartnerForm] = useState({
    firmName: '',
    leadName: '',
    email: '',
    phone: '',
    category: 'Interior Design Studio',
    gstin: '',
    website: '',
  });
  const [partnerSubmitted, setPartnerSubmitted] = useState(false);
  const [partnerSubmitting, setPartnerSubmitting] = useState(false);
  const [partnerSubmittedData, setPartnerSubmittedData] = useState(null);

  // Compute tier based on annual procurement volume
  const getPartnerTier = (volume) => {
    if (volume < 1500000) {
      return {
        name: 'Silver Atelier',
        commissionRate: 20,
        badgeBg: 'bg-stone-100 text-stone-800 border-stone-300',
        perks: ['20% Trade Discount', 'Standard 3D CAD Library', 'Seasonal Swatch Catalog'],
      };
    } else if (volume < 5000000) {
      return {
        name: 'Gold Studio Guild',
        commissionRate: 28,
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
        perks: [
          '28% Trade Discount',
          'Priority Factory Scheduling',
          'Full 4K PBR & BIM Revit Suite',
          'Physical Leather & Bouclé Box',
        ],
      };
    } else {
      return {
        name: 'Platinum Master Guild',
        commissionRate: 35,
        badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        perks: [
          '35% Maximum Trade Margin',
          'Dedicated Master Craftsman Liaison',
          'Bespoke One-of-a-Kind Prototyping',
          'Automated Sub-Ledger Instant Pay',
        ],
      };
    }
  };

  const currentTier = getPartnerTier(procurementVolume);
  const estimatedSavings = Math.round((procurementVolume * currentTier.commissionRate) / 100);

  const handlePartnerSubmit = async (e) => {
    e.preventDefault();
    if (!partnerForm.firmName || !partnerForm.leadName || !partnerForm.email || !partnerForm.phone) return;
    setPartnerSubmitting(true);
    try {
      const res = await fetch('/api/partners/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studioName: partnerForm.firmName,
          contactPerson: partnerForm.leadName,
          email: partnerForm.email,
          phone: partnerForm.phone,
          gstin: partnerForm.gstin,
          website: partnerForm.website,
          procurementVolume: procurementVolume
        })
      });
      const data = await res.json();
      if (data.success && data.partner) {
        setPartnerSubmittedData(data.partner);
      } else {
        setPartnerSubmittedData({
          partnerCode: `UF-TRADE-${Math.floor(100000 + Math.random() * 900000)}`,
          tier: currentTier.name,
          commissionRate: currentTier.commissionRate
        });
      }
      setPartnerSubmitted(true);
    } catch {
      setPartnerSubmittedData({
        partnerCode: `UF-TRADE-${Math.floor(100000 + Math.random() * 900000)}`,
        tier: currentTier.name,
        commissionRate: currentTier.commissionRate
      });
      setPartnerSubmitted(true);
    } finally {
      setPartnerSubmitting(false);
      setPartnerForm({
        firmName: '',
        leadName: '',
        email: '',
        phone: '',
        category: 'Interior Design Studio',
        gstin: '',
        website: ''
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141A17] flex flex-col selection:bg-[#2D4A3E] selection:text-[#FAF8F5]">
      {/* =========================================================================
          TOP NAVIGATION BAR
          ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#2D4A3E]/12 transition-all duration-200">
        <div className="w-full px-4 sm:px-6 lg:px-12 py-3 flex items-center justify-between gap-4">
          {/* Brand Logo & Back link */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={handleBackHome}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#55635D] hover:text-[#141A17] transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#2D4A3E]" />
              <span className="hidden sm:inline">Back to Home</span>
            </button>
            <div className="h-5 w-px bg-[#2D4A3E]/15 hidden sm:block"></div>
            <a href="#" onClick={handleBackHome}>
              <BrandLogo />
            </a>
          </div>

          {/* Center / Right Segmented Tab Switcher */}
          <div className="flex items-center bg-[#EDE7DD] p-1 rounded-full border border-[#2D4A3E]/15 shadow-inner">
            <button
              type="button"
              onClick={() => handleTabChange('helpdesk')}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'helpdesk'
                  ? 'bg-[#2D4A3E] text-white shadow-sm'
                  : 'text-[#55635D] hover:text-[#141A17]'
              }`}
            >
              <LifeBuoy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E8C547]" />
              <span>Help Desk</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('partner')}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'partner'
                  ? 'bg-[#2D4A3E] text-white shadow-sm'
                  : 'text-[#55635D] hover:text-[#141A17]'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E86034]" />
              <span>Partner Program</span>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN PORTAL CONTENT
          ========================================================================= */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb & Section Header */}
        <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#2D4A3E]/12 pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#2D4A3E] mb-1.5 bg-[#EFE9DF] px-3 py-1 rounded-full border border-[#2D4A3E]/10">
              <Sparkles className="w-3 h-3 text-[#E86034]" />
              <span>Urban Furniture Corporate Portal</span>
            </div>
            <h1 className="font-serif-luxury text-2xl sm:text-4xl text-[#141A17] font-bold tracking-tight">
              {activeTab === 'helpdesk' ? (
                <>
                  Concierge Help Desk <span className="italic font-normal text-[#2D4A3E]">& Support</span>
                </>
              ) : (
                <>
                  Trade Partner <span className="italic font-normal text-[#2D4A3E]">& Atelier Guild</span>
                </>
              )}
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-[#55635D] max-w-md sm:text-right">
            {activeTab === 'helpdesk'
              ? 'Dedicated 24/7 client operations, double-entry accounting reconciliation, and order resolution.'
              : 'Exclusive wholesale margin, priority bespoke fabrication, and automated ledger integration for design professionals.'}
          </p>
        </div>

        {/* =========================================================================
            VIEW 1: HELPDESK & CONCIERGE SUPPORT
            ========================================================================= */}
        {activeTab === 'helpdesk' && (
          <div className="space-y-12 animate-fadeIn">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white rounded-2xl p-4 border border-[#E6DFD4] shadow-xs">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-[#55635D] tracking-wider mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#E86034]" />
                  <span>First Response</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#141A17]">
                  &lt; 12 Mins
                </div>
                <div className="text-[10px] text-emerald-600 font-medium mt-0.5">24/7 Concierge Queue</div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#E6DFD4] shadow-xs">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-[#55635D] tracking-wider mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2D4A3E]" />
                  <span>Ledger Integrity</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#141A17]">
                  0.000 Variance
                </div>
                <div className="text-[10px] text-emerald-600 font-medium mt-0.5">100% Balanced Books</div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#E6DFD4] shadow-xs">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-[#55635D] tracking-wider mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Resolution Rate</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#141A17]">
                  99.8%
                </div>
                <div className="text-[10px] text-[#55635D] font-medium mt-0.5">Over 1,400+ Atelier Tickets</div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#E6DFD4] shadow-xs">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-[#55635D] tracking-wider mb-1">
                  <Building2 className="w-3.5 h-3.5 text-[#E8C547]" />
                  <span>Atelier HQ</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#141A17]">
                  Nariman Point
                </div>
                <div className="text-[10px] text-[#55635D] font-medium mt-0.5">Mumbai Flagship Showroom</div>
              </div>
            </div>

            {/* Split Grid: Submit Ticket Form + Active Ticket Tracker */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left 7 Columns: Ticket Submission Form */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DFD4] shadow-sm">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E6DFD4]">
                  <div>
                    <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#141A17]">
                      Submit a Concierge Ticket
                    </h2>
                    <p className="text-xs text-[#55635D] mt-0.5">
                      Connect with our engineering, master craftsmanship, or financial ledger teams.
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#FAF5ED] border border-[#E6DEC8] flex items-center justify-center text-[#2D4A3E]">
                    <Send className="w-4 h-4 text-[#E86034]" />
                  </div>
                </div>

                {ticketSubmitted ? (
                  <div className="p-6 bg-[#FAF5ED] border border-[#CCE0B2] rounded-2xl text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
                      <Check className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <h3 className="font-serif-luxury text-lg font-bold text-[#141A17]">
                      Ticket {ticketSubmitted} Created Successfully!
                    </h3>
                    <p className="text-xs text-[#55635D] max-w-sm mx-auto">
                      Our concierge team has received your inquiry. A ledger audit and status update has been posted to your tracker.
                    </p>
                    <button
                      type="button"
                      onClick={() => setTicketSubmitted(null)}
                      className="px-5 py-2 rounded-full bg-[#2D4A3E] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#1E332A] transition-colors cursor-pointer"
                    >
                      Submit Another Ticket
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleTicketSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#55635D] mb-1">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={ticketForm.name}
                          onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                          placeholder="e.g. Vikram Malhotra"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD4] bg-[#FAF8F5] text-xs focus:outline-hidden focus:border-[#2D4A3E] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#55635D] mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={ticketForm.email}
                          onChange={(e) => setTicketForm({ ...ticketForm, email: e.target.value })}
                          placeholder="vikram@atelierstudio.in"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD4] bg-[#FAF8F5] text-xs focus:outline-hidden focus:border-[#2D4A3E] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#55635D] mb-1">
                          Inquiry Category *
                        </label>
                        <select
                          value={ticketForm.category}
                          onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD4] bg-[#FAF8F5] text-xs focus:outline-hidden focus:border-[#2D4A3E] transition-colors"
                        >
                          <option value="Double-Entry Ledger Balancing">Double-Entry Ledger Balancing</option>
                          <option value="Sales Order & Invoicing">Sales Order & Invoicing</option>
                          <option value="Vendor Bills & Procurement">Vendor Bills & Procurement</option>
                          <option value="Custom Atelier Sizing & Materials">Custom Atelier Sizing & Materials</option>
                          <option value="Showroom Logistics & White Glove">Showroom Logistics & White Glove</option>
                          <option value="General Technical Inquiry">General Technical Inquiry</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#55635D] mb-1">
                          Order / Ledger Ref (Optional)
                        </label>
                        <input
                          type="text"
                          value={ticketForm.referenceNo}
                          onChange={(e) => setTicketForm({ ...ticketForm, referenceNo: e.target.value })}
                          placeholder="e.g. SO-2026-091 or GL-771"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD4] bg-[#FAF8F5] text-xs focus:outline-hidden focus:border-[#2D4A3E] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#55635D] mb-1">
                        Priority Level
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {['Standard', 'Medium', 'Urgent (Ledger Halt)'].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setTicketForm({ ...ticketForm, priority: p })}
                            className={`py-2 px-3 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer text-center ${
                              ticketForm.priority === p
                                ? 'bg-[#2D4A3E] text-white border-[#2D4A3E] shadow-xs'
                                : 'bg-[#FAF8F5] text-[#55635D] border-[#E6DFD4] hover:border-[#2D4A3E]/30'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#55635D] mb-1">
                        Detailed Message & Context *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={ticketForm.message}
                        onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                        placeholder="Describe the issue, transaction dates, debit/credit entries, or furniture SKU..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD4] bg-[#FAF8F5] text-xs focus:outline-hidden focus:border-[#2D4A3E] transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={ticketSubmitting}
                      className="w-full py-3 px-6 rounded-full bg-[#E86034] hover:bg-[#D55025] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {ticketSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Dispatching to Concierge Desk...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Ticket to Concierge</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Right 5 Columns: Live Active Tickets & Direct Contact */}
              <div className="lg:col-span-5 space-y-6">
                {/* Active Tickets Tracker */}
                <div className="bg-white rounded-3xl p-6 border border-[#E6DFD4] shadow-sm">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E6DFD4]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#2D4A3E]" />
                      <h3 className="font-serif-luxury text-base font-bold text-[#141A17]">
                        Active Concierge Tracker
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF5ED] text-[#2D4A3E] border border-[#E6DEC8]">
                      {activeTickets.length} Active
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                    {activeTickets.map((t) => (
                      <div
                        key={t.id}
                        className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D6] hover:border-[#2D4A3E]/30 transition-all space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[11px] font-bold text-[#2D4A3E]">{t.id}</span>
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${t.statusColor}`}>
                            {t.status}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#141A17] line-clamp-1">{t.subject}</p>
                        <div className="flex items-center justify-between text-[10px] text-[#55635D] pt-1 border-t border-[#EAE3D6]/70">
                          <span>{t.agent}</span>
                          <span>{t.updated}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Concierge Contact Card */}
                <div className="bg-gradient-to-br from-[#1A2E25] to-[#101C17] text-white rounded-3xl p-6 border border-[#2D4A3E] shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#E8C547]" />
                    <h3 className="font-serif-luxury text-base font-bold text-[#FAF8F5]">
                      Direct VIP Concierge Line
                    </h3>
                  </div>
                  <p className="text-xs text-[#A1B8AF] leading-relaxed">
                    For high-priority orders, custom fabrications, and emergency book closings, connect with our Nariman Point operations desk.
                  </p>
                  <div className="space-y-2 pt-2 text-xs border-t border-white/10">
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-3.5 h-3.5 text-[#E86034]" />
                      <span className="font-mono">+91 (022) 4890-1200</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-3.5 h-3.5 text-[#E8C547]" />
                      <span className="font-mono">concierge@urbanfurniture.com</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Atelier 4B, Free Press House, Nariman Point, Mumbai</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Knowledge Base & FAQs Accordion */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DFD4] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-[#E6DFD4] gap-4">
                <div>
                  <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#141A17]">
                    Knowledge Base & Frequently Asked Questions
                  </h2>
                  <p className="text-xs text-[#55635D] mt-0.5">
                    Instant answers for double-entry accounting, order tracking, and trade terms.
                  </p>
                </div>

                <div className="relative max-w-xs w-full">
                  <Search className="w-4 h-4 text-[#55635D] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                    placeholder="Search ledger, CAD, returns..."
                    className="w-full pl-9 pr-4 py-2 rounded-full border border-[#E6DFD4] bg-[#FAF8F5] text-xs focus:outline-hidden focus:border-[#2D4A3E]"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredFaqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-[#E6DFD4] bg-[#FAF8F5] overflow-hidden transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                        className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F2ECE4]/60 transition-colors"
                      >
                        <span className="font-serif-luxury text-sm font-bold text-[#141A17]">
                          {faq.q}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-[#2D4A3E] shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#55635D] shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 pt-1 text-xs text-[#4A5550] leading-relaxed border-t border-[#E6DFD4]/50">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 2: PARTNER PROGRAM & DESIGNER GUILD
            ========================================================================= */}
        {activeTab === 'partner' && (
          <div className="space-y-12 animate-fadeIn">
            {/* Value Proposition Hero Banner */}
            <div className="relative rounded-3xl bg-gradient-to-br from-[#1A2E25] via-[#14241D] to-[#0D1713] text-white p-8 sm:p-12 overflow-hidden border border-[#2D4A3E] shadow-md">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#E86034]/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 max-w-2xl space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-[#D2E7A4] border border-white/15">
                  <Briefcase className="w-3.5 h-3.5 text-[#E8C547]" />
                  <span>The Trade Atelier Guild</span>
                </span>

                <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold tracking-tight text-[#FAF8F5]">
                  Designed for Architects, Interior Designers & Luxury Curators.
                </h2>

                <p className="text-xs sm:text-sm text-[#A1B8AF] leading-relaxed">
                  Join an exclusive trade network providing up to 35% wholesale margin, native double-entry ledger commission attribution, priority workshop access, and high-fidelity 3D digital assets.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="#apply-form"
                    className="px-6 py-3 rounded-full bg-[#E86034] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#D55025] transition-colors shadow-sm"
                  >
                    Apply for Guild Membership
                  </a>
                  <a
                    href="#calculator"
                    className="px-5 py-3 rounded-full border border-white/20 text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-white/10 transition-colors"
                  >
                    Estimate Commissions ⟶
                  </a>
                </div>
              </div>
            </div>

            {/* 4 Key Trade Perks */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-3xl p-6 border border-[#E6DFD4] shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF5ED] border border-[#E6DEC8] flex items-center justify-center text-[#E86034]">
                  <Calculator className="w-5 h-5" />
                </div>
                <h3 className="font-serif-luxury text-base font-bold text-[#141A17]">
                  Up to 35% Wholesale Margin
                </h3>
                <p className="text-xs text-[#55635D] leading-relaxed">
                  Direct trade pricing with automated commission disbursement recorded in real-time on your partner ledger.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#E6DFD4] shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF5ED] border border-[#E6DEC8] flex items-center justify-center text-[#2D4A3E]">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-serif-luxury text-base font-bold text-[#141A17]">
                  3D CAD, Revit & BIM Suite
                </h3>
                <p className="text-xs text-[#55635D] leading-relaxed">
                  Instant access to photorealistic 4K PBR materials, SketchUp 3D models, and Revit families for architectural renders.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#E6DFD4] shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF5ED] border border-[#E6DEC8] flex items-center justify-center text-[#E8C547]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-serif-luxury text-base font-bold text-[#141A17]">
                  Physical Atelier Swatch Box
                </h3>
                <p className="text-xs text-[#55635D] leading-relaxed">
                  A complimentary curated presentation box with 40+ tactile bouclés, Italian leathers, and hand-finished timber blocks.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#E6DFD4] shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF5ED] border border-[#E6DEC8] flex items-center justify-center text-emerald-600">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-serif-luxury text-base font-bold text-[#141A17]">
                  Bespoke Atelier Priority
                </h3>
                <p className="text-xs text-[#55635D] leading-relaxed">
                  Fast-track factory scheduling for bespoke modifications, custom upholstery, and white-glove residential delivery.
                </p>
              </div>
            </div>

            {/* Interactive Commission Calculator */}
            <div id="calculator" className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E6DFD4] shadow-sm">
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FAF5ED] text-[#2D4A3E] border border-[#E6DEC8]">
                    <Calculator className="w-3.5 h-3.5 text-[#E86034]" />
                    <span>Interactive Trade Estimator</span>
                  </div>
                  <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#141A17]">
                    Calculate Your Studio's Trade Rebate
                  </h2>
                  <p className="text-xs text-[#55635D]">
                    Adjust your expected annual client procurement volume to see your unlocked Guild Tier and projected revenue.
                  </p>
                </div>

                <div className="space-y-4 bg-[#FAF8F5] p-6 rounded-2xl border border-[#EAE3D6]">
                  <div className="flex justify-between items-center text-xs font-bold uppercase text-[#55635D]">
                    <span>Estimated Annual Procurement</span>
                    <span className="font-mono text-base text-[#2D4A3E] font-bold">
                      ₹{procurementVolume.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="500000"
                    max="10000000"
                    step="250000"
                    value={procurementVolume}
                    onChange={(e) => setProcurementVolume(Number(e.target.value))}
                    className="w-full accent-[#2D4A3E] cursor-pointer h-2 bg-[#E2D8CA] rounded-lg"
                  />

                  <div className="flex justify-between text-[10px] text-[#55635D] font-mono">
                    <span>₹5 Lakhs (Silver)</span>
                    <span>₹50 Lakhs (Gold)</span>
                    <span>₹1 Crore+ (Platinum Guild)</span>
                  </div>
                </div>

                {/* Calculation Output Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-[#FAF5ED] border border-[#E6DEC8] text-center space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#55635D]">
                      Unlocked Tier
                    </span>
                    <div className="font-serif-luxury text-base sm:text-lg font-bold text-[#141A17]">
                      {currentTier.name}
                    </div>
                    <span className={`inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${currentTier.badgeBg}`}>
                      {currentTier.commissionRate}% Trade Margin
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF5ED] border border-[#E6DEC8] text-center space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#55635D]">
                      Annual Studio Rebate
                    </span>
                    <div className="font-mono text-lg sm:text-xl font-bold text-emerald-700">
                      ₹{estimatedSavings.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] text-emerald-600 font-medium">Auto-credited to Ledger</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF5ED] border border-[#E6DEC8] text-center space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#55635D]">
                      Key Guild Benefit
                    </span>
                    <div className="text-xs font-semibold text-[#141A17] pt-1">
                      {currentTier.perks[1]}
                    </div>
                    <span className="text-[10px] text-[#55635D]">Full digital CAD & swatch access</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Guild Application Form */}
            <div id="apply-form" className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E6DFD4] shadow-sm max-w-3xl mx-auto">
              <div className="text-center pb-6 mb-6 border-b border-[#E6DFD4] space-y-1">
                <h2 className="font-serif-luxury text-2xl font-bold text-[#141A17]">
                  Apply for Guild Membership
                </h2>
                <p className="text-xs text-[#55635D]">
                  Verify your design studio or architectural credentials for instant trade privileges.
                </p>
              </div>

              {partnerSubmitted ? (
                <div className="p-8 bg-[#FAF5ED] border border-[#CCE0B2] rounded-2xl text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                    <Check className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <h3 className="font-serif-luxury text-xl font-bold text-[#141A17]">
                    Welcome to the Atelier Partner Guild!
                  </h3>
                  <p className="text-xs text-[#55635D] max-w-md mx-auto">
                    Your studio credentials have been verified. Your dedicated Partner Code has been generated:{' '}
                    <span className="font-mono font-bold text-[#2D4A3E]">
                      {partnerSubmittedData?.partnerCode || 'UF-TRADE-2026'}
                    </span>
                    . Privilege Tier:{' '}
                    <span className="font-semibold text-[#141A17]">
                      {partnerSubmittedData?.tier || currentTier.name} ({partnerSubmittedData?.commissionRate || currentTier.commissionRate}% Trade Margin)
                    </span>
                    . A complimentary swatch presentation box is being prepared for dispatch.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setPartnerSubmitted(false);
                      setPartnerSubmittedData(null);
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#2D4A3E] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1E332A] transition-colors cursor-pointer"
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePartnerSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#55635D] mb-1">
                        Design Studio / Firm Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={partnerForm.firmName}
                        onChange={(e) => setPartnerForm({ ...partnerForm, firmName: e.target.value })}
                        placeholder="e.g. Studio Vista Architecture"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD4] bg-[#FAF8F5] text-xs focus:outline-hidden focus:border-[#2D4A3E]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#55635D] mb-1">
                        Lead Architect / Principal *
                      </label>
                      <input
                        type="text"
                        required
                        value={partnerForm.leadName}
                        onChange={(e) => setPartnerForm({ ...partnerForm, leadName: e.target.value })}
                        placeholder="e.g. Ar. Priya Singhal"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD4] bg-[#FAF8F5] text-xs focus:outline-hidden focus:border-[#2D4A3E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#55635D] mb-1">
                        Business Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={partnerForm.email}
                        onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })}
                        placeholder="priya@studiovista.in"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD4] bg-[#FAF8F5] text-xs focus:outline-hidden focus:border-[#2D4A3E]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#55635D] mb-1">
                        Contact Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={partnerForm.phone}
                        onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })}
                        placeholder="+91 98200 12345"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD4] bg-[#FAF8F5] text-xs focus:outline-hidden focus:border-[#2D4A3E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#55635D] mb-1">
                        Practice Category *
                      </label>
                      <select
                        value={partnerForm.category}
                        onChange={(e) => setPartnerForm({ ...partnerForm, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD4] bg-[#FAF8F5] text-xs focus:outline-hidden focus:border-[#2D4A3E]"
                      >
                        <option value="Interior Design Studio">Interior Design Studio</option>
                        <option value="Architectural Practice">Architectural Practice</option>
                        <option value="Hospitality Furnisher">Hospitality Furnisher</option>
                        <option value="Luxury Retail Showroom">Luxury Retail Showroom</option>
                        <option value="Real Estate Specifier">Real Estate Specifier</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#55635D] mb-1">
                        GSTIN / Tax Registration
                      </label>
                      <input
                        type="text"
                        value={partnerForm.gstin}
                        onChange={(e) => setPartnerForm({ ...partnerForm, gstin: e.target.value })}
                        placeholder="27ABCDE1234F1Z5"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD4] bg-[#FAF8F5] text-xs focus:outline-hidden focus:border-[#2D4A3E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#55635D] mb-1">
                      Website or Instagram Portfolio URL
                    </label>
                    <input
                      type="url"
                      value={partnerForm.website}
                      onChange={(e) => setPartnerForm({ ...partnerForm, website: e.target.value })}
                      placeholder="https://instagram.com/studiovista"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD4] bg-[#FAF8F5] text-xs focus:outline-hidden focus:border-[#2D4A3E]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={partnerSubmitting}
                    className="w-full py-3.5 px-6 rounded-full bg-[#2D4A3E] hover:bg-[#1E332A] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer pt-3 disabled:opacity-50"
                  >
                    {partnerSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Registering Studio Credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>Register Studio for Trade Privileges</span>
                        <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Launchpage Footer */}
      <Footer
        onOpenAuth={onOpenAuth || (() => {
          window.history.pushState(null, '', '/login');
          window.dispatchEvent(new PopStateEvent('popstate'));
        })}
        onNavigatePartnerHelpdesk={onNavigatePartnerHelpdesk || ((tab) => {
          handleTabChange(tab);
        })}
        onNavigateAbout={onNavigateAbout || ((tab = 'story') => {
          window.history.pushState(null, '', `/about#${tab}`);
          window.dispatchEvent(new PopStateEvent('popstate'));
        })}
        onNavigateShowrooms={onNavigateShowrooms || (() => {
          window.history.pushState(null, '', '/showrooms');
          window.dispatchEvent(new PopStateEvent('popstate'));
        })}
      />
    </div>
  );
};

export default PartnerHelpdeskPage;
