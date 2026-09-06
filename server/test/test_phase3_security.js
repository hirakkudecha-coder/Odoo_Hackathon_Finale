/**
 * Automated Verification: Security Phase 3 (P3)
 * Immutable Audit Logs & Access Controls
 */
require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const app = require('../src/app');
const AuditLog = require('../src/models/AuditLog');
const User = require('../src/models/User');

const PORT = 5091;
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
  console.log(' SECURITY PHASE 3 VERIFICATION: AUDIT TRAIL IMMUTABILITY & RBAC          ');
  console.log(` Target Server: http://localhost:${PORT}`);
  console.log('========================================================================\n');

  await mongoose.connect('mongodb://127.0.0.1:27017/urban_furniture_db');
  console.log('[MongoDB] Connected successfully');

  server = app.listen(PORT);
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    console.log('--- 1. Testing AuditLog Schema Immutability & Anti-Tampering ---');

    // 1.1 Create a test audit record
    const testLog = await AuditLog.create({
      actorEmail: 'auditor@urbanfurniture.com',
      actorRole: 'admin',
      action: 'SYSTEM_CONFIG_VERIFIED',
      module: 'System',
      description: 'Verified statutory ledger integrity parameters',
      severity: 'info',
      ipAddress: '127.0.0.1'
    });
    assert(testLog._id !== undefined, 'Audit record created successfully with unique ID');

    // 1.2 Attempting to update the audit record MUST fail
    let updateFailed = false;
    try {
      await AuditLog.updateOne({ _id: testLog._id }, { description: 'Tampered description' });
    } catch (err) {
      updateFailed = true;
      assert(err.message.includes('IMMUTABILITY VIOLATION'), 'AuditLog updateOne blocked with immutability violation error');
    }
    assert(updateFailed, 'AuditLog.updateOne threw exception preventing tampering');

    // 1.3 Attempting to delete the audit record MUST fail
    let deleteFailed = false;
    try {
      await AuditLog.deleteOne({ _id: testLog._id });
    } catch (err) {
      deleteFailed = true;
      assert(err.message.includes('IMMUTABILITY VIOLATION'), 'AuditLog deleteOne blocked with immutability violation error');
    }
    assert(deleteFailed, 'AuditLog.deleteOne threw exception preventing tampering');

    console.log('\n--- 2. Testing Automated Audit Event Generation from Actions ---');

    // 2.1 Trigger a successful login to generate an audit log
    const loginRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bypass-rate-limit': 'test-suite'
      }
    }, {
      email: 'superadmin@urbanfurniture.com',
      password: 'SuperAdmin123!'
    });
    assert(loginRes.status === 200, 'SuperAdmin logged in successfully');
    const superAdminToken = loginRes.body.token;

    // Allow async non-blocking log write to complete
    await new Promise(r => setTimeout(r, 200));

    // Verify audit log exists
    const recentLoginLog = await AuditLog.findOne({
      action: 'LOGIN_SUCCESS',
      actorEmail: 'superadmin@urbanfurniture.com'
    }).sort({ timestamp: -1 });

    assert(recentLoginLog !== null, 'LOGIN_SUCCESS audit record was automatically persisted');
    assert(recentLoginLog && recentLoginLog.module === 'Auth', 'Audit record accurately categorized under "Auth" module');
    assert(recentLoginLog && recentLoginLog.severity === 'info', 'Audit record assigned severity "info"');

    // 2.2 Trigger a failed login to generate LOGIN_FAILED audit log
    await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bypass-rate-limit': 'test-suite'
      }
    }, {
      email: 'superadmin@urbanfurniture.com',
      password: 'intentionally_wrong_password'
    });

    await new Promise(r => setTimeout(r, 200));

    const failedLog = await AuditLog.findOne({
      action: 'LOGIN_FAILED',
      actorEmail: 'superadmin@urbanfurniture.com'
    }).sort({ timestamp: -1 });

    assert(failedLog !== null, 'LOGIN_FAILED audit record was automatically persisted');
    assert(failedLog && failedLog.severity === 'warning', 'Failed login assigned severity "warning"');

    // Reset superadmin failedLoginAttempts counter
    await User.findOneAndUpdate(
      { email: 'superadmin@urbanfurniture.com' },
      { failedLoginAttempts: 0, lockUntil: null }
    );

    console.log('\n--- 3. Testing Audit Log API Access & RBAC (GET /api/audit-logs) ---');

    // 3.1 Unauthenticated access is rejected (HTTP 401)
    const unauthRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/audit-logs',
      method: 'GET',
      headers: { 'x-bypass-rate-limit': 'test-suite' }
    });
    assert(unauthRes.status === 401, 'Unauthenticated request to /api/audit-logs rejected with HTTP 401');

    // 3.2 Contact role is forbidden (HTTP 403)
    const contactLogin = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bypass-rate-limit': 'test-suite'
      }
    }, {
      email: 'contact@urbanfurniture.com',
      password: 'ContactPassword123!'
    });
    const contactToken = contactLogin.body.token;

    const contactRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/audit-logs',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${contactToken}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    });
    assert(contactRes.status === 403, 'Contact role forbidden from accessing /api/audit-logs (HTTP 403)');

    // 3.3 Accountant role is forbidden (HTTP 403)
    const accountantLogin = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bypass-rate-limit': 'test-suite'
      }
    }, {
      email: 'accountant@urbanfurniture.com',
      password: 'AccountantPassword123!'
    });
    const accountantToken = accountantLogin.body.token;

    const accountantRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/audit-logs',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accountantToken}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    });
    assert(accountantRes.status === 403, 'Accountant role forbidden from accessing /api/audit-logs (HTTP 403)');

    // 3.4 Admin role is allowed (HTTP 200)
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

    const adminRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/audit-logs?page=1&limit=5',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    });
    assert(adminRes.status === 200, 'Admin role successfully accesses /api/audit-logs (HTTP 200)');
    assert(Array.isArray(adminRes.body.auditLogs), 'Admin response contains auditLogs array');

    // 3.5 SuperAdmin role is allowed (HTTP 200)
    const superAdminRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/audit-logs?page=1&limit=5',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${superAdminToken}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    });
    assert(superAdminRes.status === 200, 'SuperAdmin role successfully accesses /api/audit-logs (HTTP 200)');
    assert(typeof superAdminRes.body.totalCount === 'number', 'Audit API returns totalCount pagination metadata');
    assert(typeof superAdminRes.body.totalPages === 'number', 'Audit API returns totalPages pagination metadata');

    // 3.6 Filtering by module
    const filteredModuleRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/audit-logs?module=Auth',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${superAdminToken}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    });
    assert(filteredModuleRes.status === 200, 'GET /api/audit-logs?module=Auth returns HTTP 200');
    const allAuth = filteredModuleRes.body.auditLogs.every(l => l.module === 'Auth');
    assert(allAuth, 'All returned records strictly match module=Auth filter');

    // 3.7 Search query on audit logs
    const searchRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/audit-logs?search=superadmin',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${superAdminToken}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    });
    assert(searchRes.status === 200, 'GET /api/audit-logs?search=superadmin returns HTTP 200');
    assert(searchRes.body.count > 0, 'Search query discovers matching superadmin audit logs');

    // Clean up temporary test log
    await AuditLog.collection.deleteOne({ _id: testLog._id });

    console.log('\n========================================================================');
    console.log(` PHASE 3 RESULTS: ${passed} PASSED / ${failed} FAILED`);
    console.log('========================================================================\n');

  } catch (err) {
    console.error('Phase 3 test execution error:', err);
    failed++;
  } finally {
    if (server) server.close();
    await mongoose.connection.close();
    process.exit(failed > 0 ? 1 : 0);
  }
}

run();
