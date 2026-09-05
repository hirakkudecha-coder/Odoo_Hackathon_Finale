const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

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

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

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

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
