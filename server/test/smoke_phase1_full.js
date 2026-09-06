/**
 * Urban Furniture ERP — Phase 1 Backend Route-by-Route Full Smoke Test Suite
 * Tests 100 endpoints across all 21 route files:
 * 1. No-UI-coverage routes first (GET-by-id, PUT, DELETE, Goods/Sales Receipts, User Management)
 * 2. Remaining routes
 * 3. 2xx valid response shape verification
 * 4. 4xx clean validation error handling (zero unhandled exceptions / zero crashes)
 * 5. 4-Identity RBAC matrix: Admin, Accountant, Contact, Anonymous (401/403)
 * 6. securityMiddleware live header hardening & proxy tests
 */

const http = require('http');

const BASE_URL = 'http://localhost:5000/api';

let adminToken = '';
let accountantToken = '';
let contactToken = '';
let superadminToken = '';

const stats = {
  total: 0,
  passed: 0,
  failed: 0,
  failures: []
};

function request(method, path, data = null, token = null, customHeaders = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const headers = {
      'Content-Type': 'application/json',
      'x-bypass-rate-limit': 'test-suite',
      ...customHeaders
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: headers
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(body);
        } catch (e) {
          json = body;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: json
        });
      });
    });

    req.on('error', (err) => reject(err));
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

function record(name, condition, details = '') {
  stats.total++;
  if (condition) {
    stats.passed++;
    console.log(`  [PASS] ${name}`);
  } else {
    stats.failed++;
    console.error(`  [FAIL] ${name} -> ${details}`);
    stats.failures.push({ name, details });
  }
}

async function run() {
  console.log('========================================================================');
  console.log('    URBAN FURNITURE ERP — PHASE 1: BACKEND ROUTE SMOKE TEST             ');
  console.log('========================================================================\n');

  // Step 0: Acquire Auth Tokens
  console.log('>>> Acquiring Tokens for 4 Roles...');
  const loginAdmin = await request('POST', '/auth/login', { email: 'admin@urbanfurniture.com', password: 'AdminPassword123!' });
  adminToken = loginAdmin.body?.token;
  record('Auth Admin Token', loginAdmin.statusCode === 200 && Boolean(adminToken));

  const loginAccountant = await request('POST', '/auth/login', { email: 'accountant@urbanfurniture.com', password: 'AccountantPassword123!' });
  accountantToken = loginAccountant.body?.token;
  record('Auth Accountant Token', loginAccountant.statusCode === 200 && Boolean(accountantToken));

  const loginContact = await request('POST', '/auth/login', { email: 'contact@urbanfurniture.com', password: 'ContactPassword123!' });
  contactToken = loginContact.body?.token;
  record('Auth Contact Token', loginContact.statusCode === 200 && Boolean(contactToken));

  const loginSuper = await request('POST', '/auth/login', { email: 'superadmin@urbanfurniture.com', password: 'SuperAdmin123!' });
  superadminToken = loginSuper.body?.token;
  record('Auth Superadmin Token', loginSuper.statusCode === 200 && Boolean(superadminToken));

  // Retrieve fixtures for testing IDs
  const contactsList = await request('GET', '/contacts', null, adminToken);
  const contactId = contactsList.body.contacts[0]._id;

  const productsList = await request('GET', '/products', null, adminToken);
  const productId = productsList.body.products[0]._id;

  const accountsList = await request('GET', '/accounts', null, adminToken);
  const nonSystemAcc = accountsList.body.accounts.find(a => !a.isSystem);
  const systemAcc = accountsList.body.accounts.find(a => a.isSystem);
  const accountId = nonSystemAcc._id;

  const journalsList = await request('GET', '/journals', null, adminToken);
  const journalId = journalsList.body.journals[0]._id;

  const analyticsList = await request('GET', '/analytic-accounts', null, adminToken);
  const analyticId = analyticsList.body.analyticAccounts[0]._id;

  const budgetsList = await request('GET', '/budgets', null, adminToken);
  const budgetId = budgetsList.body.budgets[0]._id;

  const poList = await request('GET', '/purchase-orders', null, adminToken);
  const poId = poList.body.purchaseOrders[0]._id;

  const soList = await request('GET', '/sales-orders', null, adminToken);
  const soId = soList.body.salesOrders[0]._id;

  const billsList = await request('GET', '/vendor-bills', null, adminToken);
  const billId = billsList.body.vendorBills[0]._id;

  const invList = await request('GET', '/customer-invoices', null, adminToken);
  const invId = invList.body.customerInvoices[0]._id;

  const paymentsList = await request('GET', '/payments', null, adminToken);
  const paymentId = paymentsList.body.payments[0]._id;

  const jesList = await request('GET', '/journal-entries', null, adminToken);
  const jeId = jesList.body.journalEntries[0]._id;

  // -------------------------------------------------------------------------
  // 1. NO-UI-COVERAGE GROUP (Correction A: High Priority)
  // -------------------------------------------------------------------------
  console.log('\n========================================================================');
  console.log(' 1. NO-UI-COVERAGE ROUTES (GET-by-id, PUT, DELETE, Receipts, Users)     ');
  console.log('========================================================================');

  // --- Contacts: GET /:id, PUT /:id, DELETE /:id ---
  console.log('\n[1.1] Contacts (GET/PUT/DELETE by :id)');
  const getContactId = await request('GET', `/contacts/${contactId}`, null, adminToken);
  record('GET /contacts/:id (200 shape)', getContactId.statusCode === 200 && getContactId.body.success === true && Boolean(getContactId.body.contact));
  
  const getContactAnon = await request('GET', `/contacts/${contactId}`, null, null);
  record('GET /contacts/:id (Anon 401)', getContactAnon.statusCode === 401);

  const putContact = await request('PUT', `/contacts/${contactId}`, { notes: 'Updated via test suite' }, accountantToken);
  record('PUT /contacts/:id (Accountant allowed 200)', putContact.statusCode === 200 && putContact.body.success === true);

  const putContactContactRole = await request('PUT', `/contacts/${contactId}`, { notes: 'Hacked' }, contactToken);
  record('PUT /contacts/:id (Contact role 403)', putContactContactRole.statusCode === 403);

  // Create temporary contact to test DELETE
  const tempContact = await request('POST', '/contacts', { name: 'Temp Delete Test', type: 'Customer' }, adminToken);
  const tempContactId = tempContact.body.contact._id;

  const delContactAccountant = await request('DELETE', `/contacts/${tempContactId}`, null, accountantToken);
  record('DELETE /contacts/:id (Accountant denied 403)', delContactAccountant.statusCode === 403);

  const delContactAdmin = await request('DELETE', `/contacts/${tempContactId}`, null, adminToken);
  record('DELETE /contacts/:id (Admin allowed 200)', delContactAdmin.statusCode === 200 && delContactAdmin.body.success === true);

  const delContact404 = await request('DELETE', `/contacts/${tempContactId}`, null, adminToken);
  record('DELETE /contacts/:id (Subsequent 404 clean)', delContact404.statusCode === 404);

  // --- Products: GET /:id, PUT /:id, DELETE /:id ---
  console.log('\n[1.2] Products (GET/PUT/DELETE by :id)');
  const getProdId = await request('GET', `/products/${productId}`, null, adminToken);
  record('GET /products/:id (200 shape)', getProdId.statusCode === 200 && getProdId.body.success === true);

  const putProd = await request('PUT', `/products/${productId}`, { description: 'Updated luxury product' }, accountantToken);
  record('PUT /products/:id (Accountant allowed 200)', putProd.statusCode === 200 && putProd.body.success === true);

  const putProdContact = await request('PUT', `/products/${productId}`, { salesPrice: 1 }, contactToken);
  record('PUT /products/:id (Contact role 403)', putProdContact.statusCode === 403);

  const tempProd = await request('POST', '/products', { name: 'Temp Prod Del', type: 'Goods', salesPrice: 500, costPrice: 200 }, adminToken);
  const tempProdId = tempProd.body.product._id;

  const delProdAcc = await request('DELETE', `/products/${tempProdId}`, null, accountantToken);
  record('DELETE /products/:id (Accountant denied 403)', delProdAcc.statusCode === 403);

  const delProdAdmin = await request('DELETE', `/products/${tempProdId}`, null, adminToken);
  record('DELETE /products/:id (Admin allowed 200)', delProdAdmin.statusCode === 200 && delProdAdmin.body.success === true);

  // --- Accounts: GET /:id, PUT /:id, DELETE /:id ---
  console.log('\n[1.3] Chart of Accounts (GET/PUT/DELETE by :id)');
  const getAccId = await request('GET', `/accounts/${accountId}`, null, accountantToken);
  record('GET /accounts/:id (200 shape)', getAccId.statusCode === 200 && getAccId.body.success === true);

  const putAcc = await request('PUT', `/accounts/${accountId}`, { description: 'Updated account note' }, accountantToken);
  record('PUT /accounts/:id (Accountant allowed 200)', putAcc.statusCode === 200 && putAcc.body.success === true);

  const putAccContact = await request('PUT', `/accounts/${accountId}`, { balance: 999999 }, contactToken);
  record('PUT /accounts/:id (Contact role 403)', putAccContact.statusCode === 403);

  const delSystemAcc = await request('DELETE', `/accounts/${systemAcc._id}`, null, adminToken);
  record('DELETE /accounts/:id (System account protected 400)', delSystemAcc.statusCode === 400 && delSystemAcc.body.message.includes('System accounts cannot be deleted'));

  const tempAcc = await request('POST', '/accounts', { code: 'TEST999', name: 'Temp Acc', type: 'Expense' }, adminToken);
  const tempAccId = tempAcc.body.account._id;

  const delAccAcc = await request('DELETE', `/accounts/${tempAccId}`, null, accountantToken);
  record('DELETE /accounts/:id (Accountant denied 403)', delAccAcc.statusCode === 403);

  const delAccAdmin = await request('DELETE', `/accounts/${tempAccId}`, null, adminToken);
  record('DELETE /accounts/:id (Admin allowed 200)', delAccAdmin.statusCode === 200 && delAccAdmin.body.success === true);

  // --- Journals: GET /:id, PUT /:id, DELETE /:id ---
  console.log('\n[1.4] Journals (GET/PUT/DELETE by :id)');
  const getJrnId = await request('GET', `/journals/${journalId}`, null, accountantToken);
  record('GET /journals/:id (200 shape)', getJrnId.statusCode === 200 && getJrnId.body.success === true);

  const putJrn = await request('PUT', `/journals/${journalId}`, { sequence: 5 }, accountantToken);
  record('PUT /journals/:id (Accountant allowed 200)', putJrn.statusCode === 200 && putJrn.body.success === true);

  const tempJrn = await request('POST', '/journals', { code: 'TMPJ', name: 'Temp Journal', type: 'General' }, adminToken);
  const tempJrnId = tempJrn.body.journal._id;

  const delJrnAcc = await request('DELETE', `/journals/${tempJrnId}`, null, accountantToken);
  record('DELETE /journals/:id (Accountant denied 403)', delJrnAcc.statusCode === 403);

  const delJrnAdmin = await request('DELETE', `/journals/${tempJrnId}`, null, adminToken);
  record('DELETE /journals/:id (Admin allowed 200)', delJrnAdmin.statusCode === 200 && delJrnAdmin.body.success === true);

  // --- Analytic Accounts: GET /:id, PUT /:id, DELETE /:id ---
  console.log('\n[1.5] Analytic Accounts (GET/PUT/DELETE by :id)');
  const getAnId = await request('GET', `/analytic-accounts/${analyticId}`, null, accountantToken);
  record('GET /analytic-accounts/:id (200 shape)', getAnId.statusCode === 200 && getAnId.body.success === true);

  const putAn = await request('PUT', `/analytic-accounts/${analyticId}`, { description: 'Updated center' }, accountantToken);
  record('PUT /analytic-accounts/:id (Accountant allowed 200)', putAn.statusCode === 200 && putAn.body.success === true);

  const tempAn = await request('POST', '/analytic-accounts', { name: 'Temp Analytic', type: 'Expenses' }, adminToken);
  const tempAnId = tempAn.body.analyticAccount._id;

  const delAnAcc = await request('DELETE', `/analytic-accounts/${tempAnId}`, null, accountantToken);
  record('DELETE /analytic-accounts/:id (Accountant denied 403)', delAnAcc.statusCode === 403);

  const delAnAdmin = await request('DELETE', `/analytic-accounts/${tempAnId}`, null, adminToken);
  record('DELETE /analytic-accounts/:id (Admin allowed 200)', delAnAdmin.statusCode === 200 && delAnAdmin.body.success === true);

  // --- Budgets: GET /:id, PUT /:id, DELETE /:id ---
  console.log('\n[1.6] Budgets (GET/PUT/DELETE by :id)');
  const getBgtId = await request('GET', `/budgets/${budgetId}`, null, accountantToken);
  record('GET /budgets/:id (200 shape)', getBgtId.statusCode === 200 && getBgtId.body.success === true);

  const putBgt = await request('PUT', `/budgets/${budgetId}`, { plannedAmount: 450000 }, accountantToken);
  record('PUT /budgets/:id (Accountant allowed 200)', putBgt.statusCode === 200 && putBgt.body.success === true);

  const tempBgt = await request('POST', '/budgets', { name: 'Temp Budget Del', period: '2026-Q4', analyticAccount: analyticId, plannedAmount: 100000 }, adminToken);
  const tempBgtId = tempBgt.body.budget._id;

  const delBgtAcc = await request('DELETE', `/budgets/${tempBgtId}`, null, accountantToken);
  record('DELETE /budgets/:id (Accountant denied 403)', delBgtAcc.statusCode === 403);

  const delBgtAdmin = await request('DELETE', `/budgets/${tempBgtId}`, null, adminToken);
  record('DELETE /budgets/:id (Admin allowed 200)', delBgtAdmin.statusCode === 200 && delBgtAdmin.body.success === true);

  // --- Purchase Orders: GET /:id, PUT /:id, DELETE /:id ---
  console.log('\n[1.7] Purchase Orders (GET/PUT/DELETE by :id)');
  const getPoId = await request('GET', `/purchase-orders/${poId}`, null, accountantToken);
  record('GET /purchase-orders/:id (200 shape)', getPoId.statusCode === 200 && getPoId.body.success === true);

  // Create a draft PO to test PUT and DELETE
  const draftPo = await request('POST', '/purchase-orders', {
    vendor: contactId,
    items: [{ product: productId, quantity: 2, unitPrice: 1500 }]
  }, accountantToken);
  const draftPoId = draftPo.body.purchaseOrder._id;

  const putPo = await request('PUT', `/purchase-orders/${draftPoId}`, { notes: 'Draft modified' }, accountantToken);
  record('PUT /purchase-orders/:id (Accountant allowed 200)', putPo.statusCode === 200 && putPo.body.success === true);

  const delPoAcc = await request('DELETE', `/purchase-orders/${draftPoId}`, null, accountantToken);
  record('DELETE /purchase-orders/:id (Accountant denied 403)', delPoAcc.statusCode === 403);

  const delPoAdmin = await request('DELETE', `/purchase-orders/${draftPoId}`, null, adminToken);
  record('DELETE /purchase-orders/:id (Admin allowed 200)', delPoAdmin.statusCode === 200 && delPoAdmin.body.success === true);

  // --- Sales Orders: GET /:id, PUT /:id, DELETE /:id ---
  console.log('\n[1.8] Sales Orders (GET/PUT/DELETE by :id)');
  const getSoId = await request('GET', `/sales-orders/${soId}`, null, accountantToken);
  record('GET /sales-orders/:id (200 shape)', getSoId.statusCode === 200 && getSoId.body.success === true);

  const draftSo = await request('POST', '/sales-orders', {
    customer: contactId,
    items: [{ product: productId, quantity: 2, unitPrice: 2500 }]
  }, accountantToken);
  const draftSoId = draftSo.body.salesOrder._id;

  const putSo = await request('PUT', `/sales-orders/${draftSoId}`, { notes: 'Draft SO modified' }, accountantToken);
  record('PUT /sales-orders/:id (Accountant allowed 200)', putSo.statusCode === 200 && putSo.body.success === true);

  const delSoAcc = await request('DELETE', `/sales-orders/${draftSoId}`, null, accountantToken);
  record('DELETE /sales-orders/:id (Accountant denied 403)', delSoAcc.statusCode === 403);

  const delSoAdmin = await request('DELETE', `/sales-orders/${draftSoId}`, null, adminToken);
  record('DELETE /sales-orders/:id (Admin allowed 200)', delSoAdmin.statusCode === 200 && delSoAdmin.body.success === true);

  // --- Vendor Bills: GET /:id, PUT /:id, DELETE /:id ---
  console.log('\n[1.9] Vendor Bills (GET/PUT/DELETE by :id)');
  const getBillId = await request('GET', `/vendor-bills/${billId}`, null, accountantToken);
  record('GET /vendor-bills/:id (200 shape)', getBillId.statusCode === 200 && getBillId.body.success === true);

  const draftBill = await request('POST', '/vendor-bills', {
    vendor: contactId,
    items: [{ product: productId, quantity: 1, unitPrice: 2000 }]
  }, accountantToken);
  const draftBillId = draftBill.body.vendorBill._id;

  const putBill = await request('PUT', `/vendor-bills/${draftBillId}`, { notes: 'Updated draft bill' }, accountantToken);
  record('PUT /vendor-bills/:id (Accountant allowed 200)', putBill.statusCode === 200 && putBill.body.success === true);

  const delBillAcc = await request('DELETE', `/vendor-bills/${draftBillId}`, null, accountantToken);
  record('DELETE /vendor-bills/:id (Accountant denied 403)', delBillAcc.statusCode === 403);

  const delBillAdmin = await request('DELETE', `/vendor-bills/${draftBillId}`, null, adminToken);
  record('DELETE /vendor-bills/:id (Admin allowed 200)', delBillAdmin.statusCode === 200 && delBillAdmin.body.success === true);

  // --- Customer Invoices: GET /:id, PUT /:id, DELETE /:id ---
  console.log('\n[1.10] Customer Invoices (GET/PUT/DELETE by :id)');
  const getInvId = await request('GET', `/customer-invoices/${invId}`, null, accountantToken);
  record('GET /customer-invoices/:id (200 shape)', getInvId.statusCode === 200 && getInvId.body.success === true);

  const draftInv = await request('POST', '/customer-invoices', {
    customer: contactId,
    items: [{ product: productId, quantity: 1, unitPrice: 3500 }]
  }, accountantToken);
  const draftInvId = draftInv.body.customerInvoice._id;

  const putInv = await request('PUT', `/customer-invoices/${draftInvId}`, { notes: 'Updated draft invoice' }, accountantToken);
  record('PUT /customer-invoices/:id (Accountant allowed 200)', putInv.statusCode === 200 && putInv.body.success === true);

  const delInvAcc = await request('DELETE', `/customer-invoices/${draftInvId}`, null, accountantToken);
  record('DELETE /customer-invoices/:id (Accountant denied 403)', delInvAcc.statusCode === 403);

  const delInvAdmin = await request('DELETE', `/customer-invoices/${draftInvId}`, null, adminToken);
  record('DELETE /customer-invoices/:id (Admin allowed 200)', delInvAdmin.statusCode === 200 && delInvAdmin.body.success === true);

  // --- Journal Entries: GET /:id, PUT /:id, POST /post, POST /cancel, DELETE /:id ---
  console.log('\n[1.11] Journal Entries (GET/PUT/POST/CANCEL/DELETE)');
  const getJeId = await request('GET', `/journal-entries/${jeId}`, null, accountantToken);
  record('GET /journal-entries/:id (200 shape)', getJeId.statusCode === 200 && getJeId.body.success === true);

  const debitAcc = accountsList.body.accounts.find(a => a.type === 'Asset');
  const creditAcc = accountsList.body.accounts.find(a => a.type === 'Income');

  const draftJe = await request('POST', '/journal-entries', {
    journal: journalId,
    reference: 'JE-MANUAL-TEST',
    items: [
      { account: debitAcc._id, debit: 1200, credit: 0, label: 'Debit line' },
      { account: creditAcc._id, debit: 0, credit: 1200, label: 'Credit line' }
    ]
  }, accountantToken);
  record('POST /journal-entries (Draft creation 201)', draftJe.statusCode === 201 && draftJe.body.success === true);
  const draftJeId = draftJe.body.journalEntry._id;

  const putJe = await request('PUT', `/journal-entries/${draftJeId}`, { reference: 'JE-MANUAL-UPDATED' }, accountantToken);
  record('PUT /journal-entries/:id (Accountant allowed 200)', putJe.statusCode === 200 && putJe.body.success === true);

  const postJeContact = await request('POST', `/journal-entries/${draftJeId}/post`, null, contactToken);
  record('POST /journal-entries/:id/post (Contact role denied 403)', postJeContact.statusCode === 403);

  const postJeAcc = await request('POST', `/journal-entries/${draftJeId}/post`, null, accountantToken);
  record('POST /journal-entries/:id/post (Accountant allowed 200)', postJeAcc.statusCode === 200 && postJeAcc.body.journalEntry.status === 'posted');

  const delPostedJe = await request('DELETE', `/journal-entries/${draftJeId}`, null, adminToken);
  record('DELETE /journal-entries/:id (Posted entry deletion blocked 400)', delPostedJe.statusCode === 400 && delPostedJe.body.message.includes('Cannot delete a posted'));

  const cancelJe = await request('POST', `/journal-entries/${draftJeId}/cancel`, null, accountantToken);
  record('POST /journal-entries/:id/cancel (Accountant allowed 200 & reversed)', cancelJe.statusCode === 200 && cancelJe.body.journalEntry.status === 'cancelled');

  // Create temporary draft entry to test deletion
  const tempJe = await request('POST', '/journal-entries', {
    journal: journalId,
    items: [
      { account: debitAcc._id, debit: 100, credit: 0 },
      { account: creditAcc._id, debit: 0, credit: 100 }
    ]
  }, adminToken);
  const tempJeId = tempJe.body.journalEntry._id;

  const delJeAcc = await request('DELETE', `/journal-entries/${tempJeId}`, null, accountantToken);
  record('DELETE /journal-entries/:id (Accountant denied 403)', delJeAcc.statusCode === 403);

  const delJeAdmin = await request('DELETE', `/journal-entries/${tempJeId}`, null, adminToken);
  record('DELETE /journal-entries/:id (Admin allowed 200)', delJeAdmin.statusCode === 200 && delJeAdmin.body.success === true);

  // --- Payments: GET /:id ---
  console.log('\n[1.12] Payments (GET by :id)');
  const getPayId = await request('GET', `/payments/${paymentId}`, null, accountantToken);
  record('GET /payments/:id (200 shape)', getPayId.statusCode === 200 && getPayId.body.success === true);

  // --- Goods Receipts: GET, GET /:id, POST, PUT, POST /confirm, DELETE ---
  console.log('\n[1.13] Goods Receipts Lifecycle (GET/POST/PUT/CONFIRM/DELETE)');
  const getGrListContact = await request('GET', '/goods-receipts', null, contactToken);
  record('GET /goods-receipts (Contact role 403)', getGrListContact.statusCode === 403);

  const getGrList = await request('GET', '/goods-receipts', null, accountantToken);
  record('GET /goods-receipts (Accountant allowed 200)', getGrList.statusCode === 200 && getGrList.body.success === true);
  const grId = getGrList.body.goodsReceipts[0]._id;

  const getGrId = await request('GET', `/goods-receipts/${grId}`, null, accountantToken);
  record('GET /goods-receipts/:id (200 shape)', getGrId.statusCode === 200 && getGrId.body.success === true);

  const postGrAccountant = await request('POST', '/goods-receipts', {
    receiptNumber: `GR-TEST-${Date.now()}`,
    purchaseOrder: poId,
    vendor: contactId,
    receiptDate: new Date(),
    items: [{ product: productId, quantity: 2, unitPrice: 1500, totalPrice: 3000 }],
    totalAmount: 3000
  }, accountantToken);
  record('POST /goods-receipts (Accountant denied 403)', postGrAccountant.statusCode === 403);

  const postGrAdmin = await request('POST', '/goods-receipts', {
    receiptNumber: `GR-TEST-${Date.now()}`,
    purchaseOrder: poId,
    vendor: contactId,
    receiptDate: new Date(),
    items: [{ product: productId, quantity: 2, unitPrice: 1500, totalPrice: 3000 }],
    totalAmount: 3000
  }, adminToken);
  record('POST /goods-receipts (Admin allowed 201)', postGrAdmin.statusCode === 201 && postGrAdmin.body.success === true);
  const newGrId = postGrAdmin.body.goodsReceipt._id;

  const putGrAcc = await request('PUT', `/goods-receipts/${newGrId}`, { notes: 'Updated notes' }, accountantToken);
  record('PUT /goods-receipts/:id (Accountant denied 403)', putGrAcc.statusCode === 403);

  const putGrAdmin = await request('PUT', `/goods-receipts/${newGrId}`, { notes: 'Updated notes admin' }, adminToken);
  record('PUT /goods-receipts/:id (Admin allowed 200)', putGrAdmin.statusCode === 200 && putGrAdmin.body.success === true);

  const confirmGrContact = await request('POST', `/goods-receipts/${newGrId}/confirm`, null, contactToken);
  record('POST /goods-receipts/:id/confirm (Contact denied 403)', confirmGrContact.statusCode === 403);

  const confirmGrAcc = await request('POST', `/goods-receipts/${newGrId}/confirm`, null, accountantToken);
  record('POST /goods-receipts/:id/confirm (Accountant allowed 200)', confirmGrAcc.statusCode === 200 && confirmGrAcc.body.goodsReceipt.status === 'received');

  // Create temporary draft GR to test delete
  const tempGr = await request('POST', '/goods-receipts', {
    receiptNumber: `GR-DEL-${Date.now()}`,
    purchaseOrder: poId,
    vendor: contactId,
    receiptDate: new Date(),
    items: [{ product: productId, quantity: 1, unitPrice: 1500, totalPrice: 1500 }],
    totalAmount: 1500
  }, adminToken);
  const tempGrId = tempGr.body.goodsReceipt._id;

  const delGrAcc = await request('DELETE', `/goods-receipts/${tempGrId}`, null, accountantToken);
  record('DELETE /goods-receipts/:id (Accountant denied 403)', delGrAcc.statusCode === 403);

  const delGrAdmin = await request('DELETE', `/goods-receipts/${tempGrId}`, null, adminToken);
  record('DELETE /goods-receipts/:id (Admin allowed 200)', delGrAdmin.statusCode === 200 && delGrAdmin.body.success === true);

  // --- Sales Receipts: GET, GET /:id, POST, PUT, POST /confirm, DELETE ---
  console.log('\n[1.14] Sales Receipts Lifecycle (GET/POST/PUT/CONFIRM/DELETE)');
  const getSrListContact = await request('GET', '/sales-receipts', null, contactToken);
  record('GET /sales-receipts (Contact role 403)', getSrListContact.statusCode === 403);

  const getSrList = await request('GET', '/sales-receipts', null, accountantToken);
  record('GET /sales-receipts (Accountant allowed 200)', getSrList.statusCode === 200 && getSrList.body.success === true);
  const srId = getSrList.body.salesReceipts[0]._id;

  const getSrId = await request('GET', `/sales-receipts/${srId}`, null, accountantToken);
  record('GET /sales-receipts/:id (200 shape)', getSrId.statusCode === 200 && getSrId.body.success === true);

  const postSrAccountant = await request('POST', '/sales-receipts', {
    receiptNumber: `SR-TEST-${Date.now()}`,
    salesOrder: soId,
    customer: contactId,
    receiptDate: new Date(),
    items: [{ product: productId, quantity: 2, unitPrice: 2500, totalPrice: 5000 }],
    totalAmount: 5000
  }, accountantToken);
  record('POST /sales-receipts (Accountant denied 403)', postSrAccountant.statusCode === 403);

  const postSrAdmin = await request('POST', '/sales-receipts', {
    receiptNumber: `SR-TEST-${Date.now()}`,
    salesOrder: soId,
    customer: contactId,
    receiptDate: new Date(),
    items: [{ product: productId, quantity: 2, unitPrice: 2500, totalPrice: 5000 }],
    totalAmount: 5000
  }, adminToken);
  record('POST /sales-receipts (Admin allowed 201)', postSrAdmin.statusCode === 201 && postSrAdmin.body.success === true);
  const newSrId = postSrAdmin.body.salesReceipt._id;

  const putSrAcc = await request('PUT', `/sales-receipts/${newSrId}`, { notes: 'Updated notes' }, accountantToken);
  record('PUT /sales-receipts/:id (Accountant denied 403)', putSrAcc.statusCode === 403);

  const putSrAdmin = await request('PUT', `/sales-receipts/${newSrId}`, { notes: 'Updated notes admin' }, adminToken);
  record('PUT /sales-receipts/:id (Admin allowed 200)', putSrAdmin.statusCode === 200 && putSrAdmin.body.success === true);

  const confirmSrContact = await request('POST', `/sales-receipts/${newSrId}/confirm`, null, contactToken);
  record('POST /sales-receipts/:id/confirm (Contact denied 403)', confirmSrContact.statusCode === 403);

  const confirmSrAcc = await request('POST', `/sales-receipts/${newSrId}/confirm`, null, accountantToken);
  record('POST /sales-receipts/:id/confirm (Accountant allowed 200)', confirmSrAcc.statusCode === 200 && confirmSrAcc.body.salesReceipt.status === 'delivered');

  const tempSr = await request('POST', '/sales-receipts', {
    receiptNumber: `SR-DEL-${Date.now()}`,
    salesOrder: soId,
    customer: contactId,
    receiptDate: new Date(),
    items: [{ product: productId, quantity: 1, unitPrice: 2500, totalPrice: 2500 }],
    totalAmount: 2500
  }, adminToken);
  const tempSrId = tempSr.body.salesReceipt._id;

  const delSrAcc = await request('DELETE', `/sales-receipts/${tempSrId}`, null, accountantToken);
  record('DELETE /sales-receipts/:id (Accountant denied 403)', delSrAcc.statusCode === 403);

  const delSrAdmin = await request('DELETE', `/sales-receipts/${tempSrId}`, null, adminToken);
  record('DELETE /sales-receipts/:id (Admin allowed 200)', delSrAdmin.statusCode === 200 && delSrAdmin.body.success === true);

  // --- Auth: GET /users, POST /users ---
  console.log('\n[1.15] User Management (GET/POST /auth/users)');
  const getUsersAcc = await request('GET', '/auth/users', null, accountantToken);
  record('GET /auth/users (Accountant denied 403)', getUsersAcc.statusCode === 403);

  const getUsersAdmin = await request('GET', '/auth/users', null, adminToken);
  record('GET /auth/users (Admin allowed 200)', getUsersAdmin.statusCode === 200 && getUsersAdmin.body.success === true && Array.isArray(getUsersAdmin.body.users));

  const getUsersSuper = await request('GET', '/auth/users', null, superadminToken);
  record('GET /auth/users (Superadmin allowed 200)', getUsersSuper.statusCode === 200 && getUsersSuper.body.success === true);

  const postUserAcc = await request('POST', '/auth/users', { name: 'Escalated', email: 'esc@test.com', password: 'Password123!', role: 'admin' }, accountantToken);
  record('POST /auth/users (Accountant denied 403)', postUserAcc.statusCode === 403);

  const postUserAdmin = await request('POST', '/auth/users', {
    name: 'New Admin Via Admin',
    email: `admin_${Date.now()}@urbanfurniture.com`,
    password: 'AdminPassword123!',
    role: 'admin'
  }, adminToken);
  record('POST /auth/users (Admin allowed 201 & role=admin preserved)', postUserAdmin.statusCode === 201 && postUserAdmin.body.user.role === 'admin');

  // -------------------------------------------------------------------------
  // 2. REMAINING CORE AND STOREFRONT ROUTES
  // -------------------------------------------------------------------------
  console.log('\n========================================================================');
  console.log(' 2. REMAINING ROUTES & STOREFRONT SMOKE TESTS                           ');
  console.log('========================================================================');

  // Health
  console.log('\n[2.1] Health & Heartbeat');
  const h1 = await request('GET', '/health', null, null);
  record('GET /health (Public 200)', h1.statusCode === 200 && h1.body.status === 'UP');

  const h2 = await request('GET', '/health/heartbeat', null, null);
  record('GET /health/heartbeat (Public 200 telemetry)', h2.statusCode === 200 && h2.body.heartbeat.database.connected === true);

  // Auth Public
  console.log('\n[2.2] Auth Registration & Login');
  const regEmail = `user_${Date.now()}@example.com`;
  const reg1 = await request('POST', '/auth/register', { name: 'Public User', email: regEmail, password: 'Password123!', role: 'admin' });
  record('POST /auth/register (Forces role=accountant on public reg)', reg1.statusCode === 201 && reg1.body.user.role === 'accountant');

  const regBad = await request('POST', '/auth/register', { name: 'Bad' });
  record('POST /auth/register (Missing email 400 clean)', regBad.statusCode === 400 && regBad.body.success === false);

  const meAuth = await request('GET', '/auth/me', null, contactToken);
  record('GET /auth/me (Authenticated 200)', meAuth.statusCode === 200 && meAuth.body.user.role === 'contact');

  // Master Data Collections
  console.log('\n[2.3] Master Data Collections (GET & POST)');
  const cList = await request('GET', '/contacts', null, accountantToken);
  record('GET /contacts (200 list)', cList.statusCode === 200 && cList.body.success === true);

  const pList = await request('GET', '/products', null, accountantToken);
  record('GET /products (200 list)', pList.statusCode === 200 && pList.body.success === true);

  const aList = await request('GET', '/accounts', null, accountantToken);
  record('GET /accounts (200 list)', aList.statusCode === 200 && aList.body.success === true);

  const jList = await request('GET', '/journals', null, accountantToken);
  record('GET /journals (200 list)', jList.statusCode === 200 && jList.body.success === true);

  const anList = await request('GET', '/analytic-accounts', null, accountantToken);
  record('GET /analytic-accounts (200 list)', anList.statusCode === 200 && anList.body.success === true);

  const bgList = await request('GET', '/budgets', null, accountantToken);
  record('GET /budgets (200 list)', bgList.statusCode === 200 && bgList.body.success === true);

  // Transaction Lists
  console.log('\n[2.4] Transactions & Order Lifecycle (GET & POST & POST /confirm)');
  const poListRes = await request('GET', '/purchase-orders', null, accountantToken);
  record('GET /purchase-orders (200 list)', poListRes.statusCode === 200 && poListRes.body.success === true);

  const newDraftPo = await request('POST', '/purchase-orders', {
    vendor: contactId,
    items: [{ product: productId, quantity: 3, unitPrice: 1500 }]
  }, accountantToken);
  record('POST /purchase-orders (201 create draft)', newDraftPo.statusCode === 201 && newDraftPo.body.purchaseOrder.status === 'draft');
  const newPoId = newDraftPo.body.purchaseOrder._id;

  const confirmPo = await request('POST', `/purchase-orders/${newPoId}/confirm`, null, accountantToken);
  record('POST /purchase-orders/:id/confirm (200 confirm)', confirmPo.statusCode === 200 && confirmPo.body.purchaseOrder.status === 'confirmed');

  const confirmPoAgain = await request('POST', `/purchase-orders/${newPoId}/confirm`, null, accountantToken);
  record('POST /purchase-orders/:id/confirm (Double confirm rejected 400)', confirmPoAgain.statusCode === 400);

  // Sales Orders
  const soListRes = await request('GET', '/sales-orders', null, accountantToken);
  record('GET /sales-orders (200 list)', soListRes.statusCode === 200 && soListRes.body.success === true);

  const newDraftSo = await request('POST', '/sales-orders', {
    customer: contactId,
    items: [{ product: productId, quantity: 2, unitPrice: 2500 }]
  }, accountantToken);
  record('POST /sales-orders (201 create draft)', newDraftSo.statusCode === 201 && newDraftSo.body.salesOrder.status === 'draft');
  const newSoId = newDraftSo.body.salesOrder._id;

  const confirmSo = await request('POST', `/sales-orders/${newSoId}/confirm`, null, accountantToken);
  record('POST /sales-orders/:id/confirm (200 confirm)', confirmSo.statusCode === 200 && confirmSo.body.salesOrder.status === 'confirmed');

  // Vendor Bills & Auto-Posting
  console.log('\n[2.5] Vendor Bills & Auto-Posting');
  const vbListRes = await request('GET', '/vendor-bills', null, accountantToken);
  record('GET /vendor-bills (200 list)', vbListRes.statusCode === 200 && vbListRes.body.success === true);

  const newDraftVb = await request('POST', '/vendor-bills', {
    vendor: contactId,
    purchaseOrder: newPoId,
    items: [{ product: productId, quantity: 3, unitPrice: 1500 }]
  }, accountantToken);
  record('POST /vendor-bills (201 create draft)', newDraftVb.statusCode === 201 && newDraftVb.body.vendorBill.status === 'draft');
  const newVbId = newDraftVb.body.vendorBill._id;

  const postVb = await request('POST', `/vendor-bills/${newVbId}/post`, null, accountantToken);
  record('POST /vendor-bills/:id/post (200 auto-post & ledger impact)', postVb.statusCode === 200 && postVb.body.vendorBill.status === 'posted');

  const postVbAgain = await request('POST', `/vendor-bills/${newVbId}/post`, null, accountantToken);
  record('POST /vendor-bills/:id/post (Double post rejected 400)', postVbAgain.statusCode === 400);

  // Customer Invoices & Auto-Posting
  console.log('\n[2.6] Customer Invoices & Auto-Posting');
  const ciListRes = await request('GET', '/customer-invoices', null, accountantToken);
  record('GET /customer-invoices (200 list)', ciListRes.statusCode === 200 && ciListRes.body.success === true);

  const newDraftCi = await request('POST', '/customer-invoices', {
    customer: contactId,
    salesOrder: newSoId,
    items: [{ product: productId, quantity: 2, unitPrice: 2500, taxPercent: 18 }]
  }, accountantToken);
  record('POST /customer-invoices (201 create draft)', newDraftCi.statusCode === 201 && newDraftCi.body.customerInvoice.status === 'draft');
  const newCiId = newDraftCi.body.customerInvoice._id;

  const postCi = await request('POST', `/customer-invoices/${newCiId}/post`, null, accountantToken);
  record('POST /customer-invoices/:id/post (200 auto-post & ledger impact)', postCi.statusCode === 200 && postCi.body.customerInvoice.status === 'posted');

  // Payments & Settlements
  console.log('\n[2.7] Payments & Allocations');
  const payListRes = await request('GET', '/payments', null, accountantToken);
  record('GET /payments (200 list)', payListRes.statusCode === 200 && payListRes.body.success === true);

  const payOver = await request('POST', '/payments', {
    paymentType: 'send_money',
    partner: contactId,
    vendorBill: newVbId,
    amount: 999999,
    paymentMethod: 'Bank'
  }, accountantToken);
  record('POST /payments (Overpayment on posted bill rejected 400)', payOver.statusCode === 400 && payOver.body.message.includes('exceeds outstanding bill balance'));

  const payOut = await request('POST', '/payments', {
    paymentType: 'send_money',
    partner: contactId,
    vendorBill: newVbId,
    amount: 4500,
    paymentMethod: 'Bank'
  }, accountantToken);
  record('POST /payments (Vendor Bill settlement 201)', payOut.statusCode === 201 && payOut.body.payment.status === 'posted');

  const payDuplicate = await request('POST', '/payments', {
    paymentType: 'send_money',
    partner: contactId,
    vendorBill: newVbId,
    amount: 100,
    paymentMethod: 'Bank'
  }, accountantToken);
  record('POST /payments (Payment on paid bill rejected 400)', payDuplicate.statusCode === 400 && payDuplicate.body.message.includes("Current status: 'paid'"));

  const payIn = await request('POST', '/payments', {
    paymentType: 'receive_money',
    partner: contactId,
    customerInvoice: newCiId,
    amount: 5900,
    paymentMethod: 'Bank'
  }, accountantToken);
  record('POST /payments (Customer Invoice settlement 201)', payIn.statusCode === 201 && payIn.body.payment.status === 'posted');

  // Financial Reports
  console.log('\n[2.8] Financial Reports');
  const repPnlContact = await request('GET', '/reports/profit-loss', null, contactToken);
  record('GET /reports/profit-loss (Contact role denied 403)', repPnlContact.statusCode === 403);

  const repPnl = await request('GET', '/reports/profit-loss?startDate=2026-01-01&endDate=2026-12-31', null, accountantToken);
  record('GET /reports/profit-loss (200 report shape)', repPnl.statusCode === 200 && repPnl.body.report.summary.hasOwnProperty('grossProfit'));

  const repBs = await request('GET', '/reports/balance-sheet?date=2026-12-31', null, accountantToken);
  record('GET /reports/balance-sheet (200 report shape & balanced)', repBs.statusCode === 200 && repBs.body.report.summary.isBalanced === true);

  const repBgt = await request('GET', '/reports/budget?period=FY2026-Annual', null, accountantToken);
  record('GET /reports/budget (200 report shape)', repBgt.statusCode === 200 && Array.isArray(repBgt.body.report.budgets));

  const repStock = await request('GET', '/reports/stock', null, accountantToken);
  record('GET /reports/stock (200 stock valuation report)', repStock.statusCode === 200 && repStock.body.report.hasOwnProperty('totalInventoryValuation'));

  // Storefront, Showrooms, Inquiries, Partners & Helpdesk
  console.log('\n[2.9] Storefront & Concierge Modules');
  const shwList = await request('GET', '/showrooms', null, null);
  record('GET /showrooms (Public 200 from MongoDB)', shwList.statusCode === 200 && Array.isArray(shwList.body.showrooms));

  const tourBook = await request('POST', '/showrooms/book-tour', {
    showroom: 'mumbai',
    name: 'Test Patron',
    email: 'patron@example.com',
    date: '2026-09-15'
  }, null);
  record('POST /showrooms/book-tour (Public 201 tour booking)', tourBook.statusCode === 201 && tourBook.body.success === true);
  const tourId = tourBook.body.booking._id;

  const shwBookings = await request('GET', '/showrooms/bookings', null, accountantToken);
  record('GET /showrooms/bookings (Accountant allowed 200)', shwBookings.statusCode === 200 && shwBookings.body.success === true);

  const shwStatus = await request('PATCH', `/showrooms/bookings/${tourId}/status`, { status: 'completed' }, accountantToken);
  record('PATCH /showrooms/bookings/:id/status (Accountant allowed 200)', shwStatus.statusCode === 200 && shwStatus.body.booking.status === 'completed');

  const inqSubmit = await request('POST', '/inquiries/designer', {
    name: 'Bespoke Client',
    email: 'bespoke@client.com',
    projectType: 'Residential Interior',
    message: 'Custom sofa requirement'
  }, null);
  record('POST /inquiries/designer (Public 201 submission)', inqSubmit.statusCode === 201 && inqSubmit.body.success === true);
  const inqId = inqSubmit.body.inquiry._id;

  const inqList = await request('GET', '/inquiries/designer', null, accountantToken);
  record('GET /inquiries/designer (Accountant allowed 200)', inqList.statusCode === 200 && inqList.body.success === true);

  const inqPatch = await request('PATCH', `/inquiries/designer/${inqId}/status`, { status: 'contacted' }, accountantToken);
  record('PATCH /inquiries/designer/:id/status (Accountant allowed 200)', inqPatch.statusCode === 200 && inqPatch.body.inquiry.status === 'contacted');

  const partApply = await request('POST', '/partners/apply', {
    studioName: 'Aura Studio',
    contactPerson: 'Karan Mehra',
    email: 'karan@aurastudio.com',
    phone: '+91 98200 12345',
    procurementVolume: 3500000
  }, null);
  record('POST /partners/apply (Public 201 application)', partApply.statusCode === 201 && partApply.body.partner.tier === 'Gold Studio Guild');
  const partId = partApply.body.partner._id;

  const partList = await request('GET', '/partners', null, accountantToken);
  record('GET /partners (Accountant allowed 200)', partList.statusCode === 200 && partList.body.success === true);

  const partPatch = await request('PATCH', `/partners/${partId}/status`, { status: 'approved' }, accountantToken);
  record('PATCH /partners/:id/status (Accountant allowed 200)', partPatch.statusCode === 200 && partPatch.body.partner.status === 'approved');

  const tktSubmit = await request('POST', '/helpdesk/tickets', {
    name: 'Helpdesk User',
    email: 'user@helpdesk.com',
    subject: 'Ledger alignment question',
    message: 'Details regarding reconciliation'
  }, null);
  record('POST /helpdesk/tickets (Public 201 ticket)', tktSubmit.statusCode === 201 && tktSubmit.body.success === true);
  const tktId = tktSubmit.body.ticket._id;

  const tktList = await request('GET', '/helpdesk/tickets', null, accountantToken);
  record('GET /helpdesk/tickets (Accountant allowed 200)', tktList.statusCode === 200 && tktList.body.success === true);

  const tktPatch = await request('PATCH', `/helpdesk/tickets/${tktId}/status`, { status: 'Resolved' }, accountantToken);
  record('PATCH /helpdesk/tickets/:id/status (Accountant allowed 200)', tktPatch.statusCode === 200 && tktPatch.body.ticket.status === 'Resolved');

  // -------------------------------------------------------------------------
  // 3. SECURITY MIDDLEWARE & HARDENING LIVE VERIFICATION
  // -------------------------------------------------------------------------
  console.log('\n========================================================================');
  console.log(' 3. SECURITY MIDDLEWARE & PROXY HARDENING VERIFICATION                  ');
  console.log('========================================================================');

  // Test live headers
  const secRes = await request('GET', '/health', null, null);
  const h = secRes.headers;

  record('Header: X-Content-Type-Options: nosniff', h['x-content-type-options'] === 'nosniff', `Received: ${h['x-content-type-options']}`);
  record('Header: X-Frame-Options: SAMEORIGIN', h['x-frame-options'] === 'SAMEORIGIN', `Received: ${h['x-frame-options']}`);
  record('Header: X-XSS-Protection: 1; mode=block', h['x-xss-protection'] === '1; mode=block', `Received: ${h['x-xss-protection']}`);
  record('Header: Referrer-Policy: strict-origin-when-cross-origin', h['referrer-policy'] === 'strict-origin-when-cross-origin', `Received: ${h['referrer-policy']}`);
  record('Header: Permissions-Policy present', Boolean(h['permissions-policy']), `Received: ${h['permissions-policy']}`);
  record('Server fingerprint removed (No x-powered-by)', !h['x-powered-by'], `Received: ${h['x-powered-by']}`);

  // Test HSTS when behind proxy with x-forwarded-proto: https
  const hstsRes = await request('GET', '/health', null, null, { 'x-forwarded-proto': 'https' });
  record('HSTS Header enforced when x-forwarded-proto: https', Boolean(hstsRes.headers['strict-transport-security'] && hstsRes.headers['strict-transport-security'].includes('max-age=31536000')));

  // Test HTTPS 301 redirection when x-forwarded-proto: http and ENFORCE_HTTPS simulated
  // (In development env without ENFORCE_HTTPS=true, it passes through safely)
  const protoHttpRes = await request('GET', '/health', null, null, { 'x-forwarded-proto': 'http' });
  record('Development mode safely bypasses HTTPS redirect when disabled', protoHttpRes.statusCode === 200);

  // Test CORS Origin rejection on unauthorized origin header
  let corsErrorCaught = false;
  try {
    const corsRes = await request('GET', '/health', null, null, { 'Origin': 'https://evil-attacker.com' });
    // If CORS rejects, express cors middleware returns an error passed to error handler, resulting in 500/CORS blocked
    if (corsRes.body && corsRes.body.message && corsRes.body.message.includes('CORS blocked')) {
      corsErrorCaught = true;
    }
  } catch (err) {
    corsErrorCaught = true;
  }
  record('CORS strict origin allowlist rejects unauthorized cross-origin', corsErrorCaught);

  // Test CORS Authorized origin
  const corsAllowed = await request('GET', '/health', null, null, { 'Origin': 'http://localhost:5173' });
  record('CORS allows authorized client origin (http://localhost:5173)', corsAllowed.headers['access-control-allow-origin'] === 'http://localhost:5173' && corsAllowed.headers['access-control-allow-credentials'] === 'true');

  console.log('\n========================================================================');
  console.log(` PHASE 1 TEST SUMMARY: ${stats.passed} / ${stats.total} PASSED (${stats.failed} FAILED)`);
  console.log('========================================================================\n');

  if (stats.failures.length > 0) {
    console.error('FAILURES:');
    stats.failures.forEach(f => console.error(` - ${f.name}: ${f.details}`));
    process.exit(1);
  } else {
    console.log('ALL PHASE 1 BACKEND SMOKE TESTS PASSED CLEANLY WITH ZERO ERRORS.\n');
    process.exit(0);
  }
}

run().catch(err => {
  console.error('Fatal execution error in test runner:', err);
  process.exit(1);
});
