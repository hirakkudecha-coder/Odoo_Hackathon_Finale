import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Download, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  CheckCircle2,
  X,
  Shield,
  UserCheck
} from 'lucide-react';
import { exportTableToPDF } from '../../../utils/pdfGenerator';

export const SuperAdminUsersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [orgFilter, setOrgFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserOrg, setNewUserOrg] = useState('Elegant Homes');
  const [newUserRole, setNewUserRole] = useState('Accountant');

  const [users, setUsers] = useState([
    { id: 1, name: 'Nikita Sharma', email: 'nikita@urbanfurniture.com', org: 'Urban Furniture HQ', role: 'Super Admin', status: 'Active', joined: '01 Jan 2024' },
    { id: 2, name: 'Rajesh Sharma', email: 'rajesh@eleganthomes.com', org: 'Elegant Homes', role: 'Admin', status: 'Active', joined: '15 Feb 2024' },
    { id: 3, name: 'Aarav Mehta', email: 'aarav@modernspaces.in', org: 'Modern Spaces', role: 'Accountant', status: 'Active', joined: '20 Mar 2024' },
    { id: 4, name: 'Rohan Kapoor', email: 'rohan@woodandmore.co', org: 'Wood & More', role: 'Manager', status: 'Active', joined: '10 Apr 2024' },
    { id: 5, name: 'Priya Iyer', email: 'priya@interiorhub.io', org: 'Interior Hub', role: 'Accountant', status: 'Active', joined: '02 May 2024' },
    { id: 6, name: 'Vikram Singh', email: 'vikram@spaceliving.com', org: 'Space Living', role: 'Viewer', status: 'Active', joined: '18 Jun 2024' },
    { id: 7, name: 'Ananya Desai', email: 'ananya@urbanroots.in', org: 'Urban Roots Co.', role: 'Admin', status: 'Active', joined: '22 Jul 2024' },
    { id: 8, name: 'Kavita Patel', email: 'kavita@thedecor.com', org: 'The Decor Co.', role: 'Manager', status: 'Inactive', joined: '12 Aug 2024' },
  ]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== 'All' && u.role !== roleFilter) return false;
      if (orgFilter !== 'All' && u.org !== orgFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.org.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [users, searchQuery, roleFilter, orgFilter]);

  const handleExportPDF = () => {
    const headers = ['#', 'FULL NAME', 'EMAIL ADDRESS', 'ORGANIZATION', 'SYSTEM ROLE', 'JOINED DATE', 'STATUS'];
    const rows = filteredUsers.map((u, idx) => [
      String(idx + 1),
      u.name,
      u.email,
      u.org,
      u.role,
      u.joined,
      u.status
    ]);
    exportTableToPDF('SUPER ADMIN USERS DIRECTORY', headers, rows);
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const newEntry = {
      id: Date.now(),
      name: newUserName.trim(),
      email: newUserEmail.trim().toLowerCase(),
      org: newUserOrg,
      role: newUserRole,
      status: 'Active',
      joined: '05 Sep 2026',
    };

    setUsers([newEntry, ...users]);
    setIsAddModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setToastMessage(`User "${newEntry.name}" invited successfully!`);
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
            Platform Users
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6963] mt-1">
            Global directory of users, assigned roles, and organization affiliations.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#1C3A2F] hover:bg-[#142921] active:scale-95 text-[#FAF8F5] px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New User</span>
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
              placeholder="Search user by name or email..."
              className="w-full bg-[#FAF8F5] border border-[#E4DCD0] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#141A17] placeholder-[#8A9791] focus:outline-hidden focus:border-[#2D4A3E] focus:bg-white transition-all shadow-2xs"
            />
          </div>

          {/* Filters & Export */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
            {/* Role Filter */}
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="appearance-none bg-white border border-[#E4DCD0] rounded-xl px-3.5 py-1.5 pr-8 text-xs font-semibold text-[#4A5550] hover:bg-[#FAF8F5] transition-all cursor-pointer shadow-2xs focus:outline-hidden"
              >
                <option value="All">All Roles</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Admin">Admin</option>
                <option value="Accountant">Accountant</option>
                <option value="Manager">Manager</option>
                <option value="Viewer">Viewer</option>
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
                <th className="py-3.5 px-4 font-semibold">USER NAME</th>
                <th className="py-3.5 px-4 font-semibold">EMAIL ADDRESS</th>
                <th className="py-3.5 px-4 font-semibold">ORGANIZATION</th>
                <th className="py-3.5 px-4 font-semibold">ASSIGNED ROLE</th>
                <th className="py-3.5 px-4 font-semibold">JOINED DATE</th>
                <th className="py-3.5 px-4 font-semibold">STATUS</th>
                <th className="py-3.5 px-4 font-semibold text-right">ACTIONS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F4EFEA] bg-white">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const roleBadge = 
                    user.role === 'Super Admin'
                      ? 'bg-[#14231C] text-[#FAF8F5]'
                      : user.role === 'Admin' 
                      ? 'bg-[#F2EDE6] text-[#2D4A3E] border border-[#E0D8CE]' 
                      : user.role === 'Accountant' 
                      ? 'bg-[#E5F7ED] text-[#1E7445]' 
                      : user.role === 'Manager' 
                      ? 'bg-[#FEF7EC] text-[#D97706]' 
                      : 'bg-[#F0EDE6] text-[#55665E]';

                  return (
                    <tr key={user.id} className="hover:bg-[#FAF7F2] transition-colors duration-150 cursor-pointer group">
                      {/* Name with initials avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#E5DCD0] text-[#14231C] flex items-center justify-center font-bold text-[10.5px] shrink-0">
                            {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </div>
                          <span className="font-bold text-[#141A17] text-xs group-hover:text-[#2D4A3E] transition-colors">
                            {user.name}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 text-[#5A6963] font-mono text-[11px]">
                        {user.email}
                      </td>

                      {/* Organization */}
                      <td className="py-3.5 px-4 font-medium text-[#2E3B35]">
                        {user.org}
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10.5px] font-semibold ${roleBadge}`}>
                          {user.role}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-[#5A6963] font-numeric text-[11.5px]">
                        {user.joined}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          user.status === 'Active' ? 'bg-[#E5F7ED] text-[#1E7445]' : 'bg-[#FDE8E8] text-[#DC2626]'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`} />
                          <span>{user.status}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
                            setUsers(users.map((u) => u.id === user.id ? { ...u, status: newStatus } : u));
                            setToastMessage(`${user.name} status updated to ${newStatus}`);
                            setTimeout(() => setToastMessage(''), 2500);
                          }}
                          className="px-2.5 py-1 rounded-lg text-[10.5px] font-semibold border border-[#DDD4C7] bg-[#FAF8F5] hover:bg-[#F2ECE4] text-[#4A5550] transition-colors cursor-pointer"
                        >
                          {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#7A8881] text-xs">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-[#E8E1D5] animate-scaleUp text-left">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE1]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E8F0EC] text-[#1E7445] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#141A17]">
                  Add User to Platform
                </h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 text-[#8A9892] hover:text-[#141A17] rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="font-semibold text-[#3D4C45] block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Sumanth Varma"
                  className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3.5 py-2.5 text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#3D4C45] block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="sumanth@company.com"
                  className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3.5 py-2.5 text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#3D4C45] block mb-1">
                  Organization
                </label>
                <select
                  value={newUserOrg}
                  onChange={(e) => setNewUserOrg(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3.5 py-2.5 text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]"
                >
                  <option>Elegant Homes</option>
                  <option>Modern Spaces</option>
                  <option>Wood & More</option>
                  <option>Interior Hub</option>
                  <option>Space Living</option>
                  <option>Urban Roots Co.</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#3D4C45] block mb-1">
                  Assigned System Role
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3.5 py-2.5 text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]"
                >
                  <option value="Admin">Admin (Organization Business Owner)</option>
                  <option value="Accountant">Accountant (Invoicing & Journal Access)</option>
                  <option value="Manager">Manager (Operations & Inventory)</option>
                  <option value="Viewer">Viewer (Read-Only Reports)</option>
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
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminUsersPage;
