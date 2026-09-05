const mongoose = require('mongoose');
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
 * Update Account balance atomically using $inc according to normal accounting rules:
 * - Asset / Expense: Normal Debit (+Debit, -Credit)
 * - Liability / Income / Capital: Normal Credit (+Credit, -Debit)
 */
const updateAccountBalance = async (accountId, debit, credit, isReversal = false, session = null) => {
  const query = Account.findById(accountId);
  if (session) query.session(session);
  const account = await query;
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

  delta = Math.round(delta * 100) / 100;

  const updateOpts = { new: true };
  if (session) updateOpts.session = session;

  const updatedAccount = await Account.findByIdAndUpdate(
    accountId,
    { $inc: { balance: delta } },
    updateOpts
  );

  return updatedAccount;
};

const _executePost = async (entryId, userId, session) => {
  const query = JournalEntry.findById(entryId);
  if (session) query.session(session);
  const entry = await query;

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

  // Update Account balances atomically
  for (const item of entry.items) {
    await updateAccountBalance(item.account, item.debit, item.credit, false, session);
  }

  entry.totalDebit = totalDebit;
  entry.totalCredit = totalCredit;
  entry.status = 'posted';
  entry.postedAt = new Date();
  if (userId) entry.postedBy = userId;

  const saveOpts = session ? { session } : {};
  await entry.save(saveOpts);
  return entry;
};

const _executeCancel = async (entryId, userId, session) => {
  const query = JournalEntry.findById(entryId);
  if (session) query.session(session);
  const entry = await query;

  if (!entry) {
    throw new Error('Journal entry not found.');
  }

  if (entry.status !== 'posted') {
    entry.status = 'cancelled';
    const saveOpts = session ? { session } : {};
    await entry.save(saveOpts);
    return entry;
  }

  // Reverse account balances atomically
  for (const item of entry.items) {
    await updateAccountBalance(item.account, item.debit, item.credit, true, session);
  }

  entry.status = 'cancelled';
  const saveOpts = session ? { session } : {};
  await entry.save(saveOpts);
  return entry;
};

/**
 * Executes a function within a MongoDB session/transaction if supported by the MongoDB topology,
 * or directly if running on a standalone mongod instance.
 */
const runInTransaction = async (workFn) => {
  const isReplicaSet = Boolean(
    mongoose.connection.client?.topology?.description?.type === 'ReplicaSetWithPrimary' ||
    mongoose.connection.client?.topology?.description?.type === 'Sharded' ||
    mongoose.connection.client?.topology?.description?.servers?.size > 1
  );

  if (!isReplicaSet) {
    return await workFn(null);
  }

  const session = await mongoose.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      result = await workFn(session);
    });
    return result;
  } catch (err) {
    if (err.message && err.message.includes('Transaction numbers are only allowed on a replica set member')) {
      return await workFn(null);
    }
    throw err;
  } finally {
    await session.endSession();
  }
};

/**
 * Post a Journal Entry in an ACID transaction
 */
const postJournalEntry = async (entryId, userId = null, existingSession = null) => {
  if (existingSession) {
    return await _executePost(entryId, userId, existingSession);
  }

  return await runInTransaction(async (session) => {
    return await _executePost(entryId, userId, session);
  });
};

/**
 * Cancel a posted Journal Entry in an ACID transaction
 */
const cancelJournalEntry = async (entryId, userId = null, existingSession = null) => {
  if (existingSession) {
    return await _executeCancel(entryId, userId, existingSession);
  }

  return await runInTransaction(async (session) => {
    return await _executeCancel(entryId, userId, session);
  });
};

/**
 * Helper to create and immediately post a Journal Entry in a single transaction
 */
const createAndPostEntry = async ({
  journalId,
  date = new Date(),
  reference = '',
  partnerId = null,
  items = [],
  userId = null,
  existingSession = null
}) => {
  const { totalDebit, totalCredit } = validateDoubleEntry(items);

  const runner = async (session) => {
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

    const saveOpts = session ? { session } : {};
    await entry.save(saveOpts);

    return await _executePost(entry._id, userId, session);
  };

  if (existingSession) {
    return await runner(existingSession);
  }

  return await runInTransaction(async (session) => {
    return await runner(session);
  });
};

module.exports = {
  validateDoubleEntry,
  updateAccountBalance,
  postJournalEntry,
  cancelJournalEntry,
  createAndPostEntry
};
