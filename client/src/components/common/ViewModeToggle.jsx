import React from 'react';
import { List, LayoutGrid } from 'lucide-react';

export const ViewModeToggle = ({ viewMode = 'list', onViewModeChange }) => {
  return (
    <div className="flex items-center bg-[#EAE3D6] p-1 rounded-xl border border-[#DDD5C7] shadow-2xs">
      <button
        type="button"
        onClick={() => onViewModeChange('list')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
          viewMode === 'list'
            ? 'bg-[#2D4A3E] text-[#FAF8F5] shadow-xs'
            : 'text-[#61726A] hover:text-[#1E2623] hover:bg-black/5'
        }`}
        title="List View"
      >
        <List className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">List</span>
      </button>

      <button
        type="button"
        onClick={() => onViewModeChange('kanban')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
          viewMode === 'kanban'
            ? 'bg-[#2D4A3E] text-[#FAF8F5] shadow-xs'
            : 'text-[#61726A] hover:text-[#1E2623] hover:bg-black/5'
        }`}
        title="Kanban View"
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Kanban</span>
      </button>
    </div>
  );
};

export default ViewModeToggle;
