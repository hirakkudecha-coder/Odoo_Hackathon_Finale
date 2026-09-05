/**
 * Urban Furniture - Accounting ERP PDF Generation Engine
 * Generates valid binary PDF documents (.pdf) for direct file download,
 * complete with vector typography, tables, GST compliance, and official audit styling.
 */

// Format currency in Indian format
export const formatCurrency = (amount) => {
  if (typeof amount === 'string') return amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

// Convert number to Indian currency words
export const numberToWords = (amount) => {
  const num = Math.round(parseFloat(String(amount).replace(/[^0-9.-]+/g, '')) || 0);
  if (num === 0) return 'Zero Rupees Only';

  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n) {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
    return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + inWords(n % 10000000) : '');
  }

  return 'Rupees ' + inWords(num) + ' Only';
};

// Company Master Profile
export const COMPANY_PROFILE = {
  name: 'Urban Furniture & Interiors Private Limited',
  tagline: 'Artisan Architectural Furnishing & Interior Solutions',
  address: 'Plot No. 42-45, Woodcraft Industrial Estate, S.G. Highway',
  city: 'Ahmedabad, Gujarat - 380054, India',
  gstin: '24AAACU8899F1ZV',
  pan: 'AAACU8899F',
  cin: 'U36100GJ2020PTC112450',
  email: 'accounts@urbanfurniture.in',
  phone: '+91 (79) 4002 8800',
  website: 'www.urbanfurniture.in',
  bankDetails: {
    bankName: 'HDFC Bank Ltd',
    accountName: 'Urban Furniture & Interiors Pvt Ltd',
    accountNo: '50200088991245',
    ifscCode: 'HDFC0001245',
    branch: 'S.G. Highway Corporate Branch, Ahmedabad',
    upiId: 'urbanfurniture@hdfcbank',
  },
};

/**
 * Escape text for raw PDF stream string
 */
function esc(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/₹/g, 'Rs. ');
}

/**
 * Pure JavaScript PDF 1.4 Binary Generator
 * Generates authentic, valid .pdf bytes
 */
/**
 * Pure JavaScript PDF 1.4 Binary Generator
 * Generates authentic, valid .pdf bytes with zero overlap and luxury formatting.
 */
export function buildPdfBinary(docData) {
  const {
    type = 'INVOICE',
    title = 'TAX INVOICE',
    documentNo = 'INV-2025-001',
    date = '02 Sep 2025',
    dueDate = '17 Sep 2025',
    status = 'Paid',
    partner = {
      name: 'Nimesh Pathak',
      company: 'Pathak Design Studios',
      address: '14, Palm Avenue, Bodakdev',
      city: 'Ahmedabad, Gujarat - 380054',
      gstin: '24AAPFP9821C1Z3',
      phone: '+91 98250 44210',
      email: 'nimesh@pathakstudios.com',
    },
    items = [],
    summary = {},
    tableData = null, // for registers { headers: [], rows: [] }
    terms = [
      '1. Payment is due within 15 days of invoice date.',
      '2. Goods once sold will not be returned unless manufacturing defects reported in 48 hrs.',
      '3. Interest @ 18% per annum will be charged on overdue payments.',
      '4. Subject to Ahmedabad jurisdiction only.',
    ],
  } = docData;

  const streamLines = [];
  const add = (cmd) => streamLines.push(cmd);

  // Set default stroke and fill colors
  add('0.11 0.23 0.18 RG'); // Forest Green Stroke (#1C3A2F)
  add('0.11 0.23 0.18 rg'); // Forest Green Fill

  // 1. Top Decorative Header Bar
  add('0.11 0.23 0.18 rg');
  add('36 800 523 3 re f'); // Top accent line

  // 2. Company Brand (Left Side, strictly x=36 to x=330)
  add('BT');
  add('/F3 14 Tf'); // Times-Bold
  add('0.11 0.23 0.18 rg');
  add('36 774 Td');
  add('(URBAN FURNITURE & INTERIORS) Tj');
  add('ET');

  add('BT');
  add('/F1 7.5 Tf'); // Helvetica
  add('0.35 0.42 0.38 rg');
  add('36 761 Td');
  add(`(${esc(COMPANY_PROFILE.tagline)}) Tj`);
  add('ET');

  add('BT');
  add('/F1 7 Tf');
  add('0.35 0.42 0.38 rg');
  add('36 749 Td');
  add(`(Plot No. 42-45, Woodcraft Industrial Estate, S.G. Highway, Ahmedabad - 380054) Tj`);
  add('ET');

  add('BT');
  add('/F2 7 Tf');
  add('0.2 0.25 0.22 rg');
  add('36 738 Td');
  add(`(GSTIN: ${esc(COMPANY_PROFILE.gstin)}  |  PAN: ${esc(COMPANY_PROFILE.pan)}  |  CIN: ${esc(COMPANY_PROFILE.cin)}) Tj`);
  add('ET');

  // Right Side: Document Title & Reference (strictly x=350 to x=559)
  // Determine appropriate font size based on title length
  const titleText = esc(title.toUpperCase());
  const titleFontSize = titleText.length > 32 ? 9 : titleText.length > 22 ? 10.5 : 12;

  add('BT');
  add(`/F2 ${titleFontSize} Tf`);
  add('0.11 0.23 0.18 rg');
  add('350 774 Td');
  add(`(${titleText}) Tj`);
  add('ET');

  add('BT');
  add('/F4 9.5 Tf'); // Courier-Bold
  add('0.25 0.35 0.3 rg');
  add('350 758 Td');
  add(`(REF: ${esc(documentNo)}) Tj`);
  add('ET');

  // Status Badge Box (Right Side)
  const isPaid = status.toLowerCase() === 'paid' || status.toLowerCase() === 'reconciled' || status.toLowerCase() === 'received' || status.toLowerCase() === 'posted' || status.toLowerCase() === 'generated' || status.toLowerCase() === 'invoiced' || status.toLowerCase() === 'confirmed' || status.toLowerCase() === 'active';
  if (isPaid) {
    add('0.9 0.97 0.93 rg'); // light green bg
    add('350 735 90 16 re f');
    add('0.12 0.45 0.27 RG');
    add('350 735 90 16 re s');
    add('BT');
    add('/F2 8 Tf');
    add('0.12 0.45 0.27 rg');
    add('358 740 Td');
    add(`(${esc(status.toUpperCase())}) Tj`);
    add('ET');
  } else {
    add('0.99 0.96 0.92 rg'); // light amber bg
    add('350 735 90 16 re f');
    add('0.85 0.47 0.02 RG');
    add('350 735 90 16 re s');
    add('BT');
    add('/F2 8 Tf');
    add('0.85 0.47 0.02 rg');
    add('358 740 Td');
    add(`(${esc(status.toUpperCase())}) Tj`);
    add('ET');
  }

  // Horizontal separator below header
  add('0.88 0.85 0.8 RG');
  add('36 726 523 0.5 re s');

  // 3. Metadata Boxes (Customer Details vs Schedule)
  add('0.98 0.97 0.96 rg'); // light warm bg
  add('36 646 252 70 re f');
  add('0.9 0.87 0.83 RG');
  add('36 646 252 70 re s');

  add('BT');
  add('/F2 8 Tf');
  add('0.11 0.23 0.18 rg');
  add('44 703 Td');
  add(`(${type === 'BILL' || type === 'PURCHASE' ? 'VENDOR / SUPPLIER DETAILS:' : 'BILLED TO (CUSTOMER DETAILS):'}) Tj`);
  add('ET');

  add('BT');
  add('/F2 8.5 Tf');
  add('0.08 0.1 0.09 rg');
  add('44 690 Td');
  add(`(${esc(partner.name || 'Client')}) Tj`);
  add('ET');

  add('BT');
  add('/F1 7.5 Tf');
  add('0.25 0.3 0.28 rg');
  add('44 678 Td');
  add(`(${esc(partner.company || '')}) Tj`);
  add('ET');

  add('BT');
  add('/F1 7.5 Tf');
  add('0.25 0.3 0.28 rg');
  add('44 666 Td');
  add(`(${esc(partner.address || partner.city || 'Ahmedabad, Gujarat')}) Tj`);
  add('ET');

  add('BT');
  add('/F1 7.5 Tf');
  add('0.25 0.3 0.28 rg');
  add('44 654 Td');
  add(`(GSTIN: ${esc(partner.gstin || '24AAPFP9821C1Z3')} | Ph: ${esc(partner.phone || '+91 98250 44210')}) Tj`);
  add('ET');

  // Schedule Box (Right)
  add('0.98 0.97 0.96 rg');
  add('300 646 259 70 re f');
  add('0.9 0.87 0.83 RG');
  add('300 646 259 70 re s');

  add('BT');
  add('/F2 8 Tf');
  add('0.11 0.23 0.18 rg');
  add('308 703 Td');
  add('(DOCUMENT & ORDER SCHEDULE:) Tj');
  add('ET');

  add('BT');
  add('/F1 8 Tf');
  add('0.2 0.25 0.22 rg');
  add('308 690 Td');
  add(`(Issue / Reference Date: ${esc(date)}) Tj`);
  add('ET');

  add('BT');
  add('/F1 8 Tf');
  add('0.2 0.25 0.22 rg');
  add('308 678 Td');
  add(`(Due / Period Schedule: ${esc(dueDate)}) Tj`);
  add('ET');

  add('BT');
  add('/F1 8 Tf');
  add('0.2 0.25 0.22 rg');
  add('308 666 Td');
  add('(Place of Supply: Gujarat - Code 24) Tj');
  add('ET');

  add('BT');
  add('/F1 8 Tf');
  add('0.2 0.25 0.22 rg');
  add('308 654 Td');
  add('(Payment Terms: Net 15 Days | Mode: Air-Cushioned Logistics) Tj');
  add('ET');

  let curY = 632;

  // 4. Render Table (Items Table OR Master Register Table)
  if (tableData && tableData.headers && tableData.rows) {
    // Intelligent Column Width Distribution for Master Registers
    const getColumnWidths = (headers) => {
      const totalWidth = 523;
      const count = headers.length;
      const hStr = headers.join(',').toLowerCase();

      if (hStr.includes('method') && hStr.includes('amount')) {
        // Payments table: ['Payment #', 'Partner', 'Type', 'Date', 'Method', 'Amount', 'Status']
        return [65, 80, 80, 55, 95, 80, 68];
      }
      if (hStr.includes('debit') && hStr.includes('credit')) {
        // Journal table: ['Entry #', 'Date', 'Reference', 'Account', 'Partner', 'Debit', 'Credit', 'Status']
        return [55, 55, 60, 85, 75, 65, 65, 63];
      }
      if (hStr.includes('sku') && hStr.includes('cost price')) {
        // Products table: ['SKU', 'Product Name', 'Category', 'Cost Price', 'Sales Price', 'Stock', 'Status']
        return [65, 110, 85, 65, 68, 60, 70];
      }
      if (hStr.includes('report id')) {
        // Reports: ['Report ID', 'Report Name', 'Type', 'Period', 'Generated By', 'Format', 'Status']
        return [60, 110, 75, 75, 75, 55, 73];
      }
      if (hStr.includes('order #') || hStr.includes('po #')) {
        // Sales / Purchase Orders: ['Order #', 'Customer/Supplier', 'Date', 'Items', 'Total Amount', 'Status']
        return [75, 125, 65, 60, 110, 88];
      }
      if (hStr.includes('code') && hStr.includes('account name')) {
        // COA: ['Code', 'Account Name', 'Type', 'Currency', 'Balance', 'Status']
        return [60, 140, 95, 55, 100, 73];
      }
      if (hStr.includes('company') && hStr.includes('balance')) {
        // Contacts: ['Name', 'Type', 'Company', 'Phone', 'City', 'Balance', 'Status']
        return [75, 60, 95, 75, 65, 85, 68];
      }

      // Default fallback distribution
      const w = Math.floor(totalWidth / count);
      const arr = new Array(count).fill(w);
      arr[count - 1] += totalWidth - (w * count);
      return arr;
    };

    const colWidths = getColumnWidths(tableData.headers);
    const colOffsets = [];
    let runningX = 36;
    for (let w of colWidths) {
      colOffsets.push(runningX);
      runningX += w;
    }

    // Table Header Row
    add('0.11 0.23 0.18 rg');
    add(`36 ${curY - 18} 523 20 re f`);

    add('BT');
    add('/F2 8 Tf');
    add('0.98 0.98 0.96 rg');
    tableData.headers.forEach((h, idx) => {
      add(`${colOffsets[idx] + 5} ${curY - 14} Td`);
      add(`(${esc(h)}) Tj`);
      add(`${-(colOffsets[idx] + 5)} ${-(curY - 14)} Td`);
    });
    add('ET');

    curY -= 20;

    // Table Data Rows
    tableData.rows.slice(0, 18).forEach((row, rIdx) => {
      const rowBg = rIdx % 2 === 0 ? '1 1 1' : '0.98 0.97 0.95';
      add(`${rowBg} rg`);
      add(`36 ${curY - 18} 523 18 re f`);
      add('0.92 0.89 0.85 RG');
      add(`36 ${curY - 18} 523 18 re s`);

      add('BT');
      add('/F1 7.5 Tf');
      add('0.15 0.18 0.16 rg');
      row.forEach((cell, cIdx) => {
        const colW = colWidths[cIdx] || 70;
        const maxChars = Math.max(8, Math.floor(colW / 5.2));
        const cellText = String(cell || '');
        const truncated = cellText.length > maxChars ? cellText.slice(0, maxChars - 2) + '..' : cellText;

        add(`${colOffsets[cIdx] + 5} ${curY - 13} Td`);
        add(`(${esc(truncated)}) Tj`);
        add(`${-(colOffsets[cIdx] + 5)} ${-(curY - 13)} Td`);
      });
      add('ET');

      curY -= 18;
    });
  } else {
    // Itemized Invoice / Order Table
    add('0.11 0.23 0.18 rg');
    add(`36 ${curY - 18} 523 20 re f`);

    add('BT');
    add('/F2 8 Tf');
    add('0.98 0.98 0.96 rg');
    add(`42 ${curY - 14} Td (Item Description & Specification) Tj`);
    add('220 0 Td (HSN) Tj');
    add('50 0 Td (Qty) Tj');
    add('40 0 Td (Rate Rs.) Tj');
    add('100 0 Td (Amount Rs.) Tj');
    add('ET');

    curY -= 20;

    const renderItems = items.length > 0 ? items : [
      {
        name: 'Monolith Architectural Dining Table (10-Seater)',
        hsn: '940360',
        qty: 1,
        rate: summary.subtotal ? summary.subtotal * 0.7 : 80000,
        amount: summary.subtotal ? summary.subtotal * 0.7 : 80000,
      },
      {
        name: 'Curved Ergonomic Velvet Dining Chairs (Set of 4)',
        hsn: '940130',
        qty: 4,
        rate: summary.subtotal ? (summary.subtotal * 0.3) / 4 : 8000,
        amount: summary.subtotal ? summary.subtotal * 0.3 : 32000,
      },
    ];

    renderItems.forEach((it, rIdx) => {
      const rowBg = rIdx % 2 === 0 ? '1 1 1' : '0.98 0.97 0.95';
      add(`${rowBg} rg`);
      add(`36 ${curY - 22} 523 22 re f`);
      add('0.92 0.89 0.85 RG');
      add(`36 ${curY - 22} 523 22 re s`);

      add('BT');
      add('/F2 8 Tf');
      add('0.1 0.12 0.1 rg');
      add(`42 ${curY - 15} Td`);
      add(`(${esc(it.name || it.title || 'Luxury Furniture Item')}) Tj`);
      add('ET');

      add('BT');
      add('/F4 7.5 Tf');
      add('0.3 0.35 0.32 rg');
      add(`262 ${curY - 15} Td`);
      add(`(${esc(it.hsn || '9403')}) Tj`);
      add('ET');

      add('BT');
      add('/F2 8 Tf');
      add('0.1 0.12 0.1 rg');
      add(`312 ${curY - 15} Td`);
      add(`(${esc(it.qty || it.quantity || 1)}) Tj`);
      add('ET');

      add('BT');
      add('/F1 8 Tf');
      add('0.1 0.12 0.1 rg');
      add(`352 ${curY - 15} Td`);
      add(`(${esc(formatCurrency(it.rate || it.price || 0))}) Tj`);
      add('ET');

      add('BT');
      add('/F2 8 Tf');
      add('0.11 0.23 0.18 rg');
      add(`452 ${curY - 15} Td`);
      add(`(${esc(formatCurrency(it.amount || 0))}) Tj`);
      add('ET');

      curY -= 22;
    });

    // 5. Amount in words box
    curY -= 10;
    add('0.96 0.94 0.91 rg');
    add(`36 ${curY - 18} 523 18 re f`);
    add('0.11 0.23 0.18 RG');
    add(`36 ${curY - 18} 4 18 re f`); // Forest Green Left Accent Bar

    add('BT');
    add('/F2 8 Tf');
    add('0.11 0.23 0.18 rg');
    add(`46 ${curY - 13} Td`);
    add(`(Amount in words: ${esc(numberToWords(summary.grandTotal || summary.total || 124000))}) Tj`);
    add('ET');

    // 6. Bank Details Box & Totals Box
    curY -= 24;

    // Bank Box (Left)
    add('0.97 0.96 0.94 rg');
    add(`36 ${curY - 86} 270 86 re f`);
    add('0.88 0.85 0.8 RG');
    add(`36 ${curY - 86} 270 86 re s`);

    add('BT');
    add('/F2 8.5 Tf');
    add('0.11 0.23 0.18 rg');
    add(`44 ${curY - 16} Td`);
    add('(BANK REMITTANCE & SETTLEMENT DETAILS:) Tj');
    add('ET');

    add('BT');
    add('/F1 8 Tf');
    add('0.2 0.25 0.22 rg');
    add(`44 ${curY - 30} Td`);
    add(`(Bank: ${esc(COMPANY_PROFILE.bankDetails.bankName)}) Tj`);
    add('ET');

    add('BT');
    add('/F1 8 Tf');
    add('0.2 0.25 0.22 rg');
    add(`44 ${curY - 42} Td`);
    add(`(A/C Name: ${esc(COMPANY_PROFILE.bankDetails.accountName)}) Tj`);
    add('ET');

    add('BT');
    add('/F2 8 Tf');
    add('0.1 0.12 0.1 rg');
    add(`44 ${curY - 54} Td`);
    add(`(A/C No: ${esc(COMPANY_PROFILE.bankDetails.accountNo)} | IFSC: ${esc(COMPANY_PROFILE.bankDetails.ifscCode)}) Tj`);
    add('ET');

    add('BT');
    add('/F1 8 Tf');
    add('0.2 0.25 0.22 rg');
    add(`44 ${curY - 66} Td`);
    add(`(Branch: ${esc(COMPANY_PROFILE.bankDetails.branch)}) Tj`);
    add('ET');

    add('BT');
    add('/F2 8 Tf');
    add('0.11 0.23 0.18 rg');
    add(`44 ${curY - 78} Td`);
    add(`(UPI Handle: ${esc(COMPANY_PROFILE.bankDetails.upiId)}) Tj`);
    add('ET');

    // Totals Box (Right)
    add('0.98 0.98 0.98 rg');
    add(`320 ${curY - 86} 239 86 re f`);
    add('0.88 0.85 0.8 RG');
    add(`320 ${curY - 86} 239 86 re s`);

    const rawSubtotal = summary.subtotal || 105084.75;
    const rawCgst = summary.cgst || 9457.62;
    const rawSgst = summary.sgst || 9457.62;
    const rawGrandTotal = summary.grandTotal || summary.total || 124000;

    add('BT');
    add('/F1 8.5 Tf');
    add('0.3 0.35 0.32 rg');
    add(`330 ${curY - 20} Td (Taxable Value:) Tj`);
    add(`110 0 Td (${esc(formatCurrency(rawSubtotal))}) Tj`);
    add('ET');

    add('BT');
    add('/F1 8.5 Tf');
    add('0.3 0.35 0.32 rg');
    add(`330 ${curY - 36} Td (CGST (9.0%):) Tj`);
    add(`110 0 Td (${esc(formatCurrency(rawCgst))}) Tj`);
    add('ET');

    add('BT');
    add('/F1 8.5 Tf');
    add('0.3 0.35 0.32 rg');
    add(`330 ${curY - 52} Td (SGST (9.0%):) Tj`);
    add(`110 0 Td (${esc(formatCurrency(rawSgst))}) Tj`);
    add('ET');

    // Total Highlight line
    add('0.11 0.23 0.18 rg');
    add(`320 ${curY - 86} 239 22 re f`);

    add('BT');
    add('/F2 10.5 Tf');
    add('1 1 1 rg');
    add(`330 ${curY - 76} Td (GRAND TOTAL:) Tj`);
    add(`100 0 Td (${esc(formatCurrency(rawGrandTotal))}) Tj`);
    add('ET');

    curY -= 96;
  }

  // 7. Terms & Signature Footer
  curY = Math.min(curY, 130);

  add('0.88 0.85 0.8 RG');
  add(`36 ${curY} 523 0.5 re s`);

  add('BT');
  add('/F2 7.5 Tf');
  add('0.2 0.25 0.22 rg');
  add(`36 ${curY - 14} Td (TERMS & CONDITIONS:) Tj`);
  add('ET');

  terms.slice(0, 3).forEach((term, tIdx) => {
    add('BT');
    add('/F1 7 Tf');
    add('0.4 0.45 0.42 rg');
    add(`36 ${curY - 26 - tIdx * 10} Td`);
    add(`(${esc(term)}) Tj`);
    add('ET');
  });

  // Signatory Stamp (Right)
  add('0.11 0.23 0.18 RG');
  add(`390 ${curY - 14} 160 14 re s`);
  add('BT');
  add('/F2 7 Tf');
  add('0.11 0.23 0.18 rg');
  add(`408 ${curY - 10} Td (OFFICIAL DIGITAL RECORD) Tj`);
  add('ET');

  add('BT');
  add('/F1 7.5 Tf');
  add('0.3 0.35 0.32 rg');
  add(`390 ${curY - 34} Td (For Urban Furniture & Interiors Pvt Ltd) Tj`);
  add('ET');

  add('0.11 0.23 0.18 RG');
  add(`390 ${curY - 56} 160 0.5 re s`);

  add('BT');
  add('/F2 8 Tf');
  add('0.11 0.23 0.18 rg');
  add(`435 ${curY - 68} Td (Authorized Signatory) Tj`);
  add('ET');

  const streamContent = streamLines.join('\n');
  const streamLength = streamContent.length;

  // Build standard PDF structure
  const pdfObjects = [
    `%PDF-1.4\n%\xE2\xE3\xCF\xD3\n`,
    // Obj 1: Catalog
    `1 0 obj\n<<\n  /Type /Catalog\n  /Pages 2 0 R\n>>\nendobj\n`,
    // Obj 2: Pages
    `2 0 obj\n<<\n  /Type /Pages\n  /Kids [3 0 R]\n  /Count 1\n>>\nendobj\n`,
    // Obj 3: Page
    `3 0 obj\n<<\n  /Type /Page\n  /Parent 2 0 R\n  /MediaBox [0 0 595.28 841.89]\n  /Resources <<\n    /Font <<\n      /F1 4 0 R\n      /F2 5 0 R\n      /F3 6 0 R\n      /F4 7 0 R\n    >>\n  >>\n  /Contents 8 0 R\n>>\nendobj\n`,
    // Obj 4: Helvetica
    `4 0 obj\n<<\n  /Type /Font\n  /Subtype /Type1\n  /BaseFont /Helvetica\n  /Encoding /WinAnsiEncoding\n>>\nendobj\n`,
    // Obj 5: Helvetica-Bold
    `5 0 obj\n<<\n  /Type /Font\n  /Subtype /Type1\n  /BaseFont /Helvetica-Bold\n  /Encoding /WinAnsiEncoding\n>>\nendobj\n`,
    // Obj 6: Times-Bold
    `6 0 obj\n<<\n  /Type /Font\n  /Subtype /Type1\n  /BaseFont /Times-Bold\n  /Encoding /WinAnsiEncoding\n>>\nendobj\n`,
    // Obj 7: Courier-Bold
    `7 0 obj\n<<\n  /Type /Font\n  /Subtype /Type1\n  /BaseFont /Courier-Bold\n  /Encoding /WinAnsiEncoding\n>>\nendobj\n`,
    // Obj 8: Contents Stream
    `8 0 obj\n<<\n  /Length ${streamLength}\n>>\nstream\n${streamContent}\nendstream\nendobj\n`,
    // Obj 9: Info
    `9 0 obj\n<<\n  /Title (${esc(title)} - ${esc(documentNo)})\n  /Author (Urban Furniture ERP)\n  /Creator (Urban Furniture Luxury Accounting System)\n  /CreationDate (D:${new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)}Z)\n>>\nendobj\n`,
  ];

  let output = pdfObjects[0];
  const offsets = [];

  for (let i = 1; i < pdfObjects.length; i++) {
    offsets.push(output.length);
    output += pdfObjects[i];
  }

  const xrefOffset = output.length;
  let xref = `xref\n0 10\n0000000000 65535 f \n`;

  for (let i = 0; i < offsets.length; i++) {
    const offStr = String(offsets[i]).padStart(10, '0');
    xref += `${offStr} 00000 n \n`;
  }

  const trailer = `trailer\n<<\n  /Size 10\n  /Root 1 0 R\n  /Info 9 0 R\n>>\nstartxref\n${xrefOffset}\n%%EOF`;

  return output + xref + trailer;
}

/**
 * DIRECT AUTOMATIC PDF FILE DOWNLOAD
 * Generates valid .pdf binary and triggers instant browser download
 */
export function downloadDirectPdf(docData) {
  const pdfString = buildPdfBinary(docData);
  const bytes = new Uint8Array(pdfString.length);
  for (let i = 0; i < pdfString.length; i++) {
    bytes[i] = pdfString.charCodeAt(i) & 0xff;
  }
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  const sanitizedNo = (docData.documentNo || 'DOCUMENT').replace(/[^a-zA-Z0-9_-]/g, '_');
  const sanitizedTitle = (docData.title || 'DOCUMENT').replace(/[^a-zA-Z0-9_-]/g, '_');
  link.download = `${sanitizedTitle}_${sanitizedNo}.pdf`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 10000);
}

/**
 * Generate Complete HTML for In-App Live Preview Canvas
 */
export const generatePdfHtml = (docData) => {
  const {
    type = 'INVOICE',
    title = 'TAX INVOICE',
    documentNo = 'INV-2025-001',
    date = '02 Sep 2025',
    dueDate = '17 Sep 2025',
    status = 'Paid',
    partner = {
      name: 'Nimesh Pathak',
      company: 'Pathak Design Studios',
      address: '14, Palm Avenue, Bodakdev',
      city: 'Ahmedabad, Gujarat - 380054',
      gstin: '24AAPFP9821C1Z3',
      phone: '+91 98250 44210',
      email: 'nimesh@pathakstudios.com',
    },
    items = [],
    summary = {},
    customSections = null,
    tableData = null,
    notes = 'Thank you for choosing Urban Furniture. All items carry certified warranty.',
    terms = [
      'Payment is due within 15 days of invoice date.',
      'Goods once sold will not be returned unless manufacturing defects reported within 48 hours.',
      'Interest @ 18% per annum will be charged on overdue payments.',
      'Subject to Ahmedabad jurisdiction only.',
    ],
  } = docData;

  const isPaid = status.toLowerCase() === 'paid' || status.toLowerCase() === 'reconciled' || status.toLowerCase() === 'received' || status.toLowerCase() === 'posted' || status.toLowerCase() === 'generated';
  const isPending = status.toLowerCase() === 'pending' || status.toLowerCase() === 'draft' || status.toLowerCase() === 'ordered' || status.toLowerCase() === 'quotation';

  const stampColor = isPaid ? '#1E7445' : isPending ? '#D97706' : '#DC2626';
  const stampBg = isPaid ? '#E5F7ED' : isPending ? '#FEF7EC' : '#FDE8E8';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title} - ${documentNo} | Urban Furniture</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      color: #141A17;
      background: #FFFFFF;
      font-size: 11px;
      line-height: 1.5;
      padding: 24px;
    }
    .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; border-bottom: 2px solid #1C3A2F; padding-bottom: 14px; }
    .brand-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #1C3A2F; }
    .brand-sub { font-size: 9.5px; color: #55665E; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; }
    .doc-badge { text-align: right; }
    .doc-type-title { font-family: 'Cinzel', serif; font-size: 17px; font-weight: 700; color: #1C3A2F; }
    .doc-ref-no { font-size: 12px; font-weight: 700; color: #384D44; font-family: 'Courier New', monospace; margin-top: 3px; }
    .status-stamp { display: inline-block; padding: 3px 10px; border-radius: 4px; font-weight: 700; font-size: 10px; text-transform: uppercase; border: 1px solid ${stampColor}; color: ${stampColor}; background: ${stampBg}; margin-top: 4px; }
    .meta-grid { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .meta-box { width: 48%; vertical-align: top; background: #FAF8F5; border: 1px solid #EAE3D7; border-radius: 6px; padding: 12px 14px; }
    .meta-box-title { font-size: 9.5px; font-weight: 700; color: #738C80; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; border-bottom: 1px solid #E5DDD0; padding-bottom: 4px; }
    .meta-line { font-size: 10.5px; margin-bottom: 3px; color: #2D3A34; }
    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
    .items-table th { background: #1C3A2F; color: #FAF8F5; font-size: 9.5px; font-weight: 600; text-transform: uppercase; padding: 8px 10px; text-align: left; }
    .items-table td { padding: 8px 10px; border-bottom: 1px solid #ECE6DC; color: #2D3A34; font-size: 10.5px; }
    .items-table tbody tr:nth-child(even) { background: #FAF9F6; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .amount-words-box { background: #F5EFE6; border-left: 3px solid #1C3A2F; padding: 7px 12px; font-size: 10px; font-weight: 600; color: #1C3A2F; margin-bottom: 18px; }
    .bottom-grid { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
    .bank-box { width: 52%; vertical-align: top; background: #F7F4EE; border: 1px solid #E2D9CC; border-radius: 6px; padding: 10px 14px; }
    .totals-box { width: 44%; vertical-align: top; padding-left: 16px; }
    .totals-table { width: 100%; border-collapse: collapse; }
    .totals-table td { padding: 4px 6px; font-size: 10.5px; color: #4A5952; }
    .totals-table tr.total-row td { border-top: 2px solid #1C3A2F; border-bottom: 2px solid #1C3A2F; font-weight: 700; font-size: 13px; color: #1C3A2F; padding: 8px 6px; font-family: 'Playfair Display', serif; }
    .footer-grid { width: 100%; border-collapse: collapse; margin-top: 14px; padding-top: 14px; border-top: 1px solid #E5DDD0; }
    .terms-box { width: 58%; vertical-align: top; font-size: 9px; color: #687A72; line-height: 1.4; }
    .signature-box { width: 42%; text-align: right; vertical-align: bottom; }
    .official-seal { display: inline-block; border: 1.5px dashed #1C3A2F; color: #1C3A2F; padding: 4px 8px; border-radius: 4px; font-size: 8.5px; font-weight: 700; margin-bottom: 6px; text-transform: uppercase; }
  </style>
</head>
<body>
  <table class="header-table">
    <tr>
      <td style="width: 58%; vertical-align: top;">
        <div class="brand-title">URBAN FURNITURE</div>
        <div class="brand-sub">${COMPANY_PROFILE.tagline}</div>
        <div style="font-size: 9px; color: #6B7A74; margin-top: 4px; line-height: 1.4;">
          ${COMPANY_PROFILE.address}, ${COMPANY_PROFILE.city}<br>
          <strong>GSTIN:</strong> ${COMPANY_PROFILE.gstin} | <strong>PAN:</strong> ${COMPANY_PROFILE.pan}
        </div>
      </td>
      <td class="doc-badge" style="width: 42%; vertical-align: top; text-align: right;">
        <div class="doc-type-title">${title}</div>
        <div class="doc-ref-no">${documentNo}</div>
        <div><span class="status-stamp">${status}</span></div>
      </td>
    </tr>
  </table>

  <table class="meta-grid">
    <tr>
      <td class="meta-box">
        <div class="meta-box-title">${type === 'BILL' || type === 'PURCHASE' ? 'Vendor Details' : 'Billed To (Customer Details)'}</div>
        <div class="meta-line"><strong>${partner.name || 'Client'}</strong></div>
        ${partner.company ? `<div class="meta-line">${partner.company}</div>` : ''}
        ${partner.address ? `<div class="meta-line">${partner.address}</div>` : ''}
        ${partner.city ? `<div class="meta-line">${partner.city}</div>` : ''}
        ${partner.gstin ? `<div class="meta-line"><strong>GSTIN:</strong> ${partner.gstin}</div>` : ''}
      </td>
      <td style="width: 4%;"></td>
      <td class="meta-box">
        <div class="meta-box-title">Document & Order Schedule</div>
        <div class="meta-line"><strong>Issue Date:</strong> ${date}</div>
        <div class="meta-line"><strong>Due Date:</strong> ${dueDate}</div>
        <div class="meta-line"><strong>Place of Supply:</strong> Gujarat (State Code: 24)</div>
        <div class="meta-line"><strong>Payment Terms:</strong> Net 15 Days</div>
      </td>
    </tr>
  </table>

  ${tableData ? `
  <table class="items-table">
    <thead>
      <tr>
        <th class="text-center" style="width: 5%;">#</th>
        ${tableData.headers.map((h) => `<th>${h}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${tableData.rows.map((r, i) => `
        <tr>
          <td class="text-center font-mono">${i + 1}</td>
          ${r.map((c) => `<td>${c}</td>`).join('')}
        </tr>
      `).join('')}
    </tbody>
  </table>
  ` : `
  <table class="items-table">
    <thead>
      <tr>
        <th class="text-center" style="width: 5%;">#</th>
        <th style="width: 50%;">Item Description</th>
        <th class="text-center" style="width: 12%;">HSN</th>
        <th class="text-center" style="width: 8%;">Qty</th>
        <th class="text-right" style="width: 12%;">Rate (Rs.)</th>
        <th class="text-right" style="width: 13%;">Amount (Rs.)</th>
      </tr>
    </thead>
    <tbody>
      ${(items.length > 0 ? items : [
        { name: 'Monolith Architectural Dining Table (10-Seater)', hsn: '940360', qty: 1, rate: 80000, amount: 80000 },
        { name: 'Curved Ergonomic Velvet Dining Chairs (Set of 4)', hsn: '940130', qty: 4, rate: 8000, amount: 32000 }
      ]).map((it, idx) => `
        <tr>
          <td class="text-center">${idx + 1}</td>
          <td><strong>${it.name || it.title}</strong></td>
          <td class="text-center font-mono">${it.hsn || '9403'}</td>
          <td class="text-center">${it.qty || it.quantity || 1}</td>
          <td class="text-right font-mono">${formatCurrency(it.rate || it.price || 0)}</td>
          <td class="text-right font-mono font-bold">${formatCurrency(it.amount || 0)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="amount-words-box">
    <strong>Amount Chargeable:</strong> ${numberToWords(summary.grandTotal || summary.total || 124000)}
  </div>

  <table class="bottom-grid">
    <tr>
      <td class="bank-box">
        <div class="meta-box-title">Bank Settlement Details</div>
        <div class="meta-line"><strong>Bank:</strong> ${COMPANY_PROFILE.bankDetails.bankName}</div>
        <div class="meta-line"><strong>A/C No:</strong> ${COMPANY_PROFILE.bankDetails.accountNo}</div>
        <div class="meta-line"><strong>IFSC:</strong> ${COMPANY_PROFILE.bankDetails.ifscCode}</div>
        <div class="meta-line"><strong>UPI:</strong> ${COMPANY_PROFILE.bankDetails.upiId}</div>
      </td>
      <td class="totals-box">
        <table class="totals-table">
          <tr><td>Taxable Value:</td><td class="text-right font-mono">${formatCurrency(summary.subtotal || 105084.75)}</td></tr>
          <tr><td>CGST (9.0%):</td><td class="text-right font-mono">${formatCurrency(summary.cgst || 9457.62)}</td></tr>
          <tr><td>SGST (9.0%):</td><td class="text-right font-mono">${formatCurrency(summary.sgst || 9457.62)}</td></tr>
          <tr class="total-row"><td>Grand Total:</td><td class="text-right font-mono">${formatCurrency(summary.grandTotal || summary.total || 124000)}</td></tr>
        </table>
      </td>
    </tr>
  </table>
  `}

  <table class="footer-grid">
    <tr>
      <td class="terms-box">
        <strong>Terms & Conditions:</strong>
        <ol style="padding-left: 14px; margin-top: 4px;">
          ${terms.map((t) => `<li>${t}</li>`).join('')}
        </ol>
      </td>
      <td class="signature-box">
        <div class="official-seal">Official Digital Record</div>
        <div style="font-size: 8.5px; color: #738C80;">For Urban Furniture & Interiors Pvt Ltd</div>
        <div style="margin-top: 30px; font-weight: 700; color: #1C3A2F;">Authorized Signatory</div>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

// 1. Sales Order / Customer Invoice PDF
export const createSalesOrderPdfData = (order) => {
  const rawNum = parseFloat(String(order.totalAmount || order.amount || '124000').replace(/[^0-9.-]+/g, '')) || 124000;
  const taxable = Math.round((rawNum / 1.18) * 100) / 100;
  const tax = Math.round((rawNum - taxable) * 100) / 100;

  return {
    type: 'INVOICE',
    title: 'TAX INVOICE & SALES ORDER',
    documentNo: order.soNo || order.id || 'SO-2025-001',
    date: order.date || '02 Sep 2025',
    dueDate: '17 Sep 2025',
    status: order.status || 'Paid',
    partner: {
      name: order.customer || 'Nimesh Pathak',
      company: `${order.customer || 'Client'} Interiors & Architecture`,
      address: 'Suite 401, Sapphire Corporate Tower',
      city: 'Ahmedabad, Gujarat - 380015',
      gstin: '24AAECP9921B1Z8',
      phone: '+91 98251 90812',
      email: 'client@urbanfurniture.in',
    },
    items: [
      {
        name: 'Monolith Architectural Dining Table (10-Seater)',
        hsn: '940360',
        qty: 1,
        rate: taxable * 0.65,
        amount: taxable * 0.65,
      },
      {
        name: 'Curved Ergonomic Velvet Dining Chairs (Set of 4)',
        hsn: '940130',
        qty: 4,
        rate: (taxable * 0.35) / 4,
        amount: taxable * 0.35,
      },
    ],
    summary: {
      subtotal: taxable,
      tax: tax,
      cgst: tax / 2,
      sgst: tax / 2,
      grandTotal: rawNum,
    },
  };
};

// 2. Purchase Order PDF
export const createPurchaseOrderPdfData = (po) => {
  const rawNum = parseFloat(String(po.totalAmount || po.amount || '48750').replace(/[^0-9.-]+/g, '')) || 48750;
  const taxable = Math.round((rawNum / 1.18) * 100) / 100;
  const tax = Math.round((rawNum - taxable) * 100) / 100;

  return {
    type: 'BILL',
    title: 'PURCHASE ORDER & VENDOR RECEIPT',
    documentNo: po.poNo || po.id || 'PO-2025-001',
    date: po.date || '02 Sep 2025',
    dueDate: '16 Sep 2025',
    status: po.status || 'Received',
    partner: {
      name: po.supplier || po.vendor || 'Azure Furniture Supplies',
      company: `${po.supplier || po.vendor || 'Supplier'} Raw Materials Ltd`,
      address: 'GIDC Industrial Zone, Phase II',
      city: 'Vadodara, Gujarat - 390010',
      gstin: '24AAACB4411C1ZX',
      phone: '+91 94280 11920',
      email: 'sales@azuresupplies.com',
    },
    items: [
      {
        name: 'Kiln-Dried Burma Teakwood Lumbers (Grade A)',
        hsn: '4407',
        qty: 50,
        rate: (taxable * 0.7) / 50,
        amount: taxable * 0.7,
      },
      {
        name: 'PVD Coated Champagne Gold Brass Profiles',
        hsn: '7419',
        qty: 20,
        rate: (taxable * 0.3) / 20,
        amount: taxable * 0.3,
      },
    ],
    summary: {
      subtotal: taxable,
      tax: tax,
      cgst: tax / 2,
      sgst: tax / 2,
      grandTotal: rawNum,
    },
  };
};

// 3. Payment Receipt PDF
export const createPaymentReceiptPdfData = (pay) => {
  const rawNum = parseFloat(String(pay.amount || '24500').replace(/[^0-9.-]+/g, '')) || 24500;

  return {
    type: 'PAYMENT',
    title: 'OFFICIAL PAYMENT RECEIPT VOUCHER',
    documentNo: pay.payNo || pay.id || 'PAY-2025-001',
    date: pay.date || '02 Sep 2025',
    dueDate: 'Settled',
    status: pay.status || 'Reconciled',
    partner: {
      name: pay.partner || 'Nimesh Pathak',
      company: 'Corporate Settlement',
      city: 'Ahmedabad, Gujarat',
      gstin: '24AAPFP9821C1Z3',
      phone: '+91 98765 44210',
    },
    items: [
      {
        name: `Settlement for ${pay.type || 'Customer Receipt'} via ${pay.method || 'Bank Transfer (NEFT)'}`,
        hsn: '9971',
        qty: 1,
        rate: rawNum,
        amount: rawNum,
      },
    ],
    summary: {
      subtotal: rawNum,
      tax: 0,
      cgst: 0,
      sgst: 0,
      grandTotal: rawNum,
    },
  };
};

// 4. Financial Report Statement PDF
export const createFinancialReportPdfData = (reportName, period = 'August & Q3 2025') => {
  let headers = ['Account Schedule / Head', 'Classification', 'Amount (Rs.)'];
  let rows = [
    ['Gross Architectural & Furniture Sales Revenue', 'Operating Revenue', 'Rs. 42,90,000.00'],
    ['Interior Design & Turnkey Consulting Fees', 'Operating Revenue', 'Rs. 5,80,000.00'],
    ['Cost of Raw Materials & Lumbers Consumed', 'Direct Operating Cost', 'Rs. 18,60,000.00'],
    ['Direct Artisan & Carpentry Labor Charges', 'Direct Operating Cost', 'Rs. 6,40,000.00'],
    ['Showroom Operations, Utilities & Logistics', 'Overhead Expenses', 'Rs. 4,20,000.00'],
    ['Depreciation & Amortization Schedule', 'Non-Cash Expense', 'Rs. 1,80,000.00'],
    ['NET AUDITED OPERATING BALANCE', 'Audited Balance', 'Rs. 17,70,000.00'],
  ];

  if (reportName.includes('Balance Sheet')) {
    headers = ['Asset / Liability Head', 'Classification', 'Amount (Rs.)'];
    rows = [
      ['Property, Plant & Showroom Machinery', 'Non-Current Asset', 'Rs. 1,45,00,000.00'],
      ['Inventories (Finished Goods & Teakwood)', 'Current Asset', 'Rs. 28,40,000.00'],
      ['Trade Receivables (Customer Debtors)', 'Current Asset', 'Rs. 3,88,500.00'],
      ['Cash & Bank Balances (HDFC Current A/C)', 'Liquid Asset', 'Rs. 15,30,200.00'],
      ['Equity Share Capital & Paid-Up Reserves', 'Shareholder Equity', 'Rs. 1,80,82,500.00'],
      ['Trade Creditors & Supplier Payables', 'Current Liability', 'Rs. 8,76,200.00'],
      ['Statutory Dues (GST & TDS Payable)', 'Current Liability', 'Rs. 3,00,000.00'],
    ];
  }

  return {
    type: 'REPORT',
    title: reportName.toUpperCase(),
    documentNo: `REP-2025-${Math.floor(1000 + Math.random() * 9000)}`,
    date: '02 Sep 2025',
    dueDate: period,
    status: 'Audited & Verified',
    partner: {
      name: 'Statutory Financial Audit Committee',
      company: 'Chartered Accounting & Audit Cell',
      city: 'Ahmedabad, Gujarat',
    },
    tableData: { headers, rows },
  };
};

// 5. Master Register Export PDF
export const createMasterRegisterPdfData = (title, headers, rows) => {
  return {
    type: 'REGISTER',
    title: title.toUpperCase(),
    documentNo: `REG-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`,
    date: '02 Sep 2025',
    dueDate: 'Real-time ERP Snapshot',
    status: 'Generated',
    partner: {
      name: 'Urban Furniture Internal Audit & ERP',
      company: 'Executive Accounts Division',
      city: 'Ahmedabad, Gujarat',
    },
    tableData: { headers, rows },
  };
};

/**
 * High-Level Export Functions for Direct Component Invocations
 */
export const generateTaxInvoicePDF = (order) => {
  const data = createSalesOrderPdfData(order || {});
  downloadDirectPdf(data);
  return data;
};

export const generatePurchaseOrderPDF = (order) => {
  const data = createPurchaseOrderPdfData(order || {});
  downloadDirectPdf(data);
  return data;
};

export const generatePaymentReceiptPDF = (payment) => {
  const data = createPaymentReceiptPdfData(payment || {});
  downloadDirectPdf(data);
  return data;
};

export const generateFinancialReportPDF = (reportTitle = 'Financial Statement', reportRows = null, period = 'August & Q3 2025') => {
  const data = createFinancialReportPdfData(reportTitle, period);
  if (reportRows) {
    data.tableData = {
      headers: ['Financial Line Item / Head', 'Classification', 'Amount (Rs.)'],
      rows: reportRows,
    };
  }
  downloadDirectPdf(data);
  return data;
};

export const exportTableToPDF = (title, headers, rows) => {
  const data = createMasterRegisterPdfData(title, headers, rows);
  downloadDirectPdf(data);
  return data;
};

