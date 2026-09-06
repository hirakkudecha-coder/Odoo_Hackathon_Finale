const CustomerInvoice = require('../models/CustomerInvoice');
const SalesOrder = require('../models/SalesOrder');
const Journal = require('../models/Journal');
const Account = require('../models/Account');
const { createAndPostEntry } = require('../services/accountingEngine');
const escapeRegex = require('../utils/escapeRegex');

// Create Customer Invoice
const createCustomerInvoice = async (req, res, next) => {
  try {
    const { customer, items, paidAmount, status } = req.body;

    if (!customer) {
      return res.status(400).json({ success: false, message: 'Customer is required.' });
    }

    if (req.body.invoiceDate && isNaN(new Date(req.body.invoiceDate).getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid invoiceDate format.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one item is required in Customer Invoice.' });
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
      if (item.taxPercent !== undefined && (isNaN(Number(item.taxPercent)) || Number(item.taxPercent) < 0)) {
        return res.status(400).json({ success: false, message: `Tax percent must be non-negative for item at index ${i}.` });
      }
    }

    if (paidAmount !== undefined && Number(paidAmount) > 0) {
      return res.status(400).json({ success: false, message: 'Cannot set paidAmount upon customer invoice creation.' });
    }

    if (status !== undefined && status !== 'draft') {
      return res.status(400).json({ success: false, message: "New customer invoices must be created in 'draft' status." });
    }

    const invoice = new CustomerInvoice(req.body);
    invoice.status = 'draft';
    invoice.paidAmount = 0;
    await invoice.save();

    await invoice.populate([
      { path: 'customer', select: 'name email mobile address' },
      { path: 'salesOrder', select: 'orderNumber status totalAmount' },
      { path: 'items.product', select: 'name salesPrice costPrice' },
      { path: 'items.account', select: 'name code type' },
      { path: 'items.analyticAccount', select: 'name code type' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Customer Invoice created successfully',
      customerInvoice: invoice
    });
  } catch (error) {
    next(error);
  }
};

// Get all Customer Invoices
const getCustomerInvoices = async (req, res, next) => {
  try {
    const { customer, status, search } = req.query;
    const filter = {};

    if (req.user && req.user.role === 'contact' && req.user.contactId) {
      filter.customer = req.user.contactId;
    } else if (customer) {
      filter.customer = customer;
    }

    if (status) filter.status = status;
    if (search) filter.invoiceNumber = { $regex: escapeRegex(search), $options: 'i' };

    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 25, 100);
    const skip = (page - 1) * limit;

    const totalCount = await CustomerInvoice.countDocuments(filter);
    const invoices = await CustomerInvoice.find(filter)
      .populate('customer', 'name email mobile address')
      .populate('salesOrder', 'orderNumber status totalAmount')
      .populate('items.product', 'name salesPrice costPrice')
      .populate('journalEntry', 'entryNumber totalDebit totalCredit status')
      .sort({ invoiceDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: invoices.length,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit) || 1,
      customerInvoices: invoices
    });
  } catch (error) {
    next(error);
  }
};

// Get single Customer Invoice by ID
const getCustomerInvoiceById = async (req, res, next) => {
  try {
    const invoice = await CustomerInvoice.findById(req.params.id)
      .populate('customer', 'name email mobile address')
      .populate('salesOrder', 'orderNumber status totalAmount')
      .populate('items.product', 'name salesPrice costPrice')
      .populate('items.account', 'name code type')
      .populate('items.analyticAccount', 'name code type')
      .populate('journalEntry');

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Customer Invoice not found' });
    }

    if (req.user && req.user.role === 'contact' && req.user.contactId) {
      const invCustId = invoice.customer?._id ? invoice.customer._id.toString() : invoice.customer?.toString();
      if (invCustId !== req.user.contactId.toString()) {
        return res.status(403).json({ success: false, message: 'Access denied to this customer invoice' });
      }
    }

    res.status(200).json({ success: true, customerInvoice: invoice });
  } catch (error) {
    next(error);
  }
};

// Update Customer Invoice
const updateCustomerInvoice = async (req, res, next) => {
  try {
    const invoice = await CustomerInvoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Customer Invoice not found' });
    }

    if (invoice.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: `Cannot modify customer invoice in '${invoice.status}' status.`
      });
    }

    if (req.body.customer) invoice.customer = req.body.customer;
    if (req.body.invoiceDate) invoice.invoiceDate = req.body.invoiceDate;
    if (req.body.dueDate) invoice.dueDate = req.body.dueDate;
    if (req.body.items) invoice.items = req.body.items;
    if (req.body.notes !== undefined) invoice.notes = req.body.notes;

    await invoice.save();

    await invoice.populate([
      { path: 'customer', select: 'name email mobile' },
      { path: 'items.product', select: 'name salesPrice costPrice' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Customer Invoice updated successfully',
      customerInvoice: invoice
    });
  } catch (error) {
    next(error);
  }
};

// Post Customer Invoice (Generates & posts balanced double-entry: Debit Debtors, Credit Sale Income, Credit Tax Payable)
const postCustomerInvoice = async (req, res, next) => {
  try {
    const invoice = await CustomerInvoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Customer Invoice not found' });
    }

    if (invoice.status !== 'draft') {
      return res.status(400).json({ success: false, message: 'Customer Invoice is already posted or processed.' });
    }

    if (!invoice.totalAmount || invoice.totalAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Customer Invoice totalAmount must be greater than zero to post.' });
    }

    // Find Sales Journal
    const salesJournal = await Journal.findOne({ type: 'Sales' });
    if (!salesJournal) {
      return res.status(400).json({ success: false, message: 'Sales Journal not found in system. Please configure journals.' });
    }

    // Find Accounts: Debtors & Sale Income
    let debtorsAccount = await Account.findOne({ name: 'Debtors' });
    if (!debtorsAccount) debtorsAccount = await Account.findOne({ type: 'Asset' });

    let incomeAccount = await Account.findOne({ name: 'Sale Income' });
    if (!incomeAccount) incomeAccount = await Account.findOne({ type: 'Income' });

    if (!debtorsAccount || !incomeAccount) {
      return res.status(400).json({
        success: false,
        message: 'Required accounts (Debtors and Sale Income) not found in Chart of Accounts.'
      });
    }

    // Build balanced double-entry items
    // Debit: Debtors (Total Amount)
    // Credit: Sale Income (Untaxed Amount)
    // Credit: Tax Payable (Tax Amount if tax > 0)
    const journalItems = [
      {
        account: debtorsAccount._id,
        partner: invoice.customer,
        label: `Customer Invoice ${invoice.invoiceNumber} - Receivable`,
        debit: invoice.totalAmount,
        credit: 0
      },
      {
        account: incomeAccount._id,
        partner: invoice.customer,
        label: `Customer Invoice ${invoice.invoiceNumber} - Income`,
        debit: 0,
        credit: invoice.untaxedAmount || invoice.totalAmount
      }
    ];

    if (invoice.taxAmount && invoice.taxAmount > 0) {
      let taxAccount = await Account.findOne({ name: 'Tax Payable' });
      if (!taxAccount) {
        taxAccount = await Account.findOne({ type: 'Liability' });
      }
      if (!taxAccount) {
        return res.status(400).json({
          success: false,
          message: 'Tax Payable account not configured in Chart of Accounts.'
        });
      }
      journalItems.push({
        account: taxAccount._id,
        partner: invoice.customer,
        label: `Customer Invoice ${invoice.invoiceNumber} - Tax Payable`,
        debit: 0,
        credit: invoice.taxAmount
      });
    }

    const postedEntry = await createAndPostEntry({
      journalId: salesJournal._id,
      date: invoice.invoiceDate,
      reference: invoice.invoiceNumber,
      partnerId: invoice.customer,
      items: journalItems,
      userId: req.user?._id
    });

    invoice.status = 'posted';
    invoice.journalEntry = postedEntry._id;
    await invoice.save();

    // If linked to SO, mark SO as invoiced
    if (invoice.salesOrder) {
      await SalesOrder.findByIdAndUpdate(invoice.salesOrder, { status: 'invoiced' });
    }

    await invoice.populate([
      { path: 'customer', select: 'name email mobile' },
      { path: 'journalEntry' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Customer Invoice posted successfully. Balanced double-entry journal created and ledger updated.',
      customerInvoice: invoice
    });
  } catch (error) {
    next(error);
  }
};

// Delete Customer Invoice
const deleteCustomerInvoice = async (req, res, next) => {
  try {
    const invoice = await CustomerInvoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Customer Invoice not found' });
    }

    if (invoice.status !== 'draft') {
      return res.status(400).json({ success: false, message: 'Cannot delete a posted or paid customer invoice.' });
    }

    await CustomerInvoice.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Customer Invoice deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCustomerInvoice,
  getCustomerInvoices,
  getCustomerInvoiceById,
  updateCustomerInvoice,
  postCustomerInvoice,
  deleteCustomerInvoice
};
