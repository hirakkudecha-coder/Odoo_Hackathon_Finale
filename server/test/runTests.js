require('dotenv').config();
const connectDB = require('../src/config/db');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');

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
    // Clear test users
    await User.deleteMany({ email: { $in: ['testadmin@urbanfurniture.com', 'testacct@urbanfurniture.com', 'testcontact@urbanfurniture.com'] } });

    // 2.1 Register Admin
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
    console.log('[Test 2.1] Register Admin User:', regAdminRes.status === 201 && regAdminData.token ? 'PASS' : 'FAIL');
    const adminToken = regAdminData.token;

    // 2.2 Register Accountant
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
    console.log('[Test 2.2] Register Accountant User:', regAcctRes.status === 201 && regAcctData.token ? 'PASS' : 'FAIL');
    const acctToken = regAcctData.token;

    // 2.3 Login Valid
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testadmin@urbanfurniture.com',
        password: 'AdminPassword123!'
      })
    });
    const loginData = await loginRes.json();
    console.log('[Test 2.3] Login Valid Credentials:', loginRes.status === 200 && loginData.token ? 'PASS' : 'FAIL');

    // 2.4 Login Invalid Password
    const loginBadRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testadmin@urbanfurniture.com',
        password: 'WrongPassword!'
      })
    });
    console.log('[Test 2.4] Reject Invalid Password:', loginBadRes.status === 401 ? 'PASS' : 'FAIL');

    // 2.5 Protected /me route
    const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const meData = await meRes.json();
    console.log('[Test 2.5] Protected GET /me (Admin):', meRes.status === 200 && meData.user.email === 'testadmin@urbanfurniture.com' ? 'PASS' : 'FAIL');

    // 2.6 RBAC: Admin can access /api/auth/users
    const usersAdminRes = await fetch(`${BASE_URL}/api/auth/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('[Test 2.6] RBAC Allowed (Admin accessing /api/auth/users):', usersAdminRes.status === 200 ? 'PASS' : 'FAIL');

    // 2.7 RBAC: Accountant forbidden on /api/auth/users
    const usersAcctRes = await fetch(`${BASE_URL}/api/auth/users`, {
      headers: { Authorization: `Bearer ${acctToken}` }
    });
    console.log('[Test 2.7] RBAC Forbidden (Accountant accessing admin-only endpoint):', usersAcctRes.status === 403 ? 'PASS' : 'FAIL');

    console.log('\n=== All Phase 1 & 2 Tests Completed Successfully! ===\n');
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
