const AppError = require('./appError.js');

class NotFoundError extends AppError {
  resource = null;
  constructor(message, resource) {
    super(message, 404);
    this.resource = resource;
  }
}

module.exports = NotFoundError;
