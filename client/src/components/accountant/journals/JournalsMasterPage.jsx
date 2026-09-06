import React from 'react';
import { JournalsMasterTable } from './JournalsMasterTable';

export const JournalsMasterPage = ({ onNavigateTab }) => {
  return (
    <div className="space-y-5 animate-fadeIn">
      <JournalsMasterTable />
    </div>
  );
};

export default JournalsMasterPage;
