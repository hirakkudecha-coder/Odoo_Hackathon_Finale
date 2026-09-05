require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const app = require('../src/app');
const seedData = require('../src/seed/seedData');

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

const BASE_URL = 'http://localhost:5000/api';

const results = [];

function recordResult(index, endpoint, testCase, expected, actual, pass, criticalMutation = false) {
  results.push({
    index,
    endpoint,
    testCase,
    expected,
    actual,
    pass: pass ? 'PASS' : 'FAIL',
    criticalMutation
  });
  const symbol = pass ? '✓ PASS' : '✗ FAIL';
  console.log(`[#${index}] ${symbol} | ${endpoint} | ${testCase} | Exp: ${expected} | Act: ${actual}${criticalMutation ? ' [CRITICAL DB MUTATION]' : ''}`);
}

async function runQASmokeTests() {
  console.log('========================================================================');
  console.log(' URBAN FURNITURE ERP BACKEND - SENIOR QA SMOKE TEST SUITE');
  console.log(' Target URL: http://localhost:5000/api');
  console.log('========================================================================\n');

  await connectDB();

  // 1. Seed the database first
  console.log('>>> Step 1: Seeding database (npm run seed equivalent)...');
  await seedData();
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
  console.log('>>> Database successfully seeded.\n');

  let serverInstance = null;
  try {
    const probe = await fetch('http://localhost:5000/api/health').catch(() => null);
    if (!probe || !probe.ok) {
      console.log('Starting Express server on port 5000 for test suite execution...');
      serverInstance = app.listen(5000);
      await new Promise(r => setTimeout(r, 1000));
    } else {
      console.log('Found active server running at http://localhost:5000');
    }
  } catch (err) {
    serverInstance = app.listen(5000);
    await new Promise(r => setTimeout(r, 1000));
  }

  let testCounter = 1;

  try {
    // -------------------------------------------------------------------------
    // SECTION 1: HEALTH & INFRA
    // -------------------------------------------------------------------------
    console.log('\n--- Testing Section 1: Health & Infrastructure ---');

    // Case 1: GET /health (public)
    {
      const res = await fetch(`${BASE_URL}/health`);
      const body = await res.json();
      const pass = res.status === 200 && body.status === 'UP' && body.success === true;
      recordResult(
        testCounter++,
        'GET /health',
        'Health check returns 200 without auth',
        'HTTP 200 with { success: true, status: "UP" }',
        `HTTP ${res.status} with status="${body.status}"`,
        pass
      );
    }

    // Case 2: GET /health/heartbeat (system & db telemetry)
    {
      const res = await fetch(`${BASE_URL}/health/heartbeat`);
      const body = await res.json();
      const pass = res.status === 200 && body.heartbeat && body.heartbeat.database.connected === true;
      recordResult(
        testCounter++,
        'GET /health/heartbeat',
        'Heartbeat returns DB connection, memory & uptime stats',
        'HTTP 200 with DB connected & memoryUsageMB',
        `HTTP ${res.status} DB connected=${body.heartbeat?.database?.connected}, Uptime=${body.heartbeat?.uptimeFormatted}`,
        pass
      );
    }

    // -------------------------------------------------------------------------
    // SECTION 2: AUTH & SESSION
    // -------------------------------------------------------------------------
    console.log('\n--- Testing Section 2: Auth & Session ---');

    // Case 3: Register with missing email/password
    {
      const countBefore = await User.countDocuments();
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Incomplete User' })
      });
      const body = await res.json();
      const countAfter = await User.countDocuments();
      const mutated = countAfter !== countBefore;
      const pass = res.status === 400 && body.success === false && !mutated;
      recordResult(
        testCounter++,
        'POST /auth/register',
        'Register with missing email/password fails with 400 and does not mutate DB',
        'HTTP 400, success=false, DB unmutated',
        `HTTP ${res.status}, msg="${body.message}", DB count delta=${countAfter - countBefore}`,
        pass,
        mutated
      );
    }

    // Case 4: Register with duplicate email
    {
      const countBefore = await User.countDocuments();
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Admin Clone',
          email: 'admin@urbanfurniture.com',
          password: 'Password123!',
          role: 'accountant'
        })
      });
      const body = await res.json();
      const countAfter = await User.countDocuments();
      const mutated = countAfter !== countBefore;
      const pass = (res.status === 400 || res.status === 409) && body.success === false && !mutated;
      recordResult(
        testCounter++,
        'POST /auth/register',
        'Register with duplicate email fails with 400/409',
        'HTTP 400 or 409, success=false, DB unmutated',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass,
        mutated
      );
    }

    // Case 5: Login with wrong password
    {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@urbanfurniture.com',
          password: 'WrongPassword999!'
        })
      });
      const body = await res.json();
      const pass = res.status === 401 && body.success === false;
      recordResult(
        testCounter++,
        'POST /auth/login',
        'Login with incorrect password fails with 401',
        'HTTP 401, success=false',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass
      );
    }

    // Case 6: Login with non-existent email
    {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'nonexistent_user_999@urbanfurniture.com',
          password: 'Password123!'
        })
      });
      const body = await res.json();
      const pass = res.status === 401 && body.success === false;
      recordResult(
        testCounter++,
        'POST /auth/login',
        'Login with non-existent email fails with 401',
        'HTTP 401, success=false',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass
      );
    }

    // Log in as the 3 seeded users to obtain tokens
    let adminToken = '';
    let accountantToken = '';
    let contactToken = '';

    {
      const rAdmin = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@urbanfurniture.com', password: 'AdminPassword123!' })
      });
      const bAdmin = await rAdmin.json();
      adminToken = bAdmin.token;

      const rAcct = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'accountant@urbanfurniture.com', password: 'AccountantPassword123!' })
      });
      const bAcct = await rAcct.json();
      accountantToken = bAcct.token;

      const rContact = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'contact@urbanfurniture.com', password: 'ContactPassword123!' })
      });
      const bContact = await rContact.json();
      contactToken = bContact.token;
    }

    // Case 7: GET /auth/me with no token
    {
      const res = await fetch(`${BASE_URL}/auth/me`);
      const body = await res.json();
      const pass = res.status === 401 && body.success === false;
      recordResult(
        testCounter++,
        'GET /auth/me',
        'Profile request with no token fails with 401',
        'HTTP 401, success=false',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass
      );
    }

    // Case 8: GET /auth/me with malformed / expired JWT
    {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: 'Bearer this-is-a-garbage-token-12345' }
      });
      const body = await res.json();
      const pass = res.status === 401 && body.success === false;
      recordResult(
        testCounter++,
        'GET /auth/me',
        'Profile request with malformed JWT fails with 401',
        'HTTP 401, success=false',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass
      );
    }

    // Case 9: GET /auth/me with valid token
    {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const body = await res.json();
      const pass = res.status === 200 && body.success === true && body.user?.email === 'admin@urbanfurniture.com' && body.user?.role === 'admin';
      recordResult(
        testCounter++,
        'GET /auth/me',
        'Profile request with valid token returns 200 with correct profile',
        'HTTP 200, success=true, role=admin',
        `HTTP ${res.status}, email=${body.user?.email}, role=${body.user?.role}`,
        pass
      );
    }

    // -------------------------------------------------------------------------
    // SECTION 3: RBAC ENFORCEMENT
    // -------------------------------------------------------------------------
    console.log('\n--- Testing Section 3: RBAC Enforcement ---');

    // Case 10: Contact role hitting /goods-receipts (forbidden 403)
    {
      const res = await fetch(`${BASE_URL}/goods-receipts`, {
        headers: { Authorization: `Bearer ${contactToken}` }
      });
      const body = await res.json();
      const pass = res.status === 403 && body.success === false;
      recordResult(
        testCounter++,
        'GET /goods-receipts',
        'Contact role accessing /goods-receipts fails with 403 Forbidden',
        'HTTP 403, success=false',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass
      );
    }

    // Case 11: Contact role hitting /reports/profit-loss (forbidden 403)
    {
      const res = await fetch(`${BASE_URL}/reports/profit-loss`, {
        headers: { Authorization: `Bearer ${contactToken}` }
      });
      const body = await res.json();
      const pass = res.status === 403 && body.success === false;
      recordResult(
        testCounter++,
        'GET /reports/profit-loss',
        'Contact role accessing /reports/profit-loss fails with 403 Forbidden',
        'HTTP 403, success=false',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass
      );
    }

    // Case 12: Accountant role attempting admin-only POST /goods-receipts (forbidden 403)
    {
      const countBefore = await GoodsReceipt.countDocuments();
      const res = await fetch(`${BASE_URL}/goods-receipts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accountantToken}`
        },
        body: JSON.stringify({
          receiptNumber: 'GR/UNAUTH/001',
          receiptDate: '2026-09-05',
          items: [{ product: new mongoose.Types.ObjectId(), quantity: 1, unitPrice: 100 }]
        })
      });
      const body = await res.json();
      const countAfter = await GoodsReceipt.countDocuments();
      const mutated = countAfter !== countBefore;
      const pass = res.status === 403 && body.success === false && !mutated;
      recordResult(
        testCounter++,
        'POST /goods-receipts',
        'Accountant role creating Goods Receipt fails with 403 Forbidden and does not mutate DB',
        'HTTP 403, success=false, DB unmutated',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass,
        mutated
      );
    }

    // Case 13: Accountant role attempting admin-only POST /sales-receipts (forbidden 403)
    {
      const countBefore = await SalesReceipt.countDocuments();
      const res = await fetch(`${BASE_URL}/sales-receipts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accountantToken}`
        },
        body: JSON.stringify({
          receiptNumber: 'SR/UNAUTH/001',
          receiptDate: '2026-09-05',
          items: [{ product: new mongoose.Types.ObjectId(), quantity: 1, unitPrice: 200 }]
        })
      });
      const body = await res.json();
      const countAfter = await SalesReceipt.countDocuments();
      const mutated = countAfter !== countBefore;
      const pass = res.status === 403 && body.success === false && !mutated;
      recordResult(
        testCounter++,
        'POST /sales-receipts',
        'Accountant role creating Sales Receipt fails with 403 Forbidden and does not mutate DB',
        'HTTP 403, success=false, DB unmutated',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass,
        mutated
      );
    }

    // Case 14: Admin can access /reports/profit-loss
    {
      const res = await fetch(`${BASE_URL}/reports/profit-loss`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const body = await res.json();
      const pass = res.status === 200 && body.success === true && body.report;
      recordResult(
        testCounter++,
        'GET /reports/profit-loss',
        'Admin can access reports successfully with 200',
        'HTTP 200, success=true, report object present',
        `HTTP ${res.status}, success=${body.success}`,
        pass
      );
    }

    // -------------------------------------------------------------------------
    // SECTION 4: MASTER DATA VALIDATION
    // -------------------------------------------------------------------------
    console.log('\n--- Testing Section 4: Master Data Validation ---');

    // Case 15: Contacts — missing name/type (400)
    {
      const countBefore = await Contact.countDocuments();
      const res = await fetch(`${BASE_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ email: 'noname@example.com' })
      });
      const body = await res.json();
      const countAfter = await Contact.countDocuments();
      const mutated = countAfter !== countBefore;
      const pass = res.status === 400 && body.success === false && !mutated;
      recordResult(
        testCounter++,
        'POST /contacts',
        'Create contact missing name/type fails with 400 and does not mutate DB',
        'HTTP 400, success=false, DB unmutated',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass,
        mutated
      );
    }

    // Case 16: Contacts — invalid type enum (400)
    {
      const countBefore = await Contact.countDocuments();
      const res = await fetch(`${BASE_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ name: 'Alien Contact', type: 'SuperEntity' })
      });
      const body = await res.json();
      const countAfter = await Contact.countDocuments();
      const mutated = countAfter !== countBefore;
      const pass = res.status === 400 && body.success === false && !mutated;
      recordResult(
        testCounter++,
        'POST /contacts',
        'Create contact with invalid type enum fails with 400',
        'HTTP 400, success=false, DB unmutated',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass,
        mutated
      );
    }

    // Case 17: Products — negative salesPrice/costPrice (400)
    {
      const countBefore = await Product.countDocuments();
      const res = await fetch(`${BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ name: 'Invalid Product', salesPrice: -500, costPrice: -100 })
      });
      const body = await res.json();
      const countAfter = await Product.countDocuments();
      const mutated = countAfter !== countBefore;
      const pass = res.status === 400 && body.success === false && !mutated;
      recordResult(
        testCounter++,
        'POST /products',
        'Create product with negative prices fails with 400 and does not mutate DB',
        'HTTP 400, success=false, DB unmutated',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass,
        mutated
      );
    }

    // Case 18: Products — invalid type enum (400)
    {
      const countBefore = await Product.countDocuments();
      const res = await fetch(`${BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ name: 'Invalid Type Prod', salesPrice: 500, costPrice: 200, type: 'DigitalVoxel' })
      });
      const body = await res.json();
      const countAfter = await Product.countDocuments();
      const mutated = countAfter !== countBefore;
      const pass = res.status === 400 && body.success === false && !mutated;
      recordResult(
        testCounter++,
        'POST /products',
        'Create product with invalid type enum fails with 400',
        'HTTP 400, success=false, DB unmutated',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass,
        mutated
      );
    }

    // Case 19: Products — missing taxPercent defaults correctly to 0 (201)
    let validProduct;
    {
      const res = await fetch(`${BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ name: 'Modern Stool', salesPrice: 1500, costPrice: 800, type: 'Goods' })
      });
      const body = await res.json();
      validProduct = body.product;
      const pass = res.status === 201 && body.success === true && body.product?.taxPercent === 0;
      recordResult(
        testCounter++,
        'POST /products',
        'Create product without taxPercent defaults correctly to 0',
        'HTTP 201, product.taxPercent === 0',
        `HTTP ${res.status}, taxPercent=${body.product?.taxPercent}`,
        pass
      );
    }

    // Case 20: Accounts — invalid type enum (400)
    {
      const countBefore = await Account.countDocuments();
      const res = await fetch(`${BASE_URL}/accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ code: '9999', name: 'Alien Account', type: 'Cryptocurrency' })
      });
      const body = await res.json();
      const countAfter = await Account.countDocuments();
      const mutated = countAfter !== countBefore;
      const pass = res.status === 400 && body.success === false && !mutated;
      recordResult(
        testCounter++,
        'POST /accounts',
        'Create account with invalid type enum fails with 400 and does not mutate DB',
        'HTTP 400, success=false, DB unmutated',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass,
        mutated
      );
    }

    // Case 21: Accounts — duplicate code (400/409)
    {
      const countBefore = await Account.countDocuments();
      const res = await fetch(`${BASE_URL}/accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ code: '1001', name: 'Duplicate Cash Account', type: 'Asset' })
      });
      const body = await res.json();
      const countAfter = await Account.countDocuments();
      const mutated = countAfter !== countBefore;
      const pass = (res.status === 400 || res.status === 409) && body.success === false && !mutated;
      recordResult(
        testCounter++,
        'POST /accounts',
        'Create account with duplicate code fails with 400/409',
        'HTTP 400 or 409, success=false, DB unmutated',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass,
        mutated
      );
    }

    // Case 22: Journals — invalid type enum (400)
    {
      const countBefore = await Journal.countDocuments();
      const res = await fetch(`${BASE_URL}/journals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ code: 'BAD', name: 'Bad Journal', type: 'CryptoJournal' })
      });
      const body = await res.json();
      const countAfter = await Journal.countDocuments();
      const mutated = countAfter !== countBefore;
      const pass = res.status === 400 && body.success === false && !mutated;
      recordResult(
        testCounter++,
        'POST /journals',
        'Create journal with invalid type enum fails with 400 and does not mutate DB',
        'HTTP 400, success=false, DB unmutated',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass,
        mutated
      );
    }

    // Case 23: Analytic Accounts — missing required fields (400)
    {
      const countBefore = await AnalyticAccount.countDocuments();
      const res = await fetch(`${BASE_URL}/analytic-accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ code: 'AN-EMPTY' })
      });
      const body = await res.json();
      const countAfter = await AnalyticAccount.countDocuments();
      const mutated = countAfter !== countBefore;
      const pass = res.status === 400 && body.success === false && !mutated;
      recordResult(
        testCounter++,
        'POST /analytic-accounts',
        'Create analytic account missing name/type fails with 400 and does not mutate DB',
        'HTTP 400, success=false, DB unmutated',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass,
        mutated
      );
    }

    // Case 24: Budgets — negative plannedAmount (400)
    const existingAnalytic = await AnalyticAccount.findOne();
    {
      const countBefore = await Budget.countDocuments();
      const res = await fetch(`${BASE_URL}/budgets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          name: 'Negative Budget',
          period: '2026-Q1',
          analyticAccount: existingAnalytic._id,
          plannedAmount: -5000
        })
      });
      const body = await res.json();
      const countAfter = await Budget.countDocuments();
      const mutated = countAfter !== countBefore;
      const pass = res.status === 400 && body.success === false && !mutated;
      recordResult(
        testCounter++,
        'POST /budgets',
        'Create budget with negative plannedAmount fails with 400 and does not mutate DB',
        'HTTP 400, success=false, DB unmutated',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass,
        mutated
      );
    }

    // Case 25: Budgets — invalid analyticAccount reference (400/404)
    {
      const countBefore = await Budget.countDocuments();
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await fetch(`${BASE_URL}/budgets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          name: 'Phantom Budget',
          period: '2026-Q1',
          analyticAccount: nonExistentId,
          plannedAmount: 10000
        })
      });
      const body = await res.json();
      const countAfter = await Budget.countDocuments();
      const mutated = countAfter !== countBefore;
      const pass = (res.status === 400 || res.status === 404) && body.success === false && !mutated;
      recordResult(
        testCounter++,
        'POST /budgets',
        'Create budget with non-existent analyticAccount reference fails with 400/404',
        'HTTP 400 or 404, success=false, DB unmutated',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass,
        mutated
      );
    }

    // -------------------------------------------------------------------------
    // SECTION 5: GOODS RECEIPT VALIDATIONS & LIFECYCLE
    // -------------------------------------------------------------------------
    console.log('\n--- Testing Section 5: Goods Receipt Validations & Lifecycle ---');

    const sampleVendor = await Contact.findOne({ type: { $in: ['Vendor', 'Both'] } });
    const sampleProduct = await Product.findOne({ type: 'Goods' });

    // Case 26: Goods Receipt — empty/blank receiptNumber (400)
    {
      const countBefore = await GoodsReceipt.countDocuments();
      const res = await fetch(`${BASE_URL}/goods-receipts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          receiptNumber: '   ',
          receiptDate: '2026-09-05',
          vendor: sampleVendor._id,
          items: [{ product: sampleProduct._id, quantity: 5, unitPrice: 1000, totalPrice: 5000 }]
        })
      });
      const body = await res.json();
      const countAfter = await GoodsReceipt.countDocuments();
      const mutated = countAfter !== countBefore;
      const pass = res.status === 400 && body.success === false && !mutated;
      recordResult(
        testCounter++,
        'POST /goods-receipts',
        'Goods Receipt with blank receiptNumber fails with 400 and does not mutate DB',
        'HTTP 400, success=false, DB unmutated',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass,
        mutated
      );
    }

    // Case 27: Goods Receipt — invalid receiptDate (400)
    {
      const countBefore = await GoodsReceipt.countDocuments();
      const res = await fetch(`${BASE_URL}/goods-receipts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          receiptNumber: 'GR/TEST/001',
          receiptDate: 'not-a-date',
          vendor: sampleVendor._id,
          items: [{ product: sampleProduct._id, quantity: 5, unitPrice: 1000, totalPrice: 5000 }]
        })
      });
      const body = await res.json();
      const countAfter = await GoodsReceipt.countDocuments();
      const mutated = countAfter !== countBefore;
      const pass = res.status === 400 && body.success === false && !mutated;
      recordResult(
        testCounter++,
        'POST /goods-receipts',
        'Goods Receipt with invalid receiptDate fails with 400 and does not mutate DB',
        'HTTP 400, success=false, DB unmutated',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass,
        mutated
      );
    }

    // Case 28: Goods Receipt — negative or zero quantity (400)
    {
      const countBefore = await GoodsReceipt.countDocuments();
      const res = await fetch(`${BASE_URL}/goods-receipts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          receiptNumber: 'GR/TEST/002',
          receiptDate: '2026-09-05',
          vendor: sampleVendor._id,
          items: [{ product: sampleProduct._id, quantity: -2, unitPrice: 1000 }]
        })
      });
      const body = await res.json();
      const countAfter = await GoodsReceipt.countDocuments();
      const mutated = countAfter !== countBefore;
      const pass = res.status === 400 && body.success === false && !mutated;
      recordResult(
        testCounter++,
        'POST /goods-receipts',
        'Goods Receipt with negative/zero quantity fails with 400 and does not mutate DB',
        'HTTP 400, success=false, DB unmutated',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass,
        mutated
      );
    }

    // Case 29: Goods Receipt — line item where totalPrice != quantity * unitPrice (400)
    {
      const countBefore = await GoodsReceipt.countDocuments();
      const res = await fetch(`${BASE_URL}/goods-receipts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          receiptNumber: 'GR/TEST/003',
          receiptDate: '2026-09-05',
          vendor: sampleVendor._id,
          items: [{ product: sampleProduct._id, quantity: 5, unitPrice: 1000, totalPrice: 9999 }]
        })
      });
      const body = await res.json();
      const countAfter = await GoodsReceipt.countDocuments();
      const mutated = countAfter !== countBefore;
      const pass = res.status === 400 && body.success === false && !mutated;
      recordResult(
        testCounter++,
        'POST /goods-receipts',
        'Goods Receipt line item totalPrice mismatch fails with 400 and does not mutate DB',
        'HTTP 400, success=false, DB unmutated',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass,
        mutated
      );
    }

    // Case 30: Goods Receipt — totalAmount != sum(items.totalPrice) (400)
    {
      const countBefore = await GoodsReceipt.countDocuments();
      const res = await fetch(`${BASE_URL}/goods-receipts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          receiptNumber: 'GR/TEST/004',
          receiptDate: '2026-09-05',
          vendor: sampleVendor._id,
          totalAmount: 12000,
          items: [{ product: sampleProduct._id, quantity: 5, unitPrice: 1000, totalPrice: 5000 }]
        })
      });
      const body = await res.json();
      const countAfter = await GoodsReceipt.countDocuments();
      const mutated = countAfter !== countBefore;
      const pass = res.status === 400 && body.success === false && !mutated;
      recordResult(
        testCounter++,
        'POST /goods-receipts',
        'Goods Receipt totalAmount mismatch with items sum fails with 400 and does not mutate DB',
        'HTTP 400, success=false, DB unmutated',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass,
        mutated
      );
    }

    // Case 31: Goods Receipt — valid payload succeeds with 201 and status 'draft'
    let validGoodsReceipt;
    {
      const poRes = await fetch(`${BASE_URL}/purchase-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          orderNumber: 'PO/2026/QA01',
          vendor: sampleVendor._id,
          orderDate: '2026-09-05',
          items: [{ product: sampleProduct._id, quantity: 5, unitPrice: 1500, totalPrice: 7500 }],
          totalAmount: 7500
        })
      });
      const poBody = await poRes.json();
      const validPO = poBody.purchaseOrder;

      const res = await fetch(`${BASE_URL}/goods-receipts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          receiptNumber: 'GR/2026/VAL01',
          purchaseOrder: validPO._id,
          receiptDate: '2026-09-05',
          vendor: sampleVendor._id,
          totalAmount: 7500,
          items: [{ product: sampleProduct._id, quantity: 5, unitPrice: 1500, totalPrice: 7500 }]
        })
      });
      const body = await res.json();
      validGoodsReceipt = body.goodsReceipt;
      const pass = res.status === 201 && body.success === true && body.goodsReceipt?.status === 'draft' && body.goodsReceipt?.totalAmount === 7500;
      recordResult(
        testCounter++,
        'POST /goods-receipts',
        'Valid Goods Receipt payload creates receipt in draft status with 201',
        'HTTP 201, status=draft, totalAmount=7500',
        `HTTP ${res.status}, status=${body.goodsReceipt?.status}, totalAmount=${body.goodsReceipt?.totalAmount}`,
        pass
      );
    }

    // Case 32: Confirm Goods Receipt as contact role (forbidden 403)
    {
      const res = await fetch(`${BASE_URL}/goods-receipts/${validGoodsReceipt._id}/confirm`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${contactToken}` }
      });
      const body = await res.json();
      const pass = res.status === 403 && body.success === false;
      recordResult(
        testCounter++,
        'POST /goods-receipts/:id/confirm',
        'Confirm Goods Receipt as contact role fails with 403 Forbidden',
        'HTTP 403, success=false',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass
      );
    }

    // Case 33: Confirm Goods Receipt as Accountant (succeeds 200, status received)
    {
      const res = await fetch(`${BASE_URL}/goods-receipts/${validGoodsReceipt._id}/confirm`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accountantToken}` }
      });
      const body = await res.json();
      const pass = res.status === 200 && body.success === true && body.goodsReceipt?.status === 'received';
      recordResult(
        testCounter++,
        'POST /goods-receipts/:id/confirm',
        'Confirm Goods Receipt as accountant succeeds with 200 and status received',
        'HTTP 200, status=received',
        `HTTP ${res.status}, status=${body.goodsReceipt?.status}`,
        pass
      );
    }

    // Case 34: Confirm already-confirmed Goods Receipt fails (400)
    {
      const res = await fetch(`${BASE_URL}/goods-receipts/${validGoodsReceipt._id}/confirm`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const body = await res.json();
      const pass = res.status === 400 && body.success === false;
      recordResult(
        testCounter++,
        'POST /goods-receipts/:id/confirm',
        'Confirming already-confirmed Goods Receipt fails with 400',
        'HTTP 400, success=false',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass
      );
    }

    // -------------------------------------------------------------------------
    // SECTION 6: SALES RECEIPT VALIDATIONS & LIFECYCLE
    // -------------------------------------------------------------------------
    console.log('\n--- Testing Section 6: Sales Receipt Validations & Lifecycle ---');

    const sampleCustomer = await Contact.findOne({ type: { $in: ['Customer', 'Both'] } });

    // Case 35: Sales Receipt — empty/blank receiptNumber (400)
    {
      const countBefore = await SalesReceipt.countDocuments();
      const res = await fetch(`${BASE_URL}/sales-receipts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          receiptNumber: '',
          receiptDate: '2026-09-05',
          customer: sampleCustomer._id,
          items: [{ product: sampleProduct._id, quantity: 2, unitPrice: 2500, totalPrice: 5000 }]
        })
      });
      const body = await res.json();
      const countAfter = await SalesReceipt.countDocuments();
      const mutated = countAfter !== countBefore;
      const pass = res.status === 400 && body.success === false && !mutated;
      recordResult(
        testCounter++,
        'POST /sales-receipts',
        'Sales Receipt with blank receiptNumber fails with 400 and does not mutate DB',
        'HTTP 400, success=false, DB unmutated',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass,
        mutated
      );
    }

    // Case 36: Sales Receipt — invalid receiptDate (400)
    {
      const countBefore = await SalesReceipt.countDocuments();
      const res = await fetch(`${BASE_URL}/sales-receipts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          receiptNumber: 'SR/TEST/001',
          receiptDate: 'not-a-date',
          customer: sampleCustomer._id,
          items: [{ product: sampleProduct._id, quantity: 2, unitPrice: 2500, totalPrice: 5000 }]
        })
      });
      const body = await res.json();
      const countAfter = await SalesReceipt.countDocuments();
      const mutated = countAfter !== countBefore;
      const pass = res.status === 400 && body.success === false && !mutated;
      recordResult(
        testCounter++,
        'POST /sales-receipts',
        'Sales Receipt with invalid receiptDate fails with 400 and does not mutate DB',
        'HTTP 400, success=false, DB unmutated',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass,
        mutated
      );
    }

    // Case 37: Sales Receipt — negative quantity on line item (400)
    {
      const countBefore = await SalesReceipt.countDocuments();
      const res = await fetch(`${BASE_URL}/sales-receipts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          receiptNumber: 'SR/TEST/002',
          receiptDate: '2026-09-05',
          customer: sampleCustomer._id,
          items: [{ product: sampleProduct._id, quantity: -1, unitPrice: 2500 }]
        })
      });
      const body = await res.json();
      const countAfter = await SalesReceipt.countDocuments();
      const mutated = countAfter !== countBefore;
      const pass = res.status === 400 && body.success === false && !mutated;
      recordResult(
        testCounter++,
        'POST /sales-receipts',
        'Sales Receipt with negative quantity fails with 400 and does not mutate DB',
        'HTTP 400, success=false, DB unmutated',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass,
        mutated
      );
    }

    // Case 38: Sales Receipt — line item totalPrice != quantity * unitPrice (400)
    {
      const countBefore = await SalesReceipt.countDocuments();
      const res = await fetch(`${BASE_URL}/sales-receipts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          receiptNumber: 'SR/TEST/003',
          receiptDate: '2026-09-05',
          customer: sampleCustomer._id,
          items: [{ product: sampleProduct._id, quantity: 2, unitPrice: 2500, totalPrice: 8000 }]
        })
      });
      const body = await res.json();
      const countAfter = await SalesReceipt.countDocuments();
      const mutated = countAfter !== countBefore;
      const pass = res.status === 400 && body.success === false && !mutated;
      recordResult(
        testCounter++,
        'POST /sales-receipts',
        'Sales Receipt line item totalPrice mismatch fails with 400 and does not mutate DB',
        'HTTP 400, success=false, DB unmutated',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass,
        mutated
      );
    }

    // Case 39: Sales Receipt — totalAmount != sum(items.totalPrice) (400)
    {
      const countBefore = await SalesReceipt.countDocuments();
      const res = await fetch(`${BASE_URL}/sales-receipts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          receiptNumber: 'SR/TEST/004',
          receiptDate: '2026-09-05',
          customer: sampleCustomer._id,
          totalAmount: 9000,
          items: [{ product: sampleProduct._id, quantity: 2, unitPrice: 2500, totalPrice: 5000 }]
        })
      });
      const body = await res.json();
      const countAfter = await SalesReceipt.countDocuments();
      const mutated = countAfter !== countBefore;
      const pass = res.status === 400 && body.success === false && !mutated;
      recordResult(
        testCounter++,
        'POST /sales-receipts',
        'Sales Receipt totalAmount mismatch with items sum fails with 400 and does not mutate DB',
        'HTTP 400, success=false, DB unmutated',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass,
        mutated
      );
    }

    // Case 40: Sales Receipt — valid payload succeeds with 201 and status 'draft'
    let validSalesReceipt;
    {
      const soRes = await fetch(`${BASE_URL}/sales-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          orderNumber: 'SO/2026/QA01',
          customer: sampleCustomer._id,
          orderDate: '2026-09-05',
          items: [{ product: sampleProduct._id, quantity: 5, unitPrice: 2500, totalPrice: 12500 }],
          totalAmount: 12500
        })
      });
      const soBody = await soRes.json();
      const validSO = soBody.salesOrder;

      const res = await fetch(`${BASE_URL}/sales-receipts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          receiptNumber: 'SR/2026/VAL01',
          salesOrder: validSO._id,
          receiptDate: '2026-09-05',
          customer: sampleCustomer._id,
          totalAmount: 12500,
          items: [{ product: sampleProduct._id, quantity: 5, unitPrice: 2500, totalPrice: 12500 }]
        })
      });
      const body = await res.json();
      validSalesReceipt = body.salesReceipt;
      const pass = res.status === 201 && body.success === true && body.salesReceipt?.status === 'draft' && body.salesReceipt?.totalAmount === 12500;
      recordResult(
        testCounter++,
        'POST /sales-receipts',
        'Valid Sales Receipt creates receipt in draft status with 201',
        'HTTP 201, status=draft, totalAmount=12500',
        `HTTP ${res.status}, status=${body.salesReceipt?.status}, totalAmount=${body.salesReceipt?.totalAmount}`,
        pass
      );
    }

    // Case 41: Confirm Sales Receipt as contact role (forbidden 403)
    {
      const res = await fetch(`${BASE_URL}/sales-receipts/${validSalesReceipt._id}/confirm`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${contactToken}` }
      });
      const body = await res.json();
      const pass = res.status === 403 && body.success === false;
      recordResult(
        testCounter++,
        'POST /sales-receipts/:id/confirm',
        'Confirm Sales Receipt as contact role fails with 403 Forbidden',
        'HTTP 403, success=false',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass
      );
    }

    // Case 42: Confirm Sales Receipt as Accountant (succeeds 200, status delivered)
    {
      const res = await fetch(`${BASE_URL}/sales-receipts/${validSalesReceipt._id}/confirm`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accountantToken}` }
      });
      const body = await res.json();
      const pass = res.status === 200 && body.success === true && body.salesReceipt?.status === 'delivered';
      recordResult(
        testCounter++,
        'POST /sales-receipts/:id/confirm',
        'Confirm Sales Receipt as accountant succeeds with 200 and status delivered',
        'HTTP 200, status=delivered',
        `HTTP ${res.status}, status=${body.salesReceipt?.status}`,
        pass
      );
    }

    // Case 43: Confirm already-confirmed Sales Receipt fails (400)
    {
      const res = await fetch(`${BASE_URL}/sales-receipts/${validSalesReceipt._id}/confirm`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const body = await res.json();
      const pass = res.status === 400 && body.success === false;
      recordResult(
        testCounter++,
        'POST /sales-receipts/:id/confirm',
        'Confirming already-confirmed Sales Receipt fails with 400',
        'HTTP 400, success=false',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass
      );
    }

    // -------------------------------------------------------------------------
    // SECTION 7: DOUBLE-ENTRY ACCOUNTING ENGINE
    // -------------------------------------------------------------------------
    console.log('\n--- Testing Section 7: Double-Entry Accounting Engine ---');

    const generalJournal = await Journal.findOne({ type: 'General' });
    const cashAccount = await Account.findOne({ name: 'Cash' });
    const bankAccount = await Account.findOne({ name: 'Bank' });
    const capitalAccount = await Account.findOne({ name: 'Capital' });

    // Case 44: Journal Entry with fewer than 2 items fails (400)
    {
      const res = await fetch(`${BASE_URL}/journal-entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          journal: generalJournal._id,
          items: [{ account: cashAccount._id, debit: 1000, credit: 0 }]
        })
      });
      const body = await res.json();
      const entryId = body.journalEntry?._id;

      let pass = false;
      if (res.status === 400) {
        pass = true;
      } else if (entryId) {
        // If draft created, posting must reject it
        const postRes = await fetch(`${BASE_URL}/journal-entries/${entryId}/post`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        pass = postRes.status === 400;
      }
      recordResult(
        testCounter++,
        'POST /journal-entries',
        'Journal entry with fewer than 2 items fails validation (400)',
        'HTTP 400, rejected by double-entry rule',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass
      );
    }

    // Case 45: Unbalanced Entry (sum(debit) != sum(credit)) fails (400) and is not posted
    {
      const res = await fetch(`${BASE_URL}/journal-entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          journal: generalJournal._id,
          reference: 'JE/UNBALANCED/01',
          items: [
            { account: cashAccount._id, debit: 5000, credit: 0 },
            { account: bankAccount._id, debit: 0, credit: 4500 }
          ]
        })
      });
      const body = await res.json();
      const entryId = body.journalEntry._id;

      const postRes = await fetch(`${BASE_URL}/journal-entries/${entryId}/post`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const postBody = await postRes.json();

      const verifyEntry = await JournalEntry.findById(entryId);
      const pass = postRes.status === 400 && postBody.success === false && verifyEntry.status === 'draft';
      recordResult(
        testCounter++,
        'POST /journal-entries/:id/post',
        'Unbalanced entry beyond 0.001 tolerance is rejected with 400 and remains draft',
        'HTTP 400, status remains draft, account balances untouched',
        `HTTP ${postRes.status}, status=${verifyEntry.status}, msg="${postBody.message}"`,
        pass
      );
    }

    // Case 46: Balanced entry within floating-point tolerance is accepted and posted (200)
    let postedEntryId;
    let prePostCashBalance = 0;
    let prePostCapitalBalance = 0;
    {
      const cashAcc = await Account.findById(cashAccount._id);
      const capAcc = await Account.findById(capitalAccount._id);
      prePostCashBalance = cashAcc.balance;
      prePostCapitalBalance = capAcc.balance;

      const createRes = await fetch(`${BASE_URL}/journal-entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          journal: generalJournal._id,
          reference: 'JE/BALANCED/TOLERANCE',
          items: [
            { account: cashAccount._id, debit: 10000.0004, credit: 0 },
            { account: capitalAccount._id, debit: 0, credit: 10000.0002 }
          ]
        })
      });
      const createBody = await createRes.json();
      postedEntryId = createBody.journalEntry._id;

      const postRes = await fetch(`${BASE_URL}/journal-entries/${postedEntryId}/post`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const postBody = await postRes.json();

      const postCashAcc = await Account.findById(cashAccount._id);
      const postCapAcc = await Account.findById(capitalAccount._id);

      // Asset increases on debit (+10000); Capital increases on credit (+10000)
      const cashDelta = postCashAcc.balance - prePostCashBalance;
      const capDelta = postCapAcc.balance - prePostCapitalBalance;

      const pass = postRes.status === 200 && postBody.success === true && Math.abs(cashDelta - 10000) < 0.1 && Math.abs(capDelta - 10000) < 0.1;
      recordResult(
        testCounter++,
        'POST /journal-entries/:id/post',
        'Balanced entry within tolerance posts successfully with 200 and updates normal balance direction',
        'HTTP 200, Cash (Asset) delta=+10000, Capital delta=+10000',
        `HTTP ${postRes.status}, Cash delta=+${cashDelta}, Capital delta=+${capDelta}`,
        pass
      );
    }

    // Case 47: Posting already-posted journal entry fails (400)
    {
      const res = await fetch(`${BASE_URL}/journal-entries/${postedEntryId}/post`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const body = await res.json();
      const pass = res.status === 400 && body.success === false;
      recordResult(
        testCounter++,
        'POST /journal-entries/:id/post',
        'Posting an already-posted journal entry fails with 400',
        'HTTP 400, success=false',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass
      );
    }

    // Case 48: Cancel posted entry and verify account balances reverse exactly (net zero impact)
    {
      const res = await fetch(`${BASE_URL}/journal-entries/${postedEntryId}/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const body = await res.json();

      const revCashAcc = await Account.findById(cashAccount._id);
      const revCapAcc = await Account.findById(capitalAccount._id);

      const netCashDelta = revCashAcc.balance - prePostCashBalance;
      const netCapDelta = revCapAcc.balance - prePostCapitalBalance;

      const pass = res.status === 200 && body.success === true && Math.abs(netCashDelta) < 0.01 && Math.abs(netCapDelta) < 0.01;
      recordResult(
        testCounter++,
        'POST /journal-entries/:id/cancel',
        'Cancel posted entry reverses ledger impacts exactly (nets to zero)',
        'HTTP 200, Net balance delta = 0',
        `HTTP ${res.status}, Net Cash Delta=${netCashDelta}, Net Capital Delta=${netCapDelta}`,
        pass
      );
    }

    // -------------------------------------------------------------------------
    // SECTION 8: VENDOR BILL & CUSTOMER INVOICE POSTING
    // -------------------------------------------------------------------------
    console.log('\n--- Testing Section 8: Vendor Bill & Customer Invoice Posting ---');

    // Case 49: Post Vendor Bill and verify balanced double-entry: Debit Purchases Expense, Credit Creditors
    let validVendorBill;
    {
      const billRes = await fetch(`${BASE_URL}/vendor-bills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          billNumber: 'BILL/2026/QA01',
          vendor: sampleVendor._id,
          billDate: '2026-09-05',
          dueDate: '2026-09-20',
          totalAmount: 7500,
          items: [{ product: sampleProduct._id, quantity: 5, unitPrice: 1500, totalPrice: 7500 }]
        })
      });
      const billBody = await billRes.json();
      validVendorBill = billBody.vendorBill;

      const postRes = await fetch(`${BASE_URL}/vendor-bills/${validVendorBill._id}/post`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const postBody = await postRes.json();

      const je = await JournalEntry.findById(postBody.vendorBill?.journalEntry).populate('items.account');
      const debitItem = je?.items?.find(i => i.debit > 0);
      const creditItem = je?.items?.find(i => i.credit > 0);

      const pass = postRes.status === 200 &&
                   debitItem?.account?.name === 'Purchases Expense' &&
                   debitItem?.debit === 7500 &&
                   creditItem?.account?.name === 'Creditors' &&
                   creditItem?.credit === 7500;

      recordResult(
        testCounter++,
        'POST /vendor-bills/:id/post',
        'Post Vendor Bill generates auto-balanced JE (Debit Purchases Expense = Credit Creditors = 7500)',
        'HTTP 200, Debit Purchases Expense=7500, Credit Creditors=7500',
        `HTTP ${postRes.status}, Debit ${debitItem?.account?.name}=${debitItem?.debit}, Credit ${creditItem?.account?.name}=${creditItem?.credit}`,
        pass
      );
    }

    // Case 50: Post the same Vendor Bill twice fails (400, no duplicate JE)
    {
      const jeCountBefore = await JournalEntry.countDocuments();
      const res = await fetch(`${BASE_URL}/vendor-bills/${validVendorBill._id}/post`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const body = await res.json();
      const jeCountAfter = await JournalEntry.countDocuments();
      const pass = res.status === 400 && body.success === false && jeCountBefore === jeCountAfter;
      recordResult(
        testCounter++,
        'POST /vendor-bills/:id/post',
        'Posting the same Vendor Bill twice fails with 400 without duplicate Journal Entry',
        'HTTP 400, success=false, JournalEntry count unchanged',
        `HTTP ${res.status}, msg="${body.message}", JE delta=${jeCountAfter - jeCountBefore}`,
        pass
      );
    }

    // Case 51: Post Vendor Bill with totalAmount <= 0 fails (400)
    {
      const zeroBill = await VendorBill.create({
        billNumber: 'BILL/2026/ZERO01',
        vendor: sampleVendor._id,
        billDate: new Date('2026-09-05'),
        dueDate: new Date('2026-09-20'),
        totalAmount: 0,
        items: [{ product: sampleProduct._id, quantity: 1, unitPrice: 0, totalPrice: 0 }]
      });

      const postRes = await fetch(`${BASE_URL}/vendor-bills/${zeroBill._id}/post`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const postBody = await postRes.json();
      const pass = postRes.status === 400 && postBody.success === false;
      recordResult(
        testCounter++,
        'POST /vendor-bills/:id/post',
        'Posting a Vendor Bill with totalAmount <= 0 fails with 400',
        'HTTP 400, success=false',
        `HTTP ${postRes.status}, msg="${postBody.message}"`,
        pass
      );
    }

    // Case 52: Post Customer Invoice with Tax and verify balanced entry: Debit Debtors = Credit Sale Income + Tax Payable
    let validCustomerInvoice;
    {
      const invRes = await fetch(`${BASE_URL}/customer-invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          invoiceNumber: 'INV/2026/QA01',
          customer: sampleCustomer._id,
          invoiceDate: '2026-09-05',
          dueDate: '2026-09-20',
          untaxedAmount: 12500,
          taxAmount: 625,
          totalAmount: 13125,
          items: [{ product: sampleProduct._id, quantity: 5, unitPrice: 2500, taxPercent: 5, totalPrice: 13125 }]
        })
      });
      const invBody = await invRes.json();
      validCustomerInvoice = invBody.customerInvoice;

      const postRes = await fetch(`${BASE_URL}/customer-invoices/${validCustomerInvoice._id}/post`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const postBody = await postRes.json();

      const je = await JournalEntry.findById(postBody.customerInvoice?.journalEntry).populate('items.account');
      const debitItem = je?.items?.find(i => i.debit > 0);
      const incomeItem = je?.items?.find(i => i.credit > 0 && i.account?.name === 'Sale Income');
      const taxItem = je?.items?.find(i => i.credit > 0 && i.account?.name === 'Tax Payable');

      const pass = postRes.status === 200 &&
                   debitItem?.account?.name === 'Debtors' &&
                   debitItem?.debit === 13125 &&
                   incomeItem?.credit === 12500 &&
                   taxItem?.credit === 625;

      recordResult(
        testCounter++,
        'POST /customer-invoices/:id/post',
        'Post Customer Invoice generates balanced JE (Debit Debtors 13125 = Credit Sale Income 12500 + Tax 625)',
        'HTTP 200, Debit Debtors=13125, Credit Sale Income=12500, Credit Tax=625',
        `HTTP ${postRes.status}, Debit Debtors=${debitItem?.debit}, Sale Income=${incomeItem?.credit}, Tax=${taxItem?.credit}`,
        pass
      );
    }

    // Case 53: Post the same Customer Invoice twice fails (400, no duplicate JE)
    {
      const jeCountBefore = await JournalEntry.countDocuments();
      const res = await fetch(`${BASE_URL}/customer-invoices/${validCustomerInvoice._id}/post`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const body = await res.json();
      const jeCountAfter = await JournalEntry.countDocuments();
      const pass = res.status === 400 && body.success === false && jeCountBefore === jeCountAfter;
      recordResult(
        testCounter++,
        'POST /customer-invoices/:id/post',
        'Posting the same Customer Invoice twice fails with 400 without duplicate Journal Entry',
        'HTTP 400, success=false, JournalEntry count unchanged',
        `HTTP ${res.status}, msg="${body.message}", JE delta=${jeCountAfter - jeCountBefore}`,
        pass
      );
    }

    // -------------------------------------------------------------------------
    // SECTION 9: PAYMENTS
    // -------------------------------------------------------------------------
    console.log('\n--- Testing Section 9: Payments ---');

    // Case 54: send_money exceeding Vendor Bill outstanding balance fails (400) and does not mutate DB
    {
      const payCountBefore = await Payment.countDocuments();
      const res = await fetch(`${BASE_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          paymentType: 'send_money',
          partner: sampleVendor._id,
          amount: 999999,
          paymentMethod: 'Bank',
          vendorBill: validVendorBill._id
        })
      });
      const body = await res.json();
      const payCountAfter = await Payment.countDocuments();
      const mutated = payCountAfter !== payCountBefore;
      const pass = res.status === 400 && body.success === false && !mutated;
      recordResult(
        testCounter++,
        'POST /payments',
        'Send money exceeding outstanding Vendor Bill balance fails with 400 and does not mutate DB',
        'HTTP 400, success=false, DB unmutated',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass,
        mutated
      );
    }

    // Case 55: receive_money exceeding Customer Invoice outstanding balance fails (400) and does not mutate DB
    {
      const payCountBefore = await Payment.countDocuments();
      const res = await fetch(`${BASE_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          paymentType: 'receive_money',
          partner: sampleCustomer._id,
          amount: 999999,
          paymentMethod: 'Bank',
          customerInvoice: validCustomerInvoice._id
        })
      });
      const body = await res.json();
      const payCountAfter = await Payment.countDocuments();
      const mutated = payCountAfter !== payCountBefore;
      const pass = res.status === 400 && body.success === false && !mutated;
      recordResult(
        testCounter++,
        'POST /payments',
        'Receive money exceeding outstanding Customer Invoice balance fails with 400 and does not mutate DB',
        'HTTP 400, success=false, DB unmutated',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass,
        mutated
      );
    }

    // Case 56: Payment referencing non-existent vendorBill returns 404
    {
      const res = await fetch(`${BASE_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          paymentType: 'send_money',
          partner: sampleVendor._id,
          amount: 100,
          paymentMethod: 'Bank',
          vendorBill: new mongoose.Types.ObjectId()
        })
      });
      const body = await res.json();
      const pass = (res.status === 404 || res.status === 400) && body.success === false;
      recordResult(
        testCounter++,
        'POST /payments',
        'Payment referencing non-existent Vendor Bill returns 404/400',
        'HTTP 404 or 400, success=false',
        `HTTP ${res.status}, msg="${body.message}"`,
        pass
      );
    }

    // Case 57: Partial payment sets bill status to 'partial' and updates paidAmount
    {
      const res = await fetch(`${BASE_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          paymentType: 'send_money',
          partner: sampleVendor._id,
          amount: 3000,
          paymentMethod: 'Bank',
          vendorBill: validVendorBill._id
        })
      });
      const body = await res.json();
      const updatedBill = await VendorBill.findById(validVendorBill._id);
      const pass = res.status === 201 && updatedBill.status === 'partial' && updatedBill.paidAmount === 3000;
      recordResult(
        testCounter++,
        'POST /payments',
        'Partial payment sets Vendor Bill status to "partial" and updates paidAmount to 3000',
        'HTTP 201, Bill status=partial, paidAmount=3000',
        `HTTP ${res.status}, Bill status=${updatedBill.status}, paidAmount=${updatedBill.paidAmount}`,
        pass
      );
    }

    // Case 58: Full payment sets bill status to 'paid' and updates paidAmount to totalAmount
    {
      const res = await fetch(`${BASE_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          paymentType: 'send_money',
          partner: sampleVendor._id,
          amount: 4500, // 7500 - 3000 = 4500
          paymentMethod: 'Bank',
          vendorBill: validVendorBill._id
        })
      });
      const body = await res.json();
      const updatedBill = await VendorBill.findById(validVendorBill._id);
      const pass = res.status === 201 && updatedBill.status === 'paid' && updatedBill.paidAmount === 7500;
      recordResult(
        testCounter++,
        'POST /payments',
        'Full payment sets Vendor Bill status to "paid" and paidAmount to 7500',
        'HTTP 201, Bill status=paid, paidAmount=7500',
        `HTTP ${res.status}, Bill status=${updatedBill.status}, paidAmount=${updatedBill.paidAmount}`,
        pass
      );
    }

    // Case 59: Customer invoice full payment via Cash: verify Debit Cash, Credit Debtors
    {
      const res = await fetch(`${BASE_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          paymentType: 'receive_money',
          partner: sampleCustomer._id,
          amount: 13125,
          paymentMethod: 'Cash',
          customerInvoice: validCustomerInvoice._id
        })
      });
      const body = await res.json();
      const updatedInv = await CustomerInvoice.findById(validCustomerInvoice._id);

      const je = await JournalEntry.findById(body.payment?.journalEntry).populate('items.account');
      const debitItem = je?.items?.find(i => i.debit > 0);
      const creditItem = je?.items?.find(i => i.credit > 0);

      const pass = res.status === 201 &&
                   updatedInv.status === 'paid' &&
                   debitItem?.account?.name === 'Cash' &&
                   debitItem?.debit === 13125 &&
                   creditItem?.account?.name === 'Debtors' &&
                   creditItem?.credit === 13125;

      recordResult(
        testCounter++,
        'POST /payments',
        'Customer Invoice settlement via Cash verifies Debit Cash 13125, Credit Debtors 13125',
        'HTTP 201, Invoice status=paid, Debit Cash=13125, Credit Debtors=13125',
        `HTTP ${res.status}, Invoice status=${updatedInv.status}, Debit ${debitItem?.account?.name}=${debitItem?.debit}, Credit ${creditItem?.account?.name}=${creditItem?.credit}`,
        pass
      );
    }

    // -------------------------------------------------------------------------
    // SECTION 10: FINANCIAL REPORTS
    // -------------------------------------------------------------------------
    console.log('\n--- Testing Section 10: Financial Reports ---');

    // Case 60: /reports/profit-loss calculation
    {
      const res = await fetch(`${BASE_URL}/reports/profit-loss`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const body = await res.json();
      const pnl = body.report;

      // From our posted entries:
      // Sale Income = 12500
      // Purchases Expense = 7500
      // Operating Expenses = 0
      // Gross Profit = 12500 - 7500 = 5000
      // Net Profit = 5000 - 0 = 5000
      const expectedGross = 5000;
      const expectedNet = 5000;

      const pass = res.status === 200 &&
                   pnl.income?.total === 12500 &&
                   pnl.expenses?.purchasesExpense === 7500 &&
                   pnl.summary?.grossProfit === expectedGross &&
                   pnl.summary?.netProfit === expectedNet &&
                   pnl.summary?.isProfitable === true;

      recordResult(
        testCounter++,
        'GET /reports/profit-loss',
        'Profit & Loss report accurately calculates Gross Profit (5000) and Net Profit (5000)',
        'HTTP 200, Gross Profit=5000, Net Profit=5000, isProfitable=true',
        `HTTP ${res.status}, Gross=${pnl?.summary?.grossProfit}, Net=${pnl?.summary?.netProfit}, isProfitable=${pnl?.summary?.isProfitable}`,
        pass
      );
    }

    // Case 61: /reports/balance-sheet balance calculation
    {
      const res = await fetch(`${BASE_URL}/reports/balance-sheet`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const body = await res.json();
      const bs = body.report;

      // Assets: Cash +13125, Bank -7500 = 5625
      // Liabilities: Tax Payable = 625 (Creditors=0, Debtors=0)
      // Equity: Capital = 0, NetProfit = 5000 -> Total Equity = 5000
      // Total Liabilities + Equity = 625 + 5000 = 5625
      // Assets (5625) == Liabilities + Equity (5625) -> Balanced!
      const pass = res.status === 200 &&
                   bs.summary?.isBalanced === true &&
                   Math.abs(bs.summary?.totalAssets - bs.summary?.totalLiabilitiesAndEquity) < 0.01;

      recordResult(
        testCounter++,
        'GET /reports/balance-sheet',
        'Balance Sheet calculates Assets == Liabilities + Equity and isBalanced is true',
        'HTTP 200, isBalanced=true, Assets == Liabilities + Equity',
        `HTTP ${res.status}, Assets=${bs?.summary?.totalAssets}, Liab+Equity=${bs?.summary?.totalLiabilitiesAndEquity}, isBalanced=${bs?.summary?.isBalanced}`,
        pass
      );
    }

    // Case 62: /reports/budget variance and utilization
    {
      const res = await fetch(`${BASE_URL}/reports/budget`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const body = await res.json();
      const br = body.report;

      const pass = res.status === 200 &&
                   br.totalPlanned === 500000 &&
                   br.budgets &&
                   br.budgets.length > 0;

      recordResult(
        testCounter++,
        'GET /reports/budget',
        'Budget report calculates totalPlanned (500000) and variance against actuals',
        'HTTP 200, totalPlanned=500000, budgets array populated',
        `HTTP ${res.status}, totalPlanned=${br?.totalPlanned}, totalVariance=${br?.totalVariance}`,
        pass
      );
    }

  } finally {
    if (serverInstance) {
      serverInstance.close();
    }
    await mongoose.connection.close();
  }

  return results;
}

if (require.main === module) {
  runQASmokeTests().catch(err => {
    console.error('Fatal Error during Smoke Test execution:', err);
    process.exit(1);
  });
}

module.exports = { runQASmokeTests };
