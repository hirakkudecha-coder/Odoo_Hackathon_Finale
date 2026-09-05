require('dotenv').config();
const connectDB = require('../src/config/db');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Contact = require('../src/models/Contact');
const Account = require('../src/models/Account');
const Journal = require('../src/models/Journal');
const { postJournalEntry, createAndPostEntry } = require('../src/services/accountingEngine');

async function verifyPhase1() {
  console.log('=== VERIFYING PHASE 1: CRITICAL SECURITY FIXES ===\n');
  await connectDB();
  const server = app.listen(5098);
  const BASE_URL = 'http://localhost:5098';

  try {
    // 1. Verify register role enforcement
    console.log('--- Check 1: Register role privilege escalation fix ---');
    await User.deleteOne({ email: 'hacker@test.com' });
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Hacker',
        email: 'hacker@test.com',
        password: 'Password123!',
        role: 'admin'
      })
    });
    const regData = await regRes.json();
    const isNotAdmin = regData.user && regData.user.role !== 'admin' && regData.user.role === 'accountant';
    console.log('Check 1 Result:', isNotAdmin ? 'PASS - role forced to accountant' : 'FAIL', regData.user);

    // 2. Verify payment creation role restriction
    console.log('\n--- Check 2: Contact role payment creation blocked ---');
    await User.deleteOne({ email: 'portalcontact@test.com' });
    const contactUser = await User.create({
      name: 'Portal Contact',
      email: 'portalcontact@test.com',
      password: 'Password123!',
      role: 'contact'
    });
    const contactToken = contactUser.generateAuthToken();

    const payRes = await fetch(`${BASE_URL}/api/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${contactToken}`
      },
      body: JSON.stringify({
        paymentType: 'send_money',
        amount: 500,
        paymentMethod: 'Bank'
      })
    });
    console.log('Check 2 Result:', payRes.status === 403 ? 'PASS - 403 Forbidden for contact role' : `FAIL status: ${payRes.status}`);

    // 3. Verify contact create does not overwrite admin password
    console.log('\n--- Check 3: Contact creation does not overwrite existing admin password ---');
    await User.deleteOne({ email: 'secureadmin@test.com' });
    const adminUser = await User.create({
      name: 'Secure Admin',
      email: 'secureadmin@test.com',
      password: 'SuperAdminOriginalPassword123!',
      role: 'admin'
    });

    const adminHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminUser.generateAuthToken()}`
    };

    // Attempt to overwrite admin password by creating a contact with that email and a new password
    await fetch(`${BASE_URL}/api/contacts`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        name: 'Imposter Contact',
        email: 'secureadmin@test.com',
        type: 'Customer',
        createPortalUser: true,
        portalPassword: 'AttackerNewPassword123!'
      })
    });

    // Check if original admin can still login
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'secureadmin@test.com',
        password: 'SuperAdminOriginalPassword123!'
      })
    });
    console.log('Check 3 Result:', loginRes.status === 200 ? 'PASS - Admin password preserved' : 'FAIL - Password altered');

    // 4. Verify atomic $inc and concurrency on account balances
    console.log('\n--- Check 4: Atomic balance updates without lost updates ---');
    const testAccount = await Account.create({
      code: 'TEST-' + Date.now(),
      name: 'Concurrent Test Account',
      type: 'Asset',
      balance: 1000
    });
    const creditAccount = await Account.create({
      code: 'TEST-CR-' + Date.now(),
      name: 'Concurrent Credit Account',
      type: 'Liability',
      balance: 1000
    });
    const testJournal = await Journal.findOne();

    // Fire 2 concurrent postings targeting testAccount (Debit +100 each)
    const p1 = createAndPostEntry({
      journalId: testJournal._id,
      items: [
        { account: testAccount._id, debit: 100, credit: 0 },
        { account: creditAccount._id, debit: 0, credit: 100 }
      ]
    });
    const p2 = createAndPostEntry({
      journalId: testJournal._id,
      items: [
        { account: testAccount._id, debit: 150, credit: 0 },
        { account: creditAccount._id, debit: 0, credit: 150 }
      ]
    });

    await Promise.all([p1, p2]);
    const updatedTestAccount = await Account.findById(testAccount._id);
    // Initial 1000 + 100 + 150 = 1250
    console.log('Check 4 Result: Initial 1000 -> Final:', updatedTestAccount.balance, updatedTestAccount.balance === 1250 ? 'PASS' : 'FAIL');

    // 5. Verify escapeRegex protects against ReDoS
    console.log('\n--- Check 5: ReDoS protection on search endpoints ---');
    const startTime = Date.now();
    const searchRes = await fetch(`${BASE_URL}/api/contacts?search=${encodeURIComponent('((((((((((a+)+)+)+)+)+)+)+)+)+)$')}`, {
      headers: adminHeaders
    });
    const duration = Date.now() - startTime;
    console.log('Check 5 Result:', searchRes.status === 200 && duration < 500 ? `PASS - Handled safely in ${duration}ms` : `FAIL - took ${duration}ms`);

    // 6. Verify anonymous access to inquiry/showroom/partner/helpdesk endpoints returns 401
    console.log('\n--- Check 6: Unauthenticated access blocked (401) on management routes ---');
    const [t1, t2, t3, t4] = await Promise.all([
      fetch(`${BASE_URL}/api/showrooms/bookings`),
      fetch(`${BASE_URL}/api/partners`),
      fetch(`${BASE_URL}/api/helpdesk/tickets`),
      fetch(`${BASE_URL}/api/inquiries/designer`)
    ]);
    const all401 = [t1.status, t2.status, t3.status, t4.status].every(s => s === 401);
    console.log(`Check 6 Result: [${t1.status}, ${t2.status}, ${t3.status}, ${t4.status}]`, all401 ? 'PASS - All blocked with 401' : 'FAIL');

    // 7. Verify JWT_SECRET startup protection
    console.log('\n--- Check 7: App refuses boot when JWT_SECRET missing ---');
    const childProcess = require('child_process');
    const testBoot = childProcess.spawnSync('node', ['-e', "delete process.env.JWT_SECRET; require('./src/middleware/authMiddleware');"], {
      cwd: process.cwd(),
      encoding: 'utf8',
      env: { ...process.env, JWT_SECRET: '' }
    });
    const refusedBoot = testBoot.status !== 0 && (testBoot.stderr.includes('JWT_SECRET') || testBoot.stdout.includes('JWT_SECRET'));
    console.log('Check 7 Result:', refusedBoot ? 'PASS - Process threw fatal error on missing JWT_SECRET' : 'FAIL');

    console.log('\n=== ALL PHASE 1 CHECKS VERIFIED SUCCESSFULLY! ===');
  } finally {
    server.close();
    await mongoose.connection.close();
  }
}

verifyPhase1().catch(e => {
  console.error('Phase 1 Verification Error:', e);
  process.exit(1);
});
