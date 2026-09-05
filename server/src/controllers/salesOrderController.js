const SalesOrder = require('../models/SalesOrder');

// Create Sales Order
const createSalesOrder = async (req, res, next) => {
  try {
    const so = await SalesOrder.create(req.body);
    const populated = await SalesOrder.findById(so._id)
      .populate('customer', 'name email mobile address')
      .populate('items.product', 'name salesPrice costPrice');

    res.status(201).json({
      success: true,
      message: 'Sales Order created successfully',
      salesOrder: populated
    });
  } catch (error) {
    next(error);
  }
};

// Get all Sales Orders
const getSalesOrders = async (req, res, next) => {
  try {
    const { customer, status, search } = req.query;
    const filter = {};

    if (customer) filter.customer = customer;
    if (status) filter.status = status;
    if (search) filter.orderNumber = { $regex: search, $options: 'i' };

    const salesOrders = await SalesOrder.find(filter)
      .populate('customer', 'name email mobile address')
      .populate('items.product', 'name salesPrice costPrice')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: salesOrders.length,
      salesOrders
    });
  } catch (error) {
    next(error);
  }
};

// Get single Sales Order by ID
const getSalesOrderById = async (req, res, next) => {
  try {
    const so = await SalesOrder.findById(req.params.id)
      .populate('customer', 'name email mobile address')
      .populate('items.product', 'name salesPrice costPrice');

    if (!so) {
      return res.status(404).json({ success: false, message: 'Sales Order not found' });
    }

    res.status(200).json({ success: true, salesOrder: so });
  } catch (error) {
    next(error);
  }
};

// Update Sales Order
const updateSalesOrder = async (req, res, next) => {
  try {
    const so = await SalesOrder.findById(req.params.id);
    if (!so) {
      return res.status(404).json({ success: false, message: 'Sales Order not found' });
    }

    if (['invoiced', 'cancelled'].includes(so.status)) {
      return res.status(400).json({ success: false, message: `Cannot modify sales order in status ${so.status}` });
    }

    if (req.body.customer) so.customer = req.body.customer;
    if (req.body.orderDate) so.orderDate = req.body.orderDate;
    if (req.body.items) so.items = req.body.items;
    if (req.body.status) so.status = req.body.status;
    if (req.body.notes !== undefined) so.notes = req.body.notes;

    await so.save();

    const populated = await SalesOrder.findById(so._id)
      .populate('customer', 'name email mobile address')
      .populate('items.product', 'name salesPrice costPrice');

    res.status(200).json({
      success: true,
      message: 'Sales Order updated successfully',
      salesOrder: populated
    });
  } catch (error) {
    next(error);
  }
};

// Confirm Sales Order
const confirmSalesOrder = async (req, res, next) => {
  try {
    const so = await SalesOrder.findById(req.params.id);
    if (!so) {
      return res.status(404).json({ success: false, message: 'Sales Order not found' });
    }

    so.status = 'confirmed';
    await so.save();

    res.status(200).json({
      success: true,
      message: 'Sales Order confirmed successfully',
      salesOrder: so
    });
  } catch (error) {
    next(error);
  }
};

// Delete Sales Order
const deleteSalesOrder = async (req, res, next) => {
  try {
    const so = await SalesOrder.findById(req.params.id);
    if (!so) {
      return res.status(404).json({ success: false, message: 'Sales Order not found' });
    }

    if (['delivered', 'invoiced'].includes(so.status)) {
      return res.status(400).json({ success: false, message: 'Cannot delete a processed Sales Order.' });
    }

    await SalesOrder.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Sales Order deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSalesOrder,
  getSalesOrders,
  getSalesOrderById,
  updateSalesOrder,
  confirmSalesOrder,
  deleteSalesOrder
};
