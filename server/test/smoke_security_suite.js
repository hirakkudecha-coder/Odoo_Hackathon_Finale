/**
 * ========================================================================
 * URBAN FURNITURE ERP — MASTER ENTERPRISE SECURITY VERIFICATION SUITE
 * ========================================================================
 * Comprehensive test runner executing all Phase 1, Phase 2, and Phase 3
 * security assertions:
 * - Rate Limiting & Traffic Throttling
 * - NoSQL Operator & Prototype Pollution Sanitization
 * - 100kb Payload Throttling
 * - Account Lockout (5 Consecutive Failed Attempts => 30 min Lockout)
 * - Immediate Token Invalidation on Password Change / Admin Reset
 * - Immutable Audit Log Anti-Tampering Pre-Hooks
 * - Automated Audit Event Generation from Operations
 * - Audit Trail Access Control & RBAC Filtering
 * ========================================================================
 */
require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const AuditLog = require('../src/models/AuditLog');
const { sanitizeValue } = require('../src/middleware/sanitizeMiddleware');

const PORT = 5090;
let server;
let accountantLogin;
let superAdminToken;

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
    console.log(`  ✓ [PASS] #${passed + failed + 1} ${message}`);
    passed++;
  } else {
    console.error(`  ✗ [FAIL] #${passed + failed + 1} ${message}`);
    failed++;
  }
}

async function run() {
  console.log('========================================================================');
  console.log('       URBAN FURNITURE ERP — ENTERPRISE SECURITY TEST SUITE             ');
  console.log(`       Target Endpoint: http://localhost:${PORT}/api                    `);
  console.log('========================================================================\n');

  await mongoose.connect('mongodb://127.0.0.1:27017/urban_furniture_db');
  console.log('[MongoDB] Connected: 127.0.0.1/urban_furniture_db');

  server = app.listen(PORT);
  await new Promise(resolve => setTimeout(resolve, 300));

  accountantLogin = await request({
    hostname: 'localhost',
    port: PORT,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-bypass-rate-limit': 'test-suite' }
  }, {
    email: 'accountant@urbanfurniture.com',
    password: 'AccountantPassword123!'
  });

  const saRes = await request({
    hostname: 'localhost',
    port: PORT,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-bypass-rate-limit': 'test-suite' }
  }, {
    email: 'superadmin@urbanfurniture.com',
    password: 'SuperAdmin123!'
  });
  superAdminToken = saRes.body.token;

  try {
    console.log('\n========================================================================');
    console.log(' SECTION 1: INJECTION DEFENSE & TRAFFIC THROTTLING (PHASE 1 - P1)      ');
    console.log('========================================================================');

    // 1.1 NoSQL $gt operator in request body
    const injectRes1 = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bypass-rate-limit': 'test-suite'
      }
    }, {
      email: { $gt: '' },
      password: 'somepassword'
    });
    assert(injectRes1.status === 400, 'NoSQL operator $gt neutralized resulting in HTTP 400 validation rejection');
    assert(injectRes1.body.success === false, 'Auth rejection returns standard { success: false }');

    // 1.2 Prototype pollution & MongoDB operators recursive stripping
    const dirtyPayload = JSON.parse(
      '{"__proto__": {"polluted": true}, "constructor": "malicious", "user": {"$where": "this.role == \\"admin\\"", "name": "Valid Customer", "address.city": "Nested Traversal"}, "tags": [{"$ne": "customer"}, "verified"]}'
    );
    const cleanPayload = sanitizeValue(dirtyPayload);
    assert(
      !Object.prototype.hasOwnProperty.call(cleanPayload, '__proto__') && cleanPayload.polluted === undefined,
      'Prototype pollution vector neutralized'
    );
    assert(cleanPayload.constructor !== 'malicious', 'Constructor key traversal stripped');
    assert(cleanPayload.user.$where === undefined, 'Nested $where MongoDB operator stripped');
    assert(cleanPayload.user['address.city'] === undefined, 'Dot-path traversal key stripped');
    assert(cleanPayload.user.name === 'Valid Customer', 'Valid alphanumeric string preserved intact');
    assert(cleanPayload.tags[0].$ne === undefined, 'Array-nested $ne operator stripped');
    assert(cleanPayload.tags[1] === 'verified', 'Valid array value preserved intact');

    // 1.3 Strict String Type Guard
    const typeConfusionRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bypass-rate-limit': 'test-suite'
      }
    }, {
      email: 12345,
      password: ['array_password']
    });
    assert(typeConfusionRes.status === 400, 'Non-string email/password rejected with HTTP 400 without crashing');

    // 1.4 Rate Limiter Throttling
    let rateLimitHit = false;
    let rateLimitRes = null;
    for (let i = 1; i <= 15; i++) {
      const res = await request({
        hostname: 'localhost',
        port: PORT,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        email: 'attacker@botnet.org',
        password: 'attack_password'
      });
      if (res.status === 429) {
        rateLimitHit = true;
        rateLimitRes = res;
        break;
      }
    }
    assert(rateLimitHit === true, 'Rapid auth attempts trigger HTTP 429 Too Many Requests');
    assert(rateLimitRes && rateLimitRes.body.success === false, 'Rate limit response contains success: false');
    assert(rateLimitRes && typeof rateLimitRes.body.retryAfter === 'number', 'Rate limit response contains retryAfter timestamp');

    // 1.5 Payload Limit Throttling
    const oversizedBody = { largeData: 'z'.repeat(120 * 1024) };
    const overflowRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/health',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bypass-rate-limit': 'test-suite'
      }
    }, oversizedBody);
    assert(overflowRes.status === 413, 'Payloads exceeding 100kb limit rejected with HTTP 413 Payload Too Large');

    // 1.6 Staff GET endpoints unaffected by form limiters
    const showroomGetRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/showrooms',
      method: 'GET',
      headers: { 'x-bypass-rate-limit': 'test-suite' }
    });
    assert(showroomGetRes.status === 200, 'Staff GET endpoints operate unencumbered by POST form limiters');

    console.log('\n========================================================================');
    console.log(' SECTION 2: IDENTITY HARDENING & TOKEN LIFECYCLE (PHASE 2 - P2)        ');
    console.log('========================================================================');

    const testEmail = `sec_suite_${Date.now()}@urbanfurniture.com`;
    const initialPassword = 'InitialSecretPassword123!';
    const testUser = await User.create({
      name: 'Security Test Auditor',
      email: testEmail,
      password: initialPassword,
      role: 'accountant'
    });

    // 2.1 Four Consecutive Failed Attempts with Countdowns
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
        password: 'bad_password'
      });
      assert(res.status === 401, `Failed login attempt ${i} returns HTTP 401`);
      assert(res.body.message.includes(`${5 - i} attempt(s) remaining`), `Notice accurately reports ${5 - i} attempts remaining`);
    }

    // 2.2 5th Attempt Triggers 30-Minute Lockout
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
      password: 'bad_password_5'
    });
    assert(lockRes.status === 423, '5th consecutive failed attempt returns HTTP 423 Locked');
    assert(lockRes.body.message.includes('locked for 30 minutes'), 'Lockout notice specifies 30-minute duration');

    // 2.3 Attempt while locked rejected even with valid password
    const lockedRes = await request({
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
    assert(lockedRes.status === 423, 'Login attempt while account is locked returns HTTP 423');

    // Unlock test user
    await User.findByIdAndUpdate(testUser._id, { lockUntil: null, failedLoginAttempts: 0 });

    // 2.4 Login with correct credentials clears failed counters
    const loginOkRes = await request({
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
    assert(loginOkRes.status === 200, 'Unlocked user authenticates successfully with HTTP 200');
    const tokenA = loginOkRes.body.token;

    const refreshedUser = await User.findById(testUser._id);
    assert(refreshedUser.failedLoginAttempts === 0, 'failedLoginAttempts reset to 0 upon successful auth');
    assert(!refreshedUser.lockUntil, 'lockUntil field cleared upon successful auth');

    // 2.5 Active token accesses protected route
    const profileRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/me',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenA}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    });
    assert(profileRes.status === 200, 'Active Token A accesses /api/auth/me successfully');

    // 2.6 User changes password
    await new Promise(r => setTimeout(r, 1100)); // ensure 1s timestamp boundary
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
      newPassword: 'BrandNewPassword456!'
    });
    assert(changePwRes.status === 200, 'PUT /api/auth/change-password returns HTTP 200');
    const tokenB = changePwRes.body.token;

    // 2.7 Prior Token A is immediately REJECTED
    const oldTokenRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/me',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenA}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    });
    assert(oldTokenRes.status === 401, 'Prior Token A is invalidated immediately with HTTP 401');
    assert(oldTokenRes.body.message.includes('recently changed'), 'Rejection explicitly states password was changed');

    // 2.8 New Token B is valid
    const newTokenRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/me',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenB}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    });
    assert(newTokenRes.status === 200, 'Fresh Token B accesses protected route with HTTP 200');

    // 2.9 Admin password reset terminates Token B
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

    await new Promise(r => setTimeout(r, 1100));

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
      newPassword: 'AdminAssignedPassword789!'
    });
    assert(adminResetRes.status === 200, 'Admin resets user password via PUT /users/:id/password');

    const tokenBAfterReset = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/me',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenB}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    });
    assert(tokenBAfterReset.status === 401, 'Token B invalidated immediately upon administrative password reset');

    console.log('\n========================================================================');
    console.log(' SECTION 3: IMMUTABLE AUDIT TRAIL & COMPLIANCE RBAC (PHASE 3 - P3)      ');
    console.log('========================================================================');

    // 3.1 AuditLog Schema Immutability
    const sampleLog = await AuditLog.create({
      actorEmail: 'sec_tester@urbanfurniture.com',
      actorRole: 'admin',
      action: 'SECURITY_AUDIT_PROBE',
      module: 'System',
      description: 'Verifying statutory audit log immutability',
      severity: 'info'
    });

    let updateBlocked = false;
    try {
      await AuditLog.updateOne({ _id: sampleLog._id }, { description: 'Tampered' });
    } catch (e) {
      updateBlocked = true;
      assert(e.message.includes('IMMUTABILITY VIOLATION'), 'AuditLog updateOne strictly blocked by pre-hook');
    }
    assert(updateBlocked, 'AuditLog schema prevents document modification');

    let deleteBlocked = false;
    try {
      await AuditLog.deleteOne({ _id: sampleLog._id });
    } catch (e) {
      deleteBlocked = true;
      assert(e.message.includes('IMMUTABILITY VIOLATION'), 'AuditLog deleteOne strictly blocked by pre-hook');
    }
    assert(deleteBlocked, 'AuditLog schema prevents document deletion');

    // 3.2 Automated Audit Record Verification
    const auditRecord = await AuditLog.findOne({
      action: 'LOGIN_SUCCESS',
      actorEmail: 'admin@urbanfurniture.com'
    }).sort({ timestamp: -1 });
    assert(auditRecord !== null, 'Operational actions automatically persist to AuditLog collection');
    assert(auditRecord && auditRecord.module === 'Auth', 'Audit record accurately categorized under "Auth" module');

    // 3.3 Audit Log Access RBAC
    const unauthAudit = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/audit-logs',
      method: 'GET',
      headers: { 'x-bypass-rate-limit': 'test-suite' }
    });
    assert(unauthAudit.status === 401, 'Unauthenticated access to /api/audit-logs rejected (HTTP 401)');

    const accountantAudit = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/audit-logs',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accountantLogin.body.token}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    });
    assert(accountantAudit.status === 403, 'Accountant role forbidden from /api/audit-logs (HTTP 403)');

    const superAdminAudit = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/audit-logs?page=1&limit=10',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${superAdminToken}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    });
    assert(superAdminAudit.status === 200, 'SuperAdmin role accesses /api/audit-logs (HTTP 200)');
    assert(Array.isArray(superAdminAudit.body.auditLogs), 'Audit log response contains auditLogs array');
    assert(typeof superAdminAudit.body.totalCount === 'number', 'Audit API provides pagination metadata');

    // Clean up test user & sample log
    await User.findByIdAndDelete(testUser._id);
    await AuditLog.collection.deleteOne({ _id: sampleLog._id });

    console.log('\n========================================================================');
    console.log(` ENTERPRISE SECURITY SUITE COMPLETE: ${passed} PASSED / ${failed} FAILED`);
    console.log('========================================================================\n');

  } catch (err) {
    console.error('Enterprise security test execution error:', err);
    failed++;
  } finally {
    if (server) server.close();
    await mongoose.connection.close();
    process.exit(failed > 0 ? 1 : 0);
  }
}

run();

