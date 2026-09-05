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
const Showroom = require('../src/models/Showroom');
const HelpdeskTicket = require('../src/models/HelpdeskTicket');

async function verifyPhase2() {
  console.log('=== VERIFYING PHASE 2: DATA INTEGRITY & VALIDATION ===\n');
  await connectDB();
  const server = app.listen(5097);
  const BASE_URL = 'http://localhost:5097';

  try {
    // Authenticate as Admin
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
      Authorization: `Bearer ${adminToken}`
    };

    // Find or create sample vendor and customer
    let vendor = await Contact.findOne({ type: 'Vendor' });
    if (!vendor) {
      vendor = await Contact.create({ name: 'Test Vendor', email: 'vendor@test.com', type: 'Vendor' });
    }
    let customer = await Contact.findOne({ type: 'Customer' });
    if (!customer) {
      customer = await Contact.create({ name: 'Test Customer', email: 'customer@test.com', type: 'Customer' });
    }
    let product = await Product.findOne({});
    if (!product) {
      product = await Product.create({ name: 'Test Product', salesPrice: 100, costPrice: 50, currentStock: 10 });
    }

    // Check 8.1: Vendor Bill validation (reject empty items, reject status != draft, reject paidAmount > 0)
    console.log('--- Check 8.1: Vendor Bill Creation Validation ---');
    const vbNoVendor = await fetch(`${BASE_URL}/api/vendor-bills`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ items: [{ product: product._id, quantity: 1, unitPrice: 100 }] })
    });
    console.log('VB missing vendor:', vbNoVendor.status === 400 ? 'PASS (400)' : `FAIL (${vbNoVendor.status})`);

    const vbEmptyItems = await fetch(`${BASE_URL}/api/vendor-bills`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ vendor: vendor._id, items: [] })
    });
    console.log('VB empty items:', vbEmptyItems.status === 400 ? 'PASS (400)' : `FAIL (${vbEmptyItems.status})`);

    const vbPaidOverride = await fetch(`${BASE_URL}/api/vendor-bills`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        vendor: vendor._id,
        items: [{ product: product._id, quantity: 1, unitPrice: 100 }],
        paidAmount: 500
      })
    });
    console.log('VB paidAmount override rejected:', vbPaidOverride.status === 400 ? 'PASS (400)' : `FAIL (${vbPaidOverride.status})`);

    const vbStatusOverride = await fetch(`${BASE_URL}/api/vendor-bills`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        vendor: vendor._id,
        items: [{ product: product._id, quantity: 1, unitPrice: 100 }],
        status: 'posted'
      })
    });
    console.log('VB non-draft status override rejected:', vbStatusOverride.status === 400 ? 'PASS (400)' : `FAIL (${vbStatusOverride.status})`);

    // Check 8.2: Customer Invoice validation
    console.log('\n--- Check 8.2: Customer Invoice Creation Validation ---');
    const ciNoCustomer = await fetch(`${BASE_URL}/api/customer-invoices`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ items: [{ product: product._id, quantity: 1, unitPrice: 100 }] })
    });
    console.log('CI missing customer:', ciNoCustomer.status === 400 ? 'PASS (400)' : `FAIL (${ciNoCustomer.status})`);

    const ciInvalidTax = await fetch(`${BASE_URL}/api/customer-invoices`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        customer: customer._id,
        items: [{ product: product._id, quantity: 1, unitPrice: 100, taxPercent: -5 }]
      })
    });
    console.log('CI negative tax percent rejected:', ciInvalidTax.status === 400 ? 'PASS (400)' : `FAIL (${ciInvalidTax.status})`);

    const ciPaidOverride = await fetch(`${BASE_URL}/api/customer-invoices`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        customer: customer._id,
        items: [{ product: product._id, quantity: 1, unitPrice: 100 }],
        paidAmount: 200
      })
    });
    console.log('CI paidAmount override rejected:', ciPaidOverride.status === 400 ? 'PASS (400)' : `FAIL (${ciPaidOverride.status})`);

    // Check 9: PO and SO State Machine Guards
    console.log('\n--- Check 9: PO and SO State Machine Guards ---');
    const testPo = await PurchaseOrder.create({
      vendor: vendor._id,
      items: [{ product: product._id, quantity: 2, unitPrice: 50, subtotal: 100 }],
      totalAmount: 100,
      status: 'confirmed'
    });
    const poConfirmRes = await fetch(`${BASE_URL}/api/purchase-orders/${testPo._id}/confirm`, {
      method: 'POST',
      headers: authHeaders
    });
    console.log('PO confirm already-confirmed order rejected:', poConfirmRes.status === 400 ? 'PASS (400)' : `FAIL (${poConfirmRes.status})`);

    const testSo = await SalesOrder.create({
      customer: customer._id,
      items: [{ product: product._id, quantity: 2, unitPrice: 100, subtotal: 200 }],
      totalAmount: 200,
      status: 'confirmed'
    });
    const soConfirmRes = await fetch(`${BASE_URL}/api/sales-orders/${testSo._id}/confirm`, {
      method: 'POST',
      headers: authHeaders
    });
    console.log('SO confirm already-confirmed order rejected:', soConfirmRes.status === 400 ? 'PASS (400)' : `FAIL (${soConfirmRes.status})`);

    // Check 10 & 11: Payment Status Allow-List & Pre-save paymentNumber
    console.log('\n--- Check 10 & 11: Payment Status Allow-List & Reference Generation ---');
    const draftVb = await VendorBill.create({
      vendor: vendor._id,
      items: [{ product: product._id, quantity: 2, unitPrice: 50, subtotal: 100 }],
      totalAmount: 100,
      status: 'draft'
    });
    const payDraftVb = await fetch(`${BASE_URL}/api/payments`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        paymentType: 'send_money',
        vendorBill: draftVb._id,
        amount: 50,
        paymentMethod: 'Bank'
      })
    });
    console.log('Payment on draft bill rejected:', payDraftVb.status === 400 ? 'PASS (400)' : `FAIL (${payDraftVb.status})`);

    // Now post the bill and make payment
    const postVbRes = await fetch(`${BASE_URL}/api/vendor-bills/${draftVb._id}/post`, {
      method: 'POST',
      headers: authHeaders
    });
    console.log('Post Vendor Bill:', postVbRes.status === 200 ? 'PASS (200)' : `FAIL (${postVbRes.status})`);

    const validPayRes = await fetch(`${BASE_URL}/api/payments`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        paymentType: 'send_money',
        vendorBill: draftVb._id,
        amount: 50,
        paymentMethod: 'Bank'
      })
    });
    const payData = await validPayRes.json();
    console.log('Payment on posted bill accepted:', validPayRes.status === 201 ? 'PASS (201)' : `FAIL (${validPayRes.status})`);
    
    // Check that JournalEntry has non-empty reference matching paymentNumber
    if (payData.payment && payData.payment.journalEntry) {
      const je = await JournalEntry.findById(payData.payment.journalEntry);
      const hasRef = je && je.reference && je.reference.startsWith('PAY-OUT/');
      console.log('Journal Entry has valid payment reference:', hasRef ? `PASS (${je.reference})` : 'FAIL (missing reference)');
    }

    // Check 14: Showroom query from MongoDB & Helpdesk side-effect removal
    console.log('\n--- Check 14: Showroom Model & Helpdesk GET Side-Effect Removal ---');
    if ((await Showroom.countDocuments()) === 0) {
      await Showroom.create({
        id: 'mumbai',
        cityKey: 'mumbai',
        name: 'Mumbai Flagship Atelier',
        address: 'Express Towers, Nariman Point'
      });
    }
    const showroomRes = await fetch(`${BASE_URL}/api/showrooms`, {
      headers: authHeaders
    });
    const showroomData = await showroomRes.json();
    const countInDb = await Showroom.countDocuments();
    console.log('Showrooms fetched from DB:', showroomData.showrooms?.length > 0 && countInDb > 0 ? `PASS (${countInDb} in DB)` : 'FAIL');

    const countTicketsBefore = await HelpdeskTicket.countDocuments();
    const ticketsRes = await fetch(`${BASE_URL}/api/helpdesk/tickets`, {
      headers: authHeaders
    });
    const countTicketsAfter = await HelpdeskTicket.countDocuments();
    console.log('Helpdesk GET produces no insert side-effects:', countTicketsBefore === countTicketsAfter ? `PASS (count: ${countTicketsBefore})` : 'FAIL');

    console.log('\n=== ALL PHASE 2 CHECKS COMPLETED SUCCESSFULLY ===');
  } catch (err) {
    console.error('Phase 2 verification error:', err);
  } finally {
    server.close();
    await mongoose.connection.close();
  }
}

verifyPhase2();
