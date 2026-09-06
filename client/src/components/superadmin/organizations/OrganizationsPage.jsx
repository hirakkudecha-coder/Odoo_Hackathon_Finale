import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  Download, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  CheckCircle2,
  Clock,
  Ban,
  X,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { exportTableToPDF } from '../../../utils/pdfGenerator';

export const OrganizationsPage = ({ onNavigateTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [planFilter, setPlanFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // New org form state
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgDomain, setNewOrgDomain] = useState('');
  const [newOrgPlan, setNewOrgPlan] = useState('Enterprise');
  const [newOrgAdminEmail, setNewOrgAdminEmail] = useState('');

  const [orgs, setOrgs] = useState([
    { id: 1, name: 'Elegant Homes', domain: 'eleganthomes.com', plan: 'Enterprise', users: 34, revenue: '₹ 1,84,000', renewal: '10 Aug 2025', status: 'Active' },
    { id: 2, name: 'Modern Spaces', domain: 'modernspaces.in', plan: 'Growth', users: 22, revenue: '₹ 1,15,000', renewal: '08 Aug 2025', status: 'Active' },
    { id: 3, name: 'Wood & More', domain: 'woodandmore.co', plan: 'Starter', users: 8, revenue: '₹ 45,000', renewal: '05 Aug 2025', status: 'Pending' },
    { id: 4, name: 'Interior Hub', domain: 'interiorhub.io', plan: 'Enterprise', users: 48, revenue: '₹ 2,40,000', renewal: '01 Aug 2025', status: 'Active' },
    { id: 5, name: 'Space Living', domain: 'spaceliving.com', plan: 'Growth', users: 19, revenue: '₹ 98,000', renewal: '28 Jul 2025', status: 'Active' },
    { id: 6, name: 'Urban Roots Co.', domain: 'urbanroots.in', plan: 'Enterprise', users: 41, revenue: '₹ 2,10,000', renewal: '20 Jul 2025', status: 'Active' },
    { id: 7, name: 'DesignCraft Atelier', domain: 'designcraft.design', plan: 'Growth', users: 26, revenue: '₹ 1,32,000', renewal: '15 Jul 2025', status: 'Active' },
    { id: 8, name: 'The Decor Co.', domain: 'thedecor.com', plan: 'Starter', users: 6, revenue: '₹ 38,000', renewal: '10 Jul 2025', status: 'Suspended' },
    { id: 9, name: 'Sheetal Living', domain: 'sheetalliving.com', plan: 'Enterprise', users: 31, revenue: '₹ 1,65,000', renewal: '02 Jul 2025', status: 'Active' },
    { id: 10, name: 'Timber & Stone', domain: 'timberstone.co', plan: 'Growth', users: 15, revenue: '₹ 76,000', renewal: '25 Jun 2025', status: 'Active' },
  ]);

  const filteredOrgs = useMemo(() => {
    return orgs.filter((o) => {
      if (statusFilter !== 'All' && o.status !== statusFilter) return false;
      if (planFilter !== 'All' && o.plan !== planFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          o.name.toLowerCase().includes(q) ||
          o.domain.toLowerCase().includes(q) ||
          o.plan.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [orgs, searchQuery, statusFilter, planFilter]);

  const handleExportPDF = () => {
    const headers = ['#', 'ORGANIZATION NAME', 'DOMAIN', 'TIER PLAN', 'ACTIVE USERS', 'MONTHLY REVENUE', 'RENEWAL DATE', 'STATUS'];
    const rows = filteredOrgs.map((o, idx) => [
      String(idx + 1),
      o.name,
      o.domain,
      o.plan,
      String(o.users),
      o.revenue,
      o.renewal,
      o.status
    ]);
    exportTableToPDF('SUPER ADMIN ORGANIZATIONS MASTER DIRECTORY', headers, rows);
  };

  const handleCreateOrg = (e) => {
    e.preventDefault();
    if (!newOrgName || !newOrgDomain) return;

    const newEntry = {
      id: Date.now(),
      name: newOrgName.trim(),
      domain: newOrgDomain.trim().toLowerCase(),
      plan: newOrgPlan,
      users: 1,
      revenue: newOrgPlan === 'Enterprise' ? '₹ 1,50,000' : newOrgPlan === 'Growth' ? '₹ 80,000' : '₹ 35,000',
      renewal: '05 Sep 2027',
      status: 'Active',
    };

    setOrgs([newEntry, ...orgs]);
    setIsAddModalOpen(false);
    setNewOrgName('');
    setNewOrgDomain('');
    setNewOrgAdminEmail('');
    setToastMessage(`Organization "${newEntry.name}" onboarded successfully!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#14231C] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-[#2D4A3E] animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#141A17] tracking-tight font-bold">
            Organizations
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6963] mt-1">
            Manage multi-tenant business entities, subscriptions, and quotas.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#1C3A2F] hover:bg-[#142921] active:scale-95 text-[#FAF8F5] px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Organization</span>
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E8E1D5] shadow-xs">
        
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-[#F0EAE1]">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A9791]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search organizations or domain..."
              className="w-full bg-[#FAF8F5] border border-[#E4DCD0] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#141A17] placeholder:text-[#8A9791] focus:outline-hidden focus:border-[#2D4A3E] focus:bg-white transition-all shadow-2xs"
            />
          </div>

          {/* Filters & Export */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-[#E4DCD0] rounded-xl px-3.5 py-1.5 pr-8 text-xs font-semibold text-[#4A5550] hover:bg-[#FAF8F5] transition-all cursor-pointer shadow-2xs focus:outline-hidden"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7A8881] pointer-events-none" />
            </div>

            {/* Plan Filter */}
            <div className="relative">
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="appearance-none bg-white border border-[#E4DCD0] rounded-xl px-3.5 py-1.5 pr-8 text-xs font-semibold text-[#4A5550] hover:bg-[#FAF8F5] transition-all cursor-pointer shadow-2xs focus:outline-hidden"
              >
                <option value="All">All Plans</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Growth">Growth</option>
                <option value="Starter">Starter</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7A8881] pointer-events-none" />
            </div>

            {/* Export PDF */}
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#E4DCD0] bg-white text-xs font-semibold text-[#4A5550] hover:bg-[#FAF8F5] hover:text-[#1C3A2F] active:scale-95 transition-all cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-[#7A8881]" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border border-[#EFE8DC] rounded-2xl mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] text-[10.5px] uppercase font-bold text-[#6D7D76] tracking-wider border-b border-[#EFE8DC]">
                <th className="py-3.5 px-4 font-semibold">ORGANIZATION</th>
                <th className="py-3.5 px-4 font-semibold">DOMAIN</th>
                <th className="py-3.5 px-4 font-semibold">SUBSCRIPTION PLAN</th>
                <th className="py-3.5 px-4 font-semibold">USERS</th>
                <th className="py-3.5 px-4 font-semibold">REVENUE / MO</th>
                <th className="py-3.5 px-4 font-semibold">NEXT RENEWAL</th>
                <th className="py-3.5 px-4 font-semibold">STATUS</th>
                <th className="py-3.5 px-4 font-semibold text-right">ACTIONS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F4EFEA] bg-white">
              {filteredOrgs.length > 0 ? (
                filteredOrgs.map((org) => {
                  const statusBadge = 
                    org.status === 'Active' 
                      ? 'bg-[#E5F7ED] text-[#1E7445]' 
                      : org.status === 'Pending' 
                      ? 'bg-[#FEF7EC] text-[#D97706]' 
                      : 'bg-[#FDE8E8] text-[#DC2626]';

                  const dotColor = 
                    org.status === 'Active' 
                      ? 'bg-[#10B981]' 
                      : org.status === 'Pending' 
                      ? 'bg-[#F59E0B]' 
                      : 'bg-[#EF4444]';

                  return (
                    <tr key={org.id} className="hover:bg-[#FAF7F2] transition-colors duration-150 cursor-pointer group">
                      {/* Name with icon */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-[#E8F0EC] text-[#1E7445] flex items-center justify-center font-bold text-xs shrink-0 border border-black/5">
                            <Building2 className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold text-[#141A17] text-xs group-hover:text-[#2D4A3E] transition-colors">
                            {org.name}
                          </span>
                        </div>
                      </td>

                      {/* Domain */}
                      <td className="py-3.5 px-4 text-[#5A6963] font-mono text-[11px]">
                        {org.domain}
                      </td>

                      {/* Plan */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-xs text-[#2D4A3E] bg-[#F2EDE6] px-2.5 py-0.5 rounded-lg border border-[#E0D8CE]">
                          {org.plan}
                        </span>
                      </td>

                      {/* Users */}
                      <td className="py-3.5 px-4 font-numeric font-medium text-[#4A5550]">
                        {org.users} users
                      </td>

                      {/* Revenue */}
                      <td className="py-3.5 px-4 font-numeric font-bold text-[#141A17]">
                        {org.revenue}
                      </td>

                      {/* Renewal */}
                      <td className="py-3.5 px-4 text-[#5A6963] font-numeric text-[11.5px]">
                        {org.renewal}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusBadge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                          <span>{org.status}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              const newStatus = org.status === 'Active' ? 'Suspended' : 'Active';
                              setOrgs(orgs.map((o) => o.id === org.id ? { ...o, status: newStatus } : o));
                              setToastMessage(`${org.name} status updated to ${newStatus}`);
                              setTimeout(() => setToastMessage(''), 2500);
                            }}
                            className="px-2.5 py-1 rounded-lg text-[10.5px] font-semibold border border-[#DDD4C7] bg-[#FAF8F5] hover:bg-[#F2ECE4] text-[#4A5550] transition-colors cursor-pointer"
                          >
                            {org.status === 'Active' ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#7A8881] text-xs">
                    No organizations found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 pt-4 border-t border-[#F0EAE1] text-xs text-[#6B7A74]">
          <span>
            Showing 1–{filteredOrgs.length} of {orgs.length} organizations
          </span>
          <div className="flex items-center gap-1.5">
            <button className="p-1.5 rounded-lg border border-[#E4DCD0] bg-white text-[#55635D] disabled:opacity-40" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="w-8 h-8 rounded-lg bg-[#EAE3D6] text-[#1C3A2F] font-bold text-xs flex items-center justify-center border border-[#DDD4C7]">
              1
            </span>
            <button className="p-1.5 rounded-lg border border-[#E4DCD0] bg-white text-[#55635D] disabled:opacity-40" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Add Organization Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full max-h-[90vh] overflow-y-auto my-auto shadow-2xl border border-[#E8E1D5] animate-scaleUp text-left">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE1]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E8F0EC] text-[#1E7445] flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#141A17]">
                  Add New Organization
                </h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 text-[#8A9892] hover:text-[#141A17] rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOrg} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="font-semibold text-[#3D4C45] block mb-1">
                  Organization Name *
                </label>
                <input
                  type="text"
                  required
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="e.g. Royal Living Spaces"
                  className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3.5 py-2.5 text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#3D4C45] block mb-1">
                  Domain / Subdomain *
                </label>
                <input
                  type="text"
                  required
                  value={newOrgDomain}
                  onChange={(e) => setNewOrgDomain(e.target.value)}
                  placeholder="e.g. royalliving.com"
                  className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3.5 py-2.5 text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#3D4C45] block mb-1">
                  Primary Admin Email
                </label>
                <input
                  type="email"
                  value={newOrgAdminEmail}
                  onChange={(e) => setNewOrgAdminEmail(e.target.value)}
                  placeholder="admin@royalliving.com"
                  className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3.5 py-2.5 text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#3D4C45] block mb-1">
                  Subscription Tier
                </label>
                <select
                  value={newOrgPlan}
                  onChange={(e) => setNewOrgPlan(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3.5 py-2.5 text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]"
                >
                  <option value="Enterprise">Enterprise (₹1,50,000/mo - Unlimited Users)</option>
                  <option value="Growth">Growth (₹80,000/mo - Up to 30 Users)</option>
                  <option value="Starter">Starter (₹35,000/mo - Up to 10 Users)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#F0EAE1]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#DDD4C7] text-[#55635D] font-semibold hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1C3A2F] text-[#FAF8F5] font-semibold hover:bg-[#142921]"
                >
                  Create Organization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationsPage;
