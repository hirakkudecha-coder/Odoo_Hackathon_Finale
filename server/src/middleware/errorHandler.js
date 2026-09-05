// Centralized Error Handling Middleware

const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode;

  if (statusCode === 200 || !statusCode) {
    if (
      err.name === 'ValidationError' ||
      err.name === 'CastError' ||
      err.code === 11000 ||
      (err.message && (
        err.message.includes('validation failed') ||
        err.message.includes('Double-entry') ||
        err.message.includes('Unbalanced Journal Entry') ||
        err.message.includes('greater than zero') ||
        err.message.includes('already exists')
      ))
    ) {
      statusCode = 400;
    } else if (err.message && err.message.includes('not found')) {
      statusCode = 404;
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

