import React, { useState } from 'react';
import { 
  Settings, 
  Shield, 
  Database, 
  Mail, 
  Key, 
  Save, 
  CheckCircle2, 
  Building2, 
  Bell 
} from 'lucide-react';

export const SystemSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [toastMessage, setToastMessage] = useState('');

  // Form states
  const [systemName, setSystemName] = useState('Urban Furniture Accounting System');
  const [supportEmail, setSupportEmail] = useState('support@urbanfurniture.com');
  const [sessionTimeout, setSessionTimeout] = useState('60');
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [tenantIsolation, setTenantIsolation] = useState(true);
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [apiRateLimit, setApiRateLimit] = useState('1000');

  const tabs = [
    { id: 'general', label: 'General & Brand', icon: Settings },
    { id: 'security', label: 'Security & Auth', icon: Shield },
    { id: 'multitenancy', label: 'Multi-Tenancy', icon: Building2 },
    { id: 'database', label: 'Database & Backups', icon: Database },
    { id: 'email', label: 'Email & Alerts', icon: Mail },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    setToastMessage('System configurations saved and synchronized successfully!');
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
            System Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6963] mt-1">
            Global architecture configuration, security parameters, and automated tasks.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-[#1C3A2F] hover:bg-[#142921] active:scale-95 text-[#FAF8F5] px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer shadow-sm shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save System Settings</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer shrink-0 shadow-2xs ${
                isActive
                  ? 'bg-[#1C3A2F] text-[#FAF8F5] shadow-xs'
                  : 'bg-white text-[#4A5952] border border-[#E8E1D5] hover:bg-[#FAF8F5]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#FAF8F5]' : 'text-[#7A8A83]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Canvas Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E1D5] shadow-xs">
        
        {/* 1. General & Brand */}
        {activeTab === 'general' && (
          <form onSubmit={handleSave} className="space-y-6 max-w-2xl text-xs">
            <div>
              <label className="font-bold text-[#141A17] block mb-1">
                Platform Name
              </label>
              <input
                type="text"
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3.5 py-2.5 text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]"
              />
            </div>

            <div>
              <label className="font-bold text-[#141A17] block mb-1">
                Central Support Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3.5 py-2.5 text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]"
              />
            </div>

            <div>
              <label className="font-bold text-[#141A17] block mb-1">
                Default Currency & Ledger Base
              </label>
              <select className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3.5 py-2.5 text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]">
                <option>INR - Indian Rupee (₹)</option>
                <option>USD - US Dollar ($)</option>
                <option>EUR - Euro (€)</option>
                <option>GBP - British Pound (£)</option>
              </select>
            </div>
          </form>
        )}

        {/* 2. Security & Auth */}
        {activeTab === 'security' && (
          <div className="space-y-6 max-w-2xl text-xs">
            <div className="flex items-center justify-between p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8E1D5]">
              <div>
                <p className="font-bold text-sm text-[#141A17]">Enforce Two-Factor Authentication (2FA)</p>
                <p className="text-[#6B7A74] mt-0.5">Require multi-factor authorization for Admin and Accountant roles.</p>
              </div>
              <button
                type="button"
                onClick={() => setMfaEnforced(!mfaEnforced)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${mfaEnforced ? 'bg-[#1E7445]' : 'bg-[#DDD4C7]'}`}
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${mfaEnforced ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div>
              <label className="font-bold text-[#141A17] block mb-1">
                Session Inactivity Timeout (Minutes)
              </label>
              <input
                type="number"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3.5 py-2.5 text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]"
              />
            </div>
          </div>
        )}

        {/* 3. Multi-Tenancy */}
        {activeTab === 'multitenancy' && (
          <div className="space-y-6 max-w-2xl text-xs">
            <div className="flex items-center justify-between p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8E1D5]">
              <div>
                <p className="font-bold text-sm text-[#141A17]">Strict Database Tenant Isolation</p>
                <p className="text-[#6B7A74] mt-0.5">Separate schema collections and ledger locks for each organization domain.</p>
              </div>
              <button
                type="button"
                onClick={() => setTenantIsolation(!tenantIsolation)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${tenantIsolation ? 'bg-[#1E7445]' : 'bg-[#DDD4C7]'}`}
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${tenantIsolation ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div>
              <label className="font-bold text-[#141A17] block mb-1">
                Global API Rate Limit (requests/hour/tenant)
              </label>
              <input
                type="number"
                value={apiRateLimit}
                onChange={(e) => setApiRateLimit(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl px-3.5 py-2.5 text-xs text-[#141A17] focus:outline-hidden focus:border-[#2D4A3E]"
              />
            </div>
          </div>
        )}

        {/* 4. Database & Backups */}
        {activeTab === 'database' && (
          <div className="space-y-6 max-w-2xl text-xs">
            <div className="flex items-center justify-between p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8E1D5]">
              <div>
                <p className="font-bold text-sm text-[#141A17]">Automated Daily Snapshot Backups</p>
                <p className="text-[#6B7A74] mt-0.5">Daily 03:00 AM UTC encrypted snapshot of all journals and master ledgers.</p>
              </div>
              <button
                type="button"
                onClick={() => setAutoBackup(!autoBackup)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${autoBackup ? 'bg-[#1E7445]' : 'bg-[#DDD4C7]'}`}
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${autoBackup ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="p-4 bg-[#E5F7ED] rounded-2xl border border-[#BDE8CD]">
              <p className="font-bold text-xs text-[#1E7445]">Database Health Status: Optimal</p>
              <p className="text-[11px] text-[#2D5A3F] mt-1">MongoDB Atlas Cluster Replica Set • Primary connected • Latency: 18ms</p>
            </div>
          </div>
        )}

        {/* 5. Email & Alerts */}
        {activeTab === 'email' && (
          <div className="space-y-6 max-w-2xl text-xs">
            <div className="flex items-center justify-between p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8E1D5]">
              <div>
                <p className="font-bold text-sm text-[#141A17]">Automated Payment Reminders</p>
                <p className="text-[#6B7A74] mt-0.5">Send customer invoice reminders 3 days before overdue date.</p>
              </div>
              <button
                type="button"
                onClick={() => setPaymentReminders(!paymentReminders)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${paymentReminders ? 'bg-[#1E7445]' : 'bg-[#DDD4C7]'}`}
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${paymentReminders ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SystemSettingsPage;
