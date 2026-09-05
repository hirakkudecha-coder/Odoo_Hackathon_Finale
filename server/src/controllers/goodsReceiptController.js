const GoodsReceipt = require('../models/GoodsReceipt');
const PurchaseOrder = require('../models/PurchaseOrder');

// Create Goods Receipt (Admin only as per permission requirement)
const createGoodsReceipt = async (req, res, next) => {
  try {
    const { receiptNumber, purchaseOrder, vendor, receiptDate, items, notes } = req.body;

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

      item.totalPrice = Math.round(item.quantity * item.unitPrice * 100) / 100;
      calculatedTotal += item.totalPrice;
    }

    const receipt = await GoodsReceipt.create({
      receiptNumber: receiptNumber.trim(),
      purchaseOrder,
      vendor,
      receiptDate: new Date(receiptDate),
      items,
      totalAmount: Math.round(calculatedTotal * 100) / 100,
      notes: notes || '',
      status: 'draft',
      receivedBy: req.user?._id
    });

    const populated = await GoodsReceipt.findById(receipt._id)
      .populate('purchaseOrder', 'orderNumber status totalAmount')
      .populate('vendor', 'name email mobile')
      .populate('items.product', 'name salesPrice costPrice');

    res.status(201).json({
      success: true,
      message: 'Goods Receipt created successfully',
      goodsReceipt: populated
    });
  } catch (error) {
    next(error);
  }
};

// Get all Goods Receipts
const getGoodsReceipts = async (req, res, next) => {
  try {
    const { vendor, purchaseOrder, status, search } = req.query;
    const filter = {};

    if (vendor) filter.vendor = vendor;
    if (purchaseOrder) filter.purchaseOrder = purchaseOrder;
    if (status) filter.status = status;
    if (search) filter.receiptNumber = { $regex: search, $options: 'i' };

    const receipts = await GoodsReceipt.find(filter)
      .populate('purchaseOrder', 'orderNumber status totalAmount')
      .populate('vendor', 'name email mobile')
      .populate('items.product', 'name salesPrice costPrice')
      .populate('receivedBy', 'name email')
      .sort({ receiptDate: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: receipts.length,
      goodsReceipts: receipts
    });
  } catch (error) {
    next(error);
  }
};

// Get single Goods Receipt by ID
const getGoodsReceiptById = async (req, res, next) => {
  try {
    const receipt = await GoodsReceipt.findById(req.params.id)
      .populate('purchaseOrder', 'orderNumber status totalAmount')
      .populate('vendor', 'name email mobile')
      .populate('items.product', 'name salesPrice costPrice')
      .populate('receivedBy', 'name email');

    if (!receipt) {
      return res.status(404).json({ success: false, message: 'Goods Receipt not found' });
    }

    res.status(200).json({ success: true, goodsReceipt: receipt });
  } catch (error) {
    next(error);
  }
};

// Update Goods Receipt (Admin only)
const updateGoodsReceipt = async (req, res, next) => {
  try {
    const receipt = await GoodsReceipt.findById(req.params.id);
    if (!receipt) {
      return res.status(404).json({ success: false, message: 'Goods Receipt not found' });
    }

    if (receipt.status === 'received') {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify a confirmed/received goods receipt.'
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

    const populated = await GoodsReceipt.findById(receipt._id)
      .populate('purchaseOrder', 'orderNumber status totalAmount')
      .populate('vendor', 'name email mobile')
      .populate('items.product', 'name salesPrice costPrice');

    res.status(200).json({
      success: true,
      message: 'Goods Receipt updated successfully',
      goodsReceipt: populated
    });
  } catch (error) {
    next(error);
  }
};

// Confirm/Process Goods Received (Both Admin and Accountant can process!)
const confirmGoodsReceipt = async (req, res, next) => {
  try {
    const receipt = await GoodsReceipt.findById(req.params.id);
    if (!receipt) {
      return res.status(404).json({ success: false, message: 'Goods Receipt not found' });
    }

    if (receipt.status === 'received') {
      return res.status(400).json({ success: false, message: 'Goods Receipt is already confirmed/received.' });
    }

    receipt.status = 'received';
    receipt.receivedBy = req.user?._id;
    await receipt.save();

    // Update parent Purchase Order status to 'received'
    if (receipt.purchaseOrder) {
      await PurchaseOrder.findByIdAndUpdate(receipt.purchaseOrder, { status: 'received' });
    }

    const populated = await GoodsReceipt.findById(receipt._id)
      .populate('purchaseOrder', 'orderNumber status totalAmount')
      .populate('vendor', 'name email mobile')
      .populate('receivedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Goods Received confirmed successfully. Purchase order marked as received.',
      goodsReceipt: populated
    });
  } catch (error) {
    next(error);
  }
};

// Delete Goods Receipt (Admin only)
const deleteGoodsReceipt = async (req, res, next) => {
  try {
    const receipt = await GoodsReceipt.findById(req.params.id);
    if (!receipt) {
      return res.status(404).json({ success: false, message: 'Goods Receipt not found' });
    }

    await GoodsReceipt.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Goods Receipt deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGoodsReceipt,
  getGoodsReceipts,
  getGoodsReceiptById,
  updateGoodsReceipt,
  confirmGoodsReceipt,
  deleteGoodsReceipt
};
