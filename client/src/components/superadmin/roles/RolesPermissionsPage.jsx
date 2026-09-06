import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Check, 
  Save, 
  CheckCircle2, 
  RotateCcw,
  Lock,
  Eye,
  Edit,
  Trash2,
  Download
} from 'lucide-react';

export const RolesPermissionsPage = () => {
  const [selectedRole, setSelectedRole] = useState('Admin');
  const [toastMessage, setToastMessage] = useState('');

  const roles = [
    { id: 'Super Admin', name: 'Super Admin', desc: 'Complete root access across all organizations and system settings.' },
    { id: 'Admin', name: 'Business Admin', desc: 'Organization-level administrator with full financial & operational access.' },
    { id: 'Accountant', name: 'Accountant', desc: 'Manages sales, purchases, bank payments, and general ledgers.' },
    { id: 'Manager', name: 'Operations Manager', desc: 'Handles catalog inventory, orders, and operational workflows.' },
    { id: 'Viewer', name: 'Financial Auditor / Viewer', desc: 'Read-only access to statements, audit trails, and financial reports.' },
  ];

  const modules = [
    { id: 'masterData', name: 'Master Data (Contacts, Products, Charts)' },
    { id: 'sales', name: 'Sales Orders & Customer Invoices' },
    { id: 'purchases', name: 'Purchase Orders & Vendor Bills' },
    { id: 'payments', name: 'Bank Payments & Receipts' },
    { id: 'accounting', name: 'Double-Entry Journals & Ledgers' },
    { id: 'budgets', name: 'Budget Tracking & Financial Goals' },
    { id: 'reports', name: 'Financial Reporting (P&L, Balance Sheet)' },
    { id: 'system', name: 'System Settings & Audit Logs' },
  ];

  const [permissions, setPermissions] = useState({
    'Admin': {
      masterData: { read: true, write: true, delete: true, export: true },
      sales: { read: true, write: true, delete: true, export: true },
      purchases: { read: true, write: true, delete: true, export: true },
      payments: { read: true, write: true, delete: true, export: true },
      accounting: { read: true, write: true, delete: true, export: true },
      budgets: { read: true, write: true, delete: true, export: true },
      reports: { read: true, write: true, delete: false, export: true },
      system: { read: true, write: false, delete: false, export: true },
    },
    'Accountant': {
      masterData: { read: true, write: true, delete: false, export: true },
      sales: { read: true, write: true, delete: false, export: true },
      purchases: { read: true, write: true, delete: false, export: true },
      payments: { read: true, write: true, delete: false, export: true },
      accounting: { read: true, write: true, delete: false, export: true },
      budgets: { read: true, write: false, delete: false, export: true },
      reports: { read: true, write: false, delete: false, export: true },
      system: { read: false, write: false, delete: false, export: false },
    },
    'Manager': {
      masterData: { read: true, write: true, delete: false, export: true },
      sales: { read: true, write: true, delete: false, export: true },
      purchases: { read: true, write: true, delete: false, export: true },
      payments: { read: true, write: false, delete: false, export: false },
      accounting: { read: false, write: false, delete: false, export: false },
      budgets: { read: true, write: false, delete: false, export: false },
      reports: { read: false, write: false, delete: false, export: false },
      system: { read: false, write: false, delete: false, export: false },
    },
    'Viewer': {
      masterData: { read: true, write: false, delete: false, export: true },
      sales: { read: true, write: false, delete: false, export: true },
      purchases: { read: true, write: false, delete: false, export: true },
      payments: { read: true, write: false, delete: false, export: true },
      accounting: { read: true, write: false, delete: false, export: true },
      budgets: { read: true, write: false, delete: false, export: true },
      reports: { read: true, write: false, delete: false, export: true },
      system: { read: false, write: false, delete: false, export: false },
    },
    'Super Admin': {
      masterData: { read: true, write: true, delete: true, export: true },
      sales: { read: true, write: true, delete: true, export: true },
      purchases: { read: true, write: true, delete: true, export: true },
      payments: { read: true, write: true, delete: true, export: true },
      accounting: { read: true, write: true, delete: true, export: true },
      budgets: { read: true, write: true, delete: true, export: true },
      reports: { read: true, write: true, delete: true, export: true },
      system: { read: true, write: true, delete: true, export: true },
    }
  });

  const togglePermission = (modId, action) => {
    if (selectedRole === 'Super Admin') return; // Root superadmin always has full permissions
    setPermissions(prev => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [modId]: {
          ...prev[selectedRole]?.[modId],
          [action]: !prev[selectedRole]?.[modId]?.[action]
        }
      }
    }));
  };

  const handleSave = () => {
    setToastMessage(`Permissions for "${selectedRole}" updated and propagated across active sessions!`);
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
            Roles & Permissions Matrix
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6963] mt-1">
            Fine-grained RBAC access control across multi-tenant modules.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-[#1C3A2F] hover:bg-[#142921] active:scale-95 text-[#FAF8F5] px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer shadow-sm shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save Permission Changes</span>
        </button>
      </div>

      {/* Role Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {roles.map((r) => {
          const isSelected = selectedRole === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setSelectedRole(r.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer shrink-0 shadow-2xs ${
                isSelected
                  ? 'bg-[#1C3A2F] text-[#FAF8F5] shadow-xs'
                  : 'bg-white text-[#4A5952] border border-[#E8E1D5] hover:bg-[#FAF8F5]'
              }`}
            >
              {r.name}
            </button>
          );
        })}
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E8E1D5] shadow-xs">
        <div className="mb-4 pb-3 border-b border-[#F0EAE1] flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-base text-[#141A17]">
              Permission Matrix for: <span className="text-[#2D4A3E]">{selectedRole}</span>
            </h3>
            <p className="text-xs text-[#6B7A74] mt-0.5">
              {roles.find(r => r.id === selectedRole)?.desc}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto border border-[#EFE8DC] rounded-2xl">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead>
              <tr className="bg-[#FAF8F5] text-[10.5px] uppercase font-bold text-[#6D7D76] tracking-wider border-b border-[#EFE8DC]">
                <th className="py-3.5 px-4 font-semibold">MODULE / FEATURE</th>
                <th className="py-3.5 px-4 font-semibold text-center w-28">
                  <div className="flex items-center justify-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>READ</span>
                  </div>
                </th>
                <th className="py-3.5 px-4 font-semibold text-center w-28">
                  <div className="flex items-center justify-center gap-1">
                    <Edit className="w-3.5 h-3.5" />
                    <span>WRITE</span>
                  </div>
                </th>
                <th className="py-3.5 px-4 font-semibold text-center w-28">
                  <div className="flex items-center justify-center gap-1">
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>DELETE</span>
                  </div>
                </th>
                <th className="py-3.5 px-4 font-semibold text-center w-28">
                  <div className="flex items-center justify-center gap-1">
                    <Download className="w-3.5 h-3.5" />
                    <span>EXPORT</span>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F4EFEA] bg-white">
              {modules.map((mod) => {
                const current = permissions[selectedRole]?.[mod.id] || { read: false, write: false, delete: false, export: false };
                return (
                  <tr key={mod.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#141A17]">
                      {mod.name}
                    </td>

                    {/* READ */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => togglePermission(mod.id, 'read')}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center mx-auto transition-all cursor-pointer ${
                          current.read ? 'bg-[#E5F7ED] text-[#1E7445] border border-[#B9E6CB]' : 'bg-[#FAF8F5] text-[#9CA3AF] border border-[#E5E7EB]'
                        }`}
                      >
                        {current.read ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Lock className="w-3 h-3 text-[#B0BAB5]" />}
                      </button>
                    </td>

                    {/* WRITE */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => togglePermission(mod.id, 'write')}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center mx-auto transition-all cursor-pointer ${
                          current.write ? 'bg-[#E5F7ED] text-[#1E7445] border border-[#B9E6CB]' : 'bg-[#FAF8F5] text-[#9CA3AF] border border-[#E5E7EB]'
                        }`}
                      >
                        {current.write ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Lock className="w-3 h-3 text-[#B0BAB5]" />}
                      </button>
                    </td>

                    {/* DELETE */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => togglePermission(mod.id, 'delete')}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center mx-auto transition-all cursor-pointer ${
                          current.delete ? 'bg-[#E5F7ED] text-[#1E7445] border border-[#B9E6CB]' : 'bg-[#FAF8F5] text-[#9CA3AF] border border-[#E5E7EB]'
                        }`}
                      >
                        {current.delete ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Lock className="w-3 h-3 text-[#B0BAB5]" />}
                      </button>
                    </td>

                    {/* EXPORT */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => togglePermission(mod.id, 'export')}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center mx-auto transition-all cursor-pointer ${
                          current.export ? 'bg-[#E5F7ED] text-[#1E7445] border border-[#B9E6CB]' : 'bg-[#FAF8F5] text-[#9CA3AF] border border-[#E5E7EB]'
                        }`}
                      >
                        {current.export ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Lock className="w-3 h-3 text-[#B0BAB5]" />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RolesPermissionsPage;
