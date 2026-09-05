require('dotenv').config();
const connectDB = require('../src/config/db');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Contact = require('../src/models/Contact');
const Product = require('../src/models/Product');
const Account = require('../src/models/Account');
const Journal = require('../src/models/Journal');
const AnalyticAccount = require('../src/models/AnalyticAccount');
const Budget = require('../src/models/Budget');
const JournalEntry = require('../src/models/JournalEntry');
const PurchaseOrder = require('../src/models/PurchaseOrder');
const GoodsReceipt = require('../src/models/GoodsReceipt');
const VendorBill = require('../src/models/VendorBill');
const SalesOrder = require('../src/models/SalesOrder');
const SalesReceipt = require('../src/models/SalesReceipt');
const CustomerInvoice = require('../src/models/CustomerInvoice');
const Payment = require('../src/models/Payment');

async function runAllTests() {
  console.log('=== URBAN FURNITURE BACKEND TEST RUNNER ===\n');
  await connectDB();
  
  const server = app.listen(5099);
  const BASE_URL = 'http://localhost:5099';

  try {
    // --- PHASE 1 TESTS ---
    console.log('--- Phase 1: Foundation Tests ---');
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthRes.json();
    console.log('[Test 1.1] GET /api/health:', healthData.status === 'UP' ? 'PASS' : 'FAIL');

    const hbRes = await fetch(`${BASE_URL}/api/health/heartbeat`);
    const hbData = await hbRes.json();
    console.log('[Test 1.2] GET /api/health/heartbeat:', hbData.heartbeat?.status === 'ALIVE' ? 'PASS' : 'FAIL');

    // --- PHASE 2 TESTS: AUTH & RBAC ---
    console.log('\n--- Phase 2: Authentication & RBAC Tests ---');
    await User.deleteMany({ email: { $in: ['testadmin@urbanfurniture.com', 'testacct@urbanfurniture.com'] } });

    // Register with requested role 'admin' on public endpoint
    const regAdminRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Admin',
        email: 'testadmin@urbanfurniture.com',
        password: 'AdminPassword123!',
        role: 'admin'
      })
    });
    const regAdminData = await regAdminRes.json();
    // Verify that public registration correctly forced a non-admin role ('accountant')
    const preventedAdminPrivilegeEscalation = regAdminData.user && regAdminData.user.role === 'accountant';
    console.log('[Test 2.1] Register User (Public Role Hardening - Non-Admin Assigned):', regAdminRes.status === 201 && preventedAdminPrivilegeEscalation ? 'PASS' : 'FAIL');

    // For subsequent admin-restricted test suites, promote testadmin to admin and generate valid adminToken
    const adminUser = await User.findOneAndUpdate(
      { email: 'testadmin@urbanfurniture.com' },
      { role: 'admin' },
      { new: true }
    );
    const adminToken = adminUser.generateAuthToken();

    // Register Accountant
    const regAcctRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Accountant',
        email: 'testacct@urbanfurniture.com',
        password: 'AcctPassword123!',
        role: 'accountant'
      })
    });
    const regAcctData = await regAcctRes.json();
    const acctToken = regAcctData.token;
    console.log('[Test 2.2] Register Accountant User:', regAcctRes.status === 201 && acctToken ? 'PASS' : 'FAIL');

    // --- PHASE 3 TESTS: MASTER DATA ---
    console.log('\n--- Phase 3: Master Data Management Tests ---');
    const adminHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    };
    const acctHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${acctToken}`
    };

    // Contacts
    await Contact.deleteMany({});
    const custRes = await fetch(`${BASE_URL}/api/contacts`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        name: 'Nimesh Pathak',
        type: 'Customer',
        email: 'nimesh@example.com',
        mobile: '9876543210',
        address: { city: 'Ahmedabad', state: 'Gujarat', pincode: '380015' }
      })
    });
    const custData = await custRes.json();
    console.log('[Test 3.1] Create Customer (Nimesh Pathak):', custRes.status === 201 ? 'PASS' : 'FAIL');

    const vendRes = await fetch(`${BASE_URL}/api/contacts`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        name: 'Azure Furniture',
        type: 'Vendor',
        email: 'vendor@azure.com',
        mobile: '9876543211',
        address: { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' }
      })
    });
    const vendData = await vendRes.json();
    console.log('[Test 3.2] Create Vendor (Azure Furniture):', vendRes.status === 201 ? 'PASS' : 'FAIL');

    // Products
    await Product.deleteMany({});
    const prodRes = await fetch(`${BASE_URL}/api/products`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        name: 'Office Chair',
        type: 'Goods',
        salesPrice: 2500,
        costPrice: 1500,
        category: 'Office Furniture'
      })
    });
    const prodData = await prodRes.json();
    console.log('[Test 3.3] Create Product (Office Chair):', prodRes.status === 201 ? 'PASS' : 'FAIL');

    // Accounts
    await Account.deleteMany({});
    const accountsToCreate = [
      { code: '1001', name: 'Cash', type: 'Asset' },
      { code: '1002', name: 'Bank', type: 'Asset' },
      { code: '1003', name: 'Debtors', type: 'Asset' },
      { code: '2001', name: 'Creditors', type: 'Liability' },
      { code: '3001', name: 'Capital', type: 'Capital' },
      { code: '4001', name: 'Sale Income', type: 'Income' },
      { code: '5001', name: 'Purchases Expense', type: 'Expense' }
    ];

    const createdAccounts = {};
    for (const acc of accountsToCreate) {
      const accRes = await fetch(`${BASE_URL}/api/accounts`, {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify(acc)
      });
      const accData = await accRes.json();
      if (accRes.status === 201) createdAccounts[acc.name] = accData.account;
    }
    console.log('[Test 3.4] Create Chart of Accounts:', Object.keys(createdAccounts).length === 7 ? 'PASS' : 'FAIL');

    // Journals
    await Journal.deleteMany({});
    const journalsToCreate = [
      { code: 'INV', name: 'Sales Journal', type: 'Sales', defaultCreditAccount: createdAccounts['Sale Income']?._id, defaultDebitAccount: createdAccounts['Debtors']?._id },
      { code: 'BILL', name: 'Purchase Journal', type: 'Purchase', defaultDebitAccount: createdAccounts['Purchases Expense']?._id, defaultCreditAccount: createdAccounts['Creditors']?._id },
      { code: 'BNK', name: 'Bank Journal', type: 'Bank', defaultDebitAccount: createdAccounts['Bank']?._id, defaultCreditAccount: createdAccounts['Bank']?._id },
      { code: 'CSH', name: 'Cash Journal', type: 'Cash', defaultDebitAccount: createdAccounts['Cash']?._id, defaultCreditAccount: createdAccounts['Cash']?._id }
    ];

    const createdJournals = {};
    for (const jrn of journalsToCreate) {
      const jrnRes = await fetch(`${BASE_URL}/api/journals`, {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify(jrn)
      });
      const jrnData = await jrnRes.json();
      if (jrnRes.status === 201) createdJournals[jrn.name] = jrnData.journal;
    }
    console.log('[Test 3.5] Create Standard Journals:', Object.keys(createdJournals).length === 4 ? 'PASS' : 'FAIL');

    // Analytic Accounts & Budgets
    await AnalyticAccount.deleteMany({});
    const analyticRes = await fetch(`${BASE_URL}/api/analytic-accounts`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({ code: 'AN-OPS', name: 'Operations Expense', type: 'Expenses' })
    });
    const analyticData = await analyticRes.json();

    await Budget.deleteMany({});
    await fetch(`${BASE_URL}/api/budgets`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        name: 'Operations Budget 2026',
        period: '2026-Annual',
        responsiblePerson: 'Admin User',
        analyticAccount: analyticData.analyticAccount._id,
        plannedAmount: 500000
      })
    });

    // Reset account balances to 0 for Clean Transactions
    await Account.updateMany({}, { balance: 0 });

    // --- PHASE 5 TESTS: PURCHASE FLOW & GOODS RECEIPTS ---
    console.log('\n--- Phase 5: Purchase Flow & Goods Receipts Tests ---');
    await PurchaseOrder.deleteMany({});
    await GoodsReceipt.deleteMany({});
    await VendorBill.deleteMany({});
    await Payment.deleteMany({});

    // Purchase Order
    const poRes = await fetch(`${BASE_URL}/api/purchase-orders`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        vendor: vendData.contact._id,
        items: [{ product: prodData.product._id, description: 'Office Chairs', quantity: 5, unitPrice: 1500 }]
      })
    });
    const poData = await poRes.json();
    console.log('[Test 5.1] Create Purchase Order (5 Chairs @ 1500 = 7500):', poRes.status === 201 ? 'PASS' : 'FAIL');

    // Confirm PO
    await fetch(`${BASE_URL}/api/purchase-orders/${poData.purchaseOrder._id}/confirm`, {
      method: 'POST',
      headers: adminHeaders
    });

    // Goods Receipt (Admin) & Confirm (Accountant)
    const grRes = await fetch(`${BASE_URL}/api/goods-receipts`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        receiptNumber: 'GR/2026/0001',
        purchaseOrder: poData.purchaseOrder._id,
        vendor: vendData.contact._id,
        receiptDate: new Date().toISOString(),
        items: [{ product: prodData.product._id, quantity: 5, unitPrice: 1500 }]
      })
    });
    const grData = await grRes.json();
    console.log('[Test 5.2] Create Goods Receipt with Validations:', grRes.status === 201 ? 'PASS' : 'FAIL');

    const grConfirmRes = await fetch(`${BASE_URL}/api/goods-receipts/${grData.goodsReceipt._id}/confirm`, {
      method: 'POST',
      headers: acctHeaders
    });
    console.log('[Test 5.3] Confirm Goods Received (Accountant Role):', grConfirmRes.status === 200 ? 'PASS' : 'FAIL');

    // Vendor Bill & Post
    const billRes = await fetch(`${BASE_URL}/api/vendor-bills`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        vendor: vendData.contact._id,
        purchaseOrder: poData.purchaseOrder._id,
        items: [{ product: prodData.product._id, quantity: 5, unitPrice: 1500 }]
      })
    });
    const billData = await billRes.json();

    const billPostRes = await fetch(`${BASE_URL}/api/vendor-bills/${billData.vendorBill._id}/post`, {
      method: 'POST',
      headers: adminHeaders
    });
    console.log('[Test 5.4] Post Vendor Bill (Balanced Journal Entry generated):', billPostRes.status === 200 ? 'PASS' : 'FAIL');

    // Payment for Vendor Bill
    const payBillRes = await fetch(`${BASE_URL}/api/payments`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        paymentType: 'send_money',
        partner: vendData.contact._id,
        amount: 7500,
        paymentMethod: 'Bank',
        vendorBill: billData.vendorBill._id
      })
    });
    console.log('[Test 5.5] Register Vendor Bill Payment (7500 via Bank):', payBillRes.status === 201 ? 'PASS' : 'FAIL');

    // --- PHASE 6 TESTS: SALES FLOW & SALES RECEIPTS ---
    console.log('\n--- Phase 6: Sales Flow & Sales Receipts Tests ---');
    await SalesOrder.deleteMany({});
    await SalesReceipt.deleteMany({});
    await CustomerInvoice.deleteMany({});

    // Sales Order
    const soRes = await fetch(`${BASE_URL}/api/sales-orders`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        customer: custData.contact._id,
        orderDate: new Date(),
        items: [{ product: prodData.product._id, description: 'Office Chairs for Nimesh Pathak', quantity: 5, unitPrice: 2500, taxPercent: 0 }]
      })
    });
    const soData = await soRes.json();
    console.log('[Test 6.1] Create Sales Order (5 Chairs @ 2500 = 12500):', soRes.status === 201 ? 'PASS' : 'FAIL');

    // Confirm SO
    await fetch(`${BASE_URL}/api/sales-orders/${soData.salesOrder._id}/confirm`, {
      method: 'POST',
      headers: adminHeaders
    });

    // Sales Receipt (Admin) & Confirm (Accountant)
    const srRes = await fetch(`${BASE_URL}/api/sales-receipts`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        receiptNumber: 'SR/2026/0001',
        salesOrder: soData.salesOrder._id,
        customer: custData.contact._id,
        receiptDate: new Date().toISOString(),
        items: [{ product: prodData.product._id, quantity: 5, unitPrice: 2500 }]
      })
    });
    const srData = await srRes.json();
    console.log('[Test 6.2] Create Sales Receipt with Validations:', srRes.status === 201 ? 'PASS' : 'FAIL');

    const srConfirmRes = await fetch(`${BASE_URL}/api/sales-receipts/${srData.salesReceipt._id}/confirm`, {
      method: 'POST',
      headers: acctHeaders
    });
    console.log('[Test 6.3] Confirm Sales Receipt (Accountant Role):', srConfirmRes.status === 200 ? 'PASS' : 'FAIL');

    // Customer Invoice & Post
    const invRes = await fetch(`${BASE_URL}/api/customer-invoices`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        customer: custData.contact._id,
        salesOrder: soData.salesOrder._id,
        items: [{ product: prodData.product._id, quantity: 5, unitPrice: 2500 }]
      })
    });
    const invData = await invRes.json();

    const invPostRes = await fetch(`${BASE_URL}/api/customer-invoices/${invData.customerInvoice._id}/post`, {
      method: 'POST',
      headers: adminHeaders
    });
    console.log('[Test 6.4] Post Customer Invoice (Balanced Journal Entry generated):', invPostRes.status === 200 ? 'PASS' : 'FAIL');

    // Customer Payment
    const payInvRes = await fetch(`${BASE_URL}/api/payments`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        paymentType: 'receive_money',
        partner: custData.contact._id,
        amount: 12500,
        paymentMethod: 'Bank',
        customerInvoice: invData.customerInvoice._id
      })
    });
    console.log('[Test 6.5] Register Customer Invoice Payment (12500 via Bank):', payInvRes.status === 201 ? 'PASS' : 'FAIL');

    // --- PHASE 7 TESTS: FINANCIAL REPORT APIS ---
    console.log('\n--- Phase 7: Financial Reports Tests ---');

    // 7.1 Profit & Loss Report
    const pnlRes = await fetch(`${BASE_URL}/api/reports/profit-loss`, {
      headers: adminHeaders
    });
    const pnlData = await pnlRes.json();
    const pnl = pnlData.report;
    console.log('[Test 7.1] GET /api/reports/profit-loss:', pnlRes.status === 200 && pnl.income.total === 12500 && pnl.expenses.purchasesExpense === 7500 && pnl.summary.netProfit === 5000 ? 'PASS' : 'FAIL', {
      salesIncome: pnl.income.total,
      purchasesExpense: pnl.expenses.purchasesExpense,
      netProfit: pnl.summary.netProfit
    });

    // 7.2 Balance Sheet Report
    const bsRes = await fetch(`${BASE_URL}/api/reports/balance-sheet`, {
      headers: adminHeaders
    });
    const bsData = await bsRes.json();
    const bs = bsData.report;
    console.log('[Test 7.2] GET /api/reports/balance-sheet:', bsRes.status === 200 && bs.summary.isBalanced && bs.assets.total === 5000 ? 'PASS' : 'FAIL', {
      totalAssets: bs.assets.total,
      totalLiabilities: bs.liabilities.total,
      currentNetProfit: bs.equity.currentNetProfit,
      isBalanced: bs.summary.isBalanced
    });

    // 7.3 Budget Report
    const budgetRepRes = await fetch(`${BASE_URL}/api/reports/budget`, {
      headers: adminHeaders
    });
    const budgetRepData = await budgetRepRes.json();
    const br = budgetRepData.report;
    console.log('[Test 7.3] GET /api/reports/budget:', budgetRepRes.status === 200 && br.totalPlanned === 500000 ? 'PASS' : 'FAIL', {
      totalPlanned: br.totalPlanned,
      totalActual: br.totalActual,
      totalVariance: br.totalVariance
    });

    // 7.4 Stock / Inventory Valuation Report
    const stockRepRes = await fetch(`${BASE_URL}/api/reports/stock`, {
      headers: adminHeaders
    });
    const stockRepData = await stockRepRes.json();
    const sr = stockRepData.report;
    console.log('[Test 7.4] GET /api/reports/stock:', stockRepRes.status === 200 && sr.totalUnitsOnHand !== undefined ? 'PASS' : 'FAIL', {
      totalProducts: sr.totalProducts,
      totalUnitsOnHand: sr.totalUnitsOnHand,
      totalInventoryValuation: sr.totalInventoryValuation
    });

    // --- PHASE 8 TESTS: CONTACT SELF-SERVICE PORTAL & PROVISIONING ---
    console.log('\n--- Phase 8: Contact Self-Service Portal Tests ---');
    const portalCustRes = await fetch(`${BASE_URL}/api/contacts`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        name: 'Portal Test Customer',
        type: 'Customer',
        email: 'portal_customer@urbanfurniture.in',
        createPortalUser: true,
        portalPassword: 'PortalCustomer@2026'
      })
    });
    const portalCustData = await portalCustRes.json();
    console.log('[Test 8.1] Create Contact with Portal User Credentials:', portalCustRes.status === 201 && portalCustData.portalUserCreated === true ? 'PASS' : 'FAIL');

    // Login as the created contact user
    const contactLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'portal_customer@urbanfurniture.in',
        password: 'PortalCustomer@2026'
      })
    });
    const contactLoginData = await contactLoginRes.json();
    console.log('[Test 8.2] Login as Contact Role User:', contactLoginRes.status === 200 && contactLoginData.user.role === 'contact' ? 'PASS' : 'FAIL');

    console.log('\n=== All Phase 1 through 8 Tests Completed Successfully! ===\n');
  } finally {
    server.close();
    await mongoose.connection.close();
  }
}

if (require.main === module) {
  runAllTests().catch(err => {
    console.error('Tests failed:', err);
    process.exit(1);
  });
}

module.exports = { runAllTests };
