const VendorBill = require('../models/VendorBill');
const PurchaseOrder = require('../models/PurchaseOrder');
const Journal = require('../models/Journal');
const Account = require('../models/Account');
const { createAndPostEntry } = require('../services/accountingEngine');

// Create Vendor Bill
const createVendorBill = async (req, res, next) => {
  try {
    const bill = await VendorBill.create(req.body);
    const populated = await VendorBill.findById(bill._id)
      .populate('vendor', 'name email mobile address')
      .populate('purchaseOrder', 'orderNumber status totalAmount')
      .populate('items.product', 'name salesPrice costPrice')
      .populate('items.account', 'name code type')
      .populate('items.analyticAccount', 'name code type');

    res.status(201).json({
      success: true,
      message: 'Vendor Bill created successfully',
      vendorBill: populated
    });
  } catch (error) {
    next(error);
  }
};

// Get all Vendor Bills
const getVendorBills = async (req, res, next) => {
  try {
    const { vendor, status, search } = req.query;
    const filter = {};

    if (vendor) filter.vendor = vendor;
    if (status) filter.status = status;
    if (search) filter.billNumber = { $regex: search, $options: 'i' };

    const bills = await VendorBill.find(filter)
      .populate('vendor', 'name email mobile address')
      .populate('purchaseOrder', 'orderNumber status totalAmount')
      .populate('items.product', 'name salesPrice costPrice')
      .populate('journalEntry', 'entryNumber totalDebit totalCredit status')
      .sort({ billDate: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bills.length,
      vendorBills: bills
    });
  } catch (error) {
    next(error);
  }
};

// Get single Vendor Bill by ID
const getVendorBillById = async (req, res, next) => {
  try {
    const bill = await VendorBill.findById(req.params.id)
      .populate('vendor', 'name email mobile address')
      .populate('purchaseOrder', 'orderNumber status totalAmount')
      .populate('items.product', 'name salesPrice costPrice')
      .populate('items.account', 'name code type')
      .populate('items.analyticAccount', 'name code type')
      .populate('journalEntry');

    if (!bill) {
      return res.status(404).json({ success: false, message: 'Vendor Bill not found' });
    }

    res.status(200).json({ success: true, vendorBill: bill });
  } catch (error) {
    next(error);
  }
};

// Update Vendor Bill
const updateVendorBill = async (req, res, next) => {
  try {
    const bill = await VendorBill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ success: false, message: 'Vendor Bill not found' });
    }

    if (bill.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: `Cannot modify vendor bill in '${bill.status}' status.`
      });
    }

    if (req.body.vendor) bill.vendor = req.body.vendor;
    if (req.body.billDate) bill.billDate = req.body.billDate;
    if (req.body.dueDate) bill.dueDate = req.body.dueDate;
    if (req.body.items) bill.items = req.body.items;
    if (req.body.notes !== undefined) bill.notes = req.body.notes;

    await bill.save();

    const populated = await VendorBill.findById(bill._id)
      .populate('vendor', 'name email mobile')
      .populate('items.product', 'name salesPrice costPrice');

    res.status(200).json({
      success: true,
      message: 'Vendor Bill updated successfully',
      vendorBill: populated
    });
  } catch (error) {
    next(error);
  }
};

// Post Vendor Bill (Generates & posts balanced double-entry: Debit Purchase Expense, Credit Creditors)
const postVendorBill = async (req, res, next) => {
  try {
    const bill = await VendorBill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ success: false, message: 'Vendor Bill not found' });
    }

    if (bill.status !== 'draft') {
      return res.status(400).json({ success: false, message: 'Vendor Bill is already posted or processed.' });
    }

    // Find Purchase Journal
    const purchaseJournal = await Journal.findOne({ type: 'Purchase' });
    if (!purchaseJournal) {
      return res.status(400).json({ success: false, message: 'Purchase Journal not found in system. Please configure journals.' });
    }

    // Find Accounts: Purchases Expense & Creditors
    let expenseAccount = await Account.findOne({ name: 'Purchases Expense' });
    if (!expenseAccount) {
      expenseAccount = await Account.findOne({ type: 'Expense' });
    }

    let creditorsAccount = await Account.findOne({ name: 'Creditors' });
    if (!creditorsAccount) {
      creditorsAccount = await Account.findOne({ type: 'Liability' });
    }

    if (!expenseAccount || !creditorsAccount) {
      return res.status(400).json({
        success: false,
        message: 'Required accounts (Purchases Expense and Creditors) not found in Chart of Accounts.'
      });
    }

    // Build balanced double-entry journal items:
    // Debit: Expense Account (Total Bill Amount)
    // Credit: Creditors Account (Total Bill Amount)
    const journalItems = [
      {
        account: expenseAccount._id,
        partner: bill.vendor,
        label: `Vendor Bill ${bill.billNumber} - Expense`,
        debit: bill.totalAmount,
        credit: 0
      },
      {
        account: creditorsAccount._id,
        partner: bill.vendor,
        label: `Vendor Bill ${bill.billNumber} - Payable to Vendor`,
        debit: 0,
        credit: bill.totalAmount
      }
    ];

    const postedEntry = await createAndPostEntry({
      journalId: purchaseJournal._id,
      date: bill.billDate,
      reference: bill.billNumber,
      partnerId: bill.vendor,
      items: journalItems,
      userId: req.user?._id
    });

    bill.status = 'posted';
    bill.journalEntry = postedEntry._id;
    await bill.save();

    // If linked to a PO, mark PO as billed
    if (bill.purchaseOrder) {
      await PurchaseOrder.findByIdAndUpdate(bill.purchaseOrder, { status: 'billed' });
    }

    const populated = await VendorBill.findById(bill._id)
      .populate('vendor', 'name email mobile')
      .populate('journalEntry');

    res.status(200).json({
      success: true,
      message: 'Vendor Bill posted successfully. Balanced double-entry journal created and ledger updated.',
      vendorBill: populated
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Vendor Bill
const deleteVendorBill = async (req, res, next) => {
  try {
    const bill = await VendorBill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ success: false, message: 'Vendor Bill not found' });
    }

    if (bill.status !== 'draft') {
      return res.status(400).json({ success: false, message: 'Cannot delete a posted or paid vendor bill.' });
    }

    await VendorBill.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Vendor Bill deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVendorBill,
  getVendorBills,
  getVendorBillById,
  updateVendorBill,
  postVendorBill,
  deleteVendorBill
};
