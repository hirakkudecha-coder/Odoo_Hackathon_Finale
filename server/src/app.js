const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const { securityHeaders, enforceHttps } = require('./middleware/securityMiddleware');

// Route imports
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const productRoutes = require('./routes/productRoutes');
const accountRoutes = require('./routes/accountRoutes');
const journalRoutes = require('./routes/journalRoutes');
const analyticAccountRoutes = require('./routes/analyticAccountRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const journalEntryRoutes = require('./routes/journalEntryRoutes');
const purchaseOrderRoutes = require('./routes/purchaseOrderRoutes');
const goodsReceiptRoutes = require('./routes/goodsReceiptRoutes');
const vendorBillRoutes = require('./routes/vendorBillRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const salesOrderRoutes = require('./routes/salesOrderRoutes');
const salesReceiptRoutes = require('./routes/salesReceiptRoutes');
const customerInvoiceRoutes = require('./routes/customerInvoiceRoutes');
const reportRoutes = require('./routes/reportRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const showroomRoutes = require('./routes/showroomRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const helpdeskRoutes = require('./routes/helpdeskRoutes');

const app = express();

// Reverse Proxy Configuration: trust X-Forwarded-* headers from upstream reverse proxy
app.set('trust proxy', process.env.TRUST_PROXY ? (process.env.TRUST_PROXY === 'true' ? true : parseInt(process.env.TRUST_PROXY, 10)) : 1);

// Prevent server fingerprinting
app.disable('x-powered-by');

// TLS & Security Headers Middleware
app.use(enforceHttps);
app.use(securityHeaders);

// Strict CORS Allow-List Configuration
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map(s => s.trim()) : []),
  ...(process.env.CORS_ORIGIN && process.env.CORS_ORIGIN !== '*' ? process.env.CORS_ORIGIN.split(',').map(s => s.trim()) : [])
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server, curl, and test tools without Origin header
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked: Origin '${origin}' is not authorized.`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Root Route
app.get('/', (req, res) => {
  res.json({
    message: 'Urban Furniture Accounting API',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/api/health',
    heartbeat: '/api/health/heartbeat'
  });
});

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/analytic-accounts', analyticAccountRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/journal-entries', journalEntryRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/goods-receipts', goodsReceiptRoutes);
app.use('/api/vendor-bills', vendorBillRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/sales-orders', salesOrderRoutes);
app.use('/api/sales-receipts', salesReceiptRoutes);
app.use('/api/customer-invoices', customerInvoiceRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/showrooms', showroomRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/helpdesk', helpdeskRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
