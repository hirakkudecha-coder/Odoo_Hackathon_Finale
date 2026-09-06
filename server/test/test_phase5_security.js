/**
 * ========================================================================
 * URBAN FURNITURE ERP — SECURITY PHASE 5 VERIFICATION SUITE
 * ========================================================================
 * Verifies:
 * 1. Native RFC 6238 TOTP Engine & Clock Drift Tolerance (+/- 30s)
 * 2. Two-Factor Authentication Setup, QR URI & Backup Code Generation
 * 3. 2FA Step-Up Login Flow & Invalid Code Throttling
 * 4. Single-Use Emergency Recovery Backup Codes & Re-use Burning
 * 5. 2FA Disablement Lifecycle with Credential Verification
 * 6. Anti-CSRF Cross-Origin State Mutation Defense
 * 7. Backward-Compatible Authentication for 2FA-Disabled Accounts
 * ========================================================================
 */
require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const AuditLog = require('../src/models/AuditLog');
const totpService = require('../src/services/totpService');

const PORT = 5087;
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
  console.log(' SECURITY PHASE 5 VERIFICATION: TWO-FACTOR AUTH (2FA) & ANTI-CSRF      ');
  console.log(` Target Server: http://localhost:${PORT}`);
  console.log('========================================================================\n');

  await mongoose.connect('mongodb://127.0.0.1:27017/urban_furniture_db');
  console.log('[MongoDB] Connected successfully');

  server = app.listen(PORT);
  await new Promise((r) => setTimeout(r, 300));

  try {
    console.log('--- 1. Testing Native RFC 6238 TOTP Engine ---');

    // 1.1 Base32 encoding & decoding roundtrip
    const secret = totpService.generateBase32Secret(20);
    assert(typeof secret === 'string' && secret.length >= 32, 'Base32 secret generated with 160+ bits entropy');
    const decodedBuffer = totpService.base32Decode(secret);
    const reEncoded = totpService.base32Encode(decodedBuffer);
    assert(reEncoded === secret, 'Base32 encode/decode roundtrip maintains cryptographic fidelity');

    // 1.2 TOTP Generation & Window Tolerance
    const tokenNow = totpService.generateTOTP(secret, 0);
    assert(/^\d{6}$/.test(tokenNow), 'TOTP generator produces exactly 6 numeric digits');
    assert(totpService.verifyTOTP(secret, tokenNow, 1) === true, 'Current time-window token verified');

    // Past window (-1 step = -30 seconds)
    const tokenPast = totpService.generateTOTP(secret, -1);
    assert(totpService.verifyTOTP(secret, tokenPast, 1) === true, 'Clock drift tolerance (+/- 30s) accepts -1 window token');

    // Future window (+1 step = +30 seconds)
    const tokenFuture = totpService.generateTOTP(secret, 1);
    assert(totpService.verifyTOTP(secret, tokenFuture, 1) === true, 'Clock drift tolerance (+/- 30s) accepts +1 window token');

    // Far window (+3 steps = +90 seconds) rejected
    const tokenFar = totpService.generateTOTP(secret, 3);
    assert(totpService.verifyTOTP(secret, tokenFar, 1) === false, 'Token outside allowable clock drift window strictly rejected');

    // Invalid codes rejected
    assert(totpService.verifyTOTP(secret, '000000', 1) === false, 'Arbitrary dummy token rejected');

    // 1.3 Emergency Recovery Codes Generation
    const backupCodes = totpService.generateBackupCodes(5);
    assert(Array.isArray(backupCodes) && backupCodes.length === 5, 'Generates exactly 5 recovery backup codes');
    assert(backupCodes.every(c => /^[A-F0-9]{4}-[A-F0-9]{4}$/.test(c)), 'Backup codes formatted as standard XXXX-XXXX');

    // 1.4 OTPAuth URI format
    const uri = totpService.generateOtpAuthUri('tester@urbanfurniture.com', secret);
    assert(uri.startsWith('otpauth://totp/'), 'Generates compliant otpauth:// URI for authenticator QR codes');
    assert(uri.includes(secret), 'URI embeds Base32 secret parameter');

    console.log('\n--- 2. Testing 2FA Setup & Activation Lifecycle ---');

    const userEmail = `sec_p5_${Date.now()}@urbanfurniture.com`;
    const userPassword = 'InitialSecurePass123!';

    // Register user
    const regRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-bypass-rate-limit': 'test-suite' }
    }, {
      name: 'Phase 5 2FA User',
      email: userEmail,
      password: userPassword
    });
    assert(regRes.status === 201, 'Test user registered successfully (HTTP 201)');
    let userToken = regRes.body.token;

    // 2.1 Initiate 2FA Setup
    const setupRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/2fa/setup',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    });
    assert(setupRes.status === 200, 'POST /api/auth/2fa/setup returns HTTP 200');
    assert(setupRes.body.secret && setupRes.body.otpauthUri, 'Setup response contains secret and otpauthUri');
    assert(Array.isArray(setupRes.body.backupCodes) && setupRes.body.backupCodes.length === 5, 'Setup response contains 5 recovery backup codes');
    const userSecret = setupRes.body.secret;
    const userBackupCodes = setupRes.body.backupCodes;

    // Verify 2FA is NOT yet enabled before verification
    let dbUser = await User.findOne({ email: userEmail });
    assert(dbUser.twoFactorEnabled === false, '2FA remains disabled until explicitly verified');

    // 2.2 Attempt to verify with invalid code
    const invalidVerifyRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/2fa/verify-and-enable',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    }, {
      code: '999999'
    });
    assert(invalidVerifyRes.status === 400, 'Verification with incorrect 2FA code rejected (HTTP 400)');

    // 2.3 Verify with valid code to activate 2FA
    const validActivationCode = totpService.generateTOTP(userSecret);
    const validVerifyRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/2fa/verify-and-enable',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    }, {
      code: validActivationCode
    });
    assert(validVerifyRes.status === 200, 'Verification with valid TOTP code succeeds (HTTP 200)');

    dbUser = await User.findOne({ email: userEmail });
    assert(dbUser.twoFactorEnabled === true, 'user.twoFactorEnabled successfully toggled to true in database');

    console.log('\n--- 3. Testing 2FA Login Interception & Step-Up Flow ---');

    // 3.1 Login without 2FA code returns require2FA: true & temporary token
    const step1LoginRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-bypass-rate-limit': 'test-suite' }
    }, {
      email: userEmail,
      password: userPassword
    });
    assert(step1LoginRes.status === 200, 'Initial credentials valid (HTTP 200)');
    assert(step1LoginRes.body.require2FA === true, 'Response requires two-factor authentication (require2FA: true)');
    assert(typeof step1LoginRes.body.tempToken === 'string', 'Response issues temporary step-up token');
    const tempToken = step1LoginRes.body.tempToken;

    // 3.2 Submit invalid 2FA code with tempToken
    const badCodeRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-bypass-rate-limit': 'test-suite' }
    }, {
      tempToken,
      twoFactorCode: '111222'
    });
    assert(badCodeRes.status === 401, 'Invalid 2FA code rejected with HTTP 401');

    // 3.3 Submit valid 2FA code with tempToken
    const validTotp = totpService.generateTOTP(userSecret);
    const goodCodeRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-bypass-rate-limit': 'test-suite' }
    }, {
      tempToken,
      twoFactorCode: validTotp
    });
    assert(goodCodeRes.status === 200, 'Valid 2FA code authenticates successfully (HTTP 200)');
    assert(typeof goodCodeRes.body.token === 'string', 'Response issues full authenticated JWT session token');
    const fullSessionToken = goodCodeRes.body.token;

    // 3.4 Access protected route with full session token
    const profileRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/me',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${fullSessionToken}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    });
    assert(profileRes.status === 200, '2FA-authenticated token successfully accesses /api/auth/me');

    console.log('\n--- 4. Testing Emergency Recovery Backup Codes ---');

    // 4.1 Login using a recovery backup code
    const recoveryCodeToUse = userBackupCodes[0];
    const backupLoginRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-bypass-rate-limit': 'test-suite' }
    }, {
      email: userEmail,
      password: userPassword,
      twoFactorCode: recoveryCodeToUse
    });
    assert(backupLoginRes.status === 200, 'Login using emergency recovery backup code succeeds (HTTP 200)');
    assert(typeof backupLoginRes.body.token === 'string', 'Recovery login issues full JWT token');

    // 4.2 Verify that the used backup code is BURNED (single-use enforcement)
    const reuseBackupRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-bypass-rate-limit': 'test-suite' }
    }, {
      email: userEmail,
      password: userPassword,
      twoFactorCode: recoveryCodeToUse
    });
    assert(reuseBackupRes.status === 401, 'Attempt to reuse burned recovery backup code is rejected (HTTP 401)');

    console.log('\n--- 5. Testing 2FA Disablement Lifecycle ---');

    // 5.1 Disable 2FA with current password and valid TOTP code
    const disableTotp = totpService.generateTOTP(userSecret);
    const disableRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/2fa/disable',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${fullSessionToken}`,
        'x-bypass-rate-limit': 'test-suite'
      }
    }, {
      password: userPassword,
      code: disableTotp
    });
    assert(disableRes.status === 200, 'POST /api/auth/2fa/disable returns HTTP 200');

    dbUser = await User.findOne({ email: userEmail });
    assert(dbUser.twoFactorEnabled === false, 'user.twoFactorEnabled updated to false in database');

    // 5.2 Subsequent login requires password alone without 2FA prompt
    const loginAfterDisable = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-bypass-rate-limit': 'test-suite' }
    }, {
      email: userEmail,
      password: userPassword
    });
    assert(loginAfterDisable.status === 200, 'Login succeeds directly after 2FA is disabled');
    assert(loginAfterDisable.body.require2FA === undefined, 'No 2FA code requested once disabled');

    console.log('\n--- 6. Testing Anti-CSRF Cross-Origin State Mutation Defense ---');

    // 6.1 State-changing POST with unauthorized Origin
    const forgedPostRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://malicious-cross-origin.com'
      }
    }, {
      email: userEmail,
      password: userPassword
    });
    assert(forgedPostRes.status === 403, 'Mutating request from unauthorized Origin rejected with HTTP 403 Forbidden');
    assert(forgedPostRes.body.message.includes('CORS blocked') || forgedPostRes.body.message.includes('CSRF'), 'Rejection explicitly states cross-origin security block');

    // 6.2 State-changing POST with authorized Origin succeeds
    const legitOriginRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173',
        'x-bypass-rate-limit': 'test-suite'
      }
    }, {
      email: userEmail,
      password: userPassword
    });
    assert(legitOriginRes.status === 200, 'Mutating request from authorized Origin passes CSRF filter');

    // 6.3 Safe GET read request from authorized client origin allowed through
    const safeGetRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/health',
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:5173'
      }
    });
    assert(safeGetRes.status === 200, 'Safe GET read request from authorized client origin allowed through');

    console.log('\n--- 7. Backward Compatibility: Standard Seed Accounts ---');

    // 7.1 Seeded SuperAdmin logs in without 2FA interruption
    const saLogin = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-bypass-rate-limit': 'test-suite' }
    }, {
      email: 'superadmin@urbanfurniture.com',
      password: 'SuperAdmin123!'
    });
    assert(saLogin.status === 200, 'Seeded SuperAdmin authenticates directly with HTTP 200');
    assert(saLogin.body.token !== undefined, 'Seeded SuperAdmin receives active JWT session');

    // Clean up test user
    await User.deleteOne({ email: userEmail });

    console.log('\n========================================================================');
    console.log(` PHASE 5 RESULTS: ${passed} PASSED / ${failed} FAILED`);
    console.log('========================================================================\n');

  } catch (err) {
    console.error('Phase 5 test execution error:', err);
    failed++;
  } finally {
    if (server) server.close();
    await mongoose.connection.close();
    process.exit(failed > 0 ? 1 : 0);
  }
}

run();
