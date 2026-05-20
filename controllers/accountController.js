const UserDataError = require('../errors/userDataError.js');

const {
  getOne,
  getAll,
  createNewAccount,
  updateDatabaseEntry,
  deleteFromDatabase,
} = require('../models/account.js');

async function getAllAccounts(req, res) {
  const response = await getAll();
  res.json(response);
}

async function getSingleAccount(req, res) {
  const accountId = Number(req.params.accountId);
  const response = await getOne(accountId);
  res.json(response);
}

async function createAccount(req, res) {
  let _balance = Number(req.body._balance) || null;
  let _pendingBalance = Number(req.body._pendingBalance) || null;
  let currencyType = req.body.currencyType || null;
  let accountStatus = req.body.accountStatus || null;
  let createdAt = req.body.createdAt || null;
  const accountId = Number(req.body.accountId);
  const accountName = req.body.accountName;
  const type = req.body.type;
  const owner = req.body.owner;
  const accountNumber = Number(req.body.accountNumber);

  if (accountNumber && owner && type && accountName && accountId) {
    if (!_balance) _balance = 0;
    if (!_pendingBalance) _pendingBalance = 0;
    if (!currencyType) currencyType = 'USD';
    if (!accountStatus) accountStatus = 'Open';
    if (!createdAt)
      createdAt = new Date().toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      });

    const entry = {
      _balance,
      _pendingBalance,
      currencyType,
      accountStatus,
      createdAt,
      accountId,
      accountName,
      type,
      owner,
      accountNumber,
    };
    const response = await createNewAccount(entry);
    res.json(response);
  } else {
    throw new UserDataError(
      'Please provide at least the account number, owner, type, name, and id.'
    );
  }
}

async function updateAccount(req, res) {
  if (!req.params.accountId) {
    throw new UserDataError(
      'An account Id is required to update account information.'
    );
  }
  const updates = { ...req.body };
  if (updates.accountId !== undefined) {
    updates.accountId = Number(updates.accountId);
  }
  if (updates.accountNumber !== undefined) {
    updates.accountNumber = Number(updates.accountNumber);
  }
  if (updates._balance !== undefined) {
    updates._balance = Number(updates._balance);
  }
  if (updates._pendingBalance !== undefined) {
    updates._pendingBalance = Number(updates._pendingBalance);
  }

  const accountId = Number(req.params.accountId);
  const result = await updateDatabaseEntry(accountId, updates);
  res.json(result);
}

async function deleteAccount(req, res) {
  if (!req.params.accountId) {
    throw new UserDataError(
      'An account Id is required to delete account information.'
    );
  } else {
    const accountId = Number(req.params.accountId);
    const results = await deleteFromDatabase(accountId);
    res.json(results);
  }
}

module.exports = {
  getAllAccounts,
  getSingleAccount,
  createAccount,
  updateAccount,
  deleteAccount,
};
