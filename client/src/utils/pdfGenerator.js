import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Urban Furniture Enterprise PDF Generation Utility
 * Generates official, high-resolution, elegantly styled PDFs for Invoices,
 * Purchase Orders, Payment Receipts, Financial Statements, and General Ledgers.
 */

// Color Palette
const COLORS = {
  primary: [45, 74, 62],       // Forest Green #2D4A3E
  primaryDark: [28, 58, 47],   // Deep Forest #1C3A2F
  accent: [232, 96, 52],       // Terracotta #E86034
  dark: [20, 26, 23],          // #141A17
  muted: [102, 117, 111],      // #66756F
  lightBg: [250, 248, 245],    // Ivory #FAF8F5
  tableHeader: [36, 68, 55],   // #244437
  border: [232, 225, 213],     // #E8E1D5
};

/**
 * Add Brand Header to PDF
 */
const addBrandHeader = (doc, title, docNumber, status = 'CONFIRMED') => {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Top Accent Bar
  doc.setFillColor(...COLORS.primaryDark);
  doc.rect(0, 0, pageWidth, 6, 'F');

  // Brand Logo / Monogram
  doc.setFillColor(...COLORS.primary);
  doc.roundedRect(14, 12, 12, 12, 2.5, 2.5, 'F');
  doc.setTextColor(250, 248, 245);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('UF', 17.5, 20);

  // Brand Name
  doc.setTextColor(...COLORS.primaryDark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('URBAN FURNITURE', 29, 19);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.muted);
  doc.text('LUXURY LIVING & BUSINESS MANAGEMENT SYSTEM', 29, 23.5);

  // Document Title & Number (Right aligned)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.primaryDark);
  doc.text(title.toUpperCase(), pageWidth - 14, 18, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.accent);
  doc.text(docNumber, pageWidth - 14, 23, { align: 'right' });

  // Status Badge
  const badgeWidth = 24;
  const badgeX = pageWidth - 14 - badgeWidth;
  doc.setFillColor(229, 247, 237); // Light green
  doc.roundedRect(badgeX, 25.5, badgeWidth, 5, 1.5, 1.5, 'F');
  doc.setFontSize(7);
  doc.setTextColor(30, 116, 69);
  doc.setFont('helvetica', 'bold');
  doc.text(status.toUpperCase(), badgeX + (badgeWidth / 2), 29, { align: 'center' });

  // Divider line
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.5);
  doc.line(14, 33, pageWidth - 14, 33);
};

/**
 * Add Standard Footer
 */
const addFooter = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.4);
    doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.muted);
    doc.text(
      'Urban Furniture Pvt. Ltd. • GSTIN: 27AABCU9603R1ZM • support@urbanfurniture.com • www.urbanfurniture.com',
      14,
      pageHeight - 10
    );

    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - 14,
      pageHeight - 10,
      { align: 'right' }
    );
  }
};

/**
 * 1. GENERATE OFFICIAL TAX INVOICE / SALES ORDER PDF
 */
export const generateTaxInvoicePDF = (order) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  const invoiceNo = order.soNo || `INV-${order.id ? String(order.id).padStart(4, '0') : '2026-001'}`;
  const orderDate = order.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const customerName = order.customer || 'Atelier Designs & Living';
  const status = order.status || 'Confirmed';

  addBrandHeader(doc, 'Tax Invoice', invoiceNo, status);

  // Company Details (Left Box)
  doc.setFillColor(250, 248, 245);
  doc.roundedRect(14, 36, 88, 30, 2, 2, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primaryDark);
  doc.text('BILLED FROM:', 18, 41);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.dark);
  doc.text('Urban Furniture Private Limited', 18, 46);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.muted);
  doc.text('Plot 42, Design District, Senapati Bapat Marg', 18, 50.5);
  doc.text('Lower Parel, Mumbai, Maharashtra - 400013', 18, 54.5);
  doc.text('GSTIN: 27AABCU9603R1ZM • State: 27 (Maharashtra)', 18, 58.5);
  doc.text('CIN: U36100MH2024PTC123456', 18, 62.5);

  // Customer Details (Right Box)
  doc.roundedRect(pageWidth - 102, 36, 88, 30, 2, 2, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primaryDark);
  doc.text('BILLED TO (BUYER):', pageWidth - 98, 41);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.dark);
  doc.text(customerName, pageWidth - 98, 46);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.muted);
  doc.text('Penthouse Suite 14A, Oberoi Sky City', pageWidth - 98, 50.5);
  doc.text('Borivali East, Mumbai - 400066', pageWidth - 98, 54.5);
  doc.text('GSTIN: 27AAAPL1234K1Z5 • State: 27', pageWidth - 98, 58.5);
  doc.text('Contact: +91 98765 43210 • info@atelier.com', pageWidth - 98, 62.5);

  // Invoice Metadata Table Row
  doc.setFillColor(242, 236, 228);
  doc.roundedRect(14, 69, pageWidth - 28, 10, 1.5, 1.5, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primaryDark);

  doc.text(`Invoice Date: ${orderDate}`, 18, 75.5);
  doc.text(`Due Date: 15 Days`, 72, 75.5);
  doc.text(`Place of Supply: Maharashtra (27)`, 118, 75.5);
  doc.text(`Reverse Charge: No`, 164, 75.5);

  // Table Items
  const sampleItems = [
    ['1', 'Nordic Sand 3-Seater Sofa\n(Solid Teak Frame, Belgian Linen)', '9403', '2 Units', '54,900.00', '1,09,800.00', '9%', '9%', '1,29,564.00'],
    ['2', 'Olive Velvet Lounge Chair\n(Ergonomic High Back, Brass Base)', '9401', '1 Unit', '37,900.00', '37,900.00', '9%', '9%', '44,722.00'],
  ];

  autoTable(doc, {
    startY: 82,
    head: [['#', 'Item Description', 'HSN', 'Qty', 'Unit Rate (₹)', 'Taxable (₹)', 'CGST', 'SGST', 'Total (₹)']],
    body: sampleItems,
    theme: 'grid',
    headStyles: {
      fillColor: COLORS.tableHeader,
      textColor: [250, 248, 245],
      fontSize: 7.5,
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: COLORS.dark,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { cellWidth: 55 },
      2: { halign: 'center', cellWidth: 16 },
      3: { halign: 'center', cellWidth: 16 },
      4: { halign: 'right', cellWidth: 22 },
      5: { halign: 'right', cellWidth: 22 },
      6: { halign: 'center', cellWidth: 12 },
      7: { halign: 'center', cellWidth: 12 },
      8: { halign: 'right', cellWidth: 25 },
    },
    styles: {
      cellPadding: 3,
      lineColor: COLORS.border,
      lineWidth: 0.2,
    },
  });

  const finalY = doc.lastAutoTable.finalY || 135;

  // Calculation & Bank Details Section
  // Left: Bank Information & QR Note
  doc.setFillColor(250, 248, 245);
  doc.roundedRect(14, finalY + 5, 95, 38, 2, 2, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primaryDark);
  doc.text('BANK DETAILS FOR NEFT / RTGS / IMPS:', 18, finalY + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.dark);
  doc.text('Bank Name: HDFC Bank Ltd', 18, finalY + 16.5);
  doc.text('Account Name: Urban Furniture Private Limited', 18, finalY + 21);
  doc.text('Account Number: 50200088992211 (Current)', 18, finalY + 25.5);
  doc.text('IFSC Code: HDFC0000128 • Branch: Lower Parel, Mumbai', 18, finalY + 30);
  doc.text('UPI ID: urbanfurniture@hdfcbank', 18, finalY + 34.5);
  doc.text('Amount in Words: INR One Lakh Seventy-Four Thousand Two Hundred Eighty-Six Only', 18, finalY + 39);

  // Right: Calculation Summary Table
  const calcX = pageWidth - 80;
  doc.setFillColor(242, 236, 228);
  doc.roundedRect(calcX - 5, finalY + 5, 71, 38, 2, 2, 'F');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.muted);

  doc.text('Taxable Subtotal:', calcX, finalY + 11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.dark);
  doc.text('₹ 1,47,700.00', pageWidth - 14, finalY + 11, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.muted);
  doc.text('Central GST (9%):', calcX, finalY + 17);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.dark);
  doc.text('₹ 13,293.00', pageWidth - 14, finalY + 17, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.muted);
  doc.text('State GST (9%):', calcX, finalY + 23);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.dark);
  doc.text('₹ 13,293.00', pageWidth - 14, finalY + 23, { align: 'right' });

  doc.setDrawColor(...COLORS.primary);
  doc.setLineWidth(0.4);
  doc.line(calcX, finalY + 27, pageWidth - 14, finalY + 27);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.primaryDark);
  doc.text('Grand Total:', calcX, finalY + 34);
  doc.setTextColor(...COLORS.accent);
  doc.text(order.totalAmount || '₹ 1,74,286.00', pageWidth - 14, finalY + 34, { align: 'right' });

  // Signature and Terms Block
  const sigY = finalY + 48;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primaryDark);
  doc.text('TERMS & CONDITIONS:', 14, sigY);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.muted);
  doc.text('1. Goods once sold will not be returned unless manufacturing defect is notified within 7 days.', 14, sigY + 4);
  doc.text('2. Interest @ 18% p.a. will be charged on overdue payments after due date.', 14, sigY + 7.5);
  doc.text('3. Subject to Mumbai Jurisdiction only.', 14, sigY + 11);

  // Authorised Signatory Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.primaryDark);
  doc.text('For URBAN FURNITURE PRIVATE LIMITED', pageWidth - 14, sigY, { align: 'right' });

  doc.setDrawColor(...COLORS.border);
  doc.line(pageWidth - 65, sigY + 16, pageWidth - 14, sigY + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.muted);
  doc.text('Authorised Signatory / Digital Verification', pageWidth - 14, sigY + 20, { align: 'right' });

  addFooter(doc);

  // Save PDF
  doc.save(`${invoiceNo}_Tax_Invoice.pdf`);
  return doc;
};

/**
 * 2. GENERATE OFFICIAL PURCHASE ORDER / VENDOR BILL PDF
 */
export const generatePurchaseOrderPDF = (order) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  const poNo = order.poNo || `PO-${order.id ? String(order.id).padStart(4, '0') : '2026-001'}`;
  const date = order.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const supplier = order.supplier || 'HomeWorks Supplies Ltd';
  const status = order.status || 'Received';

  addBrandHeader(doc, 'Purchase Order', poNo, status);

  // Supplier Details
  doc.setFillColor(250, 248, 245);
  doc.roundedRect(14, 36, 88, 28, 2, 2, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primaryDark);
  doc.text('SUPPLIER (VENDOR):', 18, 41);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.dark);
  doc.text(supplier, 18, 46);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.muted);
  doc.text('Industrial Timber Estate, Shed 12, Bengaluru', 18, 50.5);
  doc.text('GSTIN: 29AABCH5544R1Z8 • State: Karnataka (29)', 18, 54.5);
  doc.text('Contact: supply@homeworks.com • +91 98900 55667', 18, 58.5);

  // Delivery Address
  doc.roundedRect(pageWidth - 102, 36, 88, 28, 2, 2, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primaryDark);
  doc.text('DELIVER TO (WAREHOUSE):', pageWidth - 98, 41);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.dark);
  doc.text('Urban Furniture Central Warehouse', pageWidth - 98, 46);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.muted);
  doc.text('Logistics Hub Unit 8, Bhiwandi, Thane - 421302', pageWidth - 98, 50.5);
  doc.text('GSTIN: 27AABCU9603R1ZM • State: Maharashtra (27)', pageWidth - 98, 54.5);
  doc.text('Attn: Procurement & Quality Control Officer', pageWidth - 98, 58.5);

  // PO Items
  const items = [
    ['1', 'Teak Wood Frames (Grade A Seasoned)', '4407', '50 Sets', '1,200.00', '60,000.00', '18%', '10,800.00', '70,800.00'],
    ['2', 'Belgian Linen Fabric - Natural Sand', '5309', '100 Mtrs', '450.00', '45,000.00', '18%', '8,100.00', '53,100.00'],
  ];

  autoTable(doc, {
    startY: 68,
    head: [['#', 'Material Description', 'HSN', 'Qty', 'Unit Rate (₹)', 'Taxable (₹)', 'GST Rate', 'GST (₹)', 'Total (₹)']],
    body: items,
    theme: 'grid',
    headStyles: {
      fillColor: COLORS.tableHeader,
      textColor: [250, 248, 245],
      fontSize: 7.5,
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: COLORS.dark,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { cellWidth: 55 },
      2: { halign: 'center', cellWidth: 16 },
      3: { halign: 'center', cellWidth: 16 },
      4: { halign: 'right', cellWidth: 22 },
      5: { halign: 'right', cellWidth: 22 },
      6: { halign: 'center', cellWidth: 14 },
      7: { halign: 'right', cellWidth: 18 },
      8: { halign: 'right', cellWidth: 23 },
    },
    styles: {
      cellPadding: 3,
      lineColor: COLORS.border,
      lineWidth: 0.2,
    },
  });

  const finalY = doc.lastAutoTable.finalY || 120;

  // Calculation & Notes
  const calcX = pageWidth - 80;
  doc.setFillColor(242, 236, 228);
  doc.roundedRect(calcX - 5, finalY + 5, 71, 30, 2, 2, 'F');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.muted);
  doc.text('Untaxed Material Cost:', calcX, finalY + 11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.dark);
  doc.text('₹ 1,05,000.00', pageWidth - 14, finalY + 11, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.muted);
  doc.text('Input IGST Credit (18%):', calcX, finalY + 17);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.dark);
  doc.text('₹ 18,900.00', pageWidth - 14, finalY + 17, { align: 'right' });

  doc.setDrawColor(...COLORS.primary);
  doc.setLineWidth(0.4);
  doc.line(calcX, finalY + 21, pageWidth - 14, finalY + 21);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.primaryDark);
  doc.text('PO Total Amount:', calcX, finalY + 28);
  doc.setTextColor(...COLORS.accent);
  doc.text(order.totalAmount || '₹ 1,23,900.00', pageWidth - 14, finalY + 28, { align: 'right' });

  addFooter(doc);
  doc.save(`${poNo}_Purchase_Order.pdf`);
  return doc;
};

/**
 * 3. GENERATE PAYMENT RECEIPT / VOUCHER PDF
 */
export const generatePaymentReceiptPDF = (payment) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  const payId = payment.paymentId || `PAY-${payment.id ? String(payment.id).padStart(4, '0') : '2026-001'}`;
  const date = payment.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const contact = payment.contact || 'Rohan Kapoor';
  const amount = payment.amount || '₹ 48,750.00';
  const type = payment.type || 'Inbound (Received)';
  const mode = payment.mode || 'Bank Transfer / NEFT';

  addBrandHeader(doc, 'Payment Receipt', payId, 'COMPLETED');

  doc.setFillColor(250, 248, 245);
  doc.roundedRect(14, 38, pageWidth - 28, 45, 2, 2, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primaryDark);
  doc.text('PAYMENT VOUCHER DETAILS', 20, 45);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.muted);
  doc.text('Receipt Date:', 20, 52);
  doc.text('Payment Type:', 20, 58);
  doc.text('Contact Name:', 20, 64);
  doc.text('Payment Mode:', 20, 70);
  doc.text('Transaction Ref:', 20, 76);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.dark);
  doc.text(date, 55, 52);
  doc.text(type, 55, 58);
  doc.text(contact, 55, 64);
  doc.text(mode, 55, 70);
  doc.setFont('helvetica', 'bold');
  doc.text(payment.reference || 'HDFC-TXN-99882244', 55, 76);

  // Big Amount Box
  doc.setFillColor(229, 247, 237);
  doc.roundedRect(pageWidth - 75, 45, 55, 28, 2, 2, 'F');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 116, 69);
  doc.text('AMOUNT RECEIVED', pageWidth - 47.5, 52, { align: 'center' });

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(amount, pageWidth - 47.5, 63, { align: 'center' });

  addFooter(doc);
  doc.save(`${payId}_Payment_Receipt.pdf`);
  return doc;
};

/**
 * 4. GENERATE COMPREHENSIVE FINANCIAL REPORT PDF (P&L, BALANCE SHEET, BUDGETS)
 */
export const generateFinancialReportPDF = (reportTitle, reportRows, period = 'Fiscal Year 2026') => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  const reportId = `REP-${Date.now().toString().slice(-6)}`;
  addBrandHeader(doc, reportTitle, reportId, 'AUDITED');

  // Report Period Header Banner
  doc.setFillColor(242, 236, 228);
  doc.roundedRect(14, 36, pageWidth - 28, 10, 1.5, 1.5, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primaryDark);
  doc.text(`Statement Period: ${period}`, 18, 42.5);
  doc.text(`Generated On: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - 18, 42.5, { align: 'right' });

  const defaultRows = reportRows || [
    ['Sales Income (Furniture Retail & Projects)', '₹ 28,67,400.00', '₹ 24,50,000.00', '+ 17.0%'],
    ['Cost of Goods Sold (COGS - Timber & Fabrics)', '₹ 12,34,500.00', '₹ 10,80,000.00', '+ 14.3%'],
    ['Gross Profit', '₹ 16,32,900.00', '₹ 13,70,000.00', '+ 19.2%'],
    ['Operating Expenses (Showroom & Logistics)', '₹ 4,12,000.00', '₹ 3,90,000.00', '+ 5.6%'],
    ['Net Operating Profit (EBITDA)', '₹ 12,20,900.00', '₹ 9,80,000.00', '+ 24.6%'],
  ];

  autoTable(doc, {
    startY: 50,
    head: [['Financial Line Item', 'Current Period (₹)', 'Previous Period (₹)', 'Variance (%)']],
    body: defaultRows,
    theme: 'grid',
    headStyles: {
      fillColor: COLORS.tableHeader,
      textColor: [250, 248, 245],
      fontSize: 8,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: COLORS.dark,
    },
    columnStyles: {
      0: { cellWidth: 85 },
      1: { halign: 'right', cellWidth: 35 },
      2: { halign: 'right', cellWidth: 35 },
      3: { halign: 'center', cellWidth: 27 },
    },
    styles: {
      cellPadding: 3.5,
      lineColor: COLORS.border,
      lineWidth: 0.2,
    },
  });

  addFooter(doc);
  const cleanName = reportTitle.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`${cleanName}_Statement.pdf`);
  return doc;
};

/**
 * 5. GENERIC TABLE EXPORT TO PDF
 */
export const exportTableToPDF = (title, headers, rows) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: rows[0]?.length > 6 ? 'landscape' : 'portrait' });
  const pageWidth = doc.internal.pageSize.getWidth();

  const docNo = `EXP-${Date.now().toString().slice(-6)}`;
  addBrandHeader(doc, title, docNo, 'ACTIVE');

  autoTable(doc, {
    startY: 38,
    head: [headers],
    body: rows,
    theme: 'grid',
    headStyles: {
      fillColor: COLORS.tableHeader,
      textColor: [250, 248, 245],
      fontSize: 7.5,
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 7,
      textColor: COLORS.dark,
    },
    styles: {
      cellPadding: 2.5,
      lineColor: COLORS.border,
      lineWidth: 0.2,
    },
  });

  addFooter(doc);
  const cleanName = title.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`${cleanName}_Export.pdf`);
  return doc;
};
