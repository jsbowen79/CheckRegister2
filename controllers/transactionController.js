const UserDataError = require('../errors/userDataError.js');

const {
  getOneTransaction,
  getAllTransactions,
  createNewTransaction,
  updateTransactionEntry,
  deleteTransactionFromDatabase,
} = require('../models/transaction.js');

async function getAll(req, res) {
  const response = await getAllTransactions();
  res.json(response);
}

async function getSingleTransaction(req, res) {
  const transactionId = req.params.transactionId;
  const response = await getOneTransaction(transactionId);
  res.json(response);
}

async function createTransaction(req, res) {
  const amount = Number(req.body.amount);
  const transMedia = req.body.transMedia;
  let transMemo = req.body.transMemo || null;
  const category = req.body.category;
  const accountId = Number(req.body.accountId);
  const transType = req.body.transType;
  const date = req.body.date;
  const status = req.body.status;
  const endingBalance = Number(req.body.endingBalance);

  if (
    amount &&
    transMedia &&
    category &&
    accountId &&
    transType &&
    date &&
    status &&
    endingBalance != undefined
  ) {
    const entry = {
      amount,
      transMedia,
      transMemo,
      category,
      accountId,
      transType,
      date,
      status,
      endingBalance,
    };

    const response = await createNewTransaction(entry);
    res.json(response);
  } else {
    throw new UserDataError(
      'Please provide information for a complete Transaction.'
    );
  }
}

async function updateTransaction(req, res) {
  const updates = { ...req.body };
  if (updates.accountId !== undefined) {
    updates.accountId = Number(updates.accountId);
  }
  if (updates.amount !== undefined) {
    updates.amount = Number(updates.amount);
  }
  if (updates.endingBalance !== undefined) {
    updates.endingBalance = Number(updates.endingBalance);
  }

  const transactionId = req.params.transactionId;
  const result = await updateTransactionEntry(transactionId, updates);
  res.json(result);
}

async function deleteTransaction(req, res) {
  if (!req.params.transactionId) {
    throw new UserDataError(
      'A Transaction Id is required to delete a transaction.'
    );
  } else {
    const transactionId = req.params.transactionId;
    const results = await deleteTransactionFromDatabase(transactionId);
    res.json(results);
  }
}

module.exports = {
  getAll,
  getSingleTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
