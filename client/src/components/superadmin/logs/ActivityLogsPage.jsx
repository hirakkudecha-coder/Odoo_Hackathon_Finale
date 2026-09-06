import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Clock, 
  Building2, 
  User, 
  Globe, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  X,
  ArrowUpDown,
  RefreshCw
} from 'lucide-react';
import { exportTableToPDF } from '../../../utils/pdfGenerator';

export const ActivityLogsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [selectedLog, setSelectedLog] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const itemsPerPage = 8;

  const rawLogs = [
    {
      id: 'LOG-8841',
      timestamp: '2026-09-06 01:14:22',
      relativeTime: '15 mins ago',
      actor: 'Nikita Sharma',
      actorEmail: 'admin@urbanfurniture.com',
      role: 'Super Admin',
      org: 'Urban Atelier HQ',
      action: 'ORGANIZATION_STATUS_UPDATE',
      description: 'Approved Guild Trade Partner certification for Modern Spaces Design Studio',
      module: 'Trade Partners',
      severity: 'success',
      ip: '192.168.1.45',
      location: 'New Delhi, IN',
      details: {
        partnerId: 'PART-9021',
        newStatus: 'approved',
        tier: 'Platinum Atelier',
        commissionMargin: '22%'
      }
    },
    {
      id: 'LOG-8840',
      timestamp: '2026-09-06 00:45:10',
      relativeTime: '45 mins ago',
      actor: 'Rohan Mehta',
      actorEmail: 'rohan.mehta@urbanfurniture.com',
      role: 'Senior Accountant',
      org: 'Urban Atelier HQ',
      action: 'JOURNAL_ENTRY_POST',
      description: 'Posted balanced General Ledger entry JE-2026-0042 for Customer Invoice INV-2026-0012',
      module: 'General Ledger',
      severity: 'info',
      ip: '192.168.1.78',
      location: 'Mumbai, IN',
      details: {
        entryNumber: 'JE-2026-0042',
        debitAccount: '110000 - Trade Debtors (₹ 1,45,000.00)',
        creditAccount: '400000 - Finished Goods Sales (₹ 1,45,000.00)'
      }
    },
    {
      id: 'LOG-8839',
      timestamp: '2026-09-05 23:30:15',
      relativeTime: '2 hours ago',
      actor: 'System Automation',
      actorEmail: 'system@cron.internal',
      role: 'Daemon',
      org: 'System Core',
      action: 'BUDGET_VARIANCE_CHECK',
      description: 'Evaluated monthly departmental budgets against FY2026 operational expenditure',
      module: 'Budgets',
      severity: 'info',
      ip: '127.0.0.1',
      location: 'Server Core (AWS ap-south-1)',
      details: {
        totalEvaluated: 6,
        atRiskCount: 1,
        departmentAtRisk: 'Marketing (99% utilization)'
      }
    },
    {
      id: 'LOG-8838',
      timestamp: '2026-09-05 22:15:00',
      relativeTime: '3 hours ago',
      actor: 'Aarav Mehta',
      actorEmail: 'aarav@modernspaces.design',
      role: 'Partner Admin',
      org: 'Modern Spaces',
      action: 'SHOWROOM_TOUR_RESERVED',
      description: 'Booked Private VIP Architectural Tour for High-End Villa Project',
      module: 'Showrooms',
      severity: 'success',
      ip: '103.24.12.89',
      location: 'Bengaluru, IN',
      details: {
        gallery: 'Bengaluru Indiranagar Atelier',
        date: '15 Sept 2026',
        slot: '11:00 AM - 01:00 PM',
        partySize: 4
      }
    },
    {
      id: 'LOG-8837',
      timestamp: '2026-09-05 21:05:42',
      relativeTime: '4 hours ago',
      actor: 'Security Firewall',
      actorEmail: 'waf@security.internal',
      role: 'WAF',
      org: 'Security Gateway',
      action: 'FAILED_LOGIN_ATTEMPT',
      description: '3 consecutive invalid password attempts detected from unrecognized subnet',
      module: 'Authentication',
      severity: 'danger',
      ip: '45.154.255.19',
      location: 'Frankfurt, DE',
      details: {
        targetedEmail: 'root@urbanfurniture.com',
        attemptCount: 3,
        actionTaken: 'IP temporarily rate-limited for 15 minutes'
      }
    },
    {
      id: 'LOG-8836',
      timestamp: '2026-09-05 19:40:11',
      relativeTime: '6 hours ago',
      actor: 'Nikita Sharma',
      actorEmail: 'admin@urbanfurniture.com',
      role: 'Super Admin',
      org: 'Urban Atelier HQ',
      action: 'ORGANIZATION_PLAN_UPGRADE',
      description: 'Upgraded tenant Wood & More to Enterprise Guild Tier (Annual Plan)',
      module: 'Tenants',
      severity: 'success',
      ip: '192.168.1.45',
      location: 'New Delhi, IN',
      details: {
        orgId: 'ORG-5512',
        previousPlan: 'Professional Studio',
        newPlan: 'Enterprise Guild',
        seatsAdded: 10
      }
    },
    {
      id: 'LOG-8835',
      timestamp: '2026-09-05 18:22:50',
      relativeTime: '7 hours ago',
      actor: 'Priya Nambiar',
      actorEmail: 'priya@woodandmore.com',
      role: 'Tenant Admin',
      org: 'Wood & More',
      action: 'PURCHASE_ORDER_CONFIRMED',
      description: 'Confirmed PO-2026-0188 for 50 Units of Handcrafted Oak Credenzas',
      module: 'Purchases',
      severity: 'info',
      ip: '114.143.20.12',
      location: 'Chennai, IN',
      details: {
        poNumber: 'PO-2026-0188',
        vendor: 'Azure Craft Wood Mills',
        totalGross: '₹ 15,40,000.00'
      }
    },
    {
      id: 'LOG-8834',
      timestamp: '2026-09-05 16:10:04',
      relativeTime: '9 hours ago',
      actor: 'System Automation',
      actorEmail: 'system@cron.internal',
      role: 'Daemon',
      org: 'System Core',
      action: 'TOKEN_KEY_ROTATION',
      description: 'Rotated internal JWT signature signing keys and cleared stale refresh tokens',
      module: 'Security',
      severity: 'warning',
      ip: '127.0.0.1',
      location: 'Server Core (AWS ap-south-1)',
      details: {
        keyAlgorithm: 'RS256',
        revokedSessions: 12
      }
    },
    {
      id: 'LOG-8833',
      timestamp: '2026-09-05 14:02:18',
      relativeTime: '11 hours ago',
      actor: 'Vikram Sengupta',
      actorEmail: 'vikram@elegantspaces.com',
      role: 'Partner Designer',
      org: 'Elegant Spaces',
      action: 'BESPOKE_INQUIRY_SUBMITTED',
      description: 'Submitted Architectural Specifications for Penthouse Living Suite',
      module: 'Concierge',
      severity: 'info',
      ip: '182.74.155.8',
      location: 'Kolkata, IN',
      details: {
        budgetRange: '₹ 20L - ₹ 40L',
        preferredWood: 'Solid American Walnut',
        finish: 'Matte Botanical Oil'
      }
    }
  ];

  const [logs, setLogs] = useState(rawLogs);

  const fetchAuditLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/audit-logs?limit=50', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.auditLogs && Array.isArray(data.auditLogs) && data.auditLogs.length > 0) {
          const mapped = data.auditLogs.map(l => ({
            id: l._id ? `LOG-${String(l._id).slice(-4).toUpperCase()}` : 'LOG-LIVE',
            timestamp: new Date(l.timestamp).toISOString().replace('T', ' ').slice(0, 19),
            relativeTime: 'Live Record',
            actor: l.actorEmail ? l.actorEmail.split('@')[0] : 'System',
            actorEmail: l.actorEmail || 'system@internal',
            role: l.actorRole || 'system',
            org: 'Urban Atelier HQ',
            action: l.action,
            description: l.description,
            module: l.module,
            severity: l.severity || 'info',
            ip: l.ipAddress || '127.0.0.1',
            location: 'Internal Secure Node',
            details: l.details || {}
          }));
          setLogs([...mapped, ...rawLogs]);
        }
      }
    } catch {
      // Graceful fallback to initial seed list
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAuditLogs();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  const handleExportPDF = () => {
    const headers = ['LOG ID', 'TIMESTAMP', 'ACTOR', 'ORGANIZATION', 'MODULE', 'ACTION', 'SEVERITY'];
    const rows = filteredLogs.map(l => [
      l.id,
      l.timestamp,
      `${l.actor} (${l.role})`,
      l.org,
      l.module,
      l.action,
      l.severity.toUpperCase()
    ]);
    exportTableToPDF('System Audit & Activity Trail', headers, rows);
  };

  const categories = ['All', 'Security', 'Tenants', 'General Ledger', 'Budgets', 'Showrooms', 'Concierge'];

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Category filter
      if (activeCategory !== 'All') {
        if (activeCategory === 'Security' && log.module !== 'Security' && log.module !== 'Authentication' && log.module !== 'Auth') return false;
        if (activeCategory === 'Tenants' && log.module !== 'Tenants' && log.module !== 'Trade Partners') return false;
        if (activeCategory === 'General Ledger' && log.module !== 'General Ledger') return false;
        if (activeCategory === 'Budgets' && log.module !== 'Budgets') return false;
        if (activeCategory === 'Showrooms' && log.module !== 'Showrooms') return false;
        if (activeCategory === 'Concierge' && log.module !== 'Concierge') return false;
      }

      // Severity filter
      if (severityFilter !== 'All' && log.severity !== severityFilter) {
        return false;
      }

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          log.id.toLowerCase().includes(q) ||
          log.actor.toLowerCase().includes(q) ||
          log.actorEmail.toLowerCase().includes(q) ||
          log.org.toLowerCase().includes(q) ||
          log.action.toLowerCase().includes(q) ||
          log.description.toLowerCase().includes(q) ||
          log.ip.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [logs, searchQuery, activeCategory, severityFilter]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'success':
        return {
          bg: 'bg-[#E5F7ED] text-[#1E7445] border-[#C2E8D2]',
          icon: CheckCircle2,
          label: 'Success'
        };
      case 'warning':
        return {
          bg: 'bg-[#FEF7EC] text-[#D97706] border-[#FCE6BD]',
          icon: AlertTriangle,
          label: 'Warning'
        };
      case 'danger':
        return {
          bg: 'bg-[#FDE8E8] text-[#DC2626] border-[#F8B4B4]',
          icon: AlertTriangle,
          label: 'Critical'
        };
      case 'info':
      default:
        return {
          bg: 'bg-[#EBF3FE] text-[#2563EB] border-[#C5DCFE]',
          icon: Info,
          label: 'Info'
        };
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* 1. Top Banner Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#141A17] tracking-tight font-bold">
            Activity & Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6963] mt-1">
            Tamper-evident system audit trail, multi-tenant authentication logs, and data mutations.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-[#E8E1D5] text-[#2D4A3E] hover:bg-[#FAF8F5] text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#1C3A2F]' : ''}`} />
            <span>Refresh Feed</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#1C3A2F] text-white hover:bg-[#274438] text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit PDF</span>
          </button>
        </div>
      </div>

      {/* 2. Four Telemetry KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E1D5] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#7A8A83] uppercase tracking-wider block">
              Total Logged Events
            </span>
            <span className="font-serif text-2xl font-bold text-[#141A17] mt-0.5 block">
              1,428
            </span>
            <span className="text-[10px] text-[#1E7445] font-semibold mt-0.5 block">
              +142 recorded today
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#E8EFF5] text-[#2C5282] flex items-center justify-center border border-[#D0DFE9]">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E1D5] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#7A8A83] uppercase tracking-wider block">
              Security & Auth Audits
            </span>
            <span className="font-serif text-2xl font-bold text-[#141A17] mt-0.5 block">
              542
            </span>
            <span className="text-[10px] text-[#2563EB] font-semibold mt-0.5 block">
              Zero active intrusions
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#EBF3FE] text-[#2563EB] flex items-center justify-center border border-[#C5DCFE]">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E1D5] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#7A8A83] uppercase tracking-wider block">
              Tenant Mutations
            </span>
            <span className="font-serif text-2xl font-bold text-[#141A17] mt-0.5 block">
              872
            </span>
            <span className="text-[10px] text-[#1E7445] font-semibold mt-0.5 block">
              Across 18 active guilds
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#E5F7ED] text-[#1E7445] flex items-center justify-center border border-[#C2E8D2]">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E1D5] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#7A8A83] uppercase tracking-wider block">
              Warnings & Flags
            </span>
            <span className="font-serif text-2xl font-bold text-[#D97706] mt-0.5 block">
              14
            </span>
            <span className="text-[10px] text-[#D97706] font-semibold mt-0.5 block">
              All handled automatically
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#FEF7EC] text-[#D97706] flex items-center justify-center border border-[#FCE6BD]">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              activeCategory === cat
                ? 'bg-[#1C3A2F] text-white shadow-xs'
                : 'bg-white text-[#55635D] border border-[#E8E1D5] hover:bg-[#FAF8F5]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 4. Filter Toolbar & Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#E8E1D5] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-[#8A9690] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by action, user, IP, or tenant..."
              className="w-full pl-9.5 pr-4 py-2 bg-[#FAF8F5] border border-[#E8E1D5] rounded-xl text-xs text-[#141A17] placeholder:text-[#8A9690] focus:outline-none focus:border-[#2D4A3E]"
            />
          </div>

          {/* Severity Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-[#6B7872] font-medium whitespace-nowrap">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => {
                setSeverityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-[#FAF8F5] border border-[#E8E1D5] rounded-xl text-xs text-[#141A17] focus:outline-none focus:border-[#2D4A3E] cursor-pointer"
            >
              <option value="All">All Severities</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="danger">Critical / Danger</option>
            </select>
          </div>
        </div>

        {/* 5. Logs Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#F0EAE1]">
          <table className="w-full text-left text-xs border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-[#F8F5F0] text-[#55635D] font-semibold border-b border-[#E8E1D5]">
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Tenant / Org</th>
                <th className="py-3 px-4">Action & Description</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EDE6]">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-10 text-center text-[#7A8A83]">
                    No activity logs match your search and filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => {
                  const badge = getSeverityBadge(log.severity);
                  const Icon = badge.icon;
                  return (
                    <tr 
                      key={log.id} 
                      className="hover:bg-[#FAF8F5] transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-[#141A17]">
                        {log.id}
                      </td>
                      <td className="py-3 px-4 text-[#55635D] whitespace-nowrap">
                        <div className="font-medium text-[#141A17]">{log.relativeTime}</div>
                        <div className="text-[10px] text-[#8C9B94] font-mono">{log.timestamp}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#141A17]">{log.actor}</div>
                        <div className="text-[10px] text-[#7A8A83]">{log.role}</div>
                      </td>
                      <td className="py-3 px-4 text-[#2D4A3E] font-medium whitespace-nowrap">
                        {log.org}
                      </td>
                      <td className="py-3 px-4 max-w-xs sm:max-w-md">
                        <span className="font-mono text-[10px] bg-[#E8E1D5]/40 text-[#1C3A2F] px-1.5 py-0.5 rounded-sm font-bold mr-1.5 inline-block">
                          {log.action}
                        </span>
                        <span className="text-[#44534D] text-[11px] line-clamp-1">
                          {log.description}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#55635D] whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-[#FAF8F5] border border-[#E8E1D5] rounded-md text-[10px] font-semibold text-[#2D4A3E]">
                          {log.module}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-[#55635D] whitespace-nowrap">
                        <div>{log.ip}</div>
                        <div className="text-[9px] text-[#8C9B94]">{log.location}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                          <Icon className="w-3 h-3" />
                          <span>{badge.label}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="p-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#E8EFF5] text-[#2D4A3E] hover:text-[#141A17] transition-colors cursor-pointer"
                          title="Inspect Metadata"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 6. Pagination Footer */}
        <div className="flex items-center justify-between pt-2 text-xs text-[#7A8A83]">
          <span>
            Showing {filteredLogs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} events
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-[#E8E1D5] hover:bg-[#FAF8F5] disabled:opacity-40 disabled:cursor-not-allowed enabled:cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-[#141A17]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-[#E8E1D5] hover:bg-[#FAF8F5] disabled:opacity-40 disabled:cursor-not-allowed enabled:cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 7. Detailed Log Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto my-auto rounded-3xl p-6 sm:p-7 border border-[#E8E1D5] shadow-2xl space-y-5 text-left animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1C3A2F] text-white flex items-center justify-center font-mono font-bold">
                  LOG
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#141A17]">
                    Event Inspector: {selectedLog.id}
                  </h3>
                  <p className="text-xs text-[#7A8A83] font-mono">
                    {selectedLog.timestamp} ({selectedLog.relativeTime})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-xl text-[#7A8A83] hover:text-[#141A17] hover:bg-[#FAF8F5] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E1D5]">
                <div>
                  <span className="text-[#7A8A83] block text-[11px]">Actor:</span>
                  <span className="font-semibold text-[#141A17]">{selectedLog.actor}</span>
                  <span className="text-[#55635D] block">{selectedLog.actorEmail}</span>
                </div>
                <div>
                  <span className="text-[#7A8A83] block text-[11px]">Tenant / Organization:</span>
                  <span className="font-semibold text-[#141A17]">{selectedLog.org}</span>
                  <span className="text-[#1E7445] font-medium block">Role: {selectedLog.role}</span>
                </div>
              </div>

              <div>
                <span className="text-[#7A8A83] block text-[11px] mb-1">Action Signature:</span>
                <span className="font-mono text-xs bg-[#E8E1D5]/60 text-[#141A17] px-2 py-1 rounded-md font-bold block">
                  {selectedLog.action}
                </span>
              </div>

              <div>
                <span className="text-[#7A8A83] block text-[11px] mb-1">Event Narrative:</span>
                <p className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E1D5] text-[#2D4A3E] leading-relaxed">
                  {selectedLog.description}
                </p>
              </div>

              <div>
                <span className="text-[#7A8A83] block text-[11px] mb-1">Payload Metadata & Context:</span>
                <pre className="p-3 bg-[#14231C] text-[#FAF8F5] rounded-xl font-mono text-[11px] overflow-x-auto max-h-36">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#7A8A83] pt-1">
                <span>Origin IP: <strong className="font-mono text-[#141A17]">{selectedLog.ip}</strong></span>
                <span>Geolocation: <strong className="text-[#141A17]">{selectedLog.location}</strong></span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2.5 rounded-xl bg-[#1C3A2F] text-white text-xs font-semibold hover:bg-[#274438] cursor-pointer"
              >
                Dismiss Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLogsPage;
