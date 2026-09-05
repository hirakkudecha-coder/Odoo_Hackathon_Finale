const JournalEntry = require('../models/JournalEntry');
const Account = require('../models/Account');

/**
 * Validate that an entry is balanced: Total Debit === Total Credit > 0
 */
const validateDoubleEntry = (items) => {
  if (!items || items.length < 2) {
    throw new Error('Double-entry accounting requires at least 2 journal items.');
  }

  const totalDebit = Math.round(items.reduce((sum, item) => sum + (Number(item.debit) || 0), 0) * 100) / 100;
  const totalCredit = Math.round(items.reduce((sum, item) => sum + (Number(item.credit) || 0), 0) * 100) / 100;

  if (totalDebit <= 0) {
    throw new Error('Journal entry total amount must be greater than zero.');
  }

  if (Math.abs(totalDebit - totalCredit) > 0.001) {
    throw new Error(
      `Unbalanced Journal Entry: Total Debit (${totalDebit.toFixed(2)}) must equal Total Credit (${totalCredit.toFixed(2)}).`
    );
  }

  return { totalDebit, totalCredit };
};

/**
 * Update Account balance according to normal accounting rules:
 * - Asset / Expense: Normal Debit (+Debit, -Credit)
 * - Liability / Income / Capital: Normal Credit (+Credit, -Debit)
 */
const updateAccountBalance = async (accountId, debit, credit, isReversal = false) => {
  const account = await Account.findById(accountId);
  if (!account) {
    throw new Error(`Account with ID ${accountId} not found.`);
  }

  const d = Number(debit) || 0;
  const c = Number(credit) || 0;

  let delta = 0;
  if (['Asset', 'Expense'].includes(account.type)) {
    delta = d - c;
  } else {
    // Liability, Income, Capital
    delta = c - d;
  }

  if (isReversal) {
    delta = -delta;
  }

  account.balance = Math.round((account.balance + delta) * 100) / 100;
  await account.save();
  return account;
};

/**
 * Post a Journal Entry and update account ledger balances
 */
const postJournalEntry = async (entryId, userId = null) => {
  const entry = await JournalEntry.findById(entryId);
  if (!entry) {
    throw new Error('Journal entry not found.');
  }

  if (entry.status === 'posted') {
    throw new Error('Journal entry is already posted.');
  }

  if (entry.status === 'cancelled') {
    throw new Error('Cannot post a cancelled journal entry.');
  }

  // Validate Debit = Credit
  const { totalDebit, totalCredit } = validateDoubleEntry(entry.items);

  // Update Account balances
  for (const item of entry.items) {
    await updateAccountBalance(item.account, item.debit, item.credit, false);
  }

  entry.totalDebit = totalDebit;
  entry.totalCredit = totalCredit;
  entry.status = 'posted';
  entry.postedAt = new Date();
  if (userId) entry.postedBy = userId;

  await entry.save();
  return entry;
};

/**
 * Cancel a posted Journal Entry and reverse ledger impacts
 */
const cancelJournalEntry = async (entryId, userId = null) => {
  const entry = await JournalEntry.findById(entryId);
  if (!entry) {
    throw new Error('Journal entry not found.');
  }

  if (entry.status !== 'posted') {
    entry.status = 'cancelled';
    await entry.save();
    return entry;
  }

  // Reverse account balances
  for (const item of entry.items) {
    await updateAccountBalance(item.account, item.debit, item.credit, true);
  }

  entry.status = 'cancelled';
  await entry.save();
  return entry;
};

/**
 * Helper to create and immediately post a Journal Entry (used by Bills, Invoices, Payments)
 */
const createAndPostEntry = async ({
  journalId,
  date = new Date(),
  reference = '',
  partnerId = null,
  items = [],
  userId = null
}) => {
  // Validate Debit = Credit first
  const { totalDebit, totalCredit } = validateDoubleEntry(items);

  const entry = new JournalEntry({
    journal: journalId,
    date,
    reference,
    partner: partnerId,
    items,
    totalDebit,
    totalCredit,
    status: 'draft'
  });

  await entry.save();

  // Post it
  return await postJournalEntry(entry._id, userId);
};

module.exports = {
  validateDoubleEntry,
  updateAccountBalance,
  postJournalEntry,
  cancelJournalEntry,
  createAndPostEntry
};
