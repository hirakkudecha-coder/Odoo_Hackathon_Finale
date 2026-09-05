const Account = require('../models/Account');
const JournalEntry = require('../models/JournalEntry');
const Budget = require('../models/Budget');

/**
 * Calculate Profit & Loss Report dynamically from accounts & posted journal items
 */
const getProfitAndLossReport = async ({ startDate, endDate } = {}) => {
  // Query all Income and Expense accounts
  const accounts = await Account.find({ type: { $in: ['Income', 'Expense'] } });

  let salesIncomeTotal = 0;
  const incomeDetails = [];

  let purchasesExpenseTotal = 0;
  let otherExpensesTotal = 0;
  const expenseDetails = [];

  for (const acc of accounts) {
    if (acc.type === 'Income') {
      salesIncomeTotal += acc.balance;
      incomeDetails.push({
        accountId: acc._id,
        code: acc.code,
        name: acc.name,
        balance: acc.balance
      });
    } else if (acc.type === 'Expense') {
      if (acc.name === 'Purchases Expense' || acc.code === '5001') {
        purchasesExpenseTotal += acc.balance;
      } else {
        otherExpensesTotal += acc.balance;
      }
      expenseDetails.push({
        accountId: acc._id,
        code: acc.code,
        name: acc.name,
        balance: acc.balance
      });
    }
  }

  const totalExpense = Math.round((purchasesExpenseTotal + otherExpensesTotal) * 100) / 100;
  const grossProfit = Math.round((salesIncomeTotal - purchasesExpenseTotal) * 100) / 100;
  const netProfit = Math.round((salesIncomeTotal - totalExpense) * 100) / 100;

  return {
    period: {
      startDate: startDate || 'Beginning',
      endDate: endDate || new Date().toISOString()
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
 * Calculate Budget Report dynamically from Budgets and posted Journal Items
 */
const getBudgetReport = async ({ period } = {}) => {
  const filter = {};
  if (period) filter.period = period;

  const budgets = await Budget.find(filter).populate('analyticAccount', 'name code type');

  // Find all posted journal entries with analytic accounts
  const postedEntries = await JournalEntry.find({ status: 'posted' });

  // Map actual spending/earnings per analytic account
  const actualsMap = {};
  for (const entry of postedEntries) {
    for (const item of entry.items) {
      if (item.analyticAccount) {
        const key = item.analyticAccount.toString();
        if (!actualsMap[key]) actualsMap[key] = 0;
        // If debit, it's expense (+debit), if credit, it's income
        const amount = (Number(item.debit) || 0) + (Number(item.credit) || 0);
        actualsMap[key] += amount;
      }
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

module.exports = {
  getProfitAndLossReport,
  getBalanceSheetReport,
  getBudgetReport
};
