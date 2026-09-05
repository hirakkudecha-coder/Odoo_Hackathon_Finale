require('dotenv').config();
const connectDB = require('../config/db');
const mongoose = require('mongoose');

// Models
const User = require('../models/User');
const Account = require('../models/Account');
const Journal = require('../models/Journal');
const AnalyticAccount = require('../models/AnalyticAccount');
const Contact = require('../models/Contact');
const Product = require('../models/Product');
const Budget = require('../models/Budget');
const JournalEntry = require('../models/JournalEntry');
const PurchaseOrder = require('../models/PurchaseOrder');
const GoodsReceipt = require('../models/GoodsReceipt');
const VendorBill = require('../models/VendorBill');
const SalesOrder = require('../models/SalesOrder');
const SalesReceipt = require('../models/SalesReceipt');
const CustomerInvoice = require('../models/CustomerInvoice');
const Payment = require('../models/Payment');

const seedData = async () => {
  try {
    console.log('--- Starting Urban Furniture Database Seeder ---');
    await connectDB();

    // 1. Clear existing data
    console.log('Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Account.deleteMany({}),
      Journal.deleteMany({}),
      AnalyticAccount.deleteMany({}),
      Contact.deleteMany({}),
      Product.deleteMany({}),
      Budget.deleteMany({}),
      JournalEntry.deleteMany({}),
      PurchaseOrder.deleteMany({}),
      GoodsReceipt.deleteMany({}),
      VendorBill.deleteMany({}),
      SalesOrder.deleteMany({}),
      SalesReceipt.deleteMany({}),
      CustomerInvoice.deleteMany({}),
      Payment.deleteMany({})
    ]);

    // 2. Seed Users
    console.log('Seeding Users...');
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@urbanfurniture.com',
      password: 'AdminPassword123!',
      role: 'admin',
      status: 'active'
    });

    const accountantUser = await User.create({
      name: 'Senior Accountant',
      email: 'accountant@urbanfurniture.com',
      password: 'AccountantPassword123!',
      role: 'accountant',
      status: 'active'
    });

    const contactUser = await User.create({
      name: 'Client Portal User',
      email: 'contact@urbanfurniture.com',
      password: 'ContactPassword123!',
      role: 'contact',
      status: 'active'
    });

    console.log(` Created 3 Users (Admin: ${adminUser.email}, Accountant: ${accountantUser.email})`);

    // 3. Seed Chart of Accounts
    console.log('Seeding Chart of Accounts...');
    const accountsData = [
      { code: '1001', name: 'Cash', type: 'Asset', isSystem: true, description: 'Cash in Hand' },
      { code: '1002', name: 'Bank', type: 'Asset', isSystem: true, description: 'Main Bank Account' },
      { code: '1003', name: 'Debtors', type: 'Asset', isSystem: true, description: 'Accounts Receivable (Customers)' },
      { code: '2001', name: 'Creditors', type: 'Liability', isSystem: true, description: 'Accounts Payable (Vendors)' },
      { code: '2002', name: 'Tax Payable', type: 'Liability', isSystem: true, description: 'GST / Sales Tax Payable' },
      { code: '3001', name: 'Capital', type: 'Capital', isSystem: true, description: 'Owner Capital & Equity' },
      { code: '4001', name: 'Sale Income', type: 'Income', isSystem: true, description: 'Revenue from Product Sales' },
      { code: '5001', name: 'Purchases Expense', type: 'Expense', isSystem: true, description: 'Cost of Goods / Inventory Purchase' },
      { code: '5002', name: 'Operating Expenses', type: 'Expense', isSystem: false, description: 'General & Admin Expenses' }
    ];

    const accountsMap = {};
    for (const acc of accountsData) {
      const created = await Account.create(acc);
      accountsMap[acc.name] = created;
    }
    console.log(` Created ${accountsData.length} Chart of Accounts entries`);

    // 4. Seed Standard Journals
    console.log('Seeding Journals...');
    const journalsData = [
      {
        code: 'INV',
        name: 'Customer Invoices (Sales)',
        type: 'Sales',
        defaultCreditAccount: accountsMap['Sale Income']._id,
        defaultDebitAccount: accountsMap['Debtors']._id
      },
      {
        code: 'BILL',
        name: 'Vendor Bills (Purchase)',
        type: 'Purchase',
        defaultDebitAccount: accountsMap['Purchases Expense']._id,
        defaultCreditAccount: accountsMap['Creditors']._id
      },
      {
        code: 'BNK',
        name: 'Bank Journal',
        type: 'Bank',
        defaultDebitAccount: accountsMap['Bank']._id,
        defaultCreditAccount: accountsMap['Bank']._id
      },
      {
        code: 'CSH',
        name: 'Cash Journal',
        type: 'Cash',
        defaultDebitAccount: accountsMap['Cash']._id,
        defaultCreditAccount: accountsMap['Cash']._id
      },
      {
        code: 'GEN',
        name: 'Miscellaneous / General Operations',
        type: 'General'
      }
    ];

    for (const jrn of journalsData) {
      await Journal.create(jrn);
    }
    console.log(` Created ${journalsData.length} Standard Journals`);

    // 5. Seed Analytic Accounts
    console.log('Seeding Analytic Accounts...');
    const analyticOps = await AnalyticAccount.create({
      code: 'AN-OPS',
      name: 'Operations & Facilities',
      type: 'Expenses',
      description: 'Expenses related to day-to-day warehouse and office operations'
    });

    const analyticSales = await AnalyticAccount.create({
      code: 'AN-SALES',
      name: 'Furniture Retail Income',
      type: 'Income',
      description: 'Retail furniture sales analytic stream'
    });

    console.log(' Created 2 Analytic Accounts');

    // 6. Seed Budgets
    console.log('Seeding Budgets...');
    await Budget.create({
      name: 'Annual Operations Budget 2026',
      period: '2026-Annual',
      responsiblePerson: adminUser.name,
      analyticAccount: analyticOps._id,
      plannedAmount: 500000,
      status: 'confirmed'
    });
    console.log(' Created Sample Budget');

    // 7. Seed Contacts
    console.log('Seeding Contacts...');
    const vendorAzure = await Contact.create({
      name: 'Azure Furniture',
      type: 'Vendor',
      email: 'orders@azurefurniture.com',
      mobile: '9820011223',
      address: {
        street: '101 Industrial Estate',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400013'
      },
      notes: 'Premier wooden and metal furniture supplier'
    });

    const customerNimesh = await Contact.create({
      name: 'Nimesh Pathak',
      type: 'Customer',
      email: 'nimesh.pathak@example.com',
      mobile: '9876501234',
      address: {
        street: '42 Satellite Road',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380015'
      },
      notes: 'Corporate interior design client'
    });

    const contactBoth = await Contact.create({
      name: 'Deco Addict Supplies',
      type: 'Both',
      email: 'contact@decoaddict.com',
      mobile: '9988776655',
      address: {
        street: '55 Commerce Blvd',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560001'
      },
      notes: 'Both supplier of raw fabric and client for custom desks'
    });

    console.log(' Created 3 Contacts (Vendor, Customer, Both)');

    // 8. Seed Products
    console.log('Seeding Products...');
    const productsData = [
      {
        name: 'Office Chair',
        type: 'Goods',
        salesPrice: 2500,
        costPrice: 1500,
        category: 'Office Furniture',
        taxPercent: 0,
        description: 'Ergonomic high-back office chair with lumbar support'
      },
      {
        name: 'Executive Wooden Desk',
        type: 'Goods',
        salesPrice: 12000,
        costPrice: 7500,
        category: 'Executive Furniture',
        taxPercent: 0,
        description: 'Solid oak executive office desk with dual pedestals'
      },
      {
        name: 'Interior Space Consultation',
        type: 'Service',
        salesPrice: 5000,
        costPrice: 1000,
        category: 'Consulting Services',
        taxPercent: 0,
        description: 'On-site 3D layout planning and design consultation'
      },
      {
        name: 'Complete Home Office Suite',
        type: 'Combo',
        salesPrice: 18000,
        costPrice: 11000,
        category: 'Combos & Packages',
        taxPercent: 0,
        description: 'Includes 1 Executive Desk, 1 Ergonomic Chair, and 1 Filing Cabinet'
      }
    ];

    for (const prod of productsData) {
      await Product.create(prod);
    }
    console.log(` Created ${productsData.length} Products (Goods, Service, Combo)`);

    console.log('\n======================================================');
    console.log(' Database Seeding Completed Successfully!');
    console.log('======================================================');
    console.log(' Default Login Credentials:');
    console.log(' - Admin:      admin@urbanfurniture.com / AdminPassword123!');
    console.log(' - Accountant: accountant@urbanfurniture.com / AccountantPassword123!');
    console.log(' - Contact:    contact@urbanfurniture.com / ContactPassword123!');
    console.log('======================================================\n');
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  } finally {
    if (require.main === module) {
      await mongoose.connection.close();
    }
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
