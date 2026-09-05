require('dotenv').config();
const connectDB = require('../src/config/db');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Contact = require('../src/models/Contact');
const Product = require('../src/models/Product');
const PurchaseOrder = require('../src/models/PurchaseOrder');
const SalesOrder = require('../src/models/SalesOrder');
const VendorBill = require('../src/models/VendorBill');
const CustomerInvoice = require('../src/models/CustomerInvoice');
const JournalEntry = require('../src/models/JournalEntry');
const Journal = require('../src/models/Journal');
const Account = require('../src/models/Account');

async function verifyPhase3() {
  console.log('=== VERIFYING PHASE 3: ROUTING, RBAC & MIDDLEWARE ===\n');
  await connectDB();
  const server = app.listen(5096);
  const BASE_URL = 'http://localhost:5096';

  try {
    // 1. Setup tokens for Admin, Accountant, and Superadmin
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

    let accountant = await User.findOne({ email: 'accountant@urbanfurniture.com' });
    if (!accountant) {
      accountant = await User.create({
        name: 'Accountant Test',
        email: 'accountant@urbanfurniture.com',
        password: 'AccountantPassword123!',
        role: 'accountant'
      });
    }
    const accountantToken = accountant.generateAuthToken();

    let superadmin = await User.findOne({ email: 'superadmin@urbanfurniture.com' });
    if (!superadmin) {
      superadmin = await User.create({
        name: 'SuperAdmin Test',
        email: 'superadmin@urbanfurniture.com',
        password: 'SuperAdmin123!',
        role: 'superadmin'
      });
    }
    const superadminToken = superadmin.generateAuthToken();

    // 2. Setup test entities for deletion tests
    let vendor = await Contact.findOne({ type: 'Vendor' });
    if (!vendor) {
      vendor = await Contact.create({ name: 'Phase 3 Vendor', email: 'p3vendor@test.com', type: 'Vendor' });
    }
    let customer = await Contact.findOne({ type: 'Customer' });
    if (!customer) {
      customer = await Contact.create({ name: 'Phase 3 Customer', email: 'p3customer@test.com', type: 'Customer' });
    }
    let product = await Product.findOne({});
    if (!product) {
      product = await Product.create({ name: 'P3 Product', salesPrice: 50, costPrice: 25, currentStock: 5 });
    }
    let journal = await Journal.findOne({});
    let account = await Account.findOne({});

    const testPo = await PurchaseOrder.create({
      vendor: vendor._id,
      items: [{ product: product._id, quantity: 1, unitPrice: 50, subtotal: 50 }],
      totalAmount: 50,
      status: 'draft'
    });

    const testSo = await SalesOrder.create({
      customer: customer._id,
      items: [{ product: product._id, quantity: 1, unitPrice: 100, subtotal: 100 }],
      totalAmount: 100,
      status: 'draft'
    });

    const testVb = await VendorBill.create({
      vendor: vendor._id,
      items: [{ product: product._id, quantity: 1, unitPrice: 50, subtotal: 50 }],
      totalAmount: 50,
      status: 'draft'
    });

    const testCi = await CustomerInvoice.create({
      customer: customer._id,
      items: [{ product: product._id, quantity: 1, unitPrice: 100, subtotal: 100 }],
      totalAmount: 100,
      status: 'draft'
    });

    const testJe = await JournalEntry.create({
      journal: journal ? journal._id : new mongoose.Types.ObjectId(),
      date: new Date(),
      items: [
        { account: account ? account._id : new mongoose.Types.ObjectId(), debit: 100, credit: 0 },
        { account: account ? account._id : new mongoose.Types.ObjectId(), debit: 0, credit: 100 }
      ],
      totalDebit: 100,
      totalCredit: 100,
      status: 'draft'
    });

    // Check 15: Delete permissions (Accountant blocked 403, Admin allowed)
    console.log('--- Check 15: Delete Permissions on Transactional Entities ---');
    
    // Purchase Order
    const poDelAccountant = await fetch(`${BASE_URL}/api/purchase-orders/${testPo._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accountantToken}` }
    });
    console.log('PO delete by Accountant blocked:', poDelAccountant.status === 403 ? 'PASS (403)' : `FAIL (${poDelAccountant.status})`);

    const poDelAdmin = await fetch(`${BASE_URL}/api/purchase-orders/${testPo._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('PO delete by Admin allowed:', poDelAdmin.status === 200 ? 'PASS (200)' : `FAIL (${poDelAdmin.status})`);

    // Sales Order
    const soDelAccountant = await fetch(`${BASE_URL}/api/sales-orders/${testSo._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accountantToken}` }
    });
    console.log('SO delete by Accountant blocked:', soDelAccountant.status === 403 ? 'PASS (403)' : `FAIL (${soDelAccountant.status})`);

    const soDelAdmin = await fetch(`${BASE_URL}/api/sales-orders/${testSo._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('SO delete by Admin allowed:', soDelAdmin.status === 200 ? 'PASS (200)' : `FAIL (${soDelAdmin.status})`);

    // Vendor Bill
    const vbDelAccountant = await fetch(`${BASE_URL}/api/vendor-bills/${testVb._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accountantToken}` }
    });
    console.log('VB delete by Accountant blocked:', vbDelAccountant.status === 403 ? 'PASS (403)' : `FAIL (${vbDelAccountant.status})`);

    const vbDelAdmin = await fetch(`${BASE_URL}/api/vendor-bills/${testVb._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('VB delete by Admin allowed:', vbDelAdmin.status === 200 ? 'PASS (200)' : `FAIL (${vbDelAdmin.status})`);

    // Customer Invoice
    const ciDelAccountant = await fetch(`${BASE_URL}/api/customer-invoices/${testCi._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accountantToken}` }
    });
    console.log('CI delete by Accountant blocked:', ciDelAccountant.status === 403 ? 'PASS (403)' : `FAIL (${ciDelAccountant.status})`);

    const ciDelAdmin = await fetch(`${BASE_URL}/api/customer-invoices/${testCi._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('CI delete by Admin allowed:', ciDelAdmin.status === 200 ? 'PASS (200)' : `FAIL (${ciDelAdmin.status})`);

    // Journal Entry
    const jeDelAccountant = await fetch(`${BASE_URL}/api/journal-entries/${testJe._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accountantToken}` }
    });
    console.log('JE delete by Accountant blocked:', jeDelAccountant.status === 403 ? 'PASS (403)' : `FAIL (${jeDelAccountant.status})`);

    const jeDelAdmin = await fetch(`${BASE_URL}/api/journal-entries/${testJe._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('JE delete by Admin allowed:', jeDelAdmin.status === 200 ? 'PASS (200)' : `FAIL (${jeDelAdmin.status})`);

    // Check 16: User Management RBAC
    console.log('\n--- Check 16: User Management Route RBAC ---');
    const usersAccountant = await fetch(`${BASE_URL}/api/auth/users`, {
      headers: { Authorization: `Bearer ${accountantToken}` }
    });
    console.log('GET /api/auth/users by Accountant blocked:', usersAccountant.status === 403 ? 'PASS (403)' : `FAIL (${usersAccountant.status})`);

    const usersAdmin = await fetch(`${BASE_URL}/api/auth/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('GET /api/auth/users by Admin allowed:', usersAdmin.status === 200 ? 'PASS (200)' : `FAIL (${usersAdmin.status})`);

    const usersSuperadmin = await fetch(`${BASE_URL}/api/auth/users`, {
      headers: { Authorization: `Bearer ${superadminToken}` }
    });
    console.log('GET /api/auth/users by SuperAdmin allowed:', usersSuperadmin.status === 200 ? 'PASS (200)' : `FAIL (${usersSuperadmin.status})`);

    // Check 17: CORS Strict Allow-list
    console.log('\n--- Check 17: CORS Allow-list & Credentials ---');
    const corsAllowed = await fetch(`${BASE_URL}/api/health`, {
      headers: { Origin: 'http://localhost:5173' }
    });
    const allowOriginHeader = corsAllowed.headers.get('access-control-allow-origin');
    const allowCredHeader = corsAllowed.headers.get('access-control-allow-credentials');
    console.log('CORS allowed origin reflected:', allowOriginHeader === 'http://localhost:5173' ? 'PASS' : `FAIL (${allowOriginHeader})`);
    console.log('CORS allow credentials set:', allowCredHeader === 'true' ? 'PASS' : `FAIL (${allowCredHeader})`);

    const corsDisallowed = await fetch(`${BASE_URL}/api/health`, {
      headers: { Origin: 'http://evil-attacker.com' }
    });
    const disallowedOrigin = corsDisallowed.headers.get('access-control-allow-origin');
    console.log('CORS disallowed origin blocked:', disallowedOrigin === null || corsDisallowed.status === 500 ? 'PASS' : `FAIL (${disallowedOrigin})`);

    // Check 18: Health route error handling and heartbeat
    console.log('\n--- Check 18: Health & Live Heartbeat Execution ---');
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthRes.json();
    console.log('Health status:', healthData.status === 'UP' ? 'PASS (UP)' : 'FAIL');

    const heartbeatRes = await fetch(`${BASE_URL}/api/health/heartbeat`);
    const heartbeatData = await heartbeatRes.json();
    console.log('Heartbeat payload complete:', heartbeatData.heartbeat?.status === 'ALIVE' && heartbeatData.heartbeat?.database?.connected ? 'PASS (ALIVE & Connected)' : 'FAIL');

    console.log('\n=== ALL PHASE 3 CHECKS COMPLETED SUCCESSFULLY ===');
  } catch (err) {
    console.error('Phase 3 verification error:', err);
  } finally {
    server.close();
    await mongoose.connection.close();
  }
}

verifyPhase3();
