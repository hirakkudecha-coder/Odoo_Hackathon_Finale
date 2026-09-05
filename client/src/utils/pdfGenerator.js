// Universal PDF Generator Utility with Direct Print & Download
export const exportTableToPDF = (title = 'REPORT', headers = [], rows = []) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to generate and print PDF reports.');
    return;
  }

  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const timeStr = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const tableHeaderHtml = headers.map(h => `<th>${h}</th>`).join('');
  const tableRowsHtml = rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title} - Urban Furniture</title>
        <style>
          @page { size: A4 landscape; margin: 12mm; }
          body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #141A17; margin: 0; padding: 20px; font-size: 11px; }
          .header-box { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #14231C; padding-bottom: 12px; margin-bottom: 16px; }
          .brand-title { font-size: 18px; font-weight: bold; color: #14231C; letter-spacing: 0.5px; }
          .brand-sub { font-size: 10px; color: #55665E; text-transform: uppercase; letter-spacing: 1px; }
          .doc-title { font-size: 14px; font-weight: bold; color: #14231C; text-align: right; }
          .doc-meta { font-size: 10px; color: #66756F; text-align: right; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { background-color: #14231C; color: #FAF8F5; text-align: left; padding: 7px 9px; font-size: 9.5px; font-weight: bold; letter-spacing: 0.5px; }
          td { border-bottom: 1px solid #E8E1D5; padding: 6.5px 9px; font-size: 10px; color: #2E3833; }
          tr:nth-child(even) td { background-color: #FAF8F5; }
          .footer { margin-top: 24px; padding-top: 10px; border-top: 1px solid #DDD4C7; display: flex; justify-content: space-between; font-size: 9px; color: #8A9892; }
        </style>
      </head>
      <body>
        <div class="header-box">
          <div>
            <div class="brand-title">URBAN FURNITURE</div>
            <div class="brand-sub">GLOBAL MULTI-TENANT ACCOUNTING SYSTEM</div>
          </div>
          <div>
            <div class="doc-title">${title}</div>
            <div class="doc-meta">Generated: ${dateStr} at ${timeStr}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>${tableHeaderHtml}</tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>

        <div class="footer">
          <span>Confidential • Urban Furniture Super Admin Management System</span>
          <span>Verified Double-Entry Ledger System</span>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
};

export const downloadDirectPdf = (docData) => {
  exportTableToPDF(docData.title, docData.headers || [], docData.rows || []);
};

export default {
  exportTableToPDF,
  downloadDirectPdf
};
