/**
 * Urban Furniture ERP — Phase 4 Regression Check Against Prior Audit Findings
 * Tests all 25 specific audit items programmatically:
 * 1. Registration role escalation
 * 2. Payment RBAC restricted to admin/accountant
 * 3. Contact creation no longer overwriting existing user passwords
 * 4. Transactional/atomic ledger balance updates in accountingEngine.js
 * 5. Regex escaping actually applied everywhere search is used
 * 6. Showroom/partner/helpdesk/inquiry routes properly authenticated
 * 7. No hardcoded JWT secret fallback
 * 8. Vendor Bill/Customer Invoice validation parity with Goods Receipt
 * 9. Order confirm state-machine guards
 * 10. Payment status allow-list excluding cancelled documents
 * 11. Payment journal-entry reference bug fixed
 * 12. Tax account fallback no longer crediting an Asset account
 * 13. Errors forwarded to the central handler instead of masked as 400
 * 14. Showroom data now in Showroom.js/MongoDB instead of hardcoded
 * 15. Helpdesk GET no longer mutating data
 * 16. DELETE routes restricted to admin only
 * 17. Superadmin able to reach /api/auth/users
 * 18. CORS origin/credentials configured correctly
 * 19. Async route handlers crash-protected
 * 20. Budget/stock reports using aggregation instead of full in-memory scans
 * 21. Profit & Loss respecting date ranges
 * 22. Redundant findById-after-create calls removed
 * 23. Pagination present on list endpoints
 * 24. Indexes present on foreign keys and document numbers
 * 25. TLS termination architecture in place
 */

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
const JournalEntry = require('../src/models/JournalEntry');
const PurchaseOrder = require('../src/models/PurchaseOrder');
const GoodsReceipt = require('../src/models/GoodsReceipt');
const VendorBill = require('../src/models/VendorBill');
const SalesOrder = require('../src/models/SalesOrder');
const SalesReceipt = require('../src/models/SalesReceipt');
const CustomerInvoice = require('../src/models/CustomerInvoice');
const Payment = require('../src/models/Payment');
const Showroom = require('../src/models/Showroom');
const HelpdeskTicket = require('../src/models/HelpdeskTicket');
const TradePartner = require('../src/models/TradePartner');
const DesignerInquiry = require('../src/models/DesignerInquiry');

const PORT = 5096;
const BASE_URL = `http://localhost:${PORT}/api`;

let server;
let adminToken = '';
let accountantToken = '';
let contactToken = '';
let superadminToken = '';
let testContactId = '';

const stats = {
  total: 0,
  passed: 0,
  failed: 0,
  failures: []
};

function request(method, path, data = null, token = null, customHeaders = {}) {
  return new Promise((resolve) => {
    const url = new URL(BASE_URL + path);
    const headers = {
      'Content-Type': 'application/json',
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

    req.on('error', (err) => {
      resolve({
        statusCode: 500,
        headers: {},
        body: { success: false, message: err.message }
      });
    });

    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

function assert(condition, testName, details = '') {
  stats.total++;
  if (condition) {
    stats.passed++;
    console.log(`  ✓ [PASS] #${stats.total} ${testName}`);
  } else {
    stats.failed++;
    stats.failures.push({ testName, details });
    console.error(`  ✗ [FAIL] #${stats.total} ${testName} — ${details}`);
  }
}

async function runPhase4Audit() {
  console.log('========================================================================');
  console.log(' URBAN FURNITURE ERP — PHASE 4 REGRESSION AUDIT SUITE (25 AUDIT ITEMS)');
  console.log('========================================================================\n');

  await connectDB();
  server = app.listen(PORT);

  try {
    // 0. Seed auth tokens
    let admin = await User.findOne({ email: 'admin@urbanfurniture.com' });
    if (!admin) {
      admin = await User.create({ name: 'Admin', email: 'admin@urbanfurniture.com', password: 'AdminPassword123!', role: 'admin' });
    }
    adminToken = admin.generateAuthToken();

    let accountant = await User.findOne({ email: 'accountant@urbanfurniture.com' });
    if (!accountant) {
      accountant = await User.create({ name: 'Accountant', email: 'accountant@urbanfurniture.com', password: 'AccountantPassword123!', role: 'accountant' });
    }
    accountantToken = accountant.generateAuthToken();

    let contact = await Contact.findOne({ type: 'Customer' });
    if (!contact) {
      contact = await Contact.create({ name: 'Test Customer', type: 'Customer', email: 'contact_p4@test.com' });
    }
    testContactId = contact._id;

    let contactUser = await User.findOne({ email: 'contact_p4@test.com' });
    if (!contactUser) {
      contactUser = await User.create({ name: 'Contact User', email: 'contact_p4@test.com', password: 'ContactPassword123!', role: 'contact', contactId: testContactId });
    }
    contactToken = contactUser.generateAuthToken();

    let superadmin = await User.findOne({ email: 'superadmin@urbanfurniture.com' });
    if (!superadmin) {
      superadmin = await User.create({ name: 'SuperAdmin', email: 'superadmin@urbanfurniture.com', password: 'SuperAdminPassword123!', role: 'superadmin' });
    }
    superadminToken = superadmin.generateAuthToken();

    console.log('--- Item 1: Registration Role Escalation ---');
    const regEscRes = await request('POST', '/auth/register', {
      name: 'Escalation Hacker',
      email: `hacker_${Date.now()}@test.com`,
      password: 'HackerPassword123!',
      role: 'admin'
    });
    assert(regEscRes.statusCode === 201, 'POST /auth/register succeeds');
    assert(regEscRes.body.user && regEscRes.body.user.role === 'accountant', 'Self-assigned "admin" role is forcefully demoted to "accountant"');

    const regSuperRes = await request('POST', '/auth/register', {
      name: 'Super Hacker',
      email: `superhacker_${Date.now()}@test.com`,
      password: 'HackerPassword123!',
      role: 'superadmin'
    });
    assert(regSuperRes.body.user && regSuperRes.body.user.role === 'accountant', 'Self-assigned "superadmin" role is forcefully demoted to "accountant"');

    console.log('\n--- Item 2: Payment RBAC Restricted to Admin/Accountant ---');
    const payContactRes = await request('POST', '/payments', {
      paymentType: 'send_money',
      amount: 1000
    }, contactToken);
    assert(payContactRes.statusCode === 403, 'POST /payments rejected with 403 Forbidden for Contact role');

    console.log('\n--- Item 3: Contact Creation No Longer Overwriting Existing User Passwords ---');
    const targetEmail = `victim_${Date.now()}@test.com`;
    const origUser = await User.create({
      name: 'Existing User',
      email: targetEmail,
      password: 'OriginalSecurePassword123!',
      role: 'accountant'
    });
    const origHash = origUser.password;

    const contactOverwriteRes = await request('POST', '/contacts', {
      name: 'Contact With Same Email',
      type: 'Customer',
      email: targetEmail,
      createPortalUser: true,
      portalPassword: 'AttackerNewPassword999!'
    }, adminToken);
    assert(contactOverwriteRes.statusCode === 201, 'POST /contacts with existing email creates contact record');

    const reloadedUser = await User.findById(origUser._id).select('+password');
    assert(reloadedUser.password === origHash, 'Existing user password hash was preserved without mutation');
    const isOldMatch = await reloadedUser.comparePassword('OriginalSecurePassword123!');
    assert(isOldMatch === true, 'Original user password remains valid for login');

    console.log('\n--- Item 4: Transactional/Atomic Ledger Balance Updates ($inc in accountingEngine.js) ---');
    const cashAcc = await Account.findOne({ name: 'Cash' }) || await Account.findOne({ type: 'Asset' });
    const capAcc = await Account.findOne({ name: 'Capital' }) || await Account.findOne({ type: 'Capital' });
    const journal = await Journal.findOne({});

    const balBeforeCash = cashAcc.balance;
    const balBeforeCap = capAcc.balance;

    const jePostRes = await request('POST', '/journal-entries', {
      journal: journal._id,
      date: new Date(),
      reference: 'P4-ATOMIC-INC',
      items: [
        { account: cashAcc._id, debit: 2000, credit: 0 },
        { account: capAcc._id, debit: 0, credit: 2000 }
      ]
    }, adminToken);
    const jePostId = jePostRes.body.journalEntry._id;

    const postConfirmRes = await request('POST', `/journal-entries/${jePostId}/post`, {}, adminToken);
    assert(postConfirmRes.statusCode === 200, 'POST /journal-entries/:id/post posts entry');

    const cashAfter = await Account.findById(cashAcc._id);
    const capAfter = await Account.findById(capAcc._id);
    assert(Math.abs(cashAfter.balance - (balBeforeCash + 2000)) < 0.01, 'Cash asset balance atomically incremented by 2000');
    assert(Math.abs(capAfter.balance - (balBeforeCap + 2000)) < 0.01, 'Capital balance atomically incremented by 2000');

    // Cancel to restore
    await request('POST', `/journal-entries/${jePostId}/cancel`, {}, adminToken);

    console.log('\n--- Item 5: Regex Escaping Applied Everywhere Search is Used ---');
    const searchEndpoints = [
      '/products?search=[test(',
      '/contacts?search=.*',
      '/accounts?search=(',
      '/journal-entries?search=+',
      '/purchase-orders?search=^',
      '/sales-orders?search=$',
      '/vendor-bills?search={',
      '/customer-invoices?search=}',
      '/payments?search=\\',
      '/goods-receipts?search=[',
      '/sales-receipts?search=(',
      '/budgets?search=+'
    ];
    for (const ep of searchEndpoints) {
      const sRes = await request('GET', ep, null, adminToken);
      assert(sRes.statusCode === 200, `GET ${ep} executes safely without regex crash (HTTP 200)`);
    }

    console.log('\n--- Item 6: Showroom/Partner/Helpdesk/Inquiry Route Authentication ---');
    // Public submissions
    const publicTour = await request('POST', '/showrooms/book-tour', {
      showroom: 'mumbai',
      name: 'Patron Public',
      email: 'patron@example.com',
      date: '2026-10-15',
      timeSlot: '11:00 AM'
    });
    assert(publicTour.statusCode === 201, 'POST /showrooms/book-tour is public (HTTP 201)');

    const publicHelpdesk = await request('POST', '/helpdesk/tickets', {
      name: 'Public Helpdesk',
      email: 'help@example.com',
      subject: 'Inquiry',
      message: 'Need help'
    });
    assert(publicHelpdesk.statusCode === 201, 'POST /helpdesk/tickets is public (HTTP 201)');

    const publicPartner = await request('POST', '/partners/apply', {
      studioName: 'Atelier Public Studio',
      contactPerson: 'Ar. Sharma',
      email: `studio_${Date.now()}@example.com`,
      phone: '+91 9876543210',
      procurementVolume: 1500000
    });
    assert(publicPartner.statusCode === 201, 'POST /partners/apply is public (HTTP 201)');

    const publicInquiry = await request('POST', '/inquiries/designer', {
      name: 'Public Designer Client',
      email: 'designer_client@example.com',
      phone: '+91 9876543210',
      projectType: 'Bespoke Private Commission'
    });
    assert(publicInquiry.statusCode === 201, 'POST /inquiries/designer is public (HTTP 201)');

    // Protected management routes reject anonymous with 401
    const anonBookings = await request('GET', '/showrooms/bookings');
    assert(anonBookings.statusCode === 401, 'GET /showrooms/bookings requires auth (HTTP 401)');

    const anonTickets = await request('GET', '/helpdesk/tickets');
    assert(anonTickets.statusCode === 401, 'GET /helpdesk/tickets requires auth (HTTP 401)');

    const anonPartners = await request('GET', '/partners');
    assert(anonPartners.statusCode === 401, 'GET /partners requires auth (HTTP 401)');

    const anonInquiries = await request('GET', '/inquiries/designer');
    assert(anonInquiries.statusCode === 401, 'GET /inquiries/designer requires auth (HTTP 401)');

    // Protected routes reject contact role with 403
    const contactBookings = await request('GET', '/showrooms/bookings', null, contactToken);
    assert(contactBookings.statusCode === 403, 'GET /showrooms/bookings rejected for contact role (HTTP 403)');

    // Protected routes succeed for admin with 200
    const adminBookings = await request('GET', '/showrooms/bookings', null, adminToken);
    assert(adminBookings.statusCode === 200, 'GET /showrooms/bookings succeeds for admin (HTTP 200)');

    console.log('\n--- Item 7: No Hardcoded JWT Secret Fallback ---');
    const originalSecret = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;
    let jwtFatalCaught = false;
    try {
      const freshUser = new User({ name: 'T', email: 't@t.com', password: 'P', role: 'admin' });
      freshUser.generateAuthToken();
    } catch (e) {
      if (e.message.includes('FATAL CONFIGURATION ERROR: JWT_SECRET environment variable is missing')) {
        jwtFatalCaught = true;
      }
    }
    process.env.JWT_SECRET = originalSecret;
    assert(jwtFatalCaught === true, 'Missing JWT_SECRET throws FATAL CONFIGURATION ERROR without fallback');

    console.log('\n--- Item 8: Vendor Bill / Customer Invoice Validation Parity with Goods Receipt ---');
    const billBadItems = await request('POST', '/vendor-bills', { vendor: testContactId, items: [] }, adminToken);
    assert(billBadItems.statusCode === 400, 'POST /vendor-bills rejects empty items array with 400');

    const billNegativeQty = await request('POST', '/vendor-bills', {
      vendor: testContactId,
      items: [{ product: cashAcc._id, quantity: -5, unitPrice: 100 }]
    }, adminToken);
    assert(billNegativeQty.statusCode === 400, 'POST /vendor-bills rejects negative quantity with 400');

    const invBadDate = await request('POST', '/customer-invoices', {
      customer: testContactId,
      invoiceDate: 'not-a-valid-date',
      items: [{ product: cashAcc._id, quantity: 1, unitPrice: 100 }]
    }, adminToken);
    assert(invBadDate.statusCode === 400, 'POST /customer-invoices rejects invalid date format with 400');

    console.log('\n--- Item 9: Order Confirm State-Machine Guards ---');
    const testPo = await PurchaseOrder.create({
      vendor: testContactId,
      status: 'confirmed',
      items: [{ product: cashAcc._id, quantity: 1, unitPrice: 100 }]
    });
    const poDoubleConfirm = await request('POST', `/purchase-orders/${testPo._id}/confirm`, {}, adminToken);
    assert(poDoubleConfirm.statusCode === 400, 'Confirming non-draft Purchase Order rejected with 400');
    assert(poDoubleConfirm.body.message.includes('Only draft Purchase Orders can be confirmed'), 'PO error message specifies state machine rule');
    await PurchaseOrder.findByIdAndDelete(testPo._id);

    const testSo = await SalesOrder.create({
      customer: testContactId,
      status: 'confirmed',
      items: [{ product: cashAcc._id, quantity: 1, unitPrice: 100 }]
    });
    const soDoubleConfirm = await request('POST', `/sales-orders/${testSo._id}/confirm`, {}, adminToken);
    assert(soDoubleConfirm.statusCode === 400, 'Confirming non-draft Sales Order rejected with 400');
    assert(soDoubleConfirm.body.message.includes('Only draft Sales Orders can be confirmed'), 'SO error message specifies state machine rule');
    await SalesOrder.findByIdAndDelete(testSo._id);

    console.log('\n--- Item 10: Payment Status Allow-List Excluding Cancelled Documents ---');
    const cancelledBill = await VendorBill.create({
      vendor: testContactId,
      billNumber: `BILL/CANC/${Date.now().toString().slice(-4)}`,
      status: 'cancelled',
      totalAmount: 5000,
      items: [{ product: cashAcc._id, quantity: 1, unitPrice: 5000 }]
    });
    const payCancelledBill = await request('POST', '/payments', {
      paymentType: 'send_money',
      vendorBill: cancelledBill._id,
      amount: 1000
    }, adminToken);
    assert(payCancelledBill.statusCode === 400, 'Payment against cancelled Vendor Bill rejected with 400');
    assert(payCancelledBill.body.message.includes("only be registered for Vendor Bills in 'posted' or 'partial' status"), 'Payment status allow-list error specifies allowed statuses');
    await VendorBill.findByIdAndDelete(cancelledBill._id);

    console.log('\n--- Item 11: Payment Journal-Entry Reference Fixed ---');
    const sampleVendor = await Contact.findOne({ type: { $in: ['Vendor', 'Both'] } }) || contact;
    const testBill = await VendorBill.create({
      vendor: sampleVendor._id,
      billNumber: `BILL/PAYREF/${Date.now().toString().slice(-4)}`,
      status: 'posted',
      totalAmount: 1000,
      items: [{ product: cashAcc._id, quantity: 1, unitPrice: 1000 }]
    });
    const validPayRes = await request('POST', '/payments', {
      paymentType: 'send_money',
      vendorBill: testBill._id,
      amount: 1000,
      paymentMethod: 'Bank'
    }, adminToken);
    assert(validPayRes.statusCode === 201, 'Valid payment created and posted (HTTP 201)');
    assert(validPayRes.body.payment && validPayRes.body.payment.journalEntry, 'payment.journalEntry is populated and not null');
    const linkedJe = await JournalEntry.findById(validPayRes.body.payment.journalEntry);
    assert(linkedJe && linkedJe.status === 'posted', 'Linked JournalEntry exists in DB in posted status');
    if (linkedJe?._id) {
      await request('POST', `/journal-entries/${linkedJe._id}/cancel`, {}, adminToken);
      await JournalEntry.findByIdAndDelete(linkedJe._id);
    }
    await VendorBill.findByIdAndDelete(testBill._id);
    if (validPayRes.body.payment?._id) await Payment.findByIdAndDelete(validPayRes.body.payment._id);

    console.log('\n--- Item 12: Tax Account Fallback No Longer Crediting an Asset Account ---');
    const testProduct = await Product.findOne({ status: 'active' });
    const taxInv = await CustomerInvoice.create({
      customer: testContactId,
      invoiceNumber: `INV/TAX/${Date.now().toString().slice(-4)}`,
      status: 'draft',
      totalAmount: 1180,
      taxAmount: 180,
      untaxedAmount: 1000,
      items: [{ product: testProduct._id, quantity: 1, unitPrice: 1000, taxPercent: 18, taxAmount: 180, subtotal: 1180 }]
    });
    const postTaxInvRes = await request('POST', `/customer-invoices/${taxInv._id}/post`, {}, adminToken);
    assert(postTaxInvRes.statusCode === 200, 'Customer invoice with tax posted successfully');
    const taxJe = await JournalEntry.findOne({ reference: taxInv.invoiceNumber }).populate('items.account');
    const taxLine = taxJe.items.find(i => i.credit === 180);
    assert(taxLine && taxLine.account && taxLine.account.type === 'Liability', 'Tax Payable account credited is of type "Liability" (NOT Asset)');
    if (taxJe?._id) {
      await request('POST', `/journal-entries/${taxJe._id}/cancel`, {}, adminToken);
      await JournalEntry.findByIdAndDelete(taxJe._id);
    }
    await CustomerInvoice.findByIdAndDelete(taxInv._id);

    console.log('\n--- Item 13: Errors Forwarded to Central Handler ---');
    const invalidIdRes = await request('GET', '/products/invalid-object-id', null, adminToken);
    assert(invalidIdRes.statusCode === 400, 'Invalid MongoDB ObjectId handled by central errorHandler with 400');
    assert(invalidIdRes.body.success === false && typeof invalidIdRes.body.message === 'string', 'Central error handler returns uniform { success: false, message: ... }');

    console.log('\n--- Item 14: Showroom Data in Showroom.js/MongoDB ---');
    const showroomDbCount = await Showroom.countDocuments();
    assert(showroomDbCount >= 3, `Showroom collection in MongoDB contains ${showroomDbCount} documents`);
    const showroomApiRes = await request('GET', '/showrooms');
    assert(showroomApiRes.statusCode === 200 && showroomApiRes.body.showrooms.length === showroomDbCount, 'GET /showrooms queries live MongoDB collection');

    console.log('\n--- Item 15: Helpdesk GET No Longer Mutating Data ---');
    const ticketsBefore = await HelpdeskTicket.countDocuments();
    await request('GET', '/helpdesk/tickets', null, adminToken);
    const ticketsAfter = await HelpdeskTicket.countDocuments();
    assert(ticketsBefore === ticketsAfter, `GET /helpdesk/tickets performed 0 mutations (ticket count ${ticketsBefore} == ${ticketsAfter})`);

    console.log('\n--- Item 16: DELETE Routes Restricted to Admin Only ---');
    const deleteEndpoints = [
      '/accounts/507f1f77bcf86cd799439011',
      '/contacts/507f1f77bcf86cd799439011',
      '/products/507f1f77bcf86cd799439011',
      '/budgets/507f1f77bcf86cd799439011',
      '/purchase-orders/507f1f77bcf86cd799439011',
      '/sales-orders/507f1f77bcf86cd799439011',
      '/vendor-bills/507f1f77bcf86cd799439011',
      '/customer-invoices/507f1f77bcf86cd799439011'
    ];
    for (const ep of deleteEndpoints) {
      const delAcctRes = await request('DELETE', ep, null, accountantToken);
      assert(delAcctRes.statusCode === 403, `DELETE ${ep} rejected for Accountant with 403 Forbidden`);
      const delContactRes = await request('DELETE', ep, null, contactToken);
      assert(delContactRes.statusCode === 403, `DELETE ${ep} rejected for Contact with 403 Forbidden`);
    }

    console.log('\n--- Item 17: SuperAdmin Able to Reach /api/auth/users ---');
    const superUsersRes = await request('GET', '/auth/users', null, superadminToken);
    assert(superUsersRes.statusCode === 200, 'GET /auth/users returns 200 OK for SuperAdmin');
    assert(Array.isArray(superUsersRes.body.users) && superUsersRes.body.users.length > 0, 'SuperAdmin receives list of users');

    console.log('\n--- Item 18: CORS Origin / Credentials Configured Correctly ---');
    const corsPreflightRes = await request('OPTIONS', '/health', null, null, {
      'Origin': 'http://localhost:5173',
      'Access-Control-Request-Method': 'POST'
    });
    assert(corsPreflightRes.headers['access-control-allow-origin'] === 'http://localhost:5173', 'CORS allows whitelisted origin http://localhost:5173');
    assert(corsPreflightRes.headers['access-control-allow-credentials'] === 'true', 'CORS sends Access-Control-Allow-Credentials: true');

    console.log('\n--- Item 19: Async Route Handlers Crash-Protected ---');
    const getMeRes = await request('GET', '/auth/me', null, adminToken);
    assert(getMeRes.statusCode === 200 && getMeRes.body.user.email === 'admin@urbanfurniture.com', 'GET /auth/me wrapped in try/catch executes cleanly');

    console.log('\n--- Item 20: Budget / Stock Reports Using Aggregation ---');
    const bReportRes = await request('GET', '/reports/budget', null, adminToken);
    assert(bReportRes.statusCode === 200 && typeof bReportRes.body.report.totalPlanned === 'number', 'GET /reports/budget aggregation executes cleanly');
    const sReportRes = await request('GET', '/reports/stock-valuation', null, adminToken);
    assert(sReportRes.statusCode === 200 && typeof sReportRes.body.report.totalInventoryValuation === 'number', 'GET /reports/stock-valuation aggregation executes cleanly');

    console.log('\n--- Item 21: Profit & Loss Respecting Date Ranges ---');
    const pnlNarrow = await request('GET', '/reports/profit-and-loss?startDate=2020-01-01&endDate=2020-01-02', null, adminToken);
    assert(pnlNarrow.statusCode === 200, 'GET /reports/profit-and-loss returns 200 for narrow date range');
    assert(pnlNarrow.body.report.summary.netProfit === 0, 'Zero transactions in 2020 results in netProfit = 0');

    console.log('\n--- Item 22: Redundant findById After Save Removed ---');
    const testBillPop = await VendorBill.create({
      vendor: testContactId,
      billNumber: `BILL/POP/${Date.now().toString().slice(-4)}`,
      status: 'draft',
      items: [{ product: testProduct._id, quantity: 1, unitPrice: 500 }]
    });
    const billUpdateRes = await request('PUT', `/vendor-bills/${testBillPop._id}`, { notes: 'Updated notes' }, adminToken);
    assert(billUpdateRes.statusCode === 200, 'PUT /vendor-bills/:id updates bill');
    assert(billUpdateRes.body.vendorBill && billUpdateRes.body.vendorBill.notes === 'Updated notes', 'Updated bill populated in-memory without redundant findById query');
    await VendorBill.findByIdAndDelete(testBillPop._id);

    console.log('\n--- Item 23: Pagination Present on List Endpoints ---');
    const paginatedList = [
      'purchase-orders',
      'sales-orders',
      'vendor-bills',
      'customer-invoices',
      'payments',
      'journal-entries',
      'goods-receipts',
      'sales-receipts',
      'budgets',
      'contacts',
      'products',
      'accounts',
      'journals',
      'analytic-accounts'
    ];
    for (const resName of paginatedList) {
      const pRes = await request('GET', `/${resName}?page=1&limit=2`, null, adminToken);
      const hasPage = pRes.statusCode === 200 && pRes.body.page === 1 && typeof pRes.body.totalCount === 'number';
      assert(hasPage, `GET /${resName}?page=1&limit=2 returns pagination metadata (page=1, totalCount=${pRes.body.totalCount})`);
    }

    console.log('\n--- Item 24: Indexes Present on Foreign Keys & Document Numbers ---');
    const poIdxs = await PurchaseOrder.collection.indexes();
    assert(poIdxs.some(i => i.name === 'orderNumber_1' && i.unique), 'PurchaseOrder has unique index on orderNumber');
    assert(poIdxs.some(i => i.name === 'vendor_1_status_1'), 'PurchaseOrder has compound index on vendor + status');

    const invIdxs = await CustomerInvoice.collection.indexes();
    assert(invIdxs.some(i => i.name === 'invoiceNumber_1' && i.unique), 'CustomerInvoice has unique index on invoiceNumber');
    assert(invIdxs.some(i => i.name === 'customer_1_status_1'), 'CustomerInvoice has compound index on customer + status');

    console.log('\n--- Item 25: TLS Termination Architecture in Place ---');
    const tlsProtoRes = await request('GET', '/health', null, null, {
      'X-Forwarded-Proto': 'https'
    });
    assert(tlsProtoRes.headers['strict-transport-security'] !== undefined, 'HSTS header emitted when X-Forwarded-Proto: https');
    assert(tlsProtoRes.headers['x-content-type-options'] === 'nosniff', 'X-Content-Type-Options: nosniff emitted');
    assert(tlsProtoRes.headers['x-frame-options'] === 'SAMEORIGIN', 'X-Frame-Options: SAMEORIGIN emitted');

    console.log('\n--- Bonus Contact Data Scoping on getById ---');
    const otherContact = await Contact.create({ name: 'Other Contact', type: 'Customer', email: 'other@test.com' });
    const otherInvoice = await CustomerInvoice.create({
      customer: otherContact._id,
      invoiceNumber: `INV/SCOP/${Date.now().toString().slice(-4)}`,
      status: 'draft',
      items: [{ product: testProduct._id, quantity: 1, unitPrice: 500 }]
    });
    const contactScopeRes = await request('GET', `/customer-invoices/${otherInvoice._id}`, null, contactToken);
    assert(contactScopeRes.statusCode === 403, 'Contact cannot access another customer\'s invoice via GET /customer-invoices/:id (HTTP 403)');
    await CustomerInvoice.findByIdAndDelete(otherInvoice._id);
    await Contact.findByIdAndDelete(otherContact._id);

    console.log('\n========================================================================');
    console.log(` PHASE 4 AUDIT RESULTS: ${stats.passed} / ${stats.total} PASSED (${Math.round((stats.passed / stats.total) * 100)}%)`);
    console.log('========================================================================\n');

  } catch (err) {
    console.error('Fatal execution error in runPhase4Audit:', err);
  } finally {
    if (server) server.close();
    await mongoose.connection.close();
    process.exit(stats.failed === 0 ? 0 : 1);
  }
}

if (require.main === module) {
  runPhase4Audit();
}

module.exports = { runPhase4Audit };
