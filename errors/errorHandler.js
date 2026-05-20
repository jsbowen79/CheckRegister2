const AppError = require('./appError.js');
function errorHandler(err, req, res) {
  console.error(err);
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  res.status(500).json({
    error: 'Internal Server Error',
  });
}

module.exports = errorHandler;
