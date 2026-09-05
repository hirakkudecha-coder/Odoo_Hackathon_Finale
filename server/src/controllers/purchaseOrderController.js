const PurchaseOrder = require('../models/PurchaseOrder');

// Create Purchase Order
const createPurchaseOrder = async (req, res, next) => {
  try {
    const po = await PurchaseOrder.create(req.body);
    const populated = await PurchaseOrder.findById(po._id)
      .populate('vendor', 'name email mobile address')
      .populate('items.product', 'name salesPrice costPrice');

    res.status(201).json({
      success: true,
      message: 'Purchase Order created successfully',
      purchaseOrder: populated
    });
  } catch (error) {
    next(error);
  }
};

// Get all Purchase Orders
const getPurchaseOrders = async (req, res, next) => {
  try {
    const { vendor, status, search } = req.query;
    const filter = {};

    if (vendor) filter.vendor = vendor;
    if (status) filter.status = status;
    if (search) filter.orderNumber = { $regex: search, $options: 'i' };

    const purchaseOrders = await PurchaseOrder.find(filter)
      .populate('vendor', 'name email mobile address')
      .populate('items.product', 'name salesPrice costPrice')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: purchaseOrders.length,
      purchaseOrders
    });
  } catch (error) {
    next(error);
  }
};

// Get single Purchase Order by ID
const getPurchaseOrderById = async (req, res, next) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id)
      .populate('vendor', 'name email mobile address')
      .populate('items.product', 'name salesPrice costPrice');

    if (!po) {
      return res.status(404).json({ success: false, message: 'Purchase Order not found' });
    }

    res.status(200).json({ success: true, purchaseOrder: po });
  } catch (error) {
    next(error);
  }
};

// Update Purchase Order
const updatePurchaseOrder = async (req, res, next) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id);
    if (!po) {
      return res.status(404).json({ success: false, message: 'Purchase Order not found' });
    }

    if (['billed', 'cancelled'].includes(po.status)) {
      return res.status(400).json({ success: false, message: `Cannot modify purchase order in status ${po.status}` });
    }

    if (req.body.vendor) po.vendor = req.body.vendor;
    if (req.body.orderDate) po.orderDate = req.body.orderDate;
    if (req.body.items) po.items = req.body.items;
    if (req.body.status) po.status = req.body.status;
    if (req.body.notes !== undefined) po.notes = req.body.notes;

    await po.save();

    const populated = await PurchaseOrder.findById(po._id)
      .populate('vendor', 'name email mobile address')
      .populate('items.product', 'name salesPrice costPrice');

    res.status(200).json({
      success: true,
      message: 'Purchase Order updated successfully',
      purchaseOrder: populated
    });
  } catch (error) {
    next(error);
  }
};

// Confirm Purchase Order
const confirmPurchaseOrder = async (req, res, next) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id);
    if (!po) {
      return res.status(404).json({ success: false, message: 'Purchase Order not found' });
    }

    po.status = 'confirmed';
    await po.save();

    res.status(200).json({
      success: true,
      message: 'Purchase Order confirmed successfully',
      purchaseOrder: po
    });
  } catch (error) {
    next(error);
  }
};

// Delete Purchase Order
const deletePurchaseOrder = async (req, res, next) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id);
    if (!po) {
      return res.status(404).json({ success: false, message: 'Purchase Order not found' });
    }

    if (['received', 'billed'].includes(po.status)) {
      return res.status(400).json({ success: false, message: 'Cannot delete a processed Purchase Order.' });
    }

    await PurchaseOrder.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Purchase Order deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrder,
  confirmPurchaseOrder,
  deletePurchaseOrder
};
