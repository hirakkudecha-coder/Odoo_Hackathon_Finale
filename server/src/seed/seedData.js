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
const ShowroomTour = require('../models/ShowroomTour');
const DesignerInquiry = require('../models/DesignerInquiry');
const HelpdeskTicket = require('../models/HelpdeskTicket');
const TradePartner = require('../models/TradePartner');
const Showroom = require('../models/Showroom');

const seedData = async () => {
  try {
    console.log('========================================================================');
    console.log('       URBAN FURNITURE ERP - COMPREHENSIVE DATABASE SEEDER               ');
    console.log('========================================================================');
    await connectDB();

    // 1. Clear existing data
    console.log('\n[1/12] Clearing existing collections...');
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
      Payment.deleteMany({}),
      ShowroomTour.deleteMany({}),
      DesignerInquiry.deleteMany({}),
      HelpdeskTicket.deleteMany({}),
      TradePartner.deleteMany({}),
      Showroom.deleteMany({})
    ]);
    console.log('✓ All 20 collections cleared successfully.');

    // 2. Seed Users
    console.log('\n[2/12] Seeding System Users & Staff...');
    const superAdminUser = await User.create({
      name: 'Elena Rossi',
      email: 'superadmin@urbanfurniture.com',
      password: 'SuperAdmin123!',
      role: 'superadmin',
      status: 'active'
    });

    const adminUser = await User.create({
      name: 'Nikita Sharma',
      email: 'admin@urbanfurniture.com',
      password: 'AdminPassword123!',
      role: 'admin',
      status: 'active'
    });

    const accountantUser = await User.create({
      name: 'Rohan Mehta',
      email: 'accountant@urbanfurniture.com',
      password: 'AccountantPassword123!',
      role: 'accountant',
      status: 'active'
    });

    const contactUser = await User.create({
      name: 'Nimesh Pathak',
      email: 'contact@urbanfurniture.com',
      password: 'ContactPassword123!',
      role: 'contact',
      status: 'active'
    });

    console.log('✓ Created 4 primary users with full RBAC credentials.');

    // 3. Seed Chart of Accounts
    console.log('\n[3/12] Seeding Chart of Accounts (Assets, Liabilities, Capital, Income, Expenses)...');
    const accountsData = [
      // Assets
      { code: '1001', name: 'Petty Cash', type: 'Asset', isSystem: true, description: 'Cash in Hand Desk', balance: 150000 },
      { code: '1002', name: 'Bank', type: 'Asset', isSystem: true, description: 'HDFC Main Operational Account', balance: 2500000 },
      { code: '1003', name: 'ICICI Current Account', type: 'Asset', isSystem: false, description: 'Secondary Gateway Account', balance: 450000 },
      { code: '1100', name: 'Debtors', type: 'Asset', isSystem: true, description: 'Trade Debtors / Accounts Receivable', balance: 0 },
      { code: '1200', name: 'Raw Material Inventory', type: 'Asset', isSystem: false, description: 'Timber, Hardware & Leather Stock', balance: 650000 },
      { code: '1250', name: 'Finished Goods Inventory', type: 'Asset', isSystem: false, description: 'Completed Handcrafted Furniture', balance: 1250000 },
      { code: '1501', name: 'Showroom Display Fixtures', type: 'Asset', isSystem: false, description: 'Gallery Fixtures & Architectural Sets', balance: 1000000 },
      
      // Liabilities
      { code: '2001', name: 'Creditors', type: 'Liability', isSystem: true, description: 'Trade Creditors / Accounts Payable', balance: 0 },
      { code: '2002', name: 'Tax Payable', type: 'Liability', isSystem: true, description: 'Output GST / Sales Tax Payable', balance: 0 },
      { code: '2003', name: 'Outstanding Payroll', type: 'Liability', isSystem: false, description: 'Accrued Artisan Wages', balance: 0 },
      
      // Capital & Equity
      { code: '3001', name: 'Capital', type: 'Capital', isSystem: true, description: 'Owner Capital & Partner Equity', balance: 6000000 },
      { code: '3002', name: 'Retained Earnings', type: 'Capital', isSystem: false, description: 'Accumulated Business Earnings', balance: 0 },

      // Income
      { code: '4001', name: 'Sale Income', type: 'Income', isSystem: true, description: 'Revenue from Luxury Furniture Sales', balance: 0 },
      { code: '4002', name: 'Bespoke Design Commissions', type: 'Income', isSystem: false, description: 'Architectural & Private Commission Fees', balance: 0 },
      
      // Expenses
      { code: '5001', name: 'Purchases Expense', type: 'Expense', isSystem: true, description: 'Cost of Timber, Fabrics & Finished Goods', balance: 0 },
      { code: '5002', name: 'Artisan Workshop Wages', type: 'Expense', isSystem: false, description: 'Master Craftsman & Carpentry Labor', balance: 0 },
      { code: '5003', name: 'Logistics & White-Glove Freight', type: 'Expense', isSystem: false, description: 'Delivery & Specialized Art Transit', balance: 0 },
      { code: '5004', name: 'Showroom Rent & Utilities', type: 'Expense', isSystem: false, description: 'Flagship Atelier Space Leases', balance: 0 },
      { code: '5005', name: 'Marketing & Exhibition Events', type: 'Expense', isSystem: false, description: 'Design Week & Catalog Production', balance: 0 },
      { code: '5006', name: 'Operating Expenses', type: 'Expense', isSystem: false, description: 'General Corporate Overhead', balance: 0 }
    ];

    const accountsMap = {};
    for (const acc of accountsData) {
      const created = await Account.create(acc);
      accountsMap[acc.name] = created;
    }
    console.log(`✓ Created ${accountsData.length} Chart of Accounts entries.`);

    // 4. Seed Standard Journals
    console.log('\n[4/12] Seeding Standard Accounting Journals...');
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
        name: 'HDFC Bank Journal',
        type: 'Bank',
        defaultDebitAccount: accountsMap['Bank']._id,
        defaultCreditAccount: accountsMap['Bank']._id
      },
      {
        code: 'CSH',
        name: 'Petty Cash Desk Journal',
        type: 'Cash',
        defaultDebitAccount: accountsMap['Petty Cash']._id,
        defaultCreditAccount: accountsMap['Petty Cash']._id
      },
      {
        code: 'GEN',
        name: 'Miscellaneous / General Operations',
        type: 'General'
      }
    ];

    const journalsMap = {};
    for (const jrn of journalsData) {
      const created = await Journal.create(jrn);
      journalsMap[jrn.code] = created;
    }
    console.log(`✓ Created ${journalsData.length} Standard Journals.`);

    // 5. Seed Analytic Accounts & Departmental Budgets
    console.log('\n[5/12] Seeding Analytic Cost Centers & FY2026 Budgets...');
    const analyticsData = [
      { code: 'AN-PROD', name: 'Production Atelier', type: 'Expenses', description: 'Woodworking, joinery, and upholstery atelier costs' },
      { code: 'AN-MKT', name: 'Brand Marketing & Events', type: 'Expenses', description: 'Luxury exhibitions, campaigns, and catalog curation' },
      { code: 'AN-ADMIN', name: 'Corporate Administration', type: 'Expenses', description: 'Executive, legal, and operational governance' },
      { code: 'AN-RD', name: 'Architectural R&D', type: 'Expenses', description: 'Ergonomic research and bespoke material prototyping' },
      { code: 'AN-HR', name: 'Artisan Guild & HR', type: 'Expenses', description: 'Apprenticeships, training, and craftsman welfare' },
      { code: 'AN-IT', name: 'IT & Infrastructure', type: 'Expenses', description: 'ERP systems, 3D visualization servers, and cloud computing' },
      { code: 'AN-SALES', name: 'Furniture Retail Income', type: 'Income', description: 'Direct atelier and digital retail revenue' }
    ];

    const analyticsMap = {};
    for (const item of analyticsData) {
      const created = await AnalyticAccount.create(item);
      analyticsMap[item.code] = created;
    }

    const budgetsData = [
      { name: 'Production Atelier Budget 2026', period: '2026-Annual', responsiblePerson: 'Nikita Sharma', analyticAccount: analyticsMap['AN-PROD']._id, plannedAmount: 1200000, status: 'confirmed' },
      { name: 'Brand Marketing & PR Budget 2026', period: '2026-Annual', responsiblePerson: 'Elena Rossi', analyticAccount: analyticsMap['AN-MKT']._id, plannedAmount: 600000, status: 'confirmed' },
      { name: 'Corporate Administration 2026', period: '2026-Annual', responsiblePerson: 'Rohan Mehta', analyticAccount: analyticsMap['AN-ADMIN']._id, plannedAmount: 450000, status: 'confirmed' },
      { name: 'Architectural R&D Prototyping 2026', period: '2026-Annual', responsiblePerson: 'Nikita Sharma', analyticAccount: analyticsMap['AN-RD']._id, plannedAmount: 350000, status: 'confirmed' },
      { name: 'Artisan Guild Human Resources 2026', period: '2026-Annual', responsiblePerson: 'Rohan Mehta', analyticAccount: analyticsMap['AN-HR']._id, plannedAmount: 250000, status: 'confirmed' },
      { name: 'IT Cloud & Infrastructure 2026', period: '2026-Annual', responsiblePerson: 'Elena Rossi', analyticAccount: analyticsMap['AN-IT']._id, plannedAmount: 200000, status: 'confirmed' }
    ];

    for (const bg of budgetsData) {
      await Budget.create(bg);
    }
    console.log(`✓ Created ${analyticsData.length} Analytic Accounts & ${budgetsData.length} Departmental Budgets.`);

    // 6. Seed Realistic Contacts (Customers, Vendors, Both)
    console.log('\n[6/12] Seeding High-End Clients, Guild Partners & Timber Vendors...');
    const contactsData = [
      {
        name: 'Nimesh Pathak',
        type: 'Customer',
        email: 'contact@urbanfurniture.com',
        mobile: '+91 98765 01234',
        address: { street: '42 Satellite Boulevard', city: 'Ahmedabad', state: 'Gujarat', pincode: '380015' },
        notes: 'Corporate interior design client and regular portal buyer',
        user: contactUser._id
      },
      {
        name: 'Aarav Mehta',
        type: 'Customer',
        email: 'aarav@modernspaces.design',
        mobile: '+91 98450 99881',
        address: { street: '14 Lavelle Road, Indiranagar', city: 'Bengaluru', state: 'Karnataka', pincode: '560001' },
        notes: 'Principal Architect at Modern Spaces; high-volume villa specifier'
      },
      {
        name: 'Ananya Desai',
        type: 'Customer',
        email: 'ananya@desaiholding.com',
        mobile: '+91 98201 55443',
        address: { street: '12 Altamount Road, Cumballa Hill', city: 'Mumbai', state: 'Maharashtra', pincode: '400026' },
        notes: 'Private residential penthouse commissioning client'
      },
      {
        name: 'Rajesh Sharma',
        type: 'Customer',
        email: 'rajesh@eleganthomes.in',
        mobile: '+91 98110 33221',
        address: { street: '24 Sundar Nagar', city: 'New Delhi', state: 'Delhi', pincode: '110003' },
        notes: 'Boutique hospitality and heritage resort developer'
      },
      {
        name: 'Vikram Sengupta',
        type: 'Customer',
        email: 'vikram.sengupta@residency.com',
        mobile: '+91 98300 77665',
        address: { street: '88 Ballygunge Circular Road', city: 'Kolkata', state: 'West Bengal', pincode: '700019' },
        notes: 'Luxury residential suite client'
      },
      {
        name: 'Azure Craft Wood Mills',
        type: 'Vendor',
        email: 'orders@azurecraftmills.com',
        mobile: '+91 98200 11223',
        address: { street: '101 Industrial Estate, Lower Parel', city: 'Mumbai', state: 'Maharashtra', pincode: '400013' },
        notes: 'Primary supplier of seasoned plantation teak, ash and white oak'
      },
      {
        name: 'Crafty Wood Co.',
        type: 'Vendor',
        email: 'supplies@craftywood.in',
        mobile: '+91 94140 22334',
        address: { street: '78 Timber Market, Boranada', city: 'Jodhpur', state: 'Rajasthan', pincode: '342012' },
        notes: 'Specialist artisan timber and hand-carved joinery supplier'
      },
      {
        name: 'Prime Metals & Hardware',
        type: 'Vendor',
        email: 'billing@primemetals.in',
        mobile: '+91 98900 44556',
        address: { street: '55 Bhosari Industrial Area', city: 'Pune', state: 'Maharashtra', pincode: '411026' },
        notes: 'Precision brushed brass, matte black steel and architectural hardware'
      },
      {
        name: 'Velvet Luxe Mills',
        type: 'Vendor',
        email: 'sales@velvetluxemills.com',
        mobile: '+91 98250 66778',
        address: { street: '12 Ring Road Textile Hub', city: 'Surat', state: 'Gujarat', pincode: '395002' },
        notes: 'Italian imported velvets, botanical linens and full-grain leathers'
      },
      {
        name: 'Deco Addict Supplies',
        type: 'Both',
        email: 'partnerships@decoaddict.com',
        mobile: '+91 99887 76655',
        address: { street: '55 Commerce Boulevard', city: 'Bengaluru', state: 'Karnataka', pincode: '560001' },
        notes: 'Dual relationship: Supplies raw hides and procures custom executive desks'
      }
    ];

    const contactsMap = {};
    for (const c of contactsData) {
      const created = await Contact.create(c);
      contactsMap[c.name] = created;
    }

    // Link contact to portal user
    if (contactsMap['Nimesh Pathak']) {
      await User.findByIdAndUpdate(contactUser._id, { contactId: contactsMap['Nimesh Pathak']._id });
    }
    console.log(`✓ Created ${contactsData.length} Contacts (Customers, Vendors & Trade Partners).`);

    // 7. Seed Luxury Catalog Products
    console.log('\n[7/12] Seeding Luxury Handcrafted Product Catalog...');
    const productsData = [
      {
        name: 'Olive Velvet Lounge Chair',
        type: 'Goods',
        salesPrice: 24500,
        costPrice: 14200,
        category: 'Living Room Seating',
        taxPercent: 5,
        description: 'Rich moss green Italian velvet armchair with solid walnut legs and hand-tufted ergonomics.'
      },
      {
        name: 'Amber Velvet 3-Seater Sofa',
        type: 'Goods',
        salesPrice: 58000,
        costPrice: 34500,
        category: 'Living Room Seating',
        taxPercent: 5,
        description: 'Curvilinear sculptural sofa in warm saffron velvet with brushed brass plinth base.'
      },
      {
        name: 'Sculptural Sand Daybed',
        type: 'Goods',
        salesPrice: 42000,
        costPrice: 25000,
        category: 'Luxury Loungers',
        taxPercent: 5,
        description: 'Minimalist low-slung chaise daybed upholstered in organic linen with cylindrical neck bolster.'
      },
      {
        name: 'Handcrafted Rattan Accent Chair',
        type: 'Goods',
        salesPrice: 18200,
        costPrice: 9500,
        category: 'Accent Furniture',
        taxPercent: 5,
        description: 'Bentwood beech frame with intricate hand-woven natural cane backrest and linen seat pad.'
      },
      {
        name: 'Nordic Oak Credenza',
        type: 'Goods',
        salesPrice: 65000,
        costPrice: 38000,
        category: 'Storage & Credenzas',
        taxPercent: 5,
        description: 'Four-door fluted solid white oak sideboard with soft-close Blum hinges and brass hardware.'
      },
      {
        name: 'Minimalist Yellow Ottoman',
        type: 'Goods',
        salesPrice: 12500,
        costPrice: 6800,
        category: 'Living Room Accents',
        taxPercent: 5,
        description: 'Ochre yellow bouclé pouf ottoman functioning as vanity seating or accent footrest.'
      },
      {
        name: 'Deep Indigo Minimalist Loveseat',
        type: 'Goods',
        salesPrice: 36000,
        costPrice: 21000,
        category: 'Studio Seating',
        taxPercent: 5,
        description: 'Compact 2-seater apartment settee upholstered in dark midnight navy chenille weave.'
      },
      {
        name: 'Executive Solid Walnut Desk',
        type: 'Goods',
        salesPrice: 48000,
        costPrice: 28000,
        category: 'Workspace Furniture',
        taxPercent: 5,
        description: 'Commanding office desk with chamfered edge profile, hidden cable trough and soft-glide drawers.'
      },
      {
        name: 'Carrara Marble Dining Table',
        type: 'Goods',
        salesPrice: 85000,
        costPrice: 49000,
        category: 'Dining Room',
        taxPercent: 5,
        description: 'Honed Italian Carrara marble oval top supported on twin conical fluted oak pedestal bases.'
      },
      {
        name: 'Floating Teak Platform Bed',
        type: 'Goods',
        salesPrice: 72000,
        costPrice: 41000,
        category: 'Bedroom Atelier',
        taxPercent: 5,
        description: 'King-size platform bed frame with integrated floating cantilever nightstands and leather headboard.'
      },
      {
        name: 'Architectural Bespoke Consultation',
        type: 'Service',
        salesPrice: 15000,
        costPrice: 2000,
        category: 'Consulting Services',
        taxPercent: 0,
        description: 'On-site spatial audit, custom furniture CAD drafting, and bespoke finish curation.'
      },
      {
        name: 'Executive Atelier Penthouse Suite',
        type: 'Combo',
        salesPrice: 145000,
        costPrice: 85000,
        category: 'Combos & Packages',
        taxPercent: 5,
        description: 'Curated 5-piece executive package: 1 Walnut Desk, 1 Lounge Chair, 1 Credenza, 2 Ottomans.'
      }
    ];

    const productsMap = {};
    for (const p of productsData) {
      const created = await Product.create(p);
      productsMap[p.name] = created;
    }
    console.log(`✓ Created ${productsData.length} Luxury Furniture Products (Goods, Services, Combos).`);

    // 8. Seed Opening Capital Balanced Voucher (Accounting Foundation)
    console.log('\n[8/12] Establishing Opening Capital & Equity Journal Vouchers...');
    const openingEntry = await JournalEntry.create({
      entryNumber: 'JE-2026-0001',
      journal: journalsMap['GEN']._id,
      date: new Date('2026-01-01'),
      reference: 'Fiscal Year 2026 Initial Capital & Asset Inception',
      status: 'posted',
      items: [
        { account: accountsMap['Bank']._id, label: 'Opening Bank Balance (HDFC)', debit: 2500000, credit: 0 },
        { account: accountsMap['Petty Cash']._id, label: 'Opening Cash Desk Float', debit: 150000, credit: 0 },
        { account: accountsMap['Raw Material Inventory']._id, label: 'Opening Timber & Leather Stock', debit: 650000, credit: 0 },
        { account: accountsMap['Finished Goods Inventory']._id, label: 'Opening Furniture Warehouse Stock', debit: 1250000, credit: 0 },
        { account: accountsMap['Showroom Display Fixtures']._id, label: 'Flagship Atelier Architecture Assets', debit: 1000000, credit: 0 },
        { account: accountsMap['ICICI Current Account']._id, label: 'Secondary Bank Reserve', debit: 450000, credit: 0 },
        { account: accountsMap['Capital']._id, label: 'Partner Initial Equity & Inception Capital', debit: 0, credit: 6000000 }
      ],
      totalDebit: 6000000,
      totalCredit: 6000000,
      notes: 'Initial opening double-entry balance voucher for Urban Furniture ERP.'
    });
    console.log(`✓ Created balanced Opening Voucher ${openingEntry.entryNumber} (Total: ₹ 60,00,000.00).`);

    // 9. Seed Purchasing Flow (POs, Goods Receipts, Vendor Bills, Payments & Journal Entries)
    console.log('\n[9/12] Simulating Purchasing Pipeline (POs, Receipts, Bills, Payments)...');

    // PO 1: Azure Craft Wood Mills - Received, Billed & Paid
    const po1 = await PurchaseOrder.create({
      orderNumber: 'PO-2026-001',
      vendor: contactsMap['Azure Craft Wood Mills']._id,
      orderDate: new Date('2026-08-15'),
      items: [
        {
          product: productsMap['Nordic Oak Credenza']._id,
          description: 'Solid white oak credenza wholesale stock batch',
          quantity: 10,
          unitPrice: 38000,
          subtotal: 380000
        }
      ],
      totalAmount: 380000,
      status: 'billed',
      notes: 'Contract order for Autumn collection storage inventory'
    });

    const gr1 = await GoodsReceipt.create({
      receiptNumber: 'GR-2026-001',
      purchaseOrder: po1._id,
      vendor: contactsMap['Azure Craft Wood Mills']._id,
      receiptDate: new Date('2026-08-18'),
      items: [
        {
          product: productsMap['Nordic Oak Credenza']._id,
          quantity: 10,
          unitPrice: 38000,
          totalPrice: 380000
        }
      ],
      status: 'received',
      notes: 'All 10 units inspected; timber moisture content within 8-10% tolerance'
    });

    const bill1Entry = await JournalEntry.create({
      entryNumber: 'JE-2026-0002',
      journal: journalsMap['BILL']._id,
      date: new Date('2026-08-20'),
      reference: 'Vendor Bill BILL-2026-001 - Azure Craft Wood Mills',
      partner: contactsMap['Azure Craft Wood Mills']._id,
      status: 'posted',
      items: [
        { account: accountsMap['Purchases Expense']._id, partner: contactsMap['Azure Craft Wood Mills']._id, label: 'Cost of Goods - Nordic Oak Credenzas', debit: 380000, credit: 0, analyticAccount: analyticsMap['AN-PROD']._id },
        { account: accountsMap['Creditors']._id, partner: contactsMap['Azure Craft Wood Mills']._id, label: 'Trade Payable to Azure Craft Wood Mills', debit: 0, credit: 380000 }
      ],
      totalDebit: 380000,
      totalCredit: 380000
    });

    const bill1 = await VendorBill.create({
      billNumber: 'BILL-2026-001',
      vendor: contactsMap['Azure Craft Wood Mills']._id,
      purchaseOrder: po1._id,
      billDate: new Date('2026-08-20'),
      dueDate: new Date('2026-09-20'),
      items: [
        {
          product: productsMap['Nordic Oak Credenza']._id,
          description: 'Solid white oak credenza wholesale stock batch',
          quantity: 10,
          unitPrice: 38000,
          subtotal: 380000,
          analyticAccount: analyticsMap['AN-PROD']._id
        }
      ],
      totalAmount: 380000,
      paidAmount: 380000,
      status: 'paid',
      journalEntry: bill1Entry._id,
      notes: 'Fully settled via HDFC Bank Wire Transfer'
    });

    const pay1Entry = await JournalEntry.create({
      entryNumber: 'JE-2026-0003',
      journal: journalsMap['BNK']._id,
      date: new Date('2026-08-22'),
      reference: 'Payment PAY-2026-001 for BILL-2026-001',
      partner: contactsMap['Azure Craft Wood Mills']._id,
      status: 'posted',
      items: [
        { account: accountsMap['Creditors']._id, partner: contactsMap['Azure Craft Wood Mills']._id, label: 'Clearance of Accounts Payable', debit: 380000, credit: 0 },
        { account: accountsMap['Bank']._id, partner: contactsMap['Azure Craft Wood Mills']._id, label: 'Bank Disbursement via HDFC Wire', debit: 0, credit: 380000 }
      ],
      totalDebit: 380000,
      totalCredit: 380000
    });

    await Payment.create({
      paymentNumber: 'PAY-2026-001',
      paymentType: 'send_money',
      partner: contactsMap['Azure Craft Wood Mills']._id,
      paymentDate: new Date('2026-08-22'),
      amount: 380000,
      paymentMethod: 'Bank',
      journal: journalsMap['BNK']._id,
      vendorBill: bill1._id,
      status: 'posted',
      journalEntry: pay1Entry._id,
      notes: 'UTR: HDFC88992211 - Fully Settled'
    });

    // PO 2: Crafty Wood Co. - Received, Billed & Partially Paid
    const po2 = await PurchaseOrder.create({
      orderNumber: 'PO-2026-002',
      vendor: contactsMap['Crafty Wood Co.']._id,
      orderDate: new Date('2026-08-25'),
      items: [
        {
          product: productsMap['Olive Velvet Lounge Chair']._id,
          description: 'Walnut frame armchairs in custom olive velvet',
          quantity: 15,
          unitPrice: 14200,
          subtotal: 213000
        }
      ],
      totalAmount: 213000,
      status: 'billed',
      notes: 'Atelier batch production order'
    });

    await GoodsReceipt.create({
      receiptNumber: 'GR-2026-002',
      purchaseOrder: po2._id,
      vendor: contactsMap['Crafty Wood Co.']._id,
      receiptDate: new Date('2026-08-28'),
      items: [
        {
          product: productsMap['Olive Velvet Lounge Chair']._id,
          quantity: 15,
          unitPrice: 14200,
          totalPrice: 213000
        }
      ],
      status: 'received',
      notes: '15 units received at warehouse desk'
    });

    const bill2Entry = await JournalEntry.create({
      entryNumber: 'JE-2026-0004',
      journal: journalsMap['BILL']._id,
      date: new Date('2026-08-29'),
      reference: 'Vendor Bill BILL-2026-002 - Crafty Wood Co.',
      partner: contactsMap['Crafty Wood Co.']._id,
      status: 'posted',
      items: [
        { account: accountsMap['Purchases Expense']._id, partner: contactsMap['Crafty Wood Co.']._id, label: 'Cost of Goods - Olive Lounge Chairs', debit: 213000, credit: 0, analyticAccount: analyticsMap['AN-PROD']._id },
        { account: accountsMap['Creditors']._id, partner: contactsMap['Crafty Wood Co.']._id, label: 'Trade Payable to Crafty Wood Co.', debit: 0, credit: 213000 }
      ],
      totalDebit: 213000,
      totalCredit: 213000
    });

    const bill2 = await VendorBill.create({
      billNumber: 'BILL-2026-002',
      vendor: contactsMap['Crafty Wood Co.']._id,
      purchaseOrder: po2._id,
      billDate: new Date('2026-08-29'),
      dueDate: new Date('2026-09-29'),
      items: [
        {
          product: productsMap['Olive Velvet Lounge Chair']._id,
          description: 'Walnut frame armchairs in custom olive velvet',
          quantity: 15,
          unitPrice: 14200,
          subtotal: 213000,
          analyticAccount: analyticsMap['AN-PROD']._id
        }
      ],
      totalAmount: 213000,
      paidAmount: 100000,
      status: 'partial',
      journalEntry: bill2Entry._id,
      notes: 'Advance installment disbursed; balance pending'
    });

    const pay2Entry = await JournalEntry.create({
      entryNumber: 'JE-2026-0005',
      journal: journalsMap['BNK']._id,
      date: new Date('2026-08-30'),
      reference: 'Partial Payment for BILL-2026-002',
      partner: contactsMap['Crafty Wood Co.']._id,
      status: 'posted',
      items: [
        { account: accountsMap['Creditors']._id, partner: contactsMap['Crafty Wood Co.']._id, label: 'Partial Settlement of Creditor Balance', debit: 100000, credit: 0 },
        { account: accountsMap['Bank']._id, partner: contactsMap['Crafty Wood Co.']._id, label: 'HDFC Bank Outflow', debit: 0, credit: 100000 }
      ],
      totalDebit: 100000,
      totalCredit: 100000
    });

    await Payment.create({
      paymentNumber: 'PAY-2026-002',
      paymentType: 'send_money',
      partner: contactsMap['Crafty Wood Co.']._id,
      paymentDate: new Date('2026-08-30'),
      amount: 100000,
      paymentMethod: 'Bank',
      journal: journalsMap['BNK']._id,
      vendorBill: bill2._id,
      status: 'posted',
      journalEntry: pay2Entry._id,
      notes: 'Partial settlement UTR: HDFC55441199'
    });

    // PO 3: Velvet Luxe Mills (Confirmed)
    await PurchaseOrder.create({
      orderNumber: 'PO-2026-003',
      vendor: contactsMap['Velvet Luxe Mills']._id,
      orderDate: new Date('2026-09-01'),
      items: [
        { product: productsMap['Minimalist Yellow Ottoman']._id, description: 'Yellow bouclé ottomans', quantity: 20, unitPrice: 6800, subtotal: 136000 }
      ],
      totalAmount: 136000,
      status: 'confirmed',
      notes: 'Supplier acknowledged; fabrication scheduled'
    });

    // PO 4: Prime Metals (Draft)
    await PurchaseOrder.create({
      orderNumber: 'PO-2026-004',
      vendor: contactsMap['Prime Metals & Hardware']._id,
      orderDate: new Date('2026-09-03'),
      items: [
        { product: productsMap['Executive Solid Walnut Desk']._id, description: 'Brushed brass underframes for executive desks', quantity: 8, unitPrice: 28000, subtotal: 224000 }
      ],
      totalAmount: 224000,
      status: 'draft',
      notes: 'Quotation evaluation phase'
    });

    console.log('✓ Seeded complete Purchasing workflow with balanced vouchers.');

    // 10. Seed Sales Flow (SOs, Sales Receipts, Customer Invoices, Payments & Journal Entries)
    console.log('\n[10/12] Simulating Sales Pipeline (Orders, Receipts, Invoices, Inflows)...');

    // SO 1: Nimesh Pathak (Portal Client) - Invoiced & Paid
    const so1 = await SalesOrder.create({
      orderNumber: 'SO-2026-001',
      customer: contactsMap['Nimesh Pathak']._id,
      orderDate: new Date('2026-08-20'),
      items: [
        {
          product: productsMap['Olive Velvet Lounge Chair']._id,
          description: 'Italian olive velvet armchair with walnut frame',
          quantity: 5,
          unitPrice: 24500,
          taxPercent: 5,
          taxAmount: 6125,
          subtotal: 128625
        }
      ],
      untaxedAmount: 122500,
      taxAmount: 6125,
      totalAmount: 128625,
      status: 'invoiced',
      notes: 'Order placed via Client Self-Service Portal'
    });

    await SalesReceipt.create({
      receiptNumber: 'SR-2026-001',
      salesOrder: so1._id,
      customer: contactsMap['Nimesh Pathak']._id,
      receiptDate: new Date('2026-08-22'),
      items: [
        { product: productsMap['Olive Velvet Lounge Chair']._id, quantity: 5, unitPrice: 24500, totalPrice: 122500 }
      ],
      status: 'delivered',
      notes: 'White-glove delivery verified by client signature'
    });

    const inv1Entry = await JournalEntry.create({
      entryNumber: 'JE-2026-0006',
      journal: journalsMap['INV']._id,
      date: new Date('2026-08-23'),
      reference: 'Customer Invoice INV-2026-001 - Nimesh Pathak',
      partner: contactsMap['Nimesh Pathak']._id,
      status: 'posted',
      items: [
        { account: accountsMap['Debtors']._id, partner: contactsMap['Nimesh Pathak']._id, label: 'Receivable from Nimesh Pathak', debit: 128625, credit: 0 },
        { account: accountsMap['Sale Income']._id, partner: contactsMap['Nimesh Pathak']._id, label: 'Finished Goods Sales Revenue', debit: 0, credit: 122500, analyticAccount: analyticsMap['AN-SALES']._id },
        { account: accountsMap['Tax Payable']._id, partner: contactsMap['Nimesh Pathak']._id, label: 'Output GST 5% Collected', debit: 0, credit: 6125 }
      ],
      totalDebit: 128625,
      totalCredit: 128625
    });

    const inv1 = await CustomerInvoice.create({
      invoiceNumber: 'INV-2026-001',
      customer: contactsMap['Nimesh Pathak']._id,
      salesOrder: so1._id,
      invoiceDate: new Date('2026-08-23'),
      dueDate: new Date('2026-09-23'),
      items: [
        {
          product: productsMap['Olive Velvet Lounge Chair']._id,
          description: 'Italian olive velvet armchair with walnut frame',
          quantity: 5,
          unitPrice: 24500,
          taxPercent: 5,
          taxAmount: 6125,
          subtotal: 128625,
          analyticAccount: analyticsMap['AN-SALES']._id
        }
      ],
      untaxedAmount: 122500,
      taxAmount: 6125,
      totalAmount: 128625,
      paidAmount: 128625,
      status: 'paid',
      journalEntry: inv1Entry._id,
      notes: 'Paid in full via Bank UPI NetBanking'
    });

    const pay3Entry = await JournalEntry.create({
      entryNumber: 'JE-2026-0007',
      journal: journalsMap['BNK']._id,
      date: new Date('2026-08-24'),
      reference: 'Customer Receipt PAY-2026-003 for INV-2026-001',
      partner: contactsMap['Nimesh Pathak']._id,
      status: 'posted',
      items: [
        { account: accountsMap['Bank']._id, partner: contactsMap['Nimesh Pathak']._id, label: 'HDFC Bank Inflow - Portal Collection', debit: 128625, credit: 0 },
        { account: accountsMap['Debtors']._id, partner: contactsMap['Nimesh Pathak']._id, label: 'Clearance of Trade Debtors Balance', debit: 0, credit: 128625 }
      ],
      totalDebit: 128625,
      totalCredit: 128625
    });

    await Payment.create({
      paymentNumber: 'PAY-2026-003',
      paymentType: 'receive_money',
      partner: contactsMap['Nimesh Pathak']._id,
      paymentDate: new Date('2026-08-24'),
      amount: 128625,
      paymentMethod: 'Bank',
      journal: journalsMap['BNK']._id,
      customerInvoice: inv1._id,
      status: 'posted',
      journalEntry: pay3Entry._id,
      notes: 'IMPS/UPI Ref: 4433221199'
    });

    // SO 2: Modern Spaces (Aarav Mehta) - Invoiced & Partially Paid
    const so2 = await SalesOrder.create({
      orderNumber: 'SO-2026-002',
      customer: contactsMap['Aarav Mehta']._id,
      orderDate: new Date('2026-08-26'),
      items: [
        {
          product: productsMap['Amber Velvet 3-Seater Sofa']._id,
          description: 'Warm saffron curved velvet sofa',
          quantity: 4,
          unitPrice: 58000,
          taxPercent: 5,
          taxAmount: 11600,
          subtotal: 243600
        }
      ],
      untaxedAmount: 232000,
      taxAmount: 11600,
      totalAmount: 243600,
      status: 'invoiced',
      notes: 'Luxury Villa Project in Indiranagar'
    });

    await SalesReceipt.create({
      receiptNumber: 'SR-2026-002',
      salesOrder: so2._id,
      customer: contactsMap['Aarav Mehta']._id,
      receiptDate: new Date('2026-08-29'),
      items: [
        { product: productsMap['Amber Velvet 3-Seater Sofa']._id, quantity: 4, unitPrice: 58000, totalPrice: 232000 }
      ],
      status: 'delivered',
      notes: 'Delivery completed to villa ground floor'
    });

    const inv2Entry = await JournalEntry.create({
      entryNumber: 'JE-2026-0008',
      journal: journalsMap['INV']._id,
      date: new Date('2026-08-30'),
      reference: 'Customer Invoice INV-2026-002 - Modern Spaces',
      partner: contactsMap['Aarav Mehta']._id,
      status: 'posted',
      items: [
        { account: accountsMap['Debtors']._id, partner: contactsMap['Aarav Mehta']._id, label: 'Receivable from Modern Spaces Design', debit: 243600, credit: 0 },
        { account: accountsMap['Sale Income']._id, partner: contactsMap['Aarav Mehta']._id, label: 'Finished Goods Sales Revenue', debit: 0, credit: 232000, analyticAccount: analyticsMap['AN-SALES']._id },
        { account: accountsMap['Tax Payable']._id, partner: contactsMap['Aarav Mehta']._id, label: 'Output GST 5% Collected', debit: 0, credit: 11600 }
      ],
      totalDebit: 243600,
      totalCredit: 243600
    });

    const inv2 = await CustomerInvoice.create({
      invoiceNumber: 'INV-2026-002',
      customer: contactsMap['Aarav Mehta']._id,
      salesOrder: so2._id,
      invoiceDate: new Date('2026-08-30'),
      dueDate: new Date('2026-09-30'),
      items: [
        {
          product: productsMap['Amber Velvet 3-Seater Sofa']._id,
          description: 'Warm saffron curved velvet sofa',
          quantity: 4,
          unitPrice: 58000,
          taxPercent: 5,
          taxAmount: 11600,
          subtotal: 243600,
          analyticAccount: analyticsMap['AN-SALES']._id
        }
      ],
      untaxedAmount: 232000,
      taxAmount: 11600,
      totalAmount: 243600,
      paidAmount: 150000,
      status: 'partial',
      journalEntry: inv2Entry._id,
      notes: 'Advance received; balance on project handover'
    });

    const pay4Entry = await JournalEntry.create({
      entryNumber: 'JE-2026-0009',
      journal: journalsMap['BNK']._id,
      date: new Date('2026-09-01'),
      reference: 'Partial Receipt for INV-2026-002',
      partner: contactsMap['Aarav Mehta']._id,
      status: 'posted',
      items: [
        { account: accountsMap['Bank']._id, partner: contactsMap['Aarav Mehta']._id, label: 'HDFC Bank Inflow - Studio RTGS', debit: 150000, credit: 0 },
        { account: accountsMap['Debtors']._id, partner: contactsMap['Aarav Mehta']._id, label: 'Trade Debtors Partial Offset', debit: 0, credit: 150000 }
      ],
      totalDebit: 150000,
      totalCredit: 150000
    });

    await Payment.create({
      paymentNumber: 'PAY-2026-004',
      paymentType: 'receive_money',
      partner: contactsMap['Aarav Mehta']._id,
      paymentDate: new Date('2026-09-01'),
      amount: 150000,
      paymentMethod: 'Bank',
      journal: journalsMap['BNK']._id,
      customerInvoice: inv2._id,
      status: 'posted',
      journalEntry: pay4Entry._id,
      notes: 'Studio Advance RTGS: CORP-889922'
    });

    // Additional active orders
    await SalesOrder.create({
      orderNumber: 'SO-2026-003',
      customer: contactsMap['Ananya Desai']._id,
      orderDate: new Date('2026-09-02'),
      items: [
        { product: productsMap['Sculptural Sand Daybed']._id, description: 'Organic linen chaise daybed', quantity: 2, unitPrice: 42000, taxPercent: 5, taxAmount: 4200, subtotal: 88200 }
      ],
      untaxedAmount: 84000,
      taxAmount: 4200,
      totalAmount: 88200,
      status: 'delivered',
      notes: 'Delivered; invoice pending generation'
    });

    await SalesOrder.create({
      orderNumber: 'SO-2026-004',
      customer: contactsMap['Rajesh Sharma']._id,
      orderDate: new Date('2026-09-03'),
      items: [
        { product: productsMap['Carrara Marble Dining Table']._id, description: 'Carrara marble dining tables', quantity: 3, unitPrice: 85000, taxPercent: 5, taxAmount: 12750, subtotal: 267750 }
      ],
      untaxedAmount: 255000,
      taxAmount: 12750,
      totalAmount: 267750,
      status: 'confirmed',
      notes: 'Production scheduled for delivery next week'
    });

    await SalesOrder.create({
      orderNumber: 'SO-2026-005',
      customer: contactsMap['Vikram Sengupta']._id,
      orderDate: new Date('2026-09-04'),
      items: [
        { product: productsMap['Executive Atelier Penthouse Suite']._id, description: 'Complete 5-piece penthouse suite', quantity: 1, unitPrice: 145000, taxPercent: 5, taxAmount: 7250, subtotal: 152250 }
      ],
      untaxedAmount: 145000,
      taxAmount: 7250,
      totalAmount: 152250,
      status: 'draft',
      notes: 'Custom finish approval pending from client'
    });

    console.log('✓ Seeded complete Sales workflow with balanced vouchers.');

    // Update Account Balances based on seeded transactions
    console.log('\n[11/12] Updating Dynamic Account Balances for Financial Statements...');
    // Calculate total debits and credits per account
    const allPostedEntries = await JournalEntry.find({ status: 'posted' });
    const netDeltas = {};

    for (const entry of allPostedEntries) {
      for (const item of entry.items) {
        const accId = item.account.toString();
        if (!netDeltas[accId]) netDeltas[accId] = { debit: 0, credit: 0 };
        netDeltas[accId].debit += (item.debit || 0);
        netDeltas[accId].credit += (item.credit || 0);
      }
    }

    for (const [accId, totals] of Object.entries(netDeltas)) {
      const acc = await Account.findById(accId);
      if (acc) {
        if (acc.type === 'Asset' || acc.type === 'Expense') {
          acc.balance = (totals.debit - totals.credit);
        } else {
          acc.balance = (totals.credit - totals.debit);
        }
        await acc.save();
      }
    }
    console.log('✓ Ledger accounts calibrated to exact double-entry balances.');

    // 12. Seed Public Storefront & Concierge Submissions
    console.log('\n[12/12] Seeding Public Storefront Inquiries, Tours, Tickets & Guild Partners...');

    // Showroom Tours (8 reservations across ateliers)
    const toursData = [
      { showroom: 'South Mumbai Marine Atelier', name: 'Dr. Siddharth Varma', email: 'siddharth.varma@medicon.in', phone: '+91 98200 44332', date: '2026-09-10', timeSlot: '11:00 AM - 12:30 PM', guests: '2 Guests', notes: 'Interested in bespoke walnut boardroom table and velvet armchairs', status: 'confirmed' },
      { showroom: 'New Delhi Mehrauli Heritage Gallery', name: 'Meenakshi Sundaram', email: 'meenakshi@heritagehomes.com', phone: '+91 98112 55667', date: '2026-09-12', timeSlot: '02:30 PM - 04:00 PM', guests: '4 Guests', notes: 'Architectural walk-through for Farmhouse project in Chattarpur', status: 'confirmed' },
      { showroom: 'Bengaluru Indiranagar Flagship', name: 'Kunal Singhal', email: 'kunal.singhal@venturetech.io', phone: '+91 99001 88776', date: '2026-09-14', timeSlot: '04:30 PM - 06:00 PM', guests: '2 Guests', notes: 'Private viewing for penthouse terrace lounge pieces', status: 'confirmed' },
      { showroom: 'Jaipur Civil Lines Craft Pavilion', name: 'Princess Gayatri Rathore', email: 'gayatri@rathoreestates.in', phone: '+91 94140 11992', date: '2026-09-16', timeSlot: '11:00 AM - 12:30 PM', guests: '3 Guests', notes: 'Heritage restoration commission meeting', status: 'confirmed' },
      { showroom: 'South Mumbai Marine Atelier', name: 'Cyrus Mistry Jr.', email: 'cyrus@shapoorji.dev', phone: '+91 98205 99881', date: '2026-09-08', timeSlot: '02:30 PM - 04:00 PM', guests: '2 Guests', notes: 'Commercial real estate executive suites audit', status: 'completed' },
      { showroom: 'New Delhi Mehrauli Heritage Gallery', name: 'Alia Chhabra', email: 'alia@chhabradesign.com', phone: '+91 98101 22334', date: '2026-09-07', timeSlot: '11:00 AM - 12:30 PM', guests: '1 Guest', notes: 'Sample swatch review for residential client', status: 'completed' },
      { showroom: 'Bengaluru Indiranagar Flagship', name: 'Rahul Bose', email: 'rahul.bose@ecospaces.in', phone: '+91 98450 11223', date: '2026-09-18', timeSlot: '04:30 PM - 06:00 PM', guests: '3 Guests', notes: 'Rescheduled from August; needs lighting pairing review', status: 'rescheduled' },
      { showroom: 'Jaipur Civil Lines Craft Pavilion', name: 'Devendra Kothari', email: 'devendra@kotharijewels.com', phone: '+91 98290 33445', date: '2026-09-20', timeSlot: '02:30 PM - 04:00 PM', guests: '2 Guests', notes: 'Family villa living room collection review', status: 'confirmed' }
    ];

    for (const tour of toursData) {
      await ShowroomTour.create(tour);
    }

    // Designer Inquiries (7 inquiries)
    const inquiriesData = [
      { name: 'Natasha Poonawalla', email: 'natasha@poonawallastudios.com', phone: '+91 98200 00112', projectType: 'Residential Interior', estimatedBudget: '$50,000 - $100,000', message: 'Looking for a bespoke dining suite with solid Carrara marble top and 10 sculpted brass-accented velvet chairs for our Alibaug coastal villa.', status: 'new', assignedLead: 'Elena Rossi & Vikram Singhania (Principal Architects)' },
      { name: 'Karan Johar Design Atelier', email: 'projects@karanjoharspaces.com', phone: '+91 98201 11223', projectType: 'Bespoke Private Commission', estimatedBudget: '$100,000+', message: 'Custom dressing suite, velvet modular daybeds, and fluted white oak credenzas for luxury studio retreat.', status: 'reviewing', assignedLead: 'Elena Rossi & Vikram Singhania (Principal Architects)' },
      { name: 'Oberoi Realty Hospitality Division', email: 'procurement@oberoirealty.com', phone: '+91 98202 22334', projectType: 'Hospitality', estimatedBudget: '$100,000+', message: 'Furnishing 24 presidential and deluxe suites with custom solid teak platform beds and handcrafted rattan armchairs.', status: 'contacted', assignedLead: 'Elena Rossi & Vikram Singhania (Principal Architects)' },
      { name: 'Verma & Associates Legal Chambers', email: 'admin@vermachambers.in', phone: '+91 98110 44556', projectType: 'Commercial Office', estimatedBudget: '$25,000 - $50,000', message: 'Full floor executive law library furnishing: 4 executive walnut desks, meeting table, and leather study armchairs.', status: 'scheduled', assignedLead: 'Elena Rossi & Vikram Singhania (Principal Architects)' },
      { name: 'Suhana Khan Residence', email: 'suhana.spaces@studio8.in', phone: '+91 98203 33445', projectType: 'Residential Interior', estimatedBudget: '$25,000 - $50,000', message: 'Minimalist living room aesthetic with sand daybed and ochre yellow bouclé ottomans.', status: 'contacted', assignedLead: 'Elena Rossi & Vikram Singhania (Principal Architects)' },
      { name: 'Aman Heritage Palace Suites', email: 'heritage@amanhotels.com', phone: '+91 94140 77889', projectType: 'Architectural Contract', estimatedBudget: '$100,000+', message: 'Custom carved Sheesham wood consoles and brass-inlaid coffee tables matching historic royal architecture.', status: 'reviewing', assignedLead: 'Elena Rossi & Vikram Singhania (Principal Architects)' },
      { name: 'Zoya Akhtar Film Studio', email: 'production@tigerbaby.in', phone: '+91 98204 44556', projectType: 'Commercial Office', estimatedBudget: '$10,000 - $25,000', message: 'Writers room curved couch and ergonomic director lounge chairs in deep indigo.', status: 'archived', assignedLead: 'Elena Rossi & Vikram Singhania (Principal Architects)' }
    ];

    for (const inq of inquiriesData) {
      await DesignerInquiry.create(inq);
    }

    // Helpdesk Tickets (8 tickets)
    const ticketsData = [
      { name: 'Aarav Mehta', email: 'aarav@modernspaces.design', referenceNo: 'SO-2026-002', category: 'Double-Entry Ledger Balancing', priority: 'Urgent (Ledger Halt)', subject: 'Discrepancy in output GST split for Villa Amber Sofa batch', message: 'The customer invoice INV-2026-002 shows 5% IGST whereas inter-state trade requires bifurcated CGST/SGST ledger line tagging.', status: 'In Progress', assignedAgent: 'Rohan Mehta (Senior Accountant)' },
      { name: 'Nimesh Pathak', email: 'contact@urbanfurniture.com', referenceNo: 'INV-2026-001', category: 'Customer Portal & Invoicing', priority: 'Medium', subject: 'Tax Invoice PDF download watermark verification', message: 'Need branded GST compliance statement on downloaded PDF for quarterly corporate filing.', status: 'Resolved', assignedAgent: 'Nikita Sharma (System Admin)' },
      { name: 'Azure Craft Wood Mills', email: 'orders@azurecraftmills.com', referenceNo: 'PO-2026-001', category: 'Vendor Bill Reconciliation', priority: 'Standard', subject: 'Confirmation of RTGS settlement for Nordic Credenzas', message: 'Kindly provide bank advice slip for PAY-2026-001 totaling ₹ 3,80,000.00.', status: 'Resolved', assignedAgent: 'Rohan Mehta (Senior Accountant)' },
      { name: 'Crafty Wood Co.', email: 'supplies@craftywood.in', referenceNo: 'BILL-2026-002', category: 'Payment Gateway & Banking', priority: 'High', subject: 'Outstanding balance payment date clarification', message: 'Inquiring regarding scheduled payout date for second installment of ₹ 1,13,000.00 on BILL-2026-002.', status: 'In Progress', assignedAgent: 'Rohan Mehta (Senior Accountant)' },
      { name: 'Ananya Desai', email: 'ananya@desaiholding.com', referenceNo: 'SO-2026-003', category: 'Delivery & White-Glove Transit', priority: 'High', subject: 'Specific delivery time window request for Sand Daybed', message: 'Please schedule elevator hoist access at Cumballa Hill residency between 10:00 AM and 12:00 PM on Saturday.', status: 'In Progress', assignedAgent: 'Aarav Mehta (Lead Concierge)' },
      { name: 'Rajesh Sharma', email: 'rajesh@eleganthomes.in', referenceNo: 'SO-2026-004', category: 'Manufacturing & Workshop Status', priority: 'Medium', subject: 'Carrara Marble slab selection photos request', message: 'Architect requested high-resolution photography of veining patterns before slab cutting begins.', status: 'Submitted', assignedAgent: 'Nikita Sharma (System Admin)' },
      { name: 'Vikram Sengupta', email: 'vikram.sengupta@residency.com', referenceNo: 'SO-2026-005', category: 'Bespoke Customization', priority: 'Standard', subject: 'Fabric swatch sample request for study chairs', message: 'Client would like to evaluate swatch samples of both charcoal wool and olive velvet under evening lighting.', status: 'Submitted', assignedAgent: 'Elena Rossi (Lead Architect)' },
      { name: 'Velvet Luxe Mills', email: 'sales@velvetluxemills.com', referenceNo: 'PO-2026-003', category: 'Supply Chain Coordination', priority: 'Standard', subject: 'Dispatch notice for Ochre Bouclé fabric rolls', message: 'Consignment tracking number dispatched via SafeXpress logistics docket #882211.', status: 'Closed', assignedAgent: 'Nikita Sharma (System Admin)' }
    ];

    for (const tkt of ticketsData) {
      await HelpdeskTicket.create(tkt);
    }

    // Trade Partners (6 Guild Studios)
    const partnersData = [
      { studioName: 'Modern Spaces Design Studio', contactPerson: 'Aarav Mehta', email: 'trade@modernspaces.design', phone: '+91 98450 99881', gstin: '29AABCM8899Z1Z5', website: 'https://modernspaces.design', procurementVolume: 4500000, tier: 'Platinum Master Guild', commissionRate: 35, status: 'approved' },
      { studioName: 'Elegant Homes Architectural Guild', contactPerson: 'Rajesh Sharma', email: 'procurement@eleganthomes.in', phone: '+91 98110 33221', gstin: '07AAACE1122Y2Y4', website: 'https://eleganthomes.in', procurementVolume: 3200000, tier: 'Gold Studio Guild', commissionRate: 28, status: 'approved' },
      { studioName: 'Studio Verve Architects', contactPerson: 'Malini Oberoi', email: 'malini@studioverve.com', phone: '+91 98201 44556', gstin: '27AABCS3344X3X3', website: 'https://studioverve.com', procurementVolume: 6200000, tier: 'Platinum Master Guild', commissionRate: 35, status: 'approved' },
      { studioName: 'Wood & More Interiors', contactPerson: 'Priya Nambiar', email: 'priya@woodandmore.com', phone: '+91 98400 66778', gstin: '33AABCW5566W4W2', website: 'https://woodandmore.com', procurementVolume: 1800000, tier: 'Silver Atelier', commissionRate: 20, status: 'approved' },
      { studioName: 'Artisan Habitat Design Lab', contactPerson: 'Vikramaditya Rao', email: 'director@artisanhabitat.in', phone: '+91 98490 88990', gstin: '36AABCA7788V5V1', website: 'https://artisanhabitat.in', procurementVolume: 2800000, tier: 'Gold Studio Guild', commissionRate: 28, status: 'approved' },
      { studioName: 'Kapadia & Associates Heritage Design', contactPerson: 'Zubin Kapadia', email: 'zubin@kapadia.design', phone: '+91 98205 11223', gstin: '27AABCK9900U6U0', website: 'https://kapadia.design', procurementVolume: 1200000, tier: 'Silver Atelier', commissionRate: 20, status: 'pending_review' }
    ];

    for (const part of partnersData) {
      await TradePartner.create(part);
    }

    // Showrooms Master Data
    const showroomsData = [
      {
        id: 'mumbai',
        cityKey: 'mumbai',
        name: 'Mumbai Flagship Atelier',
        tier: 'Flagship & Heritage Archive',
        address: 'Express Towers, Ground & Mezzanine Level, Nariman Point',
        area: 'Marine Drive Waterfront, Mumbai, Maharashtra 400021',
        phone: '+91 (022) 4890-1200',
        email: 'mumbai@urbanfurniture.com',
        hours: 'Mon – Sat: 10:00 AM – 08:00 PM · Sun by Appointment',
        features: [
          'Over 8,500 sq.ft. Bespoke Living Suites',
          'Tuscan Leather & Belgian Velvet Textile Archive',
          'Direct Access to Principal Architectural Consultants',
          'Private VIP Presentation Lounge & Valet Parking'
        ],
        mapUrl: 'https://maps.google.com/?q=Nariman+Point+Mumbai',
        badge: 'Flagship Gallery'
      },
      {
        id: 'delhi',
        cityKey: 'delhi',
        name: 'New Delhi Design Studio',
        tier: 'Heritage Colonnade Atelier',
        address: 'The Qutub Heritage Colonnade, One Style Mile, Kalka Das Marg',
        area: 'Mehrauli Art District, New Delhi 110030',
        phone: '+91 (011) 6720-4400',
        email: 'delhi@urbanfurniture.com',
        hours: 'Mon – Sat: 10:30 AM – 07:30 PM · Sun: 11:00 AM – 06:00 PM',
        features: [
          'Restored Sandstone Arches & Courtyard Gallery',
          'Full-Scale Dining & Executive Workspace Vignettes',
          'Aged Brass & Solid Oak Specimen Library',
          'Commission Custom Furniture with On-Site Master Joiners'
        ],
        mapUrl: 'https://maps.google.com/?q=Mehrauli+New+Delhi',
        badge: 'Heritage Studio'
      },
      {
        id: 'bengaluru',
        cityKey: 'bengaluru',
        name: 'Bengaluru Contemporary Gallery',
        tier: 'Modernist Innovation Hub',
        address: '24/1 Lavelle Road, Shanthala Nagar, Ashok Nagar',
        area: 'Central Business District, Bengaluru, Karnataka 560001',
        phone: '+91 (080) 4150-8900',
        email: 'bengaluru@urbanfurniture.com',
        hours: 'Tue – Sun: 10:00 AM – 08:00 PM · Mon: Closed for Private Fabrication',
        features: [
          'Minimalist Concrete & Sustainable Timber Architecture',
          'Biophilic Living & Ergonomic Workspace Lab',
          'Digital Augmented Reality Space Fitting Studio',
          'Artisanal Pour-Over Espresso & Tea Bar for Patrons'
        ],
        mapUrl: 'https://maps.google.com/?q=Lavelle+Road+Bengaluru',
        badge: 'Modernist Hub'
      }
    ];

    for (const sh of showroomsData) {
      await Showroom.create(sh);
    }

    console.log(`✓ Seeded ${toursData.length} Tours, ${inquiriesData.length} Inquiries, ${ticketsData.length} Tickets, ${partnersData.length} Guild Partners, and ${showroomsData.length} Showrooms.`);

    console.log('\n========================================================================');
    console.log('       DATABASE SEEDING COMPLETED WITH 100% MATHEMATICAL INTEGRITY        ');
    console.log('========================================================================');
    console.log(' Credentials:');
    console.log(' - Super Admin: superadmin@urbanfurniture.com / SuperAdmin123!');
    console.log(' - Admin:       admin@urbanfurniture.com       / AdminPassword123!');
    console.log(' - Accountant:  accountant@urbanfurniture.com  / AccountantPassword123!');
    console.log(' - Portal User: contact@urbanfurniture.com     / ContactPassword123!');
    console.log('========================================================================\n');

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
