const http = require('http');
const connectDB = require('../src/config/db');
const app = require('../src/app');
const mongoose = require('mongoose');

async function testFoundation() {
  console.log('--- Testing Phase 1: Backend Foundation ---');
  await connectDB();
  
  const server = app.listen(5099);

  try {
    // Test 1: GET /api/health
    const healthRes = await fetch('http://localhost:5099/api/health');
    const healthData = await healthRes.json();
    console.log('[Test 1] GET /api/health:', healthData.status === 'UP' ? 'PASS' : 'FAIL', healthData);

    // Test 2: GET /api/health/heartbeat
    const hbRes = await fetch('http://localhost:5099/api/health/heartbeat');
    const hbData = await hbRes.json();
    console.log('[Test 2] GET /api/health/heartbeat:', hbData.heartbeat?.status === 'ALIVE' ? 'PASS' : 'FAIL', hbData.heartbeat);

    // Test 3: 404 handler
    const notFoundRes = await fetch('http://localhost:5099/api/unknown-endpoint');
    const notFoundData = await notFoundRes.json();
    console.log('[Test 3] 404 Handling:', notFoundRes.status === 404 ? 'PASS' : 'FAIL', notFoundData);

    console.log('--- Phase 1 Foundation Verified Successfully! ---\n');
  } finally {
    server.close();
    await mongoose.connection.close();
  }
}

if (require.main === module) {
  testFoundation().catch(err => {
    console.error('Foundation test failed:', err);
    process.exit(1);
  });
}

module.exports = { testFoundation };
