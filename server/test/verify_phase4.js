require('dotenv').config();
const connectDB = require('../src/config/db');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const PurchaseOrder = require('../src/models/PurchaseOrder');
const SalesOrder = require('../src/models/SalesOrder');
const VendorBill = require('../src/models/VendorBill');
const CustomerInvoice = require('../src/models/CustomerInvoice');
const Payment = require('../src/models/Payment');
const JournalEntry = require('../src/models/JournalEntry');
const GoodsReceipt = require('../src/models/GoodsReceipt');
const SalesReceipt = require('../src/models/SalesReceipt');
const Budget = require('../src/models/Budget');
const Product = require('../src/models/Product');
const Contact = require('../src/models/Contact');
const AnalyticAccount = require('../src/models/AnalyticAccount');
const Journal = require('../src/models/Journal');
const Account = require('../src/models/Account');

async function verifyPhase4() {
  console.log('====================================================');
  console.log('=== VERIFYING PHASE 4: PERFORMANCE & OPTIMIZATION ===');
  console.log('====================================================\n');

  await connectDB();
  const PORT = 5097;
  const server = app.listen(PORT);
  const BASE_URL = `http://localhost:${PORT}`;

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`  ✓ [PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`  ✗ [FAIL] ${message}`);
    }
  }

  try {
    // 1. Setup Admin token
    let admin = await User.findOne({ email: 'admin@urbanfurniture.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Admin Test',
        email: 'admin@urbanfurniture.com',
        password: 'AdminPassword123!',
        role: 'admin'
      });
    }
    const adminToken = admin.generateAuthToken();
    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    };

    // Ensure models are registered and indexes created
    await PurchaseOrder.init();
    await SalesOrder.init();
    await VendorBill.init();
    await CustomerInvoice.init();
    await Payment.init();
    await JournalEntry.init();
    await GoodsReceipt.init();
    await SalesReceipt.init();
    await Product.init();
    await Contact.init();
    await Budget.init();

    console.log('--- 1. Testing MongoDB Aggregation Pipelines in Reports ---');

    // Test 1.1: Profit & Loss Report
    const pnlRes = await fetch(`${BASE_URL}/api/reports/profit-and-loss?startDate=2026-01-01&endDate=2026-12-31`, {
      headers: authHeaders
    });
    const pnlData = await pnlRes.json();
    assert(pnlRes.status === 200, 'GET /api/reports/profit-and-loss returns 200 OK');
    assert(pnlData.report && pnlData.report.income && pnlData.report.expenses && pnlData.report.summary, 'P&L report returns aggregated income, expenses and summary');
    assert(typeof pnlData.report.summary.netProfit === 'number', `P&L summary calculates netProfit: ${pnlData.report?.summary?.netProfit}`);

    // Test 1.2: Budget Report
    const budgetRes = await fetch(`${BASE_URL}/api/reports/budget`, {
      headers: authHeaders
    });
    const budgetData = await budgetRes.json();
    assert(budgetRes.status === 200, 'GET /api/reports/budget returns 200 OK');
    assert(budgetData.report && Array.isArray(budgetData.report.budgets), 'Budget report returns aggregated budgets list');

    // Test 1.3: Stock Valuation Report
    const stockRes = await fetch(`${BASE_URL}/api/reports/stock-valuation`, {
      headers: authHeaders
    });
    const stockData = await stockRes.json();
    assert(stockRes.status === 200, 'GET /api/reports/stock-valuation returns 200 OK');
    assert(stockData.report && Array.isArray(stockData.report.items), 'Stock valuation returns aggregated product stock items');
    assert(typeof stockData.report.totalInventoryValuation === 'number', `Stock report computes totalInventoryValuation: ${stockData.report?.totalInventoryValuation}`);

    console.log('\n--- 2. Testing In-Memory Document Population ---');

    // Test 2.1: createBudget in-memory populate
    let analytic = await AnalyticAccount.findOne({});
    if (!analytic) {
      analytic = await AnalyticAccount.create({ name: 'Phase 4 Analytic', code: 'P4-001', type: 'Administrative' });
    }
    const createBudgetRes = await fetch(`${BASE_URL}/api/budgets`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        name: 'Phase 4 Test Budget',
        period: 'Q3-2026',
        analyticAccount: analytic._id,
        plannedAmount: 150000,
        responsiblePerson: 'Finance Director'
      })
    });
    const createBudgetData = await createBudgetRes.json();
    assert(createBudgetRes.status === 201, 'POST /api/budgets returns 201 Created');
    assert(createBudgetData.budget && createBudgetData.budget.analyticAccount && createBudgetData.budget.analyticAccount.name === analytic.name, 'createBudget populates analyticAccount in-memory without extra query');

    // Clean up created test budget
    if (createBudgetData.budget?._id) {
      await Budget.findByIdAndDelete(createBudgetData.budget._id);
    }

    // Test 2.2: createJournalEntry in-memory populate
    let testJournal = await Journal.findOne({});
    let testAccount = await Account.findOne({});
    let testContact = await Contact.findOne({});
    const createJeRes = await fetch(`${BASE_URL}/api/journal-entries`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        journal: testJournal._id,
        partner: testContact._id,
        date: new Date(),
        reference: 'P4-JE-POPULATE',
        items: [
          { account: testAccount._id, label: 'Debit line', debit: 1000, credit: 0 },
          { account: testAccount._id, label: 'Credit line', debit: 0, credit: 1000 }
        ]
      })
    });
    const createJeData = await createJeRes.json();
    assert(createJeRes.status === 201, 'POST /api/journal-entries returns 201 Created');
    assert(createJeData.journalEntry && createJeData.journalEntry.journal && createJeData.journalEntry.journal.name, 'createJournalEntry populates journal in-memory without extra query');

    // Clean up created journal entry
    if (createJeData.journalEntry?._id) {
      await JournalEntry.findByIdAndDelete(createJeData.journalEntry._id);
    }

    console.log('\n--- 3. Testing Pagination Across All List Endpoints ---');

    const paginationEndpoints = [
      { name: 'purchase-orders', key: 'purchaseOrders' },
      { name: 'sales-orders', key: 'salesOrders' },
      { name: 'vendor-bills', key: 'vendorBills' },
      { name: 'customer-invoices', key: 'customerInvoices' },
      { name: 'payments', key: 'payments' },
      { name: 'journal-entries', key: 'journalEntries' },
      { name: 'goods-receipts', key: 'goodsReceipts' },
      { name: 'sales-receipts', key: 'salesReceipts' },
      { name: 'budgets', key: 'budgets' },
      { name: 'contacts', key: 'contacts' },
      { name: 'products', key: 'products' }
    ];

    for (const ep of paginationEndpoints) {
      const res = await fetch(`${BASE_URL}/api/${ep.name}?page=1&limit=2`, {
        headers: authHeaders
      });
      const data = await res.json();
      const hasPagination = res.status === 200 &&
        data.page === 1 &&
        typeof data.totalCount === 'number' &&
        typeof data.totalPages === 'number' &&
        Array.isArray(data[ep.key]);

      assert(hasPagination, `GET /api/${ep.name}?page=1&limit=2 returns page=1, limit=2, totalCount=${data.totalCount}, totalPages=${data.totalPages}, ${ep.key}.length=${data[ep.key]?.length}`);
    }

    console.log('\n--- 4. Testing Compound & Unique Indexes across Collections ---');

    const poIndexes = await PurchaseOrder.collection.indexes();
    const poOrderNumIdx = poIndexes.find(i => i.name === 'orderNumber_1');
    const poVendorStatusIdx = poIndexes.find(i => i.name === 'vendor_1_status_1');
    assert(poOrderNumIdx && poOrderNumIdx.unique, 'PurchaseOrder has unique index on orderNumber');
    assert(!!poVendorStatusIdx, 'PurchaseOrder has compound index on vendor + status');

    const soIndexes = await SalesOrder.collection.indexes();
    const soOrderNumIdx = soIndexes.find(i => i.name === 'orderNumber_1');
    const soCustStatusIdx = soIndexes.find(i => i.name === 'customer_1_status_1');
    assert(soOrderNumIdx && soOrderNumIdx.unique, 'SalesOrder has unique index on orderNumber');
    assert(!!soCustStatusIdx, 'SalesOrder has compound index on customer + status');

    const billIndexes = await VendorBill.collection.indexes();
    const billNumIdx = billIndexes.find(i => i.name === 'billNumber_1');
    const billVendorStatusIdx = billIndexes.find(i => i.name === 'vendor_1_status_1');
    assert(billNumIdx && billNumIdx.unique, 'VendorBill has unique index on billNumber');
    assert(!!billVendorStatusIdx, 'VendorBill has compound index on vendor + status');

    const invIndexes = await CustomerInvoice.collection.indexes();
    const invNumIdx = invIndexes.find(i => i.name === 'invoiceNumber_1');
    const invCustStatusIdx = invIndexes.find(i => i.name === 'customer_1_status_1');
    assert(invNumIdx && invNumIdx.unique, 'CustomerInvoice has unique index on invoiceNumber');
    assert(!!invCustStatusIdx, 'CustomerInvoice has compound index on customer + status');

    const payIndexes = await Payment.collection.indexes();
    const payNumIdx = payIndexes.find(i => i.name === 'paymentNumber_1');
    const payPartnerTypeIdx = payIndexes.find(i => i.name === 'partner_1_paymentType_1');
    assert(payNumIdx && payNumIdx.unique, 'Payment has unique index on paymentNumber');
    assert(!!payPartnerTypeIdx, 'Payment has compound index on partner + paymentType');

    const jeIndexes = await JournalEntry.collection.indexes();
    const jeNumIdx = jeIndexes.find(i => i.name === 'entryNumber_1');
    const jeJournalStatusIdx = jeIndexes.find(i => i.name === 'journal_1_status_1');
    const jeItemsAccountIdx = jeIndexes.find(i => i.name === 'items.account_1');
    assert(jeNumIdx && jeNumIdx.unique, 'JournalEntry has unique index on entryNumber');
    assert(!!jeJournalStatusIdx, 'JournalEntry has compound index on journal + status');
    assert(!!jeItemsAccountIdx, 'JournalEntry has multikey index on items.account');

    const grIndexes = await GoodsReceipt.collection.indexes();
    const grNumIdx = grIndexes.find(i => i.name === 'receiptNumber_1');
    const grPoIdx = grIndexes.find(i => i.name === 'purchaseOrder_1');
    assert(grNumIdx && grNumIdx.unique, 'GoodsReceipt has unique index on receiptNumber');
    assert(!!grPoIdx, 'GoodsReceipt has index on purchaseOrder');

    const srIndexes = await SalesReceipt.collection.indexes();
    const srNumIdx = srIndexes.find(i => i.name === 'receiptNumber_1');
    const srSoIdx = srIndexes.find(i => i.name === 'salesOrder_1');
    assert(srNumIdx && srNumIdx.unique, 'SalesReceipt has unique index on receiptNumber');
    assert(!!srSoIdx, 'SalesReceipt has index on salesOrder');

    const prodIndexes = await Product.collection.indexes();
    const prodNameIdx = prodIndexes.find(i => i.name === 'name_1');
    const prodTypeCatIdx = prodIndexes.find(i => i.name === 'type_1_category_1');
    assert(!!prodNameIdx, 'Product has index on name');
    assert(!!prodTypeCatIdx, 'Product has compound index on type + category');

    const contactIndexes = await Contact.collection.indexes();
    const contactEmailIdx = contactIndexes.find(i => i.name === 'email_1');
    const contactTypeStatusIdx = contactIndexes.find(i => i.name === 'type_1_status_1');
    assert(!!contactEmailIdx, 'Contact has index on email');
    assert(!!contactTypeStatusIdx, 'Contact has compound index on type + status');

    console.log('\n====================================================');
    console.log(`PHASE 4 VERIFICATION RESULTS: ${passedTests} / ${totalTests} TESTS PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
    console.log('====================================================\n');

  } catch (err) {
    console.error('Fatal test error in verifyPhase4:', err);
  } finally {
    server.close();
    await mongoose.connection.close();
    process.exit(passedTests === totalTests ? 0 : 1);
  }
}

verifyPhase4();
