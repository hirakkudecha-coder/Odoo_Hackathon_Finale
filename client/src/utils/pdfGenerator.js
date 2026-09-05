import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * URBAN FURNITURE ENTERPRISE PDF GENERATOR
 * Pixel-perfect implementation matching the official Urban Furniture
 * Artisan Architectural Furnishing & Interior Solutions corporate template.
 */

const PALETTE = {
  forestDark: [28, 58, 47],     // #1C3A2F
  forestPrimary: [45, 74, 62],  // #2D4A3E
  textDark: [20, 26, 23],       // #141A17
  textMuted: [90, 105, 99],     // #5A6963
  badgeRed: [224, 90, 43],      // #E05A2B
  cardBorder: [216, 206, 190],  // #D8CEBE
  cardBg: [255, 255, 255],      // #FFFFFF
  zebraBg: [250, 248, 245],     // #FAF8F5
  divider: [232, 225, 213],     // #E8E1D5
};

/**
 * Standard Urban Furniture Header
 */
const renderUrbanFurnitureHeader = (doc, titleText, docNumber, statusBadgeText = 'GENERATED') => {
  const pageWidth = doc.internal.pageSize.getWidth();

  // --- TOP LEFT: BRAND INFO ---
  // Brand Name
  doc.setFont('times', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(...PALETTE.textDark);
  doc.text('URBAN FURNITURE', 14, 18);

  // Subtitle
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...PALETTE.textMuted);
  doc.text('ARTISAN ARCHITECTURAL FURNISHING & INTERIOR SOLUTIONS', 14, 23);

  // Address Lines
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(...PALETTE.textMuted);
  doc.text('Plot No. 42-45, Woodcraft Industrial Estate, S.G. Highway, Ahmedabad, Gujarat - 380054, India', 14, 27.5);
  
  // Tax Registration line
  doc.setFont('helvetica', 'bold');
  doc.text('GSTIN:', 14, 31.5);
  doc.setFont('helvetica', 'normal');
  doc.text('24AAACU8899F1ZV  |  ', 22.5, 31.5);
  doc.setFont('helvetica', 'bold');
  doc.text('PAN:', 42, 31.5);
  doc.setFont('helvetica', 'normal');
  doc.text('AAACU8899F  |  ', 48, 31.5);
  doc.setFont('helvetica', 'bold');
  doc.text('CIN:', 65, 31.5);
  doc.setFont('helvetica', 'normal');
  doc.text('U36100GJ2020PTC112450', 70.5, 31.5);

  // --- TOP RIGHT: DOCUMENT TITLE & STATUS ---
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...PALETTE.forestDark);
  
  // Split title if long
  const titleLines = doc.splitTextToSize(titleText.toUpperCase(), 80);
  doc.text(titleLines, pageWidth - 14, 17, { align: 'right' });

  const titleBottomY = 17 + (titleLines.length * 4.5);

  // Reference Code
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...PALETTE.textDark);
  doc.text(docNumber, pageWidth - 14, titleBottomY, { align: 'right' });

  // Status Box (Red/Coral outline badge)
  const badgeW = 26;
  const badgeH = 5.5;
  const badgeX = pageWidth - 14 - badgeW;
  const badgeY = titleBottomY + 2.5;

  doc.setDrawColor(...PALETTE.badgeRed);
  doc.setLineWidth(0.4);
  doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 0.8, 0.8, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...PALETTE.badgeRed);
  doc.text(statusBadgeText.toUpperCase(), badgeX + (badgeW / 2), badgeY + 3.8, { align: 'center' });

  return Math.max(38, badgeY + badgeH + 4);
};

/**
 * Render Dual Info Cards (Billed To & Document Schedule)
 */
const renderDualCards = (doc, startY, leftDetails = {}, rightDetails = {}) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const cardWidth = (pageWidth - 28 - 6) / 2;
  const cardHeight = 31;
  const leftX = 14;
  const rightX = leftX + cardWidth + 6;

  // Draw Card 1: Billed To (Customer/Recipient Details)
  doc.setDrawColor(...PALETTE.cardBorder);
  doc.setFillColor(...PALETTE.cardBg);
  doc.setLineWidth(0.3);
  doc.roundedRect(leftX, startY, cardWidth, cardHeight, 1, 1, 'FD');

  // Header Left Card
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...PALETTE.forestDark);
  doc.text(leftDetails.header || 'BILLED TO (CUSTOMER DETAILS)', leftX + 4, startY + 5.5);

  doc.setDrawColor(...PALETTE.divider);
  doc.line(leftX + 4, startY + 7.5, leftX + cardWidth - 4, startY + 7.5);

  // Content Left Card
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...PALETTE.textDark);
  doc.text(leftDetails.title || 'Urban Furniture Internal Audit & ERP', leftX + 4, startY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(...PALETTE.textMuted);
  doc.text(leftDetails.line1 || 'Executive Accounts Division', leftX + 4, startY + 16.5);
  doc.text(leftDetails.line2 || 'Ahmedabad, Gujarat', leftX + 4, startY + 20.5);
  if (leftDetails.line3) {
    doc.text(leftDetails.line3, leftX + 4, startY + 24.5);
  }
  if (leftDetails.line4) {
    doc.text(leftDetails.line4, leftX + 4, startY + 28.5);
  }

  // Draw Card 2: Document & Order Schedule
  doc.setDrawColor(...PALETTE.cardBorder);
  doc.setFillColor(...PALETTE.cardBg);
  doc.roundedRect(rightX, startY, cardWidth, cardHeight, 1, 1, 'FD');

  // Header Right Card
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...PALETTE.forestDark);
  doc.text(rightDetails.header || 'DOCUMENT & ORDER SCHEDULE', rightX + 4, startY + 5.5);

  doc.setDrawColor(...PALETTE.divider);
  doc.line(rightX + 4, startY + 7.5, rightX + cardWidth - 4, startY + 7.5);

  // Content Right Card Key-Values
  const scheduleItems = rightDetails.items || [
    { label: 'Invoice / Ref Date:', value: '02 Sep 2025' },
    { label: 'Payment Due Date:', value: 'Real-time System Snapshot' },
    { label: 'Place of Supply:', value: 'Gujarat (State Code: 24)' },
    { label: 'Payment Terms:', value: 'Net 15 Days' },
    { label: 'Mode of Dispatch:', value: 'Dedicated Air-Cushioned Logistics' },
  ];

  let currentItemY = startY + 11.5;
  scheduleItems.forEach((item) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.2);
    doc.setTextColor(...PALETTE.textDark);
    doc.text(item.label, rightX + 4, currentItemY);

    const labelWidth = doc.getTextWidth(item.label);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...PALETTE.textMuted);
    doc.text(item.value, rightX + 5 + labelWidth, currentItemY);

    currentItemY += 3.8;
  });

  return startY + cardHeight + 6;
};

/**
 * Render Terms, Official Digital Record Badge & Authorized Signatory Block
 */
const renderOfficialSignatoryFooter = (doc, noteText) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const bottomY = pageHeight - 38;

  // Table Sub-Note
  if (noteText) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.8);
    doc.setTextColor(...PALETTE.textMuted);
    doc.text(noteText, 14, bottomY - 3);
  }

  // Divider above footer
  doc.setDrawColor(...PALETTE.divider);
  doc.setLineWidth(0.3);
  doc.line(14, bottomY, pageWidth - 14, bottomY);

  // --- LEFT: Terms & Conditions ---
  const termsY = bottomY + 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...PALETTE.forestDark);
  doc.text('Terms & Conditions:', 14, termsY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.8);
  doc.setTextColor(...PALETTE.textMuted);
  doc.text('1. Payment is due within 15 days of invoice date.', 14, termsY + 3.8);
  doc.text('2. Goods once sold will not be returned unless manufacturing defects are reported within 48 hours.', 14, termsY + 7.2);
  doc.text('3. Interest @ 18% per annum will be charged on overdue payments.', 14, termsY + 10.6);
  doc.text('4. Subject to Ahmedabad jurisdiction only.', 14, termsY + 14);

  // --- RIGHT: Official Digital Record Badge + Signatory ---
  const badgeW = 42;
  const badgeH = 5.5;
  const badgeX = pageWidth - 14 - badgeW;
  const badgeY = termsY - 0.5;

  // Dashed Box Badge
  doc.setDrawColor(...PALETTE.forestDark);
  doc.setLineDashPattern([1, 1], 0);
  doc.setLineWidth(0.4);
  doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 0.5, 0.5, 'S');
  doc.setLineDashPattern([], 0); // reset dash

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.setTextColor(...PALETTE.forestDark);
  doc.text('OFFICIAL DIGITAL RECORD', badgeX + (badgeW / 2), badgeY + 3.8, { align: 'center' });

  // Company Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.8);
  doc.setTextColor(...PALETTE.textMuted);
  doc.text('FOR URBAN FURNITURE & INTERIORS PVT LTD', pageWidth - 14, badgeY + 9, { align: 'right' });

  // Signature Line
  doc.setDrawColor(...PALETTE.textDark);
  doc.setLineWidth(0.4);
  doc.line(pageWidth - 62, badgeY + 18, pageWidth - 14, badgeY + 18);

  // Authorized Signatory Label
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...PALETTE.textDark);
  doc.text('Authorized Signatory', pageWidth - 38, badgeY + 22, { align: 'center' });

  // Bottom Pagination / Stamp
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(160, 160, 160);
    doc.text('Urban Furniture Verified Enterprise Document', 14, pageHeight - 4);
    doc.text(`${i}/${totalPages}`, pageWidth - 14, pageHeight - 4, { align: 'right' });
  }
};

/**
 * 1. MASTER TABLE REGISTER EXPORT (Exact image template)
 */
export const exportTableToPDF = (title, headers, rows, options = {}) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const today = new Date();
  const dateFormatted = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  const docRef = options.docNumber || `REG-${dateStr}`;

  // 1. Header
  const headerBottomY = renderUrbanFurnitureHeader(
    doc,
    title,
    docRef,
    options.statusBadge || 'GENERATED'
  );

  // 2. Dual Cards
  const leftDetails = options.leftDetails || {
    header: 'BILLED TO (CUSTOMER DETAILS)',
    title: 'Urban Furniture Internal Audit & ERP',
    line1: 'Executive Accounts Division',
    line2: 'Ahmedabad, Gujarat',
  };

  const rightDetails = options.rightDetails || {
    header: 'DOCUMENT & ORDER SCHEDULE',
    items: [
      { label: 'Invoice / Ref Date:', value: dateFormatted },
      { label: 'Payment Due Date:', value: 'Real-time System Snapshot' },
      { label: 'Place of Supply:', value: 'Gujarat (State Code: 24)' },
      { label: 'Payment Terms:', value: 'Net 15 Days' },
      { label: 'Mode of Dispatch:', value: 'Dedicated Air-Cushioned Logistics' },
    ],
  };

  const tableStartY = renderDualCards(doc, headerBottomY, leftDetails, rightDetails);

  // 3. Section Title
  doc.setFont('times', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...PALETTE.forestDark);
  doc.text(`Master Register Schedule (${rows.length} records)`, 14, tableStartY + 1);

  // 4. AutoTable
  autoTable(doc, {
    startY: tableStartY + 4,
    head: [headers],
    body: rows,
    theme: 'plain',
    headStyles: {
      fillColor: PALETTE.forestDark,
      textColor: [255, 255, 255],
      fontSize: 6.8,
      fontStyle: 'bold',
      halign: 'left',
      cellPadding: { top: 3, bottom: 3, left: 3, right: 3 },
    },
    bodyStyles: {
      fontSize: 6.8,
      textColor: PALETTE.textDark,
      cellPadding: { top: 2.8, bottom: 2.8, left: 3, right: 3 },
      lineColor: PALETTE.divider,
      lineWidth: { bottom: 0.2 },
    },
    alternateRowStyles: {
      fillColor: PALETTE.zebraBg,
    },
    styles: {
      font: 'helvetica',
      overflow: 'linebreak',
    },
    margin: { left: 14, right: 14, bottom: 42 },
  });

  // 5. Footer Signatory
  const note = `Note: Official export generated with total of ${rows.length} verified ledger rows.`;
  renderOfficialSignatoryFooter(doc, note);

  const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`${cleanTitle}_${docRef}.pdf`);
  return doc;
};

/**
 * 2. TAX INVOICE GENERATION (Exact Corporate Standard)
 */
export const generateTaxInvoicePDF = (order = {}) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const soNo = order.soNo || `INV-${order.id ? String(order.id).padStart(4, '0') : '2025-001'}`;
  const dateFormatted = order.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const customerName = order.customer || 'Rohan Kapoor Interiors';

  const headerBottomY = renderUrbanFurnitureHeader(
    doc,
    'TAX INVOICE & SALES ORDER',
    soNo,
    order.status ? order.status.toUpperCase() : 'CONFIRMED'
  );

  const leftDetails = {
    header: 'BILLED TO (BUYER DETAILS)',
    title: customerName,
    line1: 'Penthouse 14A, Oberoi Sky City',
    line2: 'Ahmedabad, Gujarat - 380054',
    line3: 'GSTIN: 24AAAPL1234K1Z5 | Contact: +91 98765 43210',
  };

  const rightDetails = {
    header: 'INVOICE & BILLING SCHEDULE',
    items: [
      { label: 'Invoice Date:', value: dateFormatted },
      { label: 'Payment Terms:', value: 'Net 15 Days' },
      { label: 'Place of Supply:', value: 'Gujarat (State Code: 24)' },
      { label: 'Reverse Charge:', value: 'No' },
      { label: 'Mode of Dispatch:', value: 'Dedicated Air-Cushioned Logistics' },
    ],
  };

  const tableStartY = renderDualCards(doc, headerBottomY, leftDetails, rightDetails);

  // Items Schedule
  doc.setFont('times', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...PALETTE.forestDark);
  doc.text('Master Invoice Line Schedule (3 items)', 14, tableStartY + 1);

  const sampleItems = [
    ['1', 'Nordic Teakwood 3-Seater Sofa Set\n(Belgian Linen Sand)', '9403', '2 Units', '₹ 54,900.00', '₹ 1,09,800.00', '₹ 1,29,564.00'],
    ['2', 'Olive Velvet High-Back Lounge Chair\n(Ergonomic Brass Base)', '9401', '1 Unit', '₹ 37,900.00', '₹ 37,900.00', '₹ 44,722.00'],
    ['3', 'Artisan Minimalist Oak Credenza', '9403', '1 Unit', '₹ 22,500.00', '₹ 22,500.00', '₹ 26,550.00'],
  ];

  autoTable(doc, {
    startY: tableStartY + 4,
    head: [['#', 'Item & Specification Description', 'HSN', 'Qty', 'Unit Rate', 'Taxable Amount', 'Total (incl. GST)']],
    body: sampleItems,
    theme: 'plain',
    headStyles: {
      fillColor: PALETTE.forestDark,
      textColor: [255, 255, 255],
      fontSize: 6.8,
      fontStyle: 'bold',
      cellPadding: { top: 3, bottom: 3, left: 3, right: 3 },
    },
    bodyStyles: {
      fontSize: 6.8,
      textColor: PALETTE.textDark,
      cellPadding: { top: 2.8, bottom: 2.8, left: 3, right: 3 },
      lineColor: PALETTE.divider,
      lineWidth: { bottom: 0.2 },
    },
    alternateRowStyles: {
      fillColor: PALETTE.zebraBg,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { cellWidth: 65 },
      2: { halign: 'center', cellWidth: 15 },
      3: { halign: 'center', cellWidth: 16 },
      4: { halign: 'right', cellWidth: 24 },
      5: { halign: 'right', cellWidth: 26 },
      6: { halign: 'right', cellWidth: 28 },
    },
    margin: { left: 14, right: 14, bottom: 42 },
  });

  const finalY = doc.lastAutoTable.finalY || 135;

  // Calculation Summary Bar
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setDrawColor(...PALETTE.cardBorder);
  doc.setFillColor(...PALETTE.zebraBg);
  doc.roundedRect(pageWidth - 78, finalY + 3, 64, 18, 1, 1, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...PALETTE.textMuted);
  doc.text('Taxable Subtotal:', pageWidth - 74, finalY + 7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PALETTE.textDark);
  doc.text('₹ 1,70,200.00', pageWidth - 17, finalY + 7.5, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...PALETTE.textMuted);
  doc.text('CGST + SGST (18%):', pageWidth - 74, finalY + 11.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PALETTE.textDark);
  doc.text('₹ 30,636.00', pageWidth - 17, finalY + 11.5, { align: 'right' });

  doc.setDrawColor(...PALETTE.divider);
  doc.line(pageWidth - 74, finalY + 13, pageWidth - 17, finalY + 13);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...PALETTE.forestDark);
  doc.text('Grand Invoice Total:', pageWidth - 74, finalY + 17.5);
  doc.setTextColor(...PALETTE.badgeRed);
  doc.text(order.totalAmount || '₹ 2,00,836.00', pageWidth - 17, finalY + 17.5, { align: 'right' });

  const note = 'Note: Official computer generated tax invoice valid without physical signature under IT Act 2000.';
  renderOfficialSignatoryFooter(doc, note);

  doc.save(`${soNo}_Tax_Invoice.pdf`);
  return doc;
};

/**
 * 3. PURCHASE ORDER GENERATION
 */
export const generatePurchaseOrderPDF = (order = {}) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const poNo = order.poNo || `PO-${order.id ? String(order.id).padStart(4, '0') : '2025-001'}`;
  const dateFormatted = order.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const supplier = order.supplier || 'HomeWorks Supplies Ltd';

  const headerBottomY = renderUrbanFurnitureHeader(
    doc,
    'PURCHASE ORDERS PROCUREMENT REGISTER',
    poNo,
    order.status ? order.status.toUpperCase() : 'GENERATED'
  );

  const leftDetails = {
    header: 'SUPPLIER (VENDOR DETAILS)',
    title: supplier,
    line1: 'Industrial Timber Estate, Shed 12',
    line2: 'Bengaluru, Karnataka - 560099',
    line3: 'GSTIN: 29AABCH5544R1Z8 | Contact: +91 98900 55667',
  };

  const rightDetails = {
    header: 'DOCUMENT & ORDER SCHEDULE',
    items: [
      { label: 'PO Date:', value: dateFormatted },
      { label: 'Payment Due Date:', value: 'Real-time System Snapshot' },
      { label: 'Place of Supply:', value: 'Gujarat (State Code: 24)' },
      { label: 'Payment Terms:', value: 'Net 15 Days' },
      { label: 'Mode of Dispatch:', value: 'Dedicated Air-Cushioned Logistics' },
    ],
  };

  const tableStartY = renderDualCards(doc, headerBottomY, leftDetails, rightDetails);

  doc.setFont('times', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...PALETTE.forestDark);
  doc.text('Master Register Schedule (7 records)', 14, tableStartY + 1);

  const poItems = [
    ['1', 'PO-2025-001', 'Azure Furniture', '02 Sep 2025', '5 items', '₹ 48,750.00', 'Received'],
    ['2', 'PO-2025-002', 'Woodland Supplies', '30 Aug 2025', '3 items', '₹ 33,200.00', 'Ordered'],
    ['3', 'PO-2025-003', 'Royal Hardware', '28 Aug 2025', '8 items', '₹ 12,500.00', 'Received'],
    ['4', 'PO-2025-004', 'Crafty Wood Co.', '26 Aug 2025', '4 items', '₹ 27,800.00', 'Received'],
    ['5', 'PO-2025-005', 'Prime Metals', '24 Aug 2025', '6 items', '₹ 19,600.00', 'Pending'],
    ['6', 'PO-2025-006', 'HomeWorks Supplies', '20 Aug 2025', '7 items', '₹ 64,200.00', 'Ordered'],
    ['7', 'PO-2025-007', 'Timber Craft', '18 Aug 2025', '2 items', '₹ 15,300.00', 'Cancelled'],
  ];

  autoTable(doc, {
    startY: tableStartY + 4,
    head: [['#', 'PO #', 'SUPPLIER', 'DATE', 'ITEMS', 'TOTAL AMOUNT', 'STATUS']],
    body: poItems,
    theme: 'plain',
    headStyles: {
      fillColor: PALETTE.forestDark,
      textColor: [255, 255, 255],
      fontSize: 6.8,
      fontStyle: 'bold',
      cellPadding: { top: 3, bottom: 3, left: 3, right: 3 },
    },
    bodyStyles: {
      fontSize: 6.8,
      textColor: PALETTE.textDark,
      cellPadding: { top: 2.8, bottom: 2.8, left: 3, right: 3 },
      lineColor: PALETTE.divider,
      lineWidth: { bottom: 0.2 },
    },
    alternateRowStyles: {
      fillColor: PALETTE.zebraBg,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { cellWidth: 26 },
      2: { cellWidth: 46 },
      3: { cellWidth: 26 },
      4: { halign: 'center', cellWidth: 20 },
      5: { halign: 'right', cellWidth: 30 },
      6: { halign: 'center', cellWidth: 26 },
    },
    margin: { left: 14, right: 14, bottom: 42 },
  });

  const note = 'Note: Official export generated with total of 7 verified ledger rows.';
  renderOfficialSignatoryFooter(doc, note);

  doc.save(`${poNo}_Procurement_Register.pdf`);
  return doc;
};

/**
 * 4. PAYMENT RECEIPT GENERATION
 */
export const generatePaymentReceiptPDF = (payment = {}) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const payId = payment.paymentId || `PAY-${payment.id ? String(payment.id).padStart(4, '0') : '2025-001'}`;
  const dateFormatted = payment.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const contact = payment.contact || 'Rohan Kapoor';

  const headerBottomY = renderUrbanFurnitureHeader(
    doc,
    'OFFICIAL PAYMENT RECEIPT VOUCHER',
    payId,
    'COMPLETED'
  );

  const leftDetails = {
    header: 'RECEIVED FROM (PARTNER DETAILS)',
    title: contact,
    line1: 'Corporate Client Portfolio',
    line2: 'Ahmedabad, Gujarat',
    line3: `Payment Mode: ${payment.mode || 'Bank Transfer / NEFT'}`,
  };

  const rightDetails = {
    header: 'TRANSACTION SCHEDULE',
    items: [
      { label: 'Payment Date:', value: dateFormatted },
      { label: 'Transaction Ref:', value: payment.reference || 'UTR-HDFC-992288' },
      { label: 'Payment Type:', value: payment.type || 'Inbound (Received)' },
      { label: 'Status:', value: 'Verified & Credited' },
      { label: 'Settlement:', value: 'Immediate' },
    ],
  };

  const tableStartY = renderDualCards(doc, headerBottomY, leftDetails, rightDetails);

  doc.setFont('times', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...PALETTE.forestDark);
  doc.text('Payment Allocation Ledger', 14, tableStartY + 1);

  const rows = [
    ['1', payId, contact, payment.mode || 'Bank Transfer', payment.reference || 'UTR-882211', payment.amount || '₹ 48,750.00', 'Completed'],
  ];

  autoTable(doc, {
    startY: tableStartY + 4,
    head: [['#', 'Voucher ID', 'Account / Contact', 'Payment Mode', 'Reference No.', 'Amount (₹)', 'Status']],
    body: rows,
    theme: 'plain',
    headStyles: {
      fillColor: PALETTE.forestDark,
      textColor: [255, 255, 255],
      fontSize: 6.8,
      fontStyle: 'bold',
      cellPadding: { top: 3, bottom: 3, left: 3, right: 3 },
    },
    bodyStyles: {
      fontSize: 6.8,
      textColor: PALETTE.textDark,
      cellPadding: { top: 2.8, bottom: 2.8, left: 3, right: 3 },
      lineColor: PALETTE.divider,
      lineWidth: { bottom: 0.2 },
    },
    alternateRowStyles: {
      fillColor: PALETTE.zebraBg,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { cellWidth: 28 },
      2: { cellWidth: 46 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
      5: { halign: 'right', cellWidth: 24 },
      6: { halign: 'center', cellWidth: 16 },
    },
    margin: { left: 14, right: 14, bottom: 42 },
  });

  const note = 'Note: Official system verified payment receipt generated from Urban Furniture ERP.';
  renderOfficialSignatoryFooter(doc, note);

  doc.save(`${payId}_Payment_Receipt.pdf`);
  return doc;
};

/**
 * 5. FINANCIAL REPORT GENERATION (P&L, BALANCE SHEET, BUDGETS)
 */
export const generateFinancialReportPDF = (reportTitle, reportRows, period = 'Fiscal Year 2025-26') => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const today = new Date();
  const dateFormatted = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const docRef = `REP-${Date.now().toString().slice(-6)}`;

  const headerBottomY = renderUrbanFurnitureHeader(
    doc,
    `${reportTitle.toUpperCase()} STATEMENT`,
    docRef,
    'AUDITED'
  );

  const leftDetails = {
    header: 'ENTITY DETAILS (AUDIT & COMPLIANCE)',
    title: 'Urban Furniture Private Limited',
    line1: 'Finance & Accounts Directorate',
    line2: 'Ahmedabad, Gujarat - 380054',
  };

  const rightDetails = {
    header: 'AUDIT & REPORT SCHEDULE',
    items: [
      { label: 'Reporting Period:', value: period },
      { label: 'Generated On:', value: dateFormatted },
      { label: 'Accounting Standard:', value: 'Ind AS / Schedule III' },
      { label: 'Currency:', value: 'Indian Rupees (INR ₹)' },
      { label: 'Audit Status:', value: 'Statutory Verified' },
    ],
  };

  const tableStartY = renderDualCards(doc, headerBottomY, leftDetails, rightDetails);

  doc.setFont('times', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...PALETTE.forestDark);
  doc.text(`Financial Performance Schedule (${period})`, 14, tableStartY + 1);

  const defaultRows = reportRows || [
    ['Sales Income (Luxury Living & Architectural Projects)', '₹ 28,67,400.00', '₹ 24,50,000.00', '+ 17.0%'],
    ['Cost of Goods Sold (Raw Teak, Velvet & Belgian Linen)', '₹ 12,34,500.00', '₹ 10,80,000.00', '+ 14.3%'],
    ['Gross Operating Margin', '₹ 16,32,900.00', '₹ 13,70,000.00', '+ 19.2%'],
    ['Operating & Showroom Expenses', '₹ 4,12,000.00', '₹ 3,90,000.00', '+ 5.6%'],
    ['Net Operating Profit Before Taxes (EBITDA)', '₹ 12,20,900.00', '₹ 9,80,000.00', '+ 24.6%'],
  ];

  autoTable(doc, {
    startY: tableStartY + 4,
    head: [['Financial Line Item & Classification', 'Current Period (₹)', 'Previous Period (₹)', 'Variance (%)']],
    body: defaultRows,
    theme: 'plain',
    headStyles: {
      fillColor: PALETTE.forestDark,
      textColor: [255, 255, 255],
      fontSize: 6.8,
      fontStyle: 'bold',
      cellPadding: { top: 3, bottom: 3, left: 3, right: 3 },
    },
    bodyStyles: {
      fontSize: 6.8,
      textColor: PALETTE.textDark,
      cellPadding: { top: 2.8, bottom: 2.8, left: 3, right: 3 },
      lineColor: PALETTE.divider,
      lineWidth: { bottom: 0.2 },
    },
    alternateRowStyles: {
      fillColor: PALETTE.zebraBg,
    },
    columnStyles: {
      0: { cellWidth: 85 },
      1: { halign: 'right', cellWidth: 35 },
      2: { halign: 'right', cellWidth: 35 },
      3: { halign: 'center', cellWidth: 27 },
    },
    margin: { left: 14, right: 14, bottom: 42 },
  });

  const note = `Note: Official statutory financial statement generated from Urban Furniture Corporate Ledger.`;
  renderOfficialSignatoryFooter(doc, note);

  const cleanName = reportTitle.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`${cleanName}_Statement_${docRef}.pdf`);
  return doc;
};
