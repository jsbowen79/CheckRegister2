const { body, validationResult } = require('express-validator');
const ValidationError = require('../errors/validationError');

const validTransactionRules = () => {
  return [
    body('amount')
      .optional()
      .isNumeric()
      .withMessage('Amount must be numeric.')
      .trim()
      .escape()
      .bail(),

    body('endingBalance')
      .optional()
      .isNumeric()
      .withMessage('Ending Balance must be numeric.')
      .trim()
      .escape()
      .bail(),

    body('transMedia')
      .optional()
      .isAlpha()
      .withMessage('TransMedia can only contain letters.')
      .trim()
      .escape()
      .bail(),

    body('transMemo').trim().escape().bail(),

    body('category')
      .optional()
      .isAlpha()
      .withMessage('Category can only contain letters.')
      .trim()
      .escape()
      .bail(),

    body('transType')
      .optional()
      .isAlpha()
      .withMessage('TransType can only contain letters')
      .trim()
      .escape()
      .bail(),

    body('status')
      .optional()
      .isAlpha()
      .withMessage('Status can only contain letters.')
      .trim()
      .escape()
      .bail(),

    body('accountId')
      .optional()
      .isInt()
      .withMessage('Account ids must be integers. ')
      .trim()
      .escape()
      .bail(),

    body('date')
      .optional()
      .custom((value) => {
        const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;

        if (!dateRegex.test(value)) {
          throw new ValidationError('Date must be in mm/dd/yyyy format.');
        }
        const [month, day, year] = value.split('/');
        const date = new Date(Number(year), Number(month) - 1, Number(day));

        if (
          date.getFullYear() !== Number(year) ||
          date.getMonth() + 1 !== Number(month) ||
          date.getDate() !== Number(day)
        ) {
          throw new ValidationError('Please enter a valid date.');
        }

        console.log('Rules loaded');
        return true;
      }),
  ];
};

const validateNewTransaction = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    console.log('errors empty');
    return next();
  }
  console.log('Errors found');
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));
  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  validTransactionRules,
  validateNewTransaction,
};
