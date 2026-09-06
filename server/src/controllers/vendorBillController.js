const VendorBill = require('../models/VendorBill');
const PurchaseOrder = require('../models/PurchaseOrder');
const Journal = require('../models/Journal');
const Account = require('../models/Account');
const { createAndPostEntry } = require('../services/accountingEngine');
const escapeRegex = require('../utils/escapeRegex');

// Create Vendor Bill
const createVendorBill = async (req, res, next) => {
  try {
    const { vendor, items, paidAmount, status } = req.body;

    if (!vendor) {
      return res.status(400).json({ success: false, message: 'Vendor is required.' });
    }

    if (req.body.billDate && isNaN(new Date(req.body.billDate).getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid billDate format.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one item is required in Vendor Bill.' });
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.product) {
        return res.status(400).json({ success: false, message: `Product is required for item at index ${i}.` });
      }
      const qty = Number(item.quantity);
      if (!qty || qty <= 0) {
        return res.status(400).json({ success: false, message: `Quantity must be greater than 0 for item at index ${i}.` });
      }
      const price = Number(item.unitPrice);
      if (price === undefined || isNaN(price) || price < 0) {
        return res.status(400).json({ success: false, message: `Unit price must be non-negative for item at index ${i}.` });
      }
    }

    if (paidAmount !== undefined && Number(paidAmount) > 0) {
      return res.status(400).json({ success: false, message: 'Cannot set paidAmount upon vendor bill creation.' });
    }

    if (status !== undefined && status !== 'draft') {
      return res.status(400).json({ success: false, message: "New vendor bills must be created in 'draft' status." });
    }

    const bill = new VendorBill(req.body);
    bill.status = 'draft';
    bill.paidAmount = 0;
    await bill.save();

    await bill.populate([
      { path: 'vendor', select: 'name email mobile address' },
      { path: 'purchaseOrder', select: 'orderNumber status totalAmount' },
      { path: 'items.product', select: 'name salesPrice costPrice' },
      { path: 'items.account', select: 'name code type' },
      { path: 'items.analyticAccount', select: 'name code type' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Vendor Bill created successfully',
      vendorBill: bill
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

    if (req.user && req.user.role === 'contact' && req.user.contactId) {
      filter.vendor = req.user.contactId;
    } else if (vendor) {
      filter.vendor = vendor;
    }

    if (status) filter.status = status;
    if (search) filter.billNumber = { $regex: escapeRegex(search), $options: 'i' };

    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 25, 100);
    const skip = (page - 1) * limit;

    const totalCount = await VendorBill.countDocuments(filter);
    const bills = await VendorBill.find(filter)
      .populate('vendor', 'name email mobile address')
      .populate('purchaseOrder', 'orderNumber status totalAmount')
      .populate('items.product', 'name salesPrice costPrice')
      .populate('journalEntry', 'entryNumber totalDebit totalCredit status')
      .sort({ billDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: bills.length,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit) || 1,
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

    if (req.user && req.user.role === 'contact' && req.user.contactId) {
      const billVendId = bill.vendor?._id ? bill.vendor._id.toString() : bill.vendor?.toString();
      if (billVendId !== req.user.contactId.toString()) {
        return res.status(403).json({ success: false, message: 'Access denied to this vendor bill' });
      }
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

    await bill.populate([
      { path: 'vendor', select: 'name email mobile' },
      { path: 'items.product', select: 'name salesPrice costPrice' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Vendor Bill updated successfully',
      vendorBill: bill
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

    if (!bill.totalAmount || bill.totalAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Vendor Bill totalAmount must be greater than zero to post.' });
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

    await bill.populate([
      { path: 'vendor', select: 'name email mobile' },
      { path: 'journalEntry' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Vendor Bill posted successfully. Balanced double-entry journal created and ledger updated.',
      vendorBill: bill
    });
  } catch (error) {
    next(error);
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
