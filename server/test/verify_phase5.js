require('dotenv').config();
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const app = require('../src/app');

async function verifyPhase5() {
  console.log('========================================================================');
  console.log('=== VERIFYING PHASE 5: TLS/SSL & REVERSE PROXY IMPLEMENTATION        ===');
  console.log('========================================================================\n');

  await connectDB();
  const PORT = 5098;
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(PORT, resolve));
  const BASE_URL = `http://localhost:${PORT}`;

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`  ✓ [PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`  ✗ [FAIL] ${message}`);
    }
  }

  try {
    console.log('--- 1. Testing Express Trust Proxy Configuration ---');

    // Test 1.1: Trust proxy active in Express app
    const trustProxyValue = app.get('trust proxy');
    assert(trustProxyValue === 1 || trustProxyValue === true, `Express trust proxy is enabled (value: ${trustProxyValue})`);

    // Test 1.2: Client IP resolution via X-Forwarded-For
    const clientIpRes = await fetch(`${BASE_URL}/api/health`, {
      headers: {
        'X-Forwarded-For': '203.0.113.195, 10.0.0.1',
        'X-Forwarded-Proto': 'https'
      }
    });
    assert(clientIpRes.status === 200, 'Request with X-Forwarded-For and X-Forwarded-Proto succeeds');

    console.log('\n--- 2. Testing Server Fingerprint Removal (x-powered-by) ---');

    // Test 2.1: Ensure X-Powered-By is NOT sent
    const poweredBy = clientIpRes.headers.get('x-powered-by');
    assert(!poweredBy, `Server fingerprinting disabled (X-Powered-By header is absent: ${poweredBy})`);

    console.log('\n--- 3. Testing Defense-in-Depth HTTP Security Headers ---');

    // Test 3.1: X-Content-Type-Options: nosniff
    const contentTypeOpts = clientIpRes.headers.get('x-content-type-options');
    assert(contentTypeOpts === 'nosniff', `X-Content-Type-Options header enforced: ${contentTypeOpts}`);

    // Test 3.2: X-Frame-Options: SAMEORIGIN
    const frameOpts = clientIpRes.headers.get('x-frame-options');
    assert(frameOpts === 'SAMEORIGIN', `X-Frame-Options header enforced: ${frameOpts}`);

    // Test 3.3: X-XSS-Protection: 1; mode=block
    const xssProtection = clientIpRes.headers.get('x-xss-protection');
    assert(xssProtection === '1; mode=block', `X-XSS-Protection header enforced: ${xssProtection}`);

    // Test 3.4: Referrer-Policy: strict-origin-when-cross-origin
    const referrerPolicy = clientIpRes.headers.get('referrer-policy');
    assert(referrerPolicy === 'strict-origin-when-cross-origin', `Referrer-Policy header enforced: ${referrerPolicy}`);

    // Test 3.5: Permissions-Policy
    const permissionsPolicy = clientIpRes.headers.get('permissions-policy');
    assert(permissionsPolicy && permissionsPolicy.includes('geolocation=()'), `Permissions-Policy header enforced: ${permissionsPolicy}`);

    // Test 3.6: Strict-Transport-Security (HSTS)
    const hsts = clientIpRes.headers.get('strict-transport-security');
    assert(hsts && hsts.includes('max-age=31536000') && hsts.includes('includeSubDomains'), `HSTS header enforced: ${hsts}`);

    console.log('\n--- 4. Testing HTTPS Enforcement Behind Reverse Proxy ---');

    // Test 4.1: Simulate unencrypted HTTP request behind reverse proxy with ENFORCE_HTTPS=true
    process.env.ENFORCE_HTTPS = 'true';
    const httpRes = await fetch(`${BASE_URL}/api/health`, {
      headers: {
        'X-Forwarded-Host': 'urbanfurniture.local',
        'X-Forwarded-Proto': 'http'
      },
      redirect: 'manual'
    });
    assert(httpRes.status === 301, `Unencrypted request triggers 301 Permanent Redirect (received status: ${httpRes.status})`);
    const location = httpRes.headers.get('location');
    assert(location && location.startsWith('https://urbanfurniture.local'), `Redirects to HTTPS target URL: ${location}`);
    delete process.env.ENFORCE_HTTPS;

    console.log('\n--- 5. Testing Nginx Reverse Proxy Configurations ---');

    const nginxConfPath = path.resolve(__dirname, '../nginx/nginx.conf');
    const vhostConfPath = path.resolve(__dirname, '../nginx/conf.d/urban-furniture.conf');
    const dockerComposePath = path.resolve(__dirname, '../docker-compose.yml');
    const dockerfilePath = path.resolve(__dirname, '../Dockerfile');
    const readmePath = path.resolve(__dirname, '../nginx/README.md');

    assert(fs.existsSync(nginxConfPath), 'nginx/nginx.conf exists');
    assert(fs.existsSync(vhostConfPath), 'nginx/conf.d/urban-furniture.conf exists');
    assert(fs.existsSync(dockerComposePath), 'docker-compose.yml exists');
    assert(fs.existsSync(dockerfilePath), 'Dockerfile exists');
    assert(fs.existsSync(readmePath), 'nginx/README.md documentation exists');

    const vhostContent = fs.readFileSync(vhostConfPath, 'utf8');
    assert(vhostContent.includes('listen 80;') && vhostContent.includes('return 301 https://$host$request_uri;'), 'Nginx Port 80 redirects permanently to HTTPS');
    assert(vhostContent.includes('listen 443 ssl http2;') || vhostContent.includes('listen 443 ssl;'), 'Nginx Port 443 listens for TLS connections');
    assert(vhostContent.includes('proxy_pass http://urban_backend;') && vhostContent.includes('proxy_set_header X-Forwarded-Proto https;'), 'Nginx forwards /api/ to backend with full TLS proxy headers');
    assert(vhostContent.includes('proxy_set_header Upgrade $http_upgrade;') && vhostContent.includes('proxy_set_header Connection "upgrade";'), 'Nginx configures WebSocket proxy headers for Vite SPA');
    assert(vhostContent.includes('ssl_protocols TLSv1.2 TLSv1.3;'), 'Nginx enforces modern TLSv1.2 & TLSv1.3 protocols');

    console.log('\n--- 6. Testing TLS Certificates & Native HTTPS Server ---');

    const certPath = path.resolve(__dirname, '../ssl/server.crt');
    const keyPath = path.resolve(__dirname, '../ssl/server.key');

    assert(fs.existsSync(certPath), 'ssl/server.crt TLS certificate file exists');
    assert(fs.existsSync(keyPath), 'ssl/server.key private key file exists');

    const certContent = fs.readFileSync(certPath, 'utf8');
    const keyContent = fs.readFileSync(keyPath, 'utf8');
    assert(certContent.includes('-----BEGIN CERTIFICATE-----'), 'server.crt is valid X.509 PEM certificate');
    assert(keyContent.includes('-----BEGIN PRIVATE KEY-----') || keyContent.includes('-----BEGIN RSA PRIVATE KEY-----'), 'server.key is valid PEM private key');

    // Test 6.2: Boot temporary HTTPS server to verify certificate validity
    const HTTPS_PORT = 5099;
    const httpsServer = https.createServer({
      key: keyContent,
      cert: certContent
    }, app);

    await new Promise(resolve => httpsServer.listen(HTTPS_PORT, resolve));

    // Make HTTPS request accepting self-signed cert
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });
    const httpsRes = await new Promise((resolve, reject) => {
      const req = https.request({
        hostname: '127.0.0.1',
        port: HTTPS_PORT,
        path: '/api/health',
        method: 'GET',
        agent: httpsAgent
      }, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
      });
      req.on('error', reject);
      req.end();
    });

    assert(httpsRes.status === 200, `Native HTTPS server responds with 200 OK over TLS connection (status: ${httpsRes.status})`);
    assert(httpsRes.headers['strict-transport-security'], 'HTTPS responses include HSTS header');

    httpsServer.close();

    console.log('\n========================================================================');
    console.log(`PHASE 5 VERIFICATION RESULTS: ${passedTests} / ${totalTests} TESTS PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
    console.log('========================================================================\n');

  } catch (err) {
    console.error('Fatal test error in verifyPhase5:', err);
  } finally {
    server.close();
    await mongoose.connection.close();
    process.exit(passedTests === totalTests ? 0 : 1);
  }
}

verifyPhase5();
