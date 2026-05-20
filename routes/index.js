const routes = require('express').Router();
const asyncHandler = require('../errors/asyncHandler.js');

const {
  validAccountRules,
  validateNew,
} = require('../validators/accountValidators.js');

const {
  validTransactionRules,
  validateNewTransaction,
} = require('../validators/transactionValidators.js');

const {
  getAllAccounts,
  getSingleAccount,
  createAccount,
  updateAccount,
  deleteAccount,
} = require('../controllers/accountController.js');

const {
  getAll,
  getSingleTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController.js');

routes.get('/account', asyncHandler(getAllAccounts));
routes.get('/account/:accountId', asyncHandler(getSingleAccount));
routes.post(
  '/account',
  validAccountRules(),
  validateNew,
  asyncHandler(createAccount)
);
routes.put(
  '/account/:accountId',
  validAccountRules(),
  validateNew,
  asyncHandler(updateAccount)
);
routes.delete('/account/:accountId', asyncHandler(deleteAccount));

routes.get('/transaction', asyncHandler(getAll));
routes.get('/transaction/:transactionId', asyncHandler(getSingleTransaction));
routes.post(
  '/transaction',
  validTransactionRules(),
  validateNewTransaction,
  asyncHandler(createTransaction)
);
routes.put(
  '/transaction/:transactionId',
  validTransactionRules(),
  validateNewTransaction,
  asyncHandler(updateTransaction)
);
routes.delete('/transaction/:transactionId', asyncHandler(deleteTransaction));

module.exports = routes;
