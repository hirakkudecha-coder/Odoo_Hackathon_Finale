import React from 'react';
import { AnalyticAccountsTable } from './AnalyticAccountsTable';

export const AnalyticAccountsPage = ({ onNavigateTab }) => {
  return (
    <div className="space-y-5 animate-fadeIn">
      <AnalyticAccountsTable />
    </div>
  );
};

export default AnalyticAccountsPage;
