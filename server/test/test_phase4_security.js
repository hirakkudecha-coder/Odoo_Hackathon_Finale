/**
 * ========================================================================
 * URBAN FURNITURE ERP — SECURITY PHASE 4 VERIFICATION SUITE
 * ========================================================================
 * Verifies:
 * 1. Password Complexity Rules (OWASP Multi-Set Validation)
 * 2. Password History (Anti-Reuse) Policy (Last 3 Passwords)
 * 3. Sensitive Data & PII Masking (Credentials, Phones, Bank Accounts, Tax IDs)
 * 4. Advanced Security Headers (CSP, COOP, CORP, and No-Store Cache-Control)
 * ========================================================================
 */
require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Contact = require('../src/models/Contact');
const AuditLog = require('../src/models/AuditLog');
const auditService = require('../src/services/auditService');
const { validatePasswordComplexity } = require('../src/utils/passwordPolicy');
const { maskSensitiveData, maskPhone, maskBankAccount, maskTaxId } = require('../src/utils/maskSensitiveData');

const PORT = 5088;
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
    console.log(`  ✓ [PASS] #${passed + failed + 1} ${message}`);
    passed++;
  } else {
    console.error(`  ✗ [FAIL] #${passed + failed + 1} ${message}`);
    failed++;
  }
}

async function run() {
  console.log('========================================================================');
  console.log(' SECURITY PHASE 4 VERIFICATION: PASSWORD POLICY, PII MASKING & HEADERS   ');
  console.log(` Target Server: http://localhost:${PORT}`);
  console.log('========================================================================\n');

  await mongoose.connect('mongodb://127.0.0.1:27017/urban_furniture_db');
  console.log('[MongoDB] Connected successfully');

  server = app.listen(PORT);
  await new Promise((r) => setTimeout(r, 300));

  try {
    console.log('\n--- 1. Testing Password Complexity Policy (OWASP Rules) ---');

    // 1.1 Unit validation tests
    assert(validatePasswordComplexity('Short1!').isValid === false, 'Password under 8 chars rejected');
    assert(validatePasswordComplexity('nouppercase123!').isValid === false, 'Password missing uppercase rejected');
    assert(validatePasswordComplexity('NOLOWERCASE123!').isValid === false, 'Password missing lowercase rejected');
    assert(validatePasswordComplexity('NoNumberHere!').isValid === false, 'Password missing numeric digit rejected');
    assert(validatePasswordComplexity('NoSpecialChar123').isValid === false, 'Password missing special character rejected');
    assert(validatePasswordComplexity('SuperCompliant123!').isValid === true, 'Compliant password with all 4 character sets accepted');

    // 1.2 Registration with non-compliant password rejected by API
    const weakRegRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-bypass-rate-limit': 'test-suite' }
    }, {
      name: 'Weak Password User',
      email: `weak_${Date.now()}@test.com`,
      password: 'weak'
    });
    assert(weakRegRes.status === 400, 'Registration with weak password rejected (HTTP 400)');
    assert(weakRegRes.body.success === false, 'Rejection returns { success: false }');

    // 1.3 Registration with compliant password succeeds
    const userEmail = `sec_p4_${Date.now()}@urbanfurniture.com`;
    const pwd1 = 'InitialCompliantPassword123!';
    const regRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-bypass-rate-limit': 'test-suite' }
    }, {
      name: 'Phase 4 Security Tester',
      email: userEmail,
      password: pwd1
    });
    assert(regRes.status === 201, 'Registration with compliant password succeeds (HTTP 201)');
    let token = regRes.body.token;

    console.log('\n--- 2. Testing Password History & Anti-Reuse Policy ---');

    // 2.1 Attempt to change to non-compliant password
    const weakChangeRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/change-password',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    }, {
      currentPassword: pwd1,
      newPassword: 'short'
    });
    assert(weakChangeRes.status === 400, 'Password change with non-compliant password rejected (HTTP 400)');

    // 2.2 Attempt to change to same current password (reuse violation)
    const samePasswordRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/change-password',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    }, {
      currentPassword: pwd1,
      newPassword: pwd1
    });
    assert(samePasswordRes.status === 400, 'Attempt to reuse current password rejected (HTTP 400)');
    assert(samePasswordRes.body.message.includes('cannot reuse'), 'Rejection states anti-reuse policy violation');

    // 2.3 Rotate to Password 2
    await new Promise(r => setTimeout(r, 1100));
    const pwd2 = 'SecondUniquePassword456!';
    const change2Res = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/change-password',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    }, {
      currentPassword: pwd1,
      newPassword: pwd2
    });
    assert(change2Res.status === 200, 'Rotation to 2nd distinct password succeeds (HTTP 200)');
    token = change2Res.body.token;

    // 2.4 Attempt to reuse Password 1 (in history)
    const reuse1Res = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/change-password',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    }, {
      currentPassword: pwd2,
      newPassword: pwd1
    });
    assert(reuse1Res.status === 400, 'Attempt to reuse Password 1 from history rejected (HTTP 400)');

    // 2.5 Rotate to Password 3
    await new Promise(r => setTimeout(r, 1100));
    const pwd3 = 'ThirdUniquePassword789!';
    const change3Res = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/change-password',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    }, {
      currentPassword: pwd2,
      newPassword: pwd3
    });
    assert(change3Res.status === 200, 'Rotation to 3rd distinct password succeeds (HTTP 200)');
    token = change3Res.body.token;

    // 2.6 Rotate to Password 4
    await new Promise(r => setTimeout(r, 1100));
    const pwd4 = 'FourthUniquePassword012!';
    const change4Res = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/change-password',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    }, {
      currentPassword: pwd3,
      newPassword: pwd4
    });
    assert(change4Res.status === 200, 'Rotation to 4th distinct password succeeds (HTTP 200)');
    token = change4Res.body.token;

    // 2.7 At this point, history has: [pwd3, pwd2, pwd1].
    // Let's rotate to Password 5. History will then have: [pwd4, pwd3, pwd2], and pwd1 rolls off!
    await new Promise(r => setTimeout(r, 1100));
    const pwd5 = 'FifthUniquePassword345!';
    const change5Res = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/change-password',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    }, {
      currentPassword: pwd4,
      newPassword: pwd5
    });
    assert(change5Res.status === 200, 'Rotation to 5th distinct password succeeds (HTTP 200)');
    token = change5Res.body.token;

    // 2.8 Pwd1 has rolled off the 3-password history window, so it can now be used again!
    await new Promise(r => setTimeout(r, 1100));
    const changeOldRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/change-password',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    }, {
      currentPassword: pwd5,
      newPassword: pwd1
    });
    assert(changeOldRes.status === 200, 'Password 1 succeeds after rolling off the 3-entry history buffer');
    token = changeOldRes.body.token;

    console.log('\n--- 3. Testing Sensitive Data & PII Masking ---');

    // 3.1 Unit masking tests
    assert(maskPhone('+91 9876543210') === '••••••3210', 'Phone number masked to trailing 4 digits');
    assert(maskBankAccount('123456789012') === '••••••••9012', 'Bank account masked to trailing 4 digits');
    const maskedGst = maskTaxId('27AAAAA0000A1Z5');
    assert(maskedGst.startsWith('27') && maskedGst.endsWith('1Z5'), 'Tax ID retains jurisdiction prefix and checksum suffix with masked center');

    // 3.2 Audit Log persistence automatically redacts sensitive data
    await auditService.logEvent({
      action: 'SECURITY_MASK_TEST',
      module: 'Security',
      description: 'Testing PII and credential masking in audit log',
      severity: 'info',
      details: {
        password: 'SuperSecretPassword123!',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xyz',
        bankAccount: '987654321098',
        phone: '9988776655',
        regularField: 'Public Safe Value'
      }
    });

    await new Promise(r => setTimeout(r, 200));
    const savedLog = await AuditLog.findOne({ action: 'SECURITY_MASK_TEST' }).sort({ timestamp: -1 });
    assert(savedLog !== null, 'Audit log saved to MongoDB');
    assert(savedLog.details.password === '[REDACTED]', 'Password field automatically scrubbed to [REDACTED]');
    assert(savedLog.details.token === '[REDACTED]', 'Token field automatically scrubbed to [REDACTED]');
    assert(savedLog.details.bankAccount === '••••••••1098', 'Bank account in audit details masked');
    assert(savedLog.details.phone === '••••••6655', 'Phone number in audit details masked');
    assert(savedLog.details.regularField === 'Public Safe Value', 'Unsensitive fields preserved intact');

    console.log('\n--- 4. Testing Advanced HTTP Security & Cache Headers ---');

    // 4.1 Check security headers on general health check
    const healthRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/health',
      method: 'GET'
    });
    assert(healthRes.headers['content-security-policy'] !== undefined, 'Response includes Content-Security-Policy header');
    assert(healthRes.headers['cross-origin-opener-policy'] === 'same-origin', 'Response includes Cross-Origin-Opener-Policy: same-origin');
    assert(healthRes.headers['cross-origin-resource-policy'] === 'same-site', 'Response includes Cross-Origin-Resource-Policy: same-site');

    // 4.2 Check Cache-Control: no-store on sensitive auth route
    const authMeRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/me',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    });
    assert(authMeRes.status === 200, 'GET /api/auth/me returns HTTP 200');
    assert(authMeRes.headers['cache-control'] && authMeRes.headers['cache-control'].includes('no-store'), '/api/auth/me emits Cache-Control: no-store');
    assert(authMeRes.headers['pragma'] === 'no-cache', '/api/auth/me emits Pragma: no-cache');

    // 4.3 Check Cache-Control: no-store on sensitive reports route
    const reportRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/reports/profit-loss',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    });
    assert(reportRes.headers['cache-control'] && reportRes.headers['cache-control'].includes('no-store'), '/api/reports emits Cache-Control: no-store');

    // Clean up created test user & audit log
    await User.deleteOne({ email: userEmail });
    await AuditLog.collection.deleteOne({ _id: savedLog._id });

    console.log('\n========================================================================');
    console.log(` PHASE 4 RESULTS: ${passed} PASSED / ${failed} FAILED`);
    console.log('========================================================================\n');

  } catch (err) {
    console.error('Phase 4 test execution error:', err);
    failed++;
  } finally {
    if (server) server.close();
    await mongoose.connection.close();
    process.exit(failed > 0 ? 1 : 0);
  }
}

run();
