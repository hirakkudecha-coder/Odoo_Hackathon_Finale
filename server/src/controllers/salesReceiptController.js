const SalesReceipt = require('../models/SalesReceipt');
const SalesOrder = require('../models/SalesOrder');
const Product = require('../models/Product');
const escapeRegex = require('../utils/escapeRegex');

// Create Sales Receipt (Admin only as per permission requirement)
const createSalesReceipt = async (req, res, next) => {
  try {
    const { receiptNumber, salesOrder, customer, receiptDate, items, notes } = req.body;

    // Number Validation
    if (!receiptNumber || typeof receiptNumber !== 'string' || receiptNumber.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Receipt Number validation failed: receiptNumber is required and must be a valid string.'
      });
    }

    // Date Validation
    if (!receiptDate || isNaN(new Date(receiptDate).getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Date validation failed: receiptDate is required and must be a valid date.'
      });
    }

    // Items & Total Price Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items validation failed: Receipt must contain at least one item.'
      });
    }

    let calculatedTotal = 0;
    for (const item of items) {
      if (typeof item.quantity !== 'number' || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Number validation failed: Item quantity must be a positive number.'
        });
      }
      if (typeof item.unitPrice !== 'number' || item.unitPrice < 0) {
        return res.status(400).json({
          success: false,
          message: 'Number validation failed: Item unit price must be non-negative.'
        });
      }

      const expectedItemTotal = Math.round(item.quantity * item.unitPrice * 100) / 100;
      if (item.totalPrice !== undefined && item.totalPrice !== null) {
        if (Math.abs(Number(item.totalPrice) - expectedItemTotal) > 0.01) {
          return res.status(400).json({
            success: false,
            message: `Total Price validation failed: Line item totalPrice (${item.totalPrice}) does not match quantity * unitPrice (${expectedItemTotal}).`
          });
        }
      }

      item.totalPrice = expectedItemTotal;
      calculatedTotal += item.totalPrice;
    }

    calculatedTotal = Math.round(calculatedTotal * 100) / 100;
    if (req.body.totalAmount !== undefined && req.body.totalAmount !== null) {
      if (Math.abs(Number(req.body.totalAmount) - calculatedTotal) > 0.01) {
        return res.status(400).json({
          success: false,
          message: `Total Price validation failed: totalAmount (${req.body.totalAmount}) does not match sum of item total prices (${calculatedTotal}).`
        });
      }
    }

    const receipt = await SalesReceipt.create({
      receiptNumber: receiptNumber.trim(),
      salesOrder,
      customer,
      receiptDate: new Date(receiptDate),
      items,
      totalAmount: calculatedTotal,
      notes: notes || '',
      status: 'draft',
      deliveredBy: req.user?._id
    });

    await receipt.populate([
      { path: 'salesOrder', select: 'orderNumber status totalAmount' },
      { path: 'customer', select: 'name email mobile' },
      { path: 'items.product', select: 'name salesPrice costPrice' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Sales Receipt created successfully',
      salesReceipt: receipt
    });
  } catch (error) {
    next(error);
  }
};

// Get all Sales Receipts
const getSalesReceipts = async (req, res, next) => {
  try {
    const { customer, salesOrder, status, search } = req.query;
    const filter = {};

    if (customer) filter.customer = customer;
    if (salesOrder) filter.salesOrder = salesOrder;
    if (status) filter.status = status;
    if (search) filter.receiptNumber = { $regex: escapeRegex(search), $options: 'i' };

    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 25, 100);
    const skip = (page - 1) * limit;

    const totalCount = await SalesReceipt.countDocuments(filter);
    const receipts = await SalesReceipt.find(filter)
      .populate('salesOrder', 'orderNumber status totalAmount')
      .populate('customer', 'name email mobile')
      .populate('items.product', 'name salesPrice costPrice')
      .populate('deliveredBy', 'name email')
      .sort({ receiptDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: receipts.length,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit) || 1,
      salesReceipts: receipts
    });
  } catch (error) {
    next(error);
  }
};

// Get single Sales Receipt by ID
const getSalesReceiptById = async (req, res, next) => {
  try {
    const receipt = await SalesReceipt.findById(req.params.id)
      .populate('salesOrder', 'orderNumber status totalAmount')
      .populate('customer', 'name email mobile')
      .populate('items.product', 'name salesPrice costPrice')
      .populate('deliveredBy', 'name email');

    if (!receipt) {
      return res.status(404).json({ success: false, message: 'Sales Receipt not found' });
    }

    res.status(200).json({ success: true, salesReceipt: receipt });
  } catch (error) {
    next(error);
  }
};

// Update Sales Receipt (Admin only)
const updateSalesReceipt = async (req, res, next) => {
  try {
    const receipt = await SalesReceipt.findById(req.params.id);
    if (!receipt) {
      return res.status(404).json({ success: false, message: 'Sales Receipt not found' });
    }

    if (receipt.status === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify a confirmed/delivered sales receipt.'
      });
    }

    if (req.body.receiptNumber) receipt.receiptNumber = req.body.receiptNumber.trim();
    if (req.body.receiptDate) {
      if (isNaN(new Date(req.body.receiptDate).getTime())) {
        return res.status(400).json({ success: false, message: 'Invalid receipt date provided.' });
      }
      receipt.receiptDate = new Date(req.body.receiptDate);
    }
    if (req.body.items) {
      let total = 0;
      for (const item of req.body.items) {
        if (typeof item.quantity !== 'number' || item.quantity <= 0) {
          return res.status(400).json({ success: false, message: 'Quantity must be a positive number.' });
        }
        item.totalPrice = Math.round(item.quantity * item.unitPrice * 100) / 100;
        total += item.totalPrice;
      }
      receipt.items = req.body.items;
      receipt.totalAmount = Math.round(total * 100) / 100;
    }
    if (req.body.notes !== undefined) receipt.notes = req.body.notes;

    await receipt.save();

    await receipt.populate([
      { path: 'salesOrder', select: 'orderNumber status totalAmount' },
      { path: 'customer', select: 'name email mobile' },
      { path: 'items.product', select: 'name salesPrice costPrice' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Sales Receipt updated successfully',
      salesReceipt: receipt
    });
  } catch (error) {
    next(error);
  }
};

// Confirm/Process Sales Receipt (Both Admin and Accountant can confirm!)
const confirmSalesReceipt = async (req, res, next) => {
  try {
    const receipt = await SalesReceipt.findById(req.params.id);
    if (!receipt) {
      return res.status(404).json({ success: false, message: 'Sales Receipt not found' });
    }

    if (receipt.status === 'delivered' || receipt.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: `Sales Receipt cannot be confirmed because it is already in '${receipt.status}' status.`
      });
    }

    receipt.status = 'delivered';
    receipt.deliveredBy = req.user?._id;
    await receipt.save();

    // Update parent Sales Order status to 'delivered'
    if (receipt.salesOrder) {
      await SalesOrder.findByIdAndUpdate(receipt.salesOrder, { status: 'delivered' });
    }

    // Decrement physical product inventory stock
    if (receipt.items && Array.isArray(receipt.items)) {
      for (const item of receipt.items) {
        if (item.product && item.quantity > 0) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { currentStock: -item.quantity }
          });
        }
      }
    }

    await receipt.populate([
      { path: 'salesOrder', select: 'orderNumber status totalAmount' },
      { path: 'customer', select: 'name email mobile' },
      { path: 'deliveredBy', select: 'name email' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Sales Receipt confirmed successfully. Sales order marked as delivered.',
      salesReceipt: receipt
    });
  } catch (error) {
    next(error);
  }
};

// Delete Sales Receipt (Admin only)
const deleteSalesReceipt = async (req, res, next) => {
  try {
    const receipt = await SalesReceipt.findById(req.params.id);
    if (!receipt) {
      return res.status(404).json({ success: false, message: 'Sales Receipt not found' });
    }

    await SalesReceipt.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Sales Receipt deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSalesReceipt,
  getSalesReceipts,
  getSalesReceiptById,
  updateSalesReceipt,
  confirmSalesReceipt,
  deleteSalesReceipt
};
