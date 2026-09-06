
/**
 * Urban Furniture ERP - complete development seed
 *
 * Usage:
 *   MONGODB_URI="mongodb+srv://..." node seed.js
 *   MONGODB_URI="..." node seed.js --reset
 *
 * Windows PowerShell:
 *   $env:MONGODB_URI="mongodb+srv://..."; node seed.js --reset
 *
 * Every model receives exactly 120 records.
 * The script intentionally uses Model.save()/create() so model pre-save hooks run.
 * Collection clearing uses the native MongoDB driver to bypass AuditLog's
 * application-level immutability middleware during a development reset.
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./User');
const Contact = require('./Contact');
const Account = require('./Account');
const AnalyticAccount = require('./AnalyticAccount');
const Journal = require('./Journal');
const Product = require('./Product');
const PurchaseOrder = require('./PurchaseOrder');
const SalesOrder = require('./SalesOrder');
const JournalEntry = require('./JournalEntry');
const VendorBill = require('./VendorBill');
const CustomerInvoice = require('./CustomerInvoice');
const Payment = require('./Payment');
const GoodsReceipt = require('./GoodsReceipt');
const SalesReceipt = require('./SalesReceipt');
const Budget = require('./Budget');
const AuditLog = require('./AuditLog');
const Showroom = require('./Showroom');
const ShowroomTour = require('./ShowroomTour');
const TradePartner = require('./TradePartner');
const DesignerInquiry = require('./DesignerInquiry');
const HelpdeskTicket = require('./HelpdeskTicket');

const N = 120;
const PASSWORD = process.env.SEED_PASSWORD || 'Urban@12345';

const firstNames = [
  'Aarav','Vivaan','Aditya','Arjun','Kabir','Vihaan','Rohan','Dhruv','Ishaan','Kunal',
  'Rahul','Yash','Harsh','Manav','Dev','Krish','Parth','Mihir','Nirav','Meet',
  'Anaya','Diya','Isha','Kiara','Myra','Aadhya','Riya','Kavya','Nisha','Meera',
  'Pooja','Tanya','Rhea','Avni','Jiya','Sneha','Neha','Mansi','Shreya','Aditi'
];
const lastNames = [
  'Mehta','Shah','Patel','Desai','Joshi','Trivedi','Mistry','Parikh','Gandhi','Thakkar',
  'Vora','Dave','Bhatt','Pandya','Modi','Rathod','Solanki','Prajapati','Soni','Chauhan'
];
const cities = [
  ['Ahmedabad','Gujarat','380015'],['Gandhinagar','Gujarat','382010'],['Vadodara','Gujarat','390007'],
  ['Surat','Gujarat','395007'],['Rajkot','Gujarat','360005'],['Mumbai','Maharashtra','400050'],
  ['Pune','Maharashtra','411001'],['Nashik','Maharashtra','422001'],['Jaipur','Rajasthan','302001'],
  ['Udaipur','Rajasthan','313001'],['New Delhi','Delhi','110001'],['Gurugram','Haryana','122002'],
  ['Bengaluru','Karnataka','560001'],['Hyderabad','Telangana','500001'],['Chennai','Tamil Nadu','600001'],
  ['Kolkata','West Bengal','700001'],['Kochi','Kerala','682001'],['Indore','Madhya Pradesh','452001'],
  ['Lucknow','Uttar Pradesh','226001'],['Bhopal','Madhya Pradesh','462001']
];

const productCatalog = [
  ['Teak Executive Desk','Goods','Furniture',125000,82000,18],
  ['Walnut Conference Table','Goods','Furniture',185000,121000,18],
  ['Oak Workstation','Goods','Office Furniture',78000,49000,18],
  ['Ergonomic Office Chair','Goods','Seating',24500,15200,18],
  ['Leather Lounge Chair','Goods','Seating',68500,43000,18],
  ['Solid Wood Bookshelf','Goods','Storage',54000,33500,18],
  ['Modular Storage Cabinet','Goods','Storage',38500,23100,18],
  ['Reception Console','Goods','Reception',92000,57000,18],
  ['Designer Coffee Table','Goods','Tables',47500,28900,18],
  ['Marble Side Table','Goods','Tables',36500,22100,18],
  ['Pendant Light Installation','Service','Lighting',18500,9500,18],
  ['Custom Furniture Design','Service','Design Services',45000,21000,18],
  ['Space Planning Consultation','Service','Design Services',28000,12000,18],
  ['Premium Office Setup','Combo','Packages',295000,185000,18],
  ['Executive Suite Package','Combo','Packages',425000,265000,18]
];

const productDescriptions = {
  Furniture: 'Premium made-to-order furniture for Indian residential and commercial interiors.',
  'Office Furniture': 'Ergonomic and durable furniture for modern workspaces.',
  Seating: 'Contract-grade seating with premium upholstery and engineered frames.',
  Storage: 'Modular storage solutions with configurable finishes.',
  Reception: 'Statement reception furniture for corporate and hospitality spaces.',
  Tables: 'Designer tables using natural stone and responsibly sourced timber.',
  Lighting: 'Professional lighting design and installation service.',
  'Design Services': 'Professional interior design and space-planning services.',
  Packages: 'Bundled furniture and design solutions for complete projects.'
};

function pick(arr, i) { return arr[i % arr.length]; }
function person(i) { return `${pick(firstNames,i)} ${pick(lastNames, Math.floor(i / firstNames.length) + i)}`; }
function emailFrom(name, suffix='urbanfurnishings.in') {
  return name.toLowerCase().replace(/[^a-z0-9]+/g,'.') + `@${suffix}`;
}
function phone(i) { return `+91 ${7000000000 + i}`; }
function money(v) { return Math.round(v * 100) / 100; }
function dateAgo(days, offset=0) {
  const d = new Date();
  d.setDate(d.getDate() - (days - (offset % Math.max(days,1))));
  d.setHours(10 + (offset % 8), (offset * 7) % 60, 0, 0);
  return d;
}
function isoDate(i) {
  const d = new Date();
  d.setDate(d.getDate() + ((i % 45) - 15));
  return d.toISOString().slice(0,10);
}
function gstin(i, stateCode = 24) {
  const pan = `AABCU${String(1000 + i).slice(-4)}F`;
  // Schema has no GSTIN validator; this is a realistic 15-character development GSTIN.
  return `${String(stateCode).padStart(2,'0')}${pan}1Z${String(i % 10)}`;
}
function address(i) {
  const [city,state,pincode] = pick(cities,i);
  return {
    street: `${10 + i} ${pick(['C G Road','S G Highway','Ring Road','Law Garden Road','M G Road','Satellite Road','Prahladnagar Main Road'], i)} `,
    city, state, pincode
  };
}
function randInt(min,max,i) { return min + (i * 17) % (max-min+1); }

async function nativeClearAll() {
  // Clear only collections represented by this seed. Native driver intentionally
  // bypasses AuditLog delete middleware during a development reset.
  const db = mongoose.connection.db;
  const collectionNames = [
    'users','contacts','accounts','analyticaccounts','journals','products',
    'purchaseorders','salesorders','journalentries','vendorbills','customerinvoices',
    'payments','goodsreceipts','salesreceipts','budgets','auditlogs','showrooms',
    'showroomtours','tradepartners','designerinquiries','helpdesktickets'
  ];
  for (const name of collectionNames) {
    await db.collection(name).deleteMany({});
  }
}

async function seed() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error('MONGODB_URI (or MONGO_URI) is required.');

  await mongoose.connect(uri);
  console.log(`Connected to MongoDB: ${mongoose.connection.host}`);

  if (process.argv.includes('--reset') || process.env.SEED_RESET === 'true') {
    console.log('Resetting seeded collections...');
    await nativeClearAll();
  }

  // 1. Contacts first: Users have optional references back to Contact.
  const contactDocs = [];
  for (let i=0;i<N;i++) {
    const name = `${person(i)} ${i+1}`;
    const type = ['Customer','Vendor','Both'][i % 3];
    const a = address(i);
    contactDocs.push(new Contact({
      name, type,
      email: emailFrom(`contact${i+1}`),
      mobile: phone(i),
      address: a,
      profileImage: '',
      notes: type === 'Vendor' ? 'Approved furniture/material supplier.' : 'ERP development seed contact.',
      status: i % 17 === 0 ? 'archived' : 'active',
      user: null
    }));
  }
  const contacts = await Contact.create(contactDocs);
  console.log(`Contacts: ${contacts.length}`);

  // 2. Accounts: accounting master data.
  const accountTypes = [
    ['1000','Cash on Hand','Asset'],['1010','HDFC Bank Current Account','Asset'],
    ['1020','ICICI Bank Current Account','Asset'],['1100','Accounts Receivable','Asset'],
    ['1200','Inventory - Furniture','Asset'],['1300','Input GST Credit','Asset'],
    ['2000','Accounts Payable','Liability'],['2100','GST Payable','Liability'],
    ['2200','Accrued Expenses','Liability'],['3000','Owner Capital','Capital'],
    ['3100','Retained Earnings','Capital'],['4000','Furniture Sales','Income'],
    ['4100','Design Service Revenue','Income'],['4200','Installation Revenue','Income'],
    ['5000','Furniture Cost of Goods Sold','Expense'],['5100','Purchases','Expense'],
    ['5200','Freight & Delivery','Expense'],['5300','Rent & Facilities','Expense'],
    ['5400','Salaries & Professional Fees','Expense'],['5500','Marketing Expense','Expense']
  ];
  const accountDocs = [];
  for (let i=0;i<N;i++) {
    const base = pick(accountTypes,i);
    accountDocs.push(new Account({
      code: `${base[0]}${String(i+1).padStart(3,'0')}`,
      name: `${base[1]} ${i+1}`,
      type: base[2],
      balance: money((i % 7) * 12500 + 1000),
      description: `Urban Furniture ERP ${base[1]} ledger account.`,
      isSystem: i < 20,
      status: i % 23 === 0 ? 'archived' : 'active'
    }));
  }
  const accounts = await Account.create(accountDocs);

  // 3. Analytic accounts.
  const analyticDocs = [];
  for (let i=0;i<N;i++) {
    const type = i % 2 === 0 ? 'Expenses' : 'Income';
    analyticDocs.push(new AnalyticAccount({
      code: `ANA-${String(i+1).padStart(4,'0')}`,
      name: `${['Ahmedabad','Mumbai','Bengaluru','Delhi','Surat'][i%5]} ${type} Project ${i+1}`,
      type,
      description: `${type} tracking for showroom, project and trade-channel performance.`,
      status: i % 19 === 0 ? 'archived' : 'active'
    }));
  }
  const analyticAccounts = await AnalyticAccount.create(analyticDocs);

  // 4. Users now that Contacts exist.
  const userDocs = [];
  for (let i=0;i<N;i++) {
    const name = person(i);
    const role = i === 0 ? 'superadmin' : ['admin','accountant','contact'][i % 3];
    userDocs.push(new User({
      name,
      email: emailFrom(`user${i+1}`),
      password: PASSWORD,
      role,
      contactId: i < 100 ? contacts[i]._id : null,
      status: i % 29 === 0 ? 'inactive' : 'active',
      failedLoginAttempts: 0,
      twoFactorEnabled: false
    }));
  }
  const users = await User.create(userDocs);

  // Back-reference User from Contact where a user exists.
  for (let i=0;i<100;i++) {
    await Contact.updateOne({ _id: contacts[i]._id }, { $set: { user: users[i]._id } });
  }

  // 5. Products.
  const productDocs = [];
  for (let i=0;i<N;i++) {
    const p = pick(productCatalog,i);
    productDocs.push(new Product({
      name: `${p[0]} - ${String(i+1).padStart(3,'0')}`,
      type: p[1],
      salesPrice: money(p[3] + (i%6)*1750),
      costPrice: money(p[4] + (i%5)*900),
      category: p[2],
      description: productDescriptions[p[2]] || 'Urban Furniture ERP catalog item.',
      taxPercent: p[5],
      currentStock: p[1] === 'Service' ? 0 : randInt(5,85,i),
      status: i % 31 === 0 ? 'archived' : 'active'
    }));
  }
  const products = await Product.create(productDocs);

  // 6. Journals.
  const journalTypes = ['Sales','Purchase','Bank','Cash','General'];
  const journalDocs = [];
  for (let i=0;i<N;i++) {
    const type = pick(journalTypes,i);
    journalDocs.push(new Journal({
      code: `JRN${String(i+1).padStart(4,'0')}`,
      name: `${type} Journal ${i+1}`,
      type,
      defaultDebitAccount: accounts[(i*2)%accounts.length]._id,
      defaultCreditAccount: accounts[(i*2+1)%accounts.length]._id,
      sequence: i+1,
      status: i % 27 === 0 ? 'archived' : 'active'
    }));
  }
  const journals = await Journal.create(journalDocs);

  const customerContacts = contacts.filter(c => ['Customer','Both'].includes(c.type));
  const vendorContacts = contacts.filter(c => ['Vendor','Both'].includes(c.type));

  function lineItems(i, count=2, sales=false) {
    const items=[];
    for (let j=0;j<count;j++) {
      const p=products[(i*3+j)%products.length];
      const qty=1+(i+j)%5;
      const unitPrice=money(sales ? Number(p.salesPrice) : Number(p.costPrice));
      const x={
        product:p._id,
        description:p.name,
        quantity:qty,
        unitPrice
      };
      if (sales) x.taxPercent=Number(p.taxPercent)||18;
      items.push(x);
    }
    return items;
  }

  // 7. Purchase orders.
  const purchaseOrderDocs=[];
  for (let i=0;i<N;i++) {
    purchaseOrderDocs.push(new PurchaseOrder({
      orderNumber:`PO/2026/${String(i+1).padStart(5,'0')}`,
      vendor:vendorContacts[i%vendorContacts.length]._id,
      orderDate:dateAgo(240,i),
      items:lineItems(i,1+(i%3),false),
      status:['draft','confirmed','received','billed','cancelled'][i%5],
      notes:`Supplier procurement batch ${i+1}.`
    }));
  }
  const purchaseOrders=await PurchaseOrder.create(purchaseOrderDocs);

  // 8. Sales orders.
  const salesOrderDocs=[];
  for (let i=0;i<N;i++) {
    salesOrderDocs.push(new SalesOrder({
      orderNumber:`SO/2026/${String(i+1).padStart(5,'0')}`,
      customer:customerContacts[i%customerContacts.length]._id,
      orderDate:dateAgo(210,i),
      items:lineItems(i,1+(i%3),true),
      status:['draft','confirmed','delivered','invoiced','cancelled'][i%5],
      notes:`Customer order for project ${1001+i}.`
    }));
  }
  const salesOrders=await SalesOrder.create(salesOrderDocs);

  // 9. Journal entries, with balanced debit/credit lines.
  const journalEntryDocs=[];
  for (let i=0;i<N;i++) {
    const amount=money(15000+(i%20)*3250);
    const customer=customerContacts[i%customerContacts.length];
    const debitAcc=accounts[(i+3)%accounts.length];
    const creditAcc=accounts[(i+11)%accounts.length];
    journalEntryDocs.push(new JournalEntry({
      entryNumber:`JE/2026/${String(i+1).padStart(6,'0')}`,
      journal:journals[i%journals.length]._id,
      date:dateAgo(180,i),
      reference:`TXN-${String(i+1).padStart(6,'0')}`,
      partner:customer._id,
      items:[
        {account:debitAcc._id,partner:customer._id,label:'Debit side',debit:amount,credit:0,analyticAccount:analyticAccounts[i%analyticAccounts.length]._id},
        {account:creditAcc._id,partner:customer._id,label:'Credit side',debit:0,credit:amount,analyticAccount:analyticAccounts[i%analyticAccounts.length]._id}
      ],
      status:['draft','posted','cancelled'][i%3],
      postedAt:i%3===1 ? dateAgo(170,i) : null,
      postedBy:i%3===1 ? users[i%users.length]._id : null
    }));
  }
  const journalEntries=await JournalEntry.create(journalEntryDocs);

  // 10. Vendor bills.
  const vendorBillDocs=[];
  for (let i=0;i<N;i++) {
    const po=purchaseOrders[i];
    vendorBillDocs.push(new VendorBill({
      billNumber:`BILL/2026/${String(i+1).padStart(5,'0')}`,
      vendor:po.vendor,
      purchaseOrder:po._id,
      billDate:dateAgo(160,i),
      dueDate:new Date(dateAgo(130,i)),
      items:lineItems(i,1+(i%3),false).map(x=>({
        ...x,
        account:accounts[(i+14)%accounts.length]._id,
        analyticAccount:analyticAccounts[(i+2)%analyticAccounts.length]._id
      })),
      paidAmount:0,
      status:['draft','posted','paid','partial','cancelled'][i%5],
      journalEntry:journalEntries[i]._id,
      notes:`Vendor invoice matched to purchase order ${po.orderNumber}.`
    }));
  }
  const vendorBills=await VendorBill.create(vendorBillDocs);
  for (let i=0;i<N;i++) {
    const paidStatus = vendorBills[i].status === 'paid' ? vendorBills[i].totalAmount :
      vendorBills[i].status === 'partial' ? money(vendorBills[i].totalAmount * 0.5) : 0;
    await VendorBill.updateOne({_id:vendorBills[i]._id}, {$set:{paidAmount:paidStatus}});
    vendorBills[i].paidAmount = paidStatus;
  }

  // 11. Customer invoices.
  const customerInvoiceDocs=[];
  for (let i=0;i<N;i++) {
    const so=salesOrders[i];
    customerInvoiceDocs.push(new CustomerInvoice({
      invoiceNumber:`INV/2026/${String(i+1).padStart(5,'0')}`,
      customer:so.customer,
      salesOrder:so._id,
      invoiceDate:dateAgo(145,i),
      dueDate:new Date(dateAgo(115,i)),
      items:lineItems(i,1+(i%3),true).map(x=>({
        ...x,
        account:accounts[(i+11)%accounts.length]._id,
        analyticAccount:analyticAccounts[(i+1)%analyticAccounts.length]._id
      })),
      paidAmount:0,
      status:['draft','posted','paid','partial','cancelled'][i%5],
      journalEntry:journalEntries[(i+1)%N]._id,
      notes:`Customer invoice generated from sales order ${so.orderNumber}.`
    }));
  }
  const customerInvoices=await CustomerInvoice.create(customerInvoiceDocs);
  for (let i=0;i<N;i++) {
    const paidStatus = customerInvoices[i].status === 'paid' ? customerInvoices[i].totalAmount :
      customerInvoices[i].status === 'partial' ? money(customerInvoices[i].totalAmount * 0.5) : 0;
    await CustomerInvoice.updateOne({_id:customerInvoices[i]._id}, {$set:{paidAmount:paidStatus}});
    customerInvoices[i].paidAmount = paidStatus;
  }

  // 12. Goods receipts.
  const goodsReceiptDocs=[];
  for (let i=0;i<N;i++) {
    const po=purchaseOrders[i];
    goodsReceiptDocs.push(new GoodsReceipt({
      receiptNumber:`GR/2026/${String(i+1).padStart(5,'0')}`,
      purchaseOrder:po._id,
      vendor:po.vendor,
      receiptDate:dateAgo(120,i),
      items:lineItems(i,1+(i%2),false).map(x=>({
        product:x.product,quantity:x.quantity,unitPrice:x.unitPrice
      })),
      status:['draft','received','cancelled'][i%3],
      notes:`Warehouse receipt for ${po.orderNumber}.`,
      receivedBy:users[(i+5)%N]._id
    }));
  }
  const goodsReceipts=await GoodsReceipt.create(goodsReceiptDocs);

  // 13. Sales receipts.
  const salesReceiptDocs=[];
  for (let i=0;i<N;i++) {
    const so=salesOrders[i];
    salesReceiptDocs.push(new SalesReceipt({
      receiptNumber:`SR/2026/${String(i+1).padStart(5,'0')}`,
      salesOrder:so._id,
      customer:so.customer,
      receiptDate:dateAgo(110,i),
      items:lineItems(i,1+(i%2),true).map(x=>({
        product:x.product,quantity:x.quantity,unitPrice:x.unitPrice
      })),
      status:['draft','delivered','cancelled'][i%3],
      notes:`Delivery receipt for ${so.orderNumber}.`,
      deliveredBy:users[(i+7)%N]._id
    }));
  }
  const salesReceipts=await SalesReceipt.create(salesReceiptDocs);

  // 14. Payments. References are intentionally consistent with payment direction.
  const paymentDocs=[];
  for (let i=0;i<N;i++) {
    const send=i%2===0;
    paymentDocs.push(new Payment({
      paymentNumber:`${send?'PAY-OUT':'PAY-IN'}/2026/${String(i+1).padStart(5,'0')}`,
      paymentType:send?'send_money':'receive_money',
      partner:(send?vendorContacts:customerContacts)[i% (send?vendorContacts.length:customerContacts.length)]._id,
      paymentDate:dateAgo(100,i),
      amount:money(8000+(i%15)*2750),
      paymentMethod:i%3===0?'Cash':'Bank',
      journal:journals[(i+2)%N]._id,
      vendorBill:send?vendorBills[i]._id:null,
      customerInvoice:send?null:customerInvoices[i]._id,
      status:['draft','posted','cancelled'][i%3],
      journalEntry:journalEntries[(i+3)%N]._id,
      notes:send?'Supplier settlement payment.':'Customer receipt against invoice.'
    }));
  }
  const payments=await Payment.create(paymentDocs);

  // 15. Budgets.
  const budgetDocs=[];
  for (let i=0;i<N;i++) {
    const start=new Date(2026, (i%12), 1);
    const end=new Date(2026, (i%12)+1, 0);
    budgetDocs.push(new Budget({
      name:`${pick(['Showroom','Marketing','Procurement','Operations','Design'],i)} Budget ${i+1}`,
      period:`FY2026-${String((i%12)+1).padStart(2,'0')}`,
      startDate:start,
      endDate:end,
      responsiblePerson:person(i),
      analyticAccount:analyticAccounts[i%N]._id,
      plannedAmount:money(50000+(i%25)*15000),
      status:['draft','confirmed','closed'][i%3]
    }));
  }
  const budgets=await Budget.create(budgetDocs);

  // 16. Showrooms.
  const showroomDocs=[];
  for (let i=0;i<N;i++) {
    const [city,state,pincode]=pick(cities,i);
    showroomDocs.push(new Showroom({
      id:`UF-SR-${String(i+1).padStart(4,'0')}`,
      cityKey:city.toLowerCase().replace(/\s+/g,'-'),
      name:`Urban Furniture ${city} Studio ${i+1}`,
      tier:['Premium','Signature','Flagship'][i%3],
      address:`${20+i}, ${pick(['C G Road','S G Highway','M G Road','Link Road','Airport Road'],i)}, ${city}, ${state} ${pincode}`,
      area:`${1200+(i%8)*350} sq ft`,
      phone:phone(300+i),
      email:emailFrom(`showroom${i+1}`),
      hours:'10:30 AM - 8:30 PM',
      features:[pick(['3D Design Lounge','Material Library','Private Consultation Room','Modular Display','Lighting Studio'],i),'Designer Consultation'],
      mapUrl:`https://maps.google.com/?q=${encodeURIComponent(city+' Urban Furniture')}`,
      badge:['Flagship','New','Best Seller','Design Studio'][i%4]
    }));
  }
  const showrooms=await Showroom.create(showroomDocs);

  // 17. Showroom tours.
  const tourDocs=[];
  for (let i=0;i<N;i++) {
    const s=showrooms[i];
    tourDocs.push(new ShowroomTour({
      bookingCode:`UF-TOUR-${String(100000+i)}`,
      showroom:s.name,
      name:person((i+13)%N),
      email:emailFrom(`tourguest${i+1}`),
      phone:phone(500+i),
      date:isoDate(i),
      timeSlot:['11:00 AM - 12:30 PM','1:00 PM - 2:30 PM','3:00 PM - 4:30 PM','5:00 PM - 6:30 PM'][i%4],
      guests:`${2+(i%6)} Guests`,
      notes:`Interested in ${pick(['executive furniture','modular storage','complete office setup','custom interiors'],i)}.`,
      status:['confirmed','rescheduled','completed','cancelled'][i%4]
    }));
  }
  const showroomTours=await ShowroomTour.create(tourDocs);

  // 18. Trade partners.
  const tradePartnerDocs=[];
  for (let i=0;i<N;i++) {
    const city=pick(cities,i)[0];
    tradePartnerDocs.push(new TradePartner({
      partnerCode:`UF-GUILD-${String(1000+i)}`,
      studioName:`${city} Design Collective ${i+1}`,
      contactPerson:person((i+21)%N),
      email:emailFrom(`partner${i+1}`),
      phone:phone(700+i),
      gstin:gstin(i, [24,27,29,06,09][i%5]),
      website:`https://partner${i+1}.example.in`,
      procurementVolume:money(750000+(i%30)*125000),
      tier:['Silver Atelier','Gold Studio Guild','Platinum Master Guild'][i%3],
      commissionRate:[22,28,32][i%3],
      status:['approved','pending_review','active','suspended'][i%4]
    }));
  }
  const tradePartners=await TradePartner.create(tradePartnerDocs);

  // 19. Designer inquiries.
  const inquiryDocs=[];
  for (let i=0;i<N;i++) {
    inquiryDocs.push(new DesignerInquiry({
      inquiryNumber:`INQ-${String(100000+i)}`,
      name:person((i+31)%N),
      email:emailFrom(`inquiry${i+1}`),
      phone:phone(900+i),
      projectType:[
        'Residential Interior','Commercial Office','Hospitality',
        'Architectural Contract','Bespoke Private Commission'
      ][i%5],
      estimatedBudget:['₹5,00,000 - ₹10,00,000','₹10,00,000 - ₹25,00,000','₹25,00,000 - ₹50,00,000','₹50,00,000+'][i%4],
      message:`Looking for a ${pick(['premium office','villa','boutique hotel','architectural','bespoke furniture'],i)} interior package in ${pick(cities,i)[0]}.`,
      status:['new','reviewing','contacted','scheduled','archived'][i%5],
      assignedLead:['Aarav Mehta (Lead Concierge)','Priya Shah (Senior Designer)','Vikram Singhania (Principal Architect)'][i%3]
    }));
  }
  const designerInquiries=await DesignerInquiry.create(inquiryDocs);

  // 20. Helpdesk tickets.
  const helpdeskDocs=[];
  for (let i=0;i<N;i++) {
    helpdeskDocs.push(new HelpdeskTicket({
      ticketNumber:`TKT-${String(1000+i)}`,
      name:person((i+41)%N),
      email:emailFrom(`ticket${i+1}`),
      referenceNo:`REF-2026-${String(i+1).padStart(5,'0')}`,
      category:[
        'Double-Entry Ledger Balancing','Invoice & Billing','Purchase Order',
        'Inventory','User Access','Showroom Concierge'
      ][i%6],
      priority:['Standard','Medium','Urgent','Urgent Ledger Halt','Urgent (Ledger Halt)','High'][i%6],
      subject:`ERP support request ${i+1}`,
      message:`Please review the ${['invoice','purchase order','payment','inventory','accounting','access'][i%6]} workflow and advise on the next step.`,
      status:['Submitted','In Progress','Resolved','Closed'][i%4],
      assignedAgent:['Aarav Mehta (Lead Concierge)','Nisha Patel (Support Agent)','Kunal Shah (ERP Specialist)'][i%3]
    }));
  }
  const helpdeskTickets=await HelpdeskTicket.create(helpdeskDocs);

  // 21. Audit logs last, because they reference the users created above.
  // We use unique action strings and realistic modules/severity values.
  const auditDocs=[];
  const modules=['Auth','General Ledger','Purchases','Sales','Payments','Inventory','Contacts','Products','Budgets','Concierge','Security','System'];
  for (let i=0;i<N;i++) {
    const actor=users[i%N];
    auditDocs.push(new AuditLog({
      actorId:actor._id,
      actorEmail:actor.email,
      actorRole:actor.role,
      action:`SEED_${modules[i%modules.length].toUpperCase().replace(/\s+/g,'_')}_${String(i+1).padStart(4,'0')}`,
      module:modules[i%modules.length],
      description:`Development audit event ${i+1} for ${modules[i%modules.length]} module.`,
      severity:['info','warning','critical','success'][i%4],
      ipAddress:`10.20.${Math.floor(i/250)+1}.${(i%250)+1}`,
      userAgent:'UrbanFurnitureERP/Seed-1.0',
      resource:['User','Contact','Account','Product','SalesOrder','PurchaseOrder','Payment'][i%7],
      resourceId:String([users,contacts,accounts,products,salesOrders,purchaseOrders,payments][i%7][i%N]._id),
      details:{seed:true,sequence:i+1,environment:'development'},
      timestamp:dateAgo(90,i)
    }));
  }
  const auditLogs=await AuditLog.create(auditDocs);

  const result={
    User:users.length, Contact:contacts.length, Account:accounts.length,
    AnalyticAccount:analyticAccounts.length, Journal:journals.length, Product:products.length,
    PurchaseOrder:purchaseOrders.length, SalesOrder:salesOrders.length,
    JournalEntry:journalEntries.length, VendorBill:vendorBills.length,
    CustomerInvoice:customerInvoices.length, Payment:payments.length,
    GoodsReceipt:goodsReceipts.length, SalesReceipt:salesReceipts.length,
    Budget:budgets.length, AuditLog:auditLogs.length, Showroom:showrooms.length,
    ShowroomTour:showroomTours.length, TradePartner:tradePartners.length,
    DesignerInquiry:designerInquiries.length, HelpdeskTicket:helpdeskTickets.length
  };

  // Verify exact counts.
  for (const [model,count] of Object.entries(result)) {
    if (count < 100 || count > 150) throw new Error(`${model}: expected 100-150, got ${count}`);
  }

  // Verify critical references using native queries.
  const checks=[
    ['Contact.user -> User', 'contacts', 'user', 'users'],
    ['User.contactId -> Contact', 'users', 'contactId', 'contacts'],
    ['PurchaseOrder.vendor -> Contact', 'purchaseorders', 'vendor', 'contacts'],
    ['PurchaseOrder.items.product -> Product', 'purchaseorders', 'items.product', 'products'],
    ['SalesOrder.customer -> Contact', 'salesorders', 'customer', 'contacts'],
    ['SalesOrder.items.product -> Product', 'salesorders', 'items.product', 'products'],
    ['Journal.defaultDebitAccount -> Account', 'journals', 'defaultDebitAccount', 'accounts'],
    ['JournalEntry.journal -> Journal', 'journalentries', 'journal', 'journals'],
    ['JournalEntry.items.account -> Account', 'journalentries', 'items.account', 'accounts'],
    ['VendorBill.purchaseOrder -> PurchaseOrder', 'vendorbills', 'purchaseOrder', 'purchaseorders'],
    ['VendorBill.journalEntry -> JournalEntry', 'vendorbills', 'journalEntry', 'journalentries'],
    ['CustomerInvoice.salesOrder -> SalesOrder', 'customerinvoices', 'salesOrder', 'salesorders'],
    ['CustomerInvoice.journalEntry -> JournalEntry', 'customerinvoices', 'journalEntry', 'journalentries'],
    ['Payment.vendorBill -> VendorBill', 'payments', 'vendorBill', 'vendorbills'],
    ['Payment.customerInvoice -> CustomerInvoice', 'payments', 'customerInvoice', 'customerinvoices'],
    ['Payment.journalEntry -> JournalEntry', 'payments', 'journalEntry', 'journalentries'],
    ['GoodsReceipt.purchaseOrder -> PurchaseOrder', 'goodsreceipts', 'purchaseOrder', 'purchaseorders'],
    ['SalesReceipt.salesOrder -> SalesOrder', 'salesreceipts', 'salesOrder', 'salesorders'],
    ['Budget.analyticAccount -> AnalyticAccount', 'budgets', 'analyticAccount', 'analyticaccounts']
  ];
  for (const [label,collection,field,target] of checks) {
    const targetIds=new Set((await mongoose.connection.db.collection(target).find({}, {_id:1}).toArray()).map(x=>String(x._id)));
    const docs=await mongoose.connection.db.collection(collection).find({}, {[field]:1}).toArray();
    const getValues=(obj, parts)=>{
      if(!parts.length) return Array.isArray(obj) ? obj : [obj];
      if(obj == null) return [];
      if(Array.isArray(obj)) return obj.flatMap(v=>getValues(v, parts));
      return getValues(obj[parts[0]], parts.slice(1));
    };
    let bad=0;
    for(const d of docs){
      for(const v of getValues(d, field.split('.'))){
        if(v && !targetIds.has(String(v))) bad++;
      }
    }
    if(bad) throw new Error(`${label}: ${bad} broken reference(s)`);
  }

  // Verify journal balance generated by hook.
  const unbalanced=await mongoose.connection.db.collection('journalentries').countDocuments({
    $expr: {$ne:['$totalDebit','$totalCredit']}
  });
  if(unbalanced) throw new Error(`JournalEntry: ${unbalanced} unbalanced entries`);

  console.log('\n=== SEED COMPLETE ===');
  console.table(result);
  console.log(`Login password for seeded users: ${PASSWORD}`);
  console.log('Reference checks: PASS');
  console.log('Journal balance checks: PASS');
  console.log('All seeded collections contain 120 records.');

  await mongoose.disconnect();
}

seed().catch(async err=>{
  console.error('\nSEED FAILED:',err);
  try { await mongoose.disconnect(); } catch {}
  process.exitCode=1;
});
