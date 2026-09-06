const Budget = require('../models/Budget');
const AnalyticAccount = require('../models/AnalyticAccount');
const CustomerInvoice = require('../models/CustomerInvoice');
const VendorBill = require('../models/VendorBill');
const escapeRegex = require('../utils/escapeRegex');

// Create budget
const createBudget = async (req, res, next) => {
  try {
    if (!req.body.analyticAccount) {
      return res.status(400).json({ success: false, message: 'analyticAccount reference is required.' });
    }
    const analytic = await AnalyticAccount.findById(req.body.analyticAccount);
    if (!analytic) {
      return res.status(404).json({ success: false, message: 'Invalid analyticAccount reference: Analytic account not found.' });
    }

    const budget = await Budget.create(req.body);
    await budget.populate([
      { path: 'analyticAccount', select: 'name code type' },
      { path: 'responsibleContact', select: 'name email phone' },
      { path: 'revisionOf', select: 'name period' },
      { path: 'revisedWith', select: 'name period' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Budget created successfully',
      budget
    });
  } catch (error) {
    next(error);
  }
};

// Helper to compute achieved amount for a budget
const computeBudgetAchieved = async (budget) => {
  if (!budget || !budget.analyticAccount) return 0;

  const analyticId = budget.analyticAccount._id || budget.analyticAccount;
  const analytic = await AnalyticAccount.findById(analyticId);
  if (!analytic) return 0;

  const startDate = budget.startDate ? new Date(budget.startDate) : new Date(2026, 0, 1);
  const endDate = budget.endDate ? new Date(budget.endDate) : new Date(2026, 11, 31, 23, 59, 59);

  let achieved = 0;

  if (analytic.type === 'Income') {
    const invoices = await CustomerInvoice.find({
      status: { $in: ['posted', 'paid', 'partial', 'confirmed'] },
      invoiceDate: { $gte: startDate, $lte: endDate },
      'items.analyticAccount': analyticId
    });

    invoices.forEach(inv => {
      inv.items.forEach(item => {
        if (item.analyticAccount && item.analyticAccount.toString() === analyticId.toString()) {
          achieved += (Number(item.subtotal) || 0);
        }
      });
    });
  } else {
    const bills = await VendorBill.find({
      status: { $in: ['posted', 'paid', 'partial', 'confirmed'] },
      billDate: { $gte: startDate, $lte: endDate },
      'items.analyticAccount': analyticId
    });

    bills.forEach(bill => {
      bill.items.forEach(item => {
        if (item.analyticAccount && item.analyticAccount.toString() === analyticId.toString()) {
          achieved += (Number(item.subtotal) || 0);
        }
      });
    });
  }

  return Math.round(achieved * 100) / 100;
};

// Get all budgets with computed achieved amount and variance
const getBudgets = async (req, res, next) => {
  try {
    const { period, status, search } = req.query;
    const filter = {};

    if (period) filter.period = period;
    if (status) filter.status = status;
    if (search) filter.name = { $regex: escapeRegex(search), $options: 'i' };

    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const skip = (page - 1) * limit;

    const totalCount = await Budget.countDocuments(filter);
    const budgetDocs = await Budget.find(filter)
      .populate('analyticAccount', 'name code type')
      .populate('responsibleContact', 'name email phone')
      .populate('revisionOf', 'name period status')
      .populate('revisedWith', 'name period status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Compute actual achieved amount and variance for each budget
    const budgets = await Promise.all(
      budgetDocs.map(async (doc) => {
        const achieved = await computeBudgetAchieved(doc);
        const planned = Number(doc.plannedAmount) || 0;
        const balance = Math.max(0, planned - achieved);
        const utilizationPercent = planned > 0 ? Math.min(100, Math.round((achieved / planned) * 1000) / 10) : 0;

        const obj = doc.toObject();
        obj.achievedAmount = achieved;
        obj.actualAmount = achieved;
        obj.balanceAmount = balance;
        obj.variance = planned - achieved;
        obj.utilizationPercent = utilizationPercent;
        return obj;
      })
    );

    res.status(200).json({
      success: true,
      count: budgets.length,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit) || 1,
      budgets
    });
  } catch (error) {
    next(error);
  }
};

// Get single budget by ID
const getBudgetById = async (req, res, next) => {
  try {
    const doc = await Budget.findById(req.params.id)
      .populate('analyticAccount', 'name code type')
      .populate('responsibleContact', 'name email phone')
      .populate('revisionOf', 'name period status')
      .populate('revisedWith', 'name period status');

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    const achieved = await computeBudgetAchieved(doc);
    const planned = Number(doc.plannedAmount) || 0;
    const balance = Math.max(0, planned - achieved);
    const utilizationPercent = planned > 0 ? Math.min(100, Math.round((achieved / planned) * 1000) / 10) : 0;

    const budget = doc.toObject();
    budget.achievedAmount = achieved;
    budget.actualAmount = achieved;
    budget.balanceAmount = balance;
    budget.variance = planned - achieved;
    budget.utilizationPercent = utilizationPercent;

    res.status(200).json({ success: true, budget });
  } catch (error) {
    next(error);
  }
};

// Update budget
const updateBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('analyticAccount', 'name code type')
      .populate('responsibleContact', 'name email phone')
      .populate('revisionOf', 'name period status')
      .populate('revisedWith', 'name period status');

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Budget updated successfully',
      budget
    });
  } catch (error) {
    next(error);
  }
};

// Revise Budget Workflow
// Marks original confirmed budget as 'revised', creates '[Original Name] Revised' in 'draft', sets reciprocal links
const reviseBudget = async (req, res, next) => {
  try {
    const original = await Budget.findById(req.params.id);
    if (!original) {
      return res.status(404).json({ success: false, message: 'Budget not found.' });
    }

    if (original.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: `Only confirmed budgets can be revised. Current status: '${original.status}'`
      });
    }

    // Mark original as revised
    original.status = 'revised';

    // Create new revision budget
    const revisionName = original.name.includes('Revised') ? `${original.name} (v2)` : `${original.name} Revised`;
    const newBudget = await Budget.create({
      name: revisionName,
      period: original.period,
      startDate: original.startDate,
      endDate: original.endDate,
      responsiblePerson: original.responsiblePerson,
      responsibleContact: original.responsibleContact,
      analyticAccount: original.analyticAccount,
      plannedAmount: req.body.plannedAmount || original.plannedAmount,
      status: 'draft',
      revisionOf: original._id
    });

    // Link back original to new revision
    original.revisedWith = newBudget._id;
    await original.save();

    await newBudget.populate([
      { path: 'analyticAccount', select: 'name code type' },
      { path: 'responsibleContact', select: 'name email phone' },
      { path: 'revisionOf', select: 'name period status' }
    ]);

    await original.populate([
      { path: 'analyticAccount', select: 'name code type' },
      { path: 'responsibleContact', select: 'name email phone' },
      { path: 'revisedWith', select: 'name period status' }
    ]);

    res.status(201).json({
      success: true,
      message: `Budget successfully revised. Created '${newBudget.name}'.`,
      originalBudget: original,
      newBudget
    });
  } catch (error) {
    next(error);
  }
};

// Drill-down endpoint: returns all specific contributing invoices/bills for a budget's analytic account
const getBudgetDrilldown = async (req, res, next) => {
  try {
    const budget = await Budget.findById(req.params.id)
      .populate('analyticAccount', 'name code type');

    if (!budget || !budget.analyticAccount) {
      return res.status(404).json({ success: false, message: 'Budget or analytic account not found.' });
    }

    const analyticId = budget.analyticAccount._id;
    const isIncome = budget.analyticAccount.type === 'Income';
    const startDate = budget.startDate ? new Date(budget.startDate) : new Date(2026, 0, 1);
    const endDate = budget.endDate ? new Date(budget.endDate) : new Date(2026, 11, 31, 23, 59, 59);

    let transactions = [];
    let totalAchieved = 0;

    if (isIncome) {
      const invoices = await CustomerInvoice.find({
        status: { $in: ['posted', 'paid', 'partial', 'confirmed'] },
        invoiceDate: { $gte: startDate, $lte: endDate },
        'items.analyticAccount': analyticId
      }).populate('customer', 'name email');

      invoices.forEach(inv => {
        inv.items.forEach(item => {
          if (item.analyticAccount && item.analyticAccount.toString() === analyticId.toString()) {
            const amt = Number(item.subtotal) || 0;
            totalAchieved += amt;
            transactions.push({
              _id: `${inv._id}-${item._id}`,
              documentType: 'Customer Invoice',
              docNumber: inv.invoiceNumber,
              date: inv.invoiceDate,
              partnerName: inv.customer?.name || 'Customer',
              itemDescription: item.description || 'Furniture & Services',
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              amount: amt,
              status: inv.status
            });
          }
        });
      });
    } else {
      const bills = await VendorBill.find({
        status: { $in: ['posted', 'paid', 'partial', 'confirmed'] },
        billDate: { $gte: startDate, $lte: endDate },
        'items.analyticAccount': analyticId
      }).populate('vendor', 'name email');

      bills.forEach(bill => {
        bill.items.forEach(item => {
          if (item.analyticAccount && item.analyticAccount.toString() === analyticId.toString()) {
            const amt = Number(item.subtotal) || 0;
            totalAchieved += amt;
            transactions.push({
              _id: `${bill._id}-${item._id}`,
              documentType: 'Vendor Bill',
              docNumber: bill.billNumber,
              date: bill.billDate,
              partnerName: bill.vendor?.name || 'Vendor',
              itemDescription: item.description || 'Supplies & Services',
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              amount: amt,
              status: bill.status
            });
          }
        });
      });
    }

    res.status(200).json({
      success: true,
      budget: {
        _id: budget._id,
        name: budget.name,
        period: budget.period,
        plannedAmount: budget.plannedAmount,
        achievedAmount: Math.round(totalAchieved * 100) / 100,
        analyticAccount: budget.analyticAccount
      },
      count: transactions.length,
      transactions
    });
  } catch (error) {
    next(error);
  }
};

// Delete budget
const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);
    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Budget deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  reviseBudget,
  getBudgetDrilldown,
  deleteBudget
};
