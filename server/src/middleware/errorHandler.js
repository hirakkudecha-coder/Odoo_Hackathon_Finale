// Centralized Error Handling Middleware

const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || (res.statusCode && res.statusCode !== 200 ? res.statusCode : null);

  if (!statusCode) {
    if (
      err.name === 'ValidationError' ||
      err.name === 'CastError' ||
      err.code === 11000 ||
      (err.message && (
        err.message.includes('validation failed') ||
        err.message.includes('Double-entry') ||
        err.message.includes('Unbalanced Journal Entry') ||
        err.message.includes('greater than zero') ||
        err.message.includes('already exists') ||
        err.message.includes('already posted') ||
        err.message.includes('Cannot post') ||
        err.message.includes('Cannot cancel') ||
        err.message.includes('Cannot modify') ||
        err.message.includes('Cannot delete') ||
        err.message.includes('must be') ||
        err.message.includes('required') ||
        err.message.includes('exceeds')
      ))
    ) {
      statusCode = 400;
    } else if (err.message && err.message.toLowerCase().includes('not found')) {
      statusCode = 404;
    } else if (err.message && (err.message.includes('CORS blocked') || err.message.includes('CSRF'))) {
      statusCode = 403;
    } else {
      statusCode = 500;
    }
  }

  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  res.status(statusCode).json(response);
};

module.exports = {
  notFoundHandler,
  errorHandler
};

