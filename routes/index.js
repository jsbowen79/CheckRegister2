const routes = require('express').Router();
const asyncHandler = require('../errors/asyncHandler.js');
const authenticate = require('../validators/authenticate.js');

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
  authenticate,
  validAccountRules(),
  validateNew,
  asyncHandler(createAccount)
);
routes.put(
  '/account/:accountId',
  authenticate,
  validAccountRules(),
  validateNew,
  asyncHandler(updateAccount)
);
routes.delete('/account/:accountId', authenticate, asyncHandler(deleteAccount));

routes.get('/transaction', asyncHandler(getAll));
routes.get('/transaction/:transactionId', asyncHandler(getSingleTransaction));
routes.post(
  '/transaction',
  authenticate,
  validTransactionRules(),
  validateNewTransaction,
  asyncHandler(createTransaction)
);
routes.put(
  '/transaction/:transactionId',
  authenticate,
  validTransactionRules(),
  validateNewTransaction,
  asyncHandler(updateTransaction)
);
routes.delete(
  '/transaction/:transactionId',
  authenticate,
  asyncHandler(deleteTransaction)
);

routes.get('/auth/test', (req, res) => {
  res.json({
    authenticated: req.isAuthenticated(),
    user: req.user,
    session: req.session,
  });
});

module.exports = routes;
