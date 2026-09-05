const Payment = require('../models/Payment');
const VendorBill = require('../models/VendorBill');
const CustomerInvoice = require('../models/CustomerInvoice');
const Journal = require('../models/Journal');
const Account = require('../models/Account');
const { createAndPostEntry } = require('../services/accountingEngine');

// Create & Process Payment
const createPayment = async (req, res, next) => {
  try {
    const {
      paymentType,
      partner,
      paymentDate,
      amount,
      paymentMethod,
      journal,
      vendorBill,
      customerInvoice,
      notes
    } = req.body;

    const payAmount = Number(amount);
    if (!payAmount || payAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid payment amount greater than zero is required.' });
    }

    // Determine Payment Journal (Bank or Cash)
    let paymentJournal = null;
    if (journal) {
      paymentJournal = await Journal.findById(journal);
    } else {
      const journalType = paymentMethod === 'Cash' ? 'Cash' : 'Bank';
      paymentJournal = await Journal.findOne({ type: journalType });
    }

    if (!paymentJournal) {
      return res.status(400).json({ success: false, message: `Payment Journal (${paymentMethod}) not found.` });
    }

    // Determine Payment Liquidity Account (Bank or Cash)
    const liquidityAccountName = paymentMethod === 'Cash' ? 'Cash' : 'Bank';
    let liquidityAccount = await Account.findOne({ name: liquidityAccountName });
    if (!liquidityAccount) {
      liquidityAccount = await Account.findOne({ type: 'Asset' });
    }

    if (!liquidityAccount) {
      return res.status(400).json({ success: false, message: `Liquidity Account (${liquidityAccountName}) not found.` });
    }

    let partnerAccount = null;
    let targetDoc = null;
    let journalItems = [];

    // --- CASE 1: SEND MONEY (Vendor Bill Payment) ---
    if (paymentType === 'send_money') {
      if (vendorBill) {
        targetDoc = await VendorBill.findById(vendorBill);
        if (!targetDoc) {
          return res.status(404).json({ success: false, message: 'Vendor Bill not found.' });
        }
        if (targetDoc.status === 'draft') {
          return res.status(400).json({ success: false, message: 'Vendor Bill must be posted before registering payment.' });
        }
        const outstanding = targetDoc.totalAmount - (targetDoc.paidAmount || 0);
        if (payAmount > outstanding + 0.001) {
          return res.status(400).json({
            success: false,
            message: `Payment amount (${payAmount}) exceeds outstanding bill balance (${outstanding.toFixed(2)}).`
          });
        }
      }

      partnerAccount = await Account.findOne({ name: 'Creditors' });
      if (!partnerAccount) partnerAccount = await Account.findOne({ type: 'Liability' });

      // Accounting Entry for Vendor Payment:
      // Debit: Creditors (reduces liability)
      // Credit: Bank/Cash (reduces asset)
      journalItems = [
        {
          account: partnerAccount._id,
          partner: partner || targetDoc?.vendor,
          label: `Payment for Bill ${targetDoc?.billNumber || ''}`,
          debit: payAmount,
          credit: 0
        },
        {
          account: liquidityAccount._id,
          partner: partner || targetDoc?.vendor,
          label: `Payment via ${paymentMethod}`,
          debit: 0,
          credit: payAmount
        }
      ];
    }
    // --- CASE 2: RECEIVE MONEY (Customer Invoice Payment) ---
    else if (paymentType === 'receive_money') {
      if (customerInvoice) {
        targetDoc = await CustomerInvoice.findById(customerInvoice);
        if (!targetDoc) {
          return res.status(404).json({ success: false, message: 'Customer Invoice not found.' });
        }
        if (targetDoc.status === 'draft') {
          return res.status(400).json({ success: false, message: 'Customer Invoice must be posted before registering payment.' });
        }
        const outstanding = targetDoc.totalAmount - (targetDoc.paidAmount || 0);
        if (payAmount > outstanding + 0.001) {
          return res.status(400).json({
            success: false,
            message: `Payment amount (${payAmount}) exceeds outstanding invoice balance (${outstanding.toFixed(2)}).`
          });
        }
      }

      partnerAccount = await Account.findOne({ name: 'Debtors' });
      if (!partnerAccount) partnerAccount = await Account.findOne({ type: 'Asset' });

      // Accounting Entry for Customer Payment:
      // Debit: Bank/Cash (increases asset)
      // Credit: Debtors (reduces accounts receivable)
      journalItems = [
        {
          account: liquidityAccount._id,
          partner: partner || targetDoc?.customer,
          label: `Customer Payment received via ${paymentMethod}`,
          debit: payAmount,
          credit: 0
        },
        {
          account: partnerAccount._id,
          partner: partner || targetDoc?.customer,
          label: `Invoice settlement for ${targetDoc?.invoiceNumber || ''}`,
          debit: 0,
          credit: payAmount
        }
      ];
    } else {
      return res.status(400).json({ success: false, message: "Invalid paymentType. Must be 'send_money' or 'receive_money'." });
    }

    // Create Payment record
    const payment = new Payment({
      paymentType,
      partner: partner || targetDoc?.vendor || targetDoc?.customer,
      paymentDate: paymentDate || new Date(),
      amount: payAmount,
      paymentMethod: paymentMethod || 'Bank',
      journal: paymentJournal._id,
      vendorBill: vendorBill || null,
      customerInvoice: customerInvoice || null,
      notes: notes || '',
      status: 'posted'
    });

    // Post balanced double-entry accounting entry
    const postedEntry = await createAndPostEntry({
      journalId: paymentJournal._id,
      date: payment.paymentDate,
      reference: payment.paymentNumber,
      partnerId: payment.partner,
      items: journalItems,
      userId: req.user?._id
    });

    payment.journalEntry = postedEntry._id;
    await payment.save();

    // Update target document (Vendor Bill or Customer Invoice) paidAmount & status
    if (vendorBill && targetDoc) {
      targetDoc.paidAmount = Math.round(((targetDoc.paidAmount || 0) + payAmount) * 100) / 100;
      if (targetDoc.paidAmount >= targetDoc.totalAmount - 0.001) {
        targetDoc.status = 'paid';
      } else {
        targetDoc.status = 'partial';
      }
      await targetDoc.save();
    } else if (customerInvoice && targetDoc) {
      targetDoc.paidAmount = Math.round(((targetDoc.paidAmount || 0) + payAmount) * 100) / 100;
      if (targetDoc.paidAmount >= targetDoc.totalAmount - 0.001) {
        targetDoc.status = 'paid';
      } else {
        targetDoc.status = 'partial';
      }
      await targetDoc.save();
    }

    const populated = await Payment.findById(payment._id)
      .populate('partner', 'name email mobile')
      .populate('journal', 'name code type')
      .populate('journalEntry')
      .populate('vendorBill', 'billNumber totalAmount paidAmount status')
      .populate('customerInvoice', 'invoiceNumber totalAmount paidAmount status');

    res.status(201).json({
      success: true,
      message: 'Payment registered and posted successfully. Balanced double-entry recorded and document updated.',
      payment: populated
    });
  } catch (error) {
    next(error);
  }
};

// Get all Payments
const getPayments = async (req, res, next) => {
  try {
    const { paymentType, partner, paymentMethod, status, search } = req.query;
    const filter = {};

    if (paymentType) filter.paymentType = paymentType;
    if (partner) filter.partner = partner;
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (status) filter.status = status;
    if (search) filter.paymentNumber = { $regex: search, $options: 'i' };

    const payments = await Payment.find(filter)
      .populate('partner', 'name email mobile')
      .populate('journal', 'name code type')
      .populate('journalEntry')
      .populate('vendorBill', 'billNumber totalAmount paidAmount status')
      .populate('customerInvoice', 'invoiceNumber totalAmount paidAmount status')
      .sort({ paymentDate: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    next(error);
  }
};

// Get single Payment by ID
const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('partner', 'name email mobile')
      .populate('journal', 'name code type')
      .populate('journalEntry')
      .populate('vendorBill')
      .populate('customerInvoice');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.status(200).json({ success: true, payment });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPayment,
  getPayments,
  getPaymentById
};
