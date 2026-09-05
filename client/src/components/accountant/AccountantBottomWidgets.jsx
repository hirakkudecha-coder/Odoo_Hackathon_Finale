import React, { useState } from 'react';
import { 
  FilePlus, 
  FileText, 
  PlusCircle, 
  UserCheck, 
  Users, 
  Package, 
  FileSpreadsheet, 
  BarChart2, 
  Check,
  Plus
} from 'lucide-react';

export const AccountantBottomWidgets = ({ onNavigateTab }) => {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Record payment for INV-0011', completed: false },
    { id: 2, text: 'Verify vendor bill BILL-0021', completed: false },
    { id: 3, text: 'Reconcile bank transactions', completed: false },
  ]);
  const [showOnlyPending, setShowOnlyPending] = useState(false);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  const toggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTaskInput.trim(), completed: false }]);
    setNewTaskInput('');
    setIsAddingTask(false);
  };

  const displayedTasks = showOnlyPending ? tasks.filter((t) => !t.completed) : tasks;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full items-stretch">
      
      {/* 1. Quick Actions (4 cols) */}
      <div className="lg:col-span-4 bg-white/90 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-[#2D4A3E]/10 shadow-2xs flex flex-col justify-between overflow-hidden">
        <h3 className="text-sm font-bold text-[#141A17] font-serif tracking-tight mb-3">
          Quick Actions
        </h3>

        <div className="grid grid-cols-4 gap-1.5 sm:gap-2 my-auto">
          {/* New Invoice */}
          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('sales')}
            className="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl bg-[#EAF4EE] hover:bg-[#DCEDE2] border border-[#2D4A3E]/12 transition-all cursor-pointer group min-w-0"
            title="Navigate to Sales Orders"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white text-[#2D4A3E] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform mb-1.5 shrink-0">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="text-[10px] sm:text-[10.5px] font-semibold text-[#141A17] text-center leading-tight">
              New Invoice
            </span>
          </button>

          {/* New Bill */}
          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('purchases')}
            className="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl bg-[#FCF0E8] hover:bg-[#FAE5D8] border border-[#C86D3B]/15 transition-all cursor-pointer group min-w-0"
            title="Navigate to Purchase Bills"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white text-[#C86D3B] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform mb-1.5 shrink-0">
              <FilePlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="text-[10px] sm:text-[10.5px] font-semibold text-[#141A17] text-center leading-tight">
              New Bill
            </span>
          </button>

          {/* Register Payment */}
          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('payments')}
            className="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EDE2] border border-[#2D4A3E]/10 transition-all cursor-pointer group min-w-0"
            title="Navigate to Payments"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white text-[#C86D3B] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform mb-1.5 shrink-0">
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="text-[10px] sm:text-[10.5px] font-semibold text-[#141A17] text-center leading-tight">
              Register Payment
            </span>
          </button>

          {/* Journal Entry */}
          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('journalEntries')}
            className="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl bg-[#F4F8F5] hover:bg-[#E9F3ED] border border-[#2D4A3E]/10 transition-all cursor-pointer group min-w-0"
            title="Navigate to Journal Entries"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white text-[#2D4A3E] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform mb-1.5 shrink-0">
              <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="text-[10px] sm:text-[10.5px] font-semibold text-[#141A17] text-center leading-tight">
              Journal Entry
            </span>
          </button>
        </div>
      </div>

      {/* 2. Shortcuts (4 cols) */}
      <div className="lg:col-span-4 bg-white/90 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-[#2D4A3E]/10 shadow-2xs flex flex-col justify-between overflow-hidden">
        <h3 className="text-sm font-bold text-[#141A17] font-serif tracking-tight mb-3">
          Shortcuts
        </h3>

        <div className="grid grid-cols-4 gap-1.5 sm:gap-2 my-auto">
          {/* Contacts */}
          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('contacts')}
            className="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-white border border-[#2D4A3E]/10 hover:shadow-2xs transition-all cursor-pointer group min-w-0"
            title="Navigate to Contacts"
          >
            <Users className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#2D4A3E] mb-1.5 group-hover:scale-105 transition-transform shrink-0" />
            <span className="text-[10px] sm:text-[10.5px] font-semibold text-[#141A17] text-center leading-tight">
              Contacts
            </span>
          </button>

          {/* Products */}
          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('products')}
            className="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-white border border-[#2D4A3E]/10 hover:shadow-2xs transition-all cursor-pointer group min-w-0"
            title="Navigate to Products"
          >
            <Package className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#2D4A3E] mb-1.5 group-hover:scale-105 transition-transform shrink-0" />
            <span className="text-[10px] sm:text-[10.5px] font-semibold text-[#141A17] text-center leading-tight">
              Products
            </span>
          </button>

          {/* Chart of Accounts */}
          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('accounting')}
            className="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-white border border-[#2D4A3E]/10 hover:shadow-2xs transition-all cursor-pointer group min-w-0"
            title="Navigate to Chart of Accounts"
          >
            <FileSpreadsheet className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#2D4A3E] mb-1.5 group-hover:scale-105 transition-transform shrink-0" />
            <span className="text-[10px] sm:text-[10.5px] font-semibold text-[#141A17] text-center leading-tight">
              Chart of Accounts
            </span>
          </button>

          {/* Reports */}
          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('reports')}
            className="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-white border border-[#2D4A3E]/10 hover:shadow-2xs transition-all cursor-pointer group min-w-0"
            title="Navigate to Financial Reports"
          >
            <BarChart2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#2D4A3E] mb-1.5 group-hover:scale-105 transition-transform shrink-0" />
            <span className="text-[10px] sm:text-[10.5px] font-semibold text-[#141A17] text-center leading-tight">
              Reports
            </span>
          </button>
        </div>
      </div>

      {/* 3. Today's Tasks (4 cols) */}
      <div className="lg:col-span-4 bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-[#2D4A3E]/10 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-sm font-bold text-[#141A17] font-serif tracking-tight">
            Today's Tasks
          </h3>
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={() => setIsAddingTask(!isAddingTask)}
              className="text-xs font-semibold text-[#2D4A3E] hover:text-[#182F25] hover:underline cursor-pointer inline-flex items-center gap-0.5"
              title="Add task"
            >
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>
            <span className="text-[#8E9B95] text-xs">|</span>
            <button 
              type="button"
              onClick={() => setShowOnlyPending(!showOnlyPending)}
              className="text-xs font-semibold text-[#2D4A3E] hover:text-[#182F25] hover:underline cursor-pointer"
            >
              {showOnlyPending ? 'Show All' : 'Pending Only'}
            </button>
          </div>
        </div>

        {isAddingTask && (
          <form onSubmit={handleAddTask} className="mb-2.5 flex items-center gap-1.5">
            <input
              type="text"
              placeholder="Enter new task..."
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              className="flex-1 bg-[#FAF8F5] border border-[#E2DAD0] rounded-lg px-2.5 py-1 text-xs text-[#141A17] focus:outline-hidden focus:border-[#1C3A2F]"
              autoFocus
            />
            <button
              type="submit"
              className="px-2.5 py-1 bg-[#1C3A2F] text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Add
            </button>
          </form>
        )}

        <div className="space-y-2.5 my-auto max-h-44 overflow-y-auto">
          {displayedTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#FAF8F5] cursor-pointer transition-colors select-none"
            >
              <div 
                className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all ${
                  task.completed 
                    ? 'bg-[#2D4A3E] border-[#2D4A3E] text-white' 
                    : 'border-[#2D4A3E]/30 bg-white hover:border-[#2D4A3E]'
                }`}
              >
                {task.completed && <Check className="w-3 h-3 stroke-3" />}
              </div>
              <span className={`text-xs font-medium transition-all ${
                task.completed ? 'line-through text-[#8E9B95]' : 'text-[#141A17]'
              }`}>
                {task.text}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AccountantBottomWidgets;
