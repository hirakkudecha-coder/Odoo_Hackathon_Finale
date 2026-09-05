async function testAll() {
  // First login as admin to get auth token
  let token = '';
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@urbanfurniture.com', password: 'AdminPassword123!' })
    });
    const loginData = await loginRes.json();
    if (loginData.token) {
      token = loginData.token;
      console.log('Admin login successful. JWT obtained.');
    }
  } catch (err) {
    console.warn('Login error:', err.message);
  }

  const authHeader = token ? { 'Authorization': `Bearer ${token}` } : {};

  const tests = [
    // Public endpoints
    { name: 'GET /api/showrooms (Public)', url: 'http://localhost:5000/api/showrooms' },
    { 
      name: 'POST /api/showrooms/book-tour (Public)', 
      url: 'http://localhost:5000/api/showrooms/book-tour',
      method: 'POST',
      body: {
        showroom: 'Mumbai Flagship Atelier',
        name: 'John Architect',
        email: 'john@example.com',
        phone: '+91 99999 88888',
        date: '2026-09-15',
        timeSlot: '11:00 AM - 12:30 PM',
        guests: '2 Guests',
        notes: 'Interested in bespoke dining collection'
      }
    },
    // Anonymous checks on protected routes (Expected 401)
    { name: 'GET /api/showrooms/bookings (Anonymous -> 401)', url: 'http://localhost:5000/api/showrooms/bookings', expectedStatus: 401 },
    { name: 'GET /api/helpdesk/tickets (Anonymous -> 401)', url: 'http://localhost:5000/api/helpdesk/tickets', expectedStatus: 401 },
    { name: 'GET /api/partners (Anonymous -> 401)', url: 'http://localhost:5000/api/partners', expectedStatus: 401 },
    { name: 'GET /api/inquiries/designer (Anonymous -> 401)', url: 'http://localhost:5000/api/inquiries/designer', expectedStatus: 401 },

    // Authenticated access on protected routes (Expected 200)
    { name: 'GET /api/showrooms/bookings (Authenticated)', url: 'http://localhost:5000/api/showrooms/bookings', headers: authHeader },
    { name: 'GET /api/helpdesk/tickets (Authenticated)', url: 'http://localhost:5000/api/helpdesk/tickets', headers: authHeader },
    { name: 'GET /api/partners (Authenticated)', url: 'http://localhost:5000/api/partners', headers: authHeader },
    { name: 'GET /api/inquiries/designer (Authenticated)', url: 'http://localhost:5000/api/inquiries/designer', headers: authHeader },

    // Public submissions
    {
      name: 'POST /api/helpdesk/tickets (Public)',
      url: 'http://localhost:5000/api/helpdesk/tickets',
      method: 'POST',
      body: {
        name: 'Sarah Connor',
        email: 'sarah@example.com',
        referenceNo: 'SO-2026-001',
        category: 'Double-Entry Ledger Balancing',
        priority: 'Medium',
        subject: 'General verification test ticket',
        message: 'Checking ticket creation integration'
      }
    },
    {
      name: 'POST /api/partners/apply (Public)',
      url: 'http://localhost:5000/api/partners/apply',
      method: 'POST',
      body: {
        studioName: 'Aura Interiors',
        contactPerson: 'Ar. Rajan Patel',
        email: 'rajan@aurainteriors.com',
        phone: '+91 98765 43210',
        gstin: '27AABCU9603R1ZM',
        website: 'https://aurainteriors.com',
        procurementVolume: 3500000
      }
    },
    {
      name: 'POST /api/inquiries/designer (Public)',
      url: 'http://localhost:5000/api/inquiries/designer',
      method: 'POST',
      body: {
        name: 'Elena Rostova',
        email: 'elena@rostova-design.com',
        phone: '+1 555-0199',
        projectType: 'Commercial Office',
        estimatedBudget: '$50,000 - $100,000',
        message: 'Penthouse conference suite design'
      }
    },
    { name: 'GET /api/reports/budget (Authenticated)', url: 'http://localhost:5000/api/reports/budget', headers: authHeader },
    { name: 'GET /api/budgets (Authenticated)', url: 'http://localhost:5000/api/budgets', headers: authHeader }
  ];

  let passed = 0;
  for (const t of tests) {
    try {
      const res = await fetch(t.url, {
        method: t.method || 'GET',
        headers: { 'Content-Type': 'application/json', ...(t.headers || {}) },
        body: t.body ? JSON.stringify(t.body) : undefined
      });
      const data = await res.json();
      const ok = t.expectedStatus ? (res.status === t.expectedStatus) : (res.status >= 200 && res.status < 300);
      console.log(`[${ok ? 'PASS' : 'FAIL'} ${res.status}] ${t.name}`);
      if (ok) passed++;
      else console.log('Response error:', data);
    } catch (e) {
      console.log(`[ERR] ${t.name}: ${e.message}`);
    }
  }
  console.log(`\nTotal Passed: ${passed}/${tests.length}`);
}
testAll();
