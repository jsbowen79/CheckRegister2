const AppError = require('./appError.js');

class UserDataError extends AppError {
  resource = null;
  constructor(message, resource) {
    super(message, 400);
    this.resource = resource;
  }
}

module.exports = UserDataError;
