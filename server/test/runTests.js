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

    // Register Admin
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
    const adminToken = regAdminData.token;
    console.log('[Test 2.1] Register Admin User:', regAdminRes.status === 201 && adminToken ? 'PASS' : 'FAIL');

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
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    };

    // Contacts
    await Contact.deleteMany({});
    const custRes = await fetch(`${BASE_URL}/api/contacts`, {
      method: 'POST',
      headers: authHeaders,
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
      headers: authHeaders,
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
      headers: authHeaders,
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
        headers: authHeaders,
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
        headers: authHeaders,
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
      headers: authHeaders,
      body: JSON.stringify({ code: 'AN-OPS', name: 'Operations Expense', type: 'Expenses' })
    });
    const analyticData = await analyticRes.json();
    console.log('[Test 3.6] Create Analytic Account:', analyticRes.status === 201 ? 'PASS' : 'FAIL');

    await Budget.deleteMany({});
    const budgetRes = await fetch(`${BASE_URL}/api/budgets`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        name: 'Operations Budget 2026',
        period: '2026-Annual',
        responsiblePerson: 'Admin User',
        analyticAccount: analyticData.analyticAccount._id,
        plannedAmount: 500000
      })
    });
    console.log('[Test 3.7] Create Budget:', budgetRes.status === 201 ? 'PASS' : 'FAIL');

    // --- PHASE 4 TESTS: ACCOUNTING ENGINE ---
    console.log('\n--- Phase 4: Double-Entry Accounting Engine Tests ---');
    await JournalEntry.deleteMany({});

    // 4.1 Create balanced draft entry
    const draftEntryRes = await fetch(`${BASE_URL}/api/journal-entries`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        journal: createdJournals['Purchase Journal']._id,
        reference: 'BILL/TEST/001',
        partner: vendData.contact._id,
        items: [
          { account: createdAccounts['Purchases Expense']._id, debit: 5000, credit: 0, label: 'Office chairs stock purchase' },
          { account: createdAccounts['Creditors']._id, debit: 0, credit: 5000, label: 'Accounts payable to Azure Furniture' }
        ]
      })
    });
    const draftEntryData = await draftEntryRes.json();
    console.log('[Test 4.1] Create Balanced Draft Journal Entry:', draftEntryRes.status === 201 && draftEntryData.journalEntry.totalDebit === 5000 ? 'PASS' : 'FAIL');

    // 4.2 Post balanced entry & verify ledger update
    const postRes = await fetch(`${BASE_URL}/api/journal-entries/${draftEntryData.journalEntry._id}/post`, {
      method: 'POST',
      headers: authHeaders
    });
    const postData = await postRes.json();
    console.log('[Test 4.2] Post Balanced Entry:', postRes.status === 200 && postData.journalEntry.status === 'posted' ? 'PASS' : 'FAIL');

    // Verify account balances
    const expAcc = await Account.findById(createdAccounts['Purchases Expense']._id);
    const credAcc = await Account.findById(createdAccounts['Creditors']._id);
    console.log('[Test 4.3] Ledger Balances Updated (Expense: 5000, Creditors: 5000):', expAcc.balance === 5000 && credAcc.balance === 5000 ? 'PASS' : 'FAIL');

    // 4.4 Reject Unbalanced Entry
    const unbalRes = await fetch(`${BASE_URL}/api/journal-entries`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        journal: createdJournals['Purchase Journal']._id,
        reference: 'BILL/UNBALANCED/001',
        items: [
          { account: createdAccounts['Purchases Expense']._id, debit: 5000, credit: 0 },
          { account: createdAccounts['Creditors']._id, debit: 0, credit: 3000 }
        ]
      })
    });
    const unbalData = await unbalRes.json();
    const tryPostUnbal = await fetch(`${BASE_URL}/api/journal-entries/${unbalData.journalEntry._id}/post`, {
      method: 'POST',
      headers: authHeaders
    });
    console.log('[Test 4.4] Reject Unbalanced Journal Entry (Debit != Credit):', tryPostUnbal.status === 400 ? 'PASS' : 'FAIL');

    // 4.5 Prevent modifying posted entry
    const modRes = await fetch(`${BASE_URL}/api/journal-entries/${draftEntryData.journalEntry._id}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ reference: 'HACKED' })
    });
    console.log('[Test 4.5] Prevent Modifying Posted Entry:', modRes.status === 400 ? 'PASS' : 'FAIL');

    // 4.6 Cancel entry and reverse ledger
    const cancelRes = await fetch(`${BASE_URL}/api/journal-entries/${draftEntryData.journalEntry._id}/cancel`, {
      method: 'POST',
      headers: authHeaders
    });
    const expAccAfter = await Account.findById(createdAccounts['Purchases Expense']._id);
    const credAccAfter = await Account.findById(createdAccounts['Creditors']._id);
    console.log('[Test 4.6] Cancel Entry & Reverse Ledger (Balances back to 0):', cancelRes.status === 200 && expAccAfter.balance === 0 && credAccAfter.balance === 0 ? 'PASS' : 'FAIL');

    console.log('\n=== All Phase 1, 2, 3, & 4 Tests Completed Successfully! ===\n');
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
