require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const app = require('../src/app');

// Models
const User = require('../src/models/User');
const Contact = require('../src/models/Contact');
const Product = require('../src/models/Product');
const Account = require('../src/models/Account');
const Journal = require('../src/models/Journal');
const AnalyticAccount = require('../src/models/AnalyticAccount');
const Budget = require('../src/models/Budget');
const PurchaseOrder = require('../src/models/PurchaseOrder');
const GoodsReceipt = require('../src/models/GoodsReceipt');
const VendorBill = require('../src/models/VendorBill');
const SalesOrder = require('../src/models/SalesOrder');
const SalesReceipt = require('../src/models/SalesReceipt');
const CustomerInvoice = require('../src/models/CustomerInvoice');
const Payment = require('../src/models/Payment');
const JournalEntry = require('../src/models/JournalEntry');

const PORT = 5098;
const BASE_URL = `http://localhost:${PORT}/api`;

let passedCount = 0;
let failedCount = 0;
const results = [];

function assert(description, condition, details = '') {
  if (condition) {
    passedCount++;
    console.log(`  [PASS] ${description}`);
    results.push({ description, status: 'PASS', details });
  } else {
    failedCount++;
    console.error(`  [FAIL] ${description} ${details ? `(${details})` : ''}`);
    results.push({ description, status: 'FAIL', details });
  }
}

async function request(method, path, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  let data = null;
  const text = await res.text();
  try {
    data = JSON.parse(text);
  } catch (e) {
    data = text;
  }

  return { status: res.status, ok: res.ok, data };
}

async function runPhase3E2E() {
  console.log('========================================================================');
  console.log(' PHASE 3: COMPREHENSIVE END-TO-END INTEGRATION SMOKE TEST SUITE          ');
  console.log(' Target Base: ' + BASE_URL);
  console.log('========================================================================\n');

  await connectDB();
  const server = app.listen(PORT);

  try {
    // -------------------------------------------------------------
    // SETUP: Authenticate All Roles
    // -------------------------------------------------------------
    console.log('[Setup] Authenticating test tokens for all roles...');
    let admin = await User.findOne({ email: 'admin@urbanfurniture.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Admin E2E',
        email: 'admin@urbanfurniture.com',
        password: 'AdminPassword123!',
        role: 'admin'
      });
    }
    const adminToken = admin.generateAuthToken();

    let accountant = await User.findOne({ email: 'accountant@urbanfurniture.com' });
    if (!accountant) {
      accountant = await User.create({
        name: 'Accountant E2E',
        email: 'accountant@urbanfurniture.com',
        password: 'AccountantPassword123!',
        role: 'accountant'
      });
    }
    const accountantToken = accountant.generateAuthToken();

    let contactUser = await User.findOne({ email: 'contact@urbanfurniture.com' });
    if (!contactUser) {
      contactUser = await User.create({
        name: 'Contact E2E',
        email: 'contact@urbanfurniture.com',
        password: 'ContactPassword123!',
        role: 'contact'
      });
    }
    const contactToken = contactUser.generateAuthToken();

    assert('Admin token obtained', Boolean(adminToken));
    assert('Accountant token obtained', Boolean(accountantToken));
    assert('Contact token obtained', Boolean(contactToken));

    // -------------------------------------------------------------
    // WORKFLOW 1: FULL PROCUREMENT PIPELINE WITH INVENTORY & AP
    // PO -> Confirm -> Goods Receipt -> Stock + -> Bill -> Payment
    // -------------------------------------------------------------
    console.log('\n========================================================================');
    console.log(' WORKFLOW 1: FULL PROCUREMENT PIPELINE & STOCK INCREMENT (AP)           ');
    console.log('========================================================================');

    // 1.1 Create Vendor
    const vendorRes = await request('POST', '/contacts', {
      name: 'E2E Timber Supplier Ltd',
      type: 'Vendor',
      email: 'supplies@e2etimber.com',
      mobile: '+91 98765 00001',
      address: { street: '12 Timber Way', city: 'Jodhpur', state: 'Rajasthan', pincode: '342001' }
    }, adminToken);
    assert('1.1 Create Vendor contact (201)', vendorRes.status === 201 && vendorRes.data.contact?._id);
    const vendorId = vendorRes.data.contact._id;

    // 1.2 Create Product for Procurement
    const prodRes = await request('POST', '/products', {
      name: 'E2E Teak Credenza ' + Date.now(),
      type: 'Goods',
      salesPrice: 50000,
      costPrice: 30000,
      category: 'Storage',
      taxPercent: 5,
      currentStock: 5 // initial baseline stock
    }, adminToken);
    assert('1.2 Create Product with baseline stock (201)', prodRes.status === 201 && prodRes.data.product?.currentStock === 5);
    const productId = prodRes.data.product._id;

    // 1.3 Create Purchase Order (Draft)
    const poRes = await request('POST', '/purchase-orders', {
      orderNumber: `PO-E2E-${Date.now().toString().slice(-5)}`,
      vendor: vendorId,
      orderDate: new Date(),
      items: [
        {
          product: productId,
          quantity: 10,
          unitPrice: 30000,
          subtotal: 300000
        }
      ],
      totalAmount: 300000
    }, accountantToken);
    assert('1.3 Create draft Purchase Order (201)', poRes.status === 201 && poRes.data.purchaseOrder?.status === 'draft');
    const poId = poRes.data.purchaseOrder._id;

    // 1.4 Confirm Purchase Order
    const poConfirmRes = await request('POST', `/purchase-orders/${poId}/confirm`, null, accountantToken);
    assert('1.4 Confirm Purchase Order (200)', poConfirmRes.status === 200 && poConfirmRes.data.purchaseOrder?.status === 'confirmed');

    // 1.5 Create Goods Receipt (Admin only)
    const grNumber = `GR-E2E-${Date.now().toString().slice(-5)}`;
    const grRes = await request('POST', '/goods-receipts', {
      receiptNumber: grNumber,
      purchaseOrder: poId,
      vendor: vendorId,
      receiptDate: new Date(),
      items: [
        {
          product: productId,
          quantity: 10,
          unitPrice: 30000,
          totalPrice: 300000
        }
      ],
      totalAmount: 300000
    }, adminToken);
    assert('1.5 Create Goods Receipt as Admin (201)', grRes.status === 201 && grRes.data.goodsReceipt?.status === 'draft');
    const grId = grRes.data.goodsReceipt._id;

    // Verify stock BEFORE confirmation is still 5
    const prodBefore = await Product.findById(productId);
    assert('1.6 Stock before GR confirmation unchanged (5 units)', prodBefore.currentStock === 5);

    // 1.7 Confirm Goods Receipt (Accountant processing warehouse intake)
    const grConfirmRes = await request('POST', `/goods-receipts/${grId}/confirm`, null, accountantToken);
    assert('1.7 Confirm Goods Receipt as Accountant (200)', grConfirmRes.status === 200 && grConfirmRes.data.goodsReceipt?.status === 'received');

    // 1.8 Verify Stock AFTER confirmation: 5 baseline + 10 received = 15 units!
    const prodAfter = await Product.findById(productId);
    assert('1.8 Inventory stock atomically incremented (+10 units => 15)', prodAfter.currentStock === 15);

    // 1.9 Verify PO status updated to 'received'
    const poUpdated = await PurchaseOrder.findById(poId);
    assert('1.9 Parent Purchase Order updated to received status', poUpdated.status === 'received');

    // 1.10 Convert to Vendor Bill & Post
    const billNumber = `BILL-E2E-${Date.now().toString().slice(-5)}`;
    const billRes = await request('POST', '/vendor-bills', {
      billNumber,
      vendor: vendorId,
      purchaseOrder: poId,
      billDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 86400000),
      items: [
        {
          product: productId,
          quantity: 10,
          unitPrice: 30000,
          subtotal: 300000
        }
      ],
      totalAmount: 300000
    }, accountantToken);
    assert('1.10 Create Vendor Bill (201)', billRes.status === 201 && billRes.data.vendorBill?._id);
    const billId = billRes.data.vendorBill._id;

    // Check Creditors balance before post
    const creditorsAccBefore = await Account.findOne({ name: 'Creditors' });
    const credBalBefore = creditorsAccBefore?.balance || 0;

    // Post Vendor Bill
    const billPostRes = await request('POST', `/vendor-bills/${billId}/post`, null, accountantToken);
    assert('1.11 Auto-post Vendor Bill (200 & balanced JE generated)', billPostRes.status === 200 && billPostRes.data.vendorBill?.status === 'posted');

    // Verify Creditors balance increased by 300,000
    const creditorsAccAfter = await Account.findOne({ name: 'Creditors' });
    const credDelta = (creditorsAccAfter?.balance || 0) - credBalBefore;
    assert('1.12 Accounts Payable (Creditors) increased by Bill amount (+300,000)', Math.abs(credDelta - 300000) < 0.01);

    // 1.13 Disburse Payment for Vendor Bill
    const bankAcc = await Account.findOne({ name: 'Bank' });
    const bankBalBeforePay = bankAcc?.balance || 0;

    const payOutRes = await request('POST', '/payments', {
      paymentNumber: `PAY-OUT-${Date.now().toString().slice(-5)}`,
      paymentType: 'send_money',
      partner: vendorId,
      paymentDate: new Date(),
      amount: 300000,
      paymentMethod: 'Bank',
      vendorBill: billId
    }, accountantToken);
    assert('1.13 Disburse full Vendor Bill Payment (201)', payOutRes.status === 201 && payOutRes.data.payment?.status === 'posted');

    // Verify Bill is now paid
    const billPaid = await VendorBill.findById(billId);
    assert('1.14 Vendor Bill status marked as paid with full settlement', billPaid.status === 'paid' && billPaid.paidAmount === 300000);

    // Verify Bank balance decreased and Creditors liability cleared
    const bankAccAfterPay = await Account.findOne({ name: 'Bank' });
    const bankDelta = bankBalBeforePay - (bankAccAfterPay?.balance || 0);
    assert('1.15 Bank Asset reduced by disbursement (-300,000)', Math.abs(bankDelta - 300000) < 0.01);

    const creditorsAccFinal = await Account.findOne({ name: 'Creditors' });
    assert('1.16 Creditors Liability cleared back to pre-bill balance', Math.abs(creditorsAccFinal.balance - credBalBefore) < 0.01);

    // -------------------------------------------------------------
    // WORKFLOW 2: FULL SALES PIPELINE WITH INVENTORY & AR
    // SO -> Confirm -> Sales Receipt -> Stock - -> Invoice -> Payment
    // -------------------------------------------------------------
    console.log('\n========================================================================');
    console.log(' WORKFLOW 2: FULL SALES PIPELINE & STOCK DECREMENT (AR)                 ');
    console.log('========================================================================');

    // 2.1 Create Customer
    const custRes = await request('POST', '/contacts', {
      name: 'E2E Royal Residences',
      type: 'Customer',
      email: 'concierge@royalresidences.com',
      mobile: '+91 98765 00002',
      address: { street: '1 Palace Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' }
    }, adminToken);
    assert('2.1 Create Customer contact (201)', custRes.status === 201 && custRes.data.contact?._id);
    const customerId = custRes.data.contact._id;

    // 2.2 Create Sales Order (Draft) for 3 units of our product
    const soRes = await request('POST', '/sales-orders', {
      orderNumber: `SO-E2E-${Date.now().toString().slice(-5)}`,
      customer: customerId,
      orderDate: new Date(),
      items: [
        {
          product: productId,
          quantity: 3,
          unitPrice: 50000,
          taxPercent: 5,
          taxAmount: 7500,
          subtotal: 157500
        }
      ],
      untaxedAmount: 150000,
      taxAmount: 7500,
      totalAmount: 157500
    }, accountantToken);
    assert('2.2 Create draft Sales Order (201)', soRes.status === 201 && soRes.data.salesOrder?.status === 'draft');
    const soId = soRes.data.salesOrder._id;

    // 2.3 Confirm Sales Order
    const soConfirmRes = await request('POST', `/sales-orders/${soId}/confirm`, null, accountantToken);
    assert('2.3 Confirm Sales Order (200)', soConfirmRes.status === 200 && soConfirmRes.data.salesOrder?.status === 'confirmed');

    // 2.4 Create Sales Receipt / Delivery Note (Admin only)
    const srNumber = `SR-E2E-${Date.now().toString().slice(-5)}`;
    const srRes = await request('POST', '/sales-receipts', {
      receiptNumber: srNumber,
      salesOrder: soId,
      customer: customerId,
      receiptDate: new Date(),
      items: [
        {
          product: productId,
          quantity: 3,
          unitPrice: 50000,
          totalPrice: 150000
        }
      ],
      totalAmount: 150000
    }, adminToken);
    assert('2.4 Create Sales Receipt delivery note (201)', srRes.status === 201 && srRes.data.salesReceipt?.status === 'draft');
    const srId = srRes.data.salesReceipt._id;

    // Stock before delivery is 15
    const prodBeforeDelivery = await Product.findById(productId);
    assert('2.5 Stock before delivery confirmed is 15 units', prodBeforeDelivery.currentStock === 15);

    // 2.6 Confirm Sales Receipt / Dispatch goods
    const srConfirmRes = await request('POST', `/sales-receipts/${srId}/confirm`, null, accountantToken);
    assert('2.6 Confirm Sales Receipt delivery as Accountant (200)', srConfirmRes.status === 200 && srConfirmRes.data.salesReceipt?.status === 'delivered');

    // 2.7 Verify Stock AFTER delivery: 15 - 3 = 12 units!
    const prodAfterDelivery = await Product.findById(productId);
    assert('2.7 Inventory stock atomically decremented (-3 units => 12)', prodAfterDelivery.currentStock === 12);

    // 2.8 Verify SO status updated to 'delivered'
    const soUpdated = await SalesOrder.findById(soId);
    assert('2.8 Parent Sales Order updated to delivered status', soUpdated.status === 'delivered');

    // 2.9 Generate Customer Invoice & Post
    const invNumber = `INV-E2E-${Date.now().toString().slice(-5)}`;
    const invRes = await request('POST', '/customer-invoices', {
      invoiceNumber: invNumber,
      customer: customerId,
      salesOrder: soId,
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 15 * 86400000),
      items: [
        {
          product: productId,
          quantity: 3,
          unitPrice: 50000,
          taxPercent: 5,
          taxAmount: 7500,
          subtotal: 157500
        }
      ],
      untaxedAmount: 150000,
      taxAmount: 7500,
      totalAmount: 157500
    }, accountantToken);
    assert('2.9 Create Customer Invoice (201)', invRes.status === 201 && invRes.data.customerInvoice?._id);
    const invId = invRes.data.customerInvoice._id;

    // Check Debtors balance before post
    const debtorsAccBefore = await Account.findOne({ name: 'Debtors' });
    const debtBalBefore = debtorsAccBefore?.balance || 0;

    // Post Customer Invoice
    const invPostRes = await request('POST', `/customer-invoices/${invId}/post`, null, accountantToken);
    assert('2.10 Auto-post Customer Invoice (200 & balanced JE generated)', invPostRes.status === 200 && invPostRes.data.customerInvoice?.status === 'posted');

    // Verify Debtors balance increased by 157,500
    const debtorsAccAfter = await Account.findOne({ name: 'Debtors' });
    const debtDelta = (debtorsAccAfter?.balance || 0) - debtBalBefore;
    assert('2.11 Accounts Receivable (Debtors) increased by Invoice total (+157,500)', Math.abs(debtDelta - 157500) < 0.01);

    // 2.12 Receive Customer Payment
    const cashAcc = await Account.findOne({ name: 'Petty Cash' });
    const cashBalBefore = cashAcc?.balance || 0;

    const payInRes = await request('POST', '/payments', {
      paymentNumber: `PAY-IN-${Date.now().toString().slice(-5)}`,
      paymentType: 'receive_money',
      partner: customerId,
      paymentDate: new Date(),
      amount: 157500,
      paymentMethod: 'Cash',
      customerInvoice: invId
    }, accountantToken);
    assert('2.12 Receive full Customer Payment (201)', payInRes.status === 201 && payInRes.data.payment?.status === 'posted');

    // Verify Invoice marked as paid
    const invPaid = await CustomerInvoice.findById(invId);
    assert('2.13 Customer Invoice status marked as paid with full settlement', invPaid.status === 'paid' && invPaid.paidAmount === 157500);

    // Verify Cash asset increased and Debtors asset cleared
    const cashAccAfter = await Account.findOne({ name: 'Petty Cash' });
    const cashDelta = (cashAccAfter?.balance || 0) - cashBalBefore;
    assert('2.14 Cash Asset increased by inflow (+157,500)', Math.abs(cashDelta - 157500) < 0.01);

    const debtorsAccFinal = await Account.findOne({ name: 'Debtors' });
    assert('2.15 Debtors Asset cleared back to pre-invoice balance', Math.abs(debtorsAccFinal.balance - debtBalBefore) < 0.01);

    // -------------------------------------------------------------
    // WORKFLOW 3: MANUAL JOURNAL ENTRY INVARIANTS & REVERSALS
    // -------------------------------------------------------------
    console.log('\n========================================================================');
    console.log(' WORKFLOW 3: MANUAL JOURNAL ENTRY INVARIANTS & REVERSALS                ');
    console.log('========================================================================');

    const genJournal = await Journal.findOne({ type: 'General' });
    const bankAccRef = await Account.findOne({ name: 'Bank' });
    const capitalAccRef = await Account.findOne({ name: 'Capital' });

    // 3.1 Unbalanced Entry Rejection
    const unbalJeRes = await request('POST', '/journal-entries', {
      journal: genJournal._id,
      date: new Date(),
      reference: 'Unbalanced Test Entry',
      items: [
        { account: bankAccRef._id, debit: 50000, credit: 0 },
        { account: capitalAccRef._id, debit: 0, credit: 40000 } // unbalance of 10,000
      ]
    }, accountantToken);
    assert('3.1 Create draft unbalanced entry (201 draft stored)', unbalJeRes.status === 201);
    const unbalId = unbalJeRes.data.journalEntry._id;

    const unbalPostRes = await request('POST', `/journal-entries/${unbalId}/post`, null, accountantToken);
    assert('3.2 Posting unbalanced entry strictly rejected (400 Bad Request)', unbalPostRes.status === 400);

    // 3.3 Create Balanced 2-Leg Entry: Owner Injects 1,00,000 Capital
    const balJeRes = await request('POST', '/journal-entries', {
      journal: genJournal._id,
      date: new Date(),
      reference: 'Owner Capital Injection E2E',
      items: [
        { account: bankAccRef._id, label: 'Capital Cash Inflow', debit: 100000, credit: 0 },
        { account: capitalAccRef._id, label: 'Owner Equity Addition', debit: 0, credit: 100000 }
      ]
    }, accountantToken);
    assert('3.3 Create balanced draft Journal Entry (201)', balJeRes.status === 201);
    const balId = balJeRes.data.journalEntry._id;

    const bankBeforeManual = (await Account.findById(bankAccRef._id)).balance;
    const capitalBeforeManual = (await Account.findById(capitalAccRef._id)).balance;

    // Post Entry
    const balPostRes = await request('POST', `/journal-entries/${balId}/post`, null, accountantToken);
    assert('3.4 Post balanced Journal Entry (200)', balPostRes.status === 200 && balPostRes.data.journalEntry?.status === 'posted');

    // Verify Ledger Balances
    const bankAfterManual = (await Account.findById(bankAccRef._id)).balance;
    const capitalAfterManual = (await Account.findById(capitalAccRef._id)).balance;
    assert('3.5 Bank asset balance increased by +100,000', Math.abs((bankAfterManual - bankBeforeManual) - 100000) < 0.01);
    assert('3.6 Capital equity balance increased by +100,000', Math.abs((capitalAfterManual - capitalBeforeManual) - 100000) < 0.01);

    // 3.7 Idempotency / Double-post guard
    const rePostRes = await request('POST', `/journal-entries/${balId}/post`, null, accountantToken);
    assert('3.7 Double-post on already-posted entry rejected (400)', rePostRes.status === 400);

    // 3.8 Cancel Posted Entry (Reversal)
    const cancelRes = await request('POST', `/journal-entries/${balId}/cancel`, null, accountantToken);
    assert('3.8 Cancel posted journal entry (200 & reversed)', cancelRes.status === 200 && cancelRes.data.journalEntry?.status === 'cancelled');

    // Verify Ledger Balances exactly returned to pre-injection levels
    const bankAfterCancel = (await Account.findById(bankAccRef._id)).balance;
    const capitalAfterCancel = (await Account.findById(capitalAccRef._id)).balance;
    assert('3.9 Bank asset reversed back to baseline net delta = 0', Math.abs(bankAfterCancel - bankBeforeManual) < 0.01);
    assert('3.10 Capital equity reversed back to baseline net delta = 0', Math.abs(capitalAfterCancel - capitalBeforeManual) < 0.01);

    // -------------------------------------------------------------
    // WORKFLOW 4: FINANCIAL STATEMENTS & STOCK VALUATION TELEMETRY
    // -------------------------------------------------------------
    console.log('\n========================================================================');
    console.log(' WORKFLOW 4: FINANCIAL STATEMENTS & STOCK VALUATION TELEMETRY           ');
    console.log('========================================================================');

    // 4.1 Profit & Loss Report
    const pnlRes = await request('GET', '/reports/profit-loss', null, accountantToken);
    const pnl = pnlRes.data?.report;
    assert('4.1 P&L Report returns 200 OK', pnlRes.status === 200 && pnl?.income);
    const computedGross = Math.round((pnl.income.total - pnl.expenses.purchasesExpense) * 100) / 100;
    assert('4.2 P&L Gross Profit equation holds (Income - PurchasesExpense)', Math.abs(pnl.summary.grossProfit - computedGross) < 0.01);
    const computedNet = Math.round((pnl.income.total - pnl.expenses.total) * 100) / 100;
    assert('4.3 P&L Net Profit equation holds (Income - TotalExpenses)', Math.abs(pnl.summary.netProfit - computedNet) < 0.01);

    // 4.4 Balance Sheet Report Equation Verification
    const bsRes = await request('GET', '/reports/balance-sheet', null, accountantToken);
    const bs = bsRes.data?.report;
    assert('4.4 Balance Sheet Report returns 200 OK', bsRes.status === 200 && bs?.assets);
    assert('4.5 Balance Sheet Equation holds: Total Assets == Total Liab + Equity', bs?.summary?.isBalanced === true, `Assets: ${bs?.summary?.totalAssets}, Liab+Equity: ${bs?.summary?.totalLiabilitiesAndEquity}`);

    // 4.6 Stock Valuation Report Verification
    const stockRes = await request('GET', '/reports/stock', null, accountantToken);
    const stockReport = stockRes.data?.report;
    assert('4.6 Stock Valuation Report returns 200 OK', stockRes.status === 200 && Array.isArray(stockReport?.items));

    // Check that our newly created product shows 12 units on hand in the stock valuation report
    const e2eStockItem = stockReport?.items?.find(it => it.productId.toString() === productId.toString());
    assert('4.7 E2E Product present in Stock Valuation report', Boolean(e2eStockItem));
    assert('4.8 Stock Valuation shows exact 12 units on hand (15 in - 3 out)', e2eStockItem?.onHandQty === 12);
    assert('4.9 Line valuation equals 12 * 30,000 cost = 360,000', e2eStockItem?.valuation === 360000);

    // Check totals
    let expectedUnits = 0;
    let expectedVal = 0;
    for (const it of stockReport?.items || []) {
      expectedUnits += it.onHandQty;
      expectedVal += it.valuation;
    }
    assert('4.10 Total units on hand equals sum of line item quantities', stockReport?.totalUnitsOnHand === expectedUnits);
    assert('4.11 Total inventory valuation equals sum of line valuations', Math.abs(stockReport?.totalInventoryValuation - expectedVal) < 0.01);

    // 4.12 Budget Report
    const budgetRes = await request('GET', '/reports/budget', null, accountantToken);
    const budgetReport = budgetRes.data?.report;
    assert('4.12 Budget Report returns 200 OK', budgetRes.status === 200 && Array.isArray(budgetReport?.budgets));
    let calcPlanned = 0;
    let calcActual = 0;
    for (const b of budgetReport?.budgets || []) {
      calcPlanned += b.plannedAmount;
      calcActual += b.actualAmount;
    }
    assert('4.13 Budget Total Planned equals sum of line allocations', Math.abs(budgetReport?.totalPlanned - calcPlanned) < 0.01);
    assert('4.14 Budget Total Actual equals sum of posted analytic expenditures', Math.abs(budgetReport?.totalActual - calcActual) < 0.01);

    // -------------------------------------------------------------
    // WORKFLOW 5: STOREFRONT PUBLIC CONCIERGE & HELP LIFECYCLE
    // -------------------------------------------------------------
    console.log('\n========================================================================');
    console.log(' WORKFLOW 5: STOREFRONT & CONCIERGE MODULE INTEGRATION                  ');
    console.log('========================================================================');

    // 5.1 Book Showroom Tour
    const tourRes = await request('POST', '/showrooms/book-tour', {
      showroom: 'South Mumbai Marine Atelier',
      name: 'Rohan Deshmukh',
      email: 'rohan.d@luxuryestates.in',
      phone: '+91 99200 11223',
      date: '2026-09-18',
      timeSlot: '02:30 PM - 04:00 PM',
      guests: '2 Guests',
      notes: 'Penthouse master suite specification session'
    });
    const booking = tourRes.data?.booking;
    assert('5.1 Public Tour booking creates record with booking code (201)', tourRes.status === 201 && booking?.bookingCode?.startsWith('UF-TOUR-'));
    const tourId = booking?._id;

    // Update status to completed
    const tourStatusRes = await request('PATCH', `/showrooms/bookings/${tourId}/status`, { status: 'completed' }, accountantToken);
    assert('5.2 Tour status updated to completed via PATCH (200)', tourStatusRes.status === 200 && tourStatusRes.data?.booking?.status === 'completed');

    // 5.3 Submit Helpdesk Ticket
    const ticketRes = await request('POST', '/helpdesk/tickets', {
      name: 'Pooja Agarwal',
      email: 'pooja@designatelier.co',
      subject: 'Inquiry regarding White Oak Credenza hardware batch',
      category: 'Inquiries',
      priority: 'High',
      message: 'Requesting CAD drawing and joinery detail sheet for project presentation.'
    });
    const ticket = ticketRes.data?.ticket;
    assert('5.3 Public Helpdesk ticket creates record with ticket number (201)', ticketRes.status === 201 && (ticket?.ticketNumber?.startsWith('TKT-') || ticket?.ticketNumber?.startsWith('UF-TKT-')));
    const ticketId = ticket?._id;

    // Update ticket status
    const ticketStatusRes = await request('PATCH', `/helpdesk/tickets/${ticketId}/status`, { status: 'In Progress' }, accountantToken);
    assert('5.4 Ticket status transitioned to In Progress via PATCH (200)', ticketStatusRes.status === 200 && ticketStatusRes.data?.ticket?.status === 'In Progress');

    // 5.5 Submit Trade Partner Application
    const partnerRes = await request('POST', '/partners/apply', {
      studioName: 'Aura Spatial Design',
      contactPerson: 'Sanjay Singhania',
      email: 'sanjay@auraspatial.com',
      phone: '+91 98190 22334',
      city: 'Bengaluru',
      gstin: '29ABCDE1234F1Z5',
      procurementVolume: 7500000,
      website: 'https://auraspatial.com'
    });
    const partner = partnerRes.data?.partner;
    assert('5.5 Guild Partner registration creates application (201)', partnerRes.status === 201 && (partner?.partnerCode?.startsWith('UF-GUILD-') || partner?.partnerCode?.startsWith('UF-TRADE-')));
    const partnerId = partner?._id;

    // Update partner status
    const partnerStatusRes = await request('PATCH', `/partners/${partnerId}/status`, { status: 'approved' }, accountantToken);
    assert('5.6 Guild Partner approved via PATCH (200)', partnerStatusRes.status === 200 && partnerStatusRes.data?.partner?.status === 'approved');

    // 5.7 Submit Designer Inquiry
    const inqRes = await request('POST', '/inquiries/designer', {
      name: 'Sunita Kapoor',
      email: 'sunita.kapoor@kapoorgroup.in',
      phone: '+91 98220 55667',
      projectType: 'Bespoke Private Commission',
      estimatedBudget: '$50,000 - $100,000',
      message: 'Bespoke walnut credenza, custom leather sectional and marble dining set.'
    });
    const inquiry = inqRes.data?.inquiry;
    assert('5.7 Designer inquiry creates lead with inquiry number (201)', inqRes.status === 201 && inquiry?.inquiryNumber?.startsWith('INQ-'));
    const inqId = inquiry?._id;

    // Update inquiry status
    const inqStatusRes = await request('PATCH', `/inquiries/designer/${inqId}/status`, { status: 'reviewing', assignedLead: 'Senior Atelier Architect' }, accountantToken);
    assert('5.8 Designer inquiry marked reviewing with lead architect (200)', inqStatusRes.status === 200 && inqStatusRes.data?.inquiry?.status === 'reviewing');

    // -------------------------------------------------------------
    // FINAL VERDICT & SUMMARY
    // -------------------------------------------------------------
    console.log('\n========================================================================');
    console.log(` PHASE 3 E2E SMOKE TEST COMPLETE: ${passedCount} PASSED / ${failedCount} FAILED`);
    console.log('========================================================================');

    if (failedCount === 0) {
      console.log('🏆 100% PASS RATE! ALL INTEGRATION CYCLES VERIFIED SUCCESSFULLY.');
    } else {
      console.error(`⚠️ ${failedCount} ASSERTIONS FAILED.`);
    }

  } catch (err) {
    console.error('Fatal test error in Phase 3 E2E:', err);
    failedCount++;
  } finally {
    server.close();
    await mongoose.connection.close();
    process.exit(failedCount > 0 ? 1 : 0);
  }
}

runPhase3E2E();
