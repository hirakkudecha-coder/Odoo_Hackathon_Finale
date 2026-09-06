/**
 * Automated Verification: Security Phase 2 (P2)
 * Account Lockout (5 Failed Attempts) & Immediate Token Invalidation on Password Change
 */
require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

const PORT = 5092;
let server;

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        let json;
        try {
          json = JSON.parse(body);
        } catch {
          json = body;
        }
        resolve({ status: res.statusCode, headers: res.headers, body: json });
      });
    });
    req.on('error', reject);
    if (data) {
      if (typeof data === 'string') {
        req.write(data);
      } else {
        req.write(JSON.stringify(data));
      }
    }
    req.end();
  });
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ✗ [FAIL] ${message}`);
    failed++;
  }
}

async function run() {
  console.log('========================================================================');
  console.log(' SECURITY PHASE 2 VERIFICATION: ACCOUNT LOCKOUT & TOKEN INVALIDATION   ');
  console.log(` Target Server: http://localhost:${PORT}`);
  console.log('========================================================================\n');

  await mongoose.connect('mongodb://127.0.0.1:27017/urban_furniture_db');
  console.log('[MongoDB] Connected successfully');

  server = app.listen(PORT);
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    // Setup dedicated test user for lockout testing
    const testEmail = `lockout_test_${Date.now()}@urbanfurniture.com`;
    const initialPassword = 'InitialPassword123!';
    const testUser = await User.create({
      name: 'Security Test User',
      email: testEmail,
      password: initialPassword,
      role: 'accountant'
    });

    console.log('--- 1. Testing Account Lockout (5 Failed Attempts) ---');

    // 1.1 Four consecutive failed attempts
    for (let i = 1; i <= 4; i++) {
      const res = await request({
        hostname: 'localhost',
        port: PORT,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-bypass-rate-limit': 'test-suite'
        }
      }, {
        email: testEmail,
        password: 'wrong_password_attempt'
      });

      assert(res.status === 401, `Failed attempt ${i} returns HTTP 401`);
      const remainingExpected = 5 - i;
      assert(
        res.body.message && res.body.message.includes(`${remainingExpected} attempt(s) remaining`),
        `Warning message accurately informs: ${remainingExpected} attempt(s) remaining`
      );
    }

    // 1.2 Fifth failed attempt triggers 30-minute lockout (HTTP 423)
    const lockRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bypass-rate-limit': 'test-suite'
      }
    }, {
      email: testEmail,
      password: 'wrong_password_attempt_5'
    });

    assert(lockRes.status === 423, '5th consecutive failed attempt returns HTTP 423 Locked');
    assert(
      lockRes.body.message && lockRes.body.message.includes('locked for 30 minutes'),
      'Response explicitly informs user of 30-minute lockout period'
    );

    // 1.3 Sixth attempt with CORRECT password is still locked out
    const lockedWithCorrectPw = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bypass-rate-limit': 'test-suite'
      }
    }, {
      email: testEmail,
      password: initialPassword
    });
    assert(lockedWithCorrectPw.status === 423, 'Subsequent login attempts while locked remain rejected with HTTP 423');

    // Unlock user in DB to test successful login and counter reset
    await User.findByIdAndUpdate(testUser._id, {
      lockUntil: null,
      failedLoginAttempts: 0
    });

    // 1.4 Successful login resets failed attempts
    const loginOk = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bypass-rate-limit': 'test-suite'
      }
    }, {
      email: testEmail,
      password: initialPassword
    });
    assert(loginOk.status === 200, 'Unlocked user logs in successfully with HTTP 200');
    const tokenA = loginOk.body.token;

    const refreshedUser = await User.findById(testUser._id);
    assert(refreshedUser.failedLoginAttempts === 0, 'failedLoginAttempts counter successfully reset to 0');
    assert(!refreshedUser.lockUntil, 'lockUntil cleared upon successful login');

    console.log('\n--- 2. Testing Immediate Token Invalidation on Password Change ---');

    // 2.1 Token A accesses /api/auth/me successfully
    const meWithTokenA = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/me',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenA}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    });
    assert(meWithTokenA.status === 200, 'Token A successfully accesses protected /api/auth/me');

    // 2.2 Change Password via PUT /api/auth/change-password
    const newPassword = 'NewUpdatedSecurePassword456!';
    await new Promise(r => setTimeout(r, 1100)); // wait 1.1s so token iat is strictly behind new timestamp

    const changePwRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/change-password',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenA}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    }, {
      currentPassword: initialPassword,
      newPassword
    });

    assert(changePwRes.status === 200, 'PUT /api/auth/change-password returns HTTP 200');
    assert(changePwRes.body.token !== undefined, 'Password change returns fresh Token B');
    const tokenB = changePwRes.body.token;

    // 2.3 Attempting to reuse old Token A is immediately REJECTED
    const meWithOldTokenA = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/me',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenA}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    });
    assert(meWithOldTokenA.status === 401, 'Old Token A is immediately invalidated with HTTP 401');
    assert(
      meWithOldTokenA.body.message && meWithOldTokenA.body.message.includes('recently changed'),
      'Rejection message explicitly specifies password was recently changed'
    );

    // 2.4 New Token B works seamlessly
    const meWithTokenB = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/me',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenB}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    });
    assert(meWithTokenB.status === 200, 'New Token B successfully accesses protected /api/auth/me');

    console.log('\n--- 3. Testing Admin Password Reset Session Termination ---');

    // Obtain Admin token
    const adminLogin = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bypass-rate-limit': 'test-suite'
      }
    }, {
      email: 'admin@urbanfurniture.com',
      password: 'AdminPassword123!'
    });
    const adminToken = adminLogin.body.token;

    await new Promise(r => setTimeout(r, 1100)); // wait 1.1s for timestamp separation

    // Admin resets user's password
    const adminResetRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: `/api/auth/users/${testUser._id}/password`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    }, {
      newPassword: 'AdminForcedPassword789!'
    });
    assert(adminResetRes.status === 200, 'Admin successfully resets user password via PUT /users/:id/password');

    // Token B should now be invalidated
    const meWithTokenBAfterAdminReset = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/me',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenB}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    });
    assert(meWithTokenBAfterAdminReset.status === 401, 'User Token B invalidated immediately upon administrative password reset');

    // Clean up test user
    await User.findByIdAndDelete(testUser._id);

    console.log('\n========================================================================');
    console.log(` PHASE 2 RESULTS: ${passed} PASSED / ${failed} FAILED`);
    console.log('========================================================================\n');

  } catch (err) {
    console.error('Phase 2 test execution error:', err);
    failed++;
  } finally {
    if (server) server.close();
    await mongoose.connection.close();
    process.exit(failed > 0 ? 1 : 0);
  }
}

run();
