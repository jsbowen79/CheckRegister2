const { body, validationResult } = require('express-validator');
const ValidationError = require('../errors/validationError.js');

const validAccountRules = () => {
  return [
    body('_balance')
      .optional()
      .isNumeric()
      .withMessage('Balances may only contain numbers.')
      .trim()
      .escape()
      .bail(),

    body('_pendingBalance')
      .optional()
      .isNumeric()
      .withMessage('Balances may only contain numbers.')
      .trim()
      .escape()
      .bail(),

    body('currencyType', 'Currency Type can only contain letters.')
      .optional()
      .isAlpha()
      .trim()
      .escape()
      .bail(),

    body('accountStatus', 'Account Status can only contain letters.')
      .optional()
      .isAlpha()
      .trim()
      .escape()
      .bail(),

    body('accountNumber', 'Account number must me an integer.')
      .optional()
      .isInt()
      .trim()
      .escape()
      .bail(),

    body('accountId', 'Account id must be an integer.')
      .optional()
      .isInt()
      .trim()
      .escape()
      .bail(),

    body('accountName')
      .optional()
      .isAlpha()
      .withMessage('Account name can only contain letters')
      .trim()
      .escape()
      .bail(),

    body('accountType')
      .optional()
      .isAlpha()
      .withMessage('Account type can only contain letters')
      .trim()
      .escape()
      .bail(),

    body('owner')
      .optional()
      .isAlpha()
      .withMessage('Owner can only contain letters')
      .trim()
      .escape()
      .bail(),

    body('createdAt')
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

        return true;
      }),
  ];
};

const validateNew = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));
  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  validAccountRules,
  validateNew,
};
