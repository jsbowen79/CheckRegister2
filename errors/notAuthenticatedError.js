const AppError = require('./appError.js');

class NotAuthenticatedError extends AppError {
  resource = null;
  constructor(message, resource) {
    super(message, 401);
    this.resource = resource;
  }
}

module.exports = NotAuthenticatedError;
