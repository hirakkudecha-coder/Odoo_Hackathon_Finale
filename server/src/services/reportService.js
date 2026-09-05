const Account = require('../models/Account');
const JournalEntry = require('../models/JournalEntry');
const Budget = require('../models/Budget');
const Product = require('../models/Product');
const GoodsReceipt = require('../models/GoodsReceipt');
const SalesReceipt = require('../models/SalesReceipt');

/**
 * Calculate Profit & Loss Report dynamically from accounts & posted journal items
 */
const getProfitAndLossReport = async ({ startDate, endDate } = {}) => {
  const currentYear = new Date().getFullYear();
  const effectiveStart = startDate ? new Date(startDate) : new Date(`${currentYear}-01-01T00:00:00.000Z`);
  const effectiveEnd = endDate ? new Date(endDate) : new Date(`${currentYear}-12-31T23:59:59.999Z`);

  // Build MongoDB aggregation pipeline on JournalEntry
  const matchStage = {
    status: 'posted',
    date: { $gte: effectiveStart, $lte: effectiveEnd }
  };

  const aggregatedJournalItems = await JournalEntry.aggregate([
    { $match: matchStage },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'accounts',
        localField: 'items.account',
        foreignField: '_id',
        as: 'accountDetails'
      }
    },
    { $unwind: '$accountDetails' },
    {
      $match: {
        'accountDetails.type': { $in: ['Income', 'Expense'] }
      }
    },
    {
      $group: {
        _id: '$accountDetails._id',
        code: { $first: '$accountDetails.code' },
        name: { $first: '$accountDetails.name' },
        type: { $first: '$accountDetails.type' },
        totalDebit: { $sum: '$items.debit' },
        totalCredit: { $sum: '$items.credit' }
      }
    }
  ]);

  const allPnlAccounts = await Account.find({ type: { $in: ['Income', 'Expense'] } });
  const aggMap = {};
  for (const item of aggregatedJournalItems) {
    aggMap[item._id.toString()] = item;
  }

  let salesIncomeTotal = 0;
  const incomeDetails = [];

  let purchasesExpenseTotal = 0;
  let otherExpensesTotal = 0;
  const expenseDetails = [];

  for (const acc of allPnlAccounts) {
    const agg = aggMap[acc._id.toString()];
    let periodBalance = 0;

    if (agg) {
      if (acc.type === 'Income') {
        // Income is credit normal: credit increases, debit decreases
        periodBalance = (agg.totalCredit || 0) - (agg.totalDebit || 0);
      } else if (acc.type === 'Expense') {
        // Expense is debit normal: debit increases, credit decreases
        periodBalance = (agg.totalDebit || 0) - (agg.totalCredit || 0);
      }
    }

    periodBalance = Math.round(periodBalance * 100) / 100;

    if (acc.type === 'Income') {
      salesIncomeTotal += periodBalance;
      incomeDetails.push({
        accountId: acc._id,
        code: acc.code,
        name: acc.name,
        balance: periodBalance
      });
    } else if (acc.type === 'Expense') {
      if (acc.name === 'Purchases Expense' || acc.code === '5001') {
        purchasesExpenseTotal += periodBalance;
      } else {
        otherExpensesTotal += periodBalance;
      }
      expenseDetails.push({
        accountId: acc._id,
        code: acc.code,
        name: acc.name,
        balance: periodBalance
      });
    }
  }

  const totalExpense = Math.round((purchasesExpenseTotal + otherExpensesTotal) * 100) / 100;
  const grossProfit = Math.round((salesIncomeTotal - purchasesExpenseTotal) * 100) / 100;
  const netProfit = Math.round((salesIncomeTotal - totalExpense) * 100) / 100;

  return {
    period: {
      startDate: effectiveStart.toISOString(),
      endDate: effectiveEnd.toISOString()
    },
    income: {
      total: Math.round(salesIncomeTotal * 100) / 100,
      accounts: incomeDetails
    },
    expenses: {
      purchasesExpense: Math.round(purchasesExpenseTotal * 100) / 100,
      otherExpenses: Math.round(otherExpensesTotal * 100) / 100,
      total: totalExpense,
      accounts: expenseDetails
    },
    summary: {
      grossProfit,
      netProfit,
      isProfitable: netProfit >= 0
    },
    generatedAt: new Date().toISOString()
  };
};

/**
 * Calculate Balance Sheet Report dynamically from accounts
 */
const getBalanceSheetReport = async ({ date } = {}) => {
  const accounts = await Account.find({ type: { $in: ['Asset', 'Liability', 'Capital'] } });

  let totalAssets = 0;
  const assetAccounts = [];

  let totalLiabilities = 0;
  const liabilityAccounts = [];

  let totalCapital = 0;
  const capitalAccounts = [];

  for (const acc of accounts) {
    if (acc.type === 'Asset') {
      totalAssets += acc.balance;
      assetAccounts.push({
        accountId: acc._id,
        code: acc.code,
        name: acc.name,
        balance: acc.balance
      });
    } else if (acc.type === 'Liability') {
      totalLiabilities += acc.balance;
      liabilityAccounts.push({
        accountId: acc._id,
        code: acc.code,
        name: acc.name,
        balance: acc.balance
      });
    } else if (acc.type === 'Capital') {
      totalCapital += acc.balance;
      capitalAccounts.push({
        accountId: acc._id,
        code: acc.code,
        name: acc.name,
        balance: acc.balance
      });
    }
  }

  // Calculate current period net profit from P&L
  const pnl = await getProfitAndLossReport();
  const currentNetProfit = pnl.summary.netProfit;

  totalAssets = Math.round(totalAssets * 100) / 100;
  totalLiabilities = Math.round(totalLiabilities * 100) / 100;
  totalCapital = Math.round(totalCapital * 100) / 100;

  const totalLiabilitiesAndEquity = Math.round((totalLiabilities + totalCapital + currentNetProfit) * 100) / 100;
  const isBalanced = Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01;

  return {
    asOfDate: date || new Date().toISOString(),
    assets: {
      total: totalAssets,
      accounts: assetAccounts
    },
    liabilities: {
      total: totalLiabilities,
      accounts: liabilityAccounts
    },
    equity: {
      totalCapital,
      currentNetProfit,
      totalEquity: Math.round((totalCapital + currentNetProfit) * 100) / 100,
      accounts: capitalAccounts
    },
    summary: {
      totalAssets,
      totalLiabilitiesAndEquity,
      isBalanced
    },
    generatedAt: new Date().toISOString()
  };
};

/**
 * Calculate Budget Report dynamically from Budgets and posted Journal Items using MongoDB aggregation
 */
const getBudgetReport = async ({ period } = {}) => {
  const filter = {};
  if (period) filter.period = period;

  const budgets = await Budget.find(filter).populate('analyticAccount', 'name code type');

  // Aggregation pipeline: compute actual amounts per analytic account in database
  const actualsAgg = await JournalEntry.aggregate([
    { $match: { status: 'posted' } },
    { $unwind: '$items' },
    { $match: { 'items.analyticAccount': { $ne: null } } },
    {
      $group: {
        _id: '$items.analyticAccount',
        totalActual: {
          $sum: { $add: [{ $ifNull: ['$items.debit', 0] }, { $ifNull: ['$items.credit', 0] }] }
        }
      }
    }
  ]);

  const actualsMap = {};
  for (const item of actualsAgg) {
    if (item._id) {
      actualsMap[item._id.toString()] = item.totalActual || 0;
    }
  }

  let totalPlanned = 0;
  let totalActual = 0;

  const budgetItems = budgets.map(b => {
    const analyticId = b.analyticAccount?._id?.toString();
    const actual = Math.round((actualsMap[analyticId] || 0) * 100) / 100;
    const variance = Math.round((b.plannedAmount - actual) * 100) / 100;
    const utilizationPercent = b.plannedAmount > 0 ? Math.round((actual / b.plannedAmount) * 10000) / 100 : 0;

    totalPlanned += b.plannedAmount;
    totalActual += actual;

    return {
      budgetId: b._id,
      name: b.name,
      period: b.period,
      responsiblePerson: b.responsiblePerson,
      analyticAccount: b.analyticAccount,
      plannedAmount: b.plannedAmount,
      actualAmount: actual,
      variance,
      utilizationPercent,
      status: b.status
    };
  });

  return {
    period: period || 'All Periods',
    totalPlanned: Math.round(totalPlanned * 100) / 100,
    totalActual: Math.round(totalActual * 100) / 100,
    totalVariance: Math.round((totalPlanned - totalActual) * 100) / 100,
    overallUtilizationPercent: totalPlanned > 0 ? Math.round((totalActual / totalPlanned) * 10000) / 100 : 0,
    budgets: budgetItems,
    generatedAt: new Date().toISOString()
  };
};

/**
 * Calculate Stock / Inventory Valuation & Movement Ledger using MongoDB aggregation
 */
const getStockValuationReport = async () => {
  const products = await Product.find({ status: 'active' });

  // MongoDB aggregation pipeline for inward quantities
  const inwardAgg = await GoodsReceipt.aggregate([
    { $match: { status: 'received' } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        totalInward: { $sum: '$items.quantity' }
      }
    }
  ]);

  // MongoDB aggregation pipeline for outward quantities
  const outwardAgg = await SalesReceipt.aggregate([
    { $match: { status: 'delivered' } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        totalOutward: { $sum: '$items.quantity' }
      }
    }
  ]);

  const inwardMap = {};
  for (const item of inwardAgg) {
    if (item._id) inwardMap[item._id.toString()] = item.totalInward || 0;
  }

  const outwardMap = {};
  for (const item of outwardAgg) {
    if (item._id) outwardMap[item._id.toString()] = item.totalOutward || 0;
  }

  let totalInventoryValuation = 0;
  let totalSalesPotential = 0;
  let totalUnitsOnHand = 0;

  const stockItems = products.map((p) => {
    const pId = p._id.toString();
    const inward = inwardMap[pId] || 0;
    const outward = outwardMap[pId] || 0;
    const onHand = Math.max(0, inward - outward);
    const valuation = Math.round(onHand * (p.costPrice || 0) * 100) / 100;
    const salesValue = Math.round(onHand * (p.salesPrice || 0) * 100) / 100;

    totalUnitsOnHand += onHand;
    totalInventoryValuation += valuation;
    totalSalesPotential += salesValue;

    let stockStatus = 'In Stock';
    if (onHand === 0) stockStatus = 'Out of Stock';
    else if (onHand < 5) stockStatus = 'Low Stock';

    return {
      productId: p._id,
      name: p.name,
      type: p.type,
      category: p.category,
      costPrice: p.costPrice,
      salesPrice: p.salesPrice,
      inwardQty: inward,
      outwardQty: outward,
      onHandQty: onHand,
      valuation,
      salesValue,
      status: stockStatus
    };
  });

  return {
    totalProducts: products.length,
    totalUnitsOnHand,
    totalInventoryValuation: Math.round(totalInventoryValuation * 100) / 100,
    totalSalesPotential: Math.round(totalSalesPotential * 100) / 100,
    potentialGrossProfit: Math.round((totalSalesPotential - totalInventoryValuation) * 100) / 100,
    items: stockItems,
    generatedAt: new Date().toISOString()
  };
};

module.exports = {
  getProfitAndLossReport,
  getBalanceSheetReport,
  getBudgetReport,
  getStockValuationReport
};
