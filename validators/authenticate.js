const NotAuthenticatedError = require('../errors/notAuthenticatedError');

function authenticate(req, res, next) {
  console.log('Authenticating', req.isAuthenticated());
  console.log('req.user: ', req.user);
  if (req.isAuthenticated()) {
    next();
  } else {
    throw new NotAuthenticatedError(
      'Authentication is required for this operation.  Please log in.'
    );
  }
}

module.exports = authenticate;
