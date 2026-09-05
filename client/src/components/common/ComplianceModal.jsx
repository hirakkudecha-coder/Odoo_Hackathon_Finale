import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  Lock,
  CheckCircle2,
  Copy,
  Check,
  Download,
  KeyRound,
  Database,
  Server,
  Clock,
} from 'lucide-react';

export const ComplianceModal = ({ isOpen, initialTab = 'privacy', onClose }) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'privacy');
  const [copiedSection, setCopiedSection] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = (text, id) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleSimulateDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#101C17] text-[#FAF8F5] border border-[#274438] rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="p-6 border-b border-[#1E332A] flex items-center justify-between bg-[#15251F]/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2D4A3E] text-[#FAF8F5] flex items-center justify-center border border-white/10 shadow-xs">
              {activeTab === 'privacy' && <Lock className="w-5 h-5 text-emerald-400" />}
              {activeTab === 'terms' && <FileText className="w-5 h-5 text-[#D2E7A4]" />}
              {activeTab === 'security' && <ShieldCheck className="w-5 h-5 text-[#E86034]" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8EABA0]">
                  Urban Furniture • Legal & Trust Center
                </span>
                <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 text-[9px] font-bold px-2 py-0.5 rounded-full">
                  Audited 2026
                </span>
              </div>
              <h2 className="font-serif-luxury text-xl sm:text-2xl text-white font-bold tracking-tight">
                {activeTab === 'privacy' && 'Privacy Policy & Data Sovereignty'}
                {activeTab === 'terms' && 'Terms of Service & SaaS SLA'}
                {activeTab === 'security' && 'Enterprise Security & Audit Architecture'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-[#182B23] hover:bg-[#223B2F] text-[#A1B8AF] hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Strip */}
        <div className="flex items-center gap-2 px-6 py-3 bg-[#0D1713] border-b border-[#1A2C23] overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'privacy', label: 'Privacy Policy', icon: Lock, badge: 'Zero AI Training' },
            { id: 'terms', label: 'Terms of Service', icon: FileText, badge: '99.98% Uptime' },
            { id: 'security', label: 'Security Architecture', icon: ShieldCheck, badge: 'SOC-2 Ready' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#2D4A3E] text-white shadow-xs border border-[#3E6354]'
                    : 'bg-[#15251F] text-[#8EABA0] hover:text-white hover:bg-[#1A2E25] border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono ${
                    isActive ? 'bg-[#182B23] text-emerald-300' : 'bg-[#101C17] text-[#6D8A7F]'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Area */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1 text-xs sm:text-sm text-[#A1B8AF] leading-relaxed">
          {/* TAB 1: PRIVACY */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-[#15251F] border border-[#223B2F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif-luxury text-lg text-white font-bold">
                    Zero-Knowledge Financial Privacy Promise
                  </h3>
                  <p className="text-xs text-[#8EABA0] mt-0.5">
                    Effective Date: September 1, 2026 • Governed by India DPDP Act 2023 & GDPR Standards
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSimulateDownload}
                  className="inline-flex items-center gap-1.5 bg-[#2D4A3E] hover:bg-[#1E332A] text-white px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadSuccess ? 'Downloaded PDF!' : 'Export PDF Charter'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#14231D] border border-[#1E332A] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#D2E7A4]">01. Ledger Data Ownership</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          'Your financial records, chart of accounts, customer invoices, and vendor bills belong 100% to your company.',
                          'c1'
                        )
                      }
                      className="text-[#6D8A7F] hover:text-white p-1 cursor-pointer"
                      title="Copy Clause"
                    >
                      {copiedSection === 'c1' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-[#CBDDD6]">
                    Urban Furniture ERP acts strictly as a data processor. Your financial ledgers, customer debtor registries, supplier credit agreements, and inventory balances are confidential proprietary business assets. We never aggregate or commercialize ledger data.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#14231D] border border-[#1E332A] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#D2E7A4]">02. Zero AI Model Training</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          'Customer business data and double-entry journals are excluded from public AI training models.',
                          'c2'
                        )
                      }
                      className="text-[#6D8A7F] hover:text-white p-1 cursor-pointer"
                      title="Copy Clause"
                    >
                      {copiedSection === 'c2' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-[#CBDDD6]">
                    None of your transactional records, product cost prices, margin calculations, or customer PII are ever fed into public generative AI models or shared with external analytics networks. All processing remains isolated within your dedicated tenant container.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#14231D] border border-[#1E332A] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#D2E7A4]">03. Encryption Standards</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          'Data is encrypted in transit using TLS 1.3 and at rest with AES-256 bit hardware-accelerated encryption.',
                          'c3'
                        )
                      }
                      className="text-[#6D8A7F] hover:text-white p-1 cursor-pointer"
                      title="Copy Clause"
                    >
                      {copiedSection === 'c3' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-[#CBDDD6]">
                    Every byte transmitted across the wire is shielded by TLS 1.3 cryptographic protocols with perfect forward secrecy. At rest, database records and file artifacts are encrypted using enterprise AES-256 bit hardware security modules.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#14231D] border border-[#1E332A] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#D2E7A4]">04. Complete Data Portability</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          'Export all double-entry general ledger journals, voucher history, and tax reports anytime in standard formats.',
                          'c4'
                        )
                      }
                      className="text-[#6D8A7F] hover:text-white p-1 cursor-pointer"
                      title="Copy Clause"
                    >
                      {copiedSection === 'c4' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-[#CBDDD6]">
                    No vendor lock-in. You hold the unconditional right to export your entire Chart of Accounts, trial balances, inventory valuation histories, and sales journals in open CSV/JSON formats at any moment without penalty or operational delay.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0F1E18] border border-[#1E382C] flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <p className="text-xs text-[#9EC2B4]">
                  Statutory Data Protection Officer: <span className="text-white font-semibold">compliance@urbanfurniture.com</span> • Registered in Mumbai, Maharashtra, India.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: TERMS */}
          {activeTab === 'terms' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-[#15251F] border border-[#223B2F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif-luxury text-lg text-white font-bold">
                    Enterprise Master Subscription Agreement
                  </h3>
                  <p className="text-xs text-[#8EABA0] mt-0.5">
                    99.98% High Availability Uptime Guarantee • Version 4.2
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSimulateDownload}
                  className="inline-flex items-center gap-1.5 bg-[#E86034] hover:bg-[#D55025] text-white px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadSuccess ? 'Downloaded!' : 'Download SLA Terms'}</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-[#14231D] border border-[#1E332A] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#D2E7A4]">§ 1. High Availability & Service Level (SLA)</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      99.98% Commitment
                    </span>
                  </div>
                  <p className="text-xs text-[#CBDDD6]">
                    Urban Furniture commits to a 99.98% operational uptime for general ledger posting, invoice generation, and balance sheet reporting. Scheduled maintenance windows occur exclusively outside peak business hours (Sundays 02:00–04:00 IST) with 72-hour prior advisory notice.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#14231D] border border-[#1E332A] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#D2E7A4]">§ 2. Audit Trail & Ledger Immutability</span>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                      Double-Entry Integrity
                    </span>
                  </div>
                  <p className="text-xs text-[#CBDDD6]">
                    In compliance with international accounting standards, posted journal vouchers cannot be retroactively edited or hard-deleted. Corrections must be booked via authenticated reversal vouchers to preserve strict chronological audit trails.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#14231D] border border-[#1E332A] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#D2E7A4]">§ 3. Multi-User Seat Governance & RBAC</span>
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                      RBAC Enforcement
                    </span>
                  </div>
                  <p className="text-xs text-[#CBDDD6]">
                    Access licenses are assigned by named role (admin, accountant, contact). Sharing credentials across multiple physical users without dedicated seat provision is prohibited. Automated token rotation and anomaly detection guard against session hijacking.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-[#15251F] border border-[#223B2F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif-luxury text-lg text-white font-bold">
                    Defense-in-Depth Financial Engineering
                  </h3>
                  <p className="text-xs text-[#8EABA0] mt-0.5">
                    SOC-2 Type II Certified Architecture • OWASP Top 10 Hardened
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold bg-emerald-950 text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Active Protection Shield</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#14231D] border border-[#1E332A] space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-[#1D352A] text-emerald-400 flex items-center justify-center mb-3">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif-luxury font-bold text-base text-white">
                    Cryptographic JWT & Token Rotation
                  </h4>
                  <p className="text-xs text-[#A1B8AF]">
                    Stateful JWT access tokens signed with 2048-bit RSA keys, strictly scoped expiration times, and instant blacklisting via distributed Redis memory stores upon logout.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#14231D] border border-[#1E332A] space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-[#1D352A] text-emerald-400 flex items-center justify-center mb-3">
                    <Database className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif-luxury font-bold text-base text-white">
                    Cryptographic Journal Invariants
                  </h4>
                  <p className="text-xs text-[#A1B8AF]">
                    Double-entry equality (Debit = Credit) enforced via mathematical engine assertions and database-level transaction rollback barriers before write execution.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#14231D] border border-[#1E332A] space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-[#1D352A] text-emerald-400 flex items-center justify-center mb-3">
                    <Server className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif-luxury font-bold text-base text-white">
                    Isolated Multi-Tenant Sandboxing
                  </h4>
                  <p className="text-xs text-[#A1B8AF]">
                    Virtual private network partitions with tenant isolation policies, automated DDoS mitigation at the edge, and web application firewall (WAF) rate limiting.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#14231D] border border-[#1E332A] space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-[#1D352A] text-emerald-400 flex items-center justify-center mb-3">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif-luxury font-bold text-base text-white">
                    Argon2id & bcrypt Hashing
                  </h4>
                  <p className="text-xs text-[#A1B8AF]">
                    User passwords hashed using industry-standard bcrypt with adaptive salt cost factor 10, completely impervious to rainbow-table and offline dictionary attacks.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Footer Actions */}
        <div className="p-5 bg-[#0D1713] border-t border-[#1E332A] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-[#7E968D]">
            <Clock className="w-3.5 h-3.5 text-[#D2E7A4]" />
            <span>Last legal review: 05 September 2026</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#2D4A3E] text-white hover:bg-[#1E332A] transition-colors cursor-pointer"
          >
            Accept & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceModal;
