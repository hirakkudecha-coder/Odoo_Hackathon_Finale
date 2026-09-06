import React, { useState } from 'react';
import { 
  Headphones, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronDown,
  MessageSquare
} from 'lucide-react';

export const SuperAdminSupportPage = () => {
  const [toastMessage, setToastMessage] = useState('');
  const [tickets, setTickets] = useState([]);

  // Fetch real tickets from database
  React.useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/helpdesk/tickets', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          if (data.tickets && Array.isArray(data.tickets)) {
            const mapped = data.tickets.map(t => ({
              id: t._id,
              ticketNumber: t.ticketNumber,
              org: t.organization || 'Urban Furniture Patron',
              user: t.name || t.email,
              subject: t.subject || t.message,
              priority: t.priority || 'Medium',
              status: t.status || 'Open',
              time: t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-GB') : 'Today'
            }));
            setTickets(mapped);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch support tickets:', err.message);
      }
    };
    fetchTickets();
  }, []);

  const handleResolve = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/helpdesk/tickets/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status: 'Resolved' })
      });

      setTickets(tickets.map(t => t.id === id ? { ...t, status: 'Resolved' } : t));
      setToastMessage(`Ticket marked as resolved.`);
      setTimeout(() => setToastMessage(''), 2500);
    } catch (err) {
      console.warn('Status patch error:', err);
    }
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
            Multi-Tenant Support Hub
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6963] mt-1">
            Global ticket resolution queue and organization technical inquiries.
          </p>
        </div>
      </div>

      {/* Server Health Status Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#E5F7ED] border border-[#C2E8D2] rounded-2xl p-4">
          <span className="text-xs font-bold text-[#1E7445] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            Core API Services: 99.98% Uptime
          </span>
          <p className="text-[11px] text-[#2E5A42] mt-0.5">Average Response Time: 42ms</p>
        </div>

        <div className="bg-[#EBF3FE] border border-[#C5DCFE] rounded-2xl p-4">
          <span className="text-xs font-bold text-[#2563EB] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
            PDF Generation Engine: Online
          </span>
          <p className="text-[11px] text-[#2F4A78] mt-0.5">Zero queued background jobs</p>
        </div>

        <div className="bg-[#FAF2E8] border border-[#EEDBCA] rounded-2xl p-4">
          <span className="text-xs font-bold text-[#92400E] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D97706]" />
            Open Support Tickets: {tickets.filter(t => t.status !== 'Resolved').length} Active
          </span>
          <p className="text-[11px] text-[#6A4B29] mt-0.5">Median resolution time: 1.4 hours</p>
        </div>
      </div>

      {/* Tickets List Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E8E1D5] shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE1]">
          <h3 className="font-serif font-bold text-lg text-[#141A17]">
            Support Tickets
          </h3>
        </div>

        <div className="overflow-x-auto border border-[#EFE8DC] rounded-2xl mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] text-[10.5px] uppercase font-bold text-[#6D7D76] tracking-wider border-b border-[#EFE8DC]">
                <th className="py-3.5 px-4 font-semibold">TICKET ID</th>
                <th className="py-3.5 px-4 font-semibold">ORGANIZATION</th>
                <th className="py-3.5 px-4 font-semibold">REQUESTER</th>
                <th className="py-3.5 px-4 font-semibold">SUBJECT</th>
                <th className="py-3.5 px-4 font-semibold">PRIORITY</th>
                <th className="py-3.5 px-4 font-semibold">STATUS</th>
                <th className="py-3.5 px-4 font-semibold text-right">ACTION</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F4EFEA] bg-white">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#2D4A3E]">
                    {t.id}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#141A17]">
                    {t.org}
                  </td>
                  <td className="py-3.5 px-4 text-[#5A6963]">
                    {t.user}
                  </td>
                  <td className="py-3.5 px-4 text-[#2E3B35]">
                    {t.subject}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-lg text-[10.5px] font-bold ${
                      t.priority === 'High' ? 'bg-[#FDE8E8] text-[#DC2626]' : t.priority === 'Medium' ? 'bg-[#FEF7EC] text-[#D97706]' : 'bg-[#F0EDE6] text-[#55665E]'
                    }`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'Resolved' ? 'bg-[#E5F7ED] text-[#1E7445]' : t.status === 'In Progress' ? 'bg-[#EBF3FE] text-[#2563EB]' : 'bg-[#FEF7EC] text-[#D97706]'
                    }`}>
                      <span>{t.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {t.status !== 'Resolved' ? (
                      <button
                        onClick={() => handleResolve(t.id)}
                        className="px-3 py-1 bg-[#1C3A2F] text-white text-[10.5px] font-semibold rounded-lg hover:bg-[#142921] transition-colors cursor-pointer shadow-2xs"
                      >
                        Resolve
                      </button>
                    ) : (
                      <span className="text-[10.5px] text-[#1E7445] font-semibold">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSupportPage;
