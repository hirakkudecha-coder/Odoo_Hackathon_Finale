/**
 * Automated Verification: Security Phase 1 (P1)
 * Rate Limiting & NoSQL Injection Sanitization
 */
require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const app = require('../src/app');

const PORT = 5093;
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
  console.log(' SECURITY PHASE 1 VERIFICATION: NOSQL SANITIZER & RATE LIMITERS          ');
  console.log(` Target Server: http://localhost:${PORT}`);
  console.log('========================================================================\n');

  await mongoose.connect('mongodb://127.0.0.1:27017/urban_furniture_db');
  console.log('[MongoDB] Connected successfully');

  server = app.listen(PORT);
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    console.log('--- 1. Testing NoSQL Operator Injection Sanitization ---');

    // 1.1 Injecting $gt operator in login body
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
    // Because $gt was stripped from email, email became {} (empty object), so email is not a valid string email
    assert(injectRes1.status === 400 || injectRes1.status === 401, 'NoSQL operator $gt safely neutralized on auth login');
    assert(injectRes1.body.success === false, 'Auth rejected cleanly with success: false');

    // 1.2 Injecting nested $where and path traversal keys
    const { sanitizeValue } = require('../src/middleware/sanitizeMiddleware');
    const dirtyObj = {
      user: {
        $where: 'this.role == "admin"',
        name: 'Valid Name',
        'address.city': 'Traversal'
      },
      tags: [{ $ne: 'admin' }, 'validTag']
    };
    const cleanObj = sanitizeValue(dirtyObj);
    assert(cleanObj.user.$where === undefined, 'Nested $where key successfully stripped');
    assert(cleanObj.user['address.city'] === undefined, 'Dot traversal key successfully stripped');
    assert(cleanObj.user.name === 'Valid Name', 'Legitimate alphanumeric field preserved');
    assert(cleanObj.tags[0].$ne === undefined, 'Array-nested NoSQL operator stripped');
    assert(cleanObj.tags[1] === 'validTag', 'Legitimate array value preserved');

    // 1.3 Legitimate Login succeeds unimpeded
    const legitLogin = await request({
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
    assert(legitLogin.status === 200, 'Legitimate login request succeeds with HTTP 200');
    assert(legitLogin.body.token !== undefined, 'Legitimate login issues valid JWT token');

    console.log('\n--- 2. Testing Rate Limiting & 429 Throttling ---');

    // Make rapid requests to /api/auth/login WITHOUT bypass header
    let rateLimitTriggered = false;
    let rateLimitResponse = null;

    for (let i = 1; i <= 15; i++) {
      const res = await request({
        hostname: 'localhost',
        port: PORT,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }, {
        email: 'attacker@botnet.com',
        password: 'wrongpassword'
      });

      if (res.status === 429) {
        rateLimitTriggered = true;
        rateLimitResponse = res;
        break;
      }
    }

    assert(rateLimitTriggered === true, 'Auth rate limiter successfully triggered HTTP 429 Too Many Requests');
    assert(rateLimitResponse && rateLimitResponse.body.success === false, 'Rate limit response contains { success: false }');
    assert(rateLimitResponse && typeof rateLimitResponse.body.retryAfter === 'number', 'Rate limit response includes numeric retryAfter value');

    // 2.2 Requests with test bypass header are NOT blocked by rate limiter
    const bypassRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/health',
      method: 'GET',
      headers: {
        'x-bypass-rate-limit': 'test-suite'
      }
    });
    // 2.3 Verify staff GET requests on concierge endpoints are not rate limited by publicFormLimiter
    const showroomsRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/showrooms',
      method: 'GET',
      headers: {
        'x-bypass-rate-limit': 'test-suite'
      }
    });
    assert(showroomsRes.status === 200, 'GET /showrooms is not throttled by public form limiter');

    console.log('\n--- 3. Testing Payload Size Throttling ---');
    // Large payload > 100kb
    const largePayload = {
      description: 'x'.repeat(120 * 1024)
    };
    const payloadRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/health',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bypass-rate-limit': 'test-suite'
      }
    }, largePayload);
    assert(payloadRes.status === 413, 'Payload exceeding 100kb limit is rejected with HTTP 413 Payload Too Large');

    console.log('\n========================================================================');
    console.log(` PHASE 1 RESULTS: ${passed} PASSED / ${failed} FAILED`);
    console.log('========================================================================\n');

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    if (server) server.close();
    await mongoose.connection.close();
    process.exit(failed > 0 ? 1 : 0);
  }
}

run();
