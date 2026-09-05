const {
  getProfitAndLossReport,
  getBalanceSheetReport,
  getBudgetReport,
  getStockValuationReport
} = require('../services/reportService');

// Profit & Loss Report
const getProfitAndLoss = async (req, res, next) => {
  try {
    const report = await getProfitAndLossReport(req.query);
    res.status(200).json({
      success: true,
      report
    });
  } catch (error) {
    next(error);
  }
};

// Balance Sheet Report
const getBalanceSheet = async (req, res, next) => {
  try {
    const report = await getBalanceSheetReport(req.query);
    res.status(200).json({
      success: true,
      report
    });
  } catch (error) {
    next(error);
  }
};

// Budget Report
const getBudgetSummary = async (req, res, next) => {
  try {
    const report = await getBudgetReport(req.query);
    res.status(200).json({
      success: true,
      report
    });
  } catch (error) {
    next(error);
  }
};

// Stock / Inventory Valuation Report
const getStockValuation = async (req, res, next) => {
  try {
    const report = await getStockValuationReport(req.query);
    res.status(200).json({
      success: true,
      report
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfitAndLoss,
  getBalanceSheet,
  getBudgetSummary,
  getStockValuation
};
