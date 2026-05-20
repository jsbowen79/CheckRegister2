const AppError = require('./appError');

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

module.exports = ValidationError;
